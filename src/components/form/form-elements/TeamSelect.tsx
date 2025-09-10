import { useState } from 'react'
import MultiSelect from '../MultiSelect'

interface TeamSelectProps {
  optionsList: string[]
  columnOptions: string[]
  onChange: (selectedTeams: string[], selectedColumns: string[]) => void
}

export default function TeamSelect({
  optionsList,
  columnOptions,
  onChange,
}: TeamSelectProps) {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])

  const handleTeamsChange = (values: string[]) => {
    setSelectedTeams(values)
    onChange(values, selectedColumns)
  }

  const handleColumnsChange = (values: string[]) => {
    setSelectedColumns(values)
    onChange(selectedTeams, values)
  }

  const multiTeamOptions = optionsList.map((opt) => ({
    value: opt,
    text: opt,
    selected: false,
  }))

  const multiColumnOptions = columnOptions.map((opt) => ({
    value: opt,
    text: opt,
    selected: false,
  }))

  return (
    <div className="space-y-6">
      <div>
        <MultiSelect
          label="Select your teams"
          options={multiTeamOptions}
          defaultSelected={selectedTeams}
          zIndex={40}
          onChange={handleTeamsChange}
        />
      </div>
      <div>
        <MultiSelect
          label="Select columns to display"
          options={multiColumnOptions}
          defaultSelected={selectedColumns}
          zIndex={20}
          onChange={handleColumnsChange}
        />
      </div>
    </div>
  )
}
