import { AuthenticationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

export default async function getNamespacesForCurrentUser(_ = null, ctx: Ctx) {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser) throw new AuthenticationError("User has to be signed in to fetch namespaces")

  const namespaces = await db.namespace.findMany()

  return namespaces
}
