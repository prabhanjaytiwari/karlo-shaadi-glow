import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 3,
  speed: 0.3 + Math.random() * 0.7,
  delay: Math.random() * 200,
  opacity: 0.15 + Math.random() * 0.35,
}));

export const FloatingParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 1 }}>
      {PARTICLES.map((p) => {
        const progress = ((frame + p.delay) * p.speed * 0.3) % 200;
        const yPos = p.y - progress * 0.5;
        const xDrift = Math.sin((frame + p.delay) * 0.02 * p.speed) * 15;
        const fadeIn = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });
        const pulse = 0.6 + 0.4 * Math.sin((frame + p.delay) * 0.05);

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x + xDrift}%`,
              top: `${((yPos % 120) + 120) % 120}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, #D4AF37 0%, transparent 70%)`,
              opacity: p.opacity * fadeIn * pulse,
              boxShadow: `0 0 ${p.size * 3}px #D4AF3740`,
            }}
          />
        );
      })}
    </div>
  );
};
