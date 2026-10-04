/**
 * Accurate Calendar Age Calculator
 * Calculates calendar years, remaining calendar months,
 * remaining calendar days, and live seconds from a birth date.
 * Handles leap years and varying month lengths accurately.
 */

export const BIRTH_DATE = new Date(2006, 9, 5, 0, 0, 0); // October 5, 2006 00:00:00 local time

export function calculateAge(birthDate = BIRTH_DATE, targetDate = new Date()) {
  const birth = new Date(birthDate.getTime());
  const target = new Date(targetDate.getTime());

  if (target < birth) {
    return {
      years: 0,
      months: 0,
      days: 0,
      seconds: 0,
      hours: 0,
      minutes: 0,
      formattedText: "0 Years · 0 Months · 0 Days · 0 Seconds"
    };
  }

  // 1. Calculate Calendar Years
  let years = target.getFullYear() - birth.getFullYear();

  // Test if this year's anniversary has passed
  let lastYearAnniversary = new Date(
    birth.getFullYear() + years,
    birth.getMonth(),
    birth.getDate(),
    birth.getHours(),
    birth.getMinutes(),
    birth.getSeconds()
  );

  if (target < lastYearAnniversary) {
    years--;
    lastYearAnniversary = new Date(
      birth.getFullYear() + years,
      birth.getMonth(),
      birth.getDate(),
      birth.getHours(),
      birth.getMinutes(),
      birth.getSeconds()
    );
  }

  // 2. Calculate Remaining Calendar Months
  let months = 0;
  let currentCheckpoint = new Date(lastYearAnniversary.getTime());

  while (true) {
    // Determine the next month anniversary
    // Handles varying month lengths (e.g. 28, 30, 31 days)
    const nextMonthYear = currentCheckpoint.getFullYear() + (currentCheckpoint.getMonth() === 11 ? 1 : 0);
    const nextMonthVal = (currentCheckpoint.getMonth() + 1) % 12;
    
    // Days in target month
    const daysInTargetMonth = new Date(nextMonthYear, nextMonthVal + 1, 0).getDate();
    const targetDay = Math.min(birth.getDate(), daysInTargetMonth);

    const nextMonthCheckpoint = new Date(
      nextMonthYear,
      nextMonthVal,
      targetDay,
      birth.getHours(),
      birth.getMinutes(),
      birth.getSeconds()
    );

    if (nextMonthCheckpoint <= target) {
      months++;
      currentCheckpoint = nextMonthCheckpoint;
    } else {
      break;
    }
  }

  // 3. Calculate Remaining Calendar Days
  let days = 0;
  while (true) {
    const nextDayCheckpoint = new Date(currentCheckpoint.getTime() + 24 * 60 * 60 * 1000);
    if (nextDayCheckpoint <= target) {
      days++;
      currentCheckpoint = nextDayCheckpoint;
    } else {
      break;
    }
  }

  // 4. Hours, Minutes, and Seconds
  const remainingMs = Math.max(0, target.getTime() - currentCheckpoint.getTime());
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  const formattedText = `${years} Years · ${months} Months · ${days} Days · ${hours} Hours · ${minutes} Mins · ${seconds} Secs`;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    formattedText
  };
}
