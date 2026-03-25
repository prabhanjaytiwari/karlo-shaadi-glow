import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 120], [1.15, 1], { extrapolateRight: "clamp" });
  const overlayOpacity = interpolate(frame, [0, 30], [0, 0.85], { extrapolateRight: "clamp" });

  const badgeY = spring({ frame: frame - 15, fps, config: { damping: 18, stiffness: 120 } });
  const titleY = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 100 } });
  const subY = spring({ frame: frame - 50, fps, config: { damping: 20, stiffness: 100 } });
  const lineScale = spring({ frame: frame - 70, fps, config: { damping: 25, stiffness: 150 } });

  const shimmer = interpolate(frame, [0, 120], [-200, 200], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Animated gradient background */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(160deg, #2D0808 0%, #4A0E0E 40%, #8B1A1A 100%)`,
        transform: `scale(${bgScale})`,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 30% 70%, rgba(201,150,42,0.15) 0%, transparent 60%)`,
        opacity: overlayOpacity,
      }} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 60px",
      }}>
        {/* Badge */}
        <div style={{
          background: "rgba(201,150,42,0.2)",
          border: "1px solid rgba(201,150,42,0.5)",
          borderRadius: 100, padding: "12px 28px",
          fontSize: 22, fontWeight: 600,
          color: "#E8B94A", letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          transform: `translateY(${interpolate(badgeY, [0, 1], [40, 0])}px)`,
          opacity: badgeY,
          fontFamily: "sans-serif",
        }}>
          🔥 WEDDING VENDORS
        </div>

        {/* Main title */}
        <div style={{
          marginTop: 48,
          fontSize: 82,
          fontWeight: 800,
          color: "#FFFFFF",
          textAlign: "center" as const,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          transform: `translateY(${interpolate(titleY, [0, 1], [60, 0])}px)`,
          opacity: titleY,
          fontFamily: "sans-serif",
        }}>
          Apna Business
          <br />
          <span style={{ color: "#E8B94A", fontStyle: "italic" }}>10x Karo</span>
        </div>

        {/* Subtitle */}
        <div style={{
          marginTop: 36,
          fontSize: 34,
          color: "rgba(255,255,255,0.7)",
          textAlign: "center" as const,
          lineHeight: 1.5,
          fontWeight: 300,
          maxWidth: 700,
          transform: `translateY(${interpolate(subY, [0, 1], [40, 0])}px)`,
          opacity: subY,
          fontFamily: "sans-serif",
        }}>
          Zero Commission
          <br />
          Unlimited Leads
        </div>

        {/* Gold line */}
        <div style={{
          marginTop: 48,
          width: 200,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, transparent, #E8B94A, transparent)`,
          transform: `scaleX(${lineScale})`,
          opacity: lineScale,
        }} />

        {/* Shimmer accent */}
        <div style={{
          position: "absolute",
          top: "20%", left: shimmer, width: 2, height: "60%",
          background: "linear-gradient(180deg, transparent, rgba(201,150,42,0.3), transparent)",
          filter: "blur(20px)",
        }} />
      </div>
    </AbsoluteFill>
  );
};
