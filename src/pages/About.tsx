import { Mail, MapPin, Scissors, Leaf, Home } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const CONTACT_EMAIL = "nook.textile@gmail.com";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto container-padding py-16">
      <div className="text-center mb-20">
        <p
          className="text-sm md:text-base uppercase tracking-widest mb-4 font-medium"
          style={{ color: "var(--muted-foreground)" }}
        >
          NOOK · BEOGRAD
        </p>
        <h1 className="heading-medium mb-6">{t("about.title")}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t("about.lead")}
        </p>
      </div>

      <div className="card mb-16 max-w-3xl mx-auto">
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6 leading-relaxed">
          <p className="text-lg">{t("about.p1")}</p>
          <p className="text-lg">{t("about.p2")}</p>
          <p
            className="text-lg font-medium"
            style={{ color: "var(--foreground)" }}
          >
            {t("about.p3")}
          </p>
        </div>
      </div>

      <h2 className="heading-medium text-center mb-12">
        {t("about.valuesTitle")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
        <div className="text-center group">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 text-primary-600 mb-6 transition-colors duration-300 shadow-soft">
            <Scissors className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-3">
            {t("about.value1Title")}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {t("about.value1Text")}
          </p>
        </div>
        <div className="text-center group">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 text-primary-600 mb-6 transition-colors duration-300 shadow-soft">
            <Leaf className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-3">
            {t("about.value2Title")}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {t("about.value2Text")}
          </p>
        </div>
        <div className="text-center group">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 text-primary-600 mb-6 transition-colors duration-300 shadow-soft">
            <Home className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-3">
            {t("about.value3Title")}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {t("about.value3Text")}
          </p>
        </div>
      </div>

      <div className="card max-w-3xl mx-auto">
        <h2 className="heading-medium mb-4">{t("about.contactTitle")}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {t("about.contactLead")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
              <Mail className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg">
                {t("common.email")}
              </h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-gray-600 hover:text-primary-600 transition-colors block"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-4 bg-primary-100 rounded-xl shadow-soft">
              <MapPin className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg">
                {t("about.basedIn")}
              </h3>
              <p className="text-gray-600">{t("about.basedInValue")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
