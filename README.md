# Dandy — The Interview Room

An independent first-person portfolio interview for **Dandy Aryo Putra**.

## Experience

- Four languages: Indonesian, English, Japanese, and Mandarin Chinese.
- A 3D executive office, seated first-person view, visible hands/body, drag-to-look and keyboard navigation.
- Illustrated animated Dandy character: seated conversation, standing presentation, and receiving an offer.
- Seven experience-based interview topics with branching follow-up questions.
- Career hologram and 26 education/work milestones, including the AI learning journey since 4 October 2024.
- Six-spread portfolio book, certificate manifest, and session-only local document preview.
- Scrollable CERDAS, WMS, MITRA, HRIS and SRMS presentations using illustrative public data.
- Offer document animation and an explicit WhatsApp link to Dandy with the selected discussion topic.
- Device-based narration where a matching voice exists, captions, reduced motion, quality controls and local preferences.
- Automatic CPU perspective rendering on browsers that cannot initialize WebGL. This mode uses the same scene and has simpler rendering.

## Run and build

The root `index.html` and built `app.js` / `scene.js` run on any static HTTP host. No server secrets, company API connections, analytics, microphone access, or external AI services are used.

```sh
npm ci
npm run check
npm run build
npx serve .
```

Publish the root directory on GitHub Pages after choosing the repository audience. The simulator is separate from `dandy-au-portfolio`.

## Content and assets

`content.js` contains the multilingual career and reconstructed interview narratives. `systems.js` contains the illustrative system previews. `certificates.js` is the source of truth for certificate documents. It is initially empty: the 80+ count is owner-supplied; individual certificates are not fabricated.

Add approved files and manifest records to publish certificates. Local previews remain in browser memory and never upload files.

Dandy's character is an illustrated 3D representation. Narration uses available device voices and is not a recording or voice clone. There is no live AI interview endpoint in this edition. The offer document initiates a discussion and does not execute an employment agreement.

Source files: `app-source.js`, `scene-source.js`, `software-renderer.js`, and `locales.js`. Built bundles: `app.js` and `scene.js`. Three.js is licensed under MIT; see `THREE-LICENSE.txt`. Portfolio text and personal assets remain with their respective owner.
