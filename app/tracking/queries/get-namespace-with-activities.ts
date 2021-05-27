import { AuthenticationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

interface Filter {
  namespaceId?: number
}

export default async function getNamespaceWithActivities(filter: Filter, ctx: Ctx) {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser) throw new AuthenticationError("User has to be signed in to fetch namespaces")

  if (!filter.namespaceId) {
    throw Error("Namespace does not exist")
  }

  const namespace = await db.namespace.findUnique({
    where: {
      id: filter.namespaceId,
    },
    include: {
      activities: {
        orderBy: {
          id: "asc",
        },
      },
    },
  })
  if (!namespace) {
    throw Error("Namespace does not exist")
  }
  if (namespace.userId !== currentUser.id) {
    throw Error("Namespace does not belong to the current user")
  }

  return namespace
}
