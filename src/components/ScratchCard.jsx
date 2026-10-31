import { useRef, useEffect, useState } from 'react';

export default function ScratchCard() {
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // कैनवास को सुनहरे रंग (Gold color) से भरें
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // कैनवास के ऊपर टेक्स्ट लिखें
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch to Reveal', canvas.width / 2, canvas.height / 2);
  }, []);

  const scratch = (e) => {
    if (!isScratching) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    // माउस और टच दोनों के लिए कोऑर्डिनेट्स प्राप्त करें
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 'destination-out' का उपयोग करके ऊपर की लेयर को मिटाएं
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2); // 20px ब्रश का आकार
    ctx.fill();
  };

  return (
    <section className="py-24 bg-[#fffdf9] flex flex-col items-center justify-center text-center px-4 relative z-20">
      <h2 className="text-5xl md:text-6xl text-[#4a0d0d] font-script mb-6">A Date To Remember</h2>
      <p className="text-slate-700 mb-10 max-w-lg font-serif leading-relaxed">
        Mark your calendars — our forever begins on this joyous day, and we would be honoured to have you by our side.
      </p>

      {/* स्क्रैच कार्ड कंटेनर */}
      <div className="relative w-80 h-36 rounded-xl overflow-hidden shadow-xl border-4 border-[#d4af37]/30">
        {/* नीचे छिपी हुई तारीख */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="flex space-x-6 text-[#4a0d0d] font-serif">
            <div className="flex flex-col items-center"><span className="text-sm uppercase tracking-widest text-slate-500 mb-1">Day</span><span className="text-4xl font-bold">2</span></div>
            <div className="flex flex-col items-center"><span className="text-sm uppercase tracking-widest text-slate-500 mb-1">Month</span><span className="text-4xl font-bold">DEC</span></div>
            <div className="flex flex-col items-center"><span className="text-sm uppercase tracking-widest text-slate-500 mb-1">Year</span><span className="text-4xl font-bold">2026</span></div>
          </div>
        </div>

        {/* ऊपर का स्क्रैच होने वाला कैनवास */}
        <canvas
          ref={canvasRef}
          width={320}
          height={144}
          className="absolute inset-0 cursor-pointer z-10 touch-none"
          onMouseDown={() => setIsScratching(true)}
          onMouseUp={() => setIsScratching(false)}
          onMouseLeave={() => setIsScratching(false)}
          onMouseMove={scratch}
          onTouchStart={(e) => { setIsScratching(true); scratch(e); }}
          onTouchEnd={() => setIsScratching(false)}
          onTouchMove={scratch}
        />
      </div>
    </section>
  );
}