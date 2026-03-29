import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

export const Scene7Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const scale = interpolate(frame, [0, 50], [0.95, 1], { extrapolateRight: "clamp" });

  const textSpring = spring({ frame: frame - 10, fps, config: { damping: 30, stiffness: 80 } });
  const lineWidth = interpolate(frame, [20, 60], [0, 350], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = fadeIn * fadeOut;
  const glow = 0.3 + 0.15 * Math.sin(frame * 0.06);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        opacity,
        transform: `scale(${scale})`,
        gap: 40,
      }}
    >
      {/* Top ornament line */}
      <div
        style={{
          width: lineWidth,
          height: 1,
          background: "linear-gradient(90deg, transparent, #D4AF3780, transparent)",
        }}
      />

      {/* Main quote */}
      <div
        style={{
          textAlign: "center",
          padding: "0 80px",
          transform: `translateY(${interpolate(textSpring, [0, 1], [30, 0])}px)`,
          opacity: textSpring,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "#D4AF37",
            lineHeight: 1.5,
            textShadow: `0 0 ${60 * glow}px #D4AF3740, 0 4px 20px #00000080`,
            fontFamily: "'Noto Sans Devanagari', sans-serif",
          }}
        >
          राम को समझो...
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "#D4AF37",
            lineHeight: 1.5,
            marginTop: 10,
            textShadow: `0 0 ${60 * glow}px #D4AF3740, 0 4px 20px #00000080`,
            fontFamily: "'Noto Sans Devanagari', sans-serif",
          }}
        >
          जीवन बदल जाएगा
        </div>
      </div>

      {/* Bottom ornament line */}
      <div
        style={{
          width: lineWidth,
          height: 1,
          background: "linear-gradient(90deg, transparent, #D4AF3780, transparent)",
        }}
      />

      {/* OM */}
      <div
        style={{
          fontSize: 40,
          color: "#D4AF37",
          opacity: interpolate(frame, [30, 60], [0, 0.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          marginTop: 20,
        }}
      >
        🙏
      </div>
    </AbsoluteFill>
  );
};
