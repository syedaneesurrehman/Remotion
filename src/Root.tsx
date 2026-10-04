import {Composition} from 'remotion';
import {Inflation, FPS, DURATION} from './Inflation';

export const Root = () => (
  <Composition
    id="Inflation"
    component={Inflation}
    durationInFrames={DURATION}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
