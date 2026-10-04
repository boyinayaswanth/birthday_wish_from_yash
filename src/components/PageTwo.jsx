import React, { useState, useEffect } from 'react';
import { getAudio, playAudio } from '../utils/audioManager';

/**
 * PageTwo Component
 * Features:
 * - 11-second timed suspense veil informing user to wait for the music & picture
 * - Cinematic animated reveal of Sowmya's eyes after exactly 11 seconds
 * - The love quote and Yash's signature with white love symbol
 * - Music plays automatically without manual stop option
 */
export default function PageTwo({ onBack, onNext }) {
  const [timeLeft, setTimeLeft] = useState(11);
  const [progress, setProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  // Automatically trigger audio playback and ensure seamless auto-play
  useEffect(() => {
    const startAudio = () => {
      const audio = getAudio();
      if (audio && audio.paused) {
        playAudio().catch(() => {});
      }
    };

    startAudio();

    // In case browser requires interaction before unmuting, start on first touch/click
    window.addEventListener('pointerdown', startAudio, { once: true, passive: true });
    window.addEventListener('touchstart', startAudio, { once: true, passive: true });
    window.addEventListener('click', startAudio, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', startAudio);
      window.removeEventListener('touchstart', startAudio);
      window.removeEventListener('click', startAudio);
    };
  }, []);

  // Exactly 11 seconds countdown before revealing the picture with animation
  useEffect(() => {
    const TOTAL_DURATION_MS = 11000; // exactly 11 seconds
    const startTime = Date.now();

    setTimeLeft(11);
    setProgress(0);
    setIsRevealed(false);
    setIsRevealing(false);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (TOTAL_DURATION_MS - elapsed) / 1000);
      const currentProgress = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);

      setTimeLeft(remaining);
      setProgress(currentProgress);

      if (elapsed >= TOTAL_DURATION_MS) {
        clearInterval(interval);
        setIsRevealing(true);
        setTimeout(() => {
          setIsRevealed(true);
          setIsRevealing(false);
        }, 600);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <article className="page-two-container" aria-label="A special message for Sowmya">
      {/* Navigation header with Back button */}
      <nav className="page-two-nav">
        <button 
          type="button" 
          onClick={onBack} 
          className="back-button"
          aria-label="Back to Birthday Screen"
        >
          <span className="arrow">←</span>
          <span>Back</span>
        </button>
      </nav>

      {/* Cinematic Frame for Sowmya's Eyes */}
      <figure className="eyes-frame-container">
        <div className="eyes-glass-wrapper">
          <img 
            src={`${import.meta.env.BASE_URL}images/sowmya_eyes_cinematic.jpg`} 
            alt="Sowmya's captivating eyes" 
            className={`eyes-image ${isRevealed ? 'is-revealed' : 'is-concealed'}`}
            loading="eager"
            onError={(e) => {
              if (!e.target._retried) {
                e.target._retried = true;
                e.target.src = './images/sowmya_eyes_cinematic.jpg';
              }
            }}
          />
          {isRevealed && <div className="eyes-dark-fade-curtain" aria-hidden="true" />}
          <div className="eyes-vignette-overlay" aria-hidden="true" />

          {/* 12.50-Second Countdown Mystery Veil */}
          {!isRevealed && (
            <div className={`eyes-mystery-veil ${isRevealing ? 'veil-opening' : ''}`}>
              <div className="veil-glow" aria-hidden="true" />
              <div className="veil-sparkles" aria-hidden="true">
                <span className="veil-star s1">✦</span>
                <span className="veil-star s2">✧</span>
                <span className="veil-star s3">✦</span>
              </div>
              <div className="veil-content">
                <p className="veil-instruct-title">
                  Please wait 11 seconds to see the picture ✨
                </p>
                <div className="veil-timer-badge">
                  <span className="veil-timer-icon">⏳</span>
                  <span className="veil-timer-num">
                    {Math.ceil(timeLeft)}s
                  </span>
                </div>
                <div className="veil-progress-track" aria-hidden="true">
                  <div 
                    className="veil-progress-bar" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="veil-sub-text">
                  Listen closely to the music... 🎵
                </p>
              </div>
            </div>
          )}
        </div>
        <figcaption className="sr-only">A glimpse into your eyes</figcaption>
      </figure>

      {/* The Quote */}
      <blockquote className="quote-container">
        <p className="quote-text">
          “It’s all about falling for the same person again and again”
        </p>

        {/* Writer Attribution */}
        <footer className="quote-writer-wrapper">
          <cite className="quote-signature-phrase">
            <span className="quote-dash">—</span>
            <span className="quote-writer">From the one who keeps choosing you, Yaswanth</span>
            <span className="quote-heart">♥</span>
          </cite>
        </footer>
      </blockquote>

      <div className="quote-divider" aria-hidden="true" />

      {/* Elegant Next Page Navigation to Page 3 */}
      {onNext && (
        <div className="page-two-next-wrapper">
          <button
            id="page-two-next-btn"
            type="button"
            onClick={onNext}
            className="next-page-button page-two-next-btn"
            aria-label="Go to next page"
          >
            <span>Next</span>
            <span className="arrow">→</span>
          </button>
        </div>
      )}
    </article>
  );
}
