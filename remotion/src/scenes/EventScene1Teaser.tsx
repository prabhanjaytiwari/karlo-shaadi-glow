import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

// Scene 1: Dark dramatic teaser opening (6s = 180 frames)
export const EventScene1Teaser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow pulsing dark background
  const bgPulse = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.02, 0.06]);

  // Gold particles converging to center
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const startDist = 900;
    const convergence = interpolate(frame, [20, 120], [startDist, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const x = Math.cos(angle + i * 0.3) * convergence;
    const y = Math.sin(angle + i * 0.3) * convergence;
    const op = interpolate(frame, [10 + i * 2, 40 + i * 2, 110, 130], [0, 0.8, 0.8, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const size = 3 + (i % 4) * 2;
    return { x, y, op, size };
  });

  // Flash at convergence
  const flashOp = interpolate(frame, [115, 125, 140], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "COMING SOON" text slam
  const slamScale = spring({ frame: frame - 125, fps, config: { damping: 10, stiffness: 150 } });
  const slamOp = interpolate(frame, [125, 135], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtitle fade
  const subOp = spring({ frame: frame - 150, fps, config: { damping: 18 } });

  // Horizontal gold lines sweeping
  const lineX1 = interpolate(frame, [0, 60], [-1200, 1200], { extrapolateRight: "clamp" });
  const lineX2 = interpolate(frame, [30, 90], [2200, -1200], { extrapolateRight: "clamp" });
  const lineOp = interpolate(frame, [0, 10, 80, 100], [0, 0.15, 0.15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Vignette
  const vigOp = interpolate(frame, [0, 60], [0.9, 0.6], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {/* Subtle radial pulse */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, rgba(201,150,42,${bgPulse}) 0%, transparent 60%)`,
        }}
      />

      {/* Sweeping gold lines */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: lineX1,
          width: 800,
          height: 1,
          background: "linear-gradient(90deg, transparent, #D4A853, transparent)",
          opacity: lineOp,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "65%",
          left: lineX2,
          width: 600,
          height: 1,
          background: "linear-gradient(90deg, transparent, #D4A853, transparent)",
          opacity: lineOp,
        }}
      />

      {/* Gold particles converging */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `calc(50% + ${p.y}px)`,
            left: `calc(50% + ${p.x}px)`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#D4A853",
            opacity: p.op,
            boxShadow: `0 0 ${p.size * 3}px rgba(212,168,83,0.6)`,
          }}
        />
      ))}

      {/* Flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(212,168,83,${flashOp}) 0%, transparent 50%)`,
        }}
      />

      {/* COMING SOON slam */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: slamOp,
          transform: `scale(${interpolate(slamScale, [0, 1], [3, 1])})`,
        }}
      >
        <div
          style={{
            fontFamily: "serif",
            fontSize: 72,
            fontWeight: 900,
            color: "#D4A853",
            letterSpacing: 20,
            textShadow: "0 0 80px rgba(212,168,83,0.5), 0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          COMING SOON
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subOp,
          transform: `translateY(${interpolate(subOp, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: 24,
            fontWeight: 300,
            color: "rgba(245,230,192,0.5)",
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          Something Massive Is Coming
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,${vigOp}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
