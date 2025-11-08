export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, image }) {
  return (
    <header className="py-16 bg-gradient-to-br from-blue-50 to-white border-b-2 border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">{title || 'Welcome to Our School'}</h1>
            {subtitle && <p className="text-xl text-gray-700 leading-relaxed mb-6">{subtitle}</p>}
            {(ctaText || secondaryCtaText) && (
              <div className="flex gap-4 justify-center md:justify-start">
                {ctaText && ctaLink && (
                  <a href={ctaLink} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all">
                    {ctaText}
                  </a>
                )}
                {secondaryCtaText && secondaryCtaLink && (
                  <a href={secondaryCtaLink} className="bg-gray-100 text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition-all">
                    {secondaryCtaText}
                  </a>
                )}
              </div>
            )}
          </div>
          {image && (
            <div className="flex-shrink-0">
              <img src={image} alt="hero" className="w-64 h-48 object-cover rounded-lg shadow-lg" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
