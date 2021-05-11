import { BlitzPage, useParam, useRouterQuery } from "@blitzjs/core"
import { Suspense, useState } from "react"
import { FaPlus } from "react-icons/fa"
import Activities from "../../../components/activities"
import CreateActivityModal from "../../../components/create-activity-modal"
import TrackingPage from "../../../components/tracking-page"

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
    <TrackingPage modals={modals}>
      {namespaceId && (
        <Suspense fallback="Loading...">
          <Activities
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
    </TrackingPage>
  )
}

export default TrackingNamespace
