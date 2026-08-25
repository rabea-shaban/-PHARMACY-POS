import { BadRequestError } from './errors.js';

export interface ParsedDateRange {
  startDate: Date;
  endDate: Date;
  fromStr: string;
  toStr: string;
}

/**
 * Parses and validates an inclusive date range.
 * If neither is provided, defaults to today (00:00:00.000 to 23:59:59.999).
 * End date is made inclusive (23:59:59.999 of the specified day).
 */
export function parseDateRange(from?: string, to?: string, defaultDaysBack?: number): ParsedDateRange {
  let startDate: Date;
  let endDate: Date;

  const now = new Date();

  if (from) {
    startDate = new Date(from);
    if (isNaN(startDate.getTime())) {
      throw new BadRequestError(`Invalid 'from' date parameter: '${from}'. Use YYYY-MM-DD format.`);
    }
    // Set to beginning of the day if date only (YYYY-MM-DD)
    if (from.length === 10) {
      startDate.setHours(0, 0, 0, 0);
    }
  } else if (defaultDaysBack !== undefined && defaultDaysBack > 0) {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - defaultDaysBack);
    startDate.setHours(0, 0, 0, 0);
  } else {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
  }

  if (to) {
    endDate = new Date(to);
    if (isNaN(endDate.getTime())) {
      throw new BadRequestError(`Invalid 'to' date parameter: '${to}'. Use YYYY-MM-DD format.`);
    }
    // Set to end of day if date only (YYYY-MM-DD)
    if (to.length === 10) {
      endDate.setHours(23, 59, 59, 999);
    }
  } else {
    endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);
  }

  if (startDate > endDate) {
    throw new BadRequestError(`'from' date (${startDate.toISOString().slice(0, 10)}) cannot be after 'to' date (${endDate.toISOString().slice(0, 10)})`);
  }

  // Maximum range protection (e.g. 5 years = 1825 days)
  const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > 1825) {
    throw new BadRequestError(`Date range cannot exceed 5 years (1825 days).`);
  }

  function formatLocalDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const fromStr = from && from.length === 10 ? from : formatLocalDate(startDate);
  const toStr = to && to.length === 10 ? to : formatLocalDate(endDate);

  return {
    startDate,
    endDate,
    fromStr,
    toStr,
  };
}
