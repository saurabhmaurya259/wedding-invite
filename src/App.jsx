import { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Copy, Check, Phone, MessageCircle, Instagram } from 'lucide-react';

const BASE_URL = "https://inviteutsav.com/wp-content/themes/inviteutsav/assets/templates/siyaram-raghukul/images";

// 1. Particle Canvas (Floating Golden Sparkles)
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1.5,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.6 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > canvas.height) p.y = -10;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#e6c665';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-15" />;
}

// 2. Heart-Shaped Scratch-off Component
function ScratchHeart({ label, value }) {
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Heart Clipping Path
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.26);
    ctx.bezierCurveTo(w / 2, h * 0.18, w * 0.38, h * 0.06, w * 0.22, h * 0.06);
    ctx.bezierCurveTo(w * 0.02, h * 0.06, w * 0.02, h * 0.38, w * 0.02, h * 0.38);
    ctx.bezierCurveTo(w * 0.02, h * 0.58, w * 0.24, h * 0.77, w / 2, h * 0.94);
    ctx.bezierCurveTo(w * 0.76, h * 0.77, w * 0.98, h * 0.58, w * 0.98, h * 0.38);
    ctx.bezierCurveTo(w * 0.98, h * 0.38, w * 0.98, h * 0.06, w * 0.78, h * 0.06);
    ctx.bezierCurveTo(w * 0.62, h * 0.06, w / 2, h * 0.18, w / 2, h * 0.26);
    ctx.closePath();
    ctx.clip();

    // Gold Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#c59b27');
    grad.addColorStop(0.5, '#f6e7b2');
    grad.addColorStop(1, '#9b7012');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Scratch Prompt Text
    ctx.fillStyle = '#5a1807';
    ctx.font = 'bold 11px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH', w / 2, h * 0.43);
    ctx.font = '10px "Playfair Display", serif';
    ctx.fillText(label.toUpperCase(), w / 2, h * 0.56);

    ctx.restore();
  }, [label]);

  const scratch = (e) => {
    if (!isScratching) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex flex-col items-center justify-center select-none">
      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full drop-shadow-md">
        <path
          d="M60 31.2 C60 21.6, 45.6 7.2, 26.4 7.2 C2.4 7.2, 2.4 45.6, 2.4 45.6 C2.4 69.6, 28.8 92.4, 60 112.8 C91.2 92.4, 117.6 69.6, 117.6 45.6 C117.6 45.6, 117.6 7.2, 93.6 7.2 C74.4 7.2, 60 21.6, 60 31.2 Z"
          fill="#fffdf9"
          stroke="#d4af37"
          strokeWidth="3"
        />
      </svg>

      <div className="relative z-0 flex flex-col items-center justify-center -mt-2">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-800 font-semibold">{label}</span>
        <span className="text-xl sm:text-3xl font-bold text-[#5a1807] leading-tight">{value}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={128}
        height={128}
        className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
        onMouseDown={() => setIsScratching(true)}
        onMouseUp={() => setIsScratching(false)}
        onMouseLeave={() => setIsScratching(false)}
        onMouseMove={scratch}
        onTouchStart={(e) => {
          setIsScratching(true);
          scratch(e);
        }}
        onTouchEnd={() => setIsScratching(false)}
        onTouchMove={scratch}
      />
    </div>
  );
}

// 3. Main App Component
export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openCalendarId, setOpenCalendarId] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState('');
  const [countryCode, setCountryCode] = useState('India +91');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [attendingEvents, setAttendingEvents] = useState(['Sangeet', 'Haldi', 'Wedding']);
  const [teamSide, setTeamSide] = useState('');
  const [rsvpNote, setRsvpNote] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleEventPill = (eventName) => {
    setAttendingEvents((prev) =>
      prev.includes(eventName) ? prev.filter((item) => item !== eventName) : [...prev, eventName]
    );
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpPhone.trim()) return;
    setRsvpSubmitted(true);
    setTimeout(() => setRsvpSubmitted(false), 4000);
  };

  const downloadIcs = (ev) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Muskan Weds Devesh//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${ev.title} - Muskan & Devesh`,
      `DTSTART:${ev.icsStart}`,
      `DTEND:${ev.icsEnd}`,
      `LOCATION:${ev.venue}, ${ev.address}`,
      'DESCRIPTION:We look forward to celebrating with you!',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ev.title}-Muskan-Devesh.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const target = new Date('2026-12-02T18:00:00+05:30').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyHashtag = () => {
    navigator.clipboard.writeText('#MuskanWedsDevesh');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const events = [
    {
      id: 1,
      date: "1st Dec 2026",
      title: "Sangeet",
      time: "07:00 PM",
      venue: "Ps Club Royale",
      address: "Godadih - Raipur Road Near Mahadev Ghat, Bridge, Changurabhata, Raipur, Chhattisgarh",
      mapLink: "https://maps.app.goo.gl/7hMsBULV72HHqies8",
      icsStart: "20261201T190000Z",
      icsEnd: "20261201T210000Z",
      gcal: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet&dates=20261201T190000Z/20261201T210000Z&details=https://muskanwedsdevesh.inviteutsav.com/&location=Ps+Club+Royale,+Godadih+-+Raipur+Road+Near+Mahadev+Ghat,+Bridge,+Changurabhata,+Raipur,+Chhattisgarh",
      outlook: "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=Sangeet&startdt=2026-12-01T19:00:00+00:00&enddt=2026-12-01T21:00:00+00:00&location=Ps+Club+Royale,+Raipur",
      side: "left",
    },
    {
      id: 2,
      date: "2nd Dec 2026",
      title: "Haldi",
      time: "11:00 AM",
      venue: "Ps Club Royale",
      address: "Godadih - Raipur Road Near Mahadev Ghat, Bridge, Changurabhata, Raipur, Chhattisgarh",
      mapLink: "https://maps.app.goo.gl/7hMsBULV72HHqies8",
      icsStart: "20261202T110000Z",
      icsEnd: "20261202T130000Z",
      gcal: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi&dates=20261202T110000Z/20261202T130000Z&details=https://muskanwedsdevesh.inviteutsav.com/&location=Ps+Club+Royale,+Godadih+-+Raipur+Road+Near+Mahadev+Ghat,+Bridge,+Changurabhata,+Raipur,+Chhattisgarh",
      outlook: "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=Haldi&startdt=2026-12-02T11:00:00+00:00&enddt=2026-12-02T13:00:00+00:00&location=Ps+Club+Royale,+Raipur",
      side: "right",
    },
    {
      id: 3,
      date: "2nd Dec 2026",
      title: "Wedding",
      time: "06:00 PM",
      venue: "Ps Club Royale",
      address: "Godadih - Raipur Road Near Mahadev Ghat, Bridge, Changurabhata, Raipur, Chhattisgarh",
      mapLink: "https://maps.app.goo.gl/7hMsBULV72HHqies8",
      icsStart: "20261202T180000Z",
      icsEnd: "20261202T200000Z",
      gcal: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding&dates=20261202T180000Z/20261202T200000Z&details=https://muskanwedsdevesh.inviteutsav.com/&location=Ps+Club+Royale,+Godadih+-+Raipur+Road+Near+Mahadev+Ghat,+Bridge,+Changurabhata,+Raipur,+Chhattisgarh",
      outlook: "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=Wedding&startdt=2026-12-02T18:00:00+00:00&enddt=2026-12-02T20:00:00+00:00&location=Ps+Club+Royale,+Raipur",
      side: "left",
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden font-serif bg-[#fdf5ea] text-[#4a0d0d]">
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="https://inviteutsav.com/wp-content/themes/inviteutsav/assets/music/marriage/marriage-music-004.mp3"
      />

      {/* Floating Bottom-Right Sound Button */}
      <button
        onClick={toggleAudio}
        aria-label="Toggle wedding music"
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-[#6b2d14] hover:bg-[#52210e] text-white shadow-xl flex items-center justify-center gap-[3px] cursor-pointer transition-transform active:scale-95"
      >
        {[0, 0.2, 0.4, 0.15].map((delay, idx) => (
          <span
            key={idx}
            className="w-[2.5px] bg-white rounded-full transition-all"
            style={{
              height: isPlaying ? '16px' : idx % 2 === 0 ? '8px' : '13px',
              animation: isPlaying ? `soundBar 0.8s ease-in-out ${delay}s infinite` : 'none',
            }}
          />
        ))}
      </button>

      {/* SECTION 1: HERO */}
      <section
        aria-label="Wedding invitation opening"
        className="relative h-[100svh] min-h-[640px] w-full overflow-hidden flex flex-col items-center justify-center"
      >
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/hero-sky-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/hero-sky-mobile.webp`} draggable="false" className="w-full h-full object-cover" alt="" />
        </picture>
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/hero-sun-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/hero-sun-mobile.webp`} draggable="false" className="w-full h-full object-cover mix-blend-screen" alt="" />
        </picture>
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/hero-mountain-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/hero-mountain-mobile.webp`} draggable="false" className="w-full h-full object-cover object-bottom" alt="" />
        </picture>
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/hero-cloud-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/hero-cloud-mobile.webp`} draggable="false" className="w-full h-full object-cover object-bottom opacity-90" alt="" />
        </picture>
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/hero-temple-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/hero-temple-mobile.webp`} draggable="false" className="w-full h-full object-cover object-bottom" alt="" />
        </picture>
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/decorations/temple-flagpole-desktop.webp`} />
          <img src={`${BASE_URL}/decorations/temple-flagpole-mobile.webp`} draggable="false" className="w-full h-full object-contain object-bottom" alt="" />
        </picture>

        <picture className="absolute top-0 inset-x-0 z-10 w-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/decorations/bells-frame-desktop.webp`} />
          <img src={`${BASE_URL}/decorations/bells-frame-mobile.webp`} draggable="false" className="w-full object-cover" alt="" />
        </picture>

        {/* 6 Hanging Bells */}
        <img src={`${BASE_URL}/decorations/hanging-bell-a.webp`} draggable="false" className="absolute top-8 sm:top-12 left-[8%] w-6 sm:w-10 z-10 animate-swing pointer-events-none" alt="" />
        <img src={`${BASE_URL}/decorations/hanging-bell-b.webp`} draggable="false" className="absolute top-12 sm:top-16 left-[18%] w-4 sm:w-7 z-10 animate-swing-delayed pointer-events-none" alt="" />
        <img src={`${BASE_URL}/decorations/hanging-bell-b.webp`} draggable="false" className="absolute top-6 sm:top-10 left-[30%] w-4 sm:w-6 z-10 animate-swing pointer-events-none" alt="" />
        <img src={`${BASE_URL}/decorations/hanging-bell-b.webp`} draggable="false" className="absolute top-6 sm:top-10 right-[30%] w-4 sm:w-6 z-10 animate-swing-delayed pointer-events-none" alt="" />
        <img src={`${BASE_URL}/decorations/hanging-bell-b.webp`} draggable="false" className="absolute top-12 sm:top-16 right-[18%] w-4 sm:w-7 z-10 animate-swing pointer-events-none" alt="" />
        <img src={`${BASE_URL}/decorations/hanging-bell-a.webp`} draggable="false" className="absolute top-8 sm:top-12 right-[8%] w-6 sm:w-10 z-10 animate-swing-delayed pointer-events-none" alt="" />

        <ParticleCanvas />

        <h1 className="relative z-20 text-center flex flex-col items-center -mt-10 sm:-mt-16 select-none px-4">
          <span className="font-script text-6xl sm:text-8xl md:text-9xl text-[#4a0d0d] drop-shadow-sm leading-none">
            Muskan
          </span>
          <span className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#c59b27] my-1 sm:my-2">
            &amp;
          </span>
          <span className="font-script text-6xl sm:text-8xl md:text-9xl text-[#4a0d0d] drop-shadow-sm leading-none">
            Devesh
          </span>
        </h1>
      </section>

      {/* SECTION 2: INVITATION DETAILS */}
      <section
        aria-label="Invitation details"
        className="relative min-h-screen w-full py-20 sm:py-28 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
      >
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/garden-bridge-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/garden-bridge-mobile.webp`} draggable="false" className="w-full h-full object-cover" alt="" />
        </picture>

        <div className="relative z-10 w-full max-w-xl mx-auto bg-white/85 backdrop-blur-md p-6 sm:p-12 rounded-3xl border-2 border-[#d4af37]/40 shadow-2xl flex flex-col items-center">
          <picture className="mb-5">
            <source media="(min-width:1024px)" srcSet={`${BASE_URL}/decorations/ganpati-icon-desktop.webp`} />
            <img src={`${BASE_URL}/decorations/ganpati-icon-mobile.webp`} draggable="false" className="w-20 sm:w-28 mx-auto" alt="Ganpati" />
          </picture>

          <p lang="sa" className="font-sanskrit text-sm sm:text-lg md:text-xl text-[#801b1b] font-semibold leading-relaxed mb-6">
            वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
            निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
          </p>

          <div className="space-y-2 sm:space-y-3 text-[#4a0d0d]">
            <p className="text-lg sm:text-2xl font-bold">
              Smt. Arpana Dubey &amp; Shri D.S. Dubey
            </p>
            <p className="text-xs sm:text-base italic text-amber-900 max-w-md mx-auto py-1">
              With joy and the blessings of our elders, we invite you to the wedding of our dear daughter
            </p>
            <p className="font-script text-5xl sm:text-7xl text-[#801b1b] py-1">Muskan</p>
            <p className="font-serif italic text-xl sm:text-2xl text-[#c59b27]">and</p>
            <p className="font-script text-5xl sm:text-7xl text-[#801b1b] py-1">Devesh</p>
            <p className="text-xs sm:text-base italic text-amber-900 pt-1">Beloved son of</p>
            <p className="text-lg sm:text-2xl font-bold">
              Smt. Mintoo Devi Singh &amp; Shri Ram Awadh Singh
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: MEET THE COUPLE & SCRATCH HEARTS */}
      <section
        aria-label="Meet the couple"
        className="relative min-h-screen w-full py-20 sm:py-28 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
      >
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/couple-section-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/couple-section-mobile.webp`} draggable="false" className="w-full h-full object-cover" alt="" />
        </picture>

        <img
          src={`${BASE_URL}/decorations/mandala.webp`}
          draggable="false"
          className="absolute -left-24 sm:-left-32 top-8 w-56 sm:w-96 opacity-25 animate-spin-slow pointer-events-none"
          alt=""
        />
        <img
          src={`${BASE_URL}/decorations/mandala.webp`}
          draggable="false"
          className="absolute -right-24 sm:-right-32 bottom-8 w-56 sm:w-96 opacity-25 animate-spin-slow pointer-events-none"
          alt=""
        />

        <div className="relative z-10 w-full max-w-xl mx-auto bg-white/85 backdrop-blur-md p-6 sm:p-10 rounded-3xl border-2 border-[#d4af37]/50 shadow-xl mb-12">
          <p className="font-script text-4xl sm:text-6xl text-[#801b1b] mb-2">A Date To Remember</p>
          <p className="text-[11px] sm:text-xs uppercase tracking-widest text-amber-800 mb-4">
            Scratch each heart to reveal our wedding date
          </p>

          <div
            aria-label="Scratch each heart to reveal our wedding date"
            role="group"
            className="flex items-center justify-center gap-2 sm:gap-6 my-4"
          >
            <ScratchHeart label="Day" value="2" />
            <ScratchHeart label="Month" value="DEC" />
            <ScratchHeart label="Year" value="2026" />
          </div>

          <p className="text-xs sm:text-base text-[#4a0d0d] leading-relaxed mt-4">
            Mark your calendars — our forever begins on this joyous day, and we would be honoured to have you by our side.
          </p>
        </div>

        <div className="relative z-10 w-full max-w-xl mx-auto bg-white/85 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#d4af37]/40 shadow-lg">
          <h2 className="mb-3 leading-tight">
            <span className="text-lg sm:text-2xl italic block text-amber-900">Meet the</span>
            <span className="font-script text-4xl sm:text-6xl text-[#801b1b]">Bride &amp; Groom</span>
          </h2>
          <p className="text-xs sm:text-base text-[#4a0d0d] leading-relaxed">
            With our hearts full and smiles wide, come celebrate our love, share our joy, and help make this day a beautiful memory we will cherish forever!
          </p>
        </div>
      </section>

      {/* SECTION 4: WEDDING TIMELINE */}
      <section aria-label="Wedding timeline" className="relative w-full py-20 sm:py-28 px-4 overflow-hidden">
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/timeline-paper-mobile.webp`} />
          <img src={`${BASE_URL}/backgrounds/timeline-paper-mobile.webp`} draggable="false" className="w-full h-full object-cover opacity-95" alt="" />
        </picture>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="font-script text-5xl sm:text-7xl text-[#801b1b] mb-2">Our Celebrations</h2>
          <p className="text-sm sm:text-lg italic text-amber-900 mb-12 sm:mb-16">
            Save these dates, we would love to celebrate with you
          </p>

          <ol className="space-y-14 sm:space-y-16">
            {events.map((ev) => (
              <li key={ev.id} className="relative flex flex-col items-center">
                <img
                  src={`${BASE_URL}/decorations/pillar-ornament-${ev.side}.webp`}
                  draggable="false"
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-24 opacity-60 pointer-events-none ${
                    ev.side === 'left' ? '-left-12' : '-right-12'
                  }`}
                  alt=""
                />

                <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex flex-col items-center justify-center mb-5">
                  <img
                    src={`${BASE_URL}/events/event-card-frame.webp`}
                    draggable="false"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    alt=""
                  />
                  <div className="relative z-10 flex flex-col items-center text-center px-6">
                    <span className="text-[11px] sm:text-sm uppercase tracking-widest text-amber-900 font-semibold">
                      {ev.date}
                    </span>
                    <h3 className="font-script text-4xl sm:text-6xl text-[#801b1b] my-1.5">{ev.title}</h3>
                    <span className="text-xs sm:text-base font-bold text-[#4a0d0d]">{ev.time}</span>
                  </div>
                </div>

                <div className="w-full max-w-md bg-white/85 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-[#d4af37]/40 shadow-md flex flex-col items-center space-y-2">
                  <span className="text-lg sm:text-xl font-bold text-[#801b1b]">{ev.venue}</span>
                  <span className="text-xs sm:text-sm text-[#4a0d0d] leading-relaxed">{ev.address}</span>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
                    <a
                      href={ev.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#801b1b] text-white text-[11px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-[#5e1212] transition"
                    >
                      <MapPin size={14} />
                      <span>Get Directions</span>
                    </a>

                    <div className="relative">
                      <button
                        onClick={() => setOpenCalendarId(openCalendarId === ev.id ? null : ev.id)}
                        className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full border-2 border-[#801b1b] text-[#801b1b] text-[11px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-[#801b1b] hover:text-white transition cursor-pointer"
                      >
                        <Calendar size={14} />
                        <span>Add to Calendar</span>
                      </button>

                      {openCalendarId === ev.id && (
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#d4af37]/40 py-2 z-30 text-left text-xs font-semibold">
                          <a
                            href={ev.gcal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 hover:bg-amber-50 text-[#4a0d0d]"
                          >
                            Google Calendar
                          </a>
                          <a
                            href={ev.outlook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 hover:bg-amber-50 text-[#4a0d0d]"
                          >
                            Outlook Calendar
                          </a>
                          <button
                            onClick={() => downloadIcs(ev)}
                            className="w-full text-left block px-4 py-2 hover:bg-amber-50 text-[#4a0d0d] cursor-pointer"
                          >
                            Apple Calendar / iCal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <img
                  src={`${BASE_URL}/events/timeline-lotus-motif.webp`}
                  draggable="false"
                  className="w-14 sm:w-16 mt-8 sm:mt-10 opacity-80"
                  alt=""
                />
              </li>
            ))}
          </ol>

          <picture className="block mt-12 sm:mt-16">
            <source media="(min-width:1024px)" srcSet={`${BASE_URL}/decorations/lotus-ornament-desktop.webp`} />
            <img src={`${BASE_URL}/decorations/lotus-ornament-mobile.webp`} draggable="false" className="w-40 sm:w-64 mx-auto" alt="" />
          </picture>
        </div>
      </section>

      {/* SECTION 5: RSVP / ENQUIRY SECTION */}
      <section
        aria-label="RSVP and Wishes"
        className="relative w-full py-16 sm:py-24 px-4 bg-[#fdf1e2] overflow-hidden flex items-center justify-center"
      >
        {[
          'top-10 left-[8%]',
          'top-1/3 left-[18%]',
          'bottom-16 left-[12%]',
          'top-16 right-[12%]',
          'top-1/2 right-[8%]',
          'bottom-12 right-[18%]',
        ].map((pos, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`absolute ${pos} text-[#f3cfc6] text-xl sm:text-2xl select-none pointer-events-none animate-float-flower`}
            style={{ animationDelay: `${i * 0.7}s` }}
          >
            ✿
          </span>
        ))}

        <div className="relative z-10 w-full max-w-[540px] bg-white rounded-[28px] shadow-[0_12px_40px_rgba(107,45,20,0.08)] p-6 sm:p-10 text-left font-sans">
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#4a1515] text-center mb-6 font-serif">
            Kindly let us know you are coming
          </h2>

          <form onSubmit={handleRsvpSubmit} className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#4a1515] mb-1.5">
                Your Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                className="w-full h-11 sm:h-12 px-4 rounded-full border border-stone-300 focus:border-[#8b3103] focus:outline-none text-sm text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#4a1515] mb-1.5">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2.5">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="h-11 sm:h-12 px-3 sm:px-4 rounded-full border border-stone-300 bg-white text-xs sm:text-sm text-stone-700 focus:border-[#8b3103] focus:outline-none w-32 sm:w-36 shrink-0"
                >
                  <option value="India +91">India +91</option>
                  <option value="USA +1">USA +1</option>
                  <option value="UK +44">UK +44</option>
                  <option value="UAE +971">UAE +971</option>
                </select>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={rsvpPhone}
                  onChange={(e) => setRsvpPhone(e.target.value)}
                  className="w-full h-11 sm:h-12 px-4 rounded-full border border-stone-300 focus:border-[#8b3103] focus:outline-none text-sm text-stone-800 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#4a1515] mb-2">
                Which events will you be attending?
              </label>
              <div className="flex flex-wrap gap-2">
                {['Sangeet', 'Haldi', 'Wedding'].map((evName) => {
                  const active = attendingEvents.includes(evName);
                  return (
                    <button
                      type="button"
                      key={evName}
                      onClick={() => toggleEventPill(evName)}
                      className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border transition cursor-pointer ${
                        active
                          ? 'bg-[#8b3103] text-white border-[#8b3103] font-medium'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-[#8b3103]'
                      }`}
                    >
                      {evName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#4a1515] mb-2">
                Team Bride or Team Groom?
              </label>
              <div className="flex flex-wrap gap-2">
                {['Team Muskan', 'Team Devesh', 'Team Both!'].map((team) => {
                  const active = teamSide === team;
                  return (
                    <button
                      type="button"
                      key={team}
                      onClick={() => setTeamSide(team)}
                      className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border transition cursor-pointer ${
                        active
                          ? 'bg-[#8b3103] text-white border-[#8b3103] font-medium'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-[#8b3103]'
                      }`}
                    >
                      {team}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#4a1515] mb-1.5">
                A Little Note For Us
              </label>
              <textarea
                rows={3}
                placeholder="Share a wish, a memory, or just say hi!"
                value={rsvpNote}
                onChange={(e) => setRsvpNote(e.target.value)}
                className="w-full p-4 rounded-2xl border border-stone-300 focus:border-[#8b3103] focus:outline-none text-sm text-stone-800 placeholder:text-stone-400 resize-y"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#8b3103] hover:bg-[#6e2602] text-white font-semibold text-sm sm:text-base shadow-md transition cursor-pointer"
            >
              {rsvpSubmitted ? 'Thank You! Wishes Sent ❤' : 'Send Your Wishes'}
            </button>
          </form>

          <hr className="my-6 border-amber-900/15" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base font-bold text-[#4a1515]">Shri D. S. Dubey</p>
              <p className="text-xs text-stone-500">Bride&apos;s Father</p>
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href="tel:+919876543210"
                aria-label="Call Bride's Father"
                className="w-9 h-9 rounded-full bg-[#fcecd8] text-[#8b3103] flex items-center justify-center hover:bg-[#f5d9b8] transition"
              >
                <Phone size={16} />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Bride's Father"
                className="w-9 h-9 rounded-full bg-[#fcecd8] text-[#8b3103] flex items-center justify-center hover:bg-[#f5d9b8] transition"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: HASHTAG */}
      <section
        aria-label="Wedding hashtag"
        className="py-14 sm:py-16 px-4 bg-[#fdf6e9] border-y border-[#d4af37]/30 text-center flex flex-col items-center"
      >
        <h2 className="font-script text-4xl sm:text-5xl text-[#801b1b] mb-3">Our Hashtag</h2>
        <button
          onClick={copyHashtag}
          className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 rounded-2xl bg-white border-2 border-[#d4af37] shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <span className="text-lg sm:text-2xl font-bold tracking-wide text-[#4a0d0d]">
            #MuskanWedsDevesh
          </span>
          {copied ? (
            <Check size={18} className="text-green-700" />
          ) : (
            <Copy size={18} className="text-[#c59b27] group-hover:scale-110 transition-transform" />
          )}
        </button>
        <p className="text-[11px] sm:text-xs uppercase tracking-widest text-amber-900 mt-3">
          {copied ? 'Copied to clipboard!' : 'Tap to copy & use it in all your posts!'}
        </p>
      </section>

      {/* SECTION 7: VENUE & COUNTDOWN */}
      <section
        aria-label="Venue and countdown"
        className="relative min-h-screen w-full py-20 sm:py-24 px-4 flex flex-col items-center justify-between text-center overflow-hidden"
      >
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/location-section-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/location-section-mobile.webp`} draggable="false" className="w-full h-full object-cover opacity-50" alt="" />
        </picture>
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/countdown-scene-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/countdown-scene-mobile.webp`} draggable="false" className="w-full h-full object-cover object-bottom" alt="" />
        </picture>

        <div className="relative z-10 w-full max-w-lg mx-auto bg-white/85 backdrop-blur-md p-6 sm:p-10 rounded-3xl border-2 border-[#d4af37]/50 shadow-xl my-6">
          <h2 className="font-script text-4xl sm:text-5xl text-[#801b1b] mb-3">
            We look forward to welcoming you
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-[#4a0d0d]">Ps Club Royale</h3>
          <p className="text-xs uppercase tracking-widest text-amber-800 font-semibold my-1">
            Sangeet &amp; Haldi &amp; Wedding
          </p>
          <p className="text-xs sm:text-sm text-[#4a0d0d] my-3 leading-relaxed">
            Godadih - Raipur Road Near Mahadev Ghat, Bridge, Changurabhata, Raipur, Chhattisgarh
          </p>
          <a
            href="https://maps.app.goo.gl/7hMsBULV72HHqies8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-full bg-[#801b1b] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#5e1212] transition shadow-md"
          >
            <MapPin size={15} />
            <span>Get Directions</span>
          </a>
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto bg-white/85 backdrop-blur-md p-6 sm:p-12 rounded-3xl border-2 border-[#d4af37]/50 shadow-2xl my-6 flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img src={`${BASE_URL}/decorations/ornament-burst-mobile.webp`} draggable="false" className="w-20 sm:w-28 opacity-80" alt="" />
            <img src={`${BASE_URL}/decorations/ornament-burst-mobile.webp`} draggable="false" className="w-20 sm:w-28 opacity-80 scale-x-[-1]" alt="" />
          </div>

          <h2 className="font-script text-4xl sm:text-6xl text-[#801b1b] mb-2">
            Counting down to our big day
          </h2>
          <p className="text-xs sm:text-base text-[#4a0d0d] max-w-md mb-5">
            Our families are delighted that you will join us for one of the happiest days of our lives
          </p>
          <img src={`${BASE_URL}/decorations/divider-mobile.webp`} draggable="false" className="w-40 sm:w-48 mb-6" alt="" />

          <div role="timer" className="grid grid-cols-4 gap-2 sm:gap-5 w-full max-w-md">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Minutes' },
              { value: timeLeft.seconds, label: 'Seconds' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#fffdf9] border-2 border-[#d4af37] rounded-2xl p-2.5 sm:p-4 shadow-inner flex flex-col items-center"
              >
                <span className="text-xl sm:text-4xl font-bold text-[#801b1b]">{item.value}</span>
                <span className="text-[9px] sm:text-xs uppercase tracking-widest text-amber-900 mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <footer className="relative z-10 mt-10 bg-white/85 backdrop-blur-sm px-6 py-3 rounded-full border border-[#d4af37]/40 flex items-center gap-4 text-xs text-[#4a0d0d] shadow-sm">
          <p>
            <a href="https://inviteutsav.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Crafted with <span aria-hidden="true" className="text-red-600">❤</span> by InviteUtsav
            </a>
          </p>
          <div className="flex items-center gap-2 border-l border-amber-900/20 pl-3">
            <a
              aria-label="InviteUtsav on Instagram"
              href="https://www.instagram.com/inviteutsav/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#801b1b] hover:scale-110 transition"
            >
              <Instagram size={16} />
            </a>
            <a
              aria-label="Message InviteUtsav on WhatsApp"
              href="https://wa.me/918283003222?text=Hi%20InviteUtsav!%20I%20visited%20the%20wedding%20invitation%20of%20Muskan%20%26%20Devesh%20and%20really%20liked%20the%20design."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#801b1b] hover:scale-110 transition"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </footer>
      </section>
    </div>
  );
}