# Asset Sources — SKM Tooling Center

This document records all external assets used in the project, their licences,
attribution requirements, and local file paths.

---

## Video Assets

### Hero Background Video
| Field | Value |
|---|---|
| **Asset Name** | CNC Machining Workshop Video |
| **Intended Local Path** | `frontend/public/videos/cnc-machining.mp4` |
| **Poster Image Path** | `frontend/public/images/cnc-machining-poster.webp` |
| **Candidate Source 1** | https://www.pexels.com/video/industrial-machining-process-in-workshop-30409129/ |
| **Candidate Source 2** | https://www.pexels.com/video/high-precision-cnc-machine-operation-31751330/ |
| **Candidate Source 3** | https://www.pexels.com/video/high-tech-cnc-machine-in-modern-factory-30409127/ |
| **Platform** | Pexels |
| **Licence** | Pexels Free Licence (verify at point of download) |
| **Attribution** | Not required by Pexels licence, but recommended: credit creator name |
| **Status** | ⚠️ **MANUAL DOWNLOAD REQUIRED** — automated download was not possible. |

**Manual download instructions:**
1. Open one of the candidate source URLs above in a browser.
2. Verify the footage is appropriate for an industrial tooling website.
3. Review the Pexels licence on the page.
4. Click the free download button and select an appropriate resolution (720p or 1080p).
5. Save the file as `frontend/public/videos/cnc-machining.mp4`.
6. Create a poster image (a good frame from the video) and save as `frontend/public/images/cnc-machining-poster.webp`.
7. Update this document with the creator name, download date, and selected source URL.

**Fallback:** Until the video is downloaded, the hero section will display the poster image placeholder. The site is fully functional without the video.

---

## 3D Environment / HDRI

### Industrial Workshop HDRI
| Field | Value |
|---|---|
| **Asset Name** | Industrial Workshop Foundry HDRI |
| **Source** | https://polyhaven.com/a/industrial_workshop_foundry |
| **Licence** | CC0 (Public Domain) — free for any use including commercial |
| **Status** | ⚠️ **MANUAL DOWNLOAD REQUIRED** |

**Manual download instructions:**
1. Visit https://polyhaven.com/a/industrial_workshop_foundry
2. Download the 1K or 2K .hdr or .exr file (1K is sufficient for web).
3. Save as `frontend/public/environments/industrial_workshop_foundry_1k.hdr`.
4. The 3D viewer environment will automatically improve with this file once integrated.

**Fallback:** The viewer currently uses a built-in city environment preset from Drei. The scene is fully functional without the custom HDRI.

---

## 3D Product Models

### Procedural Models (Built-in)
All 3D product models currently displayed on the website are procedurally generated
using Three.js geometry and are created specifically for this project. They are not
based on any third-party assets and have no licence restrictions.

**Models included:**
- Core Insert (cylindrical precision insert)
- Cavity Plate (rectangular tooling plate)
- Moulding Tool (assembled tool stack)
- Case Cover Plate (flanged enclosure cover)
- Tooling Component (hexagonal precision component)

These are clearly labelled "Concept Visualisation" in the UI. They must not be
represented as exact SKM Tooling Center products unless replaced with company-approved
engineering files.

### Sketchfab Investigation
| Field | Value |
|---|---|
| **Investigated URL** | https://sketchfab.com/3d-models/plastic-injection-mold-04f5141be5834c7782daf2f517fdf302 |
| **Status** | Not downloaded — Sketchfab requires account login and model-specific licence review. |
| **Reason** | Cannot automate download without account authentication or bypassing platform restrictions. |

**If a licensed Sketchfab model is obtained manually:**
1. Verify the individual model licence (CC, editorial only, commercial, etc.)
2. Confirm commercial website use and modification are permitted.
3. Download the GLB or GLTF format file.
4. Save to `frontend/public/models/` with a clear descriptive filename.
5. Add the model attribution and licence to this document.
6. Update the `ModelViewer.tsx` component to load the GLB file.

---

## Adding Real Company CAD Models

To replace a procedural model with an approved company CAD model:

1. **Convert** the CAD file (STEP/IGES) to GLB/GLTF format using:
   - [Blender](https://www.blender.org/) (free, open source)
   - [CAD Exchanger](https://cadexchanger.com/) or similar
   - Remove any confidential design data before exporting.

2. **Optimise** the GLB file:
   - Use [glTF Transform](https://gltf-transform.donmccurdy.com/) or Blender's glTF exporter.
   - Target file size under 5 MB for web delivery.
   - Apply Draco compression if supported.

3. **Place** the file in `frontend/public/models/your-model.glb`.

4. **Update** `ModelViewer.tsx` to load the file using `@react-three/drei`'s `useGLTF` hook.

5. **Remove** the "Concept Visualisation" label for that specific model.

6. **Document** the model here with approval date and source.

---

## Fonts

| Font | Source | Licence |
|---|---|---|
| Space Grotesk | Google Fonts | Open Font Licence |
| Inter | Google Fonts | Open Font Licence |
| JetBrains Mono | Google Fonts | Open Font Licence |

---

*Last updated: October 2026*
