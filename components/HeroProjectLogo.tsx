import Image from 'next/image';

interface HeroProjectLogoProps {
  slug: string;
}

export function HeroProjectLogo({ slug }: HeroProjectLogoProps) {
  switch (slug) {
    case 'allnrg':
      return (
        <div className="hero-brand-logo hero-brand-logo--allnrg" aria-label="Alliance Energy">
          <div className="hero-brand-logo__backdrop">
            <Image
              src="/images/logos/allnrg-yellow.png"
              alt="Alliance Energy"
              width={320}
              height={85}
              priority
              className="hero-brand-logo__img hero-brand-logo__img--allnrg"
            />
          </div>
        </div>
      );

    case 'pdp':
      return (
        <div className="hero-brand-logo hero-brand-logo--pdp" aria-label="PDP">
          <div className="hero-brand-logo__backdrop hero-brand-logo__flex">
            <svg viewBox="0 0 44 52" className="hero-brand-logo__pdp-mark" aria-hidden="true">
              <path
                d="M10.9 50.6V10.8h16L32.5 18v32.6h10.3V13.9L30.1.4H-1v50.2h11.9z"
                fill="#fc6019"
              />
            </svg>
            <div className="hero-brand-logo__text">
              <span className="hero-brand-logo__title hero-brand-logo__title--orange">ПДП</span>
              <span className="hero-brand-logo__subtitle hero-brand-logo__subtitle--cream">
                ПОВОЛЖСКОЕ ДЕЛОВОЕ<br />ПАРТНЕРСТВО
              </span>
            </div>
          </div>
        </div>
      );

    case 'khasaut-tour':
      return (
        <div className="hero-brand-logo hero-brand-logo--khasaut" aria-label="Khasaut Tour">
          <div className="hero-brand-logo__backdrop hero-brand-logo__flex">
            <svg viewBox="0 0 92 112" className="hero-brand-logo__icon" aria-hidden="true">
              <path d="M12 5h68l6 91-40 11L6 96Z" fill="#102e21" stroke="#2ebd68" strokeWidth="3.5" />
              <path d="M14 49h64v30c0 12-12 22-32 29C26 101 14 92 14 79Z" fill="#153c30" stroke="#f4ede2" strokeWidth="2.5" />
              <path d="M20 37 27 20l5 11 7-18 7 18 7-15 6 17 7-11 7 18" fill="none" stroke="#2ebd68" strokeWidth="2.5" />
              <path d="M17 47h58M19 76h54M26 84h40" stroke="#f4ede2" strokeWidth="1.5" />
              <text x="46" y="67" textAnchor="middle" fill="#ffffff" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="10.5" letterSpacing="0.08em">KHASAUT</text>
              <text x="46" y="96" textAnchor="middle" fill="#2ebd68" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="8" letterSpacing="0.14em">TOUR</text>
            </svg>
            <div className="hero-brand-logo__text">
              <span className="hero-brand-logo__title hero-brand-logo__title--green">KHASAUT TOUR</span>
              <span className="hero-brand-logo__subtitle hero-brand-logo__subtitle--green">ЭКСПЕДИЦИИ ПО КАВКАЗУ</span>
            </div>
          </div>
        </div>
      );

    case 'vpn-equipment':
      return (
        <div className="hero-brand-logo hero-brand-logo--vpn" aria-label="VPN Equipment">
          <div className="hero-brand-logo__backdrop hero-brand-logo__flex">
            <div className="hero-brand-logo__vpn-badge">
              <Image
                src="/images/logos/vpn-brand-live.png"
                alt="ИБО"
                width={52}
                height={52}
                priority
                className="hero-brand-logo__img hero-brand-logo__img--vpn-live"
              />
            </div>
            <div className="hero-brand-logo__text">
              <span className="hero-brand-logo__title hero-brand-logo__title--yellow-orange">ООО «ВПН»</span>
              <span className="hero-brand-logo__subtitle hero-brand-logo__subtitle--yellow-orange">СПЕЦТЕХНИКА И БЫТОВКИ</span>
            </div>
          </div>
        </div>
      );

    case 'legacy-rheumatology':
      return (
        <div className="hero-brand-logo hero-brand-logo--legacy" aria-label="Legacy Rheumatology">
          <div className="hero-brand-logo__backdrop">
            <Image
              src="/images/logos/legacy-seal-badge.png"
              alt="Legacy Rheumatology"
              width={140}
              height={140}
              priority
              className="hero-brand-logo__img hero-brand-logo__img--seal"
            />
          </div>
        </div>
      );

    case 'aurelia-atelier':
      return (
        <div className="hero-brand-logo hero-brand-logo--aurelia" aria-label="Aurelia Atelier">
          <div className="hero-brand-logo__backdrop hero-brand-logo__flex">
            <div className="hero-brand-logo__planet-wrap">
              <Image
                src="/images/logos/aurelia-planet-3d.png"
                alt="Aurelia Planet"
                width={64}
                height={64}
                priority
                className="hero-brand-logo__img hero-brand-logo__img--planet"
              />
            </div>
            <div className="hero-brand-logo__text">
              <span className="hero-brand-logo__title hero-brand-logo__title--serif hero-brand-logo__title--blue">Aurelia</span>
              <span className="hero-brand-logo__subtitle hero-brand-logo__subtitle--blue">COSMIC INTERFACE ATELIER</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
