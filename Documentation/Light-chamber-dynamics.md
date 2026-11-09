# Light chamber movement and response

Open a Light chambers scene in Visual workshop. Use **Speed** for continuous movement and **Reaction** for bass, beat and high-frequency light accents. Reaction changes fixture brightness and glow; it does not reshape the architectural outline.

Under Light architecture:

- **Camera / Gentle sideways parallax** moves near and distant structures differently. Its amount works for the canopy, rings and portals as well as the light columns. Flat arrangements keep the camera still.
- **Hold the camera still** preserves the viewpoint while light chases and music response can continue.
- **Travel** moves through portals and the canopy. The depth columns use a bounded forward/back drift.
- **Travelling light / dimmer contrast** controls the contrast and motion of bright bands along the fixtures. Zero removes the chase; Reaction can still make lights respond to the song.
- **Atmospheric light** and the main glow control shape the halo. Bass/beat accents also lift the glow.

The canopy uses longitudinal strips in perspective. The column banks are staggered at multiple depths with independently lit segments. All movement is sampled from time, so backward seeks and exact-frame exports do not depend on playback history.

For a restrained look, start with Reaction around 0.4–0.6, chase around 0.5 and moderate glow. Use a fixed camera to isolate the lighting behaviour; set Reaction to zero to compare the autonomous chase with the musical accents.
