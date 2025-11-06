export default function Hero({ title, subtitle, image }) {
  return (
    <header className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-700">{subtitle}</p>}
          </div>
          {image && <img src={image} alt="hero" className="w-48 h-32 object-cover rounded" />}
        </div>
      </div>
    </header>
  );
}
