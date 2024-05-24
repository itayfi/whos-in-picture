export const WIDTH = 320;
export const STAGES = 7;
const FIRST_STAGE = 32;
const LAST_STAGE = 1;

export const getScaleFactor = (stage: number) => {
  const v = (STAGES - stage - 1) / STAGES;
  return FIRST_STAGE * v + LAST_STAGE * (1 - v);
};
