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
} from "remotion";

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo slam
  const logoSlam = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 150 } });

  // Tagline
  const tagline = spring({ frame: frame - 25, fps, config: { damping: 18 } });

  // CTA pulse
  const ctaPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.94, 1.06]);
  const ctaOp = spring({ frame: frame - 50, fps, config: { damping: 15 } });

  // URL
  const urlOp = spring({ frame: frame - 80, fps, config: { damping: 20 } });

  // Bottom
  const bottomOp = spring({ frame: frame - 110, fps, config: { damping: 18 } });

  // Background image
  const bgOp = interpolate(frame, [0, 20], [0, 0.15], { extrapolateRight: "clamp" });

  // Rotating rays
  const rayRot = frame * 0.2;

  // Burst particles
  const burstFrame = Math.max(0, frame - 50);

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(170deg, #2D0808 0%, #4A0E0E 40%, #2D0808 100%)",
      overflow: "hidden",
    }}>
      <Audio src={staticFile("voiceover/scene5-cta-v3.mp3")} />

      {/* Background success image */}
      <div style={{ position: "absolute", inset: 0, opacity: bgOp }}>
        <Img src={staticFile("images/vendor-success.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(45,8,8,0.7) 0%, rgba(45,8,8,0.95) 100%)",
      }} />

      {/* Rotating gold rays */}
      <div style={{
        position: "absolute", top: "45%", left: "50%",
        width: 1400, height: 1400,
        transform: `translate(-50%, -50%) rotate(${rayRot}deg)`,
        opacity: 0.05,
      }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: 3, height: 700,
            background: "linear-gradient(to bottom, #C9962A, transparent)",
            transformOrigin: "top center",
            transform: `rotate(${i * 30}deg)`,
          }} />
        ))}
      </div>

      {/* Burst particles */}
      {burstFrame > 0 && burstFrame < 50 && [...Array(14)].map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const dist = interpolate(burstFrame, [0, 50], [0, 350]);
        const op = interpolate(burstFrame, [0, 15, 50], [0, 1, 0], { extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            top: `calc(45% + ${Math.sin(angle) * dist}px)`,
            left: `calc(50% + ${Math.cos(angle) * dist}px)`,
            width: 6, height: 6, borderRadius: "50%",
            background: "#C9962A", opacity: op,
          }} />
        );
      })}

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 60px",
      }}>
        {/* Brand */}
        <div style={{
          opacity: logoSlam,
          transform: `scale(${interpolate(logoSlam, [0, 1], [2.5, 1])})`,
        }}>
          <div style={{
            fontFamily: "serif", fontSize: 80, fontWeight: 700, textAlign: "center",
          }}>
            <span style={{ color: "#C9962A" }}>Karlo</span>
            <span style={{ color: "#F5E6C0" }}>Shaadi</span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          marginTop: 24, opacity: tagline,
          transform: `translateY(${interpolate(tagline, [0, 1], [20, 0])}px)`,
        }}>
          <div style={{
            fontFamily: "sans-serif", fontSize: 32, fontWeight: 300,
            color: "rgba(245,230,192,0.65)", textAlign: "center",
          }}>
            Apna Business, Apne Rules
          </div>
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 55, opacity: ctaOp, transform: `scale(${ctaPulse})`,
        }}>
          <div style={{
            padding: "24px 60px",
            background: "linear-gradient(135deg, #C9962A, #E8B94A)",
            borderRadius: 50,
            boxShadow: "0 8px 50px rgba(201,150,42,0.45)",
          }}>
            <span style={{
              fontFamily: "sans-serif", fontSize: 28, fontWeight: 800,
              color: "#2D0808", letterSpacing: 3, textTransform: "uppercase",
            }}>
              Register FREE Now
            </span>
          </div>
        </div>

        {/* URL */}
        <div style={{
          marginTop: 30, opacity: urlOp,
          transform: `translateY(${interpolate(urlOp, [0, 1], [10, 0])}px)`,
        }}>
          <div style={{
            fontFamily: "sans-serif", fontSize: 28, fontWeight: 600,
            color: "#C9962A", letterSpacing: 4,
          }}>
            KarloShaadi.com
          </div>
        </div>

        {/* Bottom */}
        <div style={{ marginTop: 50, opacity: bottomOp }}>
          <div style={{
            fontFamily: "sans-serif", fontSize: 18,
            color: "rgba(245,230,192,0.35)", textAlign: "center", letterSpacing: 2,
          }}>
            Zero Commission · Free Tools · Lifetime Price Lock
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
