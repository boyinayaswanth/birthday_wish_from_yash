import React from 'react';

/**
 * DecorativeBorders Component
 * Renders subtle double vertical lines on the left and right edges of the screen,
 * echoing classical editorial framing and the reference visual design.
 */
export default function DecorativeBorders() {
  return (
    <>
      {/* Left Double Vertical Lines */}
      <aside 
        className="decorative-lines-wrapper left" 
        aria-hidden="true"
        data-testid="decorative-border-left"
      >
        <div className="double-line-group">
          <div className="vertical-line" />
          <div className="vertical-line" />
        </div>
      </aside>

      {/* Right Double Vertical Lines */}
      <aside 
        className="decorative-lines-wrapper right" 
        aria-hidden="true"
        data-testid="decorative-border-right"
      >
        <div className="double-line-group">
          <div className="vertical-line" />
          <div className="vertical-line" />
        </div>
      </aside>
    </>
  );
}
