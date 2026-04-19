let audioContext = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!audioContext) {
    audioContext = new AudioCtx();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function playTapTone(kind = "tap") {
  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = kind === "swipe" ? "triangle" : "sine";
  oscillator.frequency.setValueAtTime(kind === "swipe" ? 170 : 240, now);
  oscillator.frequency.exponentialRampToValueAtTime(kind === "swipe" ? 120 : 170, now + 0.06);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(kind === "swipe" ? 0.024 : 0.018, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "swipe" ? 0.08 : 0.055));

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + (kind === "swipe" ? 0.085 : 0.06));
}


function triggerVibration(kind = "tap") {
  // Try vibration API first
  let vibrated = false;
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    if (kind === "swipe") {
      vibrated = navigator.vibrate([8, 18, 10]);
    } else {
      vibrated = navigator.vibrate(10);
    }
  }
  // If vibration API didn't run (or isn't present), attempt an audio fallback.
  // Note: Audio playback may be blocked until the page has received a user gesture.
  if (!vibrated && typeof window !== "undefined") {
    try {
      const ctx = getAudioContext();
      if (ctx) {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(kind === "swipe" ? 120 : 180, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      }
    } catch (e) {
      // ignore
    }
  }
}

// Provide a public unlock function so the app can create/resume the AudioContext
export function unlockAudioContext() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

export function triggerInteractionFeedback(kind = "tap") {
  // Debug log for feedback
  if (typeof window !== "undefined") {
    if (window.__DEBUG_FEEDBACK) {
      // eslint-disable-next-line no-console
      console.log("[Feedback]", kind, { time: Date.now() });
    }
  }
  triggerVibration(kind);
  playTapTone(kind);
}
