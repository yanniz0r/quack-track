import { Namespace } from ".prisma/client"
import {
  BlitzPage,
  invalidateQuery,
  useMutation,
  useParam,
  useQuery,
  useRouterQuery,
} from "@blitzjs/core"
import { Head } from "blitz"
import { FC, Suspense, useState } from "react"
import { FaPlus } from "react-icons/fa"
import EditableContent from "../../../../core/components/editable-content"
import ActivityCard from "../../../components/activity-card"
import CreateActivityModal from "../../../components/create-activity-modal"
import useTitleWithActivityIndicator from "../../../hooks/use-title-with-activity-indicator"
import TrackingLayout from "../../../layouts/tracking-layout"
import updateNamespace from "../../../mutations/update-namespace"
import getNamespaceWithActivities from "../../../queries/get-namespace-with-activities"
import getNamespacesForCurrentUser from "../../../queries/get-namespaces-for-current-user"

interface NamespaceContentProps {
  selectedNamespaceId: number
  highlightedActivityId?: number
}

const NamespaceContent: FC<NamespaceContentProps> = ({
  selectedNamespaceId,
  highlightedActivityId,
}) => {
  const [namespace] = useQuery(getNamespaceWithActivities, {
    namespaceId: selectedNamespaceId,
  })
  const [updateNamespaceMutation] = useMutation(updateNamespace)
  const title = useTitleWithActivityIndicator(namespace.name)

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="p-6">
        <h1 className="text-white text-6xl font-semibold mb-7">
          <EditableContent
            text={namespace.name}
            onChange={async (newName) => {
              await updateNamespaceMutation({
                namespaceId: selectedNamespaceId,
                name: newName,
              })
              invalidateQuery(getNamespaceWithActivities)
              invalidateQuery(getNamespacesForCurrentUser)
            }}
          />
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {namespace.activities.map((activity) => (
            <ActivityCard activity={activity} highlighted={highlightedActivityId === activity.id} />
          ))}
        </div>
      </div>
    </>
  )
}

const TrackingNamespace: BlitzPage = () => {
  const namespaceIdParameter = useParam("namespaceId") as string
  const namespaceId = parseInt(namespaceIdParameter, 10)

  const [createActivityModalOpen, setCreateActivityModalOpen] = useState(false)

  const query = useRouterQuery()

  const selectedActivityId =
    typeof query["activity"] === "string" ? parseInt(query["activity"], 10) : undefined

  const modals = (
    <CreateActivityModal
      selectedNamespaceId={namespaceId}
      setOpen={setCreateActivityModalOpen}
      open={createActivityModalOpen}
    />
  )

  return (
    <TrackingLayout modals={modals}>
      {namespaceId && (
        <Suspense fallback="Loading...">
          <NamespaceContent
            selectedNamespaceId={namespaceId}
            highlightedActivityId={selectedActivityId}
          />
        </Suspense>
      )}
      <button
        onClick={() => setCreateActivityModalOpen(true)}
        className="text-center absolute bottom-10 right-10 h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r flex from-teal-400 to-green-600 transition-all transform hover:scale-105"
      >
        <FaPlus />
      </button>
    </TrackingLayout>
  )
}

export default TrackingNamespace
