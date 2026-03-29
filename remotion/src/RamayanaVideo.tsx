import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { GoldenGlow } from "./ramayana/GoldenGlow";
import { FloatingParticles } from "./ramayana/FloatingParticles";
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
  },
  {
    question: "अखण्ड रामायण पाठ की प्रेरणा क्या है?",
    answers: [
      "इसकी प्रेरणा माता-पिता के संस्कारों",
      "और उनकी स्मृतियों से मिली है...",
      "जो जीवन को राम के मार्ग पर",
      "चलने की शक्ति देती हैं...",
    ],
  },
  {
    question: "हिन्दुओं को इसमें क्यों शामिल होना चाहिए?",
    answers: [
      "क्योंकि श्रीराम और माता सीता ने हमें",
      "आदर्श जीवन जीने का मार्ग दिखाया है...",
      "उनके सिद्धांत हर व्यक्ति को अपने",
      "जीवन में अपनाने चाहिए...",
    ],
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
  },
];

// Timing: Intro 105f, 5 QAs × 330f, Outro 135f = 1890 frames = 63s
export const RamayanaVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      {/* Persistent layers */}
      <GoldenGlow />
      <FloatingParticles />

      {/* Scene sequence */}
      <Series>
        <Series.Sequence durationInFrames={105}>
          <Scene1Intro />
        </Series.Sequence>

        {QA_DATA.map((qa, i) => (
          <Series.Sequence key={i} durationInFrames={330}>
            <QAScene question={qa.question} answers={qa.answers} questionNumber={i + 1} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={135}>
          <Scene7Outro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
