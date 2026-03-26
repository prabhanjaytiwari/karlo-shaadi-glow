import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Img,
  staticFile,
} from "remotion";

// Scene 2: THE BIGGEST WEDDING EVENT OF INDIA - dramatic reveal (6s = 180 frames)
export const EventScene2Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background venue image with Ken Burns
  const imgScale = interpolate(frame, [0, 180], [1.2, 1.0]);
  const imgOp = interpolate(frame, [0, 30], [0, 0.5], { extrapolateRight: "clamp" });

  // Clip-path reveal from center
  const clipSize = interpolate(frame, [0, 40], [0, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title lines with staggered spring reveals
  const line1 = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 120 } });
  const line2 = spring({ frame: frame - 50, fps, config: { damping: 12, stiffness: 120 } });
  const line3 = spring({ frame: frame - 70, fps, config: { damping: 12, stiffness: 120 } });
  const line4 = spring({ frame: frame - 95, fps, config: { damping: 15 } });

  // Gold divider line animation
  const dividerW = interpolate(frame, [85, 120], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shimmer sweep
  const shimmerX = interpolate(frame, [60, 180], [-400, 1400]);

  // Bottom ornamental corners
  const cornerOp = spring({ frame: frame - 110, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0A0505 0%, #1A0A0A 50%, #0A0505 100%)",
      }}
    >
      {/* Background venue image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${imgScale})`,
          opacity: imgOp,
        }}
      >
        <Img
          src={staticFile("images/event-grand-venue.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Dark overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,5,5,0.8) 0%, rgba(10,5,5,0.4) 40%, rgba(10,5,5,0.9) 100%)",
        }}
      />

      {/* Shimmer sweep */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: shimmerX,
          width: 200,
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.08), transparent)",
          transform: "skewX(-15deg)",
        }}
      />

      {/* Main title block */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: 50,
          right: 50,
          textAlign: "center",
        }}
      >
        {/* THE */}
        <div
          style={{
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [60, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 36,
              fontWeight: 300,
              color: "rgba(245,230,192,0.5)",
              letterSpacing: 20,
              textTransform: "uppercase",
            }}
          >
            THE
          </span>
        </div>

        {/* BIGGEST */}
        <div
          style={{
            marginTop: 10,
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [60, 0])}px) scale(${interpolate(line2, [0, 1], [0.8, 1])})`,
          }}
        >
          <span
            style={{
              fontFamily: "serif",
              fontSize: 110,
              fontWeight: 900,
              color: "#D4A853",
              lineHeight: 1,
              textShadow: "0 0 60px rgba(212,168,83,0.4)",
            }}
          >
            BIGGEST
          </span>
        </div>

        {/* WEDDING EVENT */}
        <div
          style={{
            marginTop: 5,
            opacity: line3,
            transform: `translateY(${interpolate(line3, [0, 1], [60, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "serif",
              fontSize: 68,
              fontWeight: 700,
              color: "#F5E6C0",
              lineHeight: 1.1,
            }}
          >
            WEDDING
          </span>
          <br />
          <span
            style={{
              fontFamily: "serif",
              fontSize: 68,
              fontWeight: 700,
              color: "#F5E6C0",
              lineHeight: 1.1,
            }}
          >
            EVENT
          </span>
        </div>

        {/* Gold divider */}
        <div
          style={{
            marginTop: 25,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: dividerW,
              height: 2,
              background: "linear-gradient(90deg, transparent, #D4A853, transparent)",
            }}
          />
        </div>

        {/* OF INDIA */}
        <div
          style={{
            marginTop: 25,
            opacity: line4,
            transform: `translateY(${interpolate(line4, [0, 1], [30, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 42,
              fontWeight: 300,
              color: "rgba(245,230,192,0.6)",
              letterSpacing: 18,
              textTransform: "uppercase",
            }}
          >
            OF INDIA
          </span>
        </div>
      </div>

      {/* Ornamental corner accents */}
      {[
        { top: "auto", bottom: "8%", left: 40, right: "auto", rot: 0 },
        { top: "auto", bottom: "8%", left: "auto", right: 40, rot: 90 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 80,
            height: 80,
            opacity: cornerOp * 0.3,
            borderBottom: "2px solid #D4A853",
            borderLeft: i === 0 ? "2px solid #D4A853" : "none",
            borderRight: i === 1 ? "2px solid #D4A853" : "none",
          }}
        />
      ))}

      {/* Bottom presented by */}
      <div
        style={{
          position: "absolute",
          bottom: "4%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: cornerOp,
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 16,
            color: "rgba(245,230,192,0.3)",
            letterSpacing: 6,
          }}
        >
          PRESENTED BY
        </span>
        <div
          style={{
            marginTop: 8,
            fontFamily: "serif",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          <span style={{ color: "#D4A853" }}>Karlo</span>
          <span style={{ color: "#F5E6C0" }}>Shaadi</span>
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
