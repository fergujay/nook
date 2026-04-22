import { Truck, Package, MapPin, Mail, BadgePercent } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const CONTACT_EMAIL = "nook.textile@gmail.com";

export default function Courier() {
  const { t, tList } = useLanguage();

  const options = [
    {
      icon: Truck,
      title: t("courier.optionBelgradeTitle"),
      price: t("courier.optionBelgradePrice"),
      desc: t("courier.optionBelgradeDesc"),
      payment: t("courier.optionBelgradePayment"),
    },
    {
      icon: Package,
      title: t("courier.optionPostTitle"),
      price: t("courier.optionPostPrice"),
      desc: t("courier.optionPostDesc"),
      payment: t("courier.optionPostPayment"),
    },
    {
      icon: MapPin,
      title: t("courier.optionPickupTitle"),
      price: t("courier.optionPickupPrice"),
      desc: t("courier.optionPickupDesc"),
      payment: t("courier.optionPickupPayment"),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto container-padding py-16">
      <div className="text-center mb-20">
        <h1 className="heading-medium mb-6">{t("courier.title")}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t("courier.lead")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <div key={option.title} className="card-hover">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-medium leading-tight">
                  {option.title}
                </h3>
              </div>
              <p className="text-3xl font-bold text-primary-600 mb-3">
                {option.price}
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {option.desc}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {option.payment}
              </p>
            </div>
          );
        })}
      </div>

      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white rounded-xl shadow-soft">
            <BadgePercent className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-2xl font-medium">
            {t("courier.freeShippingTitle")}
          </h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">
          {t("courier.freeShippingText")}
        </p>
      </div>

      <div className="card mb-16">
        <h2 className="text-2xl font-medium mb-6">
          {t("courier.paymentsTitle")}
        </h2>
        <ul className="space-y-3">
          {tList("courier.paymentsItems").map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-primary-600 mt-1.5 font-bold">•</span>
              <span className="text-gray-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-2xl font-medium mb-4">
          {t("courier.questionsTitle")}
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed text-lg">
          {t("courier.questionsText")}
        </p>
        <div className="flex items-center gap-3 text-primary-700">
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
