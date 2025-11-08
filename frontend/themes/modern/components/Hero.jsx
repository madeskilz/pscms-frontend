export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, image }) {
  return (
    <header className="relative py-24 bg-gradient-to-r from-cyan-500 to-blue-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">{title || 'Welcome to Our School'}</h1>
            {subtitle && <p className="text-xl text-cyan-50 leading-relaxed mb-8">{subtitle}</p>}
            {(ctaText || secondaryCtaText) && (
              <div className="flex flex-wrap gap-4">
                {ctaText && ctaLink && (
                  <a href={ctaLink} className="bg-white text-cyan-600 font-bold px-8 py-4 rounded-lg shadow-xl hover:bg-cyan-50 hover:shadow-2xl transition-all transform hover:scale-105">
                    {ctaText}
                  </a>
                )}
                {secondaryCtaText && secondaryCtaLink && (
                  <a href={secondaryCtaLink} className="bg-cyan-700 text-white font-bold px-8 py-4 rounded-lg shadow-xl hover:bg-cyan-800 hover:shadow-2xl transition-all transform hover:scale-105">
                    {secondaryCtaText}
                  </a>
                )}
              </div>
            )}
          </div>
          {image && (
            <div className="flex justify-center">
              <img src={image} alt="hero" className="w-full max-w-md h-64 object-cover rounded-2xl shadow-2xl border-4 border-white/20" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
