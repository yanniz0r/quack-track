import { AuthenticationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

interface Filter {
  namespaceId?: number
}

export default async function getActivitiesForNamespaceAndCurrentUser(filter: Filter, ctx: Ctx) {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser) throw new AuthenticationError("User has to be signed in to fetch namespaces")

  if (!filter.namespaceId) {
    return []
  }

  const namespaces = await db.activity.findMany({
    where: {
      namespaceId: filter.namespaceId,
    },
  })

  return namespaces
}
