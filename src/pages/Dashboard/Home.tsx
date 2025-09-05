import NextEvent from '../../components/dashboard/NextEvent'
import MatchResult from '../../components/dashboard/MatchResult'
import TopFiveTeams from '../../components/dashboard/TopFiveTeams'
import PageMeta from '../../components/common/PageMeta'
import { matches } from '../../data/Matches'
import { Match } from '../../model/Match'

export default function Home() {
  // Find the latest match by date
  const lastMatch: Match = matches.reduce((latest, curr) => {
    const latestDate = new Date(latest.date).getTime()
    const currDate = new Date(curr.date).getTime()
    return currDate > latestDate ? curr : latest
  }, matches[0])
  return (
    <>
      <PageMeta
        title="BHK League"
        description="Birmingham HK Midmen Basketball League"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <NextEvent />
        </div>
        <div className="col-span-12">
          <MatchResult match={lastMatch} />
        </div>
        <div className="col-span-12">
          <TopFiveTeams />
        </div>
      </div>
    </>
  )
}
