import { invalidateQuery, useMutation, useQuery } from "@blitzjs/core"
import dayjs from "dayjs"
import { FC, Suspense, useCallback } from "react"
import { FaStop } from "react-icons/fa"
import TrackingPage from "../../components/tracking-page"
import formatSeconds from "../../helper/format-seconds"
import stopClockForCurrentUser from "../../mutations/stop-clock-for-current-user"
import getActivityWithRunningClock from "../../queries/get-activity-with-running-clock"

const RunningClock: FC = () => {
  const [stopClockMutation] = useMutation(stopClockForCurrentUser)
  const [activity] = useQuery(getActivityWithRunningClock, null)

  const stopClock = useCallback(() => {
    stopClockMutation().then(() => {
      invalidateQuery(getActivityWithRunningClock)
    })
  }, [stopClockMutation])

  if (!activity) {
    return null
  }

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-md flex">
      <div className="pr-5 flex items-center">
        <span className="text-4xl">
          {formatSeconds(activity.clockSeconds + dayjs().diff(activity.clockStartedAt!, "seconds"))}
        </span>
      </div>
      <div className="relative flex-grow">
        <button
          onClick={stopClock}
          className="flex absolute right-0 top-0 items-center justify-center border-red-500 border-2 font-bold text-red-500 rounded-full h-7 w-7 text-xs"
        >
          <FaStop />
        </button>
        <h4 className="uppercase text-gray-400">Laufende Uhr</h4>
        <h3 className="text-3xl pt-1">{activity.name}</h3>
      </div>
    </div>
  )
}

const TrackingDashboard: FC = () => {
  return (
    <TrackingPage>
      <div className="p-7">
        <h1 className="text-white text-6xl font-semibold mb-7">Dashboard</h1>
        <Suspense fallback="Loading...">
          <RunningClock />
        </Suspense>
      </div>
    </TrackingPage>
  )
}

export default TrackingDashboard
