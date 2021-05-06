import { useQuery } from "@blitzjs/core"
import { FC } from "react"
import getActivitiesForNamespaceAndCurrentUser from "../queries/get-activities-for-namespace-and-current-user"
import ActivityCard from "./activity-card"

interface ActivityColumnProps {
  selectedNamespaceId?: number
}

const Activities: FC<ActivityColumnProps> = ({ selectedNamespaceId }) => {
  const [activities] = useQuery(getActivitiesForNamespaceAndCurrentUser, {
    namespaceId: selectedNamespaceId,
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 p-6">
      {activities.map((activity) => (
        <ActivityCard activity={activity} />
      ))}
    </div>
  )
}

export default Activities
