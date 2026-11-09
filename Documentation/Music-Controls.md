# Song sections and music controls

Pulse 0.18.0 development preview · 5 November 2026

Open **Timing → Song sections & music controls…**, or use the same shortcut in Create. The feature is optional and bypassable. Save project preserves all ranges, cues and mappings. Export and Send to remain at the top right; Save PNG stays beside playback.

## Define the song

Drag a range on the mini timeline, type From/To seconds, use the playhead buttons or use the selected scene range. Name it Verse, Chorus, Drop or anything you choose. Add saves a new range; Update edits the selected range. Ranges cannot overlap. All times are relative to the composition from 0, with the source-track offset already accounted for. Later ranges are retained if you shorten the film, and only the intersecting part applies.

Choose a behavioural starting point, motion/reaction/density multipliers, an optional visual family and a base palette. Existing palette locks remain protected; existing colour journeys can still animate the base. Motion0 freezes the visual. Family/cut choices are applied on **Apply section plan to scenes** or on generation. The live preview shows the actual current canvas.

Use a recurring motif name such as chorus-blue to bring back that motif's first visual in later sections. This reuses the visual direction; it does not detect a chorus or automatically create a new variation. Scene and layer locks remain authoritative. Locked scenes cannot be split by new section boundaries.

Keep generated cuts, hold one scene through a range, or cut every 1, 2, 4, 8 or 16 beats. On a detected grid, groupings use detected beats; otherwise they use the manual tempo. Optional generated cuts thin before authored boundaries are lost. An explicit plan above 64 scenes, or incompatible protected boundaries closer than0.1 seconds, is refused with an explanation.

## Mark rhythm cues

Choose Kick, Snare, Fill, Custom hit or Hold. Add at an exact time, use the playhead, or **Tap hit now** while the song plays. T does the same when the Rhythm cues tab has focus outside a typing field. A hold needs an end time: the visual freezes, while source audio and timed lyrics continue. Cue lists are paged in groups of 80, up to 2048 cues.

Tempo/grid correction reuses the existing tap-tempo and grid-audition tools through **Tempo & beat grid…**.

## Map signals to visuals

Choose beat, bass, treble, overall energy or a manual cue lane as a source. Drive size pulse, reaction boost, instrument glow, visual density, graphic accent colour, film flash or scene cuts. Set strength, attack/smoothing, release and beat grouping. Use all unlocked visuals or an available graphic layer where supported. Text and locked visual layers are not changed by ordinary layer mappings; film flash is explicitly a whole-frame effect. Removed or locked layer targets remain labelled rather than silently becoming global mappings.

Cuts take effect on **Apply mapped cuts to scenes** or Generate. Continuous energy signals cannot directly create cuts; use beats or marked hits. Other mappings affect preview/export immediately. Mappings add to existing music responses, so start with restrained strengths.

Feedback families keep their simulation stable: live pulse/reaction/glow mappings affect presentation rather than restarting the feedback history. Density mapping excludes feedback; section-level base settings remain available. There is no MIDI/OSC controller integration in this pass.

## Estimated suggestions

**Suggest passages** uses the existing energy/texture boundaries, then rough average spectral/energy similarity to name recurring passages A,B,C. Similarity is a heuristic score, not a calibrated probability. No verse/chorus labels are claimed. Confirmed ranges are kept. Rename, move or relabel suggestions with Update to make them manual.

**Suggest low/bright hits** classifies detected onsets using bass versus treble energy. They are labelled estimated kick/snare cues, not separated drum stems. Manual cues are preserved when suggestions are refreshed. Remove estimated hits leaves manual cues intact.

All of this runs offline. No model downloads, new runtime dependencies or user audio are bundled.

## Research and checks

The distinction between boundaries, recurrence and semantic labels follows the music-structure principles described in [AudioLabs FMP](https://www.audiolabs-erlangen.de/resources/MIR/FMP/C4/C4S1_MusicStructureGeneral.html) and [librosa's temporal segmentation implementation](https://github.com/librosa/librosa/blob/main/librosa/segment.py). Our small browser-side heuristic is original and much simpler; it is not a port or an accuracy-equivalent implementation.

217 model tests pass. Browser checks cover authoring, actual frame changes, deterministic seeking, cue entry without playhead jumps, saved projects, narrow-window bottom controls and feedback history. Exact PNG frames verify holds and hit flashes; MP4 export is independently decoded. The two supplied tracks were decoded/analysed and used with suggested sections; boundaries survived generation and backward seeking. These are computational checks, not listening or human-labelled structural accuracy results.

The old Browse loop was redrawing the whole grid at180ms intervals. The replacement prioritises the selected preview, schedules visible thumbnails within a work budget, and leaves expensive feedback thumbnails as posters until explicitly previewed. A simulated4× CPU slowdown measured61 selected frames over about2 seconds, median interval26.8ms, with no offscreen thumbnail animation in that test. Physical lower-end hardware and longer sessions still need testing.

Custom hit lane names keep separate authored patterns independent. A mapping can be limited to one named section; deleted sections do not silently make it global. The active section is also shown beside playback, with one-click access back to the editor.

Try **Example projects → Music controls / Verse & returning chorus**. It is source-free, with an authored 120 BPM grid and manual example cues—not an analysed or bundled song. Replace those with your music and your own decisions.


## Authored music from Sound

[Sound → Pulse](Sound-Handoff.md) now brings actual tempo, sections and drum cues alongside the audio, with a review and protection for manual edits. Try the two playable Sound + Pulse examples in Example projects.
