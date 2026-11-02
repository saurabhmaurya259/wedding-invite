import test from 'node:test';
import assert from 'node:assert/strict';
import { weddingDetails } from '../src/data/weddingDetails.js';

function parseUtc(value) {
  const text = value.slice(0, 4) + '-' + value.slice(4, 6) + '-' + value.slice(6, 8)
    + 'T' + value.slice(9, 11) + ':' + value.slice(11, 13) + ':' + value.slice(13, 15) + 'Z';
  return new Date(text);
}

function timeParts(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: weddingDetails.calendar.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

test('wedding invitation configuration has the required core details', () => {
  assert.ok(weddingDetails.couple.brideName);
  assert.ok(weddingDetails.couple.groomName);
  assert.ok(weddingDetails.couple.hashtag);
  assert.ok(weddingDetails.date.countdownTarget);
  assert.ok(weddingDetails.venue.name);
  assert.ok(weddingDetails.venue.address);
  assert.equal(weddingDetails.calendar.timeZone, 'Asia/Kolkata');
});

test('events have unique ids and valid calendar data', () => {
  const ids = weddingDetails.events.map((event) => event.id);
  assert.equal(new Set(ids).size, ids.length);

  for (const event of weddingDetails.events) {
    assert.ok(event.title);
    assert.ok(event.date);
    assert.ok(event.time);
    assert.ok(event.venue);
    assert.ok(event.address);
    assert.ok(event.mapLink);
    assert.ok(event.gcal.startsWith('https://calendar.google.com/'));
    assert.ok(event.outlook.startsWith('https://outlook.live.com/'));

    const start = parseUtc(event.icsStart);
    const end = parseUtc(event.icsEnd);
    assert.ok(Number.isFinite(start.getTime()));
    assert.ok(end > start);

    const dates = new URL(event.gcal).searchParams.get('dates');
    assert.equal(dates, event.icsStart + '/' + event.icsEnd);

    assert.equal(new Date(new URL(event.outlook).searchParams.get('startdt')).getTime(), start.getTime());
    assert.equal(new Date(new URL(event.outlook).searchParams.get('enddt')).getTime(), end.getTime());
  }
});

test('UTC calendar values match the date and time displayed to Indian guests', () => {
  for (const event of weddingDetails.events) {
    const local = timeParts(parseUtc(event.icsStart));
    const [dayToken, monthName, year] = event.date.split(' ');
    const dayNumber = Number(dayToken.replace('st', '').replace('nd', '').replace('rd', '').replace('th', ''));
    assert.ok(Number.isInteger(dayNumber), 'Unexpected date label: ' + event.date);

    const day = String(dayNumber).padStart(2, '0');
    const month = String(new Date(monthName + ' 1, ' + year).getMonth() + 1).padStart(2, '0');
    const date = year + '-' + month + '-' + day;
    const localDate = local.year + '-' + local.month + '-' + local.day;
    const localTime = local.hour + ':' + local.minute + ' ' + local.dayPeriod;

    assert.equal(localDate, date, event.title + ' local date');
    assert.equal(localTime, event.time, event.title + ' local time');
  }
});

test('RSVP defaults and contact details are internally consistent', () => {
  const eventTitles = weddingDetails.events.map((event) => event.title);
  assert.deepEqual(weddingDetails.rsvp.defaultAttendingEvents, eventTitles);
  assert.ok(weddingDetails.rsvp.countryCodes.includes(weddingDetails.rsvp.defaultCountryCode));
  assert.deepEqual(
    weddingDetails.rsvp.teamOptions,
    [
      'Team ' + weddingDetails.couple.brideName,
      'Team ' + weddingDetails.couple.groomName,
      'Team Both!',
    ],
  );
  assert.ok(weddingDetails.rsvp.phonePlaceholder);
  assert.ok(weddingDetails.contact.name);
  assert.ok(weddingDetails.contact.relationship);
  assert.ok(weddingDetails.contact.phone.startsWith('+'));
  assert.equal(weddingDetails.contact.whatsapp, weddingDetails.contact.phone.slice(1));
});

test('family, venue, and asset configuration is complete', () => {
  assert.ok(weddingDetails.family.brideParents);
  assert.ok(weddingDetails.family.groomParents);
  assert.ok(weddingDetails.venue.mapLink.startsWith('https://'));
  assert.ok(weddingDetails.assets.baseUrl.startsWith('https://'));
  assert.ok(weddingDetails.assets.backgroundMusic.startsWith('https://'));
  assert.ok(weddingDetails.calendar.invitationUrl.startsWith('https://'));
});
