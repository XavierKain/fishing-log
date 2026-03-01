import React from "react";
import {
  AbsoluteFill,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// ─── Colors ───
const COLORS = {
  bg: "#0a0a14",
  bgLight: "#0f1520",
  teal: "#2dd4a8",
  blue: "#38bdf8",
  cyan: "#22d3ee",
  white: "#f0f0f5",
  muted: "#7a8599",
  darkTeal: "#0d3d30",
};

// ─── Shared Components ───

const GradientText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <span
    style={{
      background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.blue})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      ...style,
    }}
  >
    {children}
  </span>
);

const WaterParticle: React.FC<{
  x: number;
  y: number;
  size: number;
  delay: number;
}> = ({ x, y, size, delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    ((frame + delay) % 90) / 90,
    [0, 0.3, 0.7, 1],
    [0, 0.4, 0.4, 0]
  );
  const yOffset = interpolate(((frame + delay) % 90) / 90, [0, 1], [0, -60]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + yOffset,
        width: size,
        height: size,
        borderRadius: "50%",
        background: COLORS.teal,
        opacity,
      }}
    />
  );
};

const WaterBg: React.FC = () => {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        x: Math.random() * 1080,
        y: Math.random() * 1920,
        size: 3 + Math.random() * 5,
        delay: i * 12,
      })),
    []
  );

  return (
    <>
      {particles.map((p, i) => (
        <WaterParticle key={i} {...p} />
      ))}
    </>
  );
};

// ─── Slide 1: Problem ───
const ProblemSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const line1 = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const line2 = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const line3 = spring({ frame: frame - 45, fps, config: { damping: 14 } });

  const fadeOut = interpolate(frame, [70, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        opacity: fadeOut,
      }}
    >
      <WaterBg />
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div
          style={{
            fontSize: 72,
            marginBottom: 48,
            transform: `translateY(${interpolate(titleY, [0, 1], [40, 0])}px)`,
            opacity: titleY,
          }}
        >
          🤔
        </div>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.white,
            lineHeight: 1.2,
            marginBottom: 48,
            transform: `translateY(${interpolate(titleY, [0, 1], [40, 0])}px)`,
            opacity: titleY,
          }}
        >
          Sound familiar?
        </h1>

        {[
          { text: '"Where was that spot?"', anim: line1 },
          { text: '"What lure did I use?"', anim: line2 },
          { text: '"When did they bite last year?"', anim: line3 },
        ].map(({ text, anim }, i) => (
          <p
            key={i}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 36,
              color: COLORS.muted,
              marginBottom: 20,
              fontStyle: "italic",
              transform: `translateX(${interpolate(anim, [0, 1], [-60, 0])}px)`,
              opacity: anim,
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Slide 2: Solution ───
const SolutionSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const textAnim = spring({ frame: frame - 20, fps, config: { damping: 14 } });

  const fadeOut = interpolate(frame, [70, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        opacity: fadeOut,
      }}
    >
      <WaterBg />
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div
          style={{
            fontSize: 100,
            marginBottom: 40,
            transform: `scale(${interpolate(scale, [0, 1], [0.3, 1])})`,
            opacity: scale,
          }}
        >
          🐟
        </div>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.white,
            lineHeight: 1.2,
            marginBottom: 24,
            transform: `translateY(${interpolate(textAnim, [0, 1], [30, 0])}px)`,
            opacity: textAnim,
          }}
        >
          Meet <GradientText>Fishing Log</GradientText>
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 32,
            color: COLORS.muted,
            maxWidth: 700,
            lineHeight: 1.5,
            transform: `translateY(${interpolate(textAnim, [0, 1], [30, 0])}px)`,
            opacity: textAnim,
          }}
        >
          The offline-first fishing journal that remembers everything — so you
          can focus on fishing.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── Slide 3: Features ───
const FeaturesSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = spring({ frame, fps, config: { damping: 14 } });

  const features = [
    { icon: "📸", label: "Photo Catch Log" },
    { icon: "🗺️", label: "Map Your Spots" },
    { icon: "📊", label: "Species Stats" },
    { icon: "📶", label: "Works Offline" },
  ];

  const fadeOut = interpolate(frame, [80, 100], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        opacity: fadeOut,
      }}
    >
      <WaterBg />
      <div style={{ textAlign: "center", zIndex: 1, width: "100%" }}>
        <h2
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.white,
            marginBottom: 60,
            opacity: titleAnim,
            transform: `translateY(${interpolate(titleAnim, [0, 1], [20, 0])}px)`,
          }}
        >
          Everything you need
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            alignItems: "center",
          }}
        >
          {features.map((f, i) => {
            const anim = spring({
              frame: frame - 12 - i * 10,
              fps,
              config: { damping: 13, mass: 0.7 },
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  background: COLORS.bgLight,
                  border: `1px solid ${COLORS.darkTeal}`,
                  borderRadius: 20,
                  padding: "28px 48px",
                  width: 600,
                  opacity: anim,
                  transform: `translateX(${interpolate(anim, [0, 1], [80, 0])}px)`,
                }}
              >
                <span style={{ fontSize: 44 }}>{f.icon}</span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 32,
                    fontWeight: 600,
                    color: COLORS.white,
                  }}
                >
                  {f.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Slide 4: CTA ───
const CTASlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoAnim = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  const textAnim = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const btnAnim = spring({ frame: frame - 25, fps, config: { damping: 12 } });
  const priceAnim = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14 },
  });

  // Subtle pulse on the button
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [1, 1.04]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.darkTeal} 0%, ${COLORS.bg} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <WaterBg />
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div
          style={{
            fontSize: 90,
            marginBottom: 32,
            transform: `scale(${interpolate(logoAnim, [0, 1], [0.2, 1])})`,
            opacity: logoAnim,
          }}
        >
          🐟
        </div>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.white,
            lineHeight: 1.2,
            marginBottom: 16,
            opacity: textAnim,
            transform: `translateY(${interpolate(textAnim, [0, 1], [20, 0])}px)`,
          }}
        >
          <GradientText>Fishing Log</GradientText>
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 30,
            color: COLORS.muted,
            marginBottom: 48,
            opacity: textAnim,
            transform: `translateY(${interpolate(textAnim, [0, 1], [20, 0])}px)`,
          }}
        >
          Log every catch. Remember every spot.
        </p>
        <div
          style={{
            display: "inline-block",
            background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.blue})`,
            padding: "24px 64px",
            borderRadius: 20,
            opacity: btnAnim,
            transform: `scale(${interpolate(btnAnim, [0, 1], [0.8, 1]) * pulse})`,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 36,
              fontWeight: 700,
              color: COLORS.bg,
            }}
          >
            Start Logging
          </span>
        </div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 26,
            color: COLORS.muted,
            marginTop: 24,
            opacity: priceAnim,
          }}
        >
          $4.99 one-time · No subscription
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── Root Composition ───
export const PromoVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideoComp}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};

const PromoVideoComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Sequence from={0} durationInFrames={90}>
        <ProblemSlide />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <SolutionSlide />
      </Sequence>
      <Sequence from={180} durationInFrames={100}>
        <FeaturesSlide />
      </Sequence>
      <Sequence from={280} durationInFrames={80}>
        <CTASlide />
      </Sequence>
    </AbsoluteFill>
  );
};
