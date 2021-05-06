import { AuthenticationError, Ctx, invalidateQuery } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

interface CreateNamespaceData {
  name: string
}

const createNamespaceForCurrentUser = async (data: CreateNamespaceData, ctx: Ctx) => {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser)
    throw new AuthenticationError("User has to be signed in to create a new namespace")
  await db.namespace.create({
    data: {
      name: data.name,
      user: {
        connect: {
          id: currentUser?.id,
        },
      },
    },
  })
}

export default createNamespaceForCurrentUser
