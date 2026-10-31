import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { MapPin, Calendar, Copy, Check, Phone, MessageCircle } from 'lucide-react';

const BASE_URL = "https://inviteutsav.com/wp-content/themes/inviteutsav/assets/templates/siyaram-raghukul/images";

// ============================================================================
// 1. 3D INTERACTIVE CARD WRAPPER (TILT + DEPTH POP EFFECT)
// ============================================================================
function Card3D({ children, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    x.set((clientX - rect.left) / rect.width - 0.5);
    y.set((clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      onTouchMove={handleMove}
      onTouchEnd={resetTilt}
      initial={{ opacity: 0, y: 35, scale: 0.95, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`perspective-1000 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// 2. FLOATING GOLDEN PETALS / SPARKLES CANVAS
// ============================================================================
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

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1.2,
      speedY: Math.random() * 0.5 + 0.25,
      speedX: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.65 + 0.25,
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
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 8;
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

// ============================================================================
// 3. HEART-SHAPED 3D SCRATCH-OFF COMPONENT
// ============================================================================
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

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#c59b27');
    grad.addColorStop(0.5, '#f6e7b2');
    grad.addColorStop(1, '#9b7012');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

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
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.06, rotateZ: 2 }}
      className="relative w-24 h-24 sm:w-30 sm:h-30 flex flex-col items-center justify-center select-none drop-shadow-[0_10px_15px_rgba(90,24,7,0.2)]"
    >
      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
        <path
          d="M60 31.2 C60 21.6, 45.6 7.2, 26.4 7.2 C2.4 7.2, 2.4 45.6, 2.4 45.6 C2.4 69.6, 28.8 92.4, 60 112.8 C91.2 92.4, 117.6 69.6, 117.6 45.6 C117.6 45.6, 117.6 7.2, 93.6 7.2 C74.4 7.2, 60 21.6, 60 31.2 Z"
          fill="#fffdf9"
          stroke="#d4af37"
          strokeWidth="3.5"
        />
      </svg>

      <div className="relative z-0 flex flex-col items-center justify-center -mt-2">
        <span className="text-[9px] sm:text-xs uppercase tracking-widest text-amber-800 font-semibold">{label}</span>
        <span className="text-lg sm:text-2xl font-bold text-[#5a1807] leading-tight">{value}</span>
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
    </motion.div>
  );
}

// ============================================================================
// 4. MAIN APPLICATION
// ============================================================================
export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openCalendarId, setOpenCalendarId] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  // RSVP State
  const [rsvpName, setRsvpName] = useState('');
  const [countryCode, setCountryCode] = useState('India +91');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [attendingEvents, setAttendingEvents] = useState(['Sangeet', 'Haldi', 'Wedding']);
  const [teamSide, setTeamSide] = useState('');
  const [rsvpNote, setRsvpNote] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const audioRef = useRef(null);
  const { scrollY } = useScroll();

  // Multi-layer 3D Parallax Scroll Transforms for Hero
  const sunY = useTransform(scrollY, [0, 700], [0, 180]);
  const mountainY = useTransform(scrollY, [0, 700], [0, 110]);
  const cloudY = useTransform(scrollY, [0, 700], [0, 75]);
  const templeScale = useTransform(scrollY, [0, 700], [1, 1.08]);
  const titleY = useTransform(scrollY, [0, 500], [0, 140]);

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
      gcal: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet&dates=20261201T190000Z/20261201T210000Z&details=https://muskanwedsdevesh.inviteutsav.com/&location=Ps+Club+Royale,+Raipur,+Chhattisgarh",
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
      gcal: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi&dates=20261202T110000Z/20261202T130000Z&details=https://muskanwedsdevesh.inviteutsav.com/&location=Ps+Club+Royale,+Raipur,+Chhattisgarh",
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
      gcal: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding&dates=20261202T180000Z/20261202T200000Z&details=https://muskanwedsdevesh.inviteutsav.com/&location=Ps+Club+Royale,+Raipur,+Chhattisgarh",
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

      {/* Floating Bottom-Right Equalizer Button */}
      <button
        onClick={toggleAudio}
        aria-label="Toggle wedding music"
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-[#6b2d14] hover:bg-[#52210e] text-white shadow-2xl flex items-center justify-center gap-[3px] cursor-pointer transition-transform active:scale-95"
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

      {/* ========================================================= */}
      {/* SECTION 1: 3D PARALLAX HERO OPENING                       */}
      {/* ========================================================= */}
      <section
        aria-label="Wedding invitation opening"
        className="relative h-[100svh] min-h-[620px] w-full overflow-hidden flex flex-col items-center justify-center perspective-1000"
      >
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/hero-sky-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/hero-sky-mobile.webp`} draggable="false" className="w-full h-full object-cover" alt="" />
        </picture>

        <motion.picture style={{ y: sunY }} className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/hero-sun-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/hero-sun-mobile.webp`} draggable="false" className="w-full h-full object-cover mix-blend-screen" alt="" />
        </motion.picture>

        <motion.picture style={{ y: mountainY }} className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/hero-mountain-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/hero-mountain-mobile.webp`} draggable="false" className="w-full h-full object-cover object-bottom" alt="" />
        </motion.picture>

        <motion.picture style={{ y: cloudY }} className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/hero-cloud-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/hero-cloud-mobile.webp`} draggable="false" className="w-full h-full object-cover object-bottom opacity-90" alt="" />
        </motion.picture>

        <motion.picture style={{ scale: templeScale }} className="absolute inset-0 w-full h-full pointer-events-none origin-bottom">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/hero-temple-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/hero-temple-mobile.webp`} draggable="false" className="w-full h-full object-cover object-bottom drop-shadow-2xl" alt="" />
        </motion.picture>

        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/decorations/temple-flagpole-desktop.webp`} />
          <img src={`${BASE_URL}/decorations/temple-flagpole-mobile.webp`} draggable="false" className="w-full h-full object-contain object-bottom" alt="" />
        </picture>

        <picture className="absolute top-0 inset-x-0 z-10 w-full pointer-events-none drop-shadow-xl">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/decorations/bells-frame-desktop.webp`} />
          <img src={`${BASE_URL}/decorations/bells-frame-mobile.webp`} draggable="false" className="w-full object-cover" alt="" />
        </picture>

        {/* 6 Swinging Temple Bells */}
        <img src={`${BASE_URL}/decorations/hanging-bell-a.webp`} draggable="false" className="absolute top-8 sm:top-12 left-[8%] w-6 sm:w-10 z-10 animate-swing pointer-events-none drop-shadow-md" alt="" />
        <img src={`${BASE_URL}/decorations/hanging-bell-b.webp`} draggable="false" className="absolute top-12 sm:top-16 left-[18%] w-4 sm:w-7 z-10 animate-swing-delayed pointer-events-none drop-shadow-md" alt="" />
        <img src={`${BASE_URL}/decorations/hanging-bell-b.webp`} draggable="false" className="absolute top-6 sm:top-10 left-[30%] w-4 sm:w-6 z-10 animate-swing pointer-events-none drop-shadow-md" alt="" />
        <img src={`${BASE_URL}/decorations/hanging-bell-b.webp`} draggable="false" className="absolute top-6 sm:top-10 right-[30%] w-4 sm:w-6 z-10 animate-swing-delayed pointer-events-none drop-shadow-md" alt="" />
        <img src={`${BASE_URL}/decorations/hanging-bell-b.webp`} draggable="false" className="absolute top-12 sm:top-16 right-[18%] w-4 sm:w-7 z-10 animate-swing pointer-events-none drop-shadow-md" alt="" />
        <img src={`${BASE_URL}/decorations/hanging-bell-a.webp`} draggable="false" className="absolute top-8 sm:top-12 right-[8%] w-6 sm:w-10 z-10 animate-swing-delayed pointer-events-none drop-shadow-md" alt="" />

        <ParticleCanvas />

        <motion.h1
          style={{ y: titleY }}
          initial={{ opacity: 0, scale: 0.85, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="relative z-20 text-center flex flex-col items-center -mt-10 sm:-mt-16 select-none px-4"
        >
          <span className="font-script text-6xl sm:text-8xl md:text-9xl text-[#4a0d0d] drop-shadow-[0_4px_12px_rgba(255,255,255,0.85)] leading-none">
            Muskan
          </span>
          <span className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#c59b27] my-1 sm:my-2 drop-shadow-sm">
            &amp;
          </span>
          <span className="font-script text-6xl sm:text-8xl md:text-9xl text-[#4a0d0d] drop-shadow-[0_4px_12px_rgba(255,255,255,0.85)] leading-none">
            Devesh
          </span>
        </motion.h1>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: 3D INVITATION DETAILS CARD                     */}
      {/* ========================================================= */}
      <section
        aria-label="Invitation details"
        className="relative w-full py-14 sm:py-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
      >
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/garden-bridge-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/garden-bridge-mobile.webp`} draggable="false" className="w-full h-full object-cover" alt="" />
        </picture>

        <Card3D className="relative z-10 w-full max-w-xl mx-auto">
          <div className="bg-white/88 backdrop-blur-md p-6 sm:p-10 rounded-3xl border-2 border-[#d4af37]/50 shadow-[0_20px_50px_rgba(74,13,13,0.18)] flex flex-col items-center preserve-3d">
            <picture className="mb-4 animate-float-3d">
              <source media="(min-width:1024px)" srcSet={`${BASE_URL}/decorations/ganpati-icon-desktop.webp`} />
              <img src={`${BASE_URL}/decorations/ganpati-icon-mobile.webp`} draggable="false" className="w-20 sm:w-26 mx-auto drop-shadow-lg" alt="Ganpati" />
            </picture>

            <p lang="sa" className="font-sanskrit text-sm sm:text-lg text-[#801b1b] font-semibold leading-relaxed mb-5">
              वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
              निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
            </p>

            <div className="space-y-1.5 sm:space-y-2.5 text-[#4a0d0d]">
              <p className="text-lg sm:text-2xl font-bold">
                Smt. Arpana Dubey &amp; Shri D.S. Dubey
              </p>
              <p className="text-xs sm:text-sm italic text-amber-900 max-w-md mx-auto py-1">
                With joy and the blessings of our elders, we invite you to the wedding of our dear daughter
              </p>
              <p className="font-script text-5xl sm:text-6xl text-[#801b1b] py-0.5 drop-shadow-sm">Muskan</p>
              <p className="font-serif italic text-xl text-[#c59b27]">and</p>
              <p className="font-script text-5xl sm:text-6xl text-[#801b1b] py-0.5 drop-shadow-sm">Devesh</p>
              <p className="text-xs sm:text-sm italic text-amber-900 pt-1">Beloved son of</p>
              <p className="text-lg sm:text-2xl font-bold">
                Smt. Mintoo Devi Singh &amp; Shri Ram Awadh Singh
              </p>
            </div>
          </div>
        </Card3D>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: MEET THE COUPLE & 3D SCRATCH HEARTS            */}
      {/* ========================================================= */}
      <section
        aria-label="Meet the couple"
        className="relative w-full py-14 sm:py-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
      >
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/couple-section-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/couple-section-mobile.webp`} draggable="false" className="w-full h-full object-cover" alt="" />
        </picture>

        <img
          src={`${BASE_URL}/decorations/mandala.webp`}
          draggable="false"
          className="absolute -left-24 sm:-left-32 top-6 w-56 sm:w-88 opacity-25 animate-spin-slow pointer-events-none"
          alt=""
        />
        <img
          src={`${BASE_URL}/decorations/mandala.webp`}
          draggable="false"
          className="absolute -right-24 sm:-right-32 bottom-6 w-56 sm:w-88 opacity-25 animate-spin-slow pointer-events-none"
          alt=""
        />

        <Card3D className="relative z-10 w-full max-w-xl mx-auto mb-8">
          <div className="bg-white/88 backdrop-blur-md p-6 sm:p-9 rounded-3xl border-2 border-[#d4af37]/50 shadow-[0_20px_50px_rgba(74,13,13,0.16)]">
            <p className="font-script text-4xl sm:text-5xl text-[#801b1b] mb-1">A Date To Remember</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-800 mb-4">
              Scratch each heart to reveal our wedding date
            </p>

            {/* Always on the same horizontal row on mobile & desktop */}
            <div
              aria-label="Scratch each heart to reveal our wedding date"
              role="group"
              className="flex flex-row items-center justify-center gap-2 sm:gap-6 my-3"
            >
              <ScratchHeart label="Day" value="2" />
              <ScratchHeart label="Month" value="DEC" />
              <ScratchHeart label="Year" value="2026" />
            </div>

            <p className="text-xs sm:text-sm text-[#4a0d0d] leading-relaxed mt-3">
              Mark your calendars — our forever begins on this joyous day, and we would be honoured to have you by our side.
            </p>
          </div>
        </Card3D>

        <Card3D className="relative z-10 w-full max-w-xl mx-auto">
          <div className="bg-white/88 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#d4af37]/50 shadow-xl">
            <h2 className="mb-2 leading-tight">
              <span className="text-base sm:text-xl italic block text-amber-900">Meet the</span>
              <span className="font-script text-4xl sm:text-6xl text-[#801b1b]">Bride &amp; Groom</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4a0d0d] leading-relaxed">
              With our hearts full and smiles wide, come celebrate our love, share our joy, and help make this day a beautiful memory we will cherish forever!
            </p>
          </div>
        </Card3D>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: COMPACT SIDE-BY-SIDE 3D WEDDING TIMELINE       */}
      {/* ========================================================= */}
      <section aria-label="Wedding timeline" className="relative w-full py-14 sm:py-20 px-3 sm:px-6 overflow-hidden">
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/timeline-paper-mobile.webp`} />
          <img src={`${BASE_URL}/backgrounds/timeline-paper-mobile.webp`} draggable="false" className="w-full h-full object-cover opacity-95" alt="" />
        </picture>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-script text-5xl sm:text-6xl text-[#801b1b] mb-1">Our Celebrations</h2>
            <p className="text-xs sm:text-base italic text-amber-900 mb-8 sm:mb-10">
              Save these dates, we would love to celebrate with you
            </p>
          </motion.div>

          {/* Compact Connected Timeline List */}
          <div className="relative">
            {/* Central Vertical Golden Timeline Spine */}
            <div className="hidden sm:block absolute left-1/2 top-6 bottom-6 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />

            <ol className="space-y-5 sm:space-y-6">
              {events.map((ev, index) => (
                <li key={ev.id} className="relative">
                  <img
                    src={`${BASE_URL}/decorations/pillar-ornament-${ev.side}.webp`}
                    draggable="false"
                    className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-20 opacity-65 pointer-events-none ${
                      ev.side === 'left' ? '-left-10' : '-right-10'
                    }`}
                    alt=""
                  />

                  <Card3D className="w-full">
                    {/* Same-Line Row Card on Mobile & Desktop */}
                    <div
                      className={`flex flex-row items-center justify-between gap-3 sm:gap-6 bg-white/90 backdrop-blur-md p-3.5 sm:p-5 rounded-3xl border-2 border-[#d4af37]/45 shadow-[0_12px_32px_rgba(74,13,13,0.12)] ${
                        index % 2 === 1 ? 'sm:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Left: 3D Ornate Event Frame Badge */}
                      <div className="relative w-32 h-32 sm:w-48 sm:h-48 shrink-0 flex flex-col items-center justify-center animate-float-3d">
                        <img
                          src={`${BASE_URL}/events/event-card-frame.webp`}
                          draggable="false"
                          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
                          alt=""
                        />
                        <div className="relative z-10 flex flex-col items-center text-center px-2">
                          <span className="text-[8px] sm:text-xs uppercase tracking-wider text-amber-900 font-bold">
                            {ev.date}
                          </span>
                          <h3 className="font-script text-2xl sm:text-4xl text-[#801b1b] my-0.5 leading-none">
                            {ev.title}
                          </h3>
                          <span className="text-[9px] sm:text-xs font-bold text-[#4a0d0d]">{ev.time}</span>
                        </div>
                      </div>

                      {/* Center Lotus Motif on Desktop */}
                      <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
                        <img
                          src={`${BASE_URL}/events/timeline-lotus-motif.webp`}
                          draggable="false"
                          className="w-10 opacity-90 drop-shadow"
                          alt=""
                        />
                      </div>

                      {/* Right: Venue Info & Same-Line Action Buttons */}
                      <div className="flex-1 flex flex-col items-start sm:items-center text-left sm:text-center space-y-1.5">
                        <span className="text-sm sm:text-xl font-bold text-[#801b1b] leading-snug">
                          {ev.venue}
                        </span>
                        <span className="text-[11px] sm:text-sm text-[#4a0d0d] leading-snug line-clamp-2 sm:line-clamp-none">
                          {ev.address}
                        </span>

                        {/* Action Buttons in the Same Row */}
                        <div className="flex flex-row flex-wrap items-center gap-1.5 sm:gap-2.5 pt-1.5">
                          <a
                            href={ev.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#801b1b] text-white text-[10px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-[#5e1212] transition shadow-sm"
                          >
                            <MapPin size={12} />
                            <span>Directions</span>
                          </a>

                          <div className="relative">
                            <button
                              onClick={() => setOpenCalendarId(openCalendarId === ev.id ? null : ev.id)}
                              className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#801b1b] text-[#801b1b] text-[10px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-[#801b1b] hover:text-white transition cursor-pointer"
                            >
                              <Calendar size={12} />
                              <span>Calendar</span>
                            </button>

                            {openCalendarId === ev.id && (
                              <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 mt-1.5 w-44 bg-white rounded-xl shadow-2xl border border-[#d4af37]/50 py-1.5 z-40 text-left text-xs font-semibold">
                                <a
                                  href={ev.gcal}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-3.5 py-1.5 hover:bg-amber-50 text-[#4a0d0d]"
                                >
                                  Google Calendar
                                </a>
                                <a
                                  href={ev.outlook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-3.5 py-1.5 hover:bg-amber-50 text-[#4a0d0d]"
                                >
                                  Outlook Calendar
                                </a>
                                <button
                                  onClick={() => downloadIcs(ev)}
                                  className="w-full text-left block px-3.5 py-1.5 hover:bg-amber-50 text-[#4a0d0d] cursor-pointer"
                                >
                                  Apple Calendar / iCal
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </li>
              ))}
            </ol>
          </div>

          <picture className="block mt-8 sm:mt-10">
            <source media="(min-width:1024px)" srcSet={`${BASE_URL}/decorations/lotus-ornament-desktop.webp`} />
            <img src={`${BASE_URL}/decorations/lotus-ornament-mobile.webp`} draggable="false" className="w-36 sm:w-52 mx-auto" alt="" />
          </picture>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: RSVP / ENQUIRY SECTION (WITH 3D CARD EFFECT)   */}
      {/* ========================================================= */}
      <section
        aria-label="RSVP and Wishes"
        className="relative w-full py-14 sm:py-20 px-4 bg-[#fdf1e2] overflow-hidden flex items-center justify-center"
      >
        {[
          'top-8 left-[8%]',
          'top-1/3 left-[15%]',
          'bottom-12 left-[10%]',
          'top-12 right-[10%]',
          'top-1/2 right-[8%]',
          'bottom-10 right-[15%]',
        ].map((pos, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`absolute ${pos} text-[#f3cfc6] text-xl sm:text-2xl select-none pointer-events-none animate-float-3d`}
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            ✿
          </span>
        ))}

        <Card3D className="relative z-10 w-full max-w-[540px]">
          <div className="bg-white rounded-[28px] shadow-[0_18px_50px_rgba(107,45,20,0.12)] p-6 sm:p-9 text-left font-sans border border-[#f3cfc6]/40">
            <h2 className="text-xl sm:text-[26px] font-bold text-[#4a1515] text-center mb-5 font-serif">
              Kindly let us know you are coming
            </h2>

            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#4a1515] mb-1">
                  Your Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-stone-300 focus:border-[#8b3103] focus:outline-none text-sm text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#4a1515] mb-1">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <div className="flex flex-row gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-11 px-3 rounded-full border border-stone-300 bg-white text-xs sm:text-sm text-stone-700 focus:border-[#8b3103] focus:outline-none w-28 sm:w-34 shrink-0"
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
                    className="w-full h-11 px-4 rounded-full border border-stone-300 focus:border-[#8b3103] focus:outline-none text-sm text-stone-800 placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#4a1515] mb-1.5">
                  Which events will you be attending?
                </label>
                <div className="flex flex-row flex-wrap gap-2">
                  {['Sangeet', 'Haldi', 'Wedding'].map((evName) => {
                    const active = attendingEvents.includes(evName);
                    return (
                      <button
                        type="button"
                        key={evName}
                        onClick={() => toggleEventPill(evName)}
                        className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border transition cursor-pointer ${
                          active
                            ? 'bg-[#8b3103] text-white border-[#8b3103] font-medium shadow-sm'
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
                <label className="block text-xs sm:text-sm font-semibold text-[#4a1515] mb-1.5">
                  Team Bride or Team Groom?
                </label>
                <div className="flex flex-row flex-wrap gap-2">
                  {['Team Muskan', 'Team Devesh', 'Team Both!'].map((team) => {
                    const active = teamSide === team;
                    return (
                      <button
                        type="button"
                        key={team}
                        onClick={() => setTeamSide(team)}
                        className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border transition cursor-pointer ${
                          active
                            ? 'bg-[#8b3103] text-white border-[#8b3103] font-medium shadow-sm'
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
                <label className="block text-xs sm:text-sm font-semibold text-[#4a1515] mb-1">
                  A Little Note For Us
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a wish, a memory, or just say hi!"
                  value={rsvpNote}
                  onChange={(e) => setRsvpNote(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-stone-300 focus:border-[#8b3103] focus:outline-none text-sm text-stone-800 placeholder:text-stone-400 resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#8b3103] hover:bg-[#6e2602] text-white font-semibold text-sm sm:text-base shadow-md transition cursor-pointer"
              >
                {rsvpSubmitted ? 'Thank You! Wishes Sent ❤' : 'Send Your Wishes'}
              </button>
            </form>

            <hr className="my-5 border-amber-900/15" />
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
        </Card3D>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: WEDDING HASHTAG                                */}
      {/* ========================================================= */}
      <section
        aria-label="Wedding hashtag"
        className="py-10 sm:py-12 px-4 bg-[#fdf6e9] border-y border-[#d4af37]/30 text-center flex flex-col items-center"
      >
        <h2 className="font-script text-4xl sm:text-5xl text-[#801b1b] mb-2">Our Hashtag</h2>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={copyHashtag}
          className="group inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-[#d4af37] shadow-md cursor-pointer"
        >
          <span className="text-lg sm:text-2xl font-bold tracking-wide text-[#4a0d0d]">
            #MuskanWedsDevesh
          </span>
          {copied ? (
            <Check size={18} className="text-green-700" />
          ) : (
            <Copy size={18} className="text-[#c59b27]" />
          )}
        </motion.button>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-900 mt-2">
          {copied ? 'Copied to clipboard!' : 'Tap to copy & use it in all your posts!'}
        </p>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: VENUE, COUNTDOWN & FOOTER                      */}
      {/* ========================================================= */}
      <section
        aria-label="Venue and countdown"
        className="relative w-full py-14 sm:py-20 px-4 flex flex-col items-center justify-between text-center overflow-hidden"
      >
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/location-section-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/location-section-mobile.webp`} draggable="false" className="w-full h-full object-cover opacity-50" alt="" />
        </picture>
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/countdown-scene-desktop.webp`} />
          <img src={`${BASE_URL}/backgrounds/countdown-scene-mobile.webp`} draggable="false" className="w-full h-full object-cover object-bottom" alt="" />
        </picture>

        <Card3D className="relative z-10 w-full max-w-lg mx-auto my-4">
          <div className="bg-white/88 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-[#d4af37]/50 shadow-xl">
            <h2 className="font-script text-4xl sm:text-5xl text-[#801b1b] mb-2">
              We look forward to welcoming you
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-[#4a0d0d]">Ps Club Royale</h3>
            <p className="text-xs uppercase tracking-widest text-amber-800 font-semibold my-1">
              Sangeet &amp; Haldi &amp; Wedding
            </p>
            <p className="text-xs sm:text-sm text-[#4a0d0d] my-2 leading-relaxed">
              Godadih - Raipur Road Near Mahadev Ghat, Bridge, Changurabhata, Raipur, Chhattisgarh
            </p>
            <a
              href="https://maps.app.goo.gl/7hMsBULV72HHqies8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 rounded-full bg-[#801b1b] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#5e1212] transition shadow-md"
            >
              <MapPin size={14} />
              <span>Get Directions</span>
            </a>
          </div>
        </Card3D>

        <Card3D className="relative z-10 w-full max-w-2xl mx-auto my-4">
          <div className="bg-white/88 backdrop-blur-md p-6 sm:p-10 rounded-3xl border-2 border-[#d4af37]/50 shadow-2xl flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img src={`${BASE_URL}/decorations/ornament-burst-mobile.webp`} draggable="false" className="w-16 sm:w-24 opacity-80" alt="" />
              <img src={`${BASE_URL}/decorations/ornament-burst-mobile.webp`} draggable="false" className="w-16 sm:w-24 opacity-80 scale-x-[-1]" alt="" />
            </div>

            <h2 className="font-script text-4xl sm:text-5xl text-[#801b1b] mb-1">
              Counting down to our big day
            </h2>
            <p className="text-xs sm:text-sm text-[#4a0d0d] max-w-md mb-4">
              Our families are delighted that you will join us for one of the happiest days of our lives
            </p>
            <img src={`${BASE_URL}/decorations/divider-mobile.webp`} draggable="false" className="w-36 sm:w-44 mb-5" alt="" />

            <div role="timer" className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-md">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#fffdf9] border-2 border-[#d4af37] rounded-2xl p-2 sm:p-3.5 shadow-inner flex flex-col items-center"
                >
                  <span className="text-xl sm:text-3xl font-bold text-[#801b1b]">{item.value}</span>
                  <span className="text-[9px] sm:text-xs uppercase tracking-widest text-amber-900 mt-0.5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card3D>

        <footer className="relative z-10 mt-8 bg-white/85 backdrop-blur-sm px-6 py-3 rounded-full border border-[#d4af37]/40 flex items-center gap-4 text-xs text-[#4a0d0d] shadow-sm">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
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