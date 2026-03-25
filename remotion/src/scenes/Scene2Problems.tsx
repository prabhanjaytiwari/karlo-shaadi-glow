import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const problems = [
  { icon: "📵", text: "No Consistent Leads" },
  { icon: "💸", text: "15-20% Commission" },
  { icon: "📊", text: "No Analytics" },
  { icon: "🔍", text: "Zero Online Visibility" },
];

export const Scene2Problems: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 5, fps, config: { damping: 20 } });
  const bgPulse = interpolate(frame, [0, 60, 120], [0.08, 0.12, 0.08], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute", inset: 0,
        background: "#0F0F0F",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 30%, rgba(139,26,26,${bgPulse}) 0%, transparent 70%)`,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 60px",
      }}>
        <div style={{
          fontSize: 28, fontWeight: 600,
          color: "#E8B94A", letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
          fontFamily: "sans-serif",
        }}>
          SOUND FAMILIAR?
        </div>

        <div style={{
          marginTop: 24, fontSize: 56, fontWeight: 800,
          color: "#FFFFFF", textAlign: "center" as const,
          lineHeight: 1.15,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`,
          fontFamily: "sans-serif",
        }}>
          Problems Every
          <br />
          <span style={{ color: "#E8B94A" }}>Vendor Faces</span>
        </div>

        <div style={{
          marginTop: 56, display: "flex", flexDirection: "column", gap: 20, width: "100%",
        }}>
          {problems.map((p, i) => {
            const cardSpring = spring({ frame: frame - 25 - i * 10, fps, config: { damping: 15, stiffness: 120 } });
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 24,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: "24px 32px",
                transform: `translateX(${interpolate(cardSpring, [0, 1], [-80, 0])}px)`,
                opacity: cardSpring,
              }}>
                <span style={{ fontSize: 44 }}>{p.icon}</span>
                <span style={{
                  fontSize: 32, fontWeight: 600, color: "#FFFFFF",
                  fontFamily: "sans-serif",
                }}>{p.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
