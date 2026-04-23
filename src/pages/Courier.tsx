import { Truck, Package, MapPin, Mail, BadgePercent, CreditCard } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import { getAssetPath } from "../utils/images";
import { EditorialInfoHero } from "../components/EditorialInfoHero";
import { EditorialSectionKicker } from "../components/EditorialSectionKicker";

const CONTACT_EMAIL = "nook.textile@gmail.com";

const HERO_IMAGE = getAssetPath("/slider/hero-slider-12.jpg");

const OPTION_CONFIG = [
  {
    id: "belgrade",
    icon: Truck,
    photo: getAssetPath("/slider/hero-slider-07.jpg"),
    titleKey: "courier.optionBelgradeTitle",
    priceKey: "courier.optionBelgradePrice",
    descKey: "courier.optionBelgradeDesc",
    paymentKey: "courier.optionBelgradePayment",
  },
  {
    id: "post",
    icon: Package,
    photo: getAssetPath("/products/1-reindeer-moss/main.jpg"),
    titleKey: "courier.optionPostTitle",
    priceKey: "courier.optionPostPrice",
    descKey: "courier.optionPostDesc",
    paymentKey: "courier.optionPostPayment",
  },
  {
    id: "pickup",
    icon: MapPin,
    photo: getAssetPath("/products/3-carrara-marble-napkins/main.jpg"),
    titleKey: "courier.optionPickupTitle",
    priceKey: "courier.optionPickupPrice",
    descKey: "courier.optionPickupDesc",
    paymentKey: "courier.optionPickupPayment",
  },
] as const;

function useRevealOnScroll(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isRevealed };
}

export default function Courier() {
  const { t, tList } = useLanguage();
  const [pageLoaded, setPageLoaded] = useState(false);
  const optionsReveal = useRevealOnScroll();
  const detailsReveal = useRevealOnScroll();
  const contactReveal = useRevealOnScroll();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const options = OPTION_CONFIG.map((cfg) => ({
    ...cfg,
    title: t(cfg.titleKey),
    price: t(cfg.priceKey),
    desc: t(cfg.descKey),
    payment: t(cfg.paymentKey),
  }));

  return (
    <>
      <EditorialInfoHero
        imageSrc={HERO_IMAGE}
        eyebrow={t("courier.heroEyebrow")}
        title={t("courier.title")}
        lead={t("courier.lead")}
        ctaTo="/products"
        ctaLabel={t("common.viewAllProducts")}
        loaded={pageLoaded}
      />

      <div className="container-padding mx-auto max-w-7xl py-12 lg:py-16">
        {/* Service menu — alternating rows, price as editorial anchor */}
        <section ref={optionsReveal.ref} className="editorial-chapter mb-20 lg:mb-28">
          <div
            className={`${
              optionsReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } transition-all duration-700`}
          >
            <EditorialSectionKicker label={t("courier.optionsTitle")} />
          </div>

          <div className="divide-y divide-foreground/[0.08] border-t border-foreground/[0.08]">
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <article
                  key={option.id}
                  className={`grid gap-8 border-b border-foreground/[0.08] py-10 transition-all duration-700 last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,10rem)] md:items-center md:gap-10 lg:gap-14 lg:py-14 ${
                    optionsReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 75}ms` }}
                >
                  <div className="relative aspect-[5/4] overflow-hidden border border-foreground/[0.06] sm:aspect-[16/10] md:aspect-auto md:h-52">
                    <img
                      src={option.photo}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-[1.1s] ease-out hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/25 via-transparent to-transparent"
                      aria-hidden
                    />
                  </div>

                  <div className="min-w-0 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                    </div>
                    <h2 className="font-editorial text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                      {option.title}
                    </h2>
                    <p className="max-w-xl text-pretty text-base leading-[1.75] text-muted-foreground">{option.desc}</p>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      {option.payment}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center border-t border-foreground/10 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8 lg:pl-10">
                    <p className="font-sans text-3xl font-medium tabular-nums tracking-tight text-primary sm:text-[2.15rem]">
                      {option.price}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Policy desk — single folio, two columns */}
        <section
          ref={detailsReveal.ref}
          className={`editorial-chapter editorial-panel-soft mb-20 px-6 py-10 sm:px-10 sm:py-12 lg:mb-28 lg:px-14 lg:py-14 ${
            detailsReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } transition-all duration-700`}
        >
          <EditorialSectionKicker className="mb-10" label={t("courier.detailsTitle")} />

          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-0 lg:divide-x lg:divide-foreground/10">
            <div className="flex items-start gap-4 md:gap-5 lg:pr-12">
              <span className="mt-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary md:h-12 md:w-12">
                <BadgePercent className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                <h3 className="font-editorial text-xl font-medium text-foreground sm:text-2xl">
                  {t("courier.freeShippingTitle")}
                </h3>
                <p className="text-pretty text-base leading-[1.75] text-muted-foreground sm:text-[1.05rem]">
                  {t("courier.freeShippingText")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:gap-5 lg:pl-12">
              <span className="mt-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary md:h-12 md:w-12">
                <CreditCard className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                <h3 className="font-editorial text-xl font-medium text-foreground sm:text-2xl">
                  {t("courier.paymentsTitle")}
                </h3>
                <ul className="m-0 list-none space-y-3.5 p-0 text-pretty">
                  {tList("courier.paymentsItems").map((item, idx) => (
                    <li key={idx} className="text-base leading-[1.7] text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Concierge line */}
        <section
          ref={contactReveal.ref}
          className={`editorial-chapter border-t border-foreground/10 pt-12 lg:pt-16 ${
            contactReveal.isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } transition-all duration-700`}
        >
          <EditorialSectionKicker className="mb-6" label={t("courier.questionsTitle")} />
          <p className="mb-10 max-w-2xl text-pretty text-base leading-[1.75] text-muted-foreground sm:text-lg">
            {t("courier.questionsText")}
          </p>
          <div className="flex flex-col gap-4 border border-foreground/[0.08] bg-secondary/25 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" aria-hidden />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                {t("common.email")}
              </span>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="break-all text-right text-base font-medium text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/40 sm:text-lg"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
