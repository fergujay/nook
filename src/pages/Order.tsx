import { Link } from 'react-router-dom'
import { ArrowRight, Package, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { EditorialInfoHero } from '../components/EditorialInfoHero'
import { EditorialSectionKicker } from '../components/EditorialSectionKicker'
import { getAssetPath } from '../utils/images'

const ORDER_HERO_IMAGE = getAssetPath('/slider/hero-slider-05.jpg')

function useRevealOnScroll(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          observer.unobserve(element)
        }
      },
      { threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isRevealed }
}

export default function Order() {
  const { t, language } = useLanguage()
  const dateLocale = language === 'sr' ? 'sr-RS' : 'en-GB'
  const [pageLoaded, setPageLoaded] = useState(false)
  const detailsReveal = useRevealOnScroll()
  const nextReveal = useRevealOnScroll()

  const orderSuffix = useMemo(
    () => String(Math.floor(Math.random() * 900) + 100),
    [],
  )
  const orderNumber = `NOOK-${new Date().getFullYear()}-${orderSuffix}`

  const orderDate = useMemo(
    () => new Date().toLocaleDateString(dateLocale),
    [dateLocale],
  )
  const estimatedDelivery = useMemo(
    () =>
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
        dateLocale,
      ),
    [dateLocale],
  )

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <EditorialInfoHero
        imageSrc={ORDER_HERO_IMAGE}
        eyebrow={t('order.heroEyebrow')}
        title={t('order.confirmed')}
        lead={t('order.thankYou')}
        ctaTo="/products"
        ctaLabel={t('common.continueShopping')}
        loaded={pageLoaded}
      />

      <div className="container-padding mx-auto max-w-7xl py-12 lg:py-16">
        <section
          ref={detailsReveal.ref}
          className={`editorial-chapter mb-16 lg:mb-20 ${
            detailsReveal.isRevealed
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          } transition-all duration-700`}
        >
          <EditorialSectionKicker
            className="mb-8 lg:mb-10"
            preline={t('order.heroEyebrow')}
            label={t('order.orderDetails')}
          />

          <div className="editorial-panel-soft px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-11">
            <div className="mb-6 flex items-start gap-4 border-b border-foreground/[0.08] pb-6">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-foreground/10 bg-secondary/50 text-primary">
                <Package className="h-5 w-5" aria-hidden />
              </span>
              <p className="max-w-2xl text-pretty text-base leading-[1.75] text-muted-foreground">
                {t('order.detailsLead')}
              </p>
            </div>

            <dl className="divide-y divide-foreground/[0.08]">
              <div className="grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-10">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {t('order.orderNumber')}
                </dt>
                <dd className="font-editorial text-lg font-medium tabular-nums text-foreground sm:text-right sm:text-xl">
                  #{orderNumber}
                </dd>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-10">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {t('order.orderDate')}
                </dt>
                <dd className="font-medium tabular-nums text-foreground sm:text-right">
                  {orderDate}
                </dd>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-10">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {t('order.estimatedDelivery')}
                </dt>
                <dd className="font-medium tabular-nums text-foreground sm:text-right">
                  {estimatedDelivery}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          ref={nextReveal.ref}
          className={`editorial-chapter editorial-panel-soft px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 ${
            nextReveal.isRevealed
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          } transition-all duration-700`}
        >
          <EditorialSectionKicker
            className="mb-8 lg:mb-10"
            label={t('order.whatsNext')}
          />
          <p className="mb-10 max-w-2xl text-pretty text-base leading-[1.75] text-muted-foreground sm:text-lg">
            {t('order.whatsNextText')}
          </p>

          <div className="flex flex-col gap-4 border-t border-foreground/10 pt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <Link
              to="/products"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 text-center"
            >
              <ShoppingBag className="h-5 w-5 shrink-0" aria-hidden />
              {t('common.continueShopping')}
            </Link>
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-primary link-underline"
            >
              {t('order.backToHome')}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
