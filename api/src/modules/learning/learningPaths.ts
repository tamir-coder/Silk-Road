export interface ILearningStep {
  id: string;
  title: string;
  description: string;
  minutes: number;
  activity: string;
}

export interface ILearningSubject {
  id: string;
  name: string;
  description: string;
  gradeRange: string;
  hours: number;
  steps: ILearningStep[];
}

const cleanTopic = (line: string) =>
  line
    .replace(/^\s*(?:#{1,6}\s*|[-*+]\s+|\d+[.)]\s*)/, "")
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/, "")
    .trim();

/** Build a small, ordered study path from headings and meaningful note lines. */
export const buildStepsFromStudyNotes = (content: string): ILearningStep[] => {
  const lines = content
    .replace(/\r/g, "")
    .split("\n")
    .map(cleanTopic)
    .filter((line) => line.length >= 4 && line.length <= 140);
  const topics = [...new Set(lines)].slice(0, 8);
  const fallbacks = content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map(cleanTopic)
    .filter((line) => line.length >= 12 && line.length <= 140);
  const selectedTopics = topics.length >= 2 ? topics : [...new Set(fallbacks)].slice(0, 8);

  return selectedTopics.map((title, index) => ({
    id: `notes-${index + 1}-${
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 48) || "topic"
    }`,
    title,
    description: `Оруулсан тэмдэглэлээсээ энэ санааг дахин судлаарай: ${title}.`,
    minutes: 15 + Math.min(20, Math.ceil(title.length / 8)),
    activity: `“${title}” гэдгийг өөрийн үгээр тайлбарлаад, тэмдэглэлээсээ нэг жишээ олоорой.`,
  }));
};

export const LEARNING_SUBJECTS: ILearningSubject[] = [
  {
    id: "mathematics",
    name: "Математик",
    description: "Тоон ойлголт, тэгшитгэл, графикийг ойлгож, математикийн итгэлээ нэмэгдүүлээрэй.",
    gradeRange: "6–12-р анги",
    hours: 6,
    steps: [
      {
        id: "math-number-sense",
        title: "Тооны ойлголт",
        description: "Бүхэл тоо, үржигдэхүүн, үржвэрийн талаар ойлголтоо бататгана.",
        minutes: 25,
        activity: "Тоонуудыг харьцуулж, хялбарчлах дасгал хийгээрэй.",
      },
      {
        id: "math-fractions",
        title: "Бутархай ба хувь",
        description: "Энгийн бутархай, аравтын бутархай, харьцаа, хувийг хооронд нь холбоно.",
        minutes: 30,
        activity: "Өдөр тутмын харьцаа, хувийн бодлого бодоорой.",
      },
      {
        id: "math-expressions",
        title: "Алгебрын илэрхийлэл",
        description: "Үйлдлийн дарааллыг ашиглан илэрхийллийг хялбарчилж сурна.",
        minutes: 30,
        activity: "Үгээр өгсөн хэдэн бодлогыг алгебрын илэрхийлэл болгон бичээрэй.",
      },
      {
        id: "math-equations",
        title: "Тэгшитгэл бодох",
        description: "Тэгшитгэлийн хоёр талыг тэнцүү хадгалан үл мэдэгдэх тоог олно.",
        minutes: 35,
        activity: "Эхлээд нэг үйлдэлтэй, дараа нь хоёр үйлдэлтэй тэгшитгэл бодоорой.",
      },
      {
        id: "math-graphs",
        title: "График ба зүй тогтол",
        description: "Координатыг уншиж, хэмжигдэхүүнүүд хэрхэн хамт өөрчлөгдөхийг ажиглана.",
        minutes: 35,
        activity: "Энгийн зүй тогтлыг графикт дүрслээд юуг харуулж байгааг тайлбарлаарай.",
      },
    ],
  },
  {
    id: "english",
    name: "Англи хэл",
    description: "Хэлзүй, үгийн сан, унших болон бичих чадвараа хөгжүүлнэ.",
    gradeRange: "5–12-р анги",
    hours: 5,
    steps: [
      {
        id: "english-sentences",
        title: "Өгүүлбэрийн үндэс",
        description: "Өгүүлбэрийн эзэн, үйл үг болон бүрэн санааг таньж сурна.",
        minutes: 25,
        activity: "Өгөгдсөн үгсээр утга ойлгомжтой өгүүлбэр бүтээгээрэй.",
      },
      {
        id: "english-tenses",
        title: "Үйл үгийн цаг",
        description: "Үйл явдал хэзээ болж байгааг зөв цагийн хэлбэрээр илэрхийлнэ.",
        minutes: 30,
        activity: "Богино өгүүллэгийг өнгөрсөн болон одоо цагт дахин бичээрэй.",
      },
      {
        id: "english-vocabulary",
        title: "Хам сэдвээс үгийн утга олох",
        description: "Шинэ үгийн утгыг өгүүлбэрийн хам сэдэв болон бүтцээр нь таамаглана.",
        minutes: 25,
        activity: "Толь бичиг харахаасаа өмнө танихгүй үгийн утгыг таамаглаарай.",
      },
      {
        id: "english-reading",
        title: "Уншиж ойлгох",
        description: "Гол санааг олж, эхийн баримтаар бататгаж сурна.",
        minutes: 35,
        activity: "Богино эхийг хоёр өгүүлбэрээр хураангуйлаарай.",
      },
      {
        id: "english-writing",
        title: "Ойлгомжтой догол мөр бичих",
        description: "Сэдвийн өгүүлбэр, баримт, тайлбарыг зөв дарааллаар зохион байгуулна.",
        minutes: 35,
        activity: "Нэг санаанд төвлөрсөн догол мөр бичээд засварлаарай.",
      },
    ],
  },
  {
    id: "physics",
    name: "Физик",
    description: "Хөдөлгөөн, хүч, энерги, цахилгаан хэлхээг ойлгож судална.",
    gradeRange: "8–12-р анги",
    hours: 6,
    steps: [
      {
        id: "physics-measurements",
        title: "Хэмжигдэхүүн ба нэгж",
        description: "Хэмжигдэхүүн, нэгж болон шинжлэх ухааны хялбар тэмдэглэгээг уншиж сурна.",
        minutes: 25,
        activity: "Хэмжих нэгжийг хөрвүүлж, хариулт бүрийн нэгжийг бичээрэй.",
      },
      {
        id: "physics-motion",
        title: "Хөдөлгөөнийг дүрслэх",
        description: "Зам, хугацаа, хурд болон энгийн графикийн хамаарлыг ойлгоно.",
        minutes: 30,
        activity: "График ашиглан хоёр биетийн хөдөлгөөнийг харьцуулаарай.",
      },
      {
        id: "physics-forces",
        title: "Хүч",
        description: "Тэнцвэржсэн хүч болон хөдөлгөөний өөрчлөлтийг ойлгоно.",
        minutes: 35,
        activity: "Өдөр тутмын нэг биетэд үйлчлэх хүчний бүдүүвч зураарай.",
      },
      {
        id: "physics-energy",
        title: "Энергийн хувирал ба дамжуулалт",
        description: "Энерги хэрхэн хувирч, биетүүдийн хооронд дамжихыг судална.",
        minutes: 30,
        activity: "Танил төхөөрөмж доторх энергийн хувирлыг зургаар үзүүлээрэй.",
      },
      {
        id: "physics-circuits",
        title: "Энгийн цахилгаан хэлхээ",
        description: "Цахилгаан гүйдэл, хүчдэл болон хэлхээний бүрэлдэхүүн хэсгийг судална.",
        minutes: 35,
        activity: "Хэлхээний зураг гаргаад өөрчлөлт оруулахад юу болохыг таамаглаарай.",
      },
    ],
  },
  {
    id: "chemistry",
    name: "Хими",
    description: "Атом, үелэх систем, химийн урвалыг ойлгож судална.",
    gradeRange: "8–12-р анги",
    hours: 6,
    steps: [
      {
        id: "chem-matter",
        title: "Бодис ба бөөмс",
        description: "Бөөмийн загвараар хатуу, шингэн, хийн төлөвийг харьцуулна.",
        minutes: 25,
        activity: "Төлөвийн өөрчлөлтийг бөөмийн зургаар тайлбарлаарай.",
      },
      {
        id: "chem-atoms",
        title: "Атом ба химийн элемент",
        description: "Протон, нейтрон, электрон болон химийн элементүүдийг танина.",
        minutes: 30,
        activity: "Үелэх системийн нэг нүдэн дэх мэдээллийг уншаарай.",
      },
      {
        id: "chem-periodic",
        title: "Үелэх системийн зүй тогтол",
        description: "Бүлэг, үе болон элементийн шинж чанарын зүй тогтлыг олно.",
        minutes: 30,
        activity: "Нэг бүлгийн хоёр элементийг харьцуулаарай.",
      },
      {
        id: "chem-bonding",
        title: "Атомын химийн холбоо",
        description: "Атом яагаад ионы болон ковалент холбоо үүсгэдгийг судална.",
        minutes: 35,
        activity: "Молекул эсвэл ионы нэгдлийн энгийн загвар зураарай.",
      },
      {
        id: "chem-reactions",
        title: "Химийн урвал",
        description: "Урвалд орох бодис, бүтээгдэхүүн болон атом хадгалагдах хуулийг танина.",
        minutes: 35,
        activity: "Атом бүрийг тоолж, энгийн урвалын тэгшитгэлийг тэнцүүлээрэй.",
      },
    ],
  },
  {
    id: "biology",
    name: "Биологи",
    description: "Эс, амьд биеийн тогтолцоо, экосистемийг судална.",
    gradeRange: "6–12-р анги",
    hours: 5,
    steps: [
      {
        id: "biology-life",
        title: "Амьд биеийн нийтлэг шинж",
        description: "Амьд биетүүдэд нийтлэг байдаг шинж чанарыг танина.",
        minutes: 20,
        activity: "Жишээнүүдийг ангилж, учир шалтгааныг тайлбарлаарай.",
      },
      {
        id: "biology-cells",
        title: "Эс",
        description: "Эсийн бүтцийг таньж, хэсэг бүр ямар үүрэгтэйг ойлгоно.",
        minutes: 30,
        activity: "Эсийн бүтцийг нэрлэж, хэсэг бүрийг үүрэгтэй нь холбоорой.",
      },
      {
        id: "biology-systems",
        title: "Эрхтэн тогтолцоо",
        description: "Эрхтнүүд хэрхэн хамтран ажилладгийг судална.",
        minutes: 30,
        activity: "Хүчилтөрөгч биеэр хэрхэн дамждагийг мөрдөн тайлбарлаарай.",
      },
      {
        id: "biology-genetics",
        title: "Удамшил",
        description: "Шинж тэмдэг эцэг эхээс үр удамд хэрхэн дамждагийг судална.",
        minutes: 30,
        activity: "Энгийн загвар ашиглан удамших боломжтой шинжийг таамаглаарай.",
      },
      {
        id: "biology-ecosystems",
        title: "Экосистем",
        description: "Идэш тэжээлийн сүлжээ болон орчноор дамжуулан амьд биесийн холбоог ойлгоно.",
        minutes: 30,
        activity: "Идэш тэжээлийн сүлжээ зураад нэг өөрчлөлт гарахад юу болохыг таамаглаарай.",
      },
    ],
  },
  {
    id: "mongolian",
    name: "Монгол хэл",
    description: "Унших, хэлзүй, санаагаа ойлгомжтой илэрхийлэх чадвараа хөгжүүлнэ.",
    gradeRange: "5–12-р анги",
    hours: 5,
    steps: [
      {
        id: "mongolian-reading",
        title: "Зорилготой унших",
        description: "Эхийн сэдэв, гол санаа, чухал дэлгэрэнгүй мэдээллийг олно.",
        minutes: 25,
        activity: "Богино эхийн гол санааг нэг өгүүлбэрээр бичээрэй.",
      },
      {
        id: "mongolian-words",
        title: "Үгийн аймаг",
        description:
          "Нэр үг, үйл үг, тодотгол зэрэг үгийн аймаг өгүүлбэрт хэрхэн үүрэгтэйг танина.",
        minutes: 25,
        activity: "Догол мөрөөс чухал үгийн аймгуудыг ялган тэмдэглээрэй.",
      },
      {
        id: "mongolian-sentences",
        title: "Өгүүлбэрийн бүтэц",
        description: "Ойлгомжтой өгүүлбэр зохиож, санаануудыг учир зүйн холбоотой илэрхийлнэ.",
        minutes: 30,
        activity: "Богино өгүүлбэрүүдийг утгыг нь өөрчлөхгүйгээр нэгтгээрэй.",
      },
      {
        id: "mongolian-evidence",
        title: "Баримтаар тайлбарлах",
        description: "Тайлбар, дүгнэлтээ эхийн дэлгэрэнгүй мэдээллээр батална.",
        minutes: 30,
        activity: "Нэг баримт сонгоод санааг тань хэрхэн дэмжиж байгааг тайлбарлаарай.",
      },
      {
        id: "mongolian-writing",
        title: "Төлөвлөж бичих",
        description: "Эхлэл, гол санаа, дүгнэлтээ зөв дарааллаар зохион байгуулна.",
        minutes: 35,
        activity: "Өгсөн даалгаврын дагуу богино хариулт төлөвлөж бичээрэй.",
      },
    ],
  },
];

export const getLearningSubject = (subjectId: string) =>
  LEARNING_SUBJECTS.find((subject) => subject.id === subjectId);
