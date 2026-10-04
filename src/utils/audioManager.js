/**
 * AudioManager Utility
 * Centralizes continuous playback for the romantic background music.
 * Supports auto-playback on page load with seamless interaction fallback,
 * and continuous looping playback across all pages.
 */

let audioInstance = null;

export function getAudio() {
  if (!audioInstance) {
    audioInstance = new Audio('/audio/ReelAudio-84992.mp3');
    audioInstance.loop = true;
    audioInstance.volume = 0.85;
    audioInstance.preload = 'auto';

    // Bulletproof loop listener
    audioInstance.addEventListener('ended', () => {
      if (audioInstance) {
        audioInstance.currentTime = 0;
        audioInstance.play().catch(() => {});
      }
    });
  }
  return audioInstance;
}

export function playAudio() {
  const audio = getAudio();
  return audio.play();
}

export function pauseAudio() {
  if (audioInstance) {
    audioInstance.pause();
  }
}

export function stopAudio() {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance.currentTime = 0;
  }
}

export function toggleAudio() {
  const audio = getAudio();
  if (isAudioPlaying()) {
    audio.pause();
    return false;
  } else {
    return audio.play().then(() => true).catch(() => false);
  }
}

export function isAudioPlaying() {
  if (!audioInstance) return false;
  return !audioInstance.paused && audioInstance.currentTime > 0 && !audioInstance.ended;
}

// Backward-compatible aliases
export const playPageTwoAudio = playAudio;
export const stopPageTwoAudio = pauseAudio;
