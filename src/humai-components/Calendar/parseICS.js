import ICAL from 'ical.js';

export function parseICS(icsData) {
  try {
    const parsed = ICAL.parse(icsData);
    const comp = new ICAL.Component(parsed);
    const events = comp.getAllSubcomponents('vevent').map((event) => {
      const vevent = new ICAL.Event(event);
      return {
        summary: vevent.summary || '',
        start: vevent.startDate?.toJSDate() || null,
        end: vevent.endDate?.toJSDate() || null,
        location: vevent.location || '',
        description: vevent.description || '',
        uid: vevent.uid || '',
        // Add any other properties you need
      };
    });
    return events;
  } catch (error) {
    console.error('Error parsing ICS data:', error);
    return [];
  }
}

export async function fetchICSFile(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'text/calendar',
      },
    });
    if (!response.ok) { throw new Error(`Failed to fetch ICS: ${response.statusText}`); }
    const icsData = await response.text();
    return parseICS(icsData);
  } catch (error) {
    console.error('Error fetching ICS file:', error);
    return [];
  }
}

// Export the functions and URL for use in other files
// module.exports = {
//   parseICS,
//   fetchICSFile,
//   calendarUrl,
// };
