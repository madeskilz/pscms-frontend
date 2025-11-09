/**
 * Classic Theme - Hero Component
 * Pure vanilla JavaScript - no build step required
 */

export function renderHero({ title, subtitle, ctaText, ctaLink }) {
  return `
    <section class="hero classic-hero" style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      padding: 120px 20px;
      text-align: center;
    ">
      <div class="container" style="max-width: 1200px; margin: 0 auto;">
        <h1 style="
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        ">
          ${title || 'Welcome to Our School'}
        </h1>
        <p style="
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          opacity: 0.95;
        ">
          ${subtitle || 'Empowering students to reach their full potential'}
        </p>
        ${ctaText && ctaLink ? `
          <a href="${ctaLink}"
             data-route="${ctaLink}"
             class="btn-hero"
             style="
               background-color: white;
               color: #667eea;
               padding: 1rem 2.5rem;
               font-size: 1.1rem;
               font-weight: 600;
               border-radius: 8px;
               text-decoration: none;
               display: inline-block;
               transition: all 0.3s ease;
               box-shadow: 0 4px 12px rgba(0,0,0,0.15);
             "
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.2)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';">
            ${ctaText}
          </a>
        ` : ''}
      </div>
    </section>
  `;
}
