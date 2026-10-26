---
name: LightFingis
description: A calm Chinese manicure try-on studio for previewing a look on your own hand before you commit.
colors:
  forest: "#102b27"
  forest-2: "#193f38"
  paper: "#fffdf9"
  canvas: "#f6f1eb"
  canvas-2: "#ede4db"
  ink: "#23352f"
  muted: "#7b817b"
  muted-2: "#a19b92"
  line: "rgba(35,53,47,.14)"
  accent: "#e76350"
  accent-deep: "#bd4a3d"
  sage: "#dbe9df"
  success: "#72ad82"
typography:
  display:
    fontFamily: "Manrope, Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(43px, 5.7vw, 76px)"
    fontWeight: 600
    lineHeight: ".98"
    letterSpacing: "-.07em"
  editorial:
    fontFamily: "Noto Serif SC, serif"
    fontSize: "inherit"
    fontWeight: 500
    lineHeight: "inherit"
    letterSpacing: "-.09em"
  body:
    fontFamily: "Manrope, Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.8"
    letterSpacing: "normal"
  title:
    fontFamily: "Manrope, Noto Sans SC, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "1.1"
    letterSpacing: "-.045em"
  label:
    fontFamily: "Manrope, Noto Sans SC, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: "normal"
    letterSpacing: ".16em"
rounded:
  none: "0"
  sm: "4px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "48px"
  section: "92px"
components:
  button-primary:
    backgroundColor: "{colors.accent-deep}"
    textColor: "#fffaf3"
    typography: "10px / 700 Manrope"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "10px / 400 Manrope"
    rounded: "{rounded.none}"
    padding: "8px 10px"
  button-secondary-saved:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.forest}"
    typography: "10px / 400 Manrope"
    rounded: "{rounded.none}"
    padding: "8px 10px"
  surface:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "18px"
  progress-nav:
    backgroundColor: "rgba(255,253,249,.72)"
    border: "1px solid rgba(35,53,47,.11)"
    padding: "16px 20px"
---

# Design System: 拾光指屿

## Overview

**Creative North Star: “先试戴，再决定。”**

LightFingis is a focused Chinese manicure try-on tool, not a generic AI dashboard. The first viewport puts the task in order: upload a hand, choose a reference look, then inspect a believable result. The interface uses a quiet warm canvas, white paper work surfaces, forest navigation, and coral action markers. Chinese copy is direct and reassuring: “AI 会保留你的手型和肤色，只替换指甲效果。”

The shipped composition is a two-column studio on desktop. Two source cards (你的手部照片, 参考美甲款式) stack on the left and a large 试戴效果 comparison card occupies the right. A horizontal progress nav sits above the studio. After the studio, a compact “生成前调整” row, four-card 灵感款式 shelf, a light editorial 使用说明 band, and footer complete the page.

**Key Characteristics:**

- Warm, low-contrast paper canvas with a forest header and coral signal color.
- Manrope for operational Chinese UI; Noto Serif SC only for the red editorial phrase in hero/how-it-works headlines.
- Explicit reference/API state distinction, visible image badges, and privacy language next to upload actions.
- Square surfaces, restrained shadows, and circular markers instead of pill-shaped dashboard chrome.

## Colors

The active CSS tokens live in `src/style.css` and should be treated as canonical.

### Primary

- **Forest** (`#102b27`): Header, strong headings, instruction band text, footer, and primary text on light surfaces.
- **Forest 2** (`#193f38`): Reserved dark companion token for future dark surfaces.
- **Accent Coral** (`#e76350`): Active progress steps, slider accent, selected length/finish state, focus ring tint, and hover signal.
- **Accent Deep** (`#bd4a3d`): Primary generate button, link text, error state, and small coral labels where contrast is needed.

### Neutral

- **Canvas** (`#f6f1eb`): Page background and the dominant field around the tool.
- **Canvas 2** (`#ede4db`): Warm supporting neutral for future states.
- **Paper** (`#fffdf9`): Source cards, result card, adjustment row, and preset cards.
- **Ink** (`#23352f`): Main text and border source color.
- **Muted** (`#7b817b`): Supporting copy, metadata, and quiet controls.
- **Muted 2** (`#a19b92`): Placeholder and secondary metadata.
- **Sage** (`#dbe9df`): Selected tabs, privacy marker, and selected secondary actions.
- **Success** (`#72ad82`): API-ready/status dots and completed-result markers.
- **Line** (`rgba(35,53,47,.14)`): Fine dividers and low-contrast borders.
- **Surface colors:** `#dfd1c6` hand-image fallback, `#192d35` reference fallback, `#e9f0e8` generation panel, and `#fff1eb` error panel.

### Named Rules

**The Coral Signal Rule.** Coral marks intent, progress, and action. Keep most area neutral so the primary generate action and active comparison state are immediately legible.

**The Hand-First Rule.** Forest headings and paper surfaces should frame the user's hand. Never let decoration or a saturated treatment compete with the hand/result imagery.

## Typography

**UI Font:** Manrope, with `Noto Sans SC`, `PingFang SC`, and `Microsoft YaHei` fallbacks.

**Editorial Font:** Noto Serif SC, used only on `em` phrases such as “再决定。” and “你的手。”

### Hierarchy

- **Hero display:** Manrope 600, `clamp(43px, 5.7vw, 76px)`, `.98` line-height, `-.07em` tracking. Copy: `先试戴，` followed by the serif coral phrase `再决定。`.
- **Editorial emphasis:** Noto Serif SC 500, inherited size/line-height, `-.09em` tracking, coral deep. It is a short phrase, never a control label.
- **Surface titles:** Manrope 600, `18px`, `1.1` line-height, `-.045em` tracking. Examples: `你的手部照片`, `参考美甲款式`, `试戴效果`.
- **Section headline:** Manrope 600, `clamp(25px, 3vw, 39px)`, `1.1` line-height, `-.06em` tracking. Example: `先从一个方向开始。`.
- **Body:** Manrope 400, `14px`, `1.8` line-height. The hero paragraph is capped at `540px`.
- **Label:** Manrope 700, `9px–10px`, compact line-height, `.12em–.16em` tracking. Used for eyebrow, step tag, badges, and metadata.

**The Two-Voice Rule.** Keep all operational Chinese text, statuses, filenames, and controls in Manrope/fallback sans. Noto Serif SC is reserved for the two short editorial accents in the hero and instruction headline.

## Layout

The page uses a centered frame with `max-width: 1320px`, `padding: 64px clamp(20px, 5vw, 78px) 90px`, and a `70px` forest topbar with `clamp(20px, 5vw, 80px)` horizontal padding.

The hero is a two-item flex row (`gap: 50px`) with the eyebrow, headline, Chinese explanation, and a right-aligned privacy note. The horizontal progress nav follows at `margin-bottom: 20px`: three steps (`上传手部照片`, `选择参考款式`, `查看试戴效果`) connected by flexible one-pixel lines. Active step circles are coral; inactive circles are outlined.

The main `.studio` is a two-column grid: `minmax(245px, .73fr) minmax(0, 1.27fr)` with a `20px` gap. `.sources-column` is a vertical stack of two equal source cards. The result card is the larger right column. Each source image is `205px` tall on desktop; the result comparison uses `aspect-ratio: 1.36 / 1`.

The adjustment row is a paper grid below the studio with four tracks (`1.1fr .9fr .95fr 1.4fr`), `20px` padding, and a `20px` top gap. The inspiration shelf starts `92px` after the workbench, has four equal preset columns with a `13px` gap, and uses `145px` art areas. The light 使用说明 band begins `95px` later and spans the page frame; its three explanation items use a three-column grid.

### Responsive Rules

- **At `max-width: 1040px`:** `.studio` collapses to one column; source cards become a two-column grid; the adjustment row becomes a three-column grid and its action spans the full row. The instruction band uses the page side padding rather than negative frame margins.
- **At `max-width: 700px`:** topbar is `62px` with `18px` padding, primary nav is hidden, and status text shrinks to `9px`. Page padding is `43px 18px 68px`; hero stacks and the privacy note moves below the copy. Progress nav becomes a vertical checklist with short vertical connectors. Source cards stack with `14px` gaps and `14px` padding; image frames use `height: min(72vw, 285px)`; result comparison uses `aspect-ratio: 1 / 1.08`. Comparison controls and result actions stack. The adjustment row becomes a block, its generate action stacks above reset, presets become two columns with `120px` art, and the instruction band becomes a vertical list.
- **At `prefers-reduced-motion: reduce`:** smooth scrolling, pulse/spin/toast animation, and transitions are disabled or reduced to near-zero duration.

## Elevation & Depth

Paper cards use `0 18px 45px rgba(55,39,29,.08)`. Presets use a lighter `0 10px 24px rgba(55,39,29,.05)`. The split handle uses `0 4px 13px rgba(16,43,39,.25)`, while the bottom-right toast uses `0 10px 28px rgba(16,43,39,.24)`. Large surfaces remain flat and square; shadows only establish separation between the canvas and working surfaces.

**The Quiet Surface Rule.** Use border plus tonal contrast first. Elevate only image/result cards, the split grip, preset shelf, and transient toast.

## Shapes

Cards, image frames, buttons, tags, and panels have no default radius. Circles are semantic: progress indices, status dots, privacy icon, split grip, preset check, error icon, toast check, and the small brand bars' `4px` radius. Image frames clip with `overflow: hidden`; all artwork uses `object-fit: cover`. The split comparison is a clipped result layer over the original with a one-pixel vertical divider.

## Components

### Header and Navigation

The `70px` forest topbar contains the coral three-bar brand mark and `拾光指屿`, centered links (`开始试戴`, `灵感款式`, `使用说明`), and a status indicator (`AI 服务已连接`, `正在连接 AI`, or `演示模式`). Active/hover links get a coral bottom border. On mobile, links are hidden and brand/status remain.

### Progress Navigation

`.progress-nav` is a horizontal, paper-tinted strip on desktop. Each `.progress-step` combines a numbered circular index, Chinese title, and short supporting line. Step 1 is active by default; step 2 activates when a reference file exists; step 3 activates while the stage is ready. It becomes a vertical checklist below `700px`.

### Source Cards and Uploads

The two source cards are labeled `第一步` and `第二步`. Their upload frames accept `image/*`, show a preview or a centered empty-upload prompt, and display a badge (`参考图片`, `已上传`, `默认参考`, or `参考款式`). The native file input is hidden behind the frame and the `更换照片`/`更换款式` text action. Files above 10MB are rejected with a toast. Removing an image clears its file, preview, and filename while leaving an honest empty state. The default reference is a real image from `public/images/`.

### Result and Comparison

The result card is labeled `第三步` and reports `等待生成` or `AI 试戴结果`. Before generation it shows a deliberate empty state rather than a synthetic hand or result. Once the API returns an image, the comparison contains the original hand image and a clipped generated image. Tabs are `左右对比`, `只看原图`, and `只看结果`; split mode provides a native range and a draggable/keyboard slider handle from 8% to 92%. The footer distinguishes the upload-required state from `真实 API 生成 · 原图不会被改动`, and offers 保存效果 and 下载图片.

### Adjustments and Presets

`生成前调整` exposes button groups for `甲面长度` (`短款`, `中等`, `偏长`) and `表面质感` (`亮泽`, `镜面`, `天鹅绒`). The coral deep primary button asks for both uploads until real files are present, then reads `生成真实试戴效果`; reset reads `恢复示例`. Presets are four real reference cards: `冰透碎钻`, `海盐冰气泡`, `绿色奶芙芙`, and `仙气蝴蝶`, with real image crops, detail copy, coral selected border, and pale-sage check.

### Instruction Band, Footer, and Toast

The light editorial band uses the Chinese headline `让喜欢的风格落在你的指尖。` and three numbered explanations: `准备两张图`, `交给 AI 试戴`, and `带着结果去沟通`. The footer repeats the promise `为每一次美甲决定多留一点确定` and provides `回到顶部`. Upload, preset, save, download, reset, and generation feedback appear in a fixed bottom-right toast with a semantic `role="status"`.

## API and Demo States

The client checks `GET /api/health` on mount. `server.mjs` returns `{ ok, provider: "image-edit", configured }`; the header maps this to ready, checking, or offline/演示模式.

Generation is blocked until both real hand/reference files are present. It then enters `generating`, starts at 7%, and advances toward 88% on a 280ms timer while the server request is in flight. The client sends `POST /api/try-on` as `FormData` with `hand`, `reference`, `length`, `finish`, and a Chinese preservation prompt. The server enforces two files and a 10MB per-file limit, keeps the API key server-side (`IMAGE_API_KEY`), calls `${IMAGE_API_BASE_URL}/images/edits`, and returns an image URL or a structured error.

Errors restore progress to 100%, switch the result card to `这次没有生成成功`, show the server/user-facing message, and expose `重新生成`. Missing fields, missing key, upstream failures, unsupported payloads, and network failures have explicit Chinese messages. Demo images are always labeled so they cannot be mistaken for generated output.

## Accessibility

- All visible actions are native buttons/links or labeled file-input labels; remove controls have Chinese `aria-label` and `title` text.
- Focusable links, buttons, and inputs use a visible `3px` coral-tinted `:focus-visible` outline with offset.
- Image previews include meaningful Chinese alt text for the hand, reference, and result.
- The comparison tabs use `role="tablist"`/`role="tab"` with `aria-selected`; the split handle is a keyboard-focusable `role="slider"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`, plus left/right arrow nudges.
- Status updates use `role="status"` for toast feedback; generation, API connectivity, and error copy are never conveyed by color or animation alone.
- Layout preserves task order at small widths, keeps controls within the viewport, and uses readable contrast between forest text, paper surfaces, coral actions, and muted metadata.
- Respect `prefers-reduced-motion`; do not add motion-dependent meaning to future states.

## Do's and Don'ts

### Do:

- **Do** preserve the forest/canvas/paper/coral relationship and the Chinese task order.
- **Do** keep Manrope for operational UI and reserve Noto Serif SC for short editorial emphasis.
- **Do** make the hand, reference, and result easy to compare in that order.
- **Do** use the real default reference shelf and keep the hand/result empty until the user supplies inputs and the API succeeds.
- **Do** keep privacy language beside upload actions and keep the API key on the server.
- **Do** retain semantic tabs, keyboard split control, meaningful alt text, visible focus, and reduced-motion behavior.

### Don't:

- **Don't** reintroduce a left workflow rail or three-column workbench; the shipped layout is source stack plus result column with a horizontal progress nav.
- **Don't** replace the Chinese copy with English marketing language in the first viewport.
- **Don't** use rounded cards or pill-shaped controls as the default silhouette.
- **Don't** hide the original hand or remove split/before/after comparison modes.
- **Don't** imply that demo output was generated by the API or expose `IMAGE_API_KEY` in browser code.
- **Don't** rely on color, animation, or imagery alone to communicate selected, generating, error, or ready states.
