import { useMutation, useQuery } from "@apollo/client";
import {
  IconArrowRight,
  IconBook,
  IconCheck,
  IconClock,
  IconFileText,
  IconSettings,
} from "@tabler/icons-react";
import { Badge, Breadcrumb, Button, Card, Separator } from "erxes-ui";
import { REACT_APP_API_URL } from "erxes-ui";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import manifest from "../../../erxes.json" with { type: "json" };
import { ENGLISH_LEARNING_CONTENT } from "../englishLearningContent";
import { translate, useLanguage, type Language } from "../i18n";
import { LanguageSelector } from "../modules/LanguageSelector";
import {
  ADD_STUDY_FILE_MUTATION,
  CREATE_ROADMAP_FROM_STUDY_FILE_MUTATION,
  LEARNING_SUBJECTS_QUERY,
  MY_ROADMAPS_QUERY,
  SET_STEP_COMPLETION_MUTATION,
  START_ROADMAP_MUTATION,
} from "../graphql";
import type { SilkRoadMyRoadmapsQuery } from "~/gql/graphql";

const { path } = manifest.ui;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_NOTES_LENGTH = 30_000;
const isTextNote = (file: File) => /\.(txt|md|csv)$/i.test(file.name);

type StudentRoadmap = SilkRoadMyRoadmapsQuery["silkRoadMyRoadmaps"][number];

const fileSizeLabel = (size: number, language: Language) =>
  size >= 1024 * 1024
    ? `${(size / 1024 / 1024).toFixed(1)} ${translate(language, "file_mb")}`
    : `${Math.max(1, Math.round(size / 1024))} ${translate(language, "file_kb")}`;

const errorMessage = (caught: unknown, fallback: string, language: Language) => {
  if (!(caught instanceof Error)) {
    return fallback;
  }

  if (/network|fetch|connection refused/i.test(caught.message)) {
    return translate(language, "error_network");
  }

  if (/unauthorized|unauthenticated|sign in/i.test(caught.message)) {
    return translate(language, "error_auth");
  }

  if (/forbidden|permission/i.test(caught.message)) {
    return translate(language, "error_forbidden");
  }

  return language === "mn" && /[\u0400-\u04ff]/.test(caught.message) ? caught.message : fallback;
};

const resolveFileUrl = (uploadedValue: string) => {
  if (/^https?:\/\//i.test(uploadedValue) || uploadedValue.startsWith("/")) {
    return uploadedValue;
  }

  return `${REACT_APP_API_URL}/read-file?key=${encodeURIComponent(uploadedValue)}`;
};

const simulationLinks = (subjectName: string, stepTitle: string, language: Language) => {
  const topic = encodeURIComponent(`${subjectName} ${stepTitle}`);
  const links = [
    {
      label: translate(language, "phet"),
      url: `https://phet.colorado.edu/en/simulations/filter?locale=en&query=${topic}`,
    },
  ];

  if (/math|physics|geometry|algebra|graph|математ|физик|геометр|алгебр|граф/i.test(subjectName)) {
    links.push({
      label: translate(language, "geogebra"),
      url: "https://www.geogebra.org/calculator",
    });
  }

  return links;
};

const PageTitle = () => {
  const { t } = useLanguage();

  return (
    <div className="silkroad:flex silkroad:items-center silkroad:gap-3">
      <Breadcrumb>
        <Breadcrumb.List className="silkroad:gap-1">
          <Breadcrumb.Item>
            <Button variant="ghost" asChild>
              <Link to={`/${path}`}>
                <IconBook />
                {manifest.title}
              </Link>
            </Button>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
      <Separator.Inline />
      <Button variant="outline" size="sm" asChild>
        <Link to={`/${path}/settings`}>
          <IconSettings />
          {t("settings")}
        </Link>
      </Button>
      <LanguageSelector />
    </div>
  );
};

const StudyMaterials = ({ roadmap }: { roadmap: StudentRoadmap }) => {
  const { language, t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [addStudyFile] = useMutation(ADD_STUDY_FILE_MUTATION, {
    refetchQueries: [MY_ROADMAPS_QUERY],
  });
  const [createRoadmapFromStudyFile] = useMutation(CREATE_ROADMAP_FROM_STUDY_FILE_MUTATION, {
    refetchQueries: [MY_ROADMAPS_QUERY],
  });

  const upload = async (file: File) => {
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      setUploadError(t("error_upload_size"));
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      const content = isTextNote(file) ? await file.text() : null;
      if (content !== null && (content.trim().length < 20 || content.length > MAX_NOTES_LENGTH)) {
        setUploadError(t("error_notes_length"));
        return;
      }
      const body = new FormData();
      body.append("file", file);
      const response = await fetch(`${REACT_APP_API_URL}/upload-file?kind=main`, {
        method: "POST",
        body,
        credentials: "include",
      });
      const url = (await response.text()).trim();
      if (!response.ok || !url) {
        throw new Error(url || t("error_upload"));
      }

      try {
        const input = {
          name: file.name,
          url: resolveFileUrl(url),
          type: file.type || "application/octet-stream",
          size: file.size,
        };
        if (content !== null) {
          await createRoadmapFromStudyFile({
            variables: { subjectId: roadmap.subjectId, input, content },
          });
        } else {
          await addStudyFile({ variables: { subjectId: roadmap.subjectId, input } });
        }
      } catch (caught) {
        throw new Error(
          t("error_attach", {
            reason: errorMessage(caught, t("try_again"), language),
          }),
        );
      }
    } catch (caught) {
      setUploadError(errorMessage(caught, t("error_upload"), language));
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <Card className="sr-materials">
      <Card.Header>
        <div className="silkroad:flex silkroad:items-start silkroad:justify-between silkroad:gap-4">
          <div>
            <Card.Title>{t("study_materials")}</Card.Title>
            <Card.Description>{t("study_materials_description")}</Card.Description>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <IconFileText />
            {uploading ? t("processing") : t("upload_file")}
          </Button>
        </div>
      </Card.Header>
      <Card.Content className="silkroad:flex silkroad:flex-col silkroad:gap-3">
        <input
          ref={inputRef}
          type="file"
          className="silkroad:hidden"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.txt,.md,.csv"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void upload(file);
            }
          }}
        />
        {roadmap.files.length === 0 ? (
          <p className="silkroad:rounded-lg silkroad:border silkroad:border-dashed silkroad:border-border silkroad:p-5 silkroad:text-center silkroad:text-sm silkroad:text-muted-foreground">
            {t("no_materials")}
          </p>
        ) : (
          <ul className="silkroad:flex silkroad:flex-col silkroad:gap-2">
            {roadmap.files.map((file) => (
              <li
                key={file.id}
                className="silkroad:flex silkroad:items-center silkroad:gap-3 silkroad:rounded-lg silkroad:border silkroad:border-border silkroad:p-3"
              >
                <IconFileText className="silkroad:size-5 silkroad:shrink-0 silkroad:text-muted-foreground" />
                <span className="silkroad:min-w-0 silkroad:flex-1">
                  <a
                    className="silkroad:block silkroad:truncate silkroad:text-sm silkroad:font-medium silkroad:underline-offset-4 hover:silkroad:underline"
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file.name}
                  </a>
                  <span className="silkroad:text-xs silkroad:text-muted-foreground">
                    {fileSizeLabel(file.size, language)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="silkroad:text-xs silkroad:text-muted-foreground">{t("upload_help")}</p>
        {uploadError ? (
          <p role="alert" className="silkroad:text-sm silkroad:text-destructive">
            {uploadError}
          </p>
        ) : null}
      </Card.Content>
    </Card>
  );
};

export const IndexPage = () => {
  const { language, t } = useLanguage();
  const {
    data: subjectsData,
    loading: subjectsLoading,
    error: subjectsError,
    refetch: refetchSubjects,
  } = useQuery(LEARNING_SUBJECTS_QUERY);
  const {
    data: roadmapsData,
    loading: roadmapsLoading,
    error: roadmapsError,
    refetch: refetchRoadmaps,
  } = useQuery(MY_ROADMAPS_QUERY);
  const [startRoadmap, { loading: starting }] = useMutation(START_ROADMAP_MUTATION, {
    refetchQueries: [MY_ROADMAPS_QUERY],
  });
  const [setStepCompletion] = useMutation(SET_STEP_COMPLETION_MUTATION, {
    refetchQueries: [MY_ROADMAPS_QUERY],
  });
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [startingSubjectId, setStartingSubjectId] = useState<string | null>(null);
  const [pendingStepId, setPendingStepId] = useState<string | null>(null);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const subjects = (subjectsData?.silkRoadLearningSubjects ?? []).map((subject) => {
    const english = language === "en" ? ENGLISH_LEARNING_CONTENT[subject.id] : undefined;
    if (!english) {
      return subject;
    }

    return {
      ...subject,
      name: english.name,
      description: english.description,
      gradeRange: english.gradeRange,
      steps: subject.steps.map((step) => {
        const englishStep = english.steps[step.id];
        return englishStep ? { ...step, ...englishStep } : step;
      }),
    };
  });
  const roadmaps = roadmapsData?.silkRoadMyRoadmaps ?? [];

  useEffect(() => {
    if (!selectedSubjectId && roadmaps[0]) {
      setSelectedSubjectId(roadmaps[0].subjectId);
    }
  }, [roadmaps, selectedSubjectId]);

  const selectedRoadmap = roadmaps.find((roadmap) => roadmap.subjectId === selectedSubjectId);
  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId);
  const roadmapSteps = selectedRoadmap?.generatedSteps.length
    ? selectedRoadmap.generatedSteps
    : (selectedSubject?.steps ?? []);
  const displayedRoadmapSteps = roadmapSteps.map((step) =>
    step.id.startsWith("notes-")
      ? {
          ...step,
          description: t("uploaded_note_description", { title: step.title }),
          activity: t("uploaded_note_activity", { title: step.title }),
        }
      : step,
  );
  const progressPercent = roadmapSteps.length
    ? Math.round(((selectedRoadmap?.completedStepIds.length ?? 0) / roadmapSteps.length) * 100)
    : 0;
  const isLoading = subjectsLoading || roadmapsLoading;

  const handleStart = async (subjectId: string) => {
    setStartingSubjectId(subjectId);
    setActionError(null);
    try {
      await startRoadmap({ variables: { subjectId } });
      setSelectedSubjectId(subjectId);
    } catch (caught) {
      setActionError(errorMessage(caught, t("error_open_path"), language));
    } finally {
      setStartingSubjectId(null);
    }
  };

  const handleStepCompletion = async (subjectId: string, stepId: string, completed: boolean) => {
    setPendingStepId(stepId);
    setActionError(null);
    try {
      await setStepCompletion({
        variables: { subjectId, stepId, completed },
      });
    } catch (caught) {
      setActionError(errorMessage(caught, t("error_save_progress"), language));
    } finally {
      setPendingStepId(null);
    }
  };

  return (
    <div className="silkroad:flex silkroad:h-full silkroad:flex-col" lang={language}>
      <div className="sr-topbar silkroad:border-b silkroad:border-border silkroad:px-6 silkroad:py-3">
        <PageTitle />
      </div>
      <div className="silkroad:flex-1 silkroad:overflow-auto">
        <main className="sr-page silkroad:mx-auto silkroad:flex silkroad:w-full silkroad:max-w-6xl silkroad:flex-col silkroad:gap-8 silkroad:p-6 silkroad:md:p-8">
          <section className="sr-hero silkroad:relative silkroad:overflow-hidden silkroad:rounded-2xl silkroad:border silkroad:border-border silkroad:bg-background silkroad:p-6 silkroad:shadow-xs silkroad:md:p-9">
            <div
              aria-hidden
              className="silkroad:pointer-events-none silkroad:absolute silkroad:inset-0 silkroad:bg-gradient-to-br silkroad:from-primary/10 silkroad:via-transparent silkroad:to-transparent"
            />
            <div className="silkroad:relative silkroad:flex silkroad:flex-col silkroad:gap-6 silkroad:md:flex-row silkroad:md:items-end silkroad:md:justify-between">
              <div className="silkroad:max-w-2xl">
                <span className="sr-eyebrow">{t("hero_eyebrow")}</span>
                <h1 className="silkroad:mt-4 silkroad:text-3xl silkroad:font-semibold silkroad:tracking-tight">
                  {t("hero_title")}
                </h1>
                <p className="silkroad:mt-3 silkroad:max-w-xl silkroad:text-sm silkroad:leading-relaxed silkroad:text-muted-foreground silkroad:md:text-base">
                  {t("hero_description")}
                </p>
              </div>
              {selectedRoadmap && selectedSubject ? (
                <div className="sr-current silkroad:min-w-48 silkroad:rounded-xl silkroad:border silkroad:border-border silkroad:bg-background/80 silkroad:p-4">
                  <p className="silkroad:text-xs silkroad:text-muted-foreground">
                    {t("current_path")}
                  </p>
                  <p className="silkroad:mt-1 silkroad:font-semibold">{selectedSubject.name}</p>
                  <p className="silkroad:mt-2 silkroad:text-sm">
                    {t("steps_complete", {
                      done: selectedRoadmap.completedStepIds.length,
                      total: roadmapSteps.length,
                    })}
                  </p>
                  <div
                    className="sr-progress-track"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={t("path_progress", { percent: progressPercent })}
                  >
                    <span style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="sr-progress-caption">
                    {t("path_progress", { percent: progressPercent })}
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          {(subjectsError || roadmapsError) && (
            <div
              role="alert"
              className="silkroad:flex silkroad:items-center silkroad:justify-between silkroad:gap-4 silkroad:rounded-lg silkroad:border silkroad:border-destructive/30 silkroad:p-4 silkroad:text-sm"
            >
              <span>
                {errorMessage(subjectsError ?? roadmapsError, t("error_load_data"), language)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void Promise.all([refetchSubjects(), refetchRoadmaps()])}
              >
                {t("retry")}
              </Button>
            </div>
          )}
          {actionError ? (
            <p role="alert" className="silkroad:text-sm silkroad:text-destructive">
              {actionError}
            </p>
          ) : null}

          <section>
            <div className="silkroad:mb-4 silkroad:flex silkroad:flex-wrap silkroad:items-end silkroad:justify-between silkroad:gap-3">
              <div>
                <h2 className="silkroad:text-xl silkroad:font-semibold">{t("choose_subject")}</h2>
                <p className="silkroad:mt-1 silkroad:text-sm silkroad:text-muted-foreground">
                  {t("progress_saved_by_subject")}
                </p>
              </div>
              <span className="silkroad:text-sm silkroad:text-muted-foreground">
                {t("paths_started", { count: roadmaps.length })}
              </span>
            </div>
            {isLoading && !subjectsData ? (
              <p
                role="status"
                className="silkroad:py-8 silkroad:text-center silkroad:text-sm silkroad:text-muted-foreground"
              >
                {t("loading_paths")}
              </p>
            ) : subjects.length === 0 ? (
              <p className="silkroad:rounded-lg silkroad:border silkroad:border-dashed silkroad:border-border silkroad:p-6 silkroad:text-sm silkroad:text-muted-foreground">
                {t("no_paths")}
              </p>
            ) : (
              <div className="sr-subject-grid silkroad:grid silkroad:gap-3 silkroad:sm:grid-cols-2 silkroad:lg:grid-cols-3">
                {subjects.map((subject) => {
                  const savedRoadmap = roadmaps.find((roadmap) => roadmap.subjectId === subject.id);
                  const selected = subject.id === selectedSubjectId;
                  return (
                    <Card
                      key={subject.id}
                      className={`sr-subject-card ${
                        selected
                          ? "silkroad:border-primary silkroad:ring-1 silkroad:ring-primary"
                          : ""
                      }`}
                    >
                      <Card.Header className="silkroad:pb-3">
                        <div className="silkroad:flex silkroad:items-center silkroad:gap-3">
                          <span className="silkroad:flex silkroad:size-10 silkroad:shrink-0 silkroad:items-center silkroad:justify-center silkroad:rounded-xl silkroad:bg-accent">
                            <IconBook className="silkroad:size-5" />
                          </span>
                          <div className="silkroad:min-w-0">
                            <Card.Title className="silkroad:text-base">{subject.name}</Card.Title>
                            <p className="silkroad:mt-1 silkroad:text-xs silkroad:text-muted-foreground">
                              {subject.gradeRange}
                            </p>
                          </div>
                        </div>
                        <Card.Description className="silkroad:mt-3">
                          {subject.description}
                        </Card.Description>
                      </Card.Header>
                      <Card.Content className="silkroad:flex silkroad:items-center silkroad:justify-between silkroad:gap-3">
                        <span className="silkroad:flex silkroad:items-center silkroad:gap-1.5 silkroad:text-xs silkroad:text-muted-foreground">
                          <IconClock className="silkroad:size-4" />
                          {t("hours", { count: subject.hours })}
                        </span>
                        <Button
                          size="sm"
                          variant={selected ? "secondary" : "outline"}
                          disabled={starting}
                          onClick={() => void handleStart(subject.id)}
                        >
                          {startingSubjectId === subject.id
                            ? t("opening")
                            : savedRoadmap
                              ? t("continue")
                              : t("start_path")}
                          <IconArrowRight />
                        </Button>
                      </Card.Content>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {selectedRoadmap && selectedSubject ? (
            <div className="silkroad:grid silkroad:items-start silkroad:gap-6 silkroad:lg:grid-cols-[minmax(0,1fr)_20rem]">
              <section className="sr-roadmap">
                <div className="silkroad:mb-5 silkroad:flex silkroad:flex-wrap silkroad:items-end silkroad:justify-between silkroad:gap-3">
                  <div>
                    <div className="silkroad:flex silkroad:flex-wrap silkroad:gap-2">
                      <Badge variant="info">{selectedSubject.gradeRange}</Badge>
                      {selectedRoadmap.generatedSteps.length > 0 ? (
                        <Badge variant="secondary">{t("generated_notes")}</Badge>
                      ) : null}
                    </div>
                    <h2 className="silkroad:mt-2 silkroad:text-2xl silkroad:font-semibold">
                      {t("subject_roadmap", { subject: selectedSubject.name })}
                    </h2>
                    <p className="silkroad:mt-1 silkroad:text-sm silkroad:text-muted-foreground">
                      {t("roadmap_guidance")}
                    </p>
                  </div>
                  <span className="silkroad:text-sm silkroad:font-medium">
                    {t("steps_complete", {
                      done: selectedRoadmap.completedStepIds.length,
                      total: roadmapSteps.length,
                    })}
                  </span>
                </div>
                <ol className="sr-steps silkroad:ml-4 silkroad:flex silkroad:flex-col silkroad:gap-4 silkroad:border-l-2 silkroad:border-border silkroad:pl-6">
                  {displayedRoadmapSteps.map((step, index) => {
                    const completed = selectedRoadmap.completedStepIds.includes(step.id);
                    return (
                      <li key={step.id} className="silkroad:relative">
                        <span
                          aria-hidden
                          className={`silkroad:absolute silkroad:-left-[2.15rem] silkroad:top-4 silkroad:flex silkroad:size-7 silkroad:items-center silkroad:justify-center silkroad:rounded-full silkroad:border-2 silkroad:bg-background ${completed ? "silkroad:border-primary silkroad:bg-primary silkroad:text-primary-foreground" : "silkroad:border-border silkroad:text-muted-foreground"}`}
                        >
                          {completed ? (
                            <IconCheck className="silkroad:size-4" />
                          ) : (
                            <span className="silkroad:text-xs">{index + 1}</span>
                          )}
                        </span>
                        <Card className="sr-step-card">
                          <Card.Header className="silkroad:pb-3">
                            <div className="silkroad:flex silkroad:flex-wrap silkroad:items-center silkroad:justify-between silkroad:gap-3">
                              <button
                                type="button"
                                className="silkroad:min-w-0 silkroad:flex-1 silkroad:text-left"
                                aria-expanded={expandedStepId === step.id}
                                onClick={() =>
                                  setExpandedStepId(expandedStepId === step.id ? null : step.id)
                                }
                              >
                                <Card.Title className="silkroad:text-base">{step.title}</Card.Title>
                                <Card.Description className="silkroad:mt-1">
                                  {step.description}
                                </Card.Description>
                                <span className="silkroad:mt-2 silkroad:inline-flex silkroad:items-center silkroad:gap-1 silkroad:text-xs silkroad:font-medium silkroad:text-primary">
                                  {expandedStepId === step.id
                                    ? t("lesson_details_close")
                                    : t("lesson_details_open")}
                                  <IconArrowRight
                                    className={`silkroad:size-3 silkroad:transition-transform ${expandedStepId === step.id ? "silkroad:rotate-90" : ""}`}
                                  />
                                </span>
                              </button>
                              <span className="silkroad:flex silkroad:shrink-0 silkroad:items-center silkroad:gap-1 silkroad:text-xs silkroad:text-muted-foreground">
                                <IconClock className="silkroad:size-4" />
                                {t("duration", { minutes: step.minutes })}
                              </span>
                            </div>
                          </Card.Header>
                          <Card.Content className="silkroad:flex silkroad:flex-col silkroad:gap-3">
                            {expandedStepId === step.id ? (
                              <div className="sr-lesson silkroad:rounded-xl silkroad:border silkroad:border-primary/20 silkroad:bg-primary/5 silkroad:p-4">
                                <h3 className="silkroad:font-semibold">{t("what_you_learn")}</h3>
                                <p className="silkroad:mt-1 silkroad:text-sm silkroad:leading-relaxed silkroad:text-muted-foreground">
                                  {step.description} {t("lesson_detail_sentence")}
                                </p>
                                <div className="silkroad:mt-4">
                                  <h4 className="silkroad:text-sm silkroad:font-semibold">
                                    {t("visualize_topic")}
                                  </h4>
                                  <div className="silkroad:mt-2 silkroad:flex silkroad:flex-wrap silkroad:gap-2">
                                    {simulationLinks(
                                      selectedSubject.name,
                                      step.title,
                                      language,
                                    ).map((link) => (
                                      <a
                                        key={link.label}
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="silkroad:inline-flex silkroad:items-center silkroad:gap-1 silkroad:rounded-full silkroad:border silkroad:border-border silkroad:bg-background silkroad:px-3 silkroad:py-1.5 silkroad:text-xs silkroad:font-medium hover:silkroad:border-primary"
                                      >
                                        {link.label}
                                        <IconArrowRight className="silkroad:size-3" />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            <p className="silkroad:rounded-lg silkroad:bg-muted silkroad:p-3 silkroad:text-sm">
                              <span className="silkroad:font-medium">{t("try_this")}</span>
                              {step.activity}
                            </p>
                            <div>
                              <Button
                                size="sm"
                                variant={completed ? "secondary" : "outline"}
                                disabled={pendingStepId === step.id}
                                onClick={() =>
                                  void handleStepCompletion(selectedSubject.id, step.id, !completed)
                                }
                              >
                                {pendingStepId === step.id
                                  ? t("saving")
                                  : completed
                                    ? t("completed")
                                    : t("mark_complete")}
                              </Button>
                            </div>
                          </Card.Content>
                        </Card>
                      </li>
                    );
                  })}
                </ol>
                {selectedRoadmap.pathHistory.length > 0 ? (
                  <section className="silkroad:mt-8 silkroad:rounded-2xl silkroad:border silkroad:border-border silkroad:bg-muted/30 silkroad:p-5">
                    <h3 className="silkroad:text-lg silkroad:font-semibold">
                      {t("previous_versions")}
                    </h3>
                    <p className="silkroad:mt-1 silkroad:text-sm silkroad:text-muted-foreground">
                      {t("history_description")}
                    </p>
                    <div className="sr-history silkroad:mt-4 silkroad:flex silkroad:flex-col silkroad:gap-3">
                      {selectedRoadmap.pathHistory.map((version) => (
                        <details
                          key={version.id}
                          className="silkroad:rounded-xl silkroad:border silkroad:border-border silkroad:bg-background"
                          open={expandedHistoryId === version.id}
                          onToggle={(event) => {
                            const isOpen = event.currentTarget.open;
                            setExpandedHistoryId(isOpen ? version.id : null);
                          }}
                        >
                          <summary className="silkroad:cursor-pointer silkroad:p-4 silkroad:text-sm silkroad:font-medium">
                            {t("history_summary", {
                              file: version.sourceFileName,
                              date: new Date(version.savedAt).toLocaleDateString(
                                language === "mn" ? "mn-MN" : "en-US",
                              ),
                              done: version.completedStepIds.length,
                              total: version.generatedSteps.length,
                            })}
                          </summary>
                          <ol className="silkroad:space-y-2 silkroad:border-t silkroad:border-border silkroad:p-4">
                            {version.generatedSteps.map((oldStep, oldIndex) => (
                              <li
                                key={oldStep.id}
                                className="silkroad:flex silkroad:gap-3 silkroad:text-sm"
                              >
                                <span className="silkroad:flex silkroad:size-6 silkroad:shrink-0 silkroad:items-center silkroad:justify-center silkroad:rounded-full silkroad:bg-muted silkroad:text-xs">
                                  {oldIndex + 1}
                                </span>
                                <span>
                                  <strong>{oldStep.title}</strong>
                                  <span className="silkroad:mt-0.5 silkroad:block silkroad:text-muted-foreground">
                                    {oldStep.id.startsWith("notes-")
                                      ? t("uploaded_note_description", { title: oldStep.title })
                                      : oldStep.description}
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ol>
                        </details>
                      ))}
                    </div>
                  </section>
                ) : null}
              </section>
              <aside className="sr-sidebar silkroad:lg:sticky silkroad:lg:top-6">
                <StudyMaterials roadmap={selectedRoadmap} />
              </aside>
            </div>
          ) : !isLoading && subjects.length > 0 ? (
            <p className="silkroad:rounded-xl silkroad:border silkroad:border-dashed silkroad:border-border silkroad:p-6 silkroad:text-center silkroad:text-sm silkroad:text-muted-foreground">
              {t("choose_subject_prompt")}
            </p>
          ) : null}
        </main>
      </div>
    </div>
  );
};
