import React from 'react';
import {Easing, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {C, Coin, FONT, Icon, IconName, Kinetic, Title, W, clamp, fade, rand, useSpring} from './common';

const Wallet: React.FC<{width?: number}> = ({width = 420}) => (
  <svg width={width} height={(width * 320) / 420} viewBox="0 0 420 320" style={{display: 'block', overflow: 'visible'}}>
    <rect x="60" y="0" width="290" height="190" rx="26" fill={C.coral} transform="rotate(-9 200 100)" />
    <rect x="86" y="40" width="70" height="14" rx="7" fill="#fff" fillOpacity={0.35} transform="rotate(-9 200 100)" />
    <rect x="10" y="50" width="400" height="260" rx="46" fill={C.blue} />
    <rect x="10" y="50" width="400" height="70" rx="40" fill="#fff" fillOpacity={0.12} />
    <rect x="280" y="150" width="140" height="96" rx="34" fill="#3563D9" />
    <circle cx="332" cy="198" r="15" fill="#fff" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Scene 1 - Hook (0:00 - 0:07.7)                                      */
/* ------------------------------------------------------------------ */
export const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const boardIn = useSpring(2);
  const boardOut = interpolate(f, [66, 96], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const glitch = f > 30 && f < 66 ? Math.sin(f * 2.3) * 5 : 0;
  const dollar = fade(f, 30, undefined, 6);

  const walletIn = useSpring(88);
  const move = interpolate(f, [150, 178], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const ring = interpolate(f, [156, 216], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const ringIn = useSpring(152);
  const R = 135;
  const CIRC = 2 * Math.PI * R;

  return (
    <>
      <div style={{opacity: interpolate(f, [62, 76], [1, 0], clamp)}}>
        <Kinetic text="Nobody taught you how money works in school." hi={['money']} size={92} top={250} stagger={4} />
      </div>
      <div style={{opacity: fade(f, 80, undefined, 8)}}>
        <Kinetic
          text="It affects every decision you'll ever make."
          hi={['every', 'decision']}
          size={92}
          top={250}
          delay={80}
          stagger={4}
        />
      </div>

      {/* chalkboard: "school" */}
      <div
        style={{
          position: 'absolute',
          left: (W - 740) / 2,
          top: 700,
          width: 740,
          height: 420,
          borderRadius: 36,
          background: 'linear-gradient(145deg,#1F3B35,#17302B)',
          border: '14px solid #6B4F36',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          fontFamily: FONT,
          transform: `scale(${boardIn}) translateY(${-boardOut * 1400}px) rotate(${-4 - boardOut * 40}deg)`,
          opacity: boardIn,
        }}
      >
        <div style={{position: 'absolute', left: 50, top: 40, fontSize: 96, fontWeight: 800, color: '#E9F1EC', letterSpacing: 8}}>
          ABC
        </div>
        <div style={{position: 'absolute', right: 50, top: 52, fontSize: 80, fontWeight: 700, color: '#E9F1EC'}}>1+1=2</div>
        <div style={{position: 'absolute', left: 50, top: 190, fontSize: 56, fontWeight: 700, color: '#9FB8AE'}}>History ✓</div>
        <div
          style={{
            position: 'absolute',
            left: 50,
            right: 50,
            bottom: 36,
            fontSize: 100,
            fontWeight: 900,
            color: C.amber,
            opacity: dollar,
            transform: `translateX(${glitch}px)`,
          }}
        >
          $ = ???
        </div>
      </div>

      {/* wallet + floating money */}
      <div
        style={{
          position: 'absolute',
          left: (W - 420) / 2,
          top: 780,
          transform: `translateY(${-move * 150}px) scale(${(0.4 + 0.6 * walletIn) * (1 - move * 0.2)}) rotate(${(1 - walletIn) * -25}deg)`,
          opacity: walletIn,
        }}
      >
        <Wallet />
        {[0, 1, 2, 3, 4].map((i) => {
          const ang = (i / 5) * Math.PI * 2 + f / 38;
          const rx = 300 + (i % 2) * 40;
          const x = 210 + Math.cos(ang) * rx - 38;
          const y = 160 + Math.sin(ang) * 120 - 38 + Math.sin(f / 12 + i) * 8;
          return <Coin key={i} size={76} style={{position: 'absolute', left: x, top: y, opacity: Math.sin(ang) > 0.75 ? 0.5 : 1}} />;
        })}
      </div>

      {/* 60 second ring */}
      <div
        style={{
          position: 'absolute',
          left: (W - 2 * R - 24) / 2,
          top: 1110,
          width: 2 * R + 24,
          height: 2 * R + 24,
          opacity: ringIn,
          transform: `scale(${0.6 + 0.4 * ringIn})`,
          fontFamily: FONT,
        }}
      >
        <svg width={2 * R + 24} height={2 * R + 24}>
          <circle cx={R + 12} cy={R + 12} r={R} fill="none" stroke={C.panel2} strokeWidth="20" />
          <circle
            cx={R + 12}
            cy={R + 12}
            r={R}
            fill="none"
            stroke={C.mint}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${CIRC * ring} ${CIRC}`}
            transform={`rotate(-90 ${R + 12} ${R + 12})`}
          />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 110, fontWeight: 900, lineHeight: 1}}>60</div>
          <div style={{fontSize: 28, fontWeight: 800, letterSpacing: 8, color: C.mint}}>SECONDS</div>
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 - The basics (0:07.7 - 0:19.9)                              */
/* ------------------------------------------------------------------ */
const TILES: {n: string; sub: string; icon: IconName; color: string}[] = [
  {n: 'EARN', sub: 'Get paid for your time', icon: 'earn', color: C.mint},
  {n: 'SPEND', sub: 'Pay for needs & wants', icon: 'spend', color: C.amber},
  {n: 'SAVE', sub: 'Keep some for later', icon: 'save', color: C.blue},
  {n: 'GROW', sub: 'Let it multiply', icon: 'grow', color: C.mint},
];

const Tile: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const t = TILES[i];
  const s = useSpring(10 + i * 32);
  const out = interpolate(f, [138 + i * 4, 156 + i * 4], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        top: 420 + i * 200,
        width: 900,
        height: 160,
        borderRadius: 40,
        background: C.panel,
        border: `3px solid ${t.color}55`,
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        padding: '0 36px',
        fontFamily: FONT,
        opacity: s * (1 - out),
        transform: `translateX(${(1 - s) * 500 - out * 1300}px) scale(${0.85 + 0.15 * s})`,
      }}
    >
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 55,
          background: `${t.color}26`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={t.icon} size={72} color={t.color} />
      </div>
      <div>
        <div style={{fontSize: 66, fontWeight: 900, color: t.color, letterSpacing: 4}}>{t.n}</div>
        <div style={{fontSize: 34, color: C.muted, fontWeight: 600}}>{t.sub}</div>
      </div>
    </div>
  );
};

const Bars: React.FC = () => {
  const f = useCurrentFrame();
  const a = useSpring(156, {damping: 16, stiffness: 90});
  const b = useSpring(172, {damping: 16, stiffness: 90});
  const br = useSpring(204);
  const out = interpolate(f, [228, 242], [1, 0], clamp);
  const base = 1260;
  const pulse = 1 + Math.sin(f / 5) * 0.04;
  return (
    <div style={{opacity: out, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 90, top: base, width: 900, height: 4, background: C.panel2, opacity: a}} />
      {[
        {x: 170, h: 640, c: C.mint, s: a, l: 'INCOME', v: '$3,000'},
        {x: 470, h: 440, c: C.amber, s: b, l: 'SPENDING', v: '$2,200'},
      ].map((bar) => (
        <React.Fragment key={bar.l}>
          <div
            style={{
              position: 'absolute',
              left: bar.x,
              top: base - bar.h * bar.s,
              width: 230,
              height: bar.h * bar.s,
              borderRadius: '28px 28px 6px 6px',
              background: `linear-gradient(180deg, ${bar.c}, ${bar.c}99)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: bar.x,
              width: 230,
              top: base - bar.h * bar.s - 66,
              textAlign: 'center',
              fontSize: 48,
              fontWeight: 900,
              opacity: bar.s,
            }}
          >
            {bar.v}
          </div>
          <div style={{position: 'absolute', left: bar.x, width: 230, top: base + 24, textAlign: 'center', fontSize: 32, fontWeight: 800, color: C.muted, letterSpacing: 4, opacity: bar.s}}>
            {bar.l}
          </div>
        </React.Fragment>
      ))}
      {/* surplus bracket */}
      <div
        style={{
          position: 'absolute',
          left: 735,
          top: base - 640,
          width: 14,
          height: 200 * br,
          borderRadius: 7,
          background: C.mint,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 775,
          top: base - 640 + 60,
          opacity: br,
          transform: `scale(${pulse * br})`,
          transformOrigin: 'left center',
          fontSize: 38,
          fontWeight: 900,
          color: C.mint,
          lineHeight: 1.1,
        }}
      >
        SURPLUS
        <div style={{fontSize: 64}}>+$800</div>
      </div>
    </div>
  );
};

const Leak: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(240);
  const out = 1 - interpolate(f, [358, 368], [0, 1], clamp);
  return (
    <div style={{opacity: s * out}}>
      <div style={{position: 'absolute', left: (W - 520) / 2, top: 700, transform: `scale(${s})`}}>
        <Wallet width={520} />
      </div>
      {Array.from({length: 16}).map((_, i) => {
        const delay = 246 + i * 6;
        const p = interpolate(f, [delay, delay + 55], [0, 1], clamp);
        if (p <= 0 || p >= 1) return null;
        const ang = -Math.PI + rand(i + 1) * Math.PI;
        const d = 380 + rand(i + 9) * 260;
        const x = W / 2 + Math.cos(ang) * d * p;
        const y = 800 + Math.sin(ang) * d * p + 520 * p * p - 40;
        return (
          <Coin
            key={i}
            size={70 + rand(i + 3) * 20}
            style={{position: 'absolute', left: x - 40, top: y - 40, opacity: 1 - p * p, transform: `rotate(${p * 400}deg)`}}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: W,
          top: 520,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 230,
          fontWeight: 900,
          color: C.coral,
          opacity: fade(f, 262, undefined, 8),
          transform: `scale(${1 + Math.sin(f / 6) * 0.05})`,
        }}
      >
        ?
      </div>
    </div>
  );
};

export const SceneBasics: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={148}>
      <Title kicker="FINANCIAL LITERACY" title="4 money moves" />
    </Sequence>
    <Sequence from={148} durationInFrames={89}>
      <Title kicker="ONE GOLDEN RULE" title="Spend less than you earn" color={C.amber} size={80} />
    </Sequence>
    <Sequence from={237}>
      <Title kicker="THE PROBLEM" title="Where does it all go?" color={C.coral} size={86} />
    </Sequence>
    <ConnectorLine />
    {TILES.map((_, i) => (
      <Tile key={i} i={i} />
    ))}
    <Bars />
    <Leak />
  </>
);

const ConnectorLine: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [20, 125], [0, 1], clamp);
  const out = interpolate(f, [138, 150], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 200,
        top: 500,
        width: 8,
        height: 600 * p,
        borderRadius: 4,
        background: `linear-gradient(180deg, ${C.mint}, ${C.blue})`,
        opacity: out * 0.7,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Scene 3 - 50/30/20 (0:19.9 - 0:32.0)                                */
/* ------------------------------------------------------------------ */
const SEGS = [
  {pct: 50, color: C.mint, label: 'NEEDS', sub: 'Rent, food, bills', start: 82},
  {pct: 30, color: C.amber, label: 'WANTS', sub: 'Fun & extras', start: 203},
  {pct: 20, color: C.blue, label: 'SAVINGS', sub: 'Savings & debt payoff', start: 266},
];

export const SceneRule: React.FC = () => {
  const f = useCurrentFrame();
  const cx = W / 2;
  const cy = 690;
  const r = 250;
  const circ = 2 * Math.PI * r;
  const intro = useSpring(4);
  let cum = 0;

  return (
    <>
      <Title kicker="THE BUDGET RULE" title="50 / 30 / 20" />
      <svg width={W} height={1400} style={{position: 'absolute', left: 0, top: 0, opacity: intro, overflow: 'visible'}}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.panel} strokeWidth={90} />
        {SEGS.map((s, i) => {
          const p = interpolate(f, [s.start, s.start + 32], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          const next = SEGS[i + 1]?.start ?? 330;
          const pulse = interpolate(f, [s.start, s.start + 10, next - 8, next], [0, 1, 1, 0], clamp);
          const len = circ * (s.pct / 100) - 7;
          const rot = -90 + cum * 360 + 1.2;
          cum += s.pct / 100;
          return (
            <circle
              key={s.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={90 + 26 * pulse}
              strokeDasharray={`${len * p} ${circ}`}
              transform={`rotate(${rot} ${cx} ${cy})`}
            />
          );
        })}
      </svg>

      {/* centre readout */}
      <div style={{position: 'absolute', left: cx - 170, top: cy - 120, width: 340, height: 240, fontFamily: FONT, textAlign: 'center'}}>
        <div style={{position: 'absolute', inset: 0, opacity: fade(f, 8, 80, 8), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Coin size={110} />
          <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 6, color: C.muted, marginTop: 8}}>YOUR INCOME</div>
        </div>
        {SEGS.map((s, i) => {
          const end = SEGS[i + 1]?.start ?? 400;
          const count = interpolate(f, [s.start, s.start + 28], [0, s.pct], {...clamp, easing: Easing.out(Easing.cubic)});
          return (
            <div
              key={s.label}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: fade(f, s.start, end, 8),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: s.color,
              }}
            >
              <div style={{fontSize: 138, fontWeight: 900, lineHeight: 1}}>{Math.round(count)}%</div>
              <div style={{fontSize: 38, fontWeight: 800, letterSpacing: 6}}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {SEGS.map((s, i) => (
        <LegendRow key={s.label} i={i} seg={s} />
      ))}
    </>
  );
};

const LegendRow: React.FC<{i: number; seg: (typeof SEGS)[number]}> = ({i, seg}) => {
  const f = useCurrentFrame();
  const s = useSpring(seg.start - 4);
  const active = interpolate(f, [seg.start, seg.start + 8, (SEGS[i + 1]?.start ?? 400) - 6, SEGS[i + 1]?.start ?? 400], [0, 1, 1, 0.35], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        top: 1050 + i * 100,
        width: 900,
        height: 84,
        borderRadius: 24,
        background: C.panel,
        border: `3px solid ${seg.color}${active > 0.5 ? 'cc' : '33'}`,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 30px',
        fontFamily: FONT,
        opacity: s,
        transform: `translateX(${(1 - s) * -300}px)`,
      }}
    >
      <div style={{width: 34, height: 34, borderRadius: 17, background: seg.color}} />
      <div style={{fontSize: 38, fontWeight: 900, width: 200}}>{seg.label}</div>
      <div style={{fontSize: 30, color: C.muted, fontWeight: 600, flex: 1}}>{seg.sub}</div>
      <div style={{fontSize: 46, fontWeight: 900, color: seg.color}}>{seg.pct}%</div>
    </div>
  );
};
