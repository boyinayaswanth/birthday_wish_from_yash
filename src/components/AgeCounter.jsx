import React, { useState, useEffect } from 'react';
import { calculateAge, BIRTH_DATE } from '../utils/ageCalculator';

/**
 * AgeCounter Component
 * Continuously computes and displays the live calendar age from 05 October 2006, 00:00:00.
 * Displays both the 4 distinct visual blocks and the conceptual one-line format.
 */
export default function AgeCounter() {
  const [ageData, setAgeData] = useState(() => calculateAge(BIRTH_DATE, new Date()));

  useEffect(() => {
    // Update every second in lockstep
    const interval = setInterval(() => {
      setAgeData(calculateAge(BIRTH_DATE, new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { years, months, days, hours, minutes, seconds } = ageData;

  const blocks = [
    { label: 'Years', value: years, id: 'block-years' },
    { label: 'Months', value: months, id: 'block-months' },
    { label: 'Days', value: days, id: 'block-days' },
    { label: 'Hours', value: hours, id: 'block-hours' },
    { label: 'Minutes', value: minutes, id: 'block-minutes' },
    { label: 'Seconds', value: seconds, id: 'block-seconds' }
  ];

  return (
    <section className="counter-section" aria-label="Live Age Counter">
      <p className="counter-intro-label">Time blessed by your presence</p>

      {/* 6 Distinct Visual Blocks */}
      <div className="counter-blocks-grid" role="group" aria-label="Age Counter Blocks">
        {blocks.map((block) => (
          <div key={block.label} id={block.id} className="counter-block-card">
            <span className="counter-value">
              {String(block.value).padStart(2, '0')}
            </span>
            <span className="counter-unit">{block.label}</span>
          </div>
        ))}
      </div>

      {/* Conceptual Inline String Representation */}
      <div className="counter-line-badge" aria-label="Age in text">
        <p className="counter-line-text">
          <span>{years} Years</span>
          <span className="separator">·</span>
          <span>{months} Months</span>
          <span className="separator">·</span>
          <span>{days} Days</span>
          <span className="separator">·</span>
          <span>{hours} Hours</span>
          <span className="separator">·</span>
          <span>{minutes} Mins</span>
          <span className="separator">·</span>
          <span>{seconds} Secs</span>
        </p>
      </div>

      <p className="quiet-footer-note">Every second with you is a gift</p>
    </section>
  );
}
