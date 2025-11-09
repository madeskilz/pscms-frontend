/**
 * Vibrant Theme - Hero Component
 * Pure vanilla JavaScript - no build step required
 */

export function renderHero({ title, subtitle, ctaText, ctaLink }) {
  return `
    <section class="hero vibrant-hero" style="
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: #2d3436;
      padding: 120px 20px;
      text-align: center;
    ">
      <div class="container" style="max-width: 1200px; margin: 0 auto;">
        <h1 style="
          font-size: clamp(2.8rem, 6vw, 4.5rem);
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
          ${title || 'Vibrant Learning'}
        </h1>
        <p style="
          font-size: clamp(1.2rem, 2.5vw, 1.5rem);
          margin-bottom: 2.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 500;
        ">
          ${subtitle || 'Colorful experiences, bright futures'}
        </p>
        ${ctaText && ctaLink ? `
          <a href="${ctaLink}"
             data-route="${ctaLink}"
             class="btn-hero"
             style="
               background-color: #2d3436;
               color: white;
               padding: 1.2rem 3rem;
               font-size: 1.2rem;
               font-weight: 700;
               border-radius: 50px;
               text-decoration: none;
               display: inline-block;
               transition: all 0.3s ease;
               box-shadow: 0 8px 24px rgba(45, 52, 54, 0.3);
             "
             onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 12px 32px rgba(45, 52, 54, 0.4)';"
             onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 24px rgba(45, 52, 54, 0.3)';">
            ${ctaText}
          </a>
        ` : ''}
      </div>
    </section>
  `;
}
