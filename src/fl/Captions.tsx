import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CAPTIONS} from './captions';
import {C, FONT, FPS} from './common';

/** TikTok-style captions: the whole line shows, the spoken word lights up. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cap = CAPTIONS.find(([a, b]) => t >= a - 0.05 && t <= b + 0.2);
  if (!cap) return null;
  const [start, end, text] = cap;
  const words = text.split(' ');
  const total = words.reduce((n, w) => n + w.length + 2, 0);
  let acc = 0;
  const spans = words.map((w) => {
    const from = start + ((end - start) * acc) / total;
    acc += w.length + 2;
    const to = start + ((end - start) * acc) / total;
    return {w, from, to};
  });
  const pop = Math.min(1, (t - start + 0.05) / 0.12);

  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        bottom: 330,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '6px 26px',
        fontFamily: FONT,
        fontSize: 64,
        fontWeight: 900,
        lineHeight: 1.15,
        textAlign: 'center',
        transform: `translateY(${(1 - Math.max(0, pop)) * 24}px)`,
        opacity: Math.max(0, pop),
      }}
    >
      {spans.map(({w, from, to}, i) => {
        const on = t >= from && t < to;
        const done = t >= to;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: on ? C.mint : C.text,
              opacity: on || done ? 1 : 0.62,
              transform: `scale(${on ? 1.06 : 1})`,
              textShadow: '0 4px 18px rgba(0,0,0,0.75), 0 0 3px rgba(0,0,0,0.9)',
              WebkitTextStroke: '2px rgba(11,18,32,0.55)',
              paintOrder: 'stroke fill',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
