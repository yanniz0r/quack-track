import { AuthorizationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"
import Dayjs from "dayjs"

interface StartClockOnActivityData {
  activityId: number
}

const startClockOnActivity = async (data: StartClockOnActivityData, ctx: Ctx) => {
  const activity = await db.activity.findUnique({
    where: {
      id: data.activityId,
    },
    include: {
      namespace: {
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })

  if (!activity) {
    throw new Error(`Could not find activity with id ${data.activityId}.`)
  }
  const currentUser = await getCurrentUser(null, ctx)

  if (activity.namespace.user.id !== currentUser?.id) {
    throw new AuthorizationError(
      `Current user is not allowed to start clock on activity with id ${data.activityId}.`
    )
  }

  const activitiesWithRunningClock = await db.activity.findMany({
    where: {
      clockStartedAt: {
        not: null,
      },
    },
  })

  for (const activityWithRunningClock of activitiesWithRunningClock) {
    const addedSeconds = Dayjs().diff(activityWithRunningClock.clockStartedAt!, "seconds")
    await db.activity.update({
      where: {
        id: activityWithRunningClock.id,
      },
      data: {
        clockSeconds: activityWithRunningClock.clockSeconds + addedSeconds,
        clockStartedAt: null,
      },
    })
  }

  await db.activity.update({
    where: {
      id: activity.id,
    },
    data: {
      clockStartedAt: new Date(),
    },
  })
}

export default startClockOnActivity
