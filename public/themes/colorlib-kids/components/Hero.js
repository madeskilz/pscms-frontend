/**
 * Colorlib Kids Theme - Hero Component
 * Pure vanilla JavaScript - no build step required
 */

export function renderHero({ title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink }) {
  return `
    <section class="hero colorlib-kids-hero" style="
      background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
      color: #fff;
      padding: 96px 20px;
      position: relative;
      overflow: hidden;
    ">
      <div class="container" style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; max-width: 900px; margin: 0 auto;">
          <h1 style="
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            font-weight: 800;
            margin-bottom: 1.5rem;
            font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            text-shadow: 0 2px 20px rgba(0,0,0,0.15);
            line-height: 1.2;
          ">
            ${title || 'Welcome to Kids Primary School'}
          </h1>
          <p style="
            font-size: clamp(1.1rem, 2vw, 1.5rem);
            margin-bottom: 2.5rem;
            opacity: 0.95;
            font-weight: 400;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
          ">
            ${subtitle || 'Fun, learning, and friendship for every child.'}
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            ${ctaText && ctaLink ? `
              <a href="${ctaLink}" 
                 data-route="${ctaLink}"
                 class="btn-hero-primary"
                 style="
                   background-color: white;
                   color: #f7971e;
                   padding: 1rem 2.5rem;
                   font-size: 1.1rem;
                   font-weight: 700;
                   border-radius: 12px;
                   text-decoration: none;
                   box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                   transition: all 0.3s ease;
                   display: inline-block;
                 "
                 onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.25)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)';">
                ${ctaText}
              </a>
            ` : ''}
            ${secondaryCtaText && secondaryCtaLink ? `
              <a href="${secondaryCtaLink}"
                 data-route="${secondaryCtaLink}"
                 class="btn-hero-secondary"
                 style="
                   background-color: transparent;
                   color: white;
                   padding: 1rem 2.5rem;
                   font-size: 1.1rem;
                   font-weight: 700;
                   border-radius: 12px;
                   border: 2px solid white;
                   text-decoration: none;
                   transition: all 0.3s ease;
                   display: inline-block;
                 "
                 onmouseover="this.style.backgroundColor='rgba(255,255,255,0.15)'; this.style.transform='translateY(-3px)';"
                 onmouseout="this.style.backgroundColor='transparent'; this.style.transform='translateY(0)';">
                ${secondaryCtaText}
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}
