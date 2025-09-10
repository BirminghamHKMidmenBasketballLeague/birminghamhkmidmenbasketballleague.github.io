import { useState } from 'react'
import ComponentCard from '../components/common/ComponentCard'
import PageBreadcrumb from '../components/common/PageBreadCrumb'
import PageMeta from '../components/common/PageMeta'
import Label from '../components/form/Label'
import Select, { Option } from '../components/form/Select'
import MatchResult from '../components/dashboard/MatchResult'
import UrlVideoPlayer from '../components/ui/videos/UrlVideoPlayer'
import { matches } from '../data/Matches'
import { dateFormat } from '../data/DateFormat'
import TeamMemberTable from '../components/tables/BasicTables/TeamMemberTable'

const playerColumns = [
  'Player',
  'Name',
  'Number',
  'Position',
  'Scores',
  '3PM',
  'FTM',
  'Fouls',
  'Assists',
  'Rebounds',
  'Steals',
  'Blocks',
  'Turnovers',
]

const options: Option[] = matches.map((match) => ({
  value: match.id.toString(),
  label: `${match.name} - ${new Date(match.date).toLocaleDateString(
    'en-US',
    dateFormat
  )}`,
}))

interface MatchesProps {
  onSelectChange: (value: string) => void
}

export default function Matches({ onSelectChange }: MatchesProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string>('')
  const handleSelectChange = (value: string) => {
    setSelectedMatchId(value)
    onSelectChange(value)
  }
  // Filter matches based on selected match
  const selectedMatch = matches.filter(
    (match) => match.id.toString() === selectedMatchId
  )[0]

  return (
    <>
      <PageMeta
        title="BHK League"
        description="Birmingham HK Midmen Basketball League"
      />
      <PageBreadcrumb pageTitle="Matches" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <ComponentCard title="Select Inputs">
            <div className="space-y-6">
              <Label>Select Match</Label>
              <Select
                options={options}
                onChange={handleSelectChange}
                className="dark:bg-dark-900"
              />
            </div>
          </ComponentCard>
        </div>
        {selectedMatch && (
          <div className="col-span-12">
            <MatchResult match={selectedMatch} />
          </div>
        )}
        {selectedMatch && selectedMatch.team && selectedMatch.team.home && (
          <div className="col-span-12">
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      Home
                    </h3>
                    <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                      {selectedMatch.team.home.name} -{' '}
                      {selectedMatch.score?.home}
                    </p>
                  </div>
                </div>
                <div className="relative flex items-center justify-center mt-6 mb-2">
                  <TeamMemberTable
                    data={selectedMatch.team.home.players}
                    columns={playerColumns}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedMatch && selectedMatch.team && selectedMatch.team.away && (
          <div className="col-span-12">
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      Away
                    </h3>
                    <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                      {selectedMatch.team.away.name} -{' '}
                      {selectedMatch.score?.away}
                    </p>
                  </div>
                </div>
                <div className="relative flex items-center justify-center mt-6 mb-2">
                  <TeamMemberTable
                    data={selectedMatch.team.away.players}
                    columns={playerColumns}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedMatch &&
          selectedMatch.videos &&
          selectedMatch.videos.map((video) => (
            <div key={video.name} className="col-span-12">
              <ComponentCard title="Game Play" desc={video.description}>
                <UrlVideoPlayer data={video} />
              </ComponentCard>
            </div>
          ))}
      </div>
    </>
  )
}
