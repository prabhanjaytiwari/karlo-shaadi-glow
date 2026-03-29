import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

interface QASceneProps {
  question: string;
  answers: string[];
  questionNumber: number;
}

export const QAScene: React.FC<QASceneProps> = ({ question, answers, questionNumber }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene fade in/out
  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  // Question animation
  const qSpring = spring({ frame: frame - 5, fps, config: { damping: 25, stiffness: 120 } });
  const qY = interpolate(qSpring, [0, 1], [40, 0]);

  // Decorative line
  const lineW = interpolate(frame, [10, 50], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Answer lines - staggered appearance
  const answerStartFrame = 60; // answers start appearing after question settles
  const framePerLine = 50; // frames between each line

  return (
    <AbsoluteFill style={{ opacity, display: "flex", flexDirection: "column", padding: "0 70px" }}>
      {/* Question number badge */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: "50%",
          transform: `translateX(-50%) scale(${qSpring})`,
          width: 50,
          height: 50,
          borderRadius: "50%",
          border: "1.5px solid #D4AF3760",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#D4AF3790",
          fontSize: 20,
          fontWeight: 300,
          fontFamily: "sans-serif",
        }}
      >
        {questionNumber}
      </div>

      {/* Question */}
      <div
        style={{
          marginTop: 280,
          textAlign: "center",
          transform: `translateY(${qY}px)`,
          opacity: qSpring,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#D4AF37",
            lineHeight: 1.5,
            textShadow: "0 0 40px #D4AF3725",
            fontFamily: "'Noto Sans Devanagari', sans-serif",
          }}
        >
          {question}
        </div>
      </div>

      {/* Decorative separator */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 40,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: lineW,
            height: 1,
            background: "linear-gradient(90deg, transparent, #D4AF3760, transparent)",
          }}
        />
      </div>

      {/* "उत्तर:" label */}
      <div
        style={{
          textAlign: "center",
          opacity: interpolate(frame, [answerStartFrame - 15, answerStartFrame], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 28,
          color: "#D4AF3780",
          fontFamily: "'Noto Sans Devanagari', sans-serif",
          marginBottom: 30,
          fontWeight: 600,
          letterSpacing: 4,
        }}
      >
        उत्तर
      </div>

      {/* Answer lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
        {answers.map((line, i) => {
          const lineStart = answerStartFrame + i * framePerLine;
          const lineFade = interpolate(frame, [lineStart, lineStart + 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const lineY = interpolate(frame, [lineStart, lineStart + 25], [20, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Active line highlighting
          const isActive =
            frame >= lineStart &&
            (i === answers.length - 1 || frame < answerStartFrame + (i + 1) * framePerLine + 15);
          const brightness = isActive ? 1 : 0.55;

          return (
            <div
              key={i}
              style={{
                fontSize: 36,
                fontWeight: 400,
                color: `rgba(212, 175, 55, ${brightness})`,
                lineHeight: 1.6,
                textAlign: "center",
                opacity: lineFade,
                transform: `translateY(${lineY}px)`,
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                maxWidth: 900,
                textShadow: isActive ? "0 0 30px #D4AF3720" : "none",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
