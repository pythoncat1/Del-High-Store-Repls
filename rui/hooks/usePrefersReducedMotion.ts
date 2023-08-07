import * as React from "react";

// https://www.joshwcomeau.com/snippets/react-hooks/use-prefers-reduced-motion/
const QUERY = "(prefers-reduced-motion: no-preference)";
const getInitialState = () => {
  if (typeof window === "undefined") {
    return true;
  }

  // - for some reason in a few embedded pages it doesn't have window.matchMedia
  // - very old browsers don't have window.matchMedia
  if (!window.matchMedia) {
    return true;
  }

  return !window.matchMedia(QUERY).matches;
};

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    React.useState(getInitialState);
  React.useEffect(() => {
    if (!window.matchMedia) {
      return;
    }

    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };

    if (!mediaQueryList?.addEventListener) {
      return;
    }

    mediaQueryList.addEventListener("change", listener);

    return () => {
      if (listener) {
        mediaQueryList.removeEventListener("change", listener);
      }
    };
  }, []);

  return prefersReducedMotion;
}
