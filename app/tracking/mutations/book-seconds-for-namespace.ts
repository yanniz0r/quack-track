import { AuthenticationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"
import getBookedClockSeconds from "../helper/get-booked-clock-seconds"

interface BookSecondsForNamespaceData {
  namespaceId: number
}

const bookSecondsForNamespace = async (data: BookSecondsForNamespaceData, ctx: Ctx) => {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser)
    throw new AuthenticationError("User has to be signed in to create a new namespace")

  const namespace = await db.namespace.findFirst({
    where: {
      id: data.namespaceId,
      user: {
        id: currentUser.id,
      },
    },
    include: {
      activities: {
        where: {
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
  })

  if (!namespace) {
    return
  }

  for (const activity of namespace?.activities) {
    await db.activity.update({
      data: {
        clockStartedAt: null,
        bookedClockSeconds: getBookedClockSeconds(activity),
        clockSeconds: 0,
      },
      where: {
        id: activity.id,
      },
    })
  }
}

export default bookSecondsForNamespace
