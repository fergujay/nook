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

export default function Privacy() {
  const { t, tList } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto container-padding py-16">
      <div className="mb-12">
        <h1 className="heading-medium font-serif tracking-[-0.02em] mb-6 text-foreground">
          {t("privacy.title")}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {t("privacy.intro")}
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-10 text-gray-700">
        <section>
          <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] mb-3 text-foreground">
            {t("privacy.dataCollectTitle")}
          </h2>
          <p className="leading-relaxed mb-3">
            {t("privacy.dataCollectIntro")}
          </p>
          <ul className="space-y-2">
            {tList("privacy.dataCollectItems").map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-primary-600 mt-1.5 font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] mb-3 text-foreground">
            {t("privacy.dataUseTitle")}
          </h2>
          <p className="leading-relaxed mb-3">{t("privacy.dataUseIntro")}</p>
          <ul className="space-y-2 mb-3">
            {tList("privacy.dataUseItems").map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-primary-600 mt-1.5 font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed">{t("privacy.dataUseOutro")}</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] mb-3 text-foreground">
            {t("privacy.marketingTitle")}
          </h2>
          <p className="leading-relaxed">{t("privacy.marketingText")}</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] mb-3 text-foreground">
            {t("privacy.sharingTitle")}
          </h2>
          <p className="leading-relaxed mb-3">{t("privacy.sharingIntro")}</p>
          <ul className="space-y-2 mb-3">
            {tList("privacy.sharingItems").map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-primary-600 mt-1.5 font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed font-medium">
            {t("privacy.sharingOutro")}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] mb-3 text-foreground">
            {t("privacy.storageTitle")}
          </h2>
          <p className="leading-relaxed">{t("privacy.storageText")}</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] mb-3 text-foreground">
            {t("privacy.rightsTitle")}
          </h2>
          <p className="leading-relaxed mb-3">{t("privacy.rightsIntro")}</p>
          <ul className="space-y-2 mb-3">
            {tList("privacy.rightsItems").map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-primary-600 mt-1.5 font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed">
            {renderWithEmail(t("privacy.rightsOutro"))}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] mb-3 text-foreground">
            {t("privacy.cookiesTitle")}
          </h2>
          <p className="leading-relaxed">{t("privacy.cookiesText")}</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] mb-3 text-foreground">
            {t("privacy.contactTitle")}
          </h2>
          <p className="leading-relaxed">
            {renderWithEmail(t("privacy.contactText"))}
          </p>
        </section>
      </div>
    </div>
  );
}
