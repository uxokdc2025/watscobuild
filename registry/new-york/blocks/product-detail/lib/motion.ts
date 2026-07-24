/**
 * Shared interaction/motion class recipes for the product-detail block.
 *
 * Durations and easings come from design tokens (globals.css / the block's
 * cssVars) — never hardcode ms or bezier values in components. Motion is gated
 * behind `motion-safe`/`motion-reduce` so it respects prefers-reduced-motion.
 */

/** Color/box/transform transition driven by the fast duration + ease-out tokens. */
export const TRANSITION =
  "transition-[transform,color,background-color,border-color,box-shadow,opacity] duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none";

/** Tactile press feedback; suppressed under reduced motion. */
export const PRESS = "motion-safe:active:scale-[0.97]";

/** Visible keyboard focus ring on the focused control itself. */
export const FOCUS_RING =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
