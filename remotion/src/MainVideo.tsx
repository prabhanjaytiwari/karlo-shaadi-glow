import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Pain } from "./scenes/Scene2Problems";
import { Scene3Solution } from "./scenes/Scene3Solution";
import { Scene4Proof } from "./scenes/Scene4Stats";
import { Scene5CTA } from "./scenes/Scene5CTA";

// Audio durations (with ~15 frame padding each for breathing room):
// Scene1: 10.08s = 302f → 320f
// Scene2: 12.59s = 378f → 395f
// Scene3: 10.50s = 315f → 330f
// Scene4: 10.54s = 316f → 335f
// Scene5:  9.10s = 273f → 290f
// Total: ~1670 frames

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0D0404" }}>
      <Series>
        <Series.Sequence durationInFrames={320}>
          <Scene1Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={395}>
          <Scene2Pain />
        </Series.Sequence>
        <Series.Sequence durationInFrames={330}>
          <Scene3Solution />
        </Series.Sequence>
        <Series.Sequence durationInFrames={335}>
          <Scene4Proof />
        </Series.Sequence>
        <Series.Sequence durationInFrames={290}>
          <Scene5CTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
