import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Audio,
  staticFile,
} from "remotion";

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo slam entrance
  const logoSlam = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // Tagline reveal
  const tagline = spring({ frame: frame - 30, fps, config: { damping: 18 } });

  // CTA button pulse
  const ctaPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.95, 1.05]
  );
  const ctaOpacity = spring({ frame: frame - 60, fps, config: { damping: 15 } });

  // URL reveal
  const urlReveal = spring({ frame: frame - 90, fps, config: { damping: 20 } });

  // Bottom line
  const bottomLine = spring({ frame: frame - 130, fps, config: { damping: 18 } });

  // Particle burst on CTA
  const burstFrame = Math.max(0, frame - 60);

  // Gold rays
  const rayRotation = frame * 0.15;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #2D0808 0%, #4A0E0E 40%, #2D0808 100%)",
        overflow: "hidden",
      }}
    >
      <Audio src={staticFile("voiceover/scene5-cta.mp3")} />

      {/* Rotating gold rays */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 1200,
          height: 1200,
          transform: `translate(-50%, -50%) rotate(${rayRotation}deg)`,
          opacity: 0.06,
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 4,
              height: 600,
              background: "linear-gradient(to bottom, #C9962A, transparent)",
              transformOrigin: "top center",
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}
      </div>

      {/* Burst particles */}
      {burstFrame > 0 &&
        burstFrame < 60 &&
        [...Array(16)].map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const dist = interpolate(burstFrame, [0, 60], [0, 400]);
          const opacity = interpolate(burstFrame, [0, 20, 60], [0, 1, 0], {
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `calc(45% + ${Math.sin(angle) * dist}px)`,
                left: `calc(50% + ${Math.cos(angle) * dist}px)`,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#C9962A",
                opacity,
              }}
            />
          );
        })}

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Brand name */}
        <div
          style={{
            opacity: logoSlam,
            transform: `scale(${interpolate(logoSlam, [0, 1], [2, 1])})`,
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontSize: 90,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            <span style={{ color: "#C9962A" }}>Karlo</span>
            <span style={{ color: "#F5E6C0" }}>Shaadi</span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 30,
            opacity: tagline,
            transform: `translateY(${interpolate(tagline, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 36,
              fontWeight: 300,
              color: "rgba(245,230,192,0.7)",
              textAlign: "center",
            }}
          >
            Aapka Business, Aapke Rules
          </div>
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 70,
            opacity: ctaOpacity,
            transform: `scale(${ctaPulse})`,
          }}
        >
          <div
            style={{
              padding: "28px 70px",
              background: "linear-gradient(135deg, #C9962A, #E8B94A)",
              borderRadius: 60,
              boxShadow: "0 8px 40px rgba(201,150,42,0.4)",
            }}
          >
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: 32,
                fontWeight: 800,
                color: "#2D0808",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Register FREE Now
            </span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 40,
            opacity: urlReveal,
            transform: `translateY(${interpolate(urlReveal, [0, 1], [15, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 30,
              fontWeight: 600,
              color: "#C9962A",
              letterSpacing: 4,
            }}
          >
            KarloShaadi.com
          </div>
        </div>

        {/* Bottom guarantee */}
        <div
          style={{
            marginTop: 60,
            opacity: bottomLine,
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 22,
              color: "rgba(245,230,192,0.4)",
              textAlign: "center",
              letterSpacing: 2,
            }}
          >
            Zero Commission · Free Tools · Lifetime Price Lock
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
