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

// Scene 4: MAY 2026 date reveal (6s = 180 frames)
export const EventScene4Date: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background invite card
  const bgOp = interpolate(frame, [0, 30], [0, 0.35], { extrapolateRight: "clamp" });
  const bgScale = interpolate(frame, [0, 180], [1.15, 1.0]);

  // "SAVE THE DATE" header
  const headerOp = spring({ frame: frame - 10, fps, config: { damping: 18 } });

  // Month reveal - clip from bottom
  const monthReveal = interpolate(frame, [30, 60], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Year slam
  const yearSlam = spring({ frame: frame - 55, fps, config: { damping: 8, stiffness: 180 } });

  // Divider
  const divW = interpolate(frame, [70, 100], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Details stagger
  const d1 = spring({ frame: frame - 90, fps, config: { damping: 15 } });
  const d2 = spring({ frame: frame - 105, fps, config: { damping: 15 } });
  const d3 = spring({ frame: frame - 120, fps, config: { damping: 15 } });

  // Pulsing glow behind month
  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.15, 0.35]);

  // Floating rose petals
  const petals = Array.from({ length: 10 }, (_, i) => {
    const speed = 0.8 + (i % 3) * 0.4;
    const y = interpolate(frame * speed, [0, 300], [-100 + i * 200, 2100]);
    const x = 80 + (i * 113) % 920;
    const rot = frame * (1 + i * 0.3);
    const op = interpolate(y, [0, 400, 1600, 2000], [0, 0.2, 0.2, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x, y: y % 2100, rot, op };
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #1A0808 0%, #2D1012 50%, #1A0808 100%)",
      }}
    >
      {/* Background invite image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: bgOp,
          transform: `scale(${bgScale})`,
        }}
      >
        <Img
          src={staticFile("images/event-invite.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, rgba(26,8,8,0.6) 0%, rgba(26,8,8,0.95) 70%)",
        }}
      />

      {/* Rose petals */}
      {petals.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: 12,
            height: 8,
            borderRadius: "50% 0 50% 0",
            background: `rgba(196, 30, 58, ${p.op})`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}

      {/* Glow behind month */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 500,
          height: 300,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(212,168,83,${glowPulse}) 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: 50,
          right: 50,
          textAlign: "center",
        }}
      >
        {/* SAVE THE DATE */}
        <div
          style={{
            opacity: headerOp,
            transform: `translateY(${interpolate(headerOp, [0, 1], [30, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 22,
              fontWeight: 600,
              color: "#D4A853",
              letterSpacing: 12,
              textTransform: "uppercase",
            }}
          >
            SAVE THE DATE
          </span>
        </div>

        {/* MAY */}
        <div
          style={{
            marginTop: 40,
            overflow: "hidden",
            height: 180,
          }}
        >
          <div
            style={{
              transform: `translateY(${monthReveal}%)`,
            }}
          >
            <span
              style={{
                fontFamily: "serif",
                fontSize: 180,
                fontWeight: 900,
                color: "#D4A853",
                lineHeight: 1,
                textShadow: "0 0 80px rgba(212,168,83,0.4), 0 8px 30px rgba(0,0,0,0.6)",
              }}
            >
              MAY
            </span>
          </div>
        </div>

        {/* 2026 */}
        <div
          style={{
            marginTop: 0,
            opacity: yearSlam,
            transform: `scale(${interpolate(yearSlam, [0, 1], [2.5, 1])})`,
          }}
        >
          <span
            style={{
              fontFamily: "serif",
              fontSize: 90,
              fontWeight: 300,
              color: "#F5E6C0",
              letterSpacing: 30,
            }}
          >
            2026
          </span>
        </div>

        {/* Gold divider */}
        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: divW,
              height: 1,
              background: "linear-gradient(90deg, transparent, #D4A853, transparent)",
            }}
          />
        </div>

        {/* Details */}
        <div style={{ marginTop: 50 }}>
          {[
            { text: "📍 Grand Venue, Lucknow", s: d1 },
            { text: "🎪 2 Days of Celebration", s: d2 },
            { text: "🎟️ Free Entry for All", s: d3 },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom: 20,
                opacity: item.s,
                transform: `translateY(${interpolate(item.s, [0, 1], [25, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 30,
                  fontWeight: 400,
                  color: "rgba(245,230,192,0.7)",
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
