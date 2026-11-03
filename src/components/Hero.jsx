import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { weddingDetails } from '../data/weddingDetails';

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const { baseUrl, backgroundMusic } = weddingDetails.assets;
  const { brideName, groomName } = weddingDetails.couple;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#fffdf9] flex flex-col items-center justify-start pt-32 md:pt-48">
      {/* Wedding background music */}
      <audio ref={audioRef} loop src={backgroundMusic} />
      
      <button 
        onClick={toggleAudio} 
        className="fixed top-6 right-6 z-50 p-2.5 bg-white/60 hover:bg-white/90 backdrop-blur-md rounded-full text-amber-900 transition-all shadow-sm"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Layered Parallax Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src={`${baseUrl}/backgrounds/hero-sky-desktop.webp`} className="absolute inset-0 w-full h-full object-cover" alt="" />
        <img src={`${baseUrl}/backgrounds/hero-sun-desktop.webp`} className="absolute inset-0 w-full h-full object-cover mix-blend-screen" alt="" />
        <img src={`${baseUrl}/backgrounds/hero-mountain-desktop.webp`} className="absolute inset-0 w-full h-full object-cover object-bottom" alt="" />
        <img src={`${baseUrl}/backgrounds/hero-cloud-desktop.webp`} className="absolute inset-0 w-full h-full object-cover object-bottom opacity-80" alt="" />
        <img src={`${baseUrl}/backgrounds/hero-temple-desktop.webp`} className="absolute inset-0 w-full h-full object-cover object-bottom" alt="" />
      </div>

      {/* Top Frame and Bells */}
      <div className="absolute top-0 inset-x-0 z-10 pointer-events-none">
        <img src={`${baseUrl}/decorations/bells-frame-desktop.webp`} className="w-full object-cover" alt="" />
      </div>

      {/* Foreground Typography */}
      <div className="relative z-20 text-center flex flex-col items-center">
        <h1 className="text-7xl md:text-9xl font-script text-[#4a0d0d] flex flex-col items-center leading-none">
          <span>{brideName}</span>
          <span className="text-5xl md:text-7xl text-[#d4af37] my-2">&amp;</span>
          <span>{groomName}</span>
        </h1>
      </div>
    </section>
  );
}