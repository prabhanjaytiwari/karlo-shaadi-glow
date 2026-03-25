import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Audio,
  staticFile,
  Img,
} from "remotion";

export const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gold shimmer
  const shimmerX = interpolate(frame, [0, 355], [-300, 1400]);

  // Dashboard image entrance
  const dashEntry = spring({ frame: frame - 120, fps, config: { damping: 15 } });
  const dashScale = interpolate(dashEntry, [0, 1], [0.85, 1]);
  const dashY = interpolate(dashEntry, [0, 1], [80, 0]);

  // Tools grid
  const tools = [
    { name: "Smart CRM", icon: "📊" },
    { name: "Contracts", icon: "📝" },
    { name: "Mini-Site", icon: "🌐" },
    { name: "Analytics", icon: "📈" },
    { name: "Invoices", icon: "🧾" },
    { name: "WhatsApp", icon: "💬" },
  ];

  // Hero text
  const heroOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const heroY = interpolate(frame, [0, 25], [30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(170deg, #1A0A00 0%, #2D1800 50%, #1A0A00 100%)",
      overflow: "hidden",
    }}>
      <Audio src={staticFile("voiceover/scene3-solution-v3.mp3")} />

      {/* Gold shimmer sweep */}
      <div style={{
        position: "absolute", top: 0, left: shimmerX, width: 250, height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(201,150,42,0.1), transparent)",
        transform: "skewX(-20deg)",
      }} />

      {/* ZERO COMMISSION hero */}
      <div style={{
        position: "absolute", top: "5%", left: 50, right: 50,
        opacity: heroOp, transform: `translateY(${heroY}px)`,
      }}>
        <div style={{
          fontFamily: "sans-serif", fontSize: 22, fontWeight: 500,
          color: "#C9962A", letterSpacing: 8, textTransform: "uppercase",
          marginBottom: 12,
        }}>
          KarloShaadi
        </div>
        <div style={{ fontFamily: "serif", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          <span style={{ color: "#2ECC71" }}>ZERO</span>
          <br />
          <span style={{ color: "#F5E6C0" }}>Commission</span>
        </div>
        <div style={{
          marginTop: 16, fontFamily: "sans-serif", fontSize: 28,
          color: "rgba(245,230,192,0.55)", fontWeight: 300,
        }}>
          Aapki kamaai, puri aapki.
        </div>
      </div>

      {/* Dashboard preview with perspective */}
      <div style={{
        position: "absolute", top: "38%", left: "50%",
        transform: `translateX(-50%) translateY(${dashY}px) scale(${dashScale}) perspective(800px) rotateX(5deg)`,
        opacity: dashEntry, width: 900,
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 20px 80px rgba(201,150,42,0.2), 0 0 0 1px rgba(201,150,42,0.15)",
      }}>
        <Img src={staticFile("images/dashboard-preview.jpg")}
          style={{ width: "100%", display: "block" }} />
        {/* Glare overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)`,
        }} />
      </div>

      {/* Tools strip at bottom */}
      <div style={{
        position: "absolute", bottom: "6%", left: 30, right: 30,
        display: "flex", justifyContent: "space-around",
      }}>
        {tools.map((tool, i) => {
          const s = spring({ frame: frame - 160 - i * 8, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{
              opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 36, marginBottom: 8,
                background: "rgba(201,150,42,0.08)",
                borderRadius: 14, width: 70, height: 70,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(201,150,42,0.15)",
                margin: "0 auto",
              }}>{tool.icon}</div>
              <div style={{
                fontFamily: "sans-serif", fontSize: 16, fontWeight: 600,
                color: "#F5E6C0", marginTop: 6,
              }}>{tool.name}</div>
              <div style={{
                fontFamily: "sans-serif", fontSize: 13, fontWeight: 700,
                color: "#2ECC71", letterSpacing: 2, marginTop: 2,
              }}>FREE</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
