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

export const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Golden reveal wipe from left
  const wipeX = interpolate(frame, [0, 30], [-1080, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipeOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tools list stagger
  const tools = [
    { name: "Smart CRM", icon: "📊", desc: "Lead pipeline management" },
    { name: "Digital Contracts", icon: "📝", desc: "Professional agreements" },
    { name: "Portfolio Mini-Site", icon: "🌐", desc: "SEO-optimized showcase" },
    { name: "Business Analytics", icon: "📈", desc: "Track your growth" },
    { name: "Invoice Generator", icon: "🧾", desc: "Professional billing" },
    { name: "WhatsApp Integration", icon: "💬", desc: "Direct client chat" },
  ];

  // Gold shimmer
  const shimmerX = interpolate(frame, [0, 300], [-200, 1200]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #1A0A00 0%, #2D1800 50%, #1A0A00 100%)",
        overflow: "hidden",
      }}
    >
      <Audio src={staticFile("voiceover/scene3-solution.mp3")} />

      {/* Gold shimmer sweep */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: shimmerX,
          width: 200,
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(201,150,42,0.08), transparent)",
          transform: "skewX(-20deg)",
        }}
      />

      {/* ZERO COMMISSION hero text */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: 60,
          right: 60,
          opacity: wipeOpacity,
          transform: `translateX(${wipeX * 0.1}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: 28,
            fontWeight: 500,
            color: "#C9962A",
            letterSpacing: 8,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          KarloShaadi
        </div>
        <div
          style={{
            fontFamily: "serif",
            fontSize: 80,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: "#2ECC71" }}>ZERO</span>
          <br />
          <span style={{ color: "#F5E6C0" }}>Commission</span>
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: "sans-serif",
            fontSize: 32,
            color: "rgba(245,230,192,0.6)",
            fontWeight: 300,
          }}
        >
          Aapki kamaai, puri aapki.
        </div>
      </div>

      {/* Tools grid */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: 40,
          right: 40,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {tools.map((tool, i) => {
            const s = spring({
              frame: frame - 60 - i * 12,
              fps,
              config: { damping: 14 },
            });
            return (
              <div
                key={i}
                style={{
                  opacity: s,
                  transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                  background: "rgba(201,150,42,0.06)",
                  border: "1px solid rgba(201,150,42,0.15)",
                  borderRadius: 14,
                  padding: "20px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 36 }}>{tool.icon}</div>
                <div
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#F5E6C0",
                  }}
                >
                  {tool.name}
                </div>
                <div
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 18,
                    color: "rgba(245,230,192,0.5)",
                  }}
                >
                  {tool.desc}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: "sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#2ECC71",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  FREE
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
