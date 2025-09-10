import { useState } from 'react'
import { Match } from '../../model/Match'
import { Player } from '../../model/Team'
import { Modal } from '../ui/modal'
import { useModal } from '../../hooks/useModal'

interface MatchResultProps {
  match: Match
}

export default function MatchResult({ match }: MatchResultProps) {
  const { isOpen, openModal, closeModal } = useModal()
  const [modalType, setModalType] = useState<
    'scorer' | 'threept' | 'ft' | 'mvp' | null
  >(null)

  // Find leaders
  const allPlayers: Player[] = [
    ...match.team.home.players,
    ...match.team.away.players,
  ]
  const leaderScorer = allPlayers.reduce(
    (prev, curr) => ((curr.scores ?? 0) > (prev.scores ?? 0) ? curr : prev),
    allPlayers[0]
  )
  const leaderThreePt = allPlayers.reduce(
    (prev, curr) =>
      (curr.threePoints ?? 0) > (prev.threePoints ?? 0) ? curr : prev,
    allPlayers[0]
  )
  const leaderFT = allPlayers.reduce(
    (prev, curr) => ((curr.ftm ?? 0) > (prev.ftm ?? 0) ? curr : prev),
    allPlayers[0]
  )
  const mvp = allPlayers.reduce(
    (prev, curr) =>
      (curr.scores ?? 0) + (curr.assists ?? 0) + (curr.rebounds ?? 0) >
      (prev.scores ?? 0) + (prev.assists ?? 0) + (prev.rebounds ?? 0)
        ? curr
        : prev,
    allPlayers[0]
  )

  // Determine winner
  const homeScore = match.score?.home ?? 0
  const awayScore = match.score?.away ?? 0
  const homeWin = homeScore > awayScore
  const awayWin = awayScore > homeScore

  function openModalType(type: 'scorer' | 'threept' | 'ft' | 'mvp') {
    setModalType(type)
    openModal()
  }
  function closeModalAll() {
    setModalType(null)
    closeModal()
  }

  // Helper for modal content
  function renderModalContent() {
    if (!modalType) return null
    let player: Player
    let title = ''
    let stats: { label: string; value: any }[] = []
    if (modalType === 'scorer') {
      player = leaderScorer
      title = `Leader Scorer`
      stats = [
        { label: 'Scores', value: player.scores },
        { label: 'Assists', value: player.assists },
        { label: 'Three Points', value: player.threePoints },
      ]
    } else if (modalType === 'threept') {
      player = leaderThreePt
      title = `3PT Leader`
      stats = [
        { label: 'Three Points', value: player.threePoints },
        { label: 'Scores', value: player.scores },
      ]
    } else if (modalType === 'ft') {
      player = leaderFT
      title = `FT Leader`
      stats = [
        { label: 'Free Throws', value: player.ftm },
        { label: 'Scores', value: player.scores },
      ]
    } else {
      player = mvp
      title = `Most Valuable Player`
      stats = [
        { label: 'Scores', value: player.scores },
        { label: 'Assists', value: player.assists },
        { label: 'Rebounds', value: player.rebounds },
        { label: 'Blocks', value: player.blocks },
        { label: 'Steals', value: player.steals },
        { label: 'Fouls', value: player.fouls },
      ]
    }
    return (
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {title}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {player.name} - {player.position} ({player.number})
          </p>
        </div>
        {/* Player stats */}

        {stats.map(({ label, value }) => (
          <div key={label} className="mt-3">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              {label}
            </label>
            <p className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
              {value !== undefined && value !== null ? value : '-'}
            </p>
          </div>
        ))}
        {/* Player stats */}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {match.name}
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {new Date(match.date).toLocaleString()} @ {match.location}
            </p>
          </div>
        </div>
        {/* Score display */}
        <div className="relative flex flex-col items-center justify-center mt-6 mb-2">
          <div className="flex items-center gap-6 text-5xl font-bold">
            <span
              className={`px-4 py-2 rounded-lg ${
                homeWin
                  ? 'bg-blue-600 text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white/80'
              }`}
            >
              {homeScore}
            </span>
            <span className="text-2xl font-semibold text-gray-500">vs</span>
            <span
              className={`px-4 py-2 rounded-lg ${
                awayWin
                  ? 'bg-blue-600 text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white/80'
              }`}
            >
              {awayScore}
            </span>
          </div>
          <div className="flex justify-between w-full max-w-xs mt-2 text-center text-base font-medium dark:text-gray-400">
            <span className="flex-1">{match.team.home.name}</span>
            <span className="flex-1">{match.team.away.name}</span>
          </div>
          {match.isOvertime && (
            <span className="mt-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
              Overtime
            </span>
          )}
          {match.score?.home === match.score?.away && (
            <span className="mt-2 px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
              Draw
            </span>
          )}
        </div>
        {/* End Score display */}

        {/* Leader Scorer, 3PT Leader, FT Leader, MVP */}
        <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5 mt-6">
          <div
            className="cursor-pointer"
            onClick={() => openModalType('scorer')}
          >
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              Leader Scorer
            </p>
            <p className="flex items-center justify-center gap-1 text-base font-semibold text-blue-700 dark:text-blue-400 sm:text-lg">
              {leaderScorer.name}
            </p>
          </div>
          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
          <div
            className="cursor-pointer"
            onClick={() => openModalType('threept')}
          >
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              3PT Leader
            </p>
            <p className="flex items-center justify-center gap-1 text-base font-semibold text-orange-700 dark:text-orange-400 sm:text-lg">
              {leaderThreePt.name}
            </p>
          </div>
          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
          <div className="cursor-pointer" onClick={() => openModalType('ft')}>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              FT Leader
            </p>
            <p className="flex items-center justify-center gap-1 text-base font-semibold text-green-700 dark:text-green-400 sm:text-lg">
              {leaderFT.name}
            </p>
          </div>
          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
          <div className="cursor-pointer" onClick={() => openModalType('mvp')}>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              Most Value Player
            </p>
            <p className="flex items-center justify-center gap-1 text-base font-semibold text-purple-700 dark:text-purple-400 sm:text-lg">
              {mvp.name}
            </p>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isOpen}
          onClose={closeModalAll}
          className="max-w-[700px] p-6 lg:p-10"
        >
          {renderModalContent()}
        </Modal>
      </div>
    </div>
  )
}
