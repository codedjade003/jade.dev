let audioContext = null;

/**
 * Creates or returns the shared AudioContext.
 * MUST be called synchronously inside a user gesture handler on iOS.
 */
function getAudioContext() {
  if (typeof window === "undefined") return null;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!audioContext) {
    try {
      audioContext = new AudioCtx();
    } catch (e) {
      return null;
    }
  }

  return audioContext;
}

/**
 * Call this synchronously inside your touchstart/touchend/click handler.
 * On iOS, AudioContext must be created AND resumed in the same call stack
 * as the user gesture — any async delay loses the gesture context.
 */
export function unlockAudioContext() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    // .resume() returns a Promise but we don't await it here intentionally —
    // the resume request is registered synchronously, which is what iOS needs.
    ctx.resume().catch(() => {});
  }
}

function playTapTone(kind = "tap") {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const isSwipe = kind === "swipe";

    osc.type = isSwipe ? "triangle" : "sine";
    osc.frequency.setValueAtTime(isSwipe ? 170 : 240, now);
    osc.frequency.exponentialRampToValueAtTime(isSwipe ? 120 : 170, now + 0.06);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(isSwipe ? 0.024 : 0.018, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (isSwipe ? 0.08 : 0.055));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + (isSwipe ? 0.085 : 0.06));
  } catch (e) {
    // Silently ignore — audio is non-critical
  }
}

function tryVibration(kind = "tap") {
  // navigator.vibrate is not supported on iOS Safari at all.
  // This will only run on Android/desktop browsers.
  if (typeof navigator === "undefined") return false;
  if (typeof navigator.vibrate !== "function") return false;

  try {
    return kind === "swipe"
      ? navigator.vibrate([8, 18, 10])
      : navigator.vibrate(10);
  } catch (e) {
    return false;
  }
}

/**
 * Main entry point. Call this inside your event handler, AFTER unlockAudioContext().
 *
 * Example:
 *   element.addEventListener('touchend', (e) => {
 *     unlockAudioContext();           // must be synchronous, same call stack as gesture
 *     triggerInteractionFeedback('tap');
 *   });
 */
export function triggerInteractionFeedback(kind = "tap") {
  if (typeof window !== "undefined" && window.__DEBUG_FEEDBACK) {
    console.log("[Feedback]", kind, { time: Date.now() });
  }

  // Vibration API: Android only. iOS blocks this entirely.
  tryVibration(kind);

  // Audio tone: works on iOS if unlockAudioContext() was called first
  // in the same synchronous gesture handler.
  playTapTone(kind);
}