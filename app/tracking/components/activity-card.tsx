import { Activity } from ".prisma/client"
import { invalidateQuery, useMutation } from "@blitzjs/core"
import { FC, useEffect, useState } from "react"
import { FaClock, FaDumpster, FaTimes, FaTrash } from "react-icons/fa"
import EditableContent from "../../core/components/editable-content"
import formatSeconds from "../helper/format-seconds"
import getSecondsSinceDate from "../helper/get-seconds-since-date"
import deleteActivity from "../mutations/delete-activity"
import startClockOnActivity from "../mutations/start-clock-on-activity"
import stopClockForCurrentUser from "../mutations/stop-clock-for-current-user"
import updateActivity from "../mutations/update-activity"
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
  const [updateActivityMutation] = useMutation(updateActivity)

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

  const changeTime = async (value: string) => {
    const regexp = /((?<hours>\d+):)?(?<minutes>\d+)/
    const match = value.match(regexp)
    if (!match) return;
    const [, hoursString, , minutesString] = match
    const hours = parseInt(hoursString) || 0;
    let minutes = parseInt(minutesString)
    console.log({ hours, minutes, match })

    minutes += hours * 60;
    const clockSeconds = minutes * 60;
    if (Number.isNaN(clockSeconds)) return
    await updateActivityMutation({
      activityId: activity.id,
      clockSeconds,
    })
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
    <div
      className={`group text-left block p-4 ${
        highlighted ? "bg-teal-900" : "bg-gray-800"
      } rounded-lg transition-all transform hover:shadow-lg ${
        activity.clockStartedAt ? "ring-2 ring-teal-600" : ""
      }`}
      key={activity.id}
    >
      {/* <button
        className="opacity-0 group-hover:opacity-100 absolute right-4 top-4"
        onClick={deleteActivityFn}
      >
        <FaTimes />
      </button> */}
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl">
          <EditableContent text={formatSeconds(activity.clockSeconds + addedSeconds)} onChange={changeTime} />
        </h2>
        <button
          className="opacity-0 ml-3 flex-shrink-0 transition-all group-hover:opacity-100 bg-white h-9 w-9 text-green-400 flex justify-center items-center rounded-full"
          onClick={toggleClock}
        >
          <FaClock />
        </button>
        <button
          className="absolute bottom-4 right-4 opacity-0 ml-3 flex-shrink-0 transition-all group-hover:opacity-100 bg-white h-9 w-9 text-red-500 flex justify-center items-center rounded-full"
          onClick={deleteActivityFn}
        >
          <FaTrash />
        </button>
      </div>
      <h3 className="mt-2">{activity.name}</h3>
    </div>
  )
}

export default ActivityCard
