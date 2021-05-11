import { Activity } from ".prisma/client"
import { invalidateQuery, useMutation } from "@blitzjs/core"
import dayjs from "dayjs"
import { FC, useEffect, useState } from "react"
import { FaTimes } from "react-icons/fa"
import formatSeconds from "../helper/format-seconds"
import deleteActivity from "../mutations/delete-activity"
import startClockOnActivity from "../mutations/start-clock-on-activity"
import getActivitiesForNamespaceAndCurrentUser from "../queries/get-activities-for-namespace-and-current-user"

interface ActivityProps {
  activity: Activity
  highlighted?: boolean
}

const ActivityCard: FC<ActivityProps> = ({ activity, highlighted }) => {
  const [deleteActivityMutation] = useMutation(deleteActivity)
  const [addedSeconds, setAddedSeconds] = useState(0)
  const [startClockOnActivityMutation] = useMutation(startClockOnActivity)

  const deleteActivityFn = async () => {
    await deleteActivityMutation({
      activityId: activity.id,
    })
    invalidateQuery(getActivitiesForNamespaceAndCurrentUser)
  }

  const startClockFn = async () => {
    await startClockOnActivityMutation({
      activityId: activity.id,
    })
    invalidateQuery(getActivitiesForNamespaceAndCurrentUser)
  }

  useEffect(() => {
    const startDate = activity.clockStartedAt
    if (startDate) {
      const interval = setInterval(() => {
        setAddedSeconds(dayjs().diff(startDate, "seconds"))
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
      onClick={startClockFn}
    >
      <button
        className="opacity-0 group-hover:opacity-100 absolute right-4 top-4"
        onClick={deleteActivityFn}
      >
        <FaTimes />
      </button>
      <h2 className="text-3xl">{formatSeconds(activity.clockSeconds ?? 0 + addedSeconds)}</h2>
      <h3 className="mt-2">{activity.name}</h3>
    </button>
  )
}

export default ActivityCard
