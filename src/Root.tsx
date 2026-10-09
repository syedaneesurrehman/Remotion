import {Composition} from 'remotion';
import {Inflation, FPS, DURATION} from './Inflation';
import {FinancialLiteracy, FL_DURATION, FL_HEIGHT, FL_WIDTH} from './FinancialLiteracy';

export const Root = () => (
  <>
    <Composition
      id="Inflation"
      component={Inflation}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="FinancialLiteracy"
      component={FinancialLiteracy}
      durationInFrames={FL_DURATION}
      fps={FPS}
      width={FL_WIDTH}
      height={FL_HEIGHT}
    />
  </>
);
