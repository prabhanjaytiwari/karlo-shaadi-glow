import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const tools = [
  { icon: "📋", label: "Dashboard" },
  { icon: "📊", label: "Analytics" },
  { icon: "🖼️", label: "Portfolio" },
  { icon: "📅", label: "Calendar" },
  { icon: "💬", label: "Enquiries" },
  { icon: "🔔", label: "Lead Alerts" },
];

export const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 5, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(160deg, #2D0808 0%, #4A0E0E 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 70% 30%, rgba(201,150,42,0.1) 0%, transparent 60%)",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 50px",
      }}>
        <div style={{
          fontSize: 28, fontWeight: 600,
          color: "#E8B94A", letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          opacity: titleSpring,
          fontFamily: "sans-serif",
        }}>
          YOUR TOOLKIT
        </div>

        <div style={{
          marginTop: 20, fontSize: 52, fontWeight: 800,
          color: "#FFFFFF", textAlign: "center" as const,
          lineHeight: 1.15,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
          fontFamily: "sans-serif",
        }}>
          Everything to
          <br />
          <span style={{ color: "#E8B94A", fontStyle: "italic" }}>Grow Your Business</span>
        </div>

        <div style={{
          marginTop: 48,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16, width: "100%",
        }}>
          {tools.map((t, i) => {
            const s = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 14, stiffness: 100 } });
            const float = Math.sin((frame + i * 20) * 0.05) * 3;
            return (
              <div key={i} style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(201,150,42,0.2)",
                borderRadius: 20, padding: "32px 16px",
                transform: `scale(${interpolate(s, [0, 1], [0.8, 1])}) translateY(${float}px)`,
                opacity: s,
              }}>
                <span style={{ fontSize: 52 }}>{t.icon}</span>
                <span style={{
                  marginTop: 12, fontSize: 22, fontWeight: 600,
                  color: "#FFFFFF", fontFamily: "sans-serif",
                }}>{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
