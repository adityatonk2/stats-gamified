"use client";

// Tone-based sound generation using Web Audio API as fallback
// Real mp3s can be dropped into /public/sounds/ with these names:
// xp-gain.mp3, level-up.mp3, boss-hit.mp3, boss-defeat.mp3, wrong-answer.mp3, correct-answer.mp3

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    try {
      audioContext = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", gain = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.8, ctx.currentTime + duration);

  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export const Sounds = {
  correctAnswer: () => {
    playTone(880, 0.15);
    setTimeout(() => playTone(1100, 0.2), 100);
  },

  wrongAnswer: () => {
    playTone(200, 0.3, "triangle", 0.2);
  },

  xpGain: () => {
    playTone(660, 0.1);
    setTimeout(() => playTone(880, 0.15), 80);
    setTimeout(() => playTone(1100, 0.2), 160);
  },

  levelUp: () => {
    const freqs = [523, 659, 784, 1047];
    freqs.forEach((f, i) => setTimeout(() => playTone(f, 0.3), i * 120));
  },

  bossHit: () => {
    playTone(150, 0.4, "sawtooth", 0.4);
    setTimeout(() => playTone(100, 0.3, "square", 0.2), 100);
  },

  bossDefeat: () => {
    const freqs = [523, 659, 784, 1047, 1319];
    freqs.forEach((f, i) => setTimeout(() => playTone(f, 0.4), i * 100));
  },

  unlock: () => {
    playTone(440, 0.2);
    setTimeout(() => playTone(550, 0.2), 100);
    setTimeout(() => playTone(660, 0.3), 200);
  },
};
