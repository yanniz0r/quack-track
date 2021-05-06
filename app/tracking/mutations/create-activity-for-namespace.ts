import { Ctx } from "blitz"
import db from "db"
interface CreateActivityData {
  name: string
  namespaceId: number
}

const createActivityForNamespace = async (data: CreateActivityData, ctx: Ctx) => {
  await db.activity.create({
    data: {
      name: data.name,
      namespaceId: data.namespaceId,
    },
  })
}

export default createActivityForNamespace
