import { AbsoluteFill, Sequence } from "remotion";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problems } from "./scenes/Scene2Problems";
import { Scene3Solution } from "./scenes/Scene3Solution";
import { Scene4Stats } from "./scenes/Scene4Stats";
import { Scene5CTA } from "./scenes/Scene5CTA";

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#1A0505" }}>
      <Sequence from={0} durationInFrames={120}>
        <Scene1Hook />
      </Sequence>
      <Sequence from={120} durationInFrames={120}>
        <Scene2Problems />
      </Sequence>
      <Sequence from={240} durationInFrames={120}>
        <Scene3Solution />
      </Sequence>
      <Sequence from={360} durationInFrames={120}>
        <Scene4Stats />
      </Sequence>
      <Sequence from={480} durationInFrames={120}>
        <Scene5CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
