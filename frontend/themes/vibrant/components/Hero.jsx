export default function Hero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, image }) {
  return (
    <header className="relative py-28 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight drop-shadow-lg animate-fade-in">{title || 'Welcome to Our School'}</h1>
          {subtitle && <p className="text-xl md:text-2xl text-purple-50 leading-relaxed drop-shadow mb-10 max-w-3xl mx-auto">{subtitle}</p>}
          {(ctaText || secondaryCtaText) && (
            <div className="flex flex-wrap gap-4 justify-center">
              {ctaText && ctaLink && (
                <a href={ctaLink} className="bg-white text-purple-600 font-bold px-10 py-4 rounded-full shadow-xl hover:bg-purple-50 hover:shadow-2xl transition-all transform hover:scale-105">
                  {ctaText}
                </a>
              )}
              {secondaryCtaText && secondaryCtaLink && (
                <a href={secondaryCtaLink} className="bg-purple-700 text-white font-bold px-10 py-4 rounded-full shadow-xl hover:bg-purple-800 hover:shadow-2xl transition-all transform hover:scale-105">
                  {secondaryCtaText}
                </a>
              )}
            </div>
          )}
          {image && (
            <div className="mt-12 flex justify-center">
              <img src={image} alt="hero" className="w-full max-w-lg h-72 object-cover rounded-3xl shadow-2xl border-8 border-white/30 transform hover:scale-105 transition-transform duration-300" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
