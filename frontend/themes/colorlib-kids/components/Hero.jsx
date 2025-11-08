import { useTheme } from '../../../lib/ThemeContext';

export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink }) {
  const { theme } = useTheme();
  return (
    <section
      className="py-20 px-6 text-center"
      style={{
        background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
        color: '#fff',
        fontFamily: 'Quicksand, sans-serif'
      }}
    >
      <h1 className="text-5xl font-extrabold mb-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
        {title || 'Welcome to Kids Primary School'}
      </h1>
      <p className="text-xl mb-8 opacity-90">
        {subtitle || 'Fun, learning, and friendship for every child.'}
      </p>
      <div className="flex justify-center gap-6 mt-8">
        {ctaText && ctaLink && (
          <a href={ctaLink} className="bg-white text-yellow-600 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-yellow-100 transition-all">
            {ctaText}
          </a>
        )}
        {secondaryCtaText && secondaryCtaLink && (
          <a href={secondaryCtaLink} className="bg-yellow-500 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-all">
            {secondaryCtaText}
          </a>
        )}
      </div>
    </section>
  );
}
