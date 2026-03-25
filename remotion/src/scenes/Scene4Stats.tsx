import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const stats = [
  { num: "10,000+", label: "Monthly Searches" },
  { num: "500+", label: "Vendors Onboard" },
  { num: "₹0", label: "To Start Free" },
  { num: "0%", label: "Commission on Elite" },
];

export const Scene4Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 5, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #FFF8EE 0%, #FFF2DE 100%)",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 60px",
      }}>
        <div style={{
          fontSize: 28, fontWeight: 600,
          color: "#C9962A", letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          opacity: titleSpring,
          fontFamily: "sans-serif",
        }}>
          WHY KARLOSHAADI
        </div>

        <div style={{
          marginTop: 20, fontSize: 52, fontWeight: 800,
          color: "#4A0E0E", textAlign: "center" as const,
          lineHeight: 1.15,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
          fontFamily: "sans-serif",
        }}>
          Numbers That
          <br />
          <span style={{ color: "#C9962A", fontStyle: "italic" }}>Speak for Themselves</span>
        </div>

        <div style={{
          marginTop: 56,
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 20, width: "100%",
        }}>
          {stats.map((s, i) => {
            const cardSpring = spring({ frame: frame - 20 - i * 12, fps, config: { damping: 12, stiffness: 80 } });
            return (
              <div key={i} style={{
                background: "#FFFFFF",
                border: "2px solid rgba(201,150,42,0.3)",
                borderRadius: 20, padding: "36px 20px",
                textAlign: "center" as const,
                transform: `scale(${interpolate(cardSpring, [0, 1], [0.7, 1])})`,
                opacity: cardSpring,
                boxShadow: "0 8px 32px rgba(107,26,26,0.08)",
              }}>
                <div style={{
                  fontSize: 56, fontWeight: 800,
                  color: "#C9962A", lineHeight: 1,
                  fontFamily: "sans-serif",
                }}>{s.num}</div>
                <div style={{
                  marginTop: 8, fontSize: 18, fontWeight: 500,
                  color: "#6B4E2A", letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                  fontFamily: "sans-serif",
                }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
