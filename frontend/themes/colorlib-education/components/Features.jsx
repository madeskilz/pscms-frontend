import Card from './Card';

const defaultFeatures = [
  { icon: '🔬', title: 'Science Lab', description: 'Hands-on experiments to spark curiosity.' },
  { icon: '💻', title: 'Digital Literacy', description: 'Modern computer center for tech skills.' },
  { icon: '⚽', title: 'Sports', description: 'Physical education and team sports for all.' },
];

export default function Features({ features }) {
  const displayFeatures = features || defaultFeatures;
  return (
    <section className="py-16 px-6 bg-[#f0f9ff]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {displayFeatures.map((f, i) => (
          <Card key={i} {...f} />
        ))}
      </div>
    </section>
  );
}
