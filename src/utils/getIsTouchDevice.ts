/**
 * Detect touch/mobile devices — don't submit on Enter there.
 */
function getIsTouchDevice() {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
}

export default getIsTouchDevice;
