# 拾光指屿

AI 美甲试戴工作台。上传手部照片和参考美甲照片，生成保持手型、姿势、肤色与背景不变的试戴效果，并支持原图、参考图和生成结果对比查看。

## 功能

- 手部照片与参考款式照片上传、预览和替换
- 内置四张真实美甲参考图
- 美甲长度、质感和提示词调整
- 原图 / 参考图 / 生成结果对比展示
- 通过服务端代理调用兼容 OpenAI Images API，避免前端暴露密钥
- 移动端适配

## 技术栈

Vue 3、TypeScript、Vite、Express、Multer。

## 本地运行

```bash
npm install
npm run dev
```

启动后访问 `http://localhost:5173`。

复制 `.env.example` 为 `.env.local`，填写服务端配置：

```env
IMAGE_API_BASE_URL=https://api.shuaiapi.com/v1
IMAGE_API_KEY=你的_API_Key
IMAGE_MODEL=gpt-image-2.5
```

API 密钥只放在 `.env.local`，不要提交到 GitHub。生成接口由本地 Express 代理转发到 `/images/edits`。

## 项目结构

- `src/`：Vue 前端界面与交互
- `server.mjs`：开发服务器与图像生成 API 代理
- `public/images/`：默认参考款式图片
- `images/`：项目原始图片素材

## 默认提示词

> 请把第二张图片中的美甲款式自然地应用到第一张图片的手部指甲上。保持第一张图中的手型、手指姿势、肤色、光线、背景和构图完全不变，只修改指甲区域。生成真实、细腻、适合美甲店展示的试戴效果，不要改变手指数量，不要添加文字或饰品。

## 安全说明

本项目默认使用公开 GitHub 仓库时，请确认 `.env.local` 未被提交。若 API 密钥曾在聊天、截图或日志中出现，建议测试完成后在服务商后台轮换密钥。
