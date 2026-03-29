import React from "react";
import { AbsoluteFill, Series, Audio, Video, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Scene1Intro } from "./ramayana/Scene1Intro";
import { QAScene } from "./ramayana/QAScene";
import { Scene7Outro } from "./ramayana/Scene7Outro";

const QA_DATA = [
  {
    question: "रामायण का लक्ष्य कितने वर्षों तक है?",
    answers: [
      "रामायण का लक्ष्य लगभग अठारह वर्षों का",
      "एक जीवन अनुशासन है...",
      "जिसमें व्यक्ति अपने जीवन में धर्म,",
      "सत्य और मर्यादा को स्थापित करता है...",
    ],
    audio: "voiceover/scene2-qa1.mp3",
    video: "videos/scene2-meditation.mp4",
    image: "images/scene2-ram-meditation.jpg",
    durationInFrames: 465,
  },
  {
    question: "अखण्ड रामायण पाठ की प्रेरणा क्या है?",
    answers: [
      "इसकी प्रेरणा माता-पिता के संस्कारों",
      "और उनकी स्मृतियों से मिली है...",
      "जो जीवन को राम के मार्ग पर",
      "चलने की शक्ति देती हैं...",
    ],
    audio: "voiceover/scene3-qa2.mp3",
    video: "videos/scene3-scripture.mp4",
    image: "images/scene3-scripture.jpg",
    durationInFrames: 468,
  },
  {
    question: "हिन्दुओं को इसमें क्यों शामिल होना चाहिए?",
    answers: [
      "क्योंकि श्रीराम और माता सीता ने हमें",
      "आदर्श जीवन जीने का मार्ग दिखाया है...",
      "उनके सिद्धांत हर व्यक्ति को अपने",
      "जीवन में अपनाने चाहिए...",
    ],
    audio: "voiceover/scene4-qa3.mp3",
    video: "videos/scene4-ram-sita.mp4",
    image: "images/scene4-ram-sita.jpg",
    durationInFrames: 434,
  },
  {
    question: "रामायण का मुख्य उद्देश्य क्या है?",
    answers: [
      "रामायण का मुख्य उद्देश्य है...",
      "एक सुसंस्कृत, मर्यादित और",
      "संतुलित जीवन जीना...",
      "और पूरे विश्व को एक परिवार",
      "के रूप में देखना...",
    ],
    audio: "voiceover/scene5-qa4.mp3",
    video: "videos/scene5-universal.mp4",
    image: "images/scene5-universal.jpg",
    durationInFrames: 486,
  },
  {
    question: "ओम मूल रामायण का सरल उद्देश्य क्या है?",
    answers: [
      "इसका उद्देश्य है...",
      "शांति, संतोष और मानवता को",
      "बढ़ावा देना...",
      "और रामायण के ज्ञान को",
      "हर व्यक्ति तक पहुँचाना...",
    ],
    audio: "voiceover/scene6-qa5.mp3",
    video: "videos/scene6-peace.mp4",
    image: "images/scene6-peace.jpg",
    durationInFrames: 381,
  },
];

export const RamayanaVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <Series>
        <Series.Sequence durationInFrames={149}>
          <Scene1Intro />
          <Audio src={staticFile("voiceover/scene1-intro.mp3")} />
        </Series.Sequence>

        {QA_DATA.map((qa, i) => (
          <Series.Sequence key={i} durationInFrames={qa.durationInFrames}>
            <QAScene
              question={qa.question}
              answers={qa.answers}
              questionNumber={i + 1}
              videoSrc={qa.video}
              imageSrc={qa.image}
            />
            <Audio src={staticFile(qa.audio)} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={78}>
          <Scene7Outro />
          <Audio src={staticFile("voiceover/scene7-outro.mp3")} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
