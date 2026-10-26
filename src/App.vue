<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref, type PropType } from 'vue'

type IconName = 'arrow' | 'check' | 'download' | 'spark' | 'upload' | 'x' | 'bookmark' | 'refresh' | 'chevron' | 'info' | 'lock'

const DEFAULT_TRY_ON_PROMPT = '请把第二张图片中的美甲款式自然地应用到第一张图片的手部指甲上。保持第一张图中的手型、手指姿势、肤色、光线、背景和构图完全不变，只修改指甲区域。生成真实、细腻、适合美甲店展示的试戴效果，不要改变手指数量，不要添加文字或饰品。'

const iconPaths: Record<IconName, string> = {
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  check: 'm5 12 4 4L19 6',
  download: 'M12 4v11m0 0 4-4m-4 4-4-4M5 20h14',
  spark: 'm12 3 1.6 6.4L20 11l-6.4 1.6L12 19l-1.6-6.4L4 11l6.4-1.6L12 3Z',
  upload: 'M12 15V4m0 0 4 4m-4-4L8 8M5 14v4h14v-4',
  x: 'm6 6 12 12M18 6 6 18',
  bookmark: 'M6 4h12v16l-6-3-6 3V4Z',
  refresh: 'M20 11a8 8 0 0 0-14.9-3M4 5v4h4m-4 4a8 8 0 0 0 14.9 3M20 19v-4h-4',
  chevron: 'm8 10 4 4 4-4',
  info: 'M12 16v-4m0-4h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  lock: 'M7 10V8a5 5 0 0 1 10 0v2m-11 0h12v9H6v-9Z',
}

const Icon = defineComponent({
  name: 'UiIcon',
  props: { name: { type: String as PropType<IconName>, required: true } },
  setup(props) {
    return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [h('path', { d: iconPaths[props.name] })])
  },
})

const handImage = ref('')
const referenceImage = ref('/images/冰透系爆闪碎钻.jpg')
const resultImage = ref('')
const handFile = ref<File | null>(null)
const referenceFile = ref<File | null>(null)
const handFileName = ref('还没有上传手部照片')
const referenceFileName = ref('冰透系爆闪碎钻 · 默认参考')
const stage = ref<'ready' | 'idle' | 'generating' | 'error'>('idle')
const progress = ref(0)
const errorMessage = ref('')
const toast = ref('')
const saved = ref(false)
const activeTab = ref<'split' | 'before' | 'after'>('split')
const splitPosition = ref(56)
const comparisonStage = ref<HTMLElement | null>(null)
const isDraggingSplit = ref(false)
const generationTimer = ref<number | null>(null)
const selectedLength = ref('中等')
const selectedFinish = ref('镜面')
const selectedPreset = ref('冰透碎钻')
const apiStatus = ref<'checking' | 'ready' | 'offline'>('checking')

const presets = [
  { name: '冰透碎钻', detail: '透明感 · 细闪', image: '/images/冰透系爆闪碎钻.jpg' },
  { name: '海盐冰气泡', detail: '冰蓝色 · 清透', image: '/images/海盐冰气泡.jpg' },
  { name: '绿色奶芙芙', detail: '鼠尾草绿 · 花朵', image: '/images/绿色奶芙芙指匠.jpg' },
  { name: '仙气蝴蝶', detail: '裸粉色 · 蝴蝶饰', image: '/images/仙气蝴蝶.jpg' },
]

const isRealInput = computed(() => Boolean(handFile.value && referenceFile.value))
const isReady = computed(() => stage.value === 'ready')
const buttonLabel = computed(() => {
  if (stage.value === 'generating') return '正在生成试戴效果…'
  return isRealInput.value ? '生成真实试戴效果' : '请先上传两张图片'
})
const statusLabel = computed(() => {
  if (stage.value === 'generating') return `正在处理 · ${progress.value}%`
  if (stage.value === 'error') return '生成失败'
  if (isRealInput.value) return 'AI 试戴结果'
  return '等待生成'
})

function notify(message: string) {
  toast.value = message
  window.setTimeout(() => { toast.value = '' }, 2600)
}

function clearGenerationTimer() {
  if (generationTimer.value) window.clearInterval(generationTimer.value)
  generationTimer.value = null
}

function handleFile(event: Event, type: 'hand' | 'reference') {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    notify('图片不能超过 10MB')
    input.value = ''
    return
  }
  const url = URL.createObjectURL(file)
  if (type === 'hand') {
    handImage.value = url
    handFile.value = file
    handFileName.value = file.name
  } else {
    referenceImage.value = url
    referenceFile.value = file
    referenceFileName.value = file.name
  }
  stage.value = 'idle'
  errorMessage.value = ''
  notify(type === 'hand' ? '已添加手部照片' : '已添加参考款式')
}

function clearImage(type: 'hand' | 'reference') {
  if (type === 'hand') {
    handImage.value = ''
    handFile.value = null
    handFileName.value = '还没有上传手部照片'
  } else {
    referenceImage.value = ''
    referenceFile.value = null
    referenceFileName.value = '还没有选择参考款式'
  }
  stage.value = 'idle'
}

async function pickPreset(preset: typeof presets[number]) {
  selectedPreset.value = preset.name
  referenceImage.value = preset.image
  referenceFileName.value = `${preset.name} · 内置参考`
  try {
    const response = await fetch(preset.image)
    const blob = await response.blob()
    referenceFile.value = new File([blob], `${preset.name}.svg`, { type: blob.type || 'image/svg+xml' })
  } catch {
    referenceFile.value = null
  }
  stage.value = 'idle'
  notify(`已选择「${preset.name}」`)
}

async function loadDefaultReference() {
  try {
    const response = await fetch('/images/冰透系爆闪碎钻.jpg')
    const blob = await response.blob()
    referenceFile.value = new File([blob], '冰透系爆闪碎钻.jpg', { type: blob.type || 'image/jpeg' })
  } catch {
    referenceFile.value = null
  }
}

function beginProgress() {
  clearGenerationTimer()
  progress.value = 7
  generationTimer.value = window.setInterval(() => {
    progress.value = Math.min(88, progress.value + Math.ceil(Math.random() * 8))
  }, 280)
}

function finishProgress() {
  clearGenerationTimer()
  progress.value = 100
}

async function generateWithApi() {
  const form = new FormData()
  form.append('hand', handFile.value as File, handFile.value?.name || 'hand.jpg')
  form.append('reference', referenceFile.value as File, referenceFile.value?.name || 'reference.jpg')
  form.append('length', selectedLength.value)
  form.append('finish', selectedFinish.value)
  form.append('prompt', DEFAULT_TRY_ON_PROMPT)
  const response = await fetch('/api/try-on', { method: 'POST', body: form })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || '图片生成失败，请稍后再试')
  if (!payload.imageUrl) throw new Error('接口没有返回可用图片')
  resultImage.value = payload.imageUrl
  finishProgress()
  stage.value = 'ready'
  notify('AI 试戴完成，已保留你的手部特征')
}

async function generate() {
  if (stage.value === 'generating') return
  if (!isRealInput.value) {
    stage.value = 'error'
    errorMessage.value = '请先上传手部照片，并选择一张参考美甲图片'
    return
  }
  errorMessage.value = ''
  stage.value = 'generating'
  beginProgress()
  try {
    await generateWithApi()
  } catch (error) {
    finishProgress()
    stage.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : '生成失败，请检查图片后重试'
  }
}

function resetDemo() {
  clearGenerationTimer()
  handImage.value = ''
  referenceImage.value = '/images/冰透系爆闪碎钻.jpg'
  void loadDefaultReference()
  resultImage.value = ''
  handFile.value = null
  referenceFile.value = null
  handFileName.value = '还没有上传手部照片'
  referenceFileName.value = '冰透碎钻 · 默认参考'
  selectedPreset.value = '冰透碎钻'
  selectedLength.value = '中等'
  selectedFinish.value = '镜面'
  activeTab.value = 'split'
  splitPosition.value = 56
  saved.value = false
  progress.value = 0
  errorMessage.value = ''
  stage.value = 'idle'
  notify('已清空手部照片，保留默认参考')
}

function saveResult() {
  saved.value = !saved.value
  notify(saved.value ? '已保存到我的灵感' : '已从我的灵感移除')
}

function downloadResult() {
  if (!resultImage.value) {
    notify('生成结果后才能下载')
    return
  }
  const link = document.createElement('a')
  link.href = resultImage.value
  link.download = '拾光指屿试戴效果.png'
  link.click()
  notify('正在下载试戴效果')
}

function setSplitFromPointer(event: PointerEvent) {
  if (!comparisonStage.value || activeTab.value !== 'split') return
  const rect = comparisonStage.value.getBoundingClientRect()
  splitPosition.value = Math.max(8, Math.min(92, ((event.clientX - rect.left) / rect.width) * 100))
}

function startSplitDrag(event: PointerEvent) {
  if (activeTab.value !== 'split' || stage.value !== 'ready') return
  isDraggingSplit.value = true
  comparisonStage.value?.setPointerCapture(event.pointerId)
  setSplitFromPointer(event)
}

function dragSplit(event: PointerEvent) {
  if (isDraggingSplit.value) setSplitFromPointer(event)
}

function endSplitDrag() {
  isDraggingSplit.value = false
}

function nudgeSplit(amount: number) {
  splitPosition.value = Math.max(8, Math.min(92, splitPosition.value + amount))
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  await loadDefaultReference()
  try {
    const response = await fetch('/api/health')
    apiStatus.value = response.ok ? 'ready' : 'offline'
  } catch {
    apiStatus.value = 'offline'
  }
})
</script>

<template>
  <div class="site-shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="返回拾光指屿首页"><span class="brand-mark"><i></i><i></i><i></i></span><strong>拾光指屿</strong></a>
      <nav class="nav-links" aria-label="主导航"><a class="active" href="#top">开始试戴</a><a href="#inspiration">灵感款式</a><a href="#how-it-works">使用说明</a></nav>
      <div class="top-status"><span class="status-light" :class="apiStatus"></span>{{ apiStatus === 'ready' ? 'AI 服务已连接' : apiStatus === 'checking' ? '正在连接 AI' : '演示模式' }}</div>
    </header>

    <main id="top" class="page">
      <section class="hero">
        <div><p class="eyebrow">美甲试戴工具</p><h1>先试戴，<em>再决定。</em></h1><p class="hero-copy">上传你的手部照片，再放入一张喜欢的美甲参考图。AI 会保留你的手型和肤色，只替换指甲效果。</p></div>
        <div class="hero-note"><span class="note-icon"><Icon name="lock" /></span><div><strong>图片只为本次试戴使用</strong><small>真实图片通过服务端安全转发，不会暴露 API 密钥。</small></div></div>
      </section>

      <section class="progress-nav" aria-label="试戴流程"><div class="progress-step active"><span>1</span><div><strong>上传手部照片</strong><small>让效果贴合你的手</small></div></div><div class="progress-line"></div><div class="progress-step" :class="{ active: referenceFile }"><span>2</span><div><strong>选择参考款式</strong><small>可以上传或从灵感库选择</small></div></div><div class="progress-line"></div><div class="progress-step" :class="{ active: isReady }"><span>3</span><div><strong>查看试戴效果</strong><small>左右拖动，对比前后变化</small></div></div></section>

      <section class="studio" aria-label="试戴区域">
        <div class="sources-column">
          <article class="source-card">
            <div class="card-heading"><div><span class="step-tag">第一步</span><h2>你的手部照片</h2></div><button v-if="handImage" class="remove-button" aria-label="移除手部照片" title="移除手部照片" @click="clearImage('hand')"><Icon name="x" /></button></div>
            <label class="upload-frame" :class="{ empty: !handImage }"><img v-if="handImage" :src="handImage" alt="手部照片预览" /><span v-else class="empty-upload"><Icon name="upload" /><strong>点击上传手部照片</strong><small>建议选择光线自然、手指完整的照片</small></span><span v-if="handImage" class="image-badge">{{ handFile ? '已上传' : '参考图片' }}</span><input type="file" accept="image/*" @change="handleFile($event, 'hand')" /></label>
            <div class="file-row"><span>{{ handFileName }}</span><label class="replace-link">{{ handImage ? '更换照片' : '选择照片' }}<input type="file" accept="image/*" @change="handleFile($event, 'hand')" /></label></div>
          </article>

          <article class="source-card">
            <div class="card-heading"><div><span class="step-tag">第二步</span><h2>参考美甲款式</h2></div><button v-if="referenceImage" class="remove-button" aria-label="移除参考款式" title="移除参考款式" @click="clearImage('reference')"><Icon name="x" /></button></div>
            <label class="upload-frame reference-frame" :class="{ empty: !referenceImage }"><img v-if="referenceImage" :src="referenceImage" alt="参考美甲款式预览" /><span v-else class="empty-upload"><Icon name="upload" /><strong>上传一张喜欢的美甲图</strong><small>截图、作品图或设计稿都可以</small></span><span class="image-badge dark">{{ referenceFile ? '参考款式' : '默认参考' }}</span><input type="file" accept="image/*" @change="handleFile($event, 'reference')" /></label>
            <div class="file-row"><span>{{ referenceFileName }}</span><label class="replace-link">{{ referenceImage ? '更换款式' : '选择款式' }}<input type="file" accept="image/*" @change="handleFile($event, 'reference')" /></label></div>
          </article>
        </div>

        <article class="result-card">
          <div class="result-heading"><div><span class="step-tag">第三步</span><h2>试戴效果</h2></div><span class="result-status" :class="stage"><i></i>{{ statusLabel }}</span></div>
          <div v-if="stage === 'generating'" class="loading-panel"><div class="loading-orbit"><span></span><span></span><span></span></div><strong>{{ isRealInput ? '正在把款式贴合到你的指甲' : '正在处理图片' }}</strong><small>会保留手型、手指姿势和肤色，请稍等片刻</small><div class="loading-track"><span :style="{ transform: `scaleX(${progress / 100})` }"></span></div></div>
          <div v-else-if="stage === 'error'" class="error-panel"><span class="error-icon"><Icon name="info" /></span><strong>这次没有生成成功</strong><p>{{ errorMessage }}</p><button class="small-button" @click="generate">重新生成</button></div>
          <div v-else class="comparison-wrap"><div v-if="handImage && resultImage" ref="comparisonStage" class="comparison-stage" @pointerdown="startSplitDrag" @pointermove="dragSplit" @pointerup="endSplitDrag" @pointercancel="endSplitDrag"><img class="comparison-image" :src="handImage || ''" alt="原始手部照片" /><div v-if="activeTab !== 'before'" class="comparison-after" :style="{ clipPath: activeTab === 'after' ? 'inset(0)' : `inset(0 0 0 ${splitPosition}%)` }"><img class="comparison-image" :src="resultImage" alt="生成的试戴效果" /></div><div v-if="activeTab === 'split'" class="split-handle" role="slider" tabindex="0" aria-label="调整原图和试戴结果的分界线" aria-valuemin="8" aria-valuemax="92" :aria-valuenow="Math.round(splitPosition)" :style="{ left: `${splitPosition}%` }" @keydown.left.prevent="nudgeSplit(-2)" @keydown.right.prevent="nudgeSplit(2)"><span></span><b><Icon name="chevron" /></b></div><span class="image-label left">原图</span><span class="image-label right">{{ activeTab === 'before' ? '原图' : '试戴结果' }}</span></div><div v-else class="comparison-empty"><Icon name="spark" /><strong>上传手部照片后，在这里查看试戴结果</strong><small>你可以拖动分界线，对比原图和生成结果</small></div><div v-if="handImage && resultImage" class="compare-bar"><div class="tab-list" role="tablist" aria-label="切换对比视图"><button role="tab" :aria-selected="activeTab === 'split'" :class="{ selected: activeTab === 'split' }" @click="activeTab = 'split'">左右对比</button><button role="tab" :aria-selected="activeTab === 'before'" :class="{ selected: activeTab === 'before' }" @click="activeTab = 'before'">只看原图</button><button role="tab" :aria-selected="activeTab === 'after'" :class="{ selected: activeTab === 'after' }" @click="activeTab = 'after'">只看结果</button></div><label v-if="activeTab === 'split'" class="range-control"><span>原图</span><input v-model="splitPosition" type="range" min="8" max="92" aria-label="调整原图和结果的比例" /><span>结果</span></label><span v-else class="compare-tip">切换到左右对比查看细节</span></div></div>
          <div class="result-footer"><span><i></i> {{ isRealInput ? '真实 API 生成 · 原图不会被改动' : '上传两张图片后开始 AI 试戴' }}</span><div><button class="outline-button" :class="{ saved }" @click="saveResult"><Icon name="bookmark" />{{ saved ? '已保存' : '保存效果' }}</button><button class="outline-button" @click="downloadResult"><Icon name="download" />下载图片</button></div></div>
        </article>
      </section>

      <section class="adjustments"><div class="adjust-title"><span>生成前调整</span><small>不确定时保持默认即可</small></div><div class="adjust-group"><span>甲面长度</span><div class="option-list"><button v-for="length in ['短款', '中等', '偏长']" :key="length" :class="{ selected: selectedLength === length }" @click="selectedLength = length">{{ length }}</button></div></div><div class="adjust-group"><span>表面质感</span><div class="option-list"><button v-for="finish in ['亮泽', '镜面', '天鹅绒']" :key="finish" :class="{ selected: selectedFinish === finish }" @click="selectedFinish = finish">{{ finish }}</button></div></div><div class="adjust-action"><button class="generate-button" :disabled="stage === 'generating'" @click="generate"><Icon :name="stage === 'generating' ? 'refresh' : 'spark'" />{{ buttonLabel }}<Icon name="arrow" /></button><button class="reset-button" @click="resetDemo"><Icon name="refresh" />恢复示例</button></div><details class="prompt-details"><summary>查看默认 AI 指令</summary><p>{{ DEFAULT_TRY_ON_PROMPT }}</p></details></section>

      <section class="inspiration" id="inspiration"><div class="section-heading"><div><p class="eyebrow">灵感款式</p><h2>先从一个方向开始。</h2></div><button class="text-link" @click="scrollTo('top')">回到试戴区 <Icon name="arrow" /></button></div><div class="preset-grid"><button v-for="preset in presets" :key="preset.name" class="preset" :class="{ selected: selectedPreset === preset.name }" @click="pickPreset(preset)"><span class="preset-art"><img :src="preset.image" :alt="preset.name" /></span><span class="preset-copy"><strong>{{ preset.name }}</strong><small>{{ preset.detail }}</small></span><span v-if="selectedPreset === preset.name" class="preset-check"><Icon name="check" /></span></button></div></section>

      <section class="how-it-works" id="how-it-works"><div class="how-title"><p class="eyebrow">使用说明</p><h2>让喜欢的风格<br /><em>落在你的指尖。</em></h2></div><div class="how-list"><div><span>01</span><strong>准备两张图</strong><p>一张能看清手部的照片，一张你喜欢的美甲参考图。</p></div><div><span>02</span><strong>交给 AI 试戴</strong><p>系统只替换指甲区域，尽量保持你的手型、姿势和光线。</p></div><div><span>03</span><strong>带着结果去沟通</strong><p>保存喜欢的效果，把它带给美甲师作为沟通参考。</p></div></div></section>
    </main>

    <footer class="footer"><span>拾光指屿 · 为每一次美甲决定多留一点确定</span><button @click="scrollTo('top')">回到顶部 <Icon name="arrow" /></button></footer>
    <div v-if="toast" class="toast" role="status"><span><Icon name="check" /></span>{{ toast }}</div>
  </div>
</template>
