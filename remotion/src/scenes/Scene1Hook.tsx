import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Audio,
  staticFile,
  Sequence,
} from "remotion";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing vignette
  const vignetteOpacity = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [0.3, 0.6]
  );

  // Text reveals with stagger
  const line1 = spring({ frame: frame - 15, fps, config: { damping: 18 } });
  const line2 = spring({ frame: frame - 45, fps, config: { damping: 18 } });
  const line3 = spring({ frame: frame - 90, fps, config: { damping: 15 } });

  // Commission counter that ticks up
  const counterFrame = Math.max(0, frame - 120);
  const commissionPercent = Math.min(
    20,
    Math.floor(interpolate(counterFrame, [0, 60], [0, 20], { extrapolateRight: "clamp" }))
  );

  // Red flash on "15%"
  const redFlash = interpolate(frame, [130, 140, 150], [0, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle drift
  const bgY = interpolate(frame, [0, 300], [0, -30]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, #1a0505 0%, #2D0808 40%, #4A0E0E 100%)`,
      }}
    >
      <Audio src={staticFile("voiceover/scene1-hook.mp3")} />

      {/* Animated grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201,150,42,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,150,42,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translateY(${bgY}px)`,
        }}
      />

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
        }}
      />

      {/* Red danger flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(180, 20, 20, ${redFlash})`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: 60,
          right: 60,
        }}
      >
        {/* Hook question */}
        <div
          style={{
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [40, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontSize: 72,
              fontWeight: 700,
              color: "#F5E6C0",
              lineHeight: 1.2,
              textShadow: "0 4px 30px rgba(201,150,42,0.3)",
            }}
          >
            Aapka Talent Hai...
          </div>
        </div>

        {/* Pain point */}
        <div
          style={{
            marginTop: 50,
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [40, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 48,
              fontWeight: 300,
              color: "rgba(245,230,192,0.7)",
              lineHeight: 1.4,
            }}
          >
            Par har booking pe
          </div>
        </div>

        {/* Commission counter */}
        <Sequence from={120}>
          <div
            style={{
              marginTop: 60,
              display: "flex",
              alignItems: "baseline",
              gap: 20,
            }}
          >
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 200,
                fontWeight: 900,
                color: "#E84040",
                lineHeight: 1,
                textShadow: "0 0 60px rgba(232,64,64,0.5)",
              }}
            >
              {commissionPercent}%
            </div>
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 42,
                fontWeight: 600,
                color: "rgba(245,230,192,0.6)",
              }}
            >
              COMMISSION
            </div>
          </div>
        </Sequence>

        {/* System line */}
        <div
          style={{
            marginTop: 80,
            opacity: line3,
            transform: `translateY(${interpolate(line3, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 36,
              fontWeight: 400,
              color: "rgba(232,64,64,0.9)",
              fontStyle: "italic",
              borderLeft: "4px solid #E84040",
              paddingLeft: 24,
            }}
          >
            Yeh system aapke against kaam karta hai.
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "linear-gradient(transparent, #1a0505)",
        }}
      />
    </AbsoluteFill>
  );
};
