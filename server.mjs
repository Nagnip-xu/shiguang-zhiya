import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import multer from 'multer'
import { createServer as createViteServer } from 'vite'

dotenv.config({ path: '.env.local' })
dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isPreview = process.argv.includes('--preview')
const port = Number(process.env.PORT || 5173)
const baseUrl = String(process.env.IMAGE_API_BASE_URL || 'https://api.shuaiapi.com/v1').replace(/\/$/, '')
const apiKey = process.env.IMAGE_API_KEY || ''
const model = process.env.IMAGE_MODEL || 'gpt-image-2.5'
const DEFAULT_TRY_ON_PROMPT = '请把第二张图片中的美甲款式自然地应用到第一张图片的手部指甲上。保持第一张图中的手型、手指姿势、肤色、光线、背景和构图完全不变，只修改指甲区域。生成真实、细腻、适合美甲店展示的试戴效果，不要改变手指数量，不要添加文字或饰品。'
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 2, fileSize: 10 * 1024 * 1024 },
})

const app = express()
app.use(express.json({ limit: '256kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: Boolean(apiKey), provider: 'image-edit', configured: Boolean(apiKey) })
})

app.post('/api/try-on', upload.fields([{ name: 'hand', maxCount: 1 }, { name: 'reference', maxCount: 1 }]), async (req, res) => {
  const hand = req.files?.hand?.[0]
  const reference = req.files?.reference?.[0]
  if (!hand || !reference) return res.status(400).json({ error: '请同时上传手部照片和参考美甲图片' })
  if (!apiKey) return res.status(503).json({ error: '服务端还没有配置图片生成密钥' })

  const prompt = req.body.prompt || DEFAULT_TRY_ON_PROMPT
  const details = `甲面长度：${req.body.length || '中等'}；表面质感：${req.body.finish || '镜面'}。`
  const form = new FormData()
  form.append('model', model)
  form.append('prompt', `${prompt} ${details}`)
  form.append('size', '1024x1024')
  form.append('quality', 'high')
  form.append('image[]', new Blob([hand.buffer], { type: hand.mimetype }), hand.originalname)
  form.append('image[]', new Blob([reference.buffer], { type: reference.mimetype }), reference.originalname)

  try {
    const upstream = await fetch(`${baseUrl}/images/edits`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    })
    const payload = await upstream.json().catch(() => ({}))
    if (!upstream.ok) {
      const providerMessage = payload?.error?.message || payload?.message || '上游图片服务返回错误'
      return res.status(upstream.status >= 500 ? 502 : upstream.status).json({ error: `图片生成失败：${providerMessage}` })
    }
    const item = payload?.data?.[0]
    if (!item) return res.status(502).json({ error: '图片服务没有返回生成结果' })
    const imageUrl = item.url || (item.b64_json ? `data:image/png;base64,${item.b64_json}` : '')
    if (!imageUrl) return res.status(502).json({ error: '图片服务返回格式暂不支持' })
    return res.json({ imageUrl, provider: 'image-edit' })
  } catch (error) {
    console.error('[try-on]', error instanceof Error ? error.message : error)
    return res.status(502).json({ error: '无法连接图片生成服务，请稍后重试' })
  }
})

if (isPreview) {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get(/.*/, (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')))
} else {
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' })
  app.use(vite.middlewares)
}

app.listen(port, () => {
  console.log(`拾光指屿已启动：http://localhost:${port}`)
  console.log(`图片接口：${baseUrl}/images/edits · ${apiKey ? '已配置密钥' : '未配置密钥'}`)
})
