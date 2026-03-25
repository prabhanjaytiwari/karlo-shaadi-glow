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

export const Scene2Pain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Money counter - shows ₹1,50,000 being lost
  const moneyLost = Math.min(
    150000,
    Math.floor(interpolate(frame, [30, 180], [0, 150000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
  );

  const formatMoney = (n: number) =>
    "₹" + n.toLocaleString("en-IN");

  // Staggered stat cards
  const card1 = spring({ frame: frame - 60, fps, config: { damping: 15 } });
  const card2 = spring({ frame: frame - 120, fps, config: { damping: 15 } });
  const card3 = spring({ frame: frame - 200, fps, config: { damping: 15 } });

  // Shake effect at counter milestones
  const shakeX =
    frame > 150 && frame < 165
      ? Math.sin(frame * 2.5) * 4
      : 0;

  // Background slow zoom
  const bgScale = interpolate(frame, [0, 378], [1, 1.08]);

  return (
    <AbsoluteFill
      style={{
        background: "#0D0404",
      }}
    >
      <Audio src={staticFile("voiceover/scene2-pain.mp3")} />

      {/* Background with slow zoom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, #2D0808 0%, #0D0404 70%)`,
          transform: `scale(${bgScale})`,
        }}
      />

      {/* Floating loss particles */}
      {[...Array(8)].map((_, i) => {
        const delay = i * 25;
        const y = interpolate(frame - delay, [0, 200], [1920, -100], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = 100 + (i * 137) % 880;
        const opacity = interpolate(frame - delay, [0, 50, 150, 200], [0, 0.3, 0.3, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontFamily: "sans-serif",
              fontSize: 28,
              color: `rgba(232, 64, 64, ${opacity})`,
              fontWeight: 700,
            }}
          >
            -₹{((i + 1) * 1500).toLocaleString("en-IN")}
          </div>
        );
      })}

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: 60,
          right: 60,
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: "serif",
            fontSize: 52,
            fontWeight: 700,
            color: "#F5E6C0",
            marginBottom: 40,
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Sochiye Kitna Paisa Jaata Hai...
        </div>

        {/* Big money counter */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 32,
              color: "rgba(245,230,192,0.5)",
              marginBottom: 12,
            }}
          >
            10 Bookings Mein Commission Lost
          </div>
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 120,
              fontWeight: 900,
              color: "#E84040",
              textShadow: "0 0 80px rgba(232,64,64,0.4)",
            }}
          >
            {formatMoney(moneyLost)}
          </div>
        </div>

        {/* Stat cards */}
        {[
          { label: "Per Booking Commission", value: "₹15,000", delay: card1, icon: "💸" },
          { label: "Response Time Guarantee", value: "NONE", delay: card2, icon: "⏰" },
          { label: "Your Data Ownership", value: "ZERO", delay: card3, icon: "🔒" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              opacity: item.delay,
              transform: `translateX(${interpolate(item.delay, [0, 1], [-60, 0])}px)`,
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "28px 36px",
              marginBottom: 20,
              background: "rgba(232, 64, 64, 0.08)",
              borderRadius: 16,
              border: "1px solid rgba(232, 64, 64, 0.2)",
            }}
          >
            <div style={{ fontSize: 48 }}>{item.icon}</div>
            <div>
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 24,
                  color: "rgba(245,230,192,0.5)",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#E84040",
                }}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
