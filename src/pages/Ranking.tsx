import DynamicTable from '../components/tables/DynamicTable'
import {
  Category,
  Subcategory,
} from '../components/form/form-elements/SingleMultiSelect'
import SingleMultiSelect from '../components/form/form-elements/SingleMultiSelect'
import PageMeta from '../components/common/PageMeta'
import { teams } from '../data/Teams'

const categoryOptions: Category[] = [
  { value: 'team', label: 'Team', text: 'Team', selected: false },
  { value: 'player', label: 'Player', text: 'Player', selected: false },
]

const multiListOptions: Subcategory[] = [
  {
    category: 'team',
    value: 'teamrank',
    label: 'Team Ranking',
    text: 'Team Ranking',
  },
  {
    category: 'player',
    value: 'scorer',
    label: 'Leader Scorer',
    text: 'Leader Scorer',
  },
  {
    category: 'player',
    value: 'threept',
    label: '3PT Leader',
    text: '3PT Leader',
  },
  {
    category: 'player',
    value: 'ft',
    label: 'FT Leader',
    text: 'FT Leader',
  },
  {
    category: 'player',
    value: 'mvp',
    label: 'Most Valuable Player',
    text: 'Most Valuable Player',
  },
]

import { useState } from 'react'

export default function Ranking() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedMulti, setSelectedMulti] = useState<string[]>([])

  // Table data logic for multi DynamicTable
  type TableBlock = { tableData: any[]; tableName: string }
  const tableBlocks: TableBlock[] = []
  if (selectedCategory === 'team' && selectedMulti.includes('teamrank')) {
    tableBlocks.push({
      tableData: teams.map(
        ({ name, logo, win, loss, draw, points, lastMatch }) => ({
          name,
          logo,
          win,
          loss,
          draw,
          points,
          lastMatch,
        })
      ),
      tableName: 'Team Ranking',
    })
  }
  if (selectedCategory === 'player' && selectedMulti.length > 0) {
    const allPlayers = teams.flatMap((team) =>
      team.players.map((player) => ({ ...player, team: team.name }))
    )
    if (selectedMulti.includes('scorer')) {
      tableBlocks.push({
        tableData: [...allPlayers]
          .sort((a, b) => (b.scores || 0) - (a.scores || 0))
          .slice(0, 10)
          .map(({ name, image, team, number, position, scores }) => ({
            name: number ? `${name} (${number})` : name,
            image,
            team,
            position,
            scores,
          })),
        tableName: 'Leader Scorer',
      })
    }
    if (selectedMulti.includes('threept')) {
      tableBlocks.push({
        tableData: [...allPlayers]
          .sort((a, b) => (b.threePoints || 0) - (a.threePoints || 0))
          .slice(0, 10)
          .map(({ name, image, team, number, position, threePoints }) => ({
            name: number ? `${name} (${number})` : name,
            image,
            team,
            position,
            threePoints,
          })),
        tableName: '3PT Leader',
      })
    }
    if (selectedMulti.includes('ft')) {
      tableBlocks.push({
        tableData: [...allPlayers]
          .sort((a, b) => (b.ftm || 0) - (a.ftm || 0))
          .slice(0, 10)
          .map(({ name, image, team, number, position, ftm }) => ({
            name: number ? `${name} (${number})` : name,
            image,
            team,
            position,
            ftm,
          })),
        tableName: 'FT Leader',
      })
    }
    if (selectedMulti.includes('mvp')) {
      tableBlocks.push({
        tableData: [...allPlayers]
          .sort(
            (a, b) =>
              (b.scores || 0) +
              (b.assists || 0) +
              (b.rebounds || 0) +
              (b.blocks || 0) +
              (b.steals || 0) -
              ((a.scores || 0) +
                (a.assists || 0) +
                (a.rebounds || 0) +
                (a.blocks || 0) +
                (a.steals || 0))
          )
          .slice(0, 10)
          .map(
            ({
              name,
              image,
              team,
              number,
              position,
              scores,
              assists,
              rebounds,
              blocks,
              steals,
            }) => ({
              name: number ? `${name} (${number})` : name,
              image,
              team,
              position,
              scores,
              assists,
              rebounds,
              blocks,
              steals,
            })
          ),
        tableName: 'Most Valuable Player',
      })
    }
    // Add more player-based rankings as needed
  }

  return (
    <>
      <PageMeta title="BHK League" description="BHK League" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <SingleMultiSelect
            categoryLabel="Category"
            subcategoriesLabel="Subcategories"
            options={categoryOptions}
            multiOptions={multiListOptions}
            onSelectChange={setSelectedCategory}
            onMultiChange={setSelectedMulti}
          />
        </div>
        {tableBlocks.map((block, idx) => (
          <div className="col-span-12" key={block.tableName + idx}>
            <DynamicTable
              tableData={block.tableData}
              tableName={block.tableName}
            />
          </div>
        ))}
      </div>
    </>
  )
}
