import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Pain } from "./scenes/Scene2Problems";
import { Scene3Solution } from "./scenes/Scene3Solution";
import { Scene4Proof } from "./scenes/Scene4Stats";
import { Scene5CTA } from "./scenes/Scene5CTA";

// Audio durations (30fps) with padding:
// Scene1: 13.47s = 404f → 420f
// Scene2: 11.05s = 332f → 345f
// Scene3: 11.33s = 340f → 355f
// Scene4: 11.24s = 337f → 350f
// Scene5:  6.59s = 198f → 215f
// Total: 1685 frames

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0D0404" }}>
      <Series>
        <Series.Sequence durationInFrames={420}>
          <Scene1Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={345}>
          <Scene2Pain />
        </Series.Sequence>
        <Series.Sequence durationInFrames={355}>
          <Scene3Solution />
        </Series.Sequence>
        <Series.Sequence durationInFrames={350}>
          <Scene4Proof />
        </Series.Sequence>
        <Series.Sequence durationInFrames={215}>
          <Scene5CTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
