# Global_Innovation_hackthon2026
ObjectDNA — AI-powered circular economy platform that analyzes unwanted objects and recommends repair, reuse, repurpose, donation, or material recovery pathways.

# ObjectDNA — AI-Powered Circular Economy & Intelligent Reuse Platform

**Hackathon:** Global Innovation Hackathon 2026 — Build for a Better Future  
**Team:** VERAX  
**College:** V S B College of Engineering Technical Campus, Coimbatore  
**Department:** B.E. Computer Science and Engineering

## Project
ObjectDNA is a circular-economy platform concept that helps people look beyond disposal. A user can scan or upload an image of an unwanted object and receive a structured view of its condition, useful components and possible next-life pathways such as repair, reimagine/repurpose, pass-on and material recovery.

## Prototype included in this submission
This package contains a dependency-free, responsive web prototype. It works locally without an API key or backend and includes deterministic demo objects so the complete user journey can be demonstrated reliably.

**Prototype flow**

`OBJECT → CONDITION → COMPONENTS → POSSIBILITIES → COMPARISON → ACTION`

## Key features
- ObjectDNA landing and scanner experience
- Image upload/dropzone with validation and local preview
- Six deterministic demo objects
- Four-phase analysis animation
- Repair, reimagine, pass-on and recover pathway comparison
- Interactive pathway selection
- Six-stage ObjectDNA method
- Responsive desktop/tablet/mobile layout
- Keyboard-accessible controls, ARIA labels and reduced-motion support
- Web manifest and service worker for an offline-first app shell

## Important implementation note
The submitted preview uses deterministic local demo data rather than making a live external AI/API call. The `runAnalysis` boundary in `source_code/objectdna-preview/app.js` is the intended integration point for a secured vision/AI backend in a production version. This keeps the hackathon demo reliable while clearly separating the prototype UI/logic from future model integration.

## Run locally
From `source_code/objectdna-preview`:

```bash
python -m http.server 4173
```

Then open:

`http://localhost:4173`

Opening `index.html` directly also renders the page, while a local HTTP server enables the service worker.

## Links
- Live prototype: https://objectdna-ai-circular-reuse-platform.onrender.com

## Package contents
- `source_code/` — complete prototype source
- `documentation/` — project documentation and technical notes
- `screenshots/` — prototype screenshots
- `demo/` — demonstration video
- `SUBMISSION_INFO.txt` — team and submission details

