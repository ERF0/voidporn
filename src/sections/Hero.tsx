import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }

    const particles: Particle[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.5 - 0.2,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance
      if (frameCount % 2 === 0) {
        ctx.fillStyle = 'rgba(15, 15, 15, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, i) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.y < -10) {
            particle.y = canvas.height + 10;
            particle.x = Math.random() * canvas.width;
          }

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 9, 20, ${particle.alpha})`;
          ctx.fill();

          // Draw connections
          if (i % 5 === 0) {
            particles.slice(i + 1, i + 4).forEach((other) => {
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(229, 9, 20, ${0.1 * (1 - distance / 100)})`;
                ctx.stroke();
              }
            });
          }
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Scroll handler to hide hero
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollY < windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const floatingBadges = ['NEW', 'HOT', '4K', 'LIVE'];
  const badgePositions = [
    { top: '15%', left: '10%', delay: '0.6s' },
    { top: '20%', right: '15%', delay: '0.7s' },
    { bottom: '30%', left: '8%', delay: '0.8s' },
    { bottom: '25%', right: '12%', delay: '0.9s' },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: '#0F0F0F' }}
      />

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <div
          className="w-full h-full"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            animation: 'scanline 8s linear infinite',
          }}
        />
      </div>

      {/* Floating Badges */}
      {floatingBadges.map((badge, index) => (
        <div
          key={badge}
          className="absolute animate-float pointer-events-none"
          style={{
            ...badgePositions[index],
            animationDelay: `${index * 0.5}s`,
          }}
        >
          <span
            className="
              inline-block px-3 py-1.5 rounded-full
              bg-vp-red/20 backdrop-blur-sm
              text-vp-red text-xs font-bold
              border border-vp-red/30
              animate-pulse-glow
            "
            style={{
              animationDelay: badgePositions[index].delay,
            }}
          >
            {badge}
          </span>
        </div>
      ))}

      {/* Main Content */}
      <div
        className={`
          relative z-10 h-full flex flex-col items-center justify-center
          px-4 transition-all duration-700 ease-dramatic
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}
        `}
      >
        {/* Logo */}
        <h1
          className="
            text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter
            text-white mb-4
            animate-fade-in-up
          "
          style={{ animationDelay: '0.3s' }}
        >
          VOID
          <span className="text-vp-red relative">
            PORN
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-vp-red rounded-full" />
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="
            text-lg sm:text-xl text-vp-text-secondary text-center max-w-md
            animate-fade-in-up
          "
          style={{ animationDelay: '0.6s' }}
        >
          Enter the void. <span className="text-vp-text">Infinite content awaits.</span>
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/home')}
          className="
            mt-8 px-8 py-3 rounded-full
            bg-vp-red text-white font-semibold
            transition-all duration-300 ease-smooth
            hover:bg-vp-red-dark hover:scale-105
            hover:shadow-glow-red
            animate-fade-in-up
          "
          style={{ animationDelay: '0.9s' }}
        >
          Explore the Void
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-vp-black to-transparent pointer-events-none" />
    </section>
  );
}
