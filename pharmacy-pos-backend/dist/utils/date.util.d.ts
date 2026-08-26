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
export declare function parseDateRange(from?: string, to?: string, defaultDaysBack?: number): ParsedDateRange;
