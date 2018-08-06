/* globals window */
import { hydrate } from "emotion";

export const onClientEntry = () => {
  if (
    typeof window !== `undefined` &&
    typeof window.__EMOTION_CRITICAL_CSS_IDS__ !== `undefined`
  ) {
    hydrate(window.__EMOTION_CRITICAL_CSS_IDS__);
  }
};
