import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { MapPin, Calendar, Copy, Check, Phone, MessageCircle, Bell } from 'lucide-react';

const BASE_URL = "https://inviteutsav.com/wp-content/themes/inviteutsav/assets/templates/siyaram-raghukul/images";

// ============================================================================
// 1. 3D INTERACTIVE CARD WRAPPER
// ============================================================================
function Card3D({ children, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });

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
      initial={{ opacity: 0, y: 30, scale: 0.96, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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

    const particles = Array.from({ length: 34 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3.2 + 1.2,
      speedY: Math.random() * 0.55 + 0.25,
      speedX: (Math.random() - 0.5) * 0.45,
      alpha: Math.random() * 0.65 + 0.3,
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
        ctx.fillStyle = '#ffdf73';
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 10;
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
// 3. FEATURE 2: GOLD CONFETTI & MARIGOLD PETAL BURST ON DATE SCRATCH
// ============================================================================
function ConfettiBurst({ active }) {
  if (!active) return null;
  const particles = Array.from({ length: 45 });
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 180 + 50;
        const color = ['#d4af37', '#ff6b6b', '#ffdf73', '#e65c00', '#fff'][i % 5];
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance - 40,
              scale: [0, 1.2, 0.8],
              opacity: [1, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ backgroundColor: color }}
            className="absolute w-3 h-3 rounded-full"
          />
        );
      })}
    </div>
  );
}

// ============================================================================
// 4. LARGER, EASY-TO-SCRATCH 3D HEART COMPONENT
// ============================================================================
function ScratchHeart({ label, value, onReveal }) {
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const scratchCountRef = useRef(0);

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
    grad.addColorStop(0.5, '#fff1be');
    grad.addColorStop(1, '#9b7012');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#5a1807';
    ctx.font = 'bold 13px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH', w / 2, h * 0.42);
    ctx.font = 'bold 11px "Playfair Display", serif';
    ctx.fillText(label.toUpperCase(), w / 2, h * 0.56);

    ctx.restore();
  }, [label]);

  const triggerReveal = () => {
    if (!isRevealed) {
      setIsRevealed(true);
      if (onReveal) onReveal();
    }
  };

  const scratch = (e) => {
    if (!isScratching || isRevealed) return;
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
    ctx.arc(x, y, 38, 0, Math.PI * 2);
    ctx.fill();

    scratchCountRef.current += 1;
    if (scratchCountRef.current > 10) {
      triggerReveal();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex flex-col items-center justify-center select-none drop-shadow-[0_12px_20px_rgba(90,24,7,0.22)]"
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
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-800 font-bold">{label}</span>
        <span className="text-2xl sm:text-4xl font-bold text-[#5a1807] leading-tight mt-0.5">{value}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={160}
        height={160}
        onClick={triggerReveal}
        className={`absolute inset-0 w-full h-full cursor-pointer z-10 touch-none transition-opacity duration-500 ${
          isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
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
// 5. MAIN APPLICATION
// ============================================================================
export default function App() {
  // Feature 1: Royal Curtain Gate State (defaults to false so guest sees gate first)
  const [isOpen, setIsOpen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openCalendarId, setOpenCalendarId] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [showConfetti, setShowConfetti] = useState(false);

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

  // Gentle scroll depth for the composed portrait hero artwork.
  const heroImageY = useTransform(scrollY, [0, 900], [0, 38]);
  const heroImageScale = useTransform(scrollY, [0, 900], [1.015, 1.075]);
  const titleY = useTransform(scrollY, [0, 500], [0, 55]);

  // Feature 1: Handle Opening the Invitation Gate & Auto-playing Audio
  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => console.log("Audio autoplay prevented:", e));
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Feature 3: Interactive Temple Bell Chime Audio Synthesizer on Tap
  const playBellChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High A note bell chime
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 1.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.log("AudioContext not supported");
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
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
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden font-serif bg-[#fdf5ea] text-[#4a0d0d] relative">
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="https://inviteutsav.com/wp-content/themes/inviteutsav/assets/music/marriage/marriage-music-004.mp3"
      />

      {/* ========================================================= */}
      {/* FEATURE 1: 3D ROYAL CURTAIN GATE / ENVELOPE OPENING       */}
      {/* ========================================================= */}
      <AnimatePresence>
        {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-transparent flex flex-col items-center justify-center p-6 text-center overflow-hidden"
        >
          {/* Ornate Royal Background Frame */}
          <div className="absolute inset-4 sm:inset-8 border-2 border-[#d4af37]/60 rounded-3xl pointer-events-none flex items-center justify-center">
            <div className="absolute inset-2 border border-[#d4af37]/30 rounded-2xl" />
          </div>

          {/* Split velvet curtains reveal the invitation underneath. */}
          <motion.div
            aria-hidden="true"
            initial={{ x: 0 }}
            exit={{ x: "-102%" }}
            transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-y-0 left-0 z-0 w-1/2 border-r border-[#d4af37]/50 bg-[linear-gradient(90deg,#2b0505_0%,#641414_78%,#4a0d0d_100%)] shadow-[12px_0_35px_rgba(20,0,0,0.28)]"
          />
          <motion.div
            aria-hidden="true"
            initial={{ x: 0 }}
            exit={{ x: "102%" }}
            transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-y-0 right-0 z-0 w-1/2 border-l border-[#d4af37]/50 bg-[linear-gradient(270deg,#2b0505_0%,#641414_78%,#4a0d0d_100%)] shadow-[-12px_0_35px_rgba(20,0,0,0.28)]"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative z-10 flex flex-col items-center max-w-md mx-auto"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-semibold mb-3">
              You Are Cordially Invited To The Wedding Of
            </span>

            <h2 className="font-script text-6xl sm:text-7xl md:text-8xl text-[#fffdf9] drop-shadow-md my-2">
              Muskan
            </h2>
            <span className="font-serif italic text-3xl text-[#d4af37] my-1">&amp;</span>
            <h2 className="font-script text-6xl sm:text-7xl md:text-8xl text-[#fffdf9] drop-shadow-md my-2">
              Devesh
            </h2>

            <p className="text-xs sm:text-sm text-amber-100/80 italic font-serif mt-4 mb-8">
              Tap below to enter our wedding celebration &amp; turn on auspicious music
            </p>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenInvitation}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] text-[#4a0d0d] font-bold text-sm sm:text-base uppercase tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.4)] cursor-pointer"
            >
              Open Invitation ✨
            </motion.button>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom-Right Equalizer Button */}
      <button
        onClick={toggleAudio}
        aria-label="Toggle wedding music"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-[#6b2d14] hover:bg-[#52210e] text-white shadow-2xl flex items-center justify-center gap-[3px] cursor-pointer transition-transform active:scale-95"
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
      {/* SECTION 1: CINEMATIC TEMPLE GARDEN HERO                    */}
      {/* ========================================================= */}
      <section
        aria-label="Wedding invitation opening"
        className="relative isolate h-[100svh] min-h-[680px] max-h-[1040px] w-full overflow-hidden flex items-start justify-center bg-[#f6e5ca]"
      >
        {/* Soft, blurred artwork fills wide desktop screens while the full portrait scene stays visible in the centre. */}
        <img
          src="/wedding-art/hero-temple.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-35"
        />
        <motion.img
          src="/wedding-art/hero-temple.webp"
          alt="A bride and groom walking towards an ornate temple through a flower-filled garden"
          fetchPriority="high"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 1.08 }}
          style={{ y: heroImageY, scale: heroImageScale }}
          transition={{ duration: 1.8, delay: 0.25, ease: "easeOut" }}
          className="absolute inset-0 z-[1] h-full w-full object-cover object-center md:left-1/2 md:right-auto md:w-auto md:max-w-[96vw] md:-translate-x-1/2 md:object-contain"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-[2] h-[42%] bg-gradient-to-b from-[#fff4df]/35 via-[#fff4df]/10 to-transparent pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 24 }}
          transition={{ duration: 1.1, delay: 0.85, ease: "easeOut" }}
          style={{ y: titleY }}
          className="absolute top-[12%] sm:top-[13%] z-20 w-full px-4 text-center select-none pointer-events-none"
        >
          <p className="mb-2 text-[9px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-[#8b4b22] drop-shadow-sm">
            Together with their families
          </p>
          <h1 className="flex flex-col items-center font-script text-[#6d171d] drop-shadow-[0_2px_10px_rgba(255,247,230,0.85)] leading-[0.88]">
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">Muskan</span>
            <span className="my-1 font-serif text-2xl sm:text-3xl md:text-4xl text-[#b88428]">&amp;</span>
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">Devesh</span>
          </h1>
          <p className="mt-3 text-[9px] sm:text-xs uppercase tracking-[0.24em] text-[#87542d] font-semibold">
            01 — 02 December 2026
          </p>
        </motion.div>

        <button
          type="button"
          onClick={playBellChime}
          aria-label="Ring a temple bell"
          title="Ring a temple bell"
          className="absolute right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full border border-[#d7ae62]/70 bg-[#fff8e8]/80 text-[#8b4b22] shadow-lg backdrop-blur-sm transition hover:scale-105"
        >
          <Bell size={18} />
        </button>

        <ParticleCanvas />

        <motion.div
          animate={{ y: [0, 7, 0], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-5 z-30 rounded-full border border-[#b9853d]/50 bg-[#fff7e8]/70 px-4 py-2 text-[9px] uppercase tracking-[0.22em] text-[#7d452a] backdrop-blur-sm"
        >
          Scroll to explore
        </motion.div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: 3D INVITATION DETAILS CARD                     */}
      {/* ========================================================= */}
      <section
        aria-label="Invitation details"
        className="relative w-full py-14 sm:py-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none bg-[#f8e8d0]">
          <img
            src="/wedding-art/invitation-garden.webp"
            draggable="false"
            className="h-full w-full object-cover object-center"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fff8ec]/10 via-transparent to-[#f8e8d0]/20" />
        </div>

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
      {/* SECTION 3: MEET THE COUPLE & CONFETTI SCRATCH HEARTS      */}
      {/* ========================================================= */}
      <section
        aria-label="Meet the couple"
        className="relative w-full py-14 sm:py-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#fff8e9_0%,#f8e9d2_55%,#f4e0c2_100%)]" />

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

        <Card3D className="relative z-10 w-full max-w-2xl mx-auto mb-8">
          <div className="bg-white/88 backdrop-blur-md p-6 sm:p-10 rounded-3xl border-2 border-[#d4af37]/50 shadow-[0_20px_50px_rgba(74,13,13,0.16)] relative">
            <ConfettiBurst active={showConfetti} />
            <p className="font-script text-4xl sm:text-6xl text-[#801b1b] mb-1">A Date To Remember</p>
            <p className="text-[11px] sm:text-xs uppercase tracking-widest text-amber-800 mb-5">
              Scratch or tap each heart to reveal our wedding date
            </p>

            <div
              aria-label="Scratch each heart to reveal our wedding date"
              role="group"
              className="flex flex-row items-center justify-center gap-3 sm:gap-8 my-4"
            >
              <ScratchHeart label="Day" value="2" onReveal={triggerConfetti} />
              <ScratchHeart label="Month" value="DEC" onReveal={triggerConfetti} />
              <ScratchHeart label="Year" value="2026" onReveal={triggerConfetti} />
            </div>

            <p className="text-xs sm:text-base text-[#4a0d0d] leading-relaxed mt-4">
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

        <motion.div
          initial={{ opacity: 0, y: 42, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 1.05, ease: "easeOut" }}
          className="relative z-10 mt-5 w-full max-w-4xl overflow-hidden rounded-[28px] shadow-[0_22px_55px_rgba(88,34,18,0.18)]"
        >
          <img
            src="/wedding-art/mandap-stage.webp"
            alt="A flower-covered wedding mandap with red velvet drapes and a ceremonial sofa"
            loading="lazy"
            className="block h-auto w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#5b2018]/15 to-transparent pointer-events-none" />
        </motion.div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: ALL 3 CELEBRATIONS IN A SINGLE HORIZONTAL ROW  */}
      {/* ========================================================= */}
      <section aria-label="Wedding timeline" className="relative w-full py-14 sm:py-20 px-2 sm:px-6 overflow-hidden">
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(min-width:1024px)" srcSet={`${BASE_URL}/backgrounds/timeline-paper-mobile.webp`} />
          <img src={`${BASE_URL}/backgrounds/timeline-paper-mobile.webp`} draggable="false" className="w-full h-full object-cover opacity-95" alt="" />
        </picture>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-script text-5xl sm:text-6xl text-[#801b1b] mb-1">Our Celebrations</h2>
            <p className="text-xs sm:text-base italic text-amber-900 mb-8 sm:mb-12">
              Save these dates, we would love to celebrate with you
            </p>
          </motion.div>

          <ol className="grid grid-cols-3 gap-2 sm:gap-5 md:gap-7 items-stretch">
            {events.map((ev) => (
              <li key={ev.id} className="flex">
                <Card3D className="w-full flex">
                  <div className="w-full bg-white/90 backdrop-blur-md p-2.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#d4af37]/50 shadow-[0_14px_34px_rgba(74,13,13,0.14)] flex flex-col items-center justify-between text-center">
                    <div className="relative w-24 h-24 sm:w-44 sm:h-44 md:w-52 md:h-52 flex flex-col items-center justify-center mb-2 sm:mb-4 animate-float-3d">
                      <img
                        src={`${BASE_URL}/events/event-card-frame.webp`}
                        draggable="false"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
                        alt=""
                      />
                      <div className="relative z-10 flex flex-col items-center text-center px-1 sm:px-4">
                        <span className="text-[7px] sm:text-[11px] uppercase tracking-wider text-amber-900 font-bold">
                          {ev.date}
                        </span>
                        <h3 className="font-script text-xl sm:text-4xl md:text-5xl text-[#801b1b] my-0.5 leading-none">
                          {ev.title}
                        </h3>
                        <span className="text-[8px] sm:text-xs font-bold text-[#4a0d0d]">{ev.time}</span>
                      </div>
                    </div>

                    <img
                      src={`${BASE_URL}/events/timeline-lotus-motif.webp`}
                      draggable="false"
                      className="w-6 sm:w-10 my-1 sm:my-2 opacity-85"
                      alt=""
                    />

                    <div className="flex flex-col items-center space-y-1 my-1">
                      <span className="text-xs sm:text-lg md:text-xl font-bold text-[#801b1b] leading-tight">
                        {ev.venue}
                      </span>
                      <span className="text-[9px] sm:text-xs text-[#4a0d0d] leading-snug line-clamp-3 sm:line-clamp-none">
                        {ev.address}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2 sm:pt-4 w-full">
                      <a
                        href={ev.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#801b1b] text-white text-[9px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-[#5e1212] transition shadow-sm"
                      >
                        <MapPin size={11} />
                        <span>Directions</span>
                      </a>

                      <div className="relative w-full sm:w-auto">
                        <button
                          onClick={() => setOpenCalendarId(openCalendarId === ev.id ? null : ev.id)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#801b1b] text-[#801b1b] text-[9px] sm:text-xs uppercase tracking-wider font-semibold hover:bg-[#801b1b] hover:text-white transition cursor-pointer"
                        >
                          <Calendar size={11} />
                          <span>Calendar</span>
                        </button>

                        {openCalendarId === ev.id && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-36 sm:w-44 bg-white rounded-xl shadow-2xl border border-[#d4af37]/50 py-1.5 z-40 text-left text-[10px] sm:text-xs font-semibold">
                            <a
                              href={ev.gcal}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-3 py-1.5 hover:bg-amber-50 text-[#4a0d0d]"
                            >
                              Google Calendar
                            </a>
                            <a
                              href={ev.outlook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-3 py-1.5 hover:bg-amber-50 text-[#4a0d0d]"
                            >
                              Outlook Calendar
                            </a>
                            <button
                              onClick={() => downloadIcs(ev)}
                              className="w-full text-left block px-3 py-1.5 hover:bg-amber-50 text-[#4a0d0d] cursor-pointer"
                            >
                              Apple / iCal
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card3D>
              </li>
            ))}
          </ol>

          <picture className="block mt-8 sm:mt-12">
            <source media="(min-width:1024px)" srcSet={`${BASE_URL}/decorations/lotus-ornament-desktop.webp`} />
            <img src={`${BASE_URL}/decorations/lotus-ornament-mobile.webp`} draggable="false" className="w-36 sm:w-52 mx-auto" alt="" />
          </picture>
        </div>
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
      {/* SECTION 5: RSVP / ENQUIRY SECTION                         */}
      {/* ========================================================= */}
      <section
        aria-label="Venue and RSVP"
        className="relative w-full py-14 sm:py-20 px-4 bg-[#fdf1e2] overflow-hidden flex flex-col items-center justify-center gap-3 sm:gap-5"
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
      {/* SECTION 7: COUNTDOWN & FOOTER                             */}
      {/* ========================================================= */}
      <section
        aria-label="Wedding countdown"
        className="relative w-full py-14 sm:py-20 px-4 flex flex-col items-center justify-between text-center overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none bg-[#f8e9d2]">
          <img
            src="/wedding-art/elephant-countdown.webp"
            draggable="false"
            className="absolute inset-x-0 bottom-0 h-[58%] w-full object-cover object-center sm:h-[64%]"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fff7e8] via-[#fff7e8]/65 to-transparent" />
        </div>

        {/* Feature 4: 3D Flip Countdown Cards */}
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

            <div role="timer" className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-md perspective-1000">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  animate={{ rotateX: [0, 15, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: item.label === 'Seconds' ? 0.2 : 5 }}
                  className="bg-[#fffdf9] border-2 border-[#d4af37] rounded-2xl p-2 sm:p-3.5 shadow-inner flex flex-col items-center preserve-3d"
                >
                  <span className="text-xl sm:text-3xl font-bold text-[#801b1b]">{item.value}</span>
                  <span className="text-[9px] sm:text-xs uppercase tracking-widest text-amber-900 mt-0.5">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card3D>

        {/* Footer */}
        <footer className="relative z-10 mt-8 bg-white/85 backdrop-blur-sm px-6 py-3 rounded-full border border-[#d4af37]/40 flex items-center gap-4 text-xs text-[#4a0d0d] shadow-sm">
          <p>
            <a href="https://axiomforgeco.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Crafted with <span aria-hidden="true" className="text-red-600">❤</span> by Saurabh(axiomforgeco)
            </a>
          </p>
          <div className="flex items-center gap-2 border-l border-amber-900/20 pl-3">
            <a
              aria-label="Saurabh on Instagram"
              href="https://www.instagram.com/m.saurabh__/"
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
          </div>
        </footer>
      </section>
    </div>
  );
}