import { invalidateQuery, Link, Routes, useMutation, useQuery } from "@blitzjs/core"
import { FC, Suspense, useCallback, useEffect, useState } from "react"
import { FaClock, FaPlay, FaStop } from "react-icons/fa"
import EditableContent from "../../../core/components/editable-content"
import TrackingLayout from "../../layouts/tracking-layout"
import formatSeconds from "../../helper/format-seconds"
import getSecondsSinceDate from "../../helper/get-seconds-since-date"
import stopClockForCurrentUser from "../../mutations/stop-clock-for-current-user"
import updateActivity from "../../mutations/update-activity"
import Head from "next/head"
import useTitleWithActivityIndicator from "../../hooks/use-title-with-activity-indicator"
import getFeaturedActivity from "../../queries/get-featured-activity"
import startClockOnActivity from "../../mutations/start-clock-on-activity"
import getActivityWithRunningClock from "../../queries/get-activity-with-running-clock"
import getRecentActivities from "../../queries/get-recent-activities"
import ActivityCard from "../../components/activity-card"
import { Namespace } from ".prisma/client"

const CIRCLE_SIZE = 85
const CIRCLE_STROKE = 4
const CIRCLE_RADIUS = CIRCLE_SIZE / 2 - CIRCLE_STROKE
const CIRCUMFERENCE = CIRCLE_RADIUS * 2 * Math.PI

const RunningClock: FC = () => {
  const [stopClockMutation] = useMutation(stopClockForCurrentUser)
  const [activity] = useQuery(getFeaturedActivity, null)
  const [updateActivityMutation] = useMutation(updateActivity)
  const [startClockOnActivityMutation] = useMutation(startClockOnActivity)
  const [addedSeconds, setAddedSeconds] = useState(
    activity?.clockStartedAt ? getSecondsSinceDate(activity.clockStartedAt) : 0
  )
  const title = useTitleWithActivityIndicator("Dashboard")

  const isClockRunning = Boolean(activity?.clockStartedAt)

  const toggleClock = useCallback(() => {
    if (!activity) return
    const action = activity.clockStartedAt
      ? stopClockMutation()
      : startClockOnActivityMutation({
          activityId: activity.id,
        })
    action.then(() => {
      invalidateQuery(getFeaturedActivity)
      invalidateQuery(getActivityWithRunningClock)
      setAddedSeconds(0)
    })
  }, [stopClockMutation, isClockRunning])

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
            <svg
              width={CIRCLE_SIZE}
              height={CIRCLE_SIZE}
              className={`${isClockRunning ? "opacity-100" : "opacity-0"} transition-all`}
            >
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
              onClick={toggleClock}
              className={`flex absolute right-0 top-0 items-center justify-center border-2 font-bold  rounded-full h-7 w-7 text-xs transition-all ${
                isClockRunning ? "border-red-500 text-red-500" : "border-green-500 text-green-500"
              }`}
            >
              {isClockRunning ? <FaStop /> : <FaClock />}
            </button>
            <h4 className="uppercase text-gray-400">
              {isClockRunning ? "Laufende Uhr" : "Letzte Aktivität"}
            </h4>
            <h3 className="text-3xl pt-1">
              <EditableContent
                onChange={async (newName) => {
                  await updateActivityMutation({
                    activityId: activity.id,
                    name: newName,
                  })
                  invalidateQuery(getFeaturedActivity)
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

const RecentActivities: FC = () => {
  const [recentActivities] = useQuery(getRecentActivities, null)
  const [selectedNamespace, setSelectedNamespace] = useState<number>()

  const namespaces: Record<number, Namespace> = {}
  recentActivities.forEach((activity) => {
    if (!namespaces[activity.namespace.id]) {
      namespaces[activity.namespace.id] = activity.namespace
    }
  })

  return (
    <div>
      <div className="flex flex-row mb-4">
        {Object.values(namespaces).map((namespace) => (
          <button
            onClick={() => {
              setSelectedNamespace(namespace.id === selectedNamespace ? undefined : namespace.id)
            }}
            className={`mr-2 p-2 border border-yellow-400 rounded-lg text-yellow-400 transition-all ${
              typeof selectedNamespace !== "undefined" &&
              selectedNamespace !== namespace.id &&
              "opacity-50"
            }`}
          >
            {namespace.name}
          </button>
        ))}
      </div>
      <div className="flex flex-row flex-wrap">
        {recentActivities.map((activity) => (
          <Link
            href={Routes.TrackingNamespace({
              namespaceId: activity.namespaceId,
              activity: activity.id,
            })}
          >
            <a
              className={`px-4 py-2 bg-gray-800 rounded-lg mr-2 mb-2 flex flex-row items-center transition-all ${
                typeof selectedNamespace !== "undefined" &&
                selectedNamespace !== activity.namespaceId &&
                "bg-opacity-50"
              }`}
            >
              {activity.name} <div className="rounded-full bg-yellow-500 w-2 h-2 ml-3" />
            </a>
          </Link>
        ))}
      </div>
    </div>
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

        <h2 className="text-white text-3xl font-semibold my-7">Letzte Aktivitäten</h2>
        <Suspense fallback="Loading...">
          <RecentActivities />
        </Suspense>
      </div>
    </TrackingLayout>
  )
}

export default TrackingDashboard
