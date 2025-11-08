import { useTheme } from '../../../lib/ThemeContext';

export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink }) {
  const { theme } = useTheme();
  return (
    <section
      className="py-20 px-6 text-center"
      style={{
        background: 'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)',
        color: '#222',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <h1 className="text-5xl font-extrabold mb-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
        {title || 'Welcome to Education Primary School'}
      </h1>
      <p className="text-xl mb-8 opacity-90">
        {subtitle || 'Building a bright future, one lesson at a time.'}
      </p>
      <div className="flex justify-center gap-6 mt-8">
        {ctaText && ctaLink && (
          <a href={ctaLink} className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-100 transition-all">
            {ctaText}
          </a>
        )}
        {secondaryCtaText && secondaryCtaLink && (
          <a href={secondaryCtaLink} className="bg-blue-500 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-all">
            {secondaryCtaText}
          </a>
        )}
      </div>
    </section>
  );
}
