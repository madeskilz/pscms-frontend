/**
 * Colorlib Fresh Theme - Hero Component
 * Pure vanilla JavaScript - no build step required
 */

export function renderHero({ title, subtitle, ctaText, ctaLink }) {
  return `
    <section class="hero colorlib-fresh-hero" style="
      background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
      color: #fff;
      padding: 110px 20px;
      text-align: center;
    ">
      <div class="container" style="max-width: 1200px; margin: 0 auto;">
        <h1 style="
          font-size: clamp(2.6rem, 5.5vw, 4.5rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 0 2px 12px rgba(0,0,0,0.12);
        ">
          ${title || 'Fresh Start'}
        </h1>
        <p style="
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          margin-bottom: 2.5rem;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
          opacity: 0.96;
          line-height: 1.6;
        ">
          ${subtitle || 'Growing minds, nurturing dreams'}
        </p>
        ${ctaText && ctaLink ? `
          <a href="${ctaLink}"
             data-route="${ctaLink}"
             class="btn-hero"
             style="
               background-color: white;
               color: #56ab2f;
               padding: 1.1rem 2.8rem;
               font-size: 1.1rem;
               font-weight: 700;
               border-radius: 10px;
               text-decoration: none;
               display: inline-block;
               transition: all 0.3s ease;
               box-shadow: 0 6px 20px rgba(0,0,0,0.18);
             "
             onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 28px rgba(0,0,0,0.24)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.18)';">
            ${ctaText}
          </a>
        ` : ''}
      </div>
    </section>
  `;
}
