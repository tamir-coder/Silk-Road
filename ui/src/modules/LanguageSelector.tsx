import { useLanguage } from "../i18n";

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <select
      aria-label={t("language_label")}
      className="sr-language-select"
      value={language}
      onChange={(event) => setLanguage(event.target.value === "en" ? "en" : "mn")}
    >
      <option value="mn">{t("language_mongolian")}</option>
      <option value="en">{t("language_english")}</option>
    </select>
  );
};
