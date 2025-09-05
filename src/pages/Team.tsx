import { useState } from 'react'
import PageBreadcrumb from '../components/common/PageBreadCrumb'
import ComponentCard from '../components/common/ComponentCard'
import PageMeta from '../components/common/PageMeta'
import TeamMemberTable from '../components/tables/BasicTables/TeamMemberTable'
import TeamSelect from '../components/form/form-elements/TeamSelect'
import { teams, playerData } from '../data/Teams'

export default function TeamPage() {
  const teamNames = teams.map((team) => team.name)
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'Player',
    'Name',
    'Number',
  ])

  const handleOptionsChange = (teams: string[], columns: string[]) => {
    setSelectedTeams(teams)
    setSelectedColumns(columns.length ? columns : ['Player', 'Name', 'Number'])
  }

  return (
    <div>
      <PageMeta
        title="BHK League"
        description="Birmingham HK Midmen Basketball League"
      />
      <PageBreadcrumb pageTitle="Teams" />

      <div className="space-y-6">
        <ComponentCard title="Team Member Table">
          <TeamSelect
            optionsList={teamNames}
            columnOptions={playerData}
            onChange={handleOptionsChange}
          />
          {selectedTeams.map((teamName) => {
            const team = teams.find((t) => t.name === teamName)
            return team ? (
              <div key={team.name} className="mt-6">
                <h2 className="font-bold text-lg mb-2 dark:text-gray-300">
                  {team.name}
                </h2>
                <TeamMemberTable
                  data={team.players}
                  columns={selectedColumns}
                />
              </div>
            ) : null
          })}
        </ComponentCard>
      </div>
    </div>
  )
}
