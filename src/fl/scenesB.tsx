import React from 'react';
import {Easing, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {C, Coin, FONT, Icon, Kinetic, Title, W, clamp, fade, money, rand, useSpring} from './common';

/* ------------------------------------------------------------------ */
/* Scene 4 - Protect (0:32.0 - 0:42.4)                                 */
/* ------------------------------------------------------------------ */
const Shield: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(4);
  const out = interpolate(f, [112, 128], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const bar = interpolate(f, [14, 100], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  return (
    <div style={{opacity: s * (1 - out), transform: `scale(${1 - out * 0.4})`, transformOrigin: '540px 800px', fontFamily: FONT}}>
      <svg width={460} height={540} viewBox="0 0 400 470" style={{position: 'absolute', left: 310, top: 500, overflow: 'visible'}}>
        <path
          d="M200 10 L380 70 V230 C380 340 300 420 200 460 C100 420 20 340 20 230 V70 Z"
          fill={C.panel}
          stroke={C.mint}
          strokeWidth="10"
          strokeLinejoin="round"
        />
        {Array.from({length: 6}).map((_, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 54 + col * 102;
          const y = 140 + row * 108;
          const p = interpolate(f, [14 + i * 14, 24 + i * 14], [0, 1], clamp);
          return (
            <g key={i}>
              <rect x={x} y={y} width={88} height={88} rx={20} fill={C.panel2} />
              <rect
                x={x + 44 - 44 * p}
                y={y + 44 - 44 * p}
                width={88 * p}
                height={88 * p}
                rx={20}
                fill={C.mint}
              />
              <text x={x + 44} y={y + 60} textAnchor="middle" fontSize="46" fontWeight="900" fill={p > 0.6 ? C.bg : C.muted} fontFamily={FONT}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 140, top: 1100, width: 800}}>
        <div style={{fontSize: 30, fontWeight: 800, color: C.muted, letterSpacing: 6, marginBottom: 14, textAlign: 'center'}}>
          MONTHS OF EXPENSES SAVED
        </div>
        <div style={{height: 38, borderRadius: 19, background: C.panel2, overflow: 'hidden'}}>
          <div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 19, background: `linear-gradient(90deg, ${C.mint}, #7BF5CB)`}} />
        </div>
        <div style={{position: 'relative', height: 60, fontSize: 36, fontWeight: 900}}>
          <span style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: bar >= 0.5 ? C.mint : C.muted}}>3 mo</span>
          <span style={{position: 'absolute', right: 0, color: bar >= 0.99 ? C.mint : C.muted}}>6 mo</span>
        </div>
      </div>
    </div>
  );
};

const DebtCard: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(128, {damping: 12, stiffness: 100});
  const out = interpolate(f, [186, 202], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const apr = interpolate(f, [134, 168], [0, 22], {...clamp, easing: Easing.out(Easing.cubic)});
  const bal = 4000 + Math.max(0, f - 134) * 14;
  return (
    <div style={{opacity: s * (1 - out), fontFamily: FONT}}>
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 520,
          width: 820,
          height: 480,
          borderRadius: 48,
          background: `linear-gradient(135deg, ${C.coral}, #C2415A)`,
          boxShadow: '0 40px 90px rgba(255,107,107,0.35)',
          transform: `scale(${0.6 + 0.4 * s - out * 0.2}) rotate(${(1 - s) * 14 - 3 + Math.sin(f / 10) * 0.8}deg)`,
          padding: 52,
          color: '#fff',
        }}
      >
        <div style={{width: 110, height: 80, borderRadius: 16, background: 'rgba(255,255,255,0.35)'}} />
        <div style={{position: 'absolute', right: 52, top: 52, fontSize: 36, fontWeight: 900, letterSpacing: 5}}>CREDIT CARD</div>
        <div style={{position: 'absolute', left: 52, top: 190, fontSize: 56, fontWeight: 800, letterSpacing: 8, opacity: 0.85}}>
          •••• •••• 4821
        </div>
        <div style={{position: 'absolute', left: 52, bottom: 46, fontSize: 36, fontWeight: 700, opacity: 0.9}}>
          Balance {money(bal)}
        </div>
        <div style={{position: 'absolute', right: 52, bottom: 30, textAlign: 'right'}}>
          <div style={{fontSize: 128, fontWeight: 900, lineHeight: 1}}>{Math.round(apr)}%</div>
          <div style={{fontSize: 34, fontWeight: 900, letterSpacing: 8}}>APR</div>
        </div>
      </div>
      {Array.from({length: 7}).map((_, i) => {
        const delay = 150 + i * 6;
        const p = interpolate(f, [delay, delay + 34], [0, 1], clamp);
        if (p <= 0 || p >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 220 + i * 100 + rand(i) * 30,
              top: 500 - p * 150,
              fontSize: 54,
              fontWeight: 900,
              color: C.coral,
              opacity: 1 - p,
            }}
          >
            +$
          </div>
        );
      })}
    </div>
  );
};

const Compare: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [206, 246], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const b = interpolate(f, [222, 250], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const chip = useSpring(262);
  const rows = [
    {y: 560, label: 'Credit card interest', pct: 22, p: a, c: C.coral},
    {y: 790, label: 'Avg. investment return', pct: 7, p: b, c: C.mint},
  ];
  return (
    <div style={{fontFamily: FONT, opacity: fade(f, 200, undefined, 8)}}>
      {rows.map((r) => (
        <div key={r.label} style={{position: 'absolute', left: 90, top: r.y, width: 900}}>
          <div style={{fontSize: 38, fontWeight: 800, color: C.muted, marginBottom: 14}}>{r.label}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div style={{width: Math.max(8, 36 * r.pct * r.p), height: 96, borderRadius: 24, background: r.c}} />
            <div style={{fontSize: 80, fontWeight: 900, color: r.c}}>{Math.round(r.pct * r.p)}%</div>
          </div>
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 1050,
          width: 760,
          height: 130,
          borderRadius: 65,
          background: C.mint,
          color: C.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
          fontSize: 46,
          fontWeight: 900,
          transform: `scale(${chip})`,
          opacity: chip,
        }}
      >
        <Icon name="check" size={64} color={C.bg} />
        PAY IT OFF FIRST
      </div>
      <div style={{position: 'absolute', left: 0, width: W, top: 1215, textAlign: 'center', fontSize: 26, color: C.muted, opacity: 0.8}}>
        Illustrative rates
      </div>
    </div>
  );
};

export const SceneProtect: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={124}>
      <Title kicker="EMERGENCY FUND" title="Build your safety net" />
    </Sequence>
    <Sequence from={124} durationInFrames={71}>
      <Title kicker="HIGH-INTEREST DEBT" title="Pay it off first" color={C.coral} />
    </Sequence>
    <Sequence from={195}>
      <Title kicker="THE MATH" title="Interest beats returns" color={C.amber} size={84} />
    </Sequence>
    <Shield />
    <DebtCard />
    <Compare />
  </>
);

/* ------------------------------------------------------------------ */
/* Scene 5 - Compound interest (0:42.4 - 0:52.2)                       */
/* ------------------------------------------------------------------ */
const CH = {x: 130, y: 580, w: 820, h: 540};
const YEARS = 30;
const VMAX = 120000;
const fv = (years: number) => (years <= 0 ? 0 : 1200 * ((Math.pow(1.07, years) - 1) / 0.07));
const valueA = (t: number) => fv(t);
const valueB = (t: number) => fv(t - 10);
const px = (t: number) => CH.x + (t / YEARS) * CH.w;
const py = (v: number) => CH.y + CH.h - (v / VMAX) * CH.h;

const pathFor = (fn: (t: number) => number, from: number) => {
  const pts: string[] = [];
  for (let t = from; t <= YEARS + 1e-9; t += 0.5) pts.push(`${pts.length ? 'L' : 'M'}${px(t).toFixed(1)} ${py(fn(t)).toFixed(1)}`);
  return pts.join(' ');
};
const PATH_A = pathFor(valueA, 0);
const PATH_B = pathFor(valueB, 10);

const Clock: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, {damping: 12, stiffness: 110});
  const out = interpolate(f, [48, 62], [0, 1], clamp);
  const spin = interpolate(f, [4, 56], [0, 720], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - 380) / 2,
        top: 640,
        width: 380,
        height: 380,
        opacity: s * (1 - out),
        transform: `scale(${(0.5 + 0.5 * s) * (1 - out * 0.3)})`,
      }}
    >
      <svg width="380" height="380" viewBox="0 0 380 380">
        <circle cx="190" cy="190" r="170" fill={C.panel} stroke={C.mint} strokeWidth="14" />
        {Array.from({length: 12}).map((_, i) => (
          <line
            key={i}
            x1={190 + Math.sin((i * Math.PI) / 6) * 140}
            y1={190 - Math.cos((i * Math.PI) / 6) * 140}
            x2={190 + Math.sin((i * Math.PI) / 6) * 156}
            y2={190 - Math.cos((i * Math.PI) / 6) * 156}
            stroke={C.muted}
            strokeWidth="8"
            strokeLinecap="round"
          />
        ))}
        <line x1="190" y1="190" x2="190" y2="82" stroke={C.text} strokeWidth="14" strokeLinecap="round" transform={`rotate(${spin} 190 190)`} />
        <line x1="190" y1="190" x2="190" y2="120" stroke={C.mint} strokeWidth="14" strokeLinecap="round" transform={`rotate(${spin / 12} 190 190)`} />
        <circle cx="190" cy="190" r="14" fill={C.mint} />
      </svg>
    </div>
  );
};

const Chart: React.FC = () => {
  const f = useCurrentFrame();
  const show = useSpring(56);
  const tA = interpolate(f, [62, 176], [0, YEARS], {...clamp, easing: Easing.inOut(Easing.quad)});
  const pA = tA / YEARS;
  const tB = interpolate(f, [184, 268], [10, YEARS], {...clamp, easing: Easing.inOut(Easing.quad)});
  const pB = (tB - 10) / 20;
  const vA = valueA(tA);
  const vB = valueB(tB);
  const bothShown = f >= 184;
  const legend = useSpring(184);
  const endA = useSpring(268);

  const snowball = (t: number, v: number, color: string) => {
    const r = 12 + 30 * Math.sqrt(v / VMAX);
    return (
      <g>
        {[0.25, 0.5, 0.75].map((k) => (
          <circle key={k} cx={px(t - k * 2.2)} cy={py(fn(color, t - k * 2.2))} r={r * 0.35 * (1 - k * 0.5)} fill={color} opacity={0.35 - k * 0.2} />
        ))}
        <circle cx={px(t)} cy={py(v)} r={r} fill={color} />
        <circle cx={px(t)} cy={py(v)} r={r * 0.62} fill="none" stroke={C.bg} strokeOpacity={0.3} strokeWidth={Math.max(2, r * 0.12)} />
      </g>
    );
  };
  const fn = (color: string, t: number) => (color === C.mint ? valueA(t) : valueB(t));

  return (
    <div style={{opacity: show, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, width: W, top: 465, textAlign: 'center'}}>
        <span style={{fontSize: 30, fontWeight: 800, letterSpacing: 6, color: C.muted}}>BALANCE </span>
        <span style={{fontSize: 74, fontWeight: 900, color: C.mint}}>{money(vA)}</span>
      </div>
      <svg width={W} height={1300} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {[0, 1, 2, 3].map((i) => {
          const y = CH.y + CH.h - (i / 3) * CH.h;
          return (
            <g key={i}>
              <line x1={CH.x} x2={CH.x + CH.w} y1={y} y2={y} stroke={C.panel2} strokeWidth="3" />
              <text x={CH.x - 14} y={y + 9} textAnchor="end" fontSize="26" fill={C.muted} fontWeight="700" fontFamily={FONT}>
                {i === 0 ? '$0' : `$${i * 40}K`}
              </text>
            </g>
          );
        })}
        {[0, 10, 20, 30].map((t) => (
          <text key={t} x={px(t)} y={CH.y + CH.h + 44} textAnchor="middle" fontSize="28" fill={C.muted} fontWeight="700" fontFamily={FONT}>
            {t === 0 ? 'Year 0' : t}
          </text>
        ))}
        <path d={PATH_A} fill="none" stroke={C.mint} strokeWidth="12" strokeLinecap="round" pathLength={1} strokeDasharray={`${pA} 2`} />
        {f >= 184 && (
          <path
            d={PATH_B}
            fill="none"
            stroke={C.amber}
            strokeWidth="12"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${pB} 2`}
          />
        )}
        {f >= 62 && snowball(tA, vA, C.mint)}
        {bothShown && snowball(tB, vB, C.amber)}
      </svg>
      {/* legend */}
      <div style={{position: 'absolute', left: 90, top: 1190, width: 900, display: 'flex', justifyContent: 'center', gap: 40, opacity: legend, transform: `translateY(${(1 - legend) * 30}px)`}}>
        <Chip color={C.mint} label="Start today" value="$113K" show={endA} />
        <Chip color={C.amber} label="Start in 10 yrs" value="$49K" show={endA} />
      </div>
      <div style={{position: 'absolute', left: 0, width: W, top: 1268, textAlign: 'center', fontSize: 26, color: C.muted, opacity: 0.8}}>
        Illustrative: $100/month at 7% a year
      </div>
    </div>
  );
};

const Chip: React.FC<{color: string; label: string; value: string; show: number}> = ({color, label, value, show}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, background: C.panel, borderRadius: 40, padding: '16px 26px', fontSize: 32, fontWeight: 800}}>
    <div style={{width: 24, height: 24, borderRadius: 12, background: color}} />
    {label}
    <span style={{color, fontWeight: 900, opacity: show, width: show > 0.01 ? 'auto' : 0, overflow: 'hidden'}}>{value}</span>
  </div>
);

export const SceneCompound: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={58}>
      <Title kicker="COMPOUND INTEREST" title="Let time work for you" size={84} />
    </Sequence>
    <Sequence from={58} durationInFrames={126}>
      <Title kicker="COMPOUNDING" title="Money earns money" />
    </Sequence>
    <Sequence from={184}>
      <Title kicker="THE EARLY ADVANTAGE" title="Start small, start now" color={C.amber} size={84} />
    </Sequence>
    <Clock />
    <Chart />
  </>
);

/* ------------------------------------------------------------------ */
/* Scene 6 - Call to action (0:52.2 - 1:00)                            */
/* ------------------------------------------------------------------ */
export const SceneCTA: React.FC = () => {
  const f = useCurrentFrame();
  const strike = interpolate(f, [30, 48], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const richIn = useSpring(14, {damping: 10, stiffness: 120});
  const aOut = interpolate(f, [64, 76], [1, 0], clamp);
  const burst = useSpring(72, {damping: 14, stiffness: 90});
  const shrink = interpolate(f, [120, 144], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const btn = useSpring(128, {damping: 10, stiffness: 140});
  const tag = useSpring(146);
  const rings = [0, 1, 2].map((i) => {
    const p = ((f - 140 - i * 20) % 60) / 60;
    return f > 140 ? Math.max(0, p) : 0;
  });

  return (
    <div style={{fontFamily: FONT}}>
      {/* "You don't need to be RICH" */}
      <div style={{opacity: aOut}}>
        <Kinetic text="You don't need to be" size={84} top={420} stagger={4} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: W,
            top: 640,
            textAlign: 'center',
            fontSize: 260,
            fontWeight: 900,
            lineHeight: 1,
            color: C.coral,
            opacity: richIn,
            transform: `scale(${0.6 + 0.4 * richIn})`,
          }}
        >
          <span style={{position: 'relative', display: 'inline-block'}}>
            RICH
            <span
              style={{
                position: 'absolute',
                left: -20,
                top: '52%',
                height: 22,
                width: `${strike * 112}%`,
                borderRadius: 11,
                background: C.text,
                transform: 'rotate(-5deg)',
                transformOrigin: 'left center',
              }}
            />
          </span>
        </div>
      </div>

      {/* "JUST START." badge */}
      <div
        style={{
          position: 'absolute',
          left: (W - 880) / 2,
          top: 330,
          width: 880,
          height: 880,
          borderRadius: 440,
          background: `radial-gradient(circle at 35% 30%, #7BF5CB, ${C.mint})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: C.bg,
          fontSize: 170,
          fontWeight: 900,
          lineHeight: 0.98,
          opacity: burst > 0.02 ? 1 : 0,
          transform: `translateY(${-shrink * 330}px) scale(${burst * (1 - shrink * 0.5)})`,
          boxShadow: '0 40px 120px rgba(46,230,166,0.4)',
        }}
      >
        JUST
        <br />
        START.
      </div>
      {Array.from({length: 14}).map((_, i) => {
        const p = interpolate(f, [72, 112], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        if (p <= 0 || p >= 1) return null;
        const ang = (i / 14) * Math.PI * 2;
        const d = 520 + rand(i) * 260;
        return (
          <Coin
            key={i}
            size={64}
            style={{position: 'absolute', left: W / 2 + Math.cos(ang) * d * p - 32, top: 770 + Math.sin(ang) * d * p - 32, opacity: 1 - p}}
          />
        );
      })}

      {/* follow button */}
      <div style={{position: 'absolute', left: 0, width: W, top: 880, height: 160, display: 'flex', justifyContent: 'center'}}>
        {rings.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              width: 600,
              height: 160,
              borderRadius: 80,
              border: `5px solid ${C.mint}`,
              opacity: (1 - p) * 0.6 * btn,
              transform: `scale(${1 + p * 0.5})`,
            }}
          />
        ))}
        <div
          style={{
            width: 600,
            height: 160,
            borderRadius: 80,
            background: C.mint,
            color: C.bg,
            fontSize: 70,
            fontWeight: 900,
            letterSpacing: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 22,
            opacity: btn,
            transform: `scale(${0.5 + 0.5 * btn})`,
          }}
        >
          <span style={{fontSize: 90, lineHeight: 1, marginTop: -6}}>+</span> FOLLOW
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, width: W, top: 1090, textAlign: 'center', opacity: tag, transform: `translateY(${(1 - tag) * 30}px)`}}>
        <div style={{fontSize: 56, fontWeight: 900}}>@YourChannel</div>
        <div style={{fontSize: 38, fontWeight: 700, color: C.muted, marginTop: 10}}>Money lessons they never taught you</div>
      </div>
    </div>
  );
};
