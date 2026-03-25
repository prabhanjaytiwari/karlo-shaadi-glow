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
  Sequence,
} from "remotion";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns on hero image
  const imgScale = interpolate(frame, [0, 420], [1.15, 1.0]);
  const imgY = interpolate(frame, [0, 420], [-40, 20]);
  const imgOpacity = interpolate(frame, [0, 20], [0, 0.45], { extrapolateRight: "clamp" });

  // Text reveals
  const line1 = spring({ frame: frame - 10, fps, config: { damping: 18 } });
  const line2 = spring({ frame: frame - 50, fps, config: { damping: 18 } });
  const line3 = spring({ frame: frame - 100, fps, config: { damping: 15 } });

  // Commission counter
  const counterStart = 140;
  const counterFrame = Math.max(0, frame - counterStart);
  const commission = Math.min(20, Math.floor(interpolate(counterFrame, [0, 50], [0, 20], { extrapolateRight: "clamp" })));

  // Red flash at 15%
  const flashProgress = interpolate(frame, [165, 175, 185], [0, 0.35, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Bottom strike-through animation
  const strikeWidth = interpolate(frame, [200, 240], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Pulsing vignette
  const vignetteOp = interpolate(Math.sin(frame * 0.025), [-1, 1], [0.4, 0.7]);

  return (
    <AbsoluteFill style={{ background: "#0D0404" }}>
      <Audio src={staticFile("voiceover/scene1-hook-v3.mp3")} />

      {/* Hero image with Ken Burns */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${imgScale}) translateY(${imgY}px)`,
        opacity: imgOpacity,
      }}>
        <Img src={staticFile("images/vendor-photographer.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Dark gradient overlays */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(13,4,4,0.7) 0%, rgba(13,4,4,0.3) 40%, rgba(13,4,4,0.85) 100%)",
      }} />

      {/* Red danger flash */}
      <div style={{ position: "absolute", inset: 0, background: `rgba(180,20,20,${flashProgress})` }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,${vignetteOp}) 100%)`,
      }} />

      {/* Floating grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: `linear-gradient(rgba(201,150,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,150,42,0.5) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        transform: `translateY(${interpolate(frame, [0, 420], [0, -60])}px)`,
      }} />

      {/* Main content */}
      <div style={{ position: "absolute", top: "12%", left: 56, right: 56 }}>
        {/* Line 1 */}
        <div style={{
          opacity: line1,
          transform: `translateY(${interpolate(line1, [0, 1], [50, 0])}px)`,
        }}>
          <div style={{
            fontFamily: "serif", fontSize: 58, fontWeight: 700,
            color: "#F5E6C0", lineHeight: 1.15,
            textShadow: "0 4px 40px rgba(201,150,42,0.3)",
          }}>
            Aapka Kaam
          </div>
          <div style={{
            fontFamily: "serif", fontSize: 58, fontWeight: 700,
            color: "#C9962A", lineHeight: 1.15,
          }}>
            World-Class Hai...
          </div>
        </div>

        {/* Line 2 */}
        <div style={{
          marginTop: 40, opacity: line2,
          transform: `translateY(${interpolate(line2, [0, 1], [40, 0])}px)`,
        }}>
          <div style={{
            fontFamily: "sans-serif", fontSize: 36, fontWeight: 300,
            color: "rgba(245,230,192,0.65)", lineHeight: 1.5,
          }}>
            Par har booking pe...
          </div>
        </div>

        {/* Commission counter */}
        <Sequence from={counterStart}>
          <div style={{
            marginTop: 50,
            display: "flex", alignItems: "baseline", gap: 16,
          }}>
            <div style={{
              fontFamily: "sans-serif", fontSize: 180, fontWeight: 900,
              color: "#E84040", lineHeight: 1,
              textShadow: "0 0 80px rgba(232,64,64,0.5)",
            }}>
              {commission}%
            </div>
            <div style={{
              fontFamily: "sans-serif", fontSize: 36, fontWeight: 600,
              color: "rgba(245,230,192,0.5)", letterSpacing: 4,
            }}>
              COMMISSION
            </div>
          </div>
        </Sequence>

        {/* Strike-through line on "someone else's pocket" */}
        <div style={{
          marginTop: 60, opacity: line3,
          transform: `translateY(${interpolate(line3, [0, 1], [30, 0])}px)`,
        }}>
          <div style={{
            fontFamily: "sans-serif", fontSize: 30, fontWeight: 400,
            color: "rgba(232,64,64,0.85)", fontStyle: "italic",
            borderLeft: "4px solid #E84040", paddingLeft: 20,
            position: "relative",
          }}>
            Kisi aur ki jeb mein jaa raha hai
            <div style={{
              position: "absolute", top: "50%", left: 20,
              width: `${strikeWidth}%`, height: 3,
              background: "#E84040",
            }} />
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
        background: "linear-gradient(transparent, #0D0404)",
      }} />
    </AbsoluteFill>
  );
};
