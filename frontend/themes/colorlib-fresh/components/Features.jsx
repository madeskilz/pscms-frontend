import Card from './Card';

const defaultFeatures = [
  { icon: '🎨', title: 'Creative Arts', description: 'Encouraging creativity through painting, music, and drama.' },
  { icon: '📚', title: 'Literacy', description: 'Building strong reading and writing skills for every child.' },
  { icon: '🌱', title: 'Growth', description: 'Fostering personal and academic growth in a caring environment.' },
];

export default function Features({ features }) {
  const displayFeatures = features || defaultFeatures;
  return (
    <section className="py-16 px-6 bg-[#e6f9f4]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {displayFeatures.map((f, i) => (
          <Card key={i} {...f} />
        ))}
      </div>
    </section>
  );
}
