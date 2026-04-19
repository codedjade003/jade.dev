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
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;

  if (kind === "swipe") {
    navigator.vibrate([8, 18, 10]);
    return;
  }

  navigator.vibrate(10);
}

export function triggerInteractionFeedback(kind = "tap") {
  triggerVibration(kind);
  playTapTone(kind);
}
