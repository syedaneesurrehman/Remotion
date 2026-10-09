import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const TOTAL = 60 * FPS;

export const C = {
  bg: '#0B1220',
  panel: '#141D33',
  panel2: '#1C2848',
  text: '#F4F7FF',
  muted: '#8C9BC2',
  mint: '#2EE6A6',
  amber: '#FFB84D',
  coral: '#FF6B6B',
  blue: '#5B8CFF',
};
export const FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const sec = (s: number) => Math.round(s * FPS);

/** Spring from 0 to 1 that starts after `delay` frames. */
export const useSpring = (
  delay = 0,
  config: {damping?: number; stiffness?: number; mass?: number} = {damping: 13, stiffness: 120, mass: 0.8},
) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame, fps, delay, config});
};

/** Linear 0..1 progress between two frames, eased. */
export const useProgress = (from: number, to: number, easing = Easing.out(Easing.cubic)) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], {...clamp, easing});
};

/** Opacity helper: fade in at `a`, fade out at `b` (optional). */
export const fade = (f: number, a: number, b?: number, len = 10) =>
  interpolate(f, b === undefined ? [a, a + len] : [a, a + len, b - len, b], b === undefined ? [0, 1] : [0, 1, 1, 0], clamp);

export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

/** Deterministic pseudo-random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Kicker + big title at the top of a scene. */
export const Title: React.FC<{
  kicker: string;
  title: string;
  color?: string;
  delay?: number;
  size?: number;
}> = ({kicker, title, color = C.mint, delay = 0, size = 92}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        position: 'absolute',
        top: 150,
        left: 70,
        right: 70,
        textAlign: 'center',
        opacity: s,
        transform: `translateY(${(1 - s) * 50}px)`,
      }}
    >
      <div style={{fontSize: 34, letterSpacing: 10, fontWeight: 800, color}}>{kicker}</div>
      <div style={{fontSize: size, fontWeight: 900, lineHeight: 1.05, marginTop: 14}}>{title}</div>
    </div>
  );
};

/** Words that spring in one by one. `hi` words are highlighted. */
export const Kinetic: React.FC<{
  text: string;
  hi?: string[];
  size?: number;
  delay?: number;
  stagger?: number;
  hiColor?: string;
  top: number;
}> = ({text, hi = [], size = 100, delay = 0, stagger = 4, hiColor = C.mint, top}) => {
  const words = text.split(' ');
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 70,
        right: 70,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: `0 ${size * 0.28}px`,
        fontSize: size,
        fontWeight: 900,
        lineHeight: 1.12,
        textAlign: 'center',
      }}
    >
      {words.map((w, i) => (
        <KWord key={i} delay={delay + i * stagger} color={hi.includes(w.replace(/[^\w']/g, '')) ? hiColor : C.text}>
          {w}
        </KWord>
      ))}
    </div>
  );
};

const KWord: React.FC<{delay: number; color: string; children: React.ReactNode}> = ({delay, color, children}) => {
  const s = useSpring(delay, {damping: 11, stiffness: 150, mass: 0.7});
  return (
    <span
      style={{
        display: 'inline-block',
        color,
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${(1 - s) * 60}px) scale(${0.7 + 0.3 * s})`,
      }}
    >
      {children}
    </span>
  );
};

/** Gold coin with a $ sign. */
export const Coin: React.FC<{size?: number; style?: React.CSSProperties; color?: string}> = ({
  size = 90,
  style,
  color = C.amber,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', ...style}}>
    <circle cx="50" cy="50" r="46" fill={color} />
    <circle cx="50" cy="50" r="36" fill="none" stroke="#0B1220" strokeOpacity={0.28} strokeWidth="5" />
    <text x="50" y="68" textAnchor="middle" fontSize="52" fontWeight="900" fill="#0B1220" fillOpacity={0.55} fontFamily={FONT}>
      $
    </text>
  </svg>
);

export type IconName = 'earn' | 'spend' | 'save' | 'grow' | 'check';

/** Simple line icons drawn with SVG primitives. */
export const Icon: React.FC<{name: IconName; size?: number; color?: string}> = ({name, size = 80, color = C.text}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: 7, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {name === 'earn' && (
        <>
          <circle cx="50" cy="55" r="32" {...p} />
          <path d="M50 70 V30 M34 45 L50 28 L66 45" {...p} />
        </>
      )}
      {name === 'spend' && (
        <>
          <rect x="10" y="26" width="80" height="50" rx="10" {...p} />
          <path d="M10 44 H90" {...p} />
          <path d="M24 62 H42" {...p} />
        </>
      )}
      {name === 'save' && (
        <>
          <path d="M26 40 H74 V76 a8 8 0 0 1 -8 8 H34 a8 8 0 0 1 -8 -8 Z" {...p} />
          <path d="M20 40 H80" {...p} />
          <path d="M50 12 V28 M42 20 H58" {...p} />
        </>
      )}
      {name === 'grow' && (
        <>
          <path d="M14 82 H86" {...p} />
          <path d="M24 70 V56 M46 70 V44 M68 70 V28" {...p} />
          <path d="M20 34 L50 16 L82 12 M70 8 L82 12 L76 24" {...p} strokeWidth={5} />
        </>
      )}
      {name === 'check' && <path d="M20 54 L42 76 L82 28" {...p} strokeWidth={11} />}
    </svg>
  );
};
