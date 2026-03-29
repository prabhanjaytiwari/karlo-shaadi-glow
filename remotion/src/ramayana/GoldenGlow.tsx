import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const GoldenGlow: React.FC = () => {
  const frame = useCurrentFrame();

  const pulse1 = 0.03 + 0.015 * Math.sin(frame * 0.015);
  const pulse2 = 0.025 + 0.01 * Math.sin(frame * 0.02 + 1.5);
  const rotation = frame * 0.02;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
      {/* Subtle warm gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, #1a140a 0%, #0a0a0a 50%, #050505 100%)`,
        }}
      />
      {/* Top golden glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "20%",
          width: "60%",
          height: "50%",
          borderRadius: "50%",
          background: `radial-gradient(circle, #D4AF3715 0%, transparent 70%)`,
          opacity: pulse1 * 10,
          filter: "blur(80px)",
        }}
      />
      {/* Bottom subtle glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "30%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: `radial-gradient(circle, #D4AF3710 0%, transparent 70%)`,
          opacity: pulse2 * 10,
          filter: "blur(60px)",
        }}
      />
      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, #000000aa 100%)`,
        }}
      />
    </div>
  );
};
