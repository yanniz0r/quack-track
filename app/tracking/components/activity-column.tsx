import { useQuery } from "@blitzjs/core"
import { FC } from "react"
import getActivitiesForNamespaceAndCurrentUser from "../queries/get-activities-for-namespace-and-current-user"

interface ActivityColumnProps {
  selectedNamespaceId?: number
  onActivitySelect(activityId: number): void
  selectedActivityId?: number
}

const ActivityColumn: FC<ActivityColumnProps> = ({ selectedNamespaceId, onActivitySelect }) => {
  const [activities] = useQuery(getActivitiesForNamespaceAndCurrentUser, {
    namespaceId: selectedNamespaceId,
  })
  return (
    <>
      {activities.map((activity) => (
        <button
          className="block px-5 py-3"
          key={activity.id}
          onClick={() => onActivitySelect(activity.id)}
        >
          <h2>{activity.name}</h2>
        </button>
      ))}
    </>
  )
}

export default ActivityColumn
