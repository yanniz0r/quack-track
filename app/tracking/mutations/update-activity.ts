import { AuthorizationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"
interface UpdateActivityData {
  activityId: number
  name?: string
}

const updateActivity = async (data: UpdateActivityData, ctx: Ctx) => {
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
      `Current user is not allowed to update activity with id ${data.activityId}.`
    )
  }

  await db.activity.update({
    where: {
      id: activity.id,
    },
    data: {
      name: data.name,
    },
  })
}

export default updateActivity
