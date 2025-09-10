import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../ui/table'
import { Player } from '../../../model/Team'

interface TeamMemberTableProps {
  data: Player[]
  columns?: string[]
}

const columnMap: Record<string, (player: Player) => React.ReactNode> = {
  // "main" column: image, name (number), position (like DynamicTable)
  Player: (player) => (
    <div className="flex items-center gap-3">
      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
        <img
          src={player.image}
          alt={player.name}
          className="h-[50px] w-[50px]"
          onError={(e) => (e.currentTarget.src = '/images/player/unknown.jpg')}
        />
      </div>
      <div>
        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
          {player.name}
          {player.number ? ` (${player.number})` : ''}
        </p>
        {player.position && (
          <span className="text-gray-500 text-theme-xs dark:text-gray-400">
            {player.position}
          </span>
        )}
      </div>
    </div>
  ),
  Scores: (player) => player.scores,
  '3PM': (player) => player.threePoints,
  EFF: (player) => player.eff,
  FTM: (player) => player.ftm,
  Fouls: (player) => player.fouls,
  Assists: (player) => player.assists,
  Rebounds: (player) => player.rebounds,
  Steals: (player) => player.steals,
  Blocks: (player) => player.blocks,
  Turnovers: (player) => player.turnovers,
}

export default function TeamMemberTable({
  data,
  columns = [],
}: TeamMemberTableProps) {
  // Always include Player column as the first column, then filter out duplicates
  const filteredColumns = [
    'Player',
    ...columns.filter(
      (col, idx) =>
        col !== 'Player' &&
        col !== 'Name' &&
        col !== 'Position' &&
        col !== 'Number' &&
        columns.indexOf(col) === idx
    ),
  ]

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="overflow-x-auto w-full">
        <div className="min-w-[1000px]">
          <Table className="w-full table-auto">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {filteredColumns.map((col) => (
                  <TableCell
                    key={col}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((player) => (
                <TableRow key={player.id}>
                  {filteredColumns.map((col) => (
                    <TableCell
                      key={col}
                      className="px-4 py-3 text-start dark:text-white/80"
                    >
                      {columnMap[col] ? columnMap[col](player) : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
