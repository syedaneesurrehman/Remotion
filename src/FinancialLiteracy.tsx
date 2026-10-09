import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './fl/Captions';
import {C, FONT, H, TOTAL, W, clamp, sec} from './fl/common';
import {SceneBasics, SceneHook, SceneRule} from './fl/scenesA';
import {SceneCompound, SceneCTA, SceneProtect} from './fl/scenesB';

export {FPS} from './fl/common';
export const FL_DURATION = TOTAL;
export const FL_WIDTH = W;
export const FL_HEIGHT = H;

/** Scene start times (seconds) - taken from voiceover/voiceover.srt. */
const STARTS = [0, 7.689, 19.948, 32.001, 42.403, 52.177].map(sec);
const SCENES = [SceneHook, SceneBasics, SceneRule, SceneProtect, SceneCompound, SceneCTA];

const Background: React.FC = () => {
  const f = useCurrentFrame();
  const blob = (x: number, y: number, color: string, ph: number) => (
    <div
      style={{
        position: 'absolute',
        width: 1100,
        height: 1100,
        left: x + Math.sin(f / 70 + ph) * 120 - 550,
        top: y + Math.cos(f / 90 + ph) * 160 - 550,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
      }}
    />
  );
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      {blob(200, 300, 'rgba(91,140,255,0.28)', 0)}
      {blob(900, 1000, 'rgba(46,230,166,0.20)', 2)}
      {blob(300, 1700, 'rgba(255,184,77,0.14)', 4)}
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 2px, transparent 2px)',
          backgroundSize: '54px 54px',
          backgroundPosition: `0 ${(f * 0.4) % 54}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Mint circle that covers the screen, then opens up to reveal the next scene. */
const Wipe: React.FC<{at: number; id: number}> = ({at, id}) => {
  const f = useCurrentFrame();
  const cx = W / 2;
  const cy = H / 2;
  const maxR = Math.hypot(cx, cy) + 40;
  if (f < at - 12 || f > at + 14) return null;
  if (f <= at) {
    const r = interpolate(f, [at - 12, at], [0, maxR], clamp);
    return (
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <circle cx={cx} cy={cy} r={r * r / maxR} fill={C.mint} />
      </svg>
    );
  }
  const hole = interpolate(f, [at, at + 14], [0, maxR], clamp);
  const m = `wipe-${id}`;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <mask id={m}>
          <rect width={W} height={H} fill="white" />
          <circle cx={cx} cy={cy} r={Math.sqrt(hole / maxR) * maxR} fill="black" />
        </mask>
      </defs>
      <rect width={W} height={H} fill={C.mint} mask={`url(#${m})`} />
    </svg>
  );
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 78, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.12)'}}>
      <div style={{width: `${Math.min(1, f / TOTAL) * 100}%`, height: '100%', borderRadius: 5, background: C.mint}} />
    </div>
  );
};

export const FinancialLiteracy: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONT, color: C.text}}>
    <Background />
    <Audio src={staticFile('voiceover.mp3')} />
    {SCENES.map((Scene, i) => (
      <Sequence key={i} from={STARTS[i]} durationInFrames={(STARTS[i + 1] ?? TOTAL) - STARTS[i]} name={Scene.name}>
        <Scene />
      </Sequence>
    ))}
    <Progress />
    <Captions />
    {STARTS.slice(1).map((s, i) => (
      <Wipe key={i} at={s} id={i} />
    ))}
  </AbsoluteFill>
);
