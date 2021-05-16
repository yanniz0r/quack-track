import { Ctx } from "blitz"
import db from "db"
import getBookedClockSeconds from "../helper/get-booked-clock-seconds"
import getSecondsSinceDate from "../helper/get-seconds-since-date"

interface BookSecondsForActivityData {
  activityId: number
}

const bookSecondsForActivity = async (data: BookSecondsForActivityData, ctx: Ctx) => {
  const activity = await db.activity.findUnique({
    where: {
      id: data.activityId,
    },
  })
  if (!activity) {
    throw new Error("Could not find activity")
  }
  await db.activity.update({
    where: {
      id: activity.id,
    },
    data: {
      bookedClockSeconds: getBookedClockSeconds(activity),
      clockSeconds: 0,
      clockStartedAt: null,
    },
  })
}

export default bookSecondsForActivity
