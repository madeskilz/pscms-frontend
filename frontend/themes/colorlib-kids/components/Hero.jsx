import { useTheme } from '../../../lib/ThemeContext';

export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink }) {
  const { theme } = useTheme();
  return (
    <section
      className="py-24 px-6 text-center"
      style={{
        background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
        color: '#fff',
        fontFamily: 'Quicksand, sans-serif'
      }}
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
          {title || 'Welcome to Kids Primary School'}
        </h1>
        <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
          {subtitle || 'Fun, learning, and friendship for every child.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {ctaText && ctaLink && (
            <a href={ctaLink} className="bg-white text-yellow-600 font-bold px-10 py-4 rounded-full shadow-xl hover:bg-yellow-100 hover:shadow-2xl transition-all transform hover:scale-105">
              {ctaText}
            </a>
          )}
          {secondaryCtaText && secondaryCtaLink && (
            <a href={secondaryCtaLink} className="bg-yellow-500 text-white font-bold px-10 py-4 rounded-full shadow-xl hover:bg-yellow-600 hover:shadow-2xl transition-all transform hover:scale-105">
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
