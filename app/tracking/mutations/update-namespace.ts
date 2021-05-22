import { AuthorizationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

interface UpdateNamespaceData {
  namespaceId: number
  name?: string
}

const updateNamespace = async (data: UpdateNamespaceData, ctx: Ctx) => {
  const namespace = await db.namespace.findUnique({
    where: {
      id: data.namespaceId,
    },
  })

  if (!namespace) {
    throw new Error(`Could not find namespace with id ${data.namespaceId}.`)
  }
  const currentUser = await getCurrentUser(null, ctx)

  if (namespace.userId !== currentUser?.id) {
    throw new AuthorizationError(
      `Current user is not allowed to update namespace with id ${data.namespaceId}.`
    )
  }

  await db.namespace.update({
    where: {
      id: namespace.id,
    },
    data: {
      name: data.name,
    },
  })
}

export default updateNamespace
