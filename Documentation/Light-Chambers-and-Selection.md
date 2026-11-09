# Light chambers and checked generation · Pulse 0.20.0

Create → Choose families & looks is the direct route. Original flow and Light chambers are pinned at the top. Tick a family for all its looks, or expand it and tick individual looks. Search includes look names. Selected only shows the checked pool. Use only this restricts the next generation to that family. Use checked families commits the pool; Cancel, including the visual-range dropdown route, leaves the document unchanged.

Variety can move between checked families, explore one checked family per film, or keep one look. Another composition retains the pool with a fresh seed. Colours, timing, motion and optional layering do not broaden it. Extra layering stays off by default; generated overlays also stay inside checked immersive families. Save/reopen retains the pool.

Browse has Use only this family and Include this look in generation. The existing single-look route remains. Build-your-own authored setups are edited in Visual workshop; Butterchurn experiments remain separate from this original-family checklist. Type-only families need Include text enabled.

Locked scenes/layers may contain an otherwise unticked visual and remain protected. Checked choices take priority over saved section-family preferences, while retaining that metadata, timing, cues and palettes. Leave checked-selection mode to use the section-family choices again. Empty checked pools explain the problem rather than silently enabling everything.

## Seven original lighting looks

- Endless portals: the clean, warm travelling tunnel.
- Disco canopy: perspective rows of disco lights, with a stationary view available.
- Halo chamber: luminous rings holding their position while illumination changes.
- Light columns: a projected three-dimensional installation of staggered blue light curtains, with depth-dependent scale, overlap, fading and gentle lateral parallax. No horizontal tier or floor-grid lines.
- Marquee portals: tilted frames with several rows of warm bulbs.
- Radiant arches: broken arcs whose inner structures are shorter, thinner and dimmer.
- Minimal columns: the simpler flat light-bar arrangement.

Find these in Browse, the picker or Example projects → Light chambers. Seven editable source-free files are under Examples/Light chambers.

Visual workshop → Look separates flat/depth arrangement, fixed/parallax/travelling camera, fixture style, spacing, depth, opening, twist, atmosphere, light chasing and thickness. The blue installation uses real projected coordinates rather than a flat equaliser; its forward/back camera drift is bounded. Camera travel remains optional and independent of changing illumination. Fixed-camera pixel checks confirm stationary geometry; enabling parallax or chasing changes the intended part of the image.

Warm amber/cream is the starting palette for most looks. Light columns starts in cool blue. Use project colours links to the palette; the anchored colour controls remain available. Preview before Apply. Music is used for light intensity and selected movement, with whole-frame structural bounce bypassed for this family. Arbitrary compositions still need their loop seam and soundtrack checked.

## Visual and optimisation checks

The visual review compares each look at1/4/8/16seconds, portrait and wide formats. Flat arrangements preserve proportions and fit the frame. Static halos/marquees show complete structures; the travelling portal retains immersive cropping. Near-white pixels covered under0.5% in the sampled earlier review; this is an exposure check, not a judgement of artistic quality. The blue curtains were subsequently rebuilt in actual perspective after reference review.

Fixture paths are cached in at most fourteen small look/fixture combinations. One quarter-resolution bloom buffer is reused per canvas and released by the gallery/export cleanup hook. Glow is composited once, rather than blurred for every bulb. Look checkboxes are built only when expanded, and the static family catalogue is cached. The lighting installation batches lines by depth, colour and intensity.

234 model checks pass. Browser checks cover look exclusion, persistent selection, Cancel, save/reopen, Browse and narrow controls. Two original Sound examples at120BPM and83BPM retain their authored timing and stay inside checked Light chambers. Backward seeking reproduced the image; an independently decoded MP4 contained motion; an offline web-wallpaper export accepted colour, pause and FPS changes. Native startup uses an isolated profile.

Measured synthetic4× CPU results, including render-submission timings and the actual Browse preview, are stored with the development package. An earlier six-look run had medians0.4–2.4ms and95th percentiles1.0–4.1ms at960×540. The playing Browse preview produced55 selected frames in about1.8seconds, with median interval33.3ms. These are browser measurements, not physical low-end-PC guarantees; actual Wallpaper Engine desktop use still needs user testing.

## Research

The directly relevant [Jungle2021 case study](https://www.notch.one/madewithnotch/jungle-world-tour-2021) describes music-linked architectural depth illusions by Boxcat Studio and Cassius Creative. [Cassius’s project page](https://www.cassiuscreative.co.uk/jungle) credits the2021/22 touring production; [Boxcat’s page](https://www.boxcat.studio/projects/jungle/) identifies its Notch content work. Our application of those principles is an interpretation, not a reproduction of their rig, code or stage imagery.

[Three.js selective bloom](https://threejs.org/examples/webgl_postprocessing_unreal_bloom_selective.html) and [PixiJS performance guidance](https://pixijs.com/8.x/guides/production/performance-tips/) informed separating emission and bounding cached work. This renderer is original Canvas2D code, with no new dependency or band branding.


## Browse visuals

Light chambers appears on the first page of All visuals and in Light & atmosphere. Choose its card to preview all seven looks, apply one to the current scene, or include it in generation. Search also finds light architecture, columns, portals, arches and marquee.

Family animation remains distinct from additional drift: spirals rotate, kaleidoscopes reflect a moving source, branches grow progressively and ink blooms expand. The latter two use repeatable grow/fade cycles; their animation does not rely on accumulated frames. Motion bypass stops these intrinsic clocks. Family-response defaults do not add drift to these four families; deliberately authored drift stays available.
