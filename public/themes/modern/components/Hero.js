/**
 * Modern Theme - Hero Component
 * Pure vanilla JavaScript - no build step required
 */

export function renderHero({ title, subtitle, ctaText, ctaLink }) {
  return `
    <section class="hero modern-hero" style="
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      padding: 140px 20px;
      position: relative;
    ">
      <div class="container" style="max-width: 1200px; margin: 0 auto;">
        <div style="max-width: 700px;">
          <h1 style="
            font-size: clamp(2.8rem, 6vw, 5rem);
            font-weight: 800;
            margin-bottom: 1.5rem;
            line-height: 1.1;
            letter-spacing: -0.02em;
          ">
            ${title || 'Modern Education'}
          </h1>
          <p style="
            font-size: clamp(1.2rem, 2.5vw, 1.5rem);
            margin-bottom: 2.5rem;
            opacity: 0.9;
            line-height: 1.6;
          ">
            ${subtitle || 'Innovative learning for the digital age'}
          </p>
          ${ctaText && ctaLink ? `
            <a href="${ctaLink}"
               data-route="${ctaLink}"
               class="btn-hero"
               style="
                 background-color: #00d4ff;
                 color: #1a1a2e;
                 padding: 1.2rem 3rem;
                 font-size: 1.1rem;
                 font-weight: 700;
                 border-radius: 50px;
                 text-decoration: none;
                 display: inline-block;
                 transition: all 0.3s ease;
                 box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
               "
               onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 32px rgba(0, 212, 255, 0.4)';"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(0, 212, 255, 0.3)';">
              ${ctaText}
            </a>
          ` : ''}
        </div>
      </div>
    </section>
  `;
}
