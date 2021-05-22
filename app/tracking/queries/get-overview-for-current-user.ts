import { AuthenticationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

export default async function getOverviewForCurrentUser(_ = null, ctx: Ctx) {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser) throw new AuthenticationError("User has to be signed in to fetch namespaces")

  const namespaces = await db.namespace.findMany({
    where: {
      user: {
        id: currentUser.id,
      },
      activities: {
        some: {
          OR: [
            {
              clockSeconds: {
                not: 0,
              },
            },
            {
              clockStartedAt: {
                not: null,
              },
            },
          ],
        },
      },
    },
    include: {
      activities: {
        select: {
          id: true,
          name: true,
          clockSeconds: true,
          clockStartedAt: true,
        },
      },
    },
  })

  return namespaces
}
