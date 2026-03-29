import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 25, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const scale = interpolate(frame, [0, 60], [1.08, 1], { extrapolateRight: "clamp" });
  const ornamentScale = spring({ frame: frame - 10, fps, config: { damping: 30, stiffness: 80 } });

  const opacity = fadeIn * fadeOut;

  // Decorative line width animation
  const lineWidth = interpolate(frame, [15, 55], [0, 280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* OM symbol */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          fontSize: 80,
          color: "#D4AF37",
          opacity: ornamentScale * 0.6,
          transform: `scale(${ornamentScale})`,
          textShadow: "0 0 40px #D4AF3740",
        }}
      >
        ॐ
      </div>

      {/* Top decorative line */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          width: lineWidth,
          height: 1,
          background: "linear-gradient(90deg, transparent, #D4AF3780, transparent)",
        }}
      />

      {/* Main title */}
      <div
        style={{
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#D4AF37",
            lineHeight: 1.4,
            textShadow: "0 0 60px #D4AF3730, 0 4px 20px #00000080",
            fontFamily: "'Noto Sans Devanagari', sans-serif",
          }}
        >
          रामायण का असली
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#D4AF37",
            lineHeight: 1.4,
            textShadow: "0 0 60px #D4AF3730, 0 4px 20px #00000080",
            fontFamily: "'Noto Sans Devanagari', sans-serif",
          }}
        >
          उद्देश्य क्या है?
        </div>
      </div>

      {/* Bottom decorative line */}
      <div
        style={{
          position: "absolute",
          bottom: "40%",
          width: lineWidth,
          height: 1,
          background: "linear-gradient(90deg, transparent, #D4AF3780, transparent)",
        }}
      />
    </AbsoluteFill>
  );
};
