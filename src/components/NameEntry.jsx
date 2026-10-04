import React, { useState } from 'react';

/**
 * NameEntry Component
 * Handles the secret entry experience.
 * Accepts "Sowmya" (case-insensitive and trimmed), rejects others with an elegant hint.
 */
export default function NameEntry({ onUnlock, isExiting }) {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) {
      triggerError("Please enter your name first");
      return;
    }

    const normalized = trimmed.toLowerCase();
    if (normalized !== 'sowmya' && normalized !== 'soumya') {
      triggerError("Sorry, this celebration is not for you ✨");
      return;
    }

    setErrorMessage('');
    onUnlock(trimmed);
  };

  const triggerError = (msg) => {
    setErrorMessage(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <section 
      className={`entry-container ${isExiting ? 'exiting' : ''}`}
      aria-labelledby="entry-heading"
    >
      <header>
        <p className="entry-eyebrow">A Special Celebration</p>
        <h1 id="entry-heading" className="entry-title">
          Before we begin...
          <br />
          <span style={{ fontSize: '0.88em', fontWeight: 300, color: 'rgba(255,255,255,0.92)' }}>
            Tell me your name
          </span>
        </h1>
      </header>

      <form className="entry-form" onSubmit={handleSubmit} noValidate>
        <div className="input-wrapper">
          <input
            id="name-input"
            type="text"
            className={`name-input ${isShaking ? 'error-shake' : ''}`}
            placeholder="Enter your name..."
            value={inputValue}
            onChange={handleInputChange}
            autoComplete="off"
            autoFocus
            aria-label="Enter your name"
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? "entry-error-msg" : undefined}
          />
        </div>

        <button 
          id="open-btn"
          type="submit" 
          className="open-button"
        >
          Open
        </button>
      </form>

      {errorMessage && (
        <p id="entry-error-msg" className="error-message" role="alert">
          {errorMessage}
        </p>
      )}
    </section>
  );
}
