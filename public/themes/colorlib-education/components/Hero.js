/**
 * Colorlib Education Theme - Hero Component
 * Pure vanilla JavaScript - no build step required
 */

export function renderHero({ title, subtitle, ctaText, ctaLink }) {
  return `
    <section class="hero colorlib-education-hero" style="
      background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
      color: #fff;
      padding: 100px 20px;
      position: relative;
    ">
      <div class="container" style="max-width: 1200px; margin: 0 auto; text-align: center;">
        <h1 style="
          font-size: clamp(2.5rem, 5vw, 4.2rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 0 2px 16px rgba(0,0,0,0.15);
        ">
          ${title || 'Quality Education'}
        </h1>
        <p style="
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          margin-bottom: 2.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          opacity: 0.95;
          line-height: 1.6;
        ">
          ${subtitle || 'Building knowledge, shaping futures'}
        </p>
        ${ctaText && ctaLink ? `
          <a href="${ctaLink}"
             data-route="${ctaLink}"
             class="btn-hero"
             style="
               background-color: white;
               color: #3a7bd5;
               padding: 1.1rem 2.8rem;
               font-size: 1.1rem;
               font-weight: 700;
               border-radius: 8px;
               text-decoration: none;
               display: inline-block;
               transition: all 0.3s ease;
               box-shadow: 0 6px 20px rgba(0,0,0,0.2);
             "
             onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 28px rgba(0,0,0,0.25)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)';">
            ${ctaText}
          </a>
        ` : ''}
      </div>
    </section>
  `;
}
