# Editing visuals and atmosphere

Choose **Scene & layers**, select a visual layer, then use its placement controls. Expand layer effects for brightness, contrast, saturation, hue and softness; timing controls set its window and fades. Scope says whether edits affect this scene or matching visual layers across the film. Locked scenes are excluded. Keeping a layer protects it from generation; you can still edit it manually.

**Build with artwork, type & shapes** selects an existing editable design or creates one above the visual. Imported images and manually added text/shapes appear above procedural visuals by default. Select the artwork to change that choice. Use PNG, SVG, GIF/APNG, sprite sheets, fonts and music from the suite; render other studios' projects to a supported format first. This is not a direct import of every native studio project.

**Atmosphere overlays…** in Layers opens sparks, fireflies, smoke and dust. Choose **Whole film** or **This scene** before adding one. Set density, size, motion, tint/colour role, blend and music response. Response zero keeps autonomous motion. Up to four overlays per scope sit independently of the visual stack. Film overlays sit above the scene composite, before lyrics and finishing effects. Scene overlays participate in scene transitions. Every change is live, undoable and saved with the project; Done closes the panel. Preview quality may reduce particle density without changing exports.

Try the four **Atmosphere overlay studies** in Example projects. They need no external media. Smoke uses soft procedural texture; particles use deterministic positions so scrubbing and export remain repeatable.

This preview also fixes an outgoing scene inheriting the next music section's motion and palette during a transition. Its own section context now continues through the fade, while the incoming scene uses its new section. No new render is needed to update a saved editable project.

## Workspace space and handles

Drag the divider beneath Layers down to give the list more room, or up to give the inspector more room. Arrow keys adjust a focused divider; double-click resets it. Your split is remembered. The scene strip also has a draggable divider above it; drag upward to make it taller. The list and selected-object inspector scroll separately.

Select an authored element on the main canvas or in Layers. Corner handles resize it proportionally; hold Alt to change width and height independently. The circular handle rotates; Shift constrains rotation to 15-degree increments. Dragging snaps to canvas/layer centres and edges. Alt temporarily bypasses snapping. Centre horizontally / vertically aligns to the canvas. Matching mask/highlight parts follow linked edits. Undo restores one complete gesture.

## One shared artwork group

Select an authored design visual and expand Reuse artwork. Sharing moves matching copies and their mask/highlight dependencies into one shared source. Existing per-scene visibility and layer fade windows are retained. Artwork/placement edits then affect every scene referencing that source; use Shared artwork → Choose scenes for scene visibility. Scene-specific timing and fades live in the shared artwork inspector. Visual workshop edits update the shared source, with an explicit button label. Sharing replaces differing geometry in matching copies with the selected source. Locked scenes are excluded when first sharing.

Shared groups count towards the existing four visual slots per scene, including mask/highlight layers. Scenes without room are disabled in the chooser. Keep a simple base plus your shared group when authoring. Duplicate individual edits first if you want unrelated artwork. Whole-film generation remains separate from shared artwork authoring.

## Movement speed from music

Select a visual layer and expand Movement speed from music. Choose beat pulses, bass, energy or treble and increase Extra speed from zero. This integrates acceleration over time: it changes tunnel travel and sway speed without teleporting their position on each beat. It is optional and repeatable on backward seeks. Fixture brightness/reaction remains a separate control.

## Finishing colour

Finish → Whole-film colour adjustment contains exposure, brightness, contrast, saturation and highlight compression. These run before scanlines/lens finishes. Neutral values cost no grading pass; enabled adjustments use one shared WebGL surface. Bypass or Reset restores the original result. Highlight compression restrains bright output but cannot recover source detail already clipped. Per-layer effects stay with the selected layer.

## Atmosphere character

Fireflies offer independent, double, grouped flashes or steady glow, plus flash rate, depth variation and short light trails. Embers are glowing particles without spark streaks. Particle movement can drift in one direction, wander, rise with curling drift or orbit; direction/spread/vertical centre refine the field. Smoke offers drifting haze or a directed plume, evolving procedural detail, billowing and depth/size variation. This is a lightweight layered effect, not a physical 3D fluid simulation. Texture atlases are cached and bounded; motion is evaluated from time so seeking is deterministic.
