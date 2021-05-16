import { AuthenticationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

export default async function getActivityWithRunningClock(data: null, ctx: Ctx) {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser)
    throw new AuthenticationError("User has to be signed in to fetch activity with running clock")

  const activity = await db.activity.findFirst({
    include: {
      namespace: true,
    },
    where: {
      clockStartedAt: {
        not: null,
      },
      namespace: {
        user: {
          id: currentUser.id,
        },
      },
    },
  })

  return activity
}
