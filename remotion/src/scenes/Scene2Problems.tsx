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

export const Scene2Pain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Money counter
  const moneyLost = Math.min(
    150000,
    Math.floor(interpolate(frame, [20, 160], [0, 150000], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }))
  );
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  // Shake at peak
  const shakeX = frame > 140 && frame < 160 ? Math.sin(frame * 3) * 5 : 0;

  // Stat cards staggered
  const c1 = spring({ frame: frame - 170, fps, config: { damping: 14 } });
  const c2 = spring({ frame: frame - 210, fps, config: { damping: 14 } });
  const c3 = spring({ frame: frame - 250, fps, config: { damping: 14 } });

  // Background image
  const bgOp = interpolate(frame, [0, 30], [0, 0.2], { extrapolateRight: "clamp" });
  const bgScale = interpolate(frame, [0, 345], [1.1, 1.0]);

  return (
    <AbsoluteFill style={{ background: "#0D0404" }}>
      <Audio src={staticFile("voiceover/scene2-pain-v3.mp3")} />

      {/* Background caterer image with dark overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: bgOp,
        transform: `scale(${bgScale})`,
      }}>
        <Img src={staticFile("images/vendor-caterer.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 30%, #2D0808 0%, #0D0404 70%)",
        opacity: 0.85,
      }} />

      {/* Floating loss particles */}
      {[...Array(6)].map((_, i) => {
        const delay = i * 30;
        const y = interpolate(frame - delay, [0, 200], [1920, -100], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const x = 80 + (i * 157) % 920;
        const op = interpolate(frame - delay, [0, 40, 140, 200], [0, 0.35, 0.35, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            fontFamily: "sans-serif", fontSize: 26, fontWeight: 700,
            color: `rgba(232,64,64,${op})`,
          }}>
            -₹{((i + 1) * 2500).toLocaleString("en-IN")}
          </div>
        );
      })}

      {/* Content */}
      <div style={{
        position: "absolute", top: "7%", left: 50, right: 50,
        transform: `translateX(${shakeX}px)`,
      }}>
        {/* Title */}
        <div style={{
          fontFamily: "serif", fontSize: 46, fontWeight: 700,
          color: "#F5E6C0", marginBottom: 30,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          10 Bookings Ka Hisaab...
        </div>

        {/* Big money counter */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{
            fontFamily: "sans-serif", fontSize: 26, color: "rgba(245,230,192,0.45)",
            marginBottom: 10, letterSpacing: 2,
          }}>
            TOTAL COMMISSION LOST
          </div>
          <div style={{
            fontFamily: "sans-serif", fontSize: 110, fontWeight: 900,
            color: "#E84040",
            textShadow: "0 0 100px rgba(232,64,64,0.4)",
          }}>
            {fmt(moneyLost)}
          </div>
        </div>

        {/* Stat cards */}
        {[
          { label: "Per Booking Commission", value: "₹15,000", s: c1, icon: "💸" },
          { label: "CRM / Analytics", value: "NONE", s: c2, icon: "📊" },
          { label: "Lead Guarantee", value: "ZERO", s: c3, icon: "🚫" },
        ].map((item, i) => (
          <div key={i} style={{
            opacity: item.s,
            transform: `translateX(${interpolate(item.s, [0, 1], [-50, 0])}px)`,
            display: "flex", alignItems: "center", gap: 20,
            padding: "22px 28px", marginBottom: 16,
            background: "rgba(232,64,64,0.08)",
            borderRadius: 14, border: "1px solid rgba(232,64,64,0.2)",
          }}>
            <div style={{ fontSize: 40 }}>{item.icon}</div>
            <div>
              <div style={{
                fontFamily: "sans-serif", fontSize: 20,
                color: "rgba(245,230,192,0.45)",
              }}>{item.label}</div>
              <div style={{
                fontFamily: "sans-serif", fontSize: 34, fontWeight: 800,
                color: "#E84040",
              }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
