import { Activity } from ".prisma/client"
import { invalidateQuery, useMutation } from "@blitzjs/core"
import { FC, useEffect, useState } from "react"
import { FaTimes } from "react-icons/fa"
import formatSeconds from "../helper/format-seconds"
import getSecondsSinceDate from "../helper/get-seconds-since-date"
import deleteActivity from "../mutations/delete-activity"
import startClockOnActivity from "../mutations/start-clock-on-activity"
import stopClockForCurrentUser from "../mutations/stop-clock-for-current-user"
import getActivityWithRunningClock from "../queries/get-activity-with-running-clock"
import getNamespaceWithActivities from "../queries/get-namespace-with-activities"

interface ActivityProps {
  activity: Activity
  highlighted?: boolean
  afterMutate?(): void
}

const ActivityCard: FC<ActivityProps> = ({ activity, highlighted, afterMutate }) => {
  const [deleteActivityMutation] = useMutation(deleteActivity)
  const [addedSeconds, setAddedSeconds] = useState(
    activity.clockStartedAt ? getSecondsSinceDate(activity.clockStartedAt) : 0
  )
  const [startClockOnActivityMutation] = useMutation(startClockOnActivity)
  const [stopClock] = useMutation(stopClockForCurrentUser)

  const deleteActivityFn = async () => {
    await deleteActivityMutation({
      activityId: activity.id,
    })
    invalidateQuery(getNamespaceWithActivities)
  }

  const toggleClock = async () => {
    if (activity.clockStartedAt) {
      await stopClock()
    } else {
      await startClockOnActivityMutation({
        activityId: activity.id,
      })
    }
    afterMutate?.()
    invalidateQuery(getActivityWithRunningClock)
    invalidateQuery(getNamespaceWithActivities)
  }

  useEffect(() => {
    const startDate = activity.clockStartedAt
    if (startDate) {
      const interval = setInterval(() => {
        setAddedSeconds(getSecondsSinceDate(startDate))
      }, 5 * 1000)
      return () => clearInterval(interval)
    }
  }, [activity.clockStartedAt])

  return (
    <button
      className={`group text-left block px-5 py-3 ${
        highlighted ? "bg-teal-900" : "bg-gray-800"
      } rounded-lg transition-all transform hover:scale-105 hover:shadow-lg ${
        activity.clockStartedAt ? "ring-2 ring-teal-600" : ""
      }`}
      key={activity.id}
      onClick={toggleClock}
    >
      <button
        className="opacity-0 group-hover:opacity-100 absolute right-4 top-4"
        onClick={deleteActivityFn}
      >
        <FaTimes />
      </button>
      <h2 className="text-3xl">{formatSeconds(activity.clockSeconds + addedSeconds)}</h2>
      <h3 className="mt-2">{activity.name}</h3>
    </button>
  )
}

export default ActivityCard
