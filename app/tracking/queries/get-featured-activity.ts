import { AuthenticationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

export default async function getFeaturedActivity(data: null, ctx: Ctx) {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser)
    throw new AuthenticationError("User has to be signed in to fetch featured activity")

  const activityWithRunningClock = await db.activity.findFirst({
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

  if (activityWithRunningClock) return activityWithRunningClock

  return db.activity.findFirst({
    include: {
      namespace: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })
}
