// Theme configurations
export const themes = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional academic layout with serif fonts',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textLight: '#64748b',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    hero: {
      style: 'centered',
      showImage: true,
    }
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimal design with bold typography',
    colors: {
      primary: '#0ea5e9',
      secondary: '#6366f1',
      accent: '#ec4899',
      background: '#ffffff',
      surface: '#f1f5f9',
      text: '#0f172a',
      textLight: '#475569',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    hero: {
      style: 'split',
      showImage: true,
    }
  },
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Colorful and energetic design for young learners',
    colors: {
      primary: '#8b5cf6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#fefce8',
      surface: '#ffffff',
      text: '#18181b',
      textLight: '#71717a',
    },
    fonts: {
      heading: 'Poppins, system-ui, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    hero: {
      style: 'banner',
      showImage: true,
    }
  },
  'colorlib-fresh': {
    id: 'colorlib-fresh',
    name: 'Fresh (Colorlib)',
    description: 'Green/blue gradient, playful and clean',
    colors: {
      primary: '#43cea2',
      secondary: '#185a9d',
      accent: '#43cea2',
      background: '#e6f9f4',
      surface: '#fff',
      text: '#222',
      textLight: '#43cea2',
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Montserrat, sans-serif',
    },
    hero: {
      style: 'colorlib-fresh',
      showImage: true,
    }
  },
  'colorlib-kids': {
    id: 'colorlib-kids',
    name: 'Kids (Colorlib)',
    description: 'Orange/yellow, fun and friendly',
    colors: {
      primary: '#f7971e',
      secondary: '#ffd200',
      accent: '#ffd200',
      background: '#fffbe6',
      surface: '#fff',
      text: '#222',
      textLight: '#f7971e',
    },
    fonts: {
      heading: 'Quicksand, sans-serif',
      body: 'Quicksand, sans-serif',
    },
    hero: {
      style: 'colorlib-kids',
      showImage: true,
    }
  },
  'colorlib-education': {
    id: 'colorlib-education',
    name: 'Education (Colorlib)',
    description: 'Blue/green, bright and optimistic',
    colors: {
      primary: '#8fd3f4',
      secondary: '#84fab0',
      accent: '#84fab0',
      background: '#f0f9ff',
      surface: '#fff',
      text: '#222',
      textLight: '#8fd3f4',
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Poppins, sans-serif',
    },
    hero: {
      style: 'colorlib-education',
      showImage: true,
    }
  },
};

export function getTheme(themeId) {
  return themes[themeId] || themes.classic;
}
