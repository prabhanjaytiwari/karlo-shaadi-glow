import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Img,
  staticFile,
  Sequence,
} from "remotion";

// Scene 3: What's Inside - quick cuts of features (7s = 210 frames)
export const EventScene3Highlights: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const highlights = [
    {
      image: "images/event-fashion-show.jpg",
      label: "BRIDAL FASHION SHOW",
      sub: "Top Designers · Live Runway",
      startFrame: 0,
      dur: 65,
    },
    {
      image: "images/event-aerial.jpg",
      label: "500+ VENDORS",
      sub: "Photography · Decor · Catering · Music",
      startFrame: 65,
      dur: 65,
    },
    {
      image: "images/event-grand-venue.jpg",
      label: "LIVE EXPERIENCES",
      sub: "Food Tasting · Mehendi · DJ Night",
      startFrame: 130,
      dur: 80,
    },
  ];

  return (
    <AbsoluteFill style={{ background: "#080404" }}>
      {highlights.map((h, idx) => {
        const localFrame = frame - h.startFrame;
        if (localFrame < -5 || localFrame > h.dur + 5) return null;

        const imgEntry = interpolate(localFrame, [0, 15], [1.3, 1.1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const imgOp = interpolate(localFrame, [0, 10, h.dur - 10, h.dur], [0, 0.55, 0.55, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const textOp = interpolate(localFrame, [8, 20, h.dur - 15, h.dur - 5], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const textY = interpolate(localFrame, [8, 25], [40, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        // Slow pan
        const panX = interpolate(localFrame, [0, h.dur], [idx % 2 === 0 ? -30 : 30, idx % 2 === 0 ? 30 : -30]);

        // Gold accent line
        const lineW = interpolate(localFrame, [15, 40], [0, 300], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <AbsoluteFill key={idx}>
            {/* Image with Ken Burns */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `scale(${imgEntry}) translateX(${panX}px)`,
                opacity: imgOp,
              }}
            >
              <Img
                src={staticFile(h.image)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Dark overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(8,4,4,0.6) 0%, rgba(8,4,4,0.3) 40%, rgba(8,4,4,0.85) 100%)",
              }}
            />

            {/* Text block */}
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                left: 50,
                right: 50,
                opacity: textOp,
                transform: `translateY(${textY}px)`,
              }}
            >
              {/* Gold accent line */}
              <div
                style={{
                  width: lineW,
                  height: 3,
                  background: "#D4A853",
                  marginBottom: 20,
                }}
              />
              <div
                style={{
                  fontFamily: "serif",
                  fontSize: 56,
                  fontWeight: 900,
                  color: "#F5E6C0",
                  lineHeight: 1.1,
                  textShadow: "0 4px 30px rgba(0,0,0,0.8)",
                }}
              >
                {h.label}
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: "sans-serif",
                  fontSize: 24,
                  fontWeight: 300,
                  color: "rgba(212,168,83,0.7)",
                  letterSpacing: 2,
                }}
              >
                {h.sub}
              </div>
            </div>

            {/* Corner index */}
            <div
              style={{
                position: "absolute",
                top: "6%",
                right: 50,
                opacity: textOp * 0.3,
                fontFamily: "serif",
                fontSize: 120,
                fontWeight: 900,
                color: "#D4A853",
              }}
            >
              {String(idx + 1).padStart(2, "0")}
            </div>
          </AbsoluteFill>
        );
      })}

      {/* Floating gold dots */}
      {[...Array(8)].map((_, i) => {
        const y = interpolate(frame, [0, 210], [1920 + i * 100, -100 - i * 50]);
        const x = 60 + (i * 137) % 960;
        const op = interpolate(Math.sin(frame * 0.05 + i), [-1, 1], [0.05, 0.15]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#D4A853",
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
