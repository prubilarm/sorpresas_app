export interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  formattedDateLabel: string;
}

/**
 * Safely parses any date input (string "YYYY-MM-DD" or Date object).
 */
export function parseSafeDate(dateInput?: string | Date | null): Date {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) return Number.isNaN(dateInput.getTime()) ? new Date() : dateInput;

  // Handles "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss"
  const cleanStr = String(dateInput).trim();
  if (!cleanStr) return new Date();

  if (cleanStr.includes('T')) {
    const d = new Date(cleanStr);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }

  const d = new Date(`${cleanStr}T12:00:00`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Formats date into Spanish readable string (ej. "14 DE FEBRERO 2024").
 */
export function formatDateLabel(dateInput?: string | Date | null): string {
  try {
    const date = parseSafeDate(dateInput);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-CL', options).toUpperCase().replace(/ DE /g, ' ');
  } catch (err) {
    return String(dateInput || '');
  }
}

/**
 * Calculates exact elapsed time (years, months, days) taking leap years and variable month lengths into account.
 */
export function calculateTimeElapsed(startDateInput: string | Date, targetDateInput?: string | Date): TimeElapsed {
  const safeStart = parseSafeDate(startDateInput);
  const safeTarget = targetDateInput ? parseSafeDate(targetDateInput) : new Date();

  if (safeStart > safeTarget) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      formattedDateLabel: formatDateLabel(safeStart),
    };
  }

  const diffMs = safeTarget.getTime() - safeStart.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let years = safeTarget.getFullYear() - safeStart.getFullYear();
  let anniversary = new Date(safeStart);
  anniversary.setFullYear(safeStart.getFullYear() + years);

  if (anniversary > safeTarget) {
    years--;
    anniversary.setFullYear(safeStart.getFullYear() + years);
  }

  let months = 0;
  const cursor = new Date(anniversary);

  while (months < 11) {
    const nextMonth = new Date(cursor);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth > safeTarget) break;
    cursor.setMonth(cursor.getMonth() + 1);
    months++;
  }

  const days = Math.max(0, Math.floor((safeTarget.getTime() - cursor.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    years,
    months,
    days,
    totalDays,
    formattedDateLabel: formatDateLabel(safeStart),
  };
}
