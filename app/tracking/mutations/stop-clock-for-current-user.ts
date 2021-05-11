import { AuthenticationError, Ctx } from "blitz"
import Dayjs from "dayjs"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

const stopClockForCurrentUser = async (data: null, ctx: Ctx) => {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser)
    throw new AuthenticationError("User has to be signed in to create a new namespace")

  const activityWithRunningClock = await db.activity.findFirst({
    where: {
      namespace: {
        user: {
          id: currentUser.id,
        },
      },
      clockStartedAt: {
        not: null,
      },
    },
  })

  if (!activityWithRunningClock) {
    return
  }

  const addedSeconds = Dayjs().diff(activityWithRunningClock.clockStartedAt!, "seconds")
  await db.activity.update({
    where: {
      id: activityWithRunningClock.id,
    },
    data: {
      clockStartedAt: null,
      clockSeconds: activityWithRunningClock.clockSeconds + addedSeconds,
    },
  })
}

export default stopClockForCurrentUser
