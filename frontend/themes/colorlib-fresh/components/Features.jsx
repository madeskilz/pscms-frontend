import Card from './Card';

const defaultFeatures = [
  { icon: '🎨', title: 'Creative Arts', description: 'Encouraging creativity through painting, music, and drama.' },
  { icon: '📚', title: 'Literacy', description: 'Building strong reading and writing skills for every child.' },
  { icon: '🌱', title: 'Growth', description: 'Fostering personal and academic growth in a caring environment.' },
];

export default function Features({ features }) {
  const displayFeatures = features || defaultFeatures;
  return (
    <section className="py-20 px-6 bg-[#e6f9f4]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: '#185a9d', fontFamily: 'Montserrat, sans-serif' }}>What Makes Us Special</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the unique advantages that set our school apart and help every child thrive.</p>
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
