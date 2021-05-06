import { BlitzPage } from "@blitzjs/core"
import { Suspense, useEffect, useState } from "react"
import { FaPlus, FaPlusCircle } from "react-icons/fa"
import Activities from "../components/activities"
import CreateActivityModal from "../components/create-activity-modal"
import CreateNamespaceModal from "../components/create-namespace-modal"
import NamespaceColumn, { NamespaceColumnSkeleton } from "../components/namespace-column"

const Test: BlitzPage = () => {
  const [createNamespaceModalOpen, setCreateNamespaceModalOpen] = useState(false)
  const [createActivityModalOpen, setCreateActivityModalOpen] = useState(false)
  const [selectedNamespaceId, setSelectedNamespaceId] = useState<number>()
  const [selectedActivityId, setSelectedActivityId] = useState<number>()

  useEffect(() => {
    setSelectedActivityId(undefined)
  }, [selectedNamespaceId])

  return (
    <div className="bg-gray-900 text-gray-300">
      <CreateNamespaceModal open={createNamespaceModalOpen} setOpen={setCreateNamespaceModalOpen} />
      <CreateActivityModal
        open={!!selectedNamespaceId && createActivityModalOpen}
        setOpen={setCreateActivityModalOpen}
        selectedNamespaceId={selectedNamespaceId}
      />
      <div className="flex flex-row h-screen">
        <div className="w-1/5 border-r border-gray-800 flex flex-col">
          <div className="p-5">
            <h2 className="uppercase text-sm text-gray-400">Namespaces</h2>
          </div>
          <div className="flex-grow">
            <Suspense fallback={<NamespaceColumnSkeleton />}>
              <NamespaceColumn
                onNamespaceSelect={setSelectedNamespaceId}
                selectedNamespaceId={selectedNamespaceId}
              />
            </Suspense>
          </div>
          <div>
            <div className="p-5">
              <button
                onClick={() => setCreateNamespaceModalOpen(true)}
                className="rounded-lg font-semibold p-5 flex items-center justify-center bg-teal-500 w-full text-white"
              >
                <FaPlusCircle className="mr-2" /> Namespace hinzufügen
              </button>
            </div>
          </div>
        </div>
        <div className="flex-grow relative">
          {selectedNamespaceId && (
            <Suspense fallback="Loading...">
              <Activities selectedNamespaceId={selectedNamespaceId} />
            </Suspense>
          )}
          <button
            onClick={() => setCreateActivityModalOpen(true)}
            className="text-center absolute bottom-10 right-10 h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r flex from-teal-400 to-green-600 transition-all transform hover:scale-105"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Test
