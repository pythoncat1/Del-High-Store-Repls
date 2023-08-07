import { BREAKPOINTS } from "./constants";

const screenMediaForMaxWidth = (bp: keyof typeof BREAKPOINTS) =>
  `@media screen and (max-width: ${BREAKPOINTS[bp]}px)`;

const screenMediaForMinWidth = (bp: keyof typeof BREAKPOINTS) =>
  `@media screen and (min-width: ${BREAKPOINTS[bp]}px)`;

const screenMediaForRange = (
  minBP: keyof typeof BREAKPOINTS,
  maxBP: keyof typeof BREAKPOINTS
) =>
  `@media screen and (min-width: ${BREAKPOINTS[minBP]}px) and (max-width: ${
    BREAKPOINTS[maxBP] - 1
  }px)`;

export { screenMediaForMaxWidth, screenMediaForMinWidth, screenMediaForRange };
