import { AuthenticationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

export default async function getRecentActivities(_ = null, ctx: Ctx) {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser) throw new AuthenticationError("User has to be signed in to fetch namespaces")

  const activities = await db.activity.findMany({
    where: {
      namespace: {
        user: {
          id: currentUser.id,
        },
      },
    },
    include: {
      namespace: true,
    },
    take: 16,
    orderBy: {
      updatedAt: "desc",
    },
  })

  return activities
}
