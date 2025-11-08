import { useTheme } from '../../../lib/ThemeContext';

export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink }) {
  const { theme } = useTheme();
  return (
    <section
      className="py-20 px-6 text-center"
      style={{
        background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif'
      }}
    >
      <h1 className="text-5xl font-extrabold mb-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
        {title || 'Welcome to Fresh Primary School'}
      </h1>
      <p className="text-xl mb-8 opacity-90">
        {subtitle || 'Inspiring young minds with creativity, curiosity, and care.'}
      </p>
      <div className="flex justify-center gap-6 mt-8">
        {ctaText && ctaLink && (
          <a href={ctaLink} className="bg-white text-green-600 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-green-100 transition-all">
            {ctaText}
          </a>
        )}
        {secondaryCtaText && secondaryCtaLink && (
          <a href={secondaryCtaLink} className="bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-all">
            {secondaryCtaText}
          </a>
        )}
      </div>
    </section>
  );
}
