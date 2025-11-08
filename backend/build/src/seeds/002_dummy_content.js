exports.seed = async function(knex) {
  // Ensure admin user exists
  const admin = await knex('users').where({ email: 'admin@school.test' }).first();

    // Insert settings: site_title, theme, homepage, hero, features, primary_menu
  const settings = [
    { key: 'site_title', value: JSON.stringify('K12 School CMS') },
    // Default to a kid-friendly theme; can be changed in admin later
    { key: 'theme', value: JSON.stringify({ active: 'colorlib-kids' }) },
    { key: 'homepage', value: JSON.stringify({
      heroTitle: 'Welcome to Our School',
      heroSubtitle: 'Inspiring excellence and growth for every student',
      ctaText: 'Explore Programs',
      ctaHref: '/about',
        featuredPostIds: []
    }) },
      {
          key: 'hero', value: JSON.stringify({
              title: 'Welcome to Our School',
              subtitle: 'Empowering the next generation through quality education and innovation',
              ctaText: 'Learn More',
              ctaLink: '/about',
              secondaryCtaText: 'Contact Us',
              secondaryCtaLink: '/contact'
          })
      },
      {
          key: 'features', value: JSON.stringify([
              { icon: '📚', title: 'Quality Education', description: 'Experienced teachers dedicated to academic excellence and student success.' },
              { icon: '💻', title: 'Modern Technology', description: 'State-of-the-art facilities and digital learning resources.' },
              { icon: '🎨', title: 'Creative Arts', description: 'Encouraging creativity through music, drama, and visual arts programs.' },
              { icon: '⚽', title: 'Sports & Fitness', description: 'Comprehensive athletics program promoting health and teamwork.' },
              { icon: '🌍', title: 'Global Perspective', description: 'Preparing students to thrive in an interconnected world.' },
              { icon: '🤝', title: 'Community', description: 'Building strong partnerships between students, parents, and staff.' }
          ])
      },
    // Include parent-focused quick links by default
    { key: 'primary_menu', value: JSON.stringify([
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Admissions', href: '/posts/welcome-back' },
      { label: 'Calendar', href: '/posts/sports-day-highlights' },
      { label: 'PTA', href: '/posts' },
      { label: 'Parents', href: '/parents' },
      { label: 'Contact', href: '/contact' }
    ]) }
  ];

  for (const s of settings) {
    const exists = await knex('settings').where({ key: s.key }).first();
    if (exists) {
      await knex('settings').where({ key: s.key }).update({ value: s.value });
    } else {
      await knex('settings').insert(s);
    }
  }

  // Insert sample pages/posts if not present
  const ensurePost = async (row) => {
    const exists = await knex('posts').where({ slug: row.slug }).first();
    if (!exists) {
      await knex('posts').insert({
        ...row,
        author_id: admin?.id || null,
      });
    }
  };

  await ensurePost({
    type: 'page', status: 'published', title: 'About Us', slug: 'about',
    content: '<p>We are a vibrant learning community committed to excellence.</p>'
  });
  await ensurePost({
    type: 'page', status: 'published', title: 'Contact', slug: 'contact',
    content: '<p>Reach us via email or phone. We are here to help.</p>'
  });
  await ensurePost({
    type: 'post', status: 'published', title: 'Welcome Back to School', slug: 'welcome-back',
    content: '<p>We are excited to welcome our students back for a new term!</p>'
  });
  await ensurePost({
    type: 'post', status: 'published', title: 'Sports Day Highlights', slug: 'sports-day-highlights',
    content: '<p>Congratulations to all participants for a thrilling sports day!</p>'
  });

  // Optionally set a default menu record in menus table for future use
  const menuExists = await knex('menus').where({ name: 'primary' }).first().catch(()=>null);
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Admissions', href: '/posts/welcome-back' },
    { label: 'Calendar', href: '/posts/sports-day-highlights' },
    { label: 'PTA', href: '/posts' },
    { label: 'Parents', href: '/parents' },
    { label: 'Contact', href: '/contact' }
  ];
  if (!menuExists) {
    await knex('menus').insert({ name: 'primary', items: JSON.stringify(menuItems) });
  }

  console.log('Seeded default theme, homepage settings, primary menu, and sample content');
};
