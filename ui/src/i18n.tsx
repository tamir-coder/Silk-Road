import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "mn" | "en";

const messages = {
  mn: {
    loading: "Ачаалж байна…",
    settings: "Тохиргоо",
    hero_eyebrow: "✳  ТАНЫ СУРАЛЦАХ ЗАМНАЛ",
    hero_title: "Анги, хичээл бүрд зориулсан суралцах зам — ганц товшилтоор.",
    hero_description:
      "Судлах хичээлээ сонгоод тодорхой замаар урагшлаарай. Silkroad олон сэдвийг жижиг алхамд хувааж, дараа нь юуг сурахыг тань тодорхой болгоно.",
    current_path: "ОДООГИЙН ЗАМНАЛ",
    steps_complete: "{done} / {total} алхам дууссан",
    path_progress: "Замналын явц {percent}%",
    error_network: "Сервертэй холбогдож чадсангүй. Холболтоо шалгаад дахин оролдоно уу.",
    error_auth: "Үргэлжлүүлэхийн тулд системд нэвтэрнэ үү.",
    error_forbidden: "Танд энэ үйлдлийг хийх эрх алга.",
    error_upload_size: "20 МБ-аас бага хэмжээтэй, хоосон биш файл сонгоно уу.",
    error_notes_length: "Текст тэмдэглэл 20-оос доошгүй, 30,000-аас ихгүй тэмдэгттэй байх ёстой.",
    error_upload: "Файл байршуулж чадсангүй. Дахин оролдоно уу.",
    error_attach: "Файл байршуулсан ч энэ замналд хавсаргаж чадсангүй: {reason}",
    try_again: "Дахин оролдоно уу.",
    error_open_path: "Суралцах замналыг нээж чадсангүй. Дахин оролдоно уу.",
    error_save_progress: "Явцыг хадгалж чадсангүй. Дахин оролдоно уу.",
    error_load_data: "Мэдээллийг ачаалж чадсангүй. Холболтоо шалгаад дахин оролдоно уу.",
    uploaded_note_description: "Оруулсан тэмдэглэлээсээ энэ санааг дахин судлаарай: {title}.",
    uploaded_note_activity:
      "“{title}” гэдгийг өөрийн үгээр тайлбарлаад, тэмдэглэлээсээ нэг жишээ олоорой.",
    retry: "Дахин оролдох",
    choose_subject: "Хичээлээ сонгоно уу",
    progress_saved_by_subject: "Явц болон сурах материал хичээл тус бүрээр хадгалагдана.",
    paths_started: "{count} замнал эхлүүлсэн",
    loading_paths: "Суралцах замналуудыг ачаалж байна…",
    no_paths: "Одоогоор суралцах замнал алга байна.",
    hours: "Ойролцоогоор {count} цаг",
    opening: "Нээж байна…",
    continue: "Үргэлжлүүлэх",
    start_path: "Замнал эхлүүлэх",
    generated_notes: "Тэмдэглэлээс үүсгэсэн",
    subject_roadmap: "{subject} хичээлийн замнал",
    roadmap_guidance: "Алхмуудыг дарааллаар нь үзэх эсвэл хүссэн сэдвээ дахин судлаарай.",
    lesson_details_open: "Хичээлийн дэлгэрэнгүйг үзэх",
    lesson_details_close: "Хичээлийн дэлгэрэнгүйг хаах",
    duration: "{minutes} минут",
    what_you_learn: "Юу сурах вэ?",
    lesson_detail_sentence:
      "Энэ ойлголтыг бодит жишээтэй холбож, хэрхэн ажилладгийг тайлбарлаарай.",
    visualize_topic: "Энэ сэдвийг дүрслэн судлах",
    phet: "PhET-ийн интерактив загвар хайх",
    geogebra: "GeoGebra дээр дүрслэн судлах",
    try_this: "Хийж үзээрэй: ",
    saving: "Хадгалж байна…",
    completed: "Дууссан",
    mark_complete: "Дуусгаснаар тэмдэглэх",
    previous_versions: "Өмнөх замналын хувилбарууд",
    history_description: "Шинэ тэмдэглэлээр замналаа шинэчлэхэд өмнөх алхмууд энд хадгалагдана.",
    history_summary: "{file} · {date} · {done}/{total} алхам дууссан",
    choose_subject_prompt: "Эхний суралцах замналаа эхлүүлэхийн тулд дээрээс хичээлээ сонгоно уу.",
    study_materials: "Сурах материал",
    study_materials_description:
      "Тэмдэглэл оруулж замнал үүсгэх эсвэл бусад файлыг сурах материал болгон хавсаргаарай.",
    processing: "Боловсруулж байна…",
    upload_file: "Файл оруулах",
    no_materials: "Одоогоор материал алга. Сурах зүйлсээ нэг дор хадгалахын тулд файл оруулна уу.",
    upload_help:
      "TXT, MD, CSV тэмдэглэлийн (30,000 хүртэл тэмдэгт) сэдвүүдээс алхамчилсан замнал үүсгэнэ. PDF, Office болон зургийн файлыг лавлах материал болгон хадгална. Файлын дээд хэмжээ: 20 МБ.",
    file_mb: "МБ",
    file_kb: "КБ",
    settings_title: "Silkroad-ын тохиргоо",
    back_to_app: "Silkroad руу буцах",
    settings_general: "Ерөнхий",
    settings_identity_description:
      "Нэмэлтийн таних мэдээллийг erxes.json файлаас авна. Өөрчлөлт оруулсны дараа дахин эхлүүлнэ үү.",
    identity_name: "Нэр",
    identity_route: "Хаяг",
    identity_remote: "Алсын холбоос",
    identity_api: "API",
    identity_version: "Хувилбар",
    plugin_settings: "Тохиргоо",
    plugin_settings_description: "Silkroad-ын нэмэлт тохиргоонууд энд харагдана.",
    no_settings: "Тохиргоо хараахан алга",
    no_settings_description: "Одоогоор тохируулах нэмэлт зүйл байхгүй байна.",
    language_label: "Хэл сонгох",
    language_mongolian: "Монгол",
    language_english: "English",
  },
  en: {
    loading: "Loading…",
    settings: "Settings",
    hero_eyebrow: "✳  YOUR LEARNING JOURNEY",
    hero_title: "A learning path for every subject and grade, in one click.",
    hero_description:
      "Choose a subject and follow a clear route. Silkroad turns a long list of topics into small steps, so you always know what to study next.",
    current_path: "CURRENT PATH",
    steps_complete: "{done} / {total} steps complete",
    path_progress: "{percent}% of the path",
    error_network: "Could not connect to the server. Check your connection and try again.",
    error_auth: "Sign in to continue.",
    error_forbidden: "You do not have permission to do that.",
    error_upload_size: "Choose a non-empty file smaller than 20 MB.",
    error_notes_length: "Text notes must contain 20–30,000 characters.",
    error_upload: "The file could not be uploaded. Please try again.",
    error_attach: "The file uploaded, but could not be attached to this path: {reason}",
    try_again: "Please try again.",
    error_open_path: "Could not open this learning path. Please try again.",
    error_save_progress: "Could not save your progress. Please try again.",
    error_load_data: "Could not load your information. Check your connection and try again.",
    uploaded_note_description: "Review this idea from your uploaded notes: {title}.",
    uploaded_note_activity:
      "Explain “{title}” in your own words, then find one example in your notes.",
    retry: "Retry",
    choose_subject: "Choose a subject",
    progress_saved_by_subject:
      "Your progress and study materials are saved separately for each subject.",
    paths_started: "{count} paths started",
    loading_paths: "Loading learning paths…",
    no_paths: "There are no learning paths available right now.",
    hours: "About {count} hours",
    opening: "Opening…",
    continue: "Continue",
    start_path: "Start path",
    generated_notes: "Built from your notes",
    subject_roadmap: "{subject} learning path",
    roadmap_guidance: "Follow the steps in order, or revisit any topic whenever you need.",
    lesson_details_open: "Open lesson details",
    lesson_details_close: "Hide lesson details",
    duration: "{minutes} min",
    what_you_learn: "What you’ll learn",
    lesson_detail_sentence: "Connect this idea to a real example and explain how it works.",
    visualize_topic: "Visualize this topic",
    phet: "Find an interactive PhET simulation",
    geogebra: "Explore it in GeoGebra",
    try_this: "Try this: ",
    saving: "Saving…",
    completed: "Completed",
    mark_complete: "Mark complete",
    previous_versions: "Previous path versions",
    history_description: "When new notes update your path, your earlier steps stay saved here.",
    history_summary: "{file} · {date} · {done}/{total} steps complete",
    choose_subject_prompt: "Choose a subject above to start your first learning path.",
    study_materials: "Study materials",
    study_materials_description:
      "Upload notes to build a learning path, or attach other files as study materials.",
    processing: "Processing…",
    upload_file: "Upload a file",
    no_materials: "No materials yet. Upload a file to keep your study resources in one place.",
    upload_help:
      "TXT, MD, and CSV notes (up to 30,000 characters) generate a step-by-step path from their topics. PDF, Office, and image files are saved here as references. Maximum file size: 20 MB.",
    file_mb: "MB",
    file_kb: "KB",
    settings_title: "Silkroad settings",
    back_to_app: "Back to Silkroad",
    settings_general: "General",
    settings_identity_description:
      "Plugin identity comes from erxes.json. Make changes there, then restart.",
    identity_name: "Name",
    identity_route: "Route",
    identity_remote: "Remote",
    identity_api: "API",
    identity_version: "Version",
    plugin_settings: "Settings",
    plugin_settings_description: "Additional Silkroad settings will appear here.",
    no_settings: "No settings yet",
    no_settings_description: "There are no additional settings to configure yet.",
    language_label: "Choose language",
    language_mongolian: "Монгол",
    language_english: "English",
  },
} as const;

export type TranslationKey = keyof typeof messages.mn;
type TranslationValues = Record<string, string | number>;

export const translate = (
  language: Language,
  key: TranslationKey,
  values: TranslationValues = {},
) =>
  Object.entries(values).reduce(
    (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
    messages[language][key] as string,
  );

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "mn";
  }

  try {
    return window.localStorage.getItem("silkroad-language") === "en" ? "en" : "mn";
  } catch {
    return "mn";
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    try {
      window.localStorage.setItem("silkroad-language", language);
    } catch {
      // Keep the selected language for this session when storage is unavailable.
    }
  }, [language]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: (key, values) => translate(language, key, values),
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
};
