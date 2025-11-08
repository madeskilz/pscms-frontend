export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, image }) {
  return (
    <header className="py-24 bg-gradient-to-br from-blue-50 to-white border-b-2 border-blue-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">{title || 'Welcome to Our School'}</h1>
            {subtitle && <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-2xl">{subtitle}</p>}
            {(ctaText || secondaryCtaText) && (
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {ctaText && ctaLink && (
                  <a href={ctaLink} className="bg-blue-600 text-white font-bold px-10 py-4 rounded-lg shadow-xl hover:bg-blue-700 hover:shadow-2xl transition-all transform hover:scale-105">
                    {ctaText}
                  </a>
                )}
                {secondaryCtaText && secondaryCtaLink && (
                  <a href={secondaryCtaLink} className="bg-gray-100 text-blue-600 font-bold px-10 py-4 rounded-lg shadow-xl hover:bg-gray-200 hover:shadow-2xl transition-all transform hover:scale-105">
                    {secondaryCtaText}
                  </a>
                )}
              </div>
            )}
          </div>
          {image && (
            <div className="flex-shrink-0">
              <img src={image} alt="hero" className="w-80 h-64 object-cover rounded-2xl shadow-2xl" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
