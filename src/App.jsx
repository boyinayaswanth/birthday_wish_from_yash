import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import BackgroundParticles from './components/BackgroundParticles';
import DecorativeBorders from './components/DecorativeBorders';
import NameEntry from './components/NameEntry';
import BirthdayHero from './components/BirthdayHero';
import AgeCounter from './components/AgeCounter';
import PageTwo from './components/PageTwo';
import PageThree from './components/PageThree';
import SowmyaNamePage from './components/SowmyaNamePage';
import SecretAnalytics from './components/SecretAnalytics';
import { playAudio, stopAudio, getAudio } from './utils/audioManager';
import { startTrackingSession, trackPageChange } from './utils/visitorTracker';

/**
 * Main App Component for Sowmya's Birthday Website
 * Music plays ONLY on Page 2 (the eye photo page), and stops on all other pages.
 */
export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentPage, setCurrentPage] = useState('birthday'); // 'birthday' | 'quote' | 'message' | 'name' | 'secret'
  const [isPageFading, setIsPageFading] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Strict guard: ensure audio automatically plays on Page 2 ('quote' - eye photo page), and stops on all other pages
  useEffect(() => {
    if (currentPage === 'quote') {
      playAudio()
        .then(() => setIsPlayingMusic(true))
        .catch((err) => {
          console.warn('Page 2 autoplay gesture required or blocked:', err);
        });
    } else {
      stopAudio();
      setIsPlayingMusic(false);
    }
  }, [currentPage]);

  // Synchronize audio state with HTMLAudioElement events
  useEffect(() => {
    const audio = getAudio();
    const handlePlay = () => setIsPlayingMusic(true);
    const handlePause = () => setIsPlayingMusic(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const handleUnlock = (enteredName) => {
    // Pre-warm the audio file on this user gesture so browser is primed
    try {
      const audio = getAudio();
      audio.load();
    } catch (e) {}

    // Silently start tracking session with the visitor's name
    startTrackingSession(enteredName);

    setIsExiting(true);

    // Subtle, elegant champagne gold & soft rose confetti burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#e2c08d', '#f5e4c3', '#e57373', '#ffffff', '#1a535c'],
        ticks: 200,
        gravity: 0.8,
        scalar: 0.85,
        shapes: ['circle']
      });
      setIsUnlocked(true);
    }, 650);
  };

  // Navigating to Page 2 (Eye pic page)
  // Automatically plays audio on entering Page 2 without needing an extra click!
  const handleGoToPageTwo = () => {
    trackPageChange('quote');

    // Trigger audio immediately on the user's click gesture so it plays automatically when Page 2 opens
    playAudio()
      .then(() => setIsPlayingMusic(true))
      .catch((err) => {
        console.warn('Playback gesture required or blocked:', err);
        setIsPlayingMusic(false);
      });

    setIsPageFading(true);
    setTimeout(() => {
      setCurrentPage('quote');
      setIsPageFading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  // Navigating to Page 3: STOP audio immediately!
  const handleGoToPageThree = () => {
    trackPageChange('message');

    // Immediately stop audio - music is strictly on Page 2 only
    stopAudio();
    setIsPlayingMusic(false);

    setIsPageFading(true);
    setTimeout(() => {
      setCurrentPage('message');
      setIsPageFading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  // Navigating back to Page 2 from Page 3: Resume audio automatically!
  const handleGoBackToPageTwo = () => {
    trackPageChange('quote');

    playAudio()
      .then(() => setIsPlayingMusic(true))
      .catch(() => setIsPlayingMusic(false));

    setIsPageFading(true);
    setTimeout(() => {
      setCurrentPage('quote');
      setIsPageFading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  // Navigating back to Page 1 from Page 2: STOP audio immediately!
  const handleGoBackToBirthday = () => {
    trackPageChange('birthday');

    // Immediately stop audio
    stopAudio();
    setIsPlayingMusic(false);

    setIsPageFading(true);
    setTimeout(() => {
      setCurrentPage('birthday');
      setIsPageFading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  // Secret trigger: clicking the love symbol on Page 3
  const handleOpenSecret = () => {
    stopAudio();
    setIsPlayingMusic(false);

    setIsPageFading(true);
    setTimeout(() => {
      setCurrentPage('secret');
      setIsPageFading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const handleGoBackFromSecret = () => {
    setIsPageFading(true);
    setTimeout(() => {
      setCurrentPage('message');
      setIsPageFading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  // Navigating to Page 4: Sowmya Name Page (from Page 3 Message)
  const handleGoToNamePage = () => {
    trackPageChange('name');

    setIsPageFading(true);
    setTimeout(() => {
      setCurrentPage('name');
      setIsPageFading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  // Navigating back to Page 3 Message from Sowmya Name Page
  const handleGoBackToMessage = () => {
    trackPageChange('message');

    setIsPageFading(true);
    setTimeout(() => {
      setCurrentPage('message');
      setIsPageFading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  return (
    <main className="app-viewport">
      {/* Decorative vertical lines on left and right borders */}
      <DecorativeBorders />

      {/* Floating subtle stardust particles on deep dark teal background */}
      <BackgroundParticles />

      {/* Subtle ambient vignette */}
      <div className="ambient-vignette" aria-hidden="true" />

      {/* Main Interactive Stage */}
      <div className={`main-stage ${(currentPage === 'name' || currentPage === 'secret') ? 'name-stage-wide' : ''}`}>
        {!isUnlocked ? (
          <NameEntry onUnlock={handleUnlock} isExiting={isExiting} />
        ) : (
          <div className={`page-content-wrapper ${isPageFading ? 'page-fade-exit' : ''}`}>
            {currentPage === 'birthday' && (
              <article className="birthday-screen" aria-live="polite">
                <BirthdayHero />
                <AgeCounter />

                {/* Elegant Next Page Button */}
                <div className="page-navigation-wrapper">
                  <button
                    id="next-page-btn"
                    type="button"
                    onClick={handleGoToPageTwo}
                    className="next-page-button"
                    aria-label="Go to next page"
                  >
                    <span>Next</span>
                    <span className="arrow">→</span>
                  </button>
                </div>
              </article>
            )}

            {currentPage === 'quote' && (
              <PageTwo 
                onBack={handleGoBackToBirthday}
                onNext={handleGoToPageThree}
              />
            )}

            {currentPage === 'message' && (
              <PageThree
                onBack={handleGoBackToPageTwo}
                onNext={handleGoToNamePage}
                onHome={handleGoBackToBirthday}
                onOpenSecret={handleOpenSecret}
              />
            )}

            {currentPage === 'name' && (
              <SowmyaNamePage
                onBack={handleGoBackToMessage}
                onHome={handleGoBackToBirthday}
              />
            )}

            {currentPage === 'secret' && (
              <SecretAnalytics
                onBack={handleGoBackFromSecret}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
