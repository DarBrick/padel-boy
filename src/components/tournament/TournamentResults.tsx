import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { StoredTournament } from "../../schemas/tournament";
import { getTournamentStats } from "../../utils/tournamentStats";
import { formatTournamentDate } from "../../utils/tournamentState";
import { TabSelector } from "../ui";
import { StandingsTable } from "./StandingsTable";
import { RoundsHistory } from "./RoundsHistory";
import { TournamentInsights } from "./TournamentInsights";
import { TournamentPlayers } from "./TournamentPlayers";
import { ContentPanel } from "../ui";
import { IconButton } from "../ui";
import { Calendar, Users, Trophy, ArrowUp, Shuffle, Dices, Users2, Repeat2, Swords } from "lucide-react";

type TabId = "standings" | "rounds" | "players" | "insights";

interface TournamentResultsProps {
  tournament: StoredTournament;
}

export function TournamentResults({ tournament }: TournamentResultsProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("standings");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);

  const stats = getTournamentStats(tournament);
  const formattedDate = formatTournamentDate(tournament, i18n.language);

  // Handle scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    { id: "standings" as TabId, label: t("results.tabs.standings") },
    { id: "rounds" as TabId, label: t("results.tabs.rounds") },
    { id: "players" as TabId, label: t("results.tabs.players") },
    { id: "insights" as TabId, label: t("results.tabs.insights"), disabled: true },
  ];

  // Format finished date
  const finishedDate = tournament.finishedAt
    ? new Date(tournament.finishedAt).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Header */}
      <ContentPanel>
        <div className="space-y-4">
          {/* Tournament Name */}
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              {tournament.name || t("tournament.title")}
            </h1>
            {finishedDate && (
              <div className="text-sm text-foreground-muted mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t("results.header.finishedAt")}: {finishedDate}
              </div>
            )}
          </div>

          {/* Info Badges */}
          <div className="flex flex-wrap gap-2">
            {/* Format Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface/70 rounded-lg text-sm">
              <Trophy className="w-4 h-4 text-padel-500" />
              <span className="text-foreground font-medium">
                {tournament.format === "americano"
                  ? t("tournament.format.americano")
                  : t("tournament.format.mexicano")}
              </span>
            </div>

            {/* Players Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface/70 rounded-lg text-sm">
              <Users className="w-4 h-4 text-foreground-muted" />
              <span className="text-foreground-muted">
                {tournament.playerCount} {t("tournament.players")}
              </span>
            </div>

            {/* Date Badge */}
            {formattedDate && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface/70 rounded-lg text-sm">
                <Calendar className="w-4 h-4 text-foreground-muted" />
                <span className="text-foreground-muted">{formattedDate}</span>
              </div>
            )}

            {/* Rounds Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface/70 rounded-lg text-sm">
              <Repeat2 className="w-4 h-4 text-foreground-muted" />
              <span className="text-foreground font-medium">
                {stats.totalRounds}
              </span>
            </div>

            {/* Matches Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface/70 rounded-lg text-sm">
              <Swords className="w-4 h-4 text-foreground-muted" />
              <span className="text-foreground font-medium">
                {stats.finishedMatches}
              </span>
            </div>

            {/* Mexicano pairing style */}
            {tournament.format === 'mexicano' && tournament.mexicanoMatchupStyle && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface/70 rounded-lg text-sm">
                <Shuffle className="w-4 h-4 text-foreground-muted" />
                <span className="text-foreground font-medium">
                  {tournament.mexicanoMatchupStyle}
                </span>
              </div>
            )}

            {/* Mexicano random rounds */}
            {tournament.format === 'mexicano' && tournament.mexicanoRandomRounds && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface/70 rounded-lg text-sm">
                <Dices className="w-4 h-4 text-foreground-muted" />
                <span className="text-foreground font-medium">
                  {tournament.mexicanoRandomRounds}
                </span>
              </div>
            )}

            {/* Fixed pairs */}
            {tournament.isFixedPairs && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface/70 rounded-lg text-sm">
                <Users2 className="w-4 h-4 text-foreground-muted" />
                <span className="text-foreground font-medium">
                  {t('create.fixedPairs.label')}
                </span>
              </div>
            )}
          </div>
        </div>
      </ContentPanel>

      {/* Tab Selector */}
      <TabSelector
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as TabId)}
      />

      {/* Tab Content */}
      {activeTab === "standings" && (
        <ContentPanel>
          <StandingsTable
            standings={stats.standings}
            selectedPlayerIndex={selectedPlayerIndex}
            onSelectPlayerIndex={setSelectedPlayerIndex}
          />
        </ContentPanel>
      )}

      {activeTab === "rounds" && (
        <ContentPanel>
          <RoundsHistory
            tournament={tournament}
            selectedPlayerIndex={selectedPlayerIndex}
            onSelectPlayerIndex={setSelectedPlayerIndex}
          />
        </ContentPanel>
      )}

      {activeTab === "players" && (
        <ContentPanel>
          <TournamentPlayers
            tournament={tournament}
            selectedPlayerIndex={selectedPlayerIndex}
            onSelectPlayerIndex={setSelectedPlayerIndex}
          />
        </ContentPanel>
      )}

      {activeTab === "insights" && (
        <TournamentInsights tournament={tournament} />
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <div className="flex justify-center mt-12">
          <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            icon={ArrowUp}
            label={t("pastTournaments.scrollToTop")}
          />
        </div>
      )}
    </div>
  );
}
