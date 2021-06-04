import { AuthenticationError, Ctx } from "blitz"
import db from "db"
import getCurrentUser from "../../users/queries/getCurrentUser"

interface GetSearchResultsData {
  query: string
}

export default async function getSearchResults(data: GetSearchResultsData, ctx: Ctx) {
  const currentUser = await getCurrentUser(null, ctx)
  if (!currentUser) throw new AuthenticationError("User has to be signed in to fetch namespaces")

  const namespaces = await db.namespace.findMany({
    where: {
      userId: currentUser.id,
      name: {
        contains: data.query,
      },
    },
  })

  const activities = await db.activity.findMany({
    where: {
      name: {
        contains: data.query,
      },
      namespace: {
        userId: currentUser.id,
      },
    },
  })

  return {
    activities,
    namespaces,
  }
}
