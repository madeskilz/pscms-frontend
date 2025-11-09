# Theme System

This directory contains client-side theme components using **pure vanilla JavaScript ES modules** — no build step required.

## Available Themes

- **classic** - Clean gradient hero with purple/violet tones
- **modern** - Dark, sleek design with cyan accents
- **vibrant** - Colorful gradient (pink to yellow)
- **colorlib-kids** - Bright orange/yellow gradient for children
- **colorlib-education** - Professional blue gradient
- **colorlib-fresh** - Green gradient for nature/growth themes

## How It Works

Each theme exports ES modules from `<theme>/components/*.js`:

```javascript
// Example: /themes/colorlib-kids/components/Hero.js
export function renderHero({ title, subtitle, ctaText, ctaLink }) {
  return `<section class="hero">...</section>`;
}
```

The UI system dynamically imports these at runtime:

```javascript
const themeModule = await import(`/themes/${activeTheme}/components/Hero.js`);
const heroHtml = themeModule.renderHero(heroData);
```

## Component Structure

Each theme can provide:

- **Hero.js** - Homepage hero section (primary CTA)
- **Features.js** - Feature grid/cards (future)
- **Card.js** - Post/content cards (future)

Components return HTML strings with inline styles for true zero-dependency rendering.

## Adding a New Theme

1. Create directory: `/themes/your-theme/components/`
2. Add `Hero.js`:
   ```javascript
   export function renderHero({ title, subtitle, ctaText, ctaLink }) {
     return `
       <section class="hero your-theme-hero" style="...">
         <h1>${title}</h1>
         <p>${subtitle}</p>
         <a href="${ctaLink}">${ctaText}</a>
       </section>
     `;
   }
   ```
3. Update settings to use `"your-theme"` as active theme
4. Reload homepage

## Runtime Loading

- Theme modules load **on-demand** via dynamic `import()`
- Fallback to default hero if theme component missing
- No transpilation, bundling, or preprocessing needed
- Works in all modern browsers (ES6+ modules)

## Browser Requirements

- ES6 Module support (`import`/`export`)
- Dynamic `import()` (all modern browsers)
- Template literals

## Notes

- Themes use **inline styles** for portability
- No external CSS files required (self-contained)
- Each component is atomic and independent
- Safe to add custom components without breaking core
