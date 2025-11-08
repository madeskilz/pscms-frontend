import { useTheme } from '../../../lib/ThemeContext';

export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink }) {
  const { theme } = useTheme();
  return (
    <section
      className="py-24 px-6 text-center"
      style={{
        background: 'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)',
        color: '#222',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
          {title || 'Welcome to Education Primary School'}
        </h1>
        <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
          {subtitle || 'Building a bright future, one lesson at a time.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {ctaText && ctaLink && (
            <a href={ctaLink} className="bg-white text-blue-600 font-bold px-10 py-4 rounded-lg shadow-xl hover:bg-blue-100 hover:shadow-2xl transition-all transform hover:scale-105">
              {ctaText}
            </a>
          )}
          {secondaryCtaText && secondaryCtaLink && (
            <a href={secondaryCtaLink} className="bg-blue-500 text-white font-bold px-10 py-4 rounded-lg shadow-xl hover:bg-blue-600 hover:shadow-2xl transition-all transform hover:scale-105">
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
