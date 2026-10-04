import React from 'react';

/**
 * BirthdayHero Component
 * The prime visual focus of Page 1.
 * Features timeless editorial typography for Sowmya's birthday greeting.
 */
export default function BirthdayHero() {
  return (
    <section className="hero-section" aria-label="Birthday Greeting">
      <span className="hero-subtitle-top">Dearest Sowmya</span>

      <h1 className="hero-main-title">
        Happy Birthday
      </h1>

      <p className="hero-secondary-line">
        to the Most Beautiful Soul in the World...
        <span className="hero-heart-container" aria-label="love">
          <span className="hero-heart">♥</span>
        </span>
      </p>

      <div className="hero-divider" aria-hidden="true" />
    </section>
  );
}
