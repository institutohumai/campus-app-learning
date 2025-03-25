export function transformScheduleDictToFormattedDates(scheduleDict) {
  if (!scheduleDict) { return []; }
  const result = [];
  const referenceDate = '2023-11-06';
  const baseDate = new Date(referenceDate);

  Object.keys(scheduleDict).forEach((day) => {
    const dayIndex = parseInt(day, 10);
    scheduleDict[day]?.forEach((timeSlot) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + dayIndex - baseDate.getDay());

      const hours = Math.floor(timeSlot / 2);
      const minutes = (timeSlot % 2) * 30;

      date.setHours(hours, minutes, 0, 0);
      result.push(date.toISOString());
    });
  });

  return result;
}

export function transformDatesToScheduleDict(dates) {
  const scheduleDict = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  dates.forEach((date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDay().toString();
    const timeSlot = dateObj.getHours() * 2 + dateObj.getMinutes() / 30;

    if (!scheduleDict[day].includes(timeSlot)) {
      scheduleDict[day].push(timeSlot);
    }
  });

  Object.keys(scheduleDict).forEach((day) => {
    scheduleDict[day].sort((a, b) => a - b);
  });

  return scheduleDict;
}

export const filterDuplicateDates = (dates) => {
  const uniqueDates = new Set();
  const filteredDates = [];

  dates.forEach((date) => {
    const formattedDate = new Date(date).toISOString();
    if (!uniqueDates.has(formattedDate)) {
      uniqueDates.add(formattedDate);
      filteredDates.push(formattedDate);
    }
  });

  return filteredDates;
};

export const formatDates = (dates) => {
  const withoutDuplicates = filterDuplicateDates(dates).map(
    (date) => new Date(date),
  );
  return withoutDuplicates;
};

export const filterOutWeekends = (dates) => dates?.filter((dateString) => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  return dayOfWeek !== 5 && dayOfWeek !== 6;
});
