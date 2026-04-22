import { useLanguage } from "../contexts/LanguageContext";

const CONTACT_EMAIL = "nook.textile@gmail.com";

function renderWithEmail(template: string) {
  return template.split("{email}").map((part, i, arr) => (
    <span key={i}>
      {part}
      {i < arr.length - 1 && (
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-primary-600 hover:text-primary-700 font-medium underline"
        >
          {CONTACT_EMAIL}
        </a>
      )}
    </span>
  ));
}

export default function Terms() {
  const { t, tList } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto container-padding py-16">
      <div className="mb-12">
        <h1 className="heading-medium mb-6">{t("terms.title")}</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {t("terms.intro")}
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-10 text-gray-700">
        <section>
          <h2 className="text-2xl font-medium mb-3">
            {t("terms.ordersTitle")}
          </h2>
          <p className="leading-relaxed">{t("terms.ordersText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-3">
            {t("terms.pricingTitle")}
          </h2>
          <p className="leading-relaxed">{t("terms.pricingText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-3">
            {t("terms.paymentTitle")}
          </h2>
          <p className="leading-relaxed mb-3">{t("terms.paymentIntro")}</p>
          <ul className="space-y-2 mb-3">
            {tList("terms.paymentItems").map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-primary-600 mt-1.5 font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed">{t("terms.paymentOutro")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-3">
            {t("terms.deliveryTitle")}
          </h2>
          <p className="leading-relaxed">{t("terms.deliveryText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-3">
            {t("terms.returnsTitle")}
          </h2>
          <p className="leading-relaxed">{t("terms.returnsText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-3">
            {t("terms.productTitle")}
          </h2>
          <p className="leading-relaxed">{t("terms.productText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-3">
            {t("terms.liabilityTitle")}
          </h2>
          <p className="leading-relaxed">{t("terms.liabilityText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-3">
            {t("terms.changesTitle")}
          </h2>
          <p className="leading-relaxed">{t("terms.changesText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-medium mb-3">
            {t("terms.contactTitle")}
          </h2>
          <p className="leading-relaxed">
            {renderWithEmail(t("terms.contactText"))}
          </p>
        </section>
      </div>
    </div>
  );
}
