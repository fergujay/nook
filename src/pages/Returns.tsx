import { Mail, RotateCcw, AlertTriangle, CreditCard, ClipboardCheck } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const CONTACT_EMAIL = "nook.textile@gmail.com";

export default function Returns() {
  const { t, tList } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto container-padding py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 text-primary-600 mb-6 shadow-soft">
          <RotateCcw className="h-10 w-10" />
        </div>
        <h1 className="heading-medium mb-6">{t("returns.title")}</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {t("returns.lead")}
        </p>
      </div>

      <div className="space-y-8">
        <section className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-primary-100 rounded-xl">
              <ClipboardCheck className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-medium">{t("returns.howTitle")}</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            {t("returns.howText")
              .split("{email}")
              .map((part, i, arr) => (
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
              ))}
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-medium mb-4">
            {t("returns.conditionsTitle")}
          </h2>
          <ul className="space-y-3">
            {tList("returns.conditionsItems").map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-primary-600 mt-1.5 font-bold">•</span>
                <span className="text-gray-700 leading-relaxed text-lg">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-primary-100 rounded-xl">
              <CreditCard className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-medium">{t("returns.refundTitle")}</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            {t("returns.refundText")}
          </p>
        </section>

        <section className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-white rounded-xl shadow-soft">
              <AlertTriangle className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-medium">
              {t("returns.damagedTitle")}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            {t("returns.damagedText")}
          </p>
        </section>

        <div className="flex items-center gap-3 justify-center pt-4 text-primary-700">
          <Mail className="h-5 w-5" />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold hover:text-primary-800 transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
