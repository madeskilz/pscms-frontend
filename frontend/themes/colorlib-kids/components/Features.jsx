import Card from './Card';

const features = [
  { icon: '🤹', title: 'Playful Learning', description: 'Games and activities that make learning fun.' },
  { icon: '👫', title: 'Friendship', description: 'Building social skills and lifelong friendships.' },
  { icon: '🧩', title: 'Problem Solving', description: 'Developing critical thinking through puzzles and challenges.' },
];

export default function Features() {
  return (
    <section className="py-16 px-6 bg-[#fffbe6]">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <Card key={i} {...f} />
        ))}
      </div>
    </section>
  );
}
