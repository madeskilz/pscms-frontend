import { useTheme } from '../lib/ThemeContext';
import PublicNav from '../components/PublicNav';

export default function AboutPage() {
  const { theme } = useTheme();

  return (
    <div style={{ 
      backgroundColor: theme.colors.background,
      minHeight: '100vh'
    }}>
      <PublicNav />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-5xl font-bold mb-6"
            style={{ 
              color: theme.colors.primary,
              fontFamily: theme.fonts.heading 
            }}
          >
            About Our School
          </h1>
          
          <div 
            className="prose prose-lg"
            style={{ 
              color: theme.colors.text,
              fontFamily: theme.fonts.body 
            }}
          >
            <div 
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <h2 
                className="text-3xl font-bold mb-4"
                style={{ color: theme.colors.primary }}
              >
                Our Mission
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: theme.colors.text }}>
                We are committed to providing quality education that empowers Nigerian K12 students 
                to reach their full potential. Our goal is to create a nurturing environment where 
                every student can thrive academically, socially, and personally.
              </p>
            </div>

            <div 
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <h2 
                className="text-3xl font-bold mb-4"
                style={{ color: theme.colors.primary }}
              >
                Our Values
              </h2>
              <ul className="space-y-4">
                {[
                  { title: 'Excellence', description: 'We strive for the highest standards in education and character development.' },
                  { title: 'Integrity', description: 'We uphold honesty, transparency, and ethical behavior in all our interactions.' },
                  { title: 'Innovation', description: 'We embrace modern teaching methods and technology to enhance learning.' },
                  { title: 'Community', description: 'We foster a strong sense of belonging and collaboration among students, staff, and parents.' }
                ].map((value, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-1" style={{ color: theme.colors.primary }}>
                        {value.title}
                      </h3>
                      <p style={{ color: theme.colors.text }}>{value.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div 
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <h2 
                className="text-3xl font-bold mb-4"
                style={{ color: theme.colors.primary }}
              >
                Our Facilities
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: '📚', title: 'Modern Library', description: 'Well-stocked with books and digital resources' },
                  { icon: '🔬', title: 'Science Labs', description: 'Equipped for hands-on experiments and research' },
                  { icon: '💻', title: 'Computer Center', description: 'Latest technology for digital literacy' },
                  { icon: '⚽', title: 'Sports Complex', description: 'Facilities for athletics and team sports' }
                ].map((facility, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg border-2" style={{ borderColor: theme.colors.accent }}>
                    <div className="text-4xl">{facility.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: theme.colors.primary }}>
                        {facility.title}
                      </h3>
                      <p className="text-sm" style={{ color: theme.colors.textLight }}>
                        {facility.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="bg-gradient-to-br rounded-lg shadow-lg p-8 text-center"
              style={{ 
                backgroundImage: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.secondary})`
              }}
            >
              <h2 className="text-3xl font-bold mb-4 text-white">
                Join Our Community
              </h2>
              <p className="text-lg mb-6 text-white">
                Interested in learning more about our school? Contact us today!
              </p>
              <a
                href="mailto:info@school.test"
                className="inline-block bg-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
                style={{ color: theme.colors.primary }}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
