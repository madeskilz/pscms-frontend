export default function Hero({ title, subtitle, image }) {
  return (
    <header className="py-16 bg-gradient-to-br from-blue-50 to-white border-b-2 border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">{title}</h1>
            {subtitle && <p className="text-xl text-gray-700 leading-relaxed">{subtitle}</p>}
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
