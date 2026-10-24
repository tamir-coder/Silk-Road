# Silkroad

**Анги, хичээл бүрд зориулсан суралцах зам — ганц товшилтоор.**

## Асуудал

Монголын сурагчдад сурах бичгийн овоолго, үзэх сэдвийн жагсаалт өгдөг ч хамгийн
энгийн асуулт болох “Одоо би юу сурах вэ?” гэдэгт тодорхой хариулт байдаггүй.
Сайн сурдаг сурагчид мэдлэгээ хэрхэн гүнзгийрүүлэхээ мэдэхгүй, харин суралцахад
бэрхшээлтэй сурагчид хаанаас эхлэхээ олдоггүй. Одоо байгаа суралцах замын
хэрэгслүүд хөгжүүлэгчдэд зориулагдсан, англи хэл дээр, бас хэт төвөгтэй тул
9-р ангийн сурагч эхний алхмаа хийхээсээ өмнө шантрах нь бий.

## Бидний шийдэл

Silkroad бол сурагч бүрд сургуулийнхаа хичээлийг алхам алхмаар судлах энгийн
замнал гаргаж өгдөг erxes-ийн жижиг нэмэлт юм.

Хичээл, суралцах чиглэлээ сонгоод тодорхой нэг замаар урагшилна. Замнал нь нэг
шугаман дараалалтай: дуусгасан, одоо үзэж буй, дараа үзэх алхам. Зөвхөн одоогийн
алхам тодорч, юу сурахыг нэг энгийн өгүүлбэрээр тайлбарлана. Үргэлжлүүлэхэд ганц
товч байхад л хангалттай.

Явцаа хяна. Нэг алхмыг дуусгахад дараагийнх нь нээгдэж, ахицын зурвас дүүрнэ.

## Яагаад чухал вэ?

- Хэт их мэт санагдах сургалтын хөтөлбөрийг сурагч өнөөдөр хийж дуусгаж болох
  цөөн, жижиг алхам болгон хуваана.
- Олимпиад, элсэлтийн шалгалтад илүү гүнзгий бэлдэх хүсэлтэй сурагчдад туслахын
  зэрэгцээ бусдыг энэ чиглэлд хүчлэхгүй.
- Жижиг, нээлттэй эхтэй тул сургууль бүр өөрийн хичээл, ангиа нэмж чадна.

## Өнөөдөр бүтээсэн зүйл

Нэг анги, зарим хичээлийг хамарсан, явц хянах боломжтой замнал бүтээсэн. Мөн
сургуулийн хөтөлбөр болон олимпиадын чиглэлийн хооронд шилжих боломжтой. Шинэ
хичээл, анги нэмэхэд код шинээр бичихгүй, зөвхөн агуулга нэмэхэд хангалттай.

Сурагчид хичээл бүрдээ сурах материалын файл хавсаргаж болно. `.txt`, `.md`, эсвэл
`.csv` тэмдэглэл (30,000 хүртэл тэмдэгт)-ээ оруулахад тухайн сэдвүүдээс нь
суралцах алхмуудын хувийн дараалал үүсгэнэ. Дэмждэг бусад файлыг лавлах материал
болгон хавсаргана.

## Цаашдын боломж

Алхам бүрийн төгсгөлд богино сорил, багшийн хянах самбар, эцэг эхэд зориулсан
явцын харагдац нэмж болно. Эдгээрийг erxes Marketplace-ээр дамжуулан сургууль,
сургалтын төвүүд ашиглах боломжтой.

An erxes plugin that lives outside the erxes monorepo and joins an erxes stack.
The shared-library baseline is erxes 3.3.2. Dashed plugin names use the same
public permission identity in the API and UI; the host must support normalized
remote discovery and dashed page-module loading (see integration docs).

| Part   | Path         | Stack                                                                              | Dev port |
| ------ | ------------ | ---------------------------------------------------------------------------------- | -------- |
| API    | `api`        | Node.js 22, erxes-api-shared startPlugin + tenant-scoped Mongoose models (Node.js) | 3399     |
| UI     | `ui`         | React 18 Module Federation remote (Rspack), Tailwind CSS                           | 3099     |
| Shared | `erxes.json` | Plugin identity and ports read by both parts                                       |          |

The UI uses erxes's `erxes-ui`/`ui-modules` design system, installed from npm
(`@erxes/ui`, `@erxes/ui-modules`; see
[docs/erxes-integration.md](docs/erxes-integration.md#shared-libraries)). The
host supplies them at runtime via Module Federation singletons — they are
installed only so TypeScript and Rspack can resolve the imports.

## Develop

```sh
pnpm install
cp .env.example .env
pnpm run dev:api   # registers with the erxes gateway through Redis
pnpm run dev:ui    # serves http://localhost:3099/remoteEntry.js
```

`check`, `build` and `dev:ui` run `codegen` first, so the generated GraphQL
types always match the printed API schema.

In the erxes checkout `.env`, add the plugin and restart the gateway and
core-api so they pick it up:

```sh
ENABLED_PLUGINS=...,silk-road
```

Then open `http://localhost:3001/silk-road` (settings: `/silk-road/settings`).
Both processes must use the same Redis as erxes; `UI_ENTRY_URL` must be
reachable by the browser, not merely by the API container. Requests reach the
API through the gateway (`/graphql`), which forwards the signed-in user and
tenant. Those headers are not independently authenticated: keep the API on
a private gateway-only network and strip user/tenant headers at public ingress.

## Study file roadmap generation

Start a subject path, then upload notes from its Study materials panel. Text
notes are sent to the tenant-scoped API, which creates ordered topic nodes and
stores them with that student's roadmap. The original file remains in the erxes
file service. Uploading another text note for the same subject replaces the
generated steps and clears their completion marks; it does not change the
curated subject catalog. PDF, Office, and image files can still be attached,
but this version does not extract their contents.

## Scripts

| Script             | What it does                                    |
| ------------------ | ----------------------------------------------- |
| `pnpm run dev:api` | API in watch mode                               |
| `pnpm run dev:ui`  | UI remote dev server                            |
| `pnpm run codegen` | Print the API schema, generate UI GraphQL types |
| `pnpm run build`   | Production build of every part                  |
| `pnpm run check`   | Type-check every part                           |
| `pnpm run lint`    | oxlint                                          |
| `pnpm run fmt`     | oxfmt                                           |

## Deploy

- **API**: `docker build --build-arg UI_ENTRY_URL=<remoteEntry.js URL> -t <image> .`
  Run `pnpm install` first and commit its lockfile before building the image.
  The image serves the API on port 80 and registers itself on start
  (`plugin-silk-road-api:80` unless `LOAD_BALANCER_ADDRESS` is set).
- **UI**: upload `ui/dist` to a static host or CDN. Upload hashed assets
  first and `remoteEntry.js` last with `Cache-Control: no-store`. Without
  `UI_ENTRY_URL`, erxes falls back to `https://plugins.erxes.io/<release>/silk-road_ui/remoteEntry.js`;
  this generator does not upload there. Set your own browser-reachable URL,
  serve all emitted chunks with CORS for the erxes origin, and use immutable
  caching only for content-hashed assets (not stable-named expose chunks).

See [docs/erxes-integration.md](docs/erxes-integration.md) for how the plugin
plugs into erxes and [AGENTS.md](AGENTS.md) for the rules to keep it working.

# Silk-Road

# Silk-Road
