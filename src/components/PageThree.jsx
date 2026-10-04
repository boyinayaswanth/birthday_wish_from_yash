import React from 'react';

/**
 * PageThree Component
 * Features:
 * - Sowmya's full portrait as an ethereal, luminous watermark background
 * - Heartfelt personal message overlaid on top of the portrait
 * - Interactive reveal toggle to view the portrait with enhanced clarity
 * - Music controller synchronized with the romantic soundtrack
 */
export default function PageThree({ onBack, onHome, onOpenSecret, onNext }) {
  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (onOpenSecret) {
      onOpenSecret();
    }
  };

  return (
    <article className="page-three-container" aria-label="A heartfelt message for Sowmya">
      {/* Navigation Bar */}
      <nav className="page-three-nav">
        <button
          type="button"
          onClick={onBack}
          className="back-button"
          aria-label="Back to previous page"
        >
          <span className="arrow">←</span>
          <span>Back</span>
        </button>
      </nav>

      {/* Main Message Card */}
      <section 
        className="watermark-card"
        role="region"
        aria-label="Message card for Sowmya"
      >
        {/* Floating golden dust sparkle elements */}
        <div className="card-sparkles" aria-hidden="true">
          <span className="sparkle s1">✦</span>
          <span className="sparkle s2">✧</span>
          <span className="sparkle s3">✦</span>
        </div>

        {/* Foreground Message Overlay */}
        <div className="watermark-content-layer">
          <blockquote className="watermark-message-box">
            <p className="watermark-line line-1">
              First of all sorry for liking you.
            </p>
            <p className="watermark-line line-2">
              you have no idea how much you mean to me.
            </p>
            <p className="watermark-line line-3">
              I still think about you everyday ,you'll always have a special place in my heart,that no one else can replace it!.
            </p>
            <p className="watermark-line line-4">
              I miss you quietly every single night.
            </p>
            <p className="watermark-line line-5">
              Apart from all this, stay happy, stay blessed, and stay wealthy. You deserve all the good things life has to offer. Once again, wishing you the happiest birthday.{' '}
              <span className="watermark-heart">♥</span>
            </p>
            <p className="watermark-line line-anklets">
              And honestly, you looked really good in those anklets — I noticed them on the day of the hackathon. They suited you so beautifully.
            </p>
          </blockquote>

          {/* Emotional Signature */}
          <footer className="watermark-signature-area">
            <div className="gold-ornament-line" aria-hidden="true" />
            <p className="watermark-signoff">
              <span>Always in my thoughts</span>
              <span 
                className="watermark-heart secret-heart-trigger"
                onClick={handleHeartClick}
              >
                ♥
              </span>
            </p>
          </footer>
        </div>
      </section>

      {/* Bottom Navigation Actions */}
      <div className="page-three-actions">
        <button
          type="button"
          onClick={onBack}
          className="subtle-nav-btn"
          aria-label="Go to eyes quote"
        >
          <span>← Previous Page</span>
        </button>

        {onNext && (
          <button
            id="page-three-next-btn"
            type="button"
            onClick={onNext}
            className="next-page-button page-three-next-btn"
            aria-label="Go to Sowmya Name Page"
          >
            <span>Next</span>
            <span className="arrow">→</span>
          </button>
        )}

        {onHome && (
          <button
            type="button"
            onClick={onHome}
            className="subtle-nav-btn"
            aria-label="Return to Birthday Greeting"
          >
            <span>Back to Start ↺</span>
          </button>
        )}
      </div>
    </article>
  );
}
