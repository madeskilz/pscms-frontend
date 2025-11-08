import { useTheme } from '../../../lib/ThemeContext';

export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink }) {
  const { theme } = useTheme();
  return (
    <section
      className="py-24 px-6 text-center"
      style={{
        background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif'
      }}
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
          {title || 'Welcome to Fresh Primary School'}
        </h1>
        <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
          {subtitle || 'Inspiring young minds with creativity, curiosity, and care.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {ctaText && ctaLink && (
            <a href={ctaLink} className="bg-white text-green-600 font-bold px-10 py-4 rounded-lg shadow-xl hover:bg-green-100 hover:shadow-2xl transition-all transform hover:scale-105">
              {ctaText}
            </a>
          )}
          {secondaryCtaText && secondaryCtaLink && (
            <a href={secondaryCtaLink} className="bg-green-600 text-white font-bold px-10 py-4 rounded-lg shadow-xl hover:bg-green-700 hover:shadow-2xl transition-all transform hover:scale-105">
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
