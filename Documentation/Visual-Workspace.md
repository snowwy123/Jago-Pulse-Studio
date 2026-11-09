# Pulse visual workspace

Development preview 0.18.0 · 5 November 2026

## Start with a track or an idea

Import artwork and music from the top bar. Create contains the main **Generate composition · Surprise me** action. Its visible **Visual range** chooses a mix, graphic families, visual instruments, or the family chosen in Browse. Text remains a separate choice. Generation options expose its scope and protections; advanced graphic-only generation stays in a disclosure. Compare three directions auditions alternatives without changing the film until you use one.

## Browse, then refine

**Browse visuals**, above the canvas, brings graphic and instrument families into one searchable, grouped browser with favourites and recent choices. Use a family for the next composition, apply it to the current scene, or try an instrument in the **Visual workshop**. Browsing alone does not replace your work. **Build my own** starts an empty authored visual in that workshop.

The original faceted **Cellular forms** remain available. The layer inspector also offers a softer rounded treatment. Pixel worlds list the curated Night garden first; the other five remain explicitly labelled early studies rather than being broadly generated as finished work.

**Scene & layers** opens the layer inspector. **Find action** leads to movement, colour, words, timing and other tasks. The workshop edits an instrument's look, movement, music response, colour and surface detail. Its water/sky controls appear only where relevant. Apply commits an audition; cancelling preserves the scene.

## See the work

The main canvas uses substantially more of the window. Show timeline restores scenes, waveform and timing tools; Focus canvas gives the artwork more space while retaining an exit and the timeline toggle. Escape leaves focus. Preview quality affects editing copies, not authored export settings.

## Colour and finishing

Keep a clear hierarchy: cool dark scenery, warm focal light and a smaller copper-red accent. Night garden's Colour tab includes Moonlit copper, Autumn lake and Electric dusk starting points. The underlying role colours and anchors remain editable; existing colour journeys and locks remain available.

**Finish** holds effects applied to the whole film, including scanlines and the new fisheye lens. The list states scope and order. Subtle film, CRT lens and Print are starting stacks; replacing a stack can be undone. Workshop Surface & detail controls the selected instrument rather than the whole film.

## Authored artwork from other studios

Example projects → Authored pixel → Night garden demonstrates Wobble → Dither → Pulse. Its files live in **Examples/Pixel artwork sources**. Open .jago in Wobble to paint or replace the separate scenery/foreground bitmap layers and edit the native animated light strokes. Open .jagodither in Dither to adjust the palette finish. The Pulse project uses the resulting four-frame sprite as an ordinary image layer. Image edges can be Smooth or Crisp pixels. This is file exchange, not automatic round-trip editing, and the imported scenery is not a collection of separately editable trees or buildings.

## What was checked

212 model/rendering tests pass. Browser checks cover unified browsing, restored cells, empty authoring, scoped generation, controls at narrow sizes, lyrics, undo/save/reopen, GPU/CPU lens paths, six pixel loops, exact-frame and video export, compositing and deterministic seeking. Both supplied test tracks were decoded, analysed and used for generation; this is not a listening assessment of the groove.

Static pixel scenery is cached, browser posters are staggered and bounded, and rapid workshop slider edits coalesce into one preview frame. In a development-machine Chromium test with simulated 4× CPU slowdown, median Night garden render/readback fell from 30.2 to 1.3 ms at 640×360. This is not a physical low-end PC benchmark or an all-scenes frame-rate guarantee.

## Further refinement

The other five pixel studies still need deliberate artwork before promotion. Dynamic-colour cache rebuilding, integrated-GPU testing, prolonged editing sessions and listening-led timing checks remain useful next work. The new workspace extension should eventually be consolidated with the older layout code after this workflow has been tested in use.

## Research informing this pass

Original artwork and renderer code; no new runtime dependency or borrowed preset art. References: [Derek Yu's pixel art tutorial](https://www.derekyu.com/makegames/pixelart.html), [MDN canvas optimisation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas), [PixiJS performance guidance](https://pixijs.com/8.x/guides/concepts/performance-tips), and [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/).

Browser scrolling fix: cards and preview use bounded scroll regions; pagination remains visible. Mouse-wheel scrolling, the final page and bottom actions were checked at five window sizes from 1536×960 to700×600.

Export and Send to… are in the top-right header. Save PNG remains beneath the canvas. The header wraps into usable rows on narrow windows.


For authored verse/chorus ranges, cue lanes and section-specific mappings, see [Music controls](Music-Controls.md). Export and Send to are in the top-right header; Save PNG remains beneath the canvas.
