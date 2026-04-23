import { Mail, ClipboardCheck, CreditCard, AlertTriangle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";
import { getAssetPath } from "../utils/images";
import { EditorialInfoHero } from "../components/EditorialInfoHero";
import { EditorialSectionKicker } from "../components/EditorialSectionKicker";

const CONTACT_EMAIL = "nook.textile@gmail.com";

const HERO_IMAGE = getAssetPath("/slider/hero-slider-11.jpg");

function renderWithEmail(template: string) {
  return template.split("{email}").map((part, i, arr) => (
    <span key={i}>
      {part}
      {i < arr.length - 1 && (
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/40"
        >
          {CONTACT_EMAIL}
        </a>
      )}
    </span>
  ));
}

export default function Returns() {
  const { t, tList } = useLanguage();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <EditorialInfoHero
        imageSrc={HERO_IMAGE}
        eyebrow={t("returns.heroEyebrow")}
        title={t("returns.title")}
        lead={t("returns.lead")}
        ctaTo="/products"
        ctaLabel={t("common.viewAllProducts")}
        loaded={pageLoaded}
      />

      <div className="container-padding mx-auto max-w-7xl py-12 lg:py-16">
        <section className="editorial-chapter mb-20 lg:mb-28">
          <EditorialSectionKicker label={t("returns.howTitle")} />
          <div className="mt-8 flex gap-4 md:mt-10 md:gap-5 lg:max-w-3xl">
            <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary md:mt-1.5 md:h-12 md:w-12">
              <ClipboardCheck className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-pretty text-base leading-[1.75] text-muted-foreground sm:text-lg">
                {renderWithEmail(t("returns.howText"))}
              </p>
            </div>
          </div>
        </section>

        <section className="editorial-chapter mb-20 lg:mb-28">
          <EditorialSectionKicker label={t("returns.conditionsTitle")} />
          <ul className="mt-8 m-0 max-w-3xl list-none space-y-3.5 p-0 text-pretty md:mt-10">
            {tList("returns.conditionsItems").map((item, idx) => (
              <li key={idx} className="text-base leading-[1.7] text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="editorial-chapter editorial-panel-soft mb-20 px-6 py-10 sm:px-10 sm:py-12 lg:mb-28 lg:px-14 lg:py-14">
          <div className="grid gap-12 md:grid-cols-2 md:items-start md:gap-0 md:divide-x md:divide-foreground/10">
            <div className="flex gap-4 md:gap-5 md:pr-10 lg:pr-12">
              <span className="mt-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary md:h-12 md:w-12">
                <CreditCard className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                <h2 className="font-editorial text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl">
                  {t("returns.refundTitle")}
                </h2>
                <p className="text-pretty text-base leading-[1.75] text-muted-foreground sm:text-[1.05rem]">
                  {t("returns.refundText")}
                </p>
              </div>
            </div>
            <div className="flex gap-4 border-t border-foreground/10 pt-10 md:border-t-0 md:pl-10 md:pt-0 lg:gap-5 lg:pl-12">
              <span className="mt-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary md:h-12 md:w-12">
                <AlertTriangle className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                <h2 className="font-editorial text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl">
                  {t("returns.damagedTitle")}
                </h2>
                <p className="text-pretty text-base leading-[1.75] text-muted-foreground sm:text-[1.05rem]">
                  {t("returns.damagedText")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-chapter border-t border-foreground/10 pt-12 lg:pt-16">
          <div className="flex flex-col items-center gap-4 border border-foreground/[0.08] bg-secondary/25 px-6 py-7 sm:flex-row sm:justify-center sm:gap-6 sm:px-8 sm:py-7">
            <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div className="text-center sm:text-left">
              <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                {t("common.email")}
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-pretty text-base font-medium text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/40"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
