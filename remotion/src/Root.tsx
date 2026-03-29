import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { EventVideo } from "./EventVideo";
import { RamayanaVideo } from "./RamayanaVideo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={1670}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="event"
      component={EventVideo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="ramayana"
      component={RamayanaVideo}
      durationInFrames={1890}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
