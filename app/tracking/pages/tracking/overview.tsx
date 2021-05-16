import { BlitzPage, useQuery } from "@blitzjs/core"
import { FC, Suspense } from "react"
import TrackingPage from "../../components/tracking-page"
import formatSeconds from "../../helper/format-seconds"
import getSecondsSinceDate from "../../helper/get-seconds-since-date"
import getOverviewForCurrentUser from "../../queries/get-overview-for-current-user"

const Overview: FC = () => {
  const [namespaces] = useQuery(getOverviewForCurrentUser, null)
  return (
    <>
      {namespaces.map((namespace, index) => (
        <div className="bg-gray-800 rounded-xl shadow-md mb-5" key={index}>
          <div className="p-5">
            <h2 className="text-3xl">{namespace.name}</h2>
          </div>
          <table className="table-auto w-full">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="w-4/5 text-left px-5 py-2 text-gray-500 uppercase text-sm font-normal">
                  Aktivität
                </th>
                <th className="w-1/5 text-right px-5 py-2 text-gray-500 uppercase text-sm font-normal">
                  Zeit
                </th>
              </tr>
            </thead>
            <tbody>
              {namespace.activities.map((activity, index) => (
                <tr className="border-b border-gray-700" key={index}>
                  <th className="text-left px-5 py-2">{activity.name}</th>
                  <th className="text-right px-5 py-2">
                    {formatSeconds(
                      activity.clockSeconds +
                        (activity.clockStartedAt ? getSecondsSinceDate(activity.clockStartedAt) : 0)
                    )}
                  </th>
                </tr>
              ))}
              <tr>
                <th className="text-right text-gray-400 text-sm">Gesamt</th>
                <th className="text-right pr-5 py-2 text-teal-400">
                  {formatSeconds(
                    namespace.activities.reduce((previous, current) => {
                      return (
                        previous +
                        current.clockSeconds +
                        (current.clockStartedAt ? getSecondsSinceDate(current.clockStartedAt) : 0)
                      )
                    }, 0)
                  )}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </>
  )
}

const TrackingOverview: BlitzPage = () => {
  return (
    <TrackingPage>
      <div className="p-7">
        <h1 className="text-white text-6xl font-semibold mb-7">Übersicht</h1>
        <p className="text-lg mb-10">Hier findest du eine Übersicht über deine erfasste Zeit.</p>
        <Suspense fallback="Loadyload">
          <Overview />
        </Suspense>
      </div>
    </TrackingPage>
  )
}

export default TrackingOverview
