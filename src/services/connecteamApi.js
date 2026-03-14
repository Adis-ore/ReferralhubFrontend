// Connecteam API Service
// When an API key is configured, calls go to the real Connecteam API.
// Without an API key, mock data is returned for development/demo.

import { importedHours, connecteamSyncLogs, staffUsers } from '@/data/mockData';

const BASE_URL = 'https://api.connecteam.com/v1';

const getHeaders = (apiKey) => ({
  'Content-Type': 'application/json',
  'X-API-KEY': apiKey,
});

// Test whether the API key and org ID are valid
export async function testConnection(apiKey, organizationId) {
  if (!apiKey || !organizationId) {
    return { success: false, message: 'API key and Organization ID are required' };
  }

  // Mock response - replace with real call when key is available
  // const res = await fetch(`${BASE_URL}/organizations/${organizationId}`, { headers: getHeaders(apiKey) });
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate failure for placeholder keys
      if (apiKey === 'YOUR_API_KEY' || apiKey.length < 10) {
        resolve({ success: false, message: 'Invalid API key. Check your Connecteam credentials.' });
      } else {
        resolve({ success: true, message: 'Connected successfully to Connecteam' });
      }
    }, 1200);
  });
}

// Fetch time activity records from Connecteam for a date range
export async function fetchTimeActivities(apiKey, organizationId, { from, to }) {
  if (!apiKey) {
    // Return mock data in demo mode
    return {
      success: true,
      data: importedHours,
      meta: { total: importedHours.length, from, to },
    };
  }

  try {
    const params = new URLSearchParams({ from, to, limit: 100 });
    const res = await fetch(`${BASE_URL}/time-clock/activities?${params}`, {
      headers: getHeaders(apiKey),
    });
    if (!res.ok) throw new Error(`Connecteam API error: ${res.status}`);
    const json = await res.json();
    return { success: true, data: parseActivities(json.activities || []), meta: json.meta };
  } catch (err) {
    return { success: false, message: err.message, data: [] };
  }
}

// Parse raw Connecteam time activity into the app's importedHours shape
export function parseActivities(activities) {
  return activities.map((act) => {
    const hoursWorked = parseFloat(
      ((new Date(act.clock_out) - new Date(act.clock_in)) / 3600000).toFixed(2)
    );
    const shiftType = detectShiftType(act);
    const multiplierMap = { regular: 1.0, overtime: 1.5, weekend: 2.0, public_holiday: 2.5 };

    return {
      id: `IH-CT-${act.id}`,
      connecteamShiftId: act.id,
      connecteamUserId: act.user_id,
      userId: null, // matched later by connecteamUserId
      shiftDate: act.clock_in.split('T')[0],
      clockIn: act.clock_in.split('T')[1]?.slice(0, 5),
      clockOut: act.clock_out.split('T')[1]?.slice(0, 5),
      hoursWorked,
      shiftType,
      multiplier: multiplierMap[shiftType],
      status: 'pending',
      importedAt: new Date().toISOString(),
    };
  });
}

// Derive shift type from Connecteam activity tags/metadata
function detectShiftType(act) {
  const tags = (act.tags || []).map((t) => t.toLowerCase());
  if (tags.includes('public_holiday') || tags.includes('holiday')) return 'public_holiday';
  if (tags.includes('overtime') || tags.includes('ot')) return 'overtime';
  const date = new Date(act.clock_in);
  const day = date.getDay();
  if (day === 0 || day === 6) return 'weekend';
  return 'regular';
}

// Calculate points for an hours record
// Formula: hours × hourlyRate × professionRate × shiftMultiplier
export function calculatePoints(hoursWorked, hourlyRate, professionRate, multiplier) {
  return Math.round(hoursWorked * hourlyRate * professionRate * multiplier);
}

// Get recent sync logs (mock)
export function getSyncLogs() {
  return connecteamSyncLogs;
}

// Match a Connecteam user ID to a staff user
export function matchStaffUser(connecteamUserId) {
  return staffUsers.find((u) => u.connecteamUserId === connecteamUserId) || null;
}
