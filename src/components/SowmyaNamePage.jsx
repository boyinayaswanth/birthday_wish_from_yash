import React, { useState, useEffect } from 'react';

/**
 * All 20 phonetic / script renderings of "Sowmya"
 * Placed in the exact organic celestial constellation shown in Picture 2
 */
export const LANGUAGE_NAMES = [
  // Top Canopy
  { script: 'सौम्या', lang: 'Hindi', x: 48.5, y: 15, mobX: 50, mobY: 6, delay: 0.15, drift: 'drift-1', parallaxFactor: 12 },
  { script: 'சௌம்யா', lang: 'Tamil', x: 67, y: 19, mobX: 24, mobY: 12.5, delay: 0.45, drift: 'drift-4', parallaxFactor: 14 },
  { script: 'సౌమ్యా', lang: 'Telugu', x: 17, y: 24, mobX: 76, mobY: 12.5, delay: 0.25, drift: 'drift-2', parallaxFactor: 15 },
  { script: 'ಸೌಮ్యా', lang: 'Kannada', x: 32.5, y: 24, mobX: 50, mobY: 19, delay: 0.35, drift: 'drift-3', parallaxFactor: 11 },
  { script: 'ソウミャ', lang: 'Japanese', x: 63, y: 30, mobX: 20, mobY: 25, delay: 0.55, drift: 'drift-1', parallaxFactor: 13 },
  { script: '소우먀', lang: 'Korean', x: 83, y: 27, mobX: 80, mobY: 25, delay: 0.65, drift: 'drift-2', parallaxFactor: 16 },
  { script: 'सौम्या', lang: 'Marathi', x: 12, y: 37, mobX: 36, mobY: 31.5, delay: 0.75, drift: 'drift-3', parallaxFactor: 18 },
  { script: 'Соумья', lang: 'Russian', x: 88, y: 43, mobX: 64, mobY: 31.5, delay: 0.8, drift: 'drift-2', parallaxFactor: 17 },
  { script: 'സൗമ്യാ', lang: 'Malayalam', x: 28, y: 39, mobX: 17, mobY: 37.5, delay: 0.3, drift: 'drift-4', parallaxFactor: 10 },
  { script: 'সৌম্যা', lang: 'Bengali', x: 74, y: 39, mobX: 83, mobY: 37.5, delay: 0.4, drift: 'drift-1', parallaxFactor: 12 },

  // Bottom Canopy (under the central Sowmya and swash)
  { script: 'સૌમ્યા', lang: 'Gujarati', x: 19, y: 49, mobX: 18, mobY: 58.5, delay: 0.5, drift: 'drift-3', parallaxFactor: 14 },
  { script: 'ସୌମ୍ୟା', lang: 'Odia', x: 87, y: 59, mobX: 82, mobY: 58.5, delay: 0.9, drift: 'drift-2', parallaxFactor: 16 },
  { script: 'सौम्या', lang: 'Assamese', x: 71.5, y: 54, mobX: 34, mobY: 65, delay: 0.85, drift: 'drift-4', parallaxFactor: 11 },
  { script: 'ਸੌਮਿਆ', lang: 'Punjabi', x: 17, y: 61, mobX: 66, mobY: 65, delay: 0.6, drift: 'drift-1', parallaxFactor: 15 },
  { script: 'सौम्या', lang: 'Sanskrit', x: 49, y: 69, mobX: 50, mobY: 71.5, delay: 1.05, drift: 'drift-1', parallaxFactor: 9 },
  { script: 'صوميا', lang: 'Arabic', x: 14, y: 75, mobX: 22, mobY: 78, delay: 0.7, drift: 'drift-3', parallaxFactor: 17 },
  { script: 'โซมยา', lang: 'Thai', x: 63, y: 75, mobX: 78, mobY: 78, delay: 1.15, drift: 'drift-2', parallaxFactor: 14 },
  { script: 'Σούμια', lang: 'Greek', x: 32, y: 73, mobX: 35, mobY: 84.5, delay: 0.95, drift: 'drift-4', parallaxFactor: 13 },
  { script: '索米娅', lang: 'Chinese', x: 79, y: 71, mobX: 65, mobY: 84.5, delay: 1.25, drift: 'drift-3', parallaxFactor: 15 },
  { script: 'סומיה', lang: 'Hebrew', x: 49, y: 82, mobX: 50, mobY: 89.5, delay: 1.35, drift: 'drift-4', parallaxFactor: 10 }
];

/**
 * SowmyaNamePage Component
 * Full-width cinematic composition matching Picture 2.
 */
export default function SowmyaNamePage({ onBack, onHome }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <article 
      className={`name-page-viewport ${isReady ? 'is-animated' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Sowmya in every language"
    >
      {/* Subtle discreet return link */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="name-page-back-link"
          aria-label="Return to previous page"
          title="Return"
        >
          <span className="arrow">←</span>
        </button>
      )}

      {/* Main Wide Constellation Stage */}
      <div className="name-constellation-stage" role="presentation">
        
        {/* Central Luminous Focus: Sowmya with Heart Swash */}
        <div className="center-sowmya-container">
          <div className="center-sowmya-glow" aria-hidden="true" />
          <h1 className="center-sowmya-title">
            Sowmya
          </h1>
          
          {/* Elegant Calligraphic Heart Flourish under Sowmya */}
          <div className="center-sowmya-swash" aria-hidden="true">
            <svg width="150" height="24" viewBox="0 0 150 24" fill="none" className="swash-svg">
              <path 
                d="M12 12 C40 18, 55 18, 64 12" 
                stroke="rgba(226, 192, 141, 0.65)" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
              />
              <path 
                d="M86 12 C95 18, 110 18, 138 12" 
                stroke="rgba(226, 192, 141, 0.65)" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
              />
            </svg>
            <span className="swash-heart">♥</span>
          </div>
        </div>

        {/* 20 International Language Names Galaxy */}
        <div className="language-names-galaxy" aria-hidden="true">
          {LANGUAGE_NAMES.map((item, idx) => {
            const parallaxX = mouseOffset.x * item.parallaxFactor;
            const parallaxY = mouseOffset.y * item.parallaxFactor;

            return (
              <div
                key={`${item.lang}-${idx}`}
                className={`floating-lang-name ${item.drift}`}
                style={{
                  '--desk-x': `${item.x}%`,
                  '--desk-y': `${item.y}%`,
                  '--mob-x': `${item.mobX}%`,
                  '--mob-y': `${item.mobY}%`,
                  animationDelay: `${item.delay}s`
                }}
                title={item.lang}
              >
                <span 
                  className="lang-text"
                  style={{
                    transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`
                  }}
                >
                  {item.script}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Poetic Statement matching Picture 2 */}
        <footer className="name-page-footer">
          <p className="name-page-tagline">
            One name, a thousand ways to say it...
          </p>
          <div 
            className="name-page-heart"
            onClick={onHome || onBack}
            role="button"
            tabIndex={0}
            aria-label="A delicate heart"
          >
            ♥
          </div>
        </footer>
      </div>
    </article>
  );
}
