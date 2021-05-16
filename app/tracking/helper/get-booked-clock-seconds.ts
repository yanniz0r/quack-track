import { Activity } from ".prisma/client"
import getSecondsSinceDate from "./get-seconds-since-date"

const getBookedClockSeconds = (activity: Activity) => {
  let bookedClockSeconds = activity.bookedClockSeconds
  bookedClockSeconds += activity.clockSeconds
  if (activity.clockStartedAt) {
    bookedClockSeconds += getSecondsSinceDate(activity.clockStartedAt)
  }
  return bookedClockSeconds
}

export default getBookedClockSeconds
