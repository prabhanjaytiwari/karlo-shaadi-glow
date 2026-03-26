import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";

// Scene 5: KarloShaadi branding close (5s = 150 frames)
export const EventScene5Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo slam with overshoot
  const logoSlam = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 200 } });

  // Tagline
  const tagOp = spring({ frame: frame - 35, fps, config: { damping: 18 } });

  // Hashtag
  const hashOp = spring({ frame: frame - 60, fps, config: { damping: 20 } });

  // Website URL
  const urlOp = spring({ frame: frame - 80, fps, config: { damping: 18 } });

  // Registration CTA
  const regOp = spring({ frame: frame - 100, fps, config: { damping: 15 } });
  const regPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.96, 1.04]);

  // Rotating gold rays
  const rayRot = frame * 0.15;

  // Gold burst particles on logo slam
  const burstFrame = Math.max(0, frame - 10);
  const burstParticles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const dist = interpolate(burstFrame, [0, 40], [0, 300], { extrapolateRight: "clamp" });
    const op = interpolate(burstFrame, [0, 10, 40], [0, 0.6, 0], { extrapolateRight: "clamp" });
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      op,
    };
  });

  // Shimmer
  const shimmerX = interpolate(frame, [20, 150], [-400, 1500]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #0A0505 0%, #1A0A08 40%, #0A0505 100%)",
        overflow: "hidden",
      }}
    >
      {/* Rotating rays */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 1400,
          height: 1400,
          transform: `translate(-50%, -50%) rotate(${rayRot}deg)`,
          opacity: 0.04,
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 3,
              height: 700,
              background: "linear-gradient(to bottom, #D4A853, transparent)",
              transformOrigin: "top center",
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}
      </div>

      {/* Burst particles */}
      {burstFrame > 0 &&
        burstFrame < 45 &&
        burstParticles.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `calc(38% + ${p.y}px)`,
              left: `calc(50% + ${p.x}px)`,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#D4A853",
              opacity: p.op,
              boxShadow: "0 0 10px rgba(212,168,83,0.5)",
            }}
          />
        ))}

      {/* Shimmer sweep */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: shimmerX,
          width: 150,
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.06), transparent)",
          transform: "skewX(-15deg)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 50px",
        }}
      >
        {/* Brand logo */}
        <div
          style={{
            opacity: logoSlam,
            transform: `scale(${interpolate(logoSlam, [0, 1], [3, 1])})`,
          }}
        >
          <div style={{ fontFamily: "serif", fontSize: 90, fontWeight: 700, textAlign: "center" }}>
            <span style={{ color: "#D4A853" }}>Karlo</span>
            <span style={{ color: "#F5E6C0" }}>Shaadi</span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 15,
            opacity: tagOp,
            transform: `translateY(${interpolate(tagOp, [0, 1], [15, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 28,
              fontWeight: 300,
              color: "rgba(245,230,192,0.5)",
              letterSpacing: 4,
            }}
          >
            Presents
          </span>
        </div>

        {/* Event name */}
        <div
          style={{
            marginTop: 40,
            opacity: hashOp,
            transform: `translateY(${interpolate(hashOp, [0, 1], [20, 0])}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontSize: 48,
              fontWeight: 700,
              color: "#D4A853",
              lineHeight: 1.2,
            }}
          >
            The Biggest Wedding
          </div>
          <div
            style={{
              fontFamily: "serif",
              fontSize: 48,
              fontWeight: 700,
              color: "#F5E6C0",
              lineHeight: 1.2,
            }}
          >
            Event of India
          </div>
        </div>

        {/* Registration CTA */}
        <div
          style={{
            marginTop: 50,
            opacity: regOp,
            transform: `scale(${regPulse})`,
          }}
        >
          <div
            style={{
              padding: "22px 55px",
              background: "linear-gradient(135deg, #D4A853, #E8B94A)",
              borderRadius: 50,
              boxShadow: "0 8px 50px rgba(212,168,83,0.4)",
            }}
          >
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: 26,
                fontWeight: 800,
                color: "#1A0A08",
                letterSpacing: 3,
              }}
            >
              REGISTER NOW
            </span>
          </div>
        </div>

        {/* Website */}
        <div
          style={{
            marginTop: 25,
            opacity: urlOp,
            transform: `translateY(${interpolate(urlOp, [0, 1], [10, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 26,
              fontWeight: 600,
              color: "#D4A853",
              letterSpacing: 4,
            }}
          >
            KarloShaadi.com
          </span>
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: "6%",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: urlOp * 0.5,
          }}
        >
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 16,
              color: "rgba(245,230,192,0.3)",
              letterSpacing: 4,
            }}
          >
            MAY 2026 · LUCKNOW · FREE ENTRY
          </span>
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
