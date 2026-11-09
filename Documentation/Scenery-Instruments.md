# Scenery instruments

Pulse 0.16.0 experimental preview refines four original projected scenery families, with three starting looks each. They are editable procedural scenes, not imported AI images.

## Try them

Open **Examples → New · Experimental instruments → Scenery** and choose Filament ravines, Sculpted strata, Object topographies or Woven passages. Each example has three editable scenes. Alternatively open **Experimental visuals**, choose a family and look, and audition it over your own track.

**Look** starts with terrain shape, detail, relief and central breathing room. Filament terrain can use threads, points or both; the separate points/particles disclosure controls their density. Choose rolling hills, mountain ridges or sharp spires. **3D camera & light** contains viewing angle, elevation, horizon, perspective and light direction. **Framing & fine shaping** contains bend, object/ribbon width and the landscape seed. Object fields can hide the supporting terrain. A seed changes the landform while preserving your other settings.

**Movement** separates terrain flow (including reverse and still) from surface undulation. Camera drift is independent. For a completely still visual set terrain flow, undulation, camera drift and music response to zero. These are continuous scenes, not guaranteed seamless loops; the loop checkbox repeats the audition.

**Music response** uses the existing source, strength, smoothing and beat controls. Family mix needs analysed audio to drive bass/treble detail. Follow the beat works with the detected grid or manual tempo. Chop movement holds the geometry on the grid; light and musical accents can continue reacting between holds.

**Colour** uses the existing three roles, including fixed primary plus travelling accents. The strata example starts with warm earth and paper colours; object fields use porcelain blue, terracotta and cream. Change these in the normal colour inspector.

Apply changes the selected scene; Cancel leaves it untouched. Use the existing Your styles section to save a look, or save the project to preserve the whole film. These families also work in visual stacks and in the **Sculpted scenery** exploration group. Whole-song generation can be restricted to that group.

## What differs

| Family | Starting looks | Geometry and musical behaviour |
|---|---|---|
| Filament ravines | Mountain threads, Rolling dunes, Signal spires | Multi-scale mountain terrain uses fine threads, sampled points and suspended particles; bass changes relief and treble lights upright fibres. Unlike the older signal landscape, there is no rectangular wire-grid floor. |
| Sculpted strata | Layered peaks, Folded ridge, Terraced basin | A shaded 3D height mesh has terraces, contour highlights and layered cut sides. Bass flexes relief; colour bands follow elevation rather than triangle indices. |
| Object topographies | Porcelain ridges, Resonant pillars, Pebble dunes | Rounded profile meshes, lit pillars or pebble meshes sit on a raised surface with contact accents. Bass changes height; pipe tips carry beat accents. |
| Woven passages | Braided passage, Billowing sails, Vault currents | Continuous shaded ribbon surfaces, paired billowing sails or twisted vaults form a passage. Bass opens it and treble accents its edges. This differs from the flat spectral ribbons and single tunnel-ring outlines. |

## Rendering and limits

The renderer uses bounded Canvas geometry and analytic time. It needs no new runtime, internet service or external artwork. Forward/backward seeks reproduce the same frame. PNG sequences, PNG stills, MP4 and the existing wallpaper export route use the same rendering entry point.

The new scenes use actual 3D coordinates, surface normals, perspective projection and depth sorting on Canvas. They do not expose general-purpose mesh editing/export or physically traced materials, and do not replace 3D Workshop. Rounded meshes use interpolated light across their faces. This is an illustrative lighting model. Overlap uses painter-style face sorting rather than a GPU depth buffer; intersecting ribbons at extreme camera settings may need further refinement. Detail increases drawing cost; reduce it if preview playback is slow. Performance on other PCs and graphics drivers still needs testing. Export checks do not establish real-time playback on every machine.

## Design references and originality

The supplied AI moodboard was used to identify broad qualities: depth, repeated objects, restrained colour, quiet space and a clear focal passage. No image, texture, named preset or scene layout from it is bundled. Geometry, shading, height functions and animation rules were written for Pulse. Common techniques cannot establish a guarantee that no existing artwork has a resemblance.

Implementation research:

- [The Book of Shaders: fBM and domain warping](https://thebookofshaders.com/13/) — background on multi-scale fields and displaced coordinates; no sample code copied.
- [Three.js InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html) — reference for efficient repeated-object rendering if a future GPU version is justified. This version does not add Three.js or its renderer.

Liquid chrome, ink and glass directions overlap the existing original flow and environment work. They were not added as duplicate families in this pass. A future material-world renderer should justify its own geometry, lighting and authoring controls before joining the catalogue.


### Depth refinement references

- [Three.js BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html): vertex positions and surface-normal concepts.
- [LatheGeometry](https://threejs.org/docs/pages/LatheGeometry.html): axial profile geometry as a reference for rounded forms.
- [TubeGeometry](https://threejs.org/docs/pages/TubeGeometry.html): curved 3D paths as a reference for continuous passages.

These are technique references. No Three.js implementation, reference assets or extra runtime was incorporated.
