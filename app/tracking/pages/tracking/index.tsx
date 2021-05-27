import { invalidateQuery, useMutation, useQuery } from "@blitzjs/core"
import { FC, Suspense, useCallback, useEffect, useState } from "react"
import { FaStop } from "react-icons/fa"
import EditableContent from "../../../core/components/editable-content"
import TrackingLayout from "../../layouts/tracking-layout"
import formatSeconds from "../../helper/format-seconds"
import getSecondsSinceDate from "../../helper/get-seconds-since-date"
import stopClockForCurrentUser from "../../mutations/stop-clock-for-current-user"
import updateActivity from "../../mutations/update-activity"
import getActivityWithRunningClock from "../../queries/get-activity-with-running-clock"
import Head from "next/head"
import useTitleWithActivityIndicator from "../../hooks/use-title-with-activity-indicator"

const CIRCLE_SIZE = 85
const CIRCLE_STROKE = 4
const CIRCLE_RADIUS = CIRCLE_SIZE / 2 - CIRCLE_STROKE
const CIRCUMFERENCE = CIRCLE_RADIUS * 2 * Math.PI

const RunningClock: FC = () => {
  const [stopClockMutation] = useMutation(stopClockForCurrentUser)
  const [activity] = useQuery(getActivityWithRunningClock, null)
  const [updateActivityMutation] = useMutation(updateActivity)
  const [addedSeconds, setAddedSeconds] = useState(
    activity?.clockStartedAt ? getSecondsSinceDate(activity.clockStartedAt) : 0
  )
  const title = useTitleWithActivityIndicator("Dashboard")

  const stopClock = useCallback(() => {
    stopClockMutation().then(() => {
      invalidateQuery(getActivityWithRunningClock)
    })
  }, [stopClockMutation])

  useEffect(() => {
    if (!activity) {
      return
    }
    const { clockStartedAt } = activity
    if (clockStartedAt) {
      const interval = setInterval(() => {
        const seconds = getSecondsSinceDate(clockStartedAt)
        setAddedSeconds(seconds)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [activity])

  const clockSeconds = activity?.clockSeconds ?? 0
  const progress = (((addedSeconds + clockSeconds) % 60) / 60) * 100
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {activity && (
        <div className="bg-gray-800 p-5 rounded-xl shadow-md flex">
          <div className="flex items-center relative">
            <svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
              <circle
                style={{
                  strokeDasharray: `${CIRCUMFERENCE} ${CIRCUMFERENCE}`,
                }}
                className="text-green-400 stroke-current transition-all"
                strokeWidth={CIRCLE_STROKE}
                strokeDashoffset={offset}
                fill="transparent"
                r={CIRCLE_RADIUS}
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
              />
            </svg>
            <span className="text-2xl text-center absolute block w-full">
              {formatSeconds(addedSeconds + activity.clockSeconds)}
            </span>
          </div>
          <div className="relative flex-grow ml-4">
            <button
              onClick={stopClock}
              className="flex absolute right-0 top-0 items-center justify-center border-red-500 border-2 font-bold text-red-500 rounded-full h-7 w-7 text-xs"
            >
              <FaStop />
            </button>
            <h4 className="uppercase text-gray-400">Laufende Uhr</h4>
            <h3 className="text-3xl pt-1">
              <EditableContent
                onChange={async (newName) => {
                  await updateActivityMutation({
                    activityId: activity.id,
                    name: newName,
                  })
                  invalidateQuery(getActivityWithRunningClock)
                }}
                text={activity.name}
              />
            </h3>
            <span className="bg-green-400 text-gray-800 p-1 px-2 inline-block mt-3 font-bold text-sm rounded-full">
              {activity.namespace.name}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

const TrackingDashboard: FC = () => {
  return (
    <TrackingLayout>
      <div className="p-7">
        <h1 className="text-white text-6xl font-semibold mb-7">Dashboard</h1>
        <Suspense fallback="Loading...">
          <RunningClock />
        </Suspense>
      </div>
    </TrackingLayout>
  )
}

export default TrackingDashboard
