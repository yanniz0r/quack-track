import { AuthorizationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"
interface DeleteActivityData {
  activityId: number
}

const deleteActivity = async (data: DeleteActivityData, ctx: Ctx) => {
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
      `Current user is not allowed to delete activity with id ${data.activityId}.`
    )
  }

  await db.activity.delete({
    where: {
      id: activity.id,
    },
  })
}

export default deleteActivity
