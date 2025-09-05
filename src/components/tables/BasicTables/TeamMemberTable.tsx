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
  Player: (player) => (
    <div className="w-10 h-10 overflow-hidden rounded-full">
      <img width={40} height={40} src={player.image} alt={player.name} />
    </div>
  ),
  Name: (player) => player.name,
  Number: (player) => player.number,
  Position: (player) => player.position,
  Height: (player) => player.height,
  Weight: (player) => player.weight,
  Scores: (player) => player.scores,
  Assists: (player) => player.assists,
  Rebounds: (player) => player.rebounds,
  Steals: (player) => player.steals,
  Blocks: (player) => player.blocks,
  Turnovers: (player) => player.turnovers,
  Fouls: (player) => player.fouls,
  Games: (player) => player.games,
  '3PM': (player) => player.threePoints,
  FTM: (player) => player.ftm,
  'Penalty Shots': (player) => player.penaltyShots,
  'Penalty Shots In': (player) => player.penaltyShotsIn,
}

export default function TeamMemberTable({
  data,
  columns = ['Player', 'Name', 'Number'],
}: TeamMemberTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="overflow-x-auto w-full">
        <div className="min-w-[1000px]">
          <Table className="w-full table-auto">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((col) => (
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
                  {columns.map((col) => (
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
