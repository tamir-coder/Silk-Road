import { IconAdjustments, IconSandbox, IconSettings } from "@tabler/icons-react";
import { Breadcrumb, Button, Card, Empty, Separator } from "erxes-ui";
import { PageHeader } from "ui-modules";
import { Link } from "react-router";
import manifest from "../../../erxes.json" with { type: "json" };
import { useLanguage } from "../i18n";
import { LanguageSelector } from "../modules/LanguageSelector";

const { path } = manifest.ui;

const IDENTITY: [
  "identity_name" | "identity_route" | "identity_remote" | "identity_api" | "identity_version",
  string,
][] = [
  ["identity_name", manifest.name],
  ["identity_route", `/${path}`],
  ["identity_remote", manifest.ui.remote],
  ["identity_api", `:${manifest.api.port}${manifest.api.graphql}`],
  ["identity_version", manifest.version],
];

export const SettingsPage = () => {
  const { language, t } = useLanguage();

  return (
    <div className="silkroad:flex silkroad:h-full silkroad:flex-col" lang={language}>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="silkroad:gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to={`/${path}/settings`}>
                    <IconSettings />
                    {t("settings_title")}
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton
            breadcrumb={[manifest.title, t("settings")]}
            icon="IconSettings"
          />
        </PageHeader.Start>
        <PageHeader.End>
          <div className="silkroad:flex silkroad:items-center silkroad:gap-2">
            <LanguageSelector />
            <Button variant="outline" asChild>
              <Link to={`/${path}`}>
                <IconSandbox />
                {t("back_to_app")}
              </Link>
            </Button>
          </div>
        </PageHeader.End>
      </PageHeader>
      <div className="silkroad:flex-1 silkroad:overflow-auto">
        <div className="silkroad:mx-auto silkroad:flex silkroad:w-full silkroad:max-w-3xl silkroad:flex-col silkroad:gap-6 silkroad:p-6">
          <Card>
            <Card.Header>
              <Card.Title>{t("settings_general")}</Card.Title>
              <Card.Description>{t("settings_identity_description")}</Card.Description>
            </Card.Header>
            <Card.Content>
              <dl className="silkroad:grid silkroad:grid-cols-[8rem_1fr] silkroad:gap-y-2 silkroad:text-sm">
                {IDENTITY.map(([label, value]) => (
                  <div key={label} className="silkroad:contents">
                    <dt className="silkroad:text-muted-foreground">{t(label)}</dt>
                    <dd>
                      <code className="silkroad:rounded silkroad:bg-muted silkroad:px-1.5 silkroad:py-0.5 silkroad:font-mono silkroad:text-xs">
                        {value}
                      </code>
                    </dd>
                  </div>
                ))}
              </dl>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>{t("plugin_settings")}</Card.Title>
              <Card.Description>{t("plugin_settings_description")}</Card.Description>
            </Card.Header>
            <Card.Content>
              <Empty>
                <Empty.Header>
                  <Empty.Media variant="icon">
                    <IconAdjustments />
                  </Empty.Media>
                  <Empty.Title>{t("no_settings")}</Empty.Title>
                  <Empty.Description>{t("no_settings_description")}</Empty.Description>
                </Empty.Header>
              </Empty>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};
