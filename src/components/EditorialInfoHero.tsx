import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export type EditorialInfoHeroProps = {
  imageSrc: string;
  eyebrow: string;
  title: string;
  lead: string;
  ctaTo: string;
  ctaLabel: string;
  loaded: boolean;
};

/**
 * Full-bleed photograph with an overlapping archival panel — “magazine box on photo”
 * (common on award-style editorial / luxury brand pages; keeps one headline, one subline, one CTA).
 */
export function EditorialInfoHero({
  imageSrc,
  eyebrow,
  title,
  lead,
  ctaTo,
  ctaLabel,
  loaded,
}: EditorialInfoHeroProps) {
  return (
    <section
      className={`editorial-hero-bleed relative mb-16 border-b border-border/25 transition-all duration-1000 lg:mb-24 ${
        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div className="relative min-h-[min(92svh,54rem)] overflow-hidden lg:min-h-[min(86svh,50rem)]">
        <div className="absolute inset-0">
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_72%_42%,transparent_0%,rgba(246,241,234,0.4)_52%,rgba(246,241,234,0.92)_100%)] lg:bg-[radial-gradient(ellipse_75%_85%_at_78%_38%,transparent_0%,rgba(246,241,234,0.28)_48%,rgba(246,241,234,0.88)_100%)]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/60 lg:bg-gradient-to-r lg:from-background lg:via-background/45 lg:to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-[88rem] flex-col justify-end px-4 pb-11 pt-[min(28vh,12rem)] sm:px-6 sm:pb-14 sm:pt-32 lg:justify-center lg:px-8 lg:pb-24 lg:pt-28 lg:pl-[max(1.25rem,calc((100vw-88rem)/2+1.5rem))]">
          <div className="w-full max-w-lg -translate-y-2 bg-card/95 px-7 py-9 shadow-[0_24px_48px_-28px_rgba(42,42,41,0.18)] backdrop-blur-md sm:px-9 sm:py-10 lg:max-w-[27rem] lg:-translate-y-4 lg:px-10 lg:py-11 xl:max-w-[28rem]">
            <div className="mb-6 flex items-center gap-4 sm:mb-7">
              <span className="h-12 w-px shrink-0 bg-primary sm:h-14" aria-hidden />
              <p className="section-subtitle text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground sm:text-xs">
                {eyebrow}
              </p>
            </div>
            <h1 className="font-editorial mb-5 text-[clamp(2.25rem,5.2vw,3.65rem)] font-medium leading-[1.06] tracking-[-0.02em] text-foreground text-balance">
              {title}
            </h1>
            <p className="mb-9 max-w-md text-pretty text-base leading-[1.72] text-muted-foreground sm:text-lg">
              {lead}
            </p>
            <Link
              to={ctaTo}
              className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-primary link-underline"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
