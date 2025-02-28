//@ts-nocheck
import ButtonTooltip from "@/components/shared/ButtonTooltip";
import CircleButton from "@/components/shared/CircleButton";
import Input from "@/components/shared/Input";
import Kbd from "@/components/shared/Kbd";
import Select from "@/components/shared/Select";
import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import {
  directions,
  fitModes,
  useReadSettings,
} from "@/contexts/ReadSettingsContext";
import useDevice from "@/hooks/useDevice";
import { groupBy, sortObjectByValue } from "@/utils";
import { getTitle } from "@/utils/data";
import classNames from "classnames";
import { motion, Variants } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { AiOutlineSearch } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import {
  CgArrowDown,
  CgArrowLeft,
  CgArrowRight,
  CgArrowsShrinkH,
  CgArrowsShrinkV,
} from "react-icons/cg";
import { HiOutlineArrowsExpand } from "react-icons/hi";

const sourcesToOptions = (sources: string[]) =>
  sources.map((source) => ({ value: source, label: source }));

const sidebarVariants: Variants = {
  initial: {
    width: 0,
    opacity: 0,
  },
  animate: { width: "25%", opacity: 1 },
};

const mobileSidebarVarants: Variants = {
  initial: {
    y: "-100%",
  },
  animate: { y: 0 },
};

const transition = [0.33, 1, 0.68, 1];

const Sidebar = () => {
  const { isMobile } = useDevice();
  const {
    state: { isSidebarOpen },
    setState,
  } = useReadPanel();
  const router = useRouter();
  const { manga, currentChapter, chapters, currentChapterIndex, setChapter } =
    useReadInfo();
  const { fitMode, setSetting, direction } = useReadSettings();
  const { t } = useTranslation("manga_read");

  const [filterText, setFilterText] = useState("");
  const [activeSource, setActiveSource] = useState(
    currentChapter?.source?.name || chapters[0]?.source?.name
  );

  const handleSidebarState = (isOpen: boolean) => () => {
    setState((prev) => ({ ...prev, isSidebarOpen: isOpen }));
  };

  const title = useMemo(
    () => getTitle(manga, router.locale),
    [manga, router.locale]
  );

  const sourceChapters = useMemo(
    () => chapters.filter((chapter) => chapter.source.name === activeSource),
    [activeSource, chapters]
  );

  const filteredChapters = useMemo(() => {
    return sourceChapters.filter((chapter) =>
      chapter.name.includes(filterText)
    );
  }, [filterText, sourceChapters]);

  const sources = useMemo(
    () => groupBy(chapters, (data) => data.source.name),
    [chapters]
  );

  const verifiedSources = useMemo(() => {
    const verifiedChapters = chapters.filter(
      (chapter) => chapter.source.isCustomSource
    );

    const sources = groupBy(verifiedChapters, (chapter) => chapter.source.name);

    const sortedSources = sortObjectByValue(
      sources,
      (a, b) => b.length - a.length
    );

    return sortedSources;
  }, [chapters]);

  const nonVerifiedSources = useMemo(() => {
    const nonVerifiedChapters = chapters.filter(
      (chapter) => !chapter.source.isCustomSource
    );

    const sources = groupBy(
      nonVerifiedChapters,
      (chapter) => chapter.source.name
    );

    const sortedSources = sortObjectByValue(
      sources,
      (a, b) => b.length - a.length
    );

    return sortedSources;
  }, [chapters]);

  const handleChangeChapterIndex = (index: number) => () => {
    setChapter(sourceChapters[index]);
  };

  useEffect(() => {
    const currentChapterEl = document.querySelector(".active-chapter");

    if (!currentChapterEl) return;

    currentChapterEl.scrollIntoView();
  }, [currentChapter]);

  return (
    <motion.div
      variants={isMobile ? mobileSidebarVarants : sidebarVariants}
      animate={isSidebarOpen ? "animate" : "initial"}
      initial="initial"
      className={classNames(
        "bg-background-800 flex-shrink-0 flex-grow-0",
        isMobile && "fixed top-0 w-full min-h-[content] z-50"
      )}
      transition={{ ease: transition, duration: 0.6 }}
    >
      <div className="flex flex-col h-full w-full p-4 space-y-2">
        {/* Leave | Open/Close */}
        <div className="flex w-full items-center justify-between">
          <CircleButton
            LeftIcon={BsArrowLeft}
            iconClassName="w-7 h-7"
            secondary
            onClick={router.back}
          />

          <p className="text-center text-lg font-semibold line-clamp-1">
            {title}
          </p>

          <BrowserView>
            <CircleButton
              LeftIcon={BiChevronLeft}
              iconClassName="w-8 h-8"
              secondary
              onClick={handleSidebarState(false)}
            />
          </BrowserView>
        </div>

        <MobileView>
          <div className="flex gap-x-2 w-full px-2 overflow-x-auto no-scrollbar [&>*]:shrink-0">
            {Object.keys(sources).map((source) => (
              <div
                className={classNames(
                  "text-gray-300 cursor-pointer rounded-[18px] px-2 py-1 w-[max-content] duration-300 transition",
                  activeSource === source
                    ? "bg-white text-black"
                    : "hover:text-white"
                )}
                key={source}
                onClick={() => setActiveSource(source)}
              >
                {source}
              </div>
            ))}
          </div>
        </MobileView>

        {/* Mobile chapter selector */}
        <div className="flex items-center justify-center md:justify-between space-x-2 md:space-x-0">
          <ButtonTooltip
            tooltip={
              <p>
                {t("previous_chapter")} <Kbd className="ml-2">[</Kbd>
              </p>
            }
            LeftIcon={BiChevronLeft}
            iconClassName="w-8 h-8"
            secondary
            disabled={currentChapterIndex === 0}
            onClick={handleChangeChapterIndex(currentChapterIndex - 1)}
            shortcutKey="["
          />

          <MobileView className="grow">
            <select
              value={currentChapter.sourceChapterId}
              onChange={(e) => {
                const sourceChapterId = e.target.value;
                const chapter = sourceChapters.find(
                  (chapter) => chapter.sourceChapterId === sourceChapterId
                );

                setChapter(chapter);
              }}
              className="rounded-md py-1 px-2 appearance-none w-full bg-background-700"
            >
              {sourceChapters.map((chapter) => (
                <option
                  key={chapter.sourceChapterId}
                  value={chapter.sourceChapterId}
                >
                  {chapter.name}
                </option>
              ))}
            </select>
          </MobileView>

          <BrowserView>
            <p>{currentChapter.name}</p>
          </BrowserView>

          <ButtonTooltip
            tooltip={
              <p>
                {t("next_chapter")} <Kbd className="ml-2">]</Kbd>
              </p>
            }
            LeftIcon={BiChevronRight}
            iconClassName="w-8 h-8"
            secondary
            disabled={currentChapterIndex === sourceChapters.length - 1}
            onClick={handleChangeChapterIndex(currentChapterIndex + 1)}
            shortcutKey="]"
          />
        </div>

        {/* Options */}
        <div className="flex items-center justify-center space-x-2">
          <ButtonTooltip
            tooltip={
              <p>
                {t("fit_mode")} <Kbd className="ml-2">F</Kbd>
              </p>
            }
            LeftIcon={
              fitMode === "width"
                ? CgArrowsShrinkH
                : fitMode === "height"
                ? CgArrowsShrinkV
                : HiOutlineArrowsExpand
            }
            onClick={() => {
              const index = fitModes.indexOf(fitMode);

              const nextFitMode = fitModes[(index + 1) % fitModes.length];

              setSetting("fitMode", nextFitMode);
            }}
            shortcutKey="F"
          />

          <ButtonTooltip
            tooltip={
              <p>
                {t("layout_direction")} <Kbd className="ml-2">D</Kbd>
              </p>
            }
            LeftIcon={
              direction === "vertical"
                ? CgArrowDown
                : direction === "ltr"
                ? CgArrowRight
                : CgArrowLeft
            }
            onClick={() => {
              const index = directions.indexOf(direction);

              const nextDirection = directions[(index + 1) % directions.length];

              setSetting("direction", nextDirection);
            }}
            shortcutKey="D"
          />
        </div>

        {/* Desktop chapter selector */}
        <BrowserView className="grow space-y-2">
          <Input
            LeftIcon={AiOutlineSearch}
            className="w-full h-6 !bg-background-700"
            containerClassName="!bg-background-700"
            containerInputClassName="!bg-background-700"
            placeholder={t("search_chapter_placeholder")}
            onChange={(e) =>
              setFilterText((e.target as HTMLInputElement).value)
            }
          />

          <div className="flex items-center gap-2 mb-4">
            <label htmlFor="source-selector" className="font-medium">
              Sources:{" "}
            </label>

            <Select
              id="source-selector"
              options={[
                {
                  label: "Verified",
                  options: sourcesToOptions(Object.keys(verifiedSources)),
                },
                {
                  label: "Not verified",
                  options: sourcesToOptions(Object.keys(nonVerifiedSources)),
                },
              ]}
              onChange={({ value }) => {
                setActiveSource(value);
              }}
              defaultValue={{ value: activeSource, label: activeSource }}
              isClearable={false}
              isSearchable={false}
            />
          </div>
        </BrowserView>

        <BrowserView renderWithFragment>
          <ul className="h-full overflow-auto bg-background-900">
            {filteredChapters.map((chapter) => {
              const isActive =
                chapter.sourceChapterId === currentChapter.sourceChapterId;

              return (
                <li
                  className={classNames(
                    "relative px-4 py-2 cursor-pointer hover:bg-white/20 transition duration-300",
                    isActive && "active-chapter"
                  )}
                  key={chapter.sourceChapterId}
                  onClick={() => setChapter(chapter)}
                >
                  {chapter.name}

                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary-500"></div>
                  )}
                </li>
              );
            })}
          </ul>
        </BrowserView>
      </div>
    </motion.div>
  );
};

export default Sidebar;
