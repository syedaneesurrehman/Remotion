import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const FPS = 30;
const SCENE = 6 * FPS; // 5 scenes x 6s = 30s
export const DURATION = SCENE * 5;

const C = {
  bg: '#0b1020',
  panel: '#151c33',
  text: '#f4f6fb',
  muted: '#8e9ac0',
  red: '#ff4d5e',
  amber: '#ffb938',
  green: '#3ddc97',
};
const FONT = 'Helvetica, Arial, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Fades a scene in and out. */
const Scene: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 15, SCENE - 15, SCENE], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity, fontFamily: FONT, color: C.text}}>{children}</AbsoluteFill>;
};

const Heading: React.FC<{small: string; big: string}> = ({small, big}) => {
  const f = useCurrentFrame();
  const y = interpolate(f, [0, 25], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const o = interpolate(f, [0, 25], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', top: 90, left: 120, transform: `translateY(${y}px)`, opacity: o}}>
      <div style={{fontSize: 30, letterSpacing: 8, color: C.red, fontWeight: 700}}>{small}</div>
      <div style={{fontSize: 76, fontWeight: 800, marginTop: 10}}>{big}</div>
    </div>
  );
};

const Background: React.FC = () => {
  const f = useCurrentFrame();
  const shift = (f / DURATION) * 360;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${30 + Math.sin(f / 90) * 10}% ${
          40 + Math.cos(f / 110) * 10
        }%, #1d2750 0%, ${C.bg} 60%)`,
        filter: `hue-rotate(${Math.sin((shift * Math.PI) / 180) * 12}deg)`,
      }}
    />
  );
};

/* ---------- Scene 1: title with rising price tags ---------- */
const Tag: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const x = ((i * 389) % 1700) + 100;
  const speed = 1.2 + ((i * 37) % 10) / 6;
  const start = (i * 11) % 60;
  const y = 1200 - (f + start * 3) * speed * 3;
  const price = 2 + ((i * 7) % 9);
  const grown = price * (1 + f / 40);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: ((y % 1400) + 1400) % 1400 - 150,
        fontSize: 40 + (i % 3) * 16,
        fontWeight: 700,
        color: C.red,
        opacity: 0.35,
      }}
    >
      ${grown.toFixed(2)}
    </div>
  );
};

const Title: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 10, fps, config: {damping: 12}});
  const sub = interpolate(f, [60, 90], [0, 1], clamp);
  return (
    <Scene>
      {Array.from({length: 22}, (_, i) => (
        <Tag key={i} i={i} />
      ))}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: 200, fontWeight: 900, letterSpacing: 10, transform: `scale(${0.6 + s * 0.4})`}}>
          INFLATION<span style={{color: C.red}}>↗</span>
        </div>
        <div style={{fontSize: 44, color: C.muted, opacity: sub, marginTop: 20, letterSpacing: 4}}>
          Why your money buys less every year
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* ---------- Scene 2: shrinking purchasing power ---------- */
const Shrink: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [20, SCENE - 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const rate = 3; // illustrative 3%/yr
  const years = Math.round(t * 30);
  const power = 100 * Math.pow(1 - rate / 100, years);
  const size = 120 + (power / 100) * 480;
  return (
    <Scene>
      <Heading small="PURCHASING POWER" big="$100 today, 3% inflation a year" />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: 120}}>
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, #ffe08a, ${C.amber})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.3,
            fontWeight: 900,
            color: '#5a3b00',
            boxShadow: `0 0 80px ${C.amber}55`,
          }}
        >
          ${power.toFixed(0)}
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', bottom: 90, width: '100%', textAlign: 'center', fontSize: 52}}>
        After <b style={{color: C.red}}>{years}</b> years, $100 buys what{' '}
        <b style={{color: C.red}}>${power.toFixed(0)}</b> bought
      </div>
    </Scene>
  );
};

/* ---------- Scene 3: chart of US annual CPI inflation (approx.) ---------- */
const DATA: [number, number][] = [
  [2015, 0.1], [2016, 1.3], [2017, 2.1], [2018, 2.4], [2019, 1.8],
  [2020, 1.2], [2021, 4.7], [2022, 8.0], [2023, 4.1], [2024, 2.9],
];

const Chart: React.FC = () => {
  const f = useCurrentFrame();
  const W = 1500, H = 560, X0 = 210, Y0 = 330;
  const bw = W / DATA.length;
  return (
    <Scene>
      <Heading small="US CPI, ANNUAL CHANGE (approx.)" big="The 2021–22 surge" />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {[0, 2, 4, 6, 8].map((v) => {
          const y = Y0 + H - (v / 9) * H;
          return (
            <g key={v}>
              <line x1={X0} x2={X0 + W} y1={y} y2={y} stroke="#ffffff22" />
              <text x={X0 - 20} y={y + 8} fill={C.muted} fontSize={26} textAnchor="end" fontFamily={FONT}>
                {v}%
              </text>
            </g>
          );
        })}
        {DATA.map(([yr, v], i) => {
          const p = interpolate(f, [25 + i * 9, 55 + i * 9], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          const h = (v / 9) * H * p;
          const hot = v > 4;
          return (
            <g key={yr}>
              <rect
                x={X0 + i * bw + 15}
                y={Y0 + H - h}
                width={bw - 30}
                height={h}
                rx={8}
                fill={hot ? C.red : v > 2.5 ? C.amber : C.green}
              />
              <text x={X0 + i * bw + bw / 2} y={Y0 + H + 40} fill={C.muted} fontSize={26} textAnchor="middle" fontFamily={FONT}>
                {yr}
              </text>
              <text
                x={X0 + i * bw + bw / 2}
                y={Y0 + H - h - 14}
                fill={C.text}
                fontSize={30}
                fontWeight={700}
                textAnchor="middle"
                fontFamily={FONT}
                opacity={p}
              >
                {(v * p).toFixed(1)}%
              </text>
            </g>
          );
        })}
        {/* target line */}
        <line x1={X0} x2={X0 + W} y1={Y0 + H - (2 / 9) * H} y2={Y0 + H - (2 / 9) * H} stroke="#ffffff" strokeDasharray="12 10" opacity={interpolate(f, [100, 120], [0, 0.7], clamp)} />
        <text x={X0 + W} y={Y0 + H - (2 / 9) * H - 12} fill="#fff" fontSize={26} textAnchor="end" fontFamily={FONT} opacity={interpolate(f, [100, 120], [0, 0.9], clamp)}>
          2% target
        </text>
      </svg>
    </Scene>
  );
};

/* ---------- Scene 4: everyday prices then vs now (illustrative) ---------- */
const ITEMS = [
  {icon: '☕', name: 'Coffee', then: 0.5, now: 4.5},
  {icon: '🍞', name: 'Bread', then: 0.25, now: 3.0},
  {icon: '⛽', name: 'Gallon of gas', then: 0.36, now: 3.5},
  {icon: '🎬', name: 'Movie ticket', then: 1.5, now: 12},
];

const Prices: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Scene>
      <Heading small="EVERYDAY PRICES" big="Then vs. now" />
      <div style={{position: 'absolute', top: 360, left: 120, right: 120, display: 'flex', gap: 40}}>
        {ITEMS.map((it, i) => {
          const s = spring({frame: f - 15 - i * 10, fps, config: {damping: 14}});
          const p = interpolate(f, [40 + i * 10, 130 + i * 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          const price = it.then + (it.now - it.then) * p;
          return (
            <div
              key={it.name}
              style={{
                flex: 1,
                background: C.panel,
                borderRadius: 28,
                padding: '40px 20px',
                textAlign: 'center',
                transform: `translateY(${(1 - s) * 120}px)`,
                opacity: s,
              }}
            >
              <div style={{fontSize: 120}}>{it.icon}</div>
              <div style={{fontSize: 34, color: C.muted, marginTop: 10}}>{it.name}</div>
              <div style={{fontSize: 30, color: C.muted, marginTop: 40}}>~1970s: ${it.then.toFixed(2)}</div>
              <div style={{fontSize: 84, fontWeight: 900, color: C.red, marginTop: 10}}>${price.toFixed(2)}</div>
              <div style={{fontSize: 28, color: C.amber, marginTop: 6}}>
                ×{(it.now / it.then).toFixed(0)}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', bottom: 60, width: '100%', textAlign: 'center', fontSize: 24, color: C.muted}}>
        Rounded, illustrative US figures
      </div>
    </Scene>
  );
};

/* ---------- Scene 5: causes + outro ---------- */
const CAUSES = [
  {t: 'Demand-pull', d: 'Too much money chasing too few goods', c: C.red},
  {t: 'Cost-push', d: 'Higher wages & input costs get passed on', c: C.amber},
  {t: 'Money supply', d: 'More money created than the economy grows', c: C.green},
];

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const end = interpolate(f, [110, 140], [0, 1], clamp);
  return (
    <Scene>
      <Heading small="WHAT DRIVES IT" big="Three main causes" />
      <div style={{position: 'absolute', top: 340, left: 120, right: 120, display: 'flex', gap: 40, opacity: 1 - end * 0.85}}>
        {CAUSES.map((c, i) => {
          const s = spring({frame: f - 15 - i * 14, fps, config: {damping: 14}});
          return (
            <div
              key={c.t}
              style={{
                flex: 1,
                background: C.panel,
                borderTop: `8px solid ${c.c}`,
                borderRadius: 24,
                padding: 40,
                transform: `scale(${0.7 + 0.3 * s})`,
                opacity: s,
              }}
            >
              <div style={{fontSize: 52, fontWeight: 800}}>{c.t}</div>
              <div style={{fontSize: 34, color: C.muted, marginTop: 20, lineHeight: 1.35}}>{c.d}</div>
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: end}}>
        <div style={{fontSize: 90, fontWeight: 900, textAlign: 'center', lineHeight: 1.2}}>
          Prices rise.
          <br />
          <span style={{color: C.red}}>Purchasing power falls.</span>
        </div>
        <div style={{fontSize: 38, color: C.muted, marginTop: 30}}>Invest. Earn. Stay ahead of inflation.</div>
      </AbsoluteFill>
    </Scene>
  );
};

export const Inflation: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <Background />
    <Sequence from={0} durationInFrames={SCENE}><Title /></Sequence>
    <Sequence from={SCENE} durationInFrames={SCENE}><Shrink /></Sequence>
    <Sequence from={SCENE * 2} durationInFrames={SCENE}><Chart /></Sequence>
    <Sequence from={SCENE * 3} durationInFrames={SCENE}><Prices /></Sequence>
    <Sequence from={SCENE * 4} durationInFrames={SCENE}><Outro /></Sequence>
  </AbsoluteFill>
);
