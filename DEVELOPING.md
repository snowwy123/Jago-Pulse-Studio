# Developing Pulse

## Build

Use Node.js 18+ and the Windows .NET Framework 4.8 C# compiler. Run Build.ps1 from this repository. It generates editable examples, assembles index.html and Jago-Pulse.html, then builds the Windows host. Dependencies are checked in; no network or package install is required. Generated HTML belongs in source for offline use and GitHub Pages.

Package.ps1 -Output <fresh-directory> builds app/browser ZIPs and archives Git HEAD for the source ZIP. Commit the intended source before packaging. Build-manifest.json records the commit and ZIP hashes. Public release packaging and previews should remain separate.

## Architecture

- analysis.js: original local FFT/onset/tempo/beat/novelty analysis, generated cuts and optional expressive beat following. A Blob worker keeps analysis off the UI thread. Tempo confidence is heuristic; energy regions are not semantic sections.
- direction.js: briefs, choreography, smoothed/event cues, integrated speed, easing, colour journeys and validation of deeper controls.
- catalogue.js and vocabulary.js: six collections, named structural variations and original deterministic Canvas renderers. Every look must contain visible artwork, differ from its siblings, animate and seek without history.
- palette.js: role colours, locks, extraction, contrast and reusable palette data.
- composition.js: evolution, continuous motion clocks, independent signal routing, passage directions, dependency validation, masks, links and shared group controllers. Preserve transitive dependencies of locked layers; remap references alongside identifiers.
- studio-editor.js and stage-editor.js: family audition, palette UI, relationships, passage controls, isolation, timing gestures and direct canvas text edits. Preview state must stay out of saved projects and exports.
- core.js: editable model, deterministic generation, pose evaluation, scene/layer rendering, bounds and hit testing. Render from seed/time rather than accumulating simulation state.
- fields.js: placed or full-frame procedural systems and finishing effects. Preserve inherited alpha for fades and brightness response.
- lyrics.js: SRT/VTT/LRC parsing, estimated plain-text arrangement, cue rendering and SRT output.
- app.js and music-editor.js: basic editing, imports, recovery, playback and timing controls. Snapshots deep-copy mutable project settings while sharing immutable embedded assets/audio/analysis.
- deep-editor.js and alternatives.js: motion points, selection/groups, sprite setup, paged text cues, recipes, briefs and variation audition.
- export-editor.js: exact-frame media export through Mediabunny, original store-only PNG ZIP writing, cancellation and memory guards. Playback recording is a fallback. Audio excerpt offsets, gain and loop bounds must match preview.
- speech-editor.js and Source/Windows/App.cs: optional local whisper.cpp bridge. No remote transcription service. Native executable/model paths are user-selected or found in the optional adjacent Transcription folder.

Projects embed image/font/audio data. Source-track text timestamps stay absolute; render accounts for audioStart. Sprite sheets are PNG assets with layer-level grid/playback metadata. Workscape registration and editable snapshot integration are supported. Video footage layers are not implemented.

## Verification

Run node --test Source/Tests/*.test.cjs. These include fixed-tempo/silence fixtures, locks, validation, palette roles/locks, dependency preservation, palette journeys, motion, transcript formats and gradual expressive timing.

Browser tests use Playwright with Edge. Set PULSE_PLAYWRIGHT to its module location and PULSE_TEST_WORK to an isolated output folder. Run browser.cjs, visuals-browser.cjs, deep-browser.cjs and language-browser.cjs. The deep test uses browser.cjs's timing-test.wav; point PULSE_TEST_FIXTURE at that output. music-browser.cjs additionally needs PULSE_TEST_AUDIO. User-track projects and media are personal test outputs, not app examples.

The Windows --check <directory> diagnostic checks startup using an isolated WebView2 profile. --speech-check <directory> reads speech-check.json with explicit executable, model and audio paths and writes a real local transcription result. No test should modify the user's normal recovery profile.

Decode exported files independently to check frame count, timestamps, audio and alpha. Compressed VP9 alpha need not be bit-exact; PNG sequences should be. Frame-perfect export means timeline frames are encoded, not that lossy codecs reproduce every pixel exactly.

## Dependencies and research

Pulse's code is MIT-licensed. The unmodified Mediabunny 1.61.4 bundle is MPL-2.0; its licence, attribution and complete corresponding npm source are in Notices. The optional whisper.cpp/model pack is separate and includes its own MIT licences and provenance. No user music, noncommercial lyric dataset or model is part of the app/source ZIPs.

Primary references:
- https://mediabunny.dev/guide/writing-media-files
- https://mediabunny.dev/guide/media-sources
- https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API/Using_the_WebCodecs_API
- https://librosa.org/doc/latest/auto_tutorials/01-intro/06-rhythm.html
- https://github.com/ggml-org/whisper.cpp
- https://arxiv.org/abs/2506.15514

The DSP and visual systems are original implementations. Do not claim semantic verse/chorus recognition, source separation, perfect sung-lyric accuracy or true word alignment. Word display uses explicit imported/manual times where present and estimates within phrases otherwise.

Research references for this pass: p5 noise documentation (https://p5js.org/reference/p5/noise/), Babylon.js particle-system documentation (https://doc.babylonjs.com/features/featuresDeepDive/particles/), and the W3C relative luminance definition (https://www.w3.org/WAI/WCAG21/Understanding/relative-luminance.html). These informed concepts and colour maths; the visual-family kernels are original Canvas code with no added rendering dependency.


## Workspace UI

workspace-ui.js organises existing control nodes into task/property tabs, preserving IDs, listeners and model bindings. All original control IDs must remain in the document. The fixed stack uses stable row nodes while values change: rebuilding on field blur can swallow the next selection click. Row actions resolve current model objects by ID so undo/replacement cannot leave stale object handlers. Preview states and panel navigation do not belong in portable project data.

workspace-browser.cjs exercises real tab visibility, overlap selection, stacking, locks, live slider undo, context-specific sizing, imports and MP4 export. Existing lower-level control regressions use test-panels.cjs to expand panels independently of navigation; keep that helper test-only. Analysis, rendering and musical checks remain independent of the interface layout.

Layout research: Kdenlive’s workspace documentation (https://docs.kdenlive.org/en/user_interface/customizing_interface.html) and Blender’s contextual Properties editor (https://docs.blender.org/manual/en/5.0/editors/properties_editor.html). No UI framework or third-party code added.


## Major creative controls

major.js contains pure scoped selection, time parsing, resize/rebalance, drift/channel evaluation, palette journeys, text layout and the ordered effect renderer. new-fields.js contains eight family integrations (seven shape kernels and the vocabulary type-blocks renderer). major-ui.js connects model controls to the existing undo/bind system; major-extras.js promotes the family chooser and bridges timing/export controls. Keep IDs and legacy defaults intact. pulseMajorComplete marks the fully assembled interface.

Channels use normalised scene time with per-property points, stable sorting, bounds and duplicate-time validation. Resolve order is presets/keys → musical response/groups/relationships → drift → independent channels; field-specific perspective drift remains a later field operation. Colour journeys feed the original direction colour mapper. Default paletteJourney=off, no channels/drift/effects override preserves older projects. Effect stack undefined reads legacy finish amounts; once edited, effects is authoritative. Rendering must remain stateless, including phosphor echoes (fresh raw earlier frames, never accumulated playback buffers).

Output uses a cloned composition at the requested same-aspect dimensions, independent of preview resolution. VideoEncoder.isConfigSupported preflights requested codecs. Do not promise universal 4K hardware encode. In-memory memory limits still apply; exact PNG provides a codec-independent export. Custom resize is previewed before applying; merely auditioning changes must not create undo or dirty state.

Primary implementation references: Blender per-channel F-curves and snapping (https://docs.blender.org/manual/en/latest/editors/graph_editor/fcurves/editing.html), Kdenlive transform/aspect controls (https://docs.kdenlive.org/en/effects_and_filters/video_effects/transform_distort_perspective/transform.html), and MDN codec capability checks (https://developer.mozilla.org/en-US/docs/Web/API/VideoEncoder/isConfigSupported_static and https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API/Codec_selection). These informed interaction and capability choices; no additional rendering dependency or copied visual kernels were introduced.

major.test.cjs covers pure model behaviour. major-browser.cjs exercises real visible scopes, briefs, import decisions, independent channels, effects and 4K PNG/HD MP4 output. language-browser.cjs checks all 141 looks for meaningful motion, distinctness and repeatable seeking. Run editor regressions and multiple real-track analyses after changes that affect shared rendering/timing.


## Workflow and quick refinement (0.8)

workflow.js contains targeted repeat movement, music response and PCM WAV helpers. workflow-ui.js reorganises existing nodes rather than copying controls, preserves scene-level Motion access when no layer is selected, and keeps precision controls below a clear quick-action scope. Its declarations use a block scope because earlier scripts share lexical globals. workflow-output.js offers file routes, not a fake direct-transfer bridge.

Compare-three previews now use Major.surprise and the same family pool/locks as the main Surprise action. Projects are kept separate until choosing one; preview-only size and clocks stay outside saved data. The shared audio clock plays the current track while all cards scrub/render synchronously. Cancelling stops preview/audio without replacing the model.

Full-frame zoom/rotation are applied once in core.fieldTransform; legacy Fields must not apply the same reaction a second time. Overscan covers rotated frames. Flow-speed response now uses reactAmount and musicBoost. Quick music settings use localMusic to override a composition-wide signal for only their target layers. Repeated images keep their outer pose while internal tiled cells pan and clip to the original frame.

Research references: Blender camera fit (https://docs.blender.org/manual/en/latest/editors/3dview/navigate/camera_view.html) informed fitting artwork to the editor bounds; Ableton’s Session View alternatives/scenes (https://www.ableton.com/en/manual/session-view/) informed auditioning alternatives before choosing one. Original implementation, no added dependencies.


## Musical evidence and film composition (0.9)

timing.js performs original multiband flux consensus, local passage votes, phase fitting and optional dynamic-programming attack tracking. analysis.js serialises it into the worker before its own installer. Confidence is a heuristic, not a calibrated probability. Reject aperiodic low-correlation evidence; expose half/double-time and other plausible alternatives. Fixed-tempo and changing-tempo tests use independently known beat timestamps, not the detector output as truth. Real-track tests exercise integration and provide private listening-review files; they do not establish human-labelled accuracy.

film.js owns seeded visual arcs, recurring family choices, family-specific response defaults, role weights and end-settling clocks. Preserve named-look variation, explicit drift, locked scenes/layers and Original mode. Older projects without the new fields default to Original/family-responses off; new projects opt into cohesive generation. Visual roles do not claim semantic musical structure.

directions.js stores up to eight bounded visual snapshots without embedded audio/assets/analysis or recursively copying the bank. Lightweight beat grids preserve timing during Restore; explicit adaptation keeps current track timing and rescales scenes. art-ui.js uses block scope, explicit drafts/Apply/Undo, reduced-motion-aware gallery animation and close-cancelled preview playback. Comparison previews never replace project state.

Run art.test.cjs and art-browser.cjs alongside all earlier regressions. The new browser test uses an actual supplied track, audition cancellation, pulse correction/undo, recipe scope, alternative capture, retained bank across replacement, linked preview playback and project reopen. Native readiness includes pulseArtReady. Source-free recipe examples contain no user music.

Primary rhythm references: https://librosa.org/doc/0.10.2/generated/librosa.beat.beat_track.html and https://essentia.upf.edu/reference/std_RhythmExtractor2013.html . These informed multi-feature evidence and dynamic tracking concepts. No external DSP package or copied implementation is included.


## Task navigation and Words (0.10)

navigation-ui.js reorganises existing controls, adds task-level routes and keeps generation replacements in Create. Existing IDs/bindings remain. New pane keys participate in the shared task system; navigation/preview state stays out of project data. Quick scope defaults to a selected visual layer, or scene visuals for text/no-layer selections. Generation-only continuity stays in Film shape; scoped evolution lives beside motion/reaction. Test-only panel expansion exposes hidden generation controls for low-level regressions.

lyrics.js now owns caption validation, enhanced LRC/WebVTT word starts, weighted estimates, bounded shifts, split/merge, excerpt-relative export, wrapping/readability and stateless karaoke drawing. direction.js calls its normaliser when validating. Cue/word timestamps remain absolute source time; composition export rebases/clips without mutating the source project. Imported multiword VTT segments are conservatively labelled estimated. Explicit word intervals must be ordered, non-overlapping and match phrase text. Changing phrase content/boundaries invalidates the old word alignment.

lyric-workspace.js handles phrase selection/search, source-clock fields, bounded listening, tap marking, manual words, waveform drag drafts and export. A drag commits once on pointer-up; cancellation leaves model untouched. words-ui.js separates scene text from lyrics and adds atomic multi-scene text placement, explicit title hiding, generation protection and selected-only update. Respect scene locks, layer limits and Undo. Optional native transcription is unchanged; do not claim automatic sung-word alignment.

Primary references: Aegisub audio/subtitle timing workflow (https://aegisub.org/docs/latest/overview/), the W3C WebVTT timing/cue-text specification (https://www.w3.org/TR/webvtt1/), and Blender contextual properties (https://docs.blender.org/manual/en/5.0/editors/properties_editor.html). Original implementation; no new dependency or copied source.

Run lyrics-workspace.test.cjs, navigation-browser.cjs and lyrics-browser.cjs alongside earlier suites. The latter uses supplied audio and an excerpt for actual playback, enhanced imports, waveform Undo, explicit-word rendering and VTT rebasing, then exports the source-free word example. Native readiness includes the new navigation/word modules.

Asset loading now uses an operation serial and project identity. A completed decode from an older load cannot replace the active project's audio/images. Exact export captures its source audio buffer and gain at start, preventing asynchronous changes from leaking into output. lyrics-browser.cjs deliberately delays a previous-track decode while opening a source-free example and checks the resulting export.


## Surprise refinement (0.11.2)

Major.surprise owns palette and cutting exploration; runGeneration no longer pre-rerolls a conflicting palette. Palette.explore expands broad surprise without changing the existing Fresh palette action. generatedPaletteJourney ignores stored custom stops only for an automatically selected journey; manually choosing/editing a journey clears it. Flow clocks start at the excerpt; analysis events remain source-clock and manual passages composition-clock. Keep-direction preserves the resolved family pool independently of colour/cut choices.

analysis.cuts supports measured/breathing/bursts/build duration weights before snapping to the selected evidence. Sparse candidates cap the scene target. It does not change the detector, BPM or corrected grid. New model defaults omit generated text; examples explicitly opt into their established typography. The standalone text control does not change imported lyrics.

Run all model tests (116), plus surprise-browser.cjs. The browser check requires three named supplied tracks in PULSE_TEST_AUDIO_FOLDER (defaults to Downloads), Playwright on NODE_PATH and PULSE_TEST_WORK for private output. It exercises actual buttons, text off/on, same-seed generation, colour locks, Undo, comparison descriptions and three-track cut evidence. Track results validate integration/marker adherence, not human-labelled beat accuracy or listening quality. Windows --check remains startup evidence only.
