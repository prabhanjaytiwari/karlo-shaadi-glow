import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Audio,
  staticFile,
} from "remotion";

export const Scene4Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Countdown scarcity - slots remaining
  const slotsStart = 500;
  const slotsFilled = Math.min(
    437,
    Math.floor(interpolate(frame, [30, 200], [380, 437], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }))
  );
  const slotsLeft = slotsStart - slotsFilled;

  // Progress bar fill
  const barFill = interpolate(frame, [30, 200], [76, 87.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // City cards stagger
  const cityData = [
    { city: "Lucknow", vendors: 156, status: "Almost Full" },
    { city: "Delhi NCR", vendors: 189, status: "Filling Fast" },
    { city: "Kanpur", vendors: 92, status: "Slots Open" },
  ];

  // Urgency pulse
  const urgencyPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.7, 1]
  );

  // Lock icon animation
  const lockScale = spring({ frame: frame - 220, fps, config: { damping: 8 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #0A1628 0%, #0D2847 50%, #0A1628 100%)",
      }}
    >
      <Audio src={staticFile("voiceover/scene4-proof.mp3")} />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          width: 600,
          height: 600,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(201,150,42,0.1) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "6%",
          left: 60,
          right: 60,
        }}
      >
        {/* FOMO header */}
        <div
          style={{
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 24,
              fontWeight: 600,
              color: "#E84040",
              textTransform: "uppercase",
              letterSpacing: 6,
              marginBottom: 12,
            }}
          >
            ⚡ Limited Slots
          </div>
          <div
            style={{
              fontFamily: "serif",
              fontSize: 56,
              fontWeight: 700,
              color: "#F5E6C0",
              lineHeight: 1.2,
            }}
          >
            Pehle 500 Vendors Ko
            <br />
            <span style={{ color: "#C9962A" }}>Lifetime Price Lock</span>
          </div>
        </div>

        {/* Slots counter */}
        <div
          style={{
            marginTop: 50,
            padding: "32px 40px",
            background: "rgba(232, 64, 64, 0.08)",
            borderRadius: 20,
            border: `2px solid rgba(232, 64, 64, ${urgencyPulse * 0.3})`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 22,
                color: "rgba(245,230,192,0.6)",
              }}
            >
              Slots Remaining
            </div>
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 56,
                fontWeight: 900,
                color: "#E84040",
              }}
            >
              {slotsLeft}
            </div>
          </div>
          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: 16,
              background: "rgba(245,230,192,0.1)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${barFill}%`,
                height: "100%",
                background: "linear-gradient(90deg, #C9962A, #E84040)",
                borderRadius: 8,
              }}
            />
          </div>
        </div>

        {/* City cards */}
        <div style={{ marginTop: 40 }}>
          {cityData.map((c, i) => {
            const s = spring({
              frame: frame - 100 - i * 20,
              fps,
              config: { damping: 15 },
            });
            return (
              <div
                key={i}
                style={{
                  opacity: s,
                  transform: `translateX(${interpolate(s, [0, 1], [80, 0])}px)`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "24px 32px",
                  marginBottom: 12,
                  background: "rgba(201,150,42,0.05)",
                  borderRadius: 14,
                  border: "1px solid rgba(201,150,42,0.12)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: 30,
                      fontWeight: 700,
                      color: "#F5E6C0",
                    }}
                  >
                    {c.city}
                  </div>
                  <div
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: 20,
                      color: "rgba(245,230,192,0.5)",
                    }}
                  >
                    {c.vendors} vendors joined
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: c.status === "Almost Full" ? "#E84040" : "#C9962A",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {c.status}
                </div>
              </div>
            );
          })}
        </div>

        {/* Price lock badge */}
        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            opacity: lockScale,
            transform: `scale(${interpolate(lockScale, [0, 1], [0.5, 1])})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "18px 50px",
              background: "linear-gradient(135deg, #C9962A, #E8B94A)",
              borderRadius: 50,
            }}
          >
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#2D0808",
                letterSpacing: 2,
              }}
            >
              🔒 PRICE LOCKED FOREVER
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
