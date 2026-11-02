/**
 * Central wedding invitation content.
 * Current sample details are deliberately preserved as-is.
 */
export const weddingDetails = {
  couple: {
    brideName: 'Muskan',
    groomName: 'Devesh',
    dateLabel: '01 — 02 December 2026',
    hashtag: '#MuskanWedsDevesh',
  },
  date: {
    day: '2',
    month: 'DEC',
    year: '2026',
    countdownTarget: '2026-12-02T18:00:00+05:30',
  },
  family: {
    brideParents: 'Smt. Arpana Dubey & Shri D.S. Dubey',
    groomParents: 'Smt. Mintoo Devi Singh & Shri Ram Awadh Singh',
  },
  venue: {
    name: 'Ps Club Royale',
    address: 'Godadih - Raipur Road Near Mahadev Ghat, Bridge, Changurabhata, Raipur, Chhattisgarh',
    mapLink: 'https://maps.app.goo.gl/7hMsBULV72HHqies8',
  },
  events: [
    {
      id: 1, date: '1st Dec 2026', title: 'Sangeet', time: '07:00 PM',
      venue: 'Ps Club Royale',
      address: 'Godadih - Raipur Road Near Mahadev Ghat, Bridge, Changurabhata, Raipur, Chhattisgarh',
      mapLink: 'https://maps.app.goo.gl/7hMsBULV72HHqies8',
      icsStart: '20261201T133000Z', icsEnd: '20261201T153000Z',
      gcal: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet&dates=20261201T133000Z/20261201T153000Z&details=https://muskanwedsdevesh.inviteutsav.com/&location=Ps+Club+Royale,+Raipur,+Chhattisgarh',
      outlook: 'https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=Sangeet&startdt=2026-12-01T13:30:00+00:00&enddt=2026-12-01T15:30:00+00:00&location=Ps+Club+Royale,+Raipur',
    },
    {
      id: 2, date: '2nd Dec 2026', title: 'Haldi', time: '11:00 AM',
      venue: 'Ps Club Royale',
      address: 'Godadih - Raipur Road Near Mahadev Ghat, Bridge, Changurabhata, Raipur, Chhattisgarh',
      mapLink: 'https://maps.app.goo.gl/7hMsBULV72HHqies8',
      icsStart: '20261202T053000Z', icsEnd: '20261202T073000Z',
      gcal: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi&dates=20261202T053000Z/20261202T073000Z&details=https://muskanwedsdevesh.inviteutsav.com/&location=Ps+Club+Royale,+Raipur,+Chhattisgarh',
      outlook: 'https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=Haldi&startdt=2026-12-02T05:30:00+00:00&enddt=2026-12-02T07:30:00+00:00&location=Ps+Club+Royale,+Raipur',
    },
    {
      id: 3, date: '2nd Dec 2026', title: 'Wedding', time: '06:00 PM',
      venue: 'Ps Club Royale',
      address: 'Godadih - Raipur Road Near Mahadev Ghat, Bridge, Changurabhata, Raipur, Chhattisgarh',
      mapLink: 'https://maps.app.goo.gl/7hMsBULV72HHqies8',
      icsStart: '20261202T123000Z', icsEnd: '20261202T143000Z',
      gcal: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding&dates=20261202T123000Z/20261202T143000Z&details=https://muskanwedsdevesh.inviteutsav.com/&location=Ps+Club+Royale,+Raipur,+Chhattisgarh',
      outlook: 'https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=Wedding&startdt=2026-12-02T12:30:00+00:00&enddt=2026-12-02T14:30:00+00:00&location=Ps+Club+Royale,+Raipur',
    },
  ],
  rsvp: {
    defaultCountryCode: 'India +91',
    countryCodes: ['India +91', 'USA +1', 'UK +44', 'UAE +971'],
    phonePlaceholder: '98765 43210',
    defaultAttendingEvents: ['Sangeet', 'Haldi', 'Wedding'],
    teamOptions: ['Team Muskan', 'Team Devesh', 'Team Both!'],
  },
  contact: {
    name: 'Shri D. S. Dubey',
    relationship: "Bride's Father",
    phone: '+919876543210',
    whatsapp: '919876543210',
  },
  calendar: {
    invitationUrl: 'https://muskanwedsdevesh.inviteutsav.com/',
    timeZone: 'Asia/Kolkata',
  },
  assets: {
    baseUrl: 'https://inviteutsav.com/wp-content/themes/inviteutsav/assets/templates/siyaram-raghukul/images',
    backgroundMusic: 'https://inviteutsav.com/wp-content/themes/inviteutsav/assets/music/marriage/marriage-music-004.mp3',
  },
};
