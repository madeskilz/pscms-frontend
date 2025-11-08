import Card from './Card';

const defaultFeatures = [
  { icon: '🔬', title: 'Science Lab', description: 'Hands-on experiments to spark curiosity.' },
  { icon: '💻', title: 'Digital Literacy', description: 'Modern computer center for tech skills.' },
  { icon: '⚽', title: 'Sports', description: 'Physical education and team sports for all.' },
];

export default function Features({ features }) {
  const displayFeatures = features || defaultFeatures;
  return (
    <section className="py-20 px-6 bg-[#f0f9ff]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: '#8fd3f4', fontFamily: 'Poppins, sans-serif' }}>Our Facilities & Programs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">World-class resources and programs designed to nurture excellence in every student.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {displayFeatures.map((f, i) => (
            <Card key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
