import React from "react";
import { AbsoluteFill, Series, Audio, staticFile } from "remotion";
import { EventScene1Teaser } from "./scenes/EventScene1Teaser";
import { EventScene2Reveal } from "./scenes/EventScene2Reveal";
import { EventScene3Highlights } from "./scenes/EventScene3Highlights";
import { EventScene4Date } from "./scenes/EventScene4Date";
import { EventScene5Brand } from "./scenes/EventScene5Brand";

// 30s event promo: 180+180+210+180+150 = 900 frames @ 30fps
export const EventVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <Audio src={staticFile("audio/event-bgm.mp3")} volume={0.7} />
      <Series>
        <Series.Sequence durationInFrames={180}>
          <EventScene1Teaser />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <EventScene2Reveal />
        </Series.Sequence>
        <Series.Sequence durationInFrames={210}>
          <EventScene3Highlights />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <EventScene4Date />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <EventScene5Brand />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
