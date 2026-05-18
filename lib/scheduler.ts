import { addDays, differenceInDays } from "date-fns";

/**
 * Calculates a precise Date in UTC representing the given wall-clock date and time in the specified timezone.
 * Handles DST shifts automatically.
 */
export function getUtcDate(dateStr: string, timeStr: string, timezone: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  // 1. Start with an estimate in UTC
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // 2. Format that estimate in the target timezone to find how many hours/minutes offset occurred
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(utcDate);
  const partMap = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  const yearVal = parseInt(partMap.year);
  const monthVal = parseInt(partMap.month);
  const dayVal = parseInt(partMap.day);
  const hourVal = parseInt(partMap.hour) % 24;
  const minuteVal = parseInt(partMap.minute);

  // 3. Compute what the formatted date in UTC would look like
  const formattedUtc = Date.UTC(yearVal, monthVal - 1, dayVal, hourVal, minuteVal);
  const diff = formattedUtc - utcDate.getTime();

  // 4. Adjust to match the correct wall-clock time in the given timezone
  return new Date(utcDate.getTime() - diff);
}

/**
 * Formats a UTC Date to a string in the specified timezone.
 */
export function formatInTimezone(
  date: Date,
  timezone: string,
  type: "date" | "time" | "full" | "hourMinute" | "dayName"
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
  };

  if (type === "date") {
    options.year = "numeric";
    options.month = "2-digit";
    options.day = "2-digit";
  } else if (type === "time") {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = true;
  } else if (type === "hourMinute") {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = false;
  } else if (type === "dayName") {
    options.weekday = "long";
  } else {
    options.weekday = "long";
    options.year = "numeric";
    options.month = "long";
    options.day = "numeric";
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = true;
  }

  const formatter = new Intl.DateTimeFormat("en-US", options);
  
  if (type === "hourMinute") {
    const parts = formatter.formatToParts(date);
    const partMap = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    const hour = String(parseInt(partMap.hour) % 24).padStart(2, "0");
    const minute = String(partMap.minute).padStart(2, "0");
    return `${hour}:${minute}`;
  }
  
  return formatter.format(date);
}

export interface GeneratedSlot {
  startTime: Date;
  endTime: Date;
}

/**
 * Generates all valid start and end times for a single day based on duration and buffer.
 */
export function generateSlotsForDay(
  dateStr: string,
  startTimeStr: string,
  endTimeStr: string,
  timezone: string,
  duration: number,
  buffer: number
): GeneratedSlot[] {
  const startLimit = getUtcDate(dateStr, startTimeStr, timezone);
  const endLimit = getUtcDate(dateStr, endTimeStr, timezone);

  let pointer = new Date(startLimit.getTime());
  const slots: GeneratedSlot[] = [];

  while (pointer.getTime() + duration * 60 * 1000 <= endLimit.getTime()) {
    const slotStart = new Date(pointer.getTime());
    const slotEnd = new Date(pointer.getTime() + duration * 60 * 1000);

    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
    });

    // Advance pointer by duration + buffer
    pointer = new Date(slotEnd.getTime() + buffer * 60 * 1000);
  }

  return slots;
}
