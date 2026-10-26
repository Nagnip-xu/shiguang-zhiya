# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Vue 3 + Vite + TypeScript with a small Node/Express server proxy for the image-edit API.

## Users

Primary users are consumers choosing a manicure style before an appointment or purchase. They have a photo of their hand and a reference manicure image and want a believable preview on their own hand.

## Product Purpose

The product lets a user upload a hand photo and a reference manicure photo, then preview the reference style applied to their own nails while preserving their hand, skin tone, finger pose, and background. Success means the result feels credible enough to help the user choose a style.

## Positioning

The product's meaningful mechanism is controlled image-to-image editing focused on the nail area, keeping the user's real hand identity intact rather than generating a generic hand.

## Operating Context

A single-page web tool used on desktop or mobile. The core workflow is upload hand photo, upload reference style, generate, compare original/reference/result, and save or start another try.

## Capabilities and Constraints

- The front end starts with a real reference-image shelf and an honest empty state for the user's hand and generated result; no fake hand or fake result is shown.
- Uploading a real hand photo and reference image calls the server-side `/api/try-on` proxy, which forwards both images to the configured image-edit endpoint.
- The future image2 API must be called server-side; API keys must not be exposed in the browser.
- The UI must make original image, reference image, and generated result easy to compare.
- User image privacy, deletion behavior, and final API/storage details remain open decisions.

## Brand Commitments

No existing brand identity or assets were provided. The product should feel contemporary, precise, calm, and beauty-aware without looking like a generic AI dashboard.

## Evidence on Hand

Four real reference images are available in `images/` and are exposed as the default inspiration shelf. The user supplied a server-side image API credential, stored only in ignored `.env.local`; generated output is only shown after a real API request succeeds.

## Product Principles

- Preserve the user's hand; change only the manicure.
- Show the work, not a marketing promise.
- Make comparison and iteration effortless.
- Keep image privacy understandable.
- Stay useful before the API is connected.

## Accessibility & Inclusion

The front end should support keyboard focus, clear labels, readable contrast, reduced-motion preferences, and responsive use on small screens.
