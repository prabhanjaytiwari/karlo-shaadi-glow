import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - 5, fps, config: { damping: 20 } });
  const btnSpring = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 80 } });
  const pulseScale = interpolate(
    Math.sin(frame * 0.08) * 0.5 + 0.5,
    [0, 1], [1, 1.04]
  );

  const glowOpacity = interpolate(
    Math.sin(frame * 0.06) * 0.5 + 0.5,
    [0, 1], [0.15, 0.3]
  );

  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(160deg, #2D0808 0%, #4A0E0E 50%, #8B1A1A 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, rgba(201,150,42,${glowOpacity}) 0%, transparent 60%)`,
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
          fontFamily: "sans-serif",
        }}>
          DON'T MISS OUT
        </div>

        <div style={{
          marginTop: 24, fontSize: 64, fontWeight: 800,
          color: "#FFFFFF", textAlign: "center" as const,
          lineHeight: 1.1,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`,
          fontFamily: "sans-serif",
        }}>
          Register
          <br />
          <span style={{ color: "#E8B94A", fontStyle: "italic" }}>Free Today</span>
        </div>

        <div style={{
          marginTop: 40,
          fontSize: 30,
          color: "rgba(255,255,255,0.6)",
          textAlign: "center" as const,
          lineHeight: 1.5,
          fontWeight: 300,
          opacity: titleSpring,
          fontFamily: "sans-serif",
        }}>
          First 100 vendors per city
          <br />
          get locked-in pricing forever
        </div>

        {/* CTA Button */}
        <div style={{
          marginTop: 56,
          background: "linear-gradient(135deg, #C9962A 0%, #E8B94A 100%)",
          borderRadius: 16,
          padding: "28px 64px",
          transform: `scale(${interpolate(btnSpring, [0, 1], [0.5, 1]) * pulseScale})`,
          opacity: btnSpring,
          boxShadow: "0 12px 40px rgba(201,150,42,0.5)",
        }}>
          <span style={{
            fontSize: 32, fontWeight: 700,
            color: "#4A0E0E", letterSpacing: "0.02em",
            fontFamily: "sans-serif",
          }}>
            🚀 KarloShaadi.com
          </span>
        </div>

        <div style={{
          marginTop: 24,
          fontSize: 20,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "sans-serif",
          opacity: btnSpring,
        }}>
          No credit card required
        </div>
      </div>
    </AbsoluteFill>
  );
};
