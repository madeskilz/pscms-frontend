import Card from './Card';

const defaultFeatures = [
  { icon: '🤹', title: 'Playful Learning', description: 'Games and activities that make learning fun.' },
  { icon: '👫', title: 'Friendship', description: 'Building social skills and lifelong friendships.' },
  { icon: '🧩', title: 'Problem Solving', description: 'Developing critical thinking through puzzles and challenges.' },
];

export default function Features({ features }) {
  const displayFeatures = features || defaultFeatures;
  return (
    <section className="py-20 px-6 bg-[#fffbe6]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: '#f7971e', fontFamily: 'Quicksand, sans-serif' }}>Why Families Choose Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover what makes our school the perfect place for your child's growth and development.</p>
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
