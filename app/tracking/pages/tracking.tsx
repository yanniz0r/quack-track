import { BlitzPage } from "@blitzjs/core"
import { Suspense, useEffect, useState } from "react"
import { FaPlusCircle } from "react-icons/fa"
import ActivityColumn from "../components/activity-column"
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
    <>
      <CreateNamespaceModal open={createNamespaceModalOpen} setOpen={setCreateNamespaceModalOpen} />
      <CreateActivityModal
        open={!!selectedNamespaceId && createActivityModalOpen}
        setOpen={setCreateActivityModalOpen}
        selectedNamespaceId={selectedNamespaceId}
      />
      <div className="flex flex-row h-screen">
        <div className="w-1/5 border-r border-gray-100 flex flex-col">
          <div className="p-5">
            <h2 className="uppercase text-sm text-gray-600">Namespaces</h2>
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
        <div className="w-1/5 border-r border-gray-100 flex flex-col">
          <div className="p-5">
            <h2 className="uppercase text-sm text-gray-600">Aktivitäten</h2>
          </div>
          <div className="flex-grow">
            <Suspense fallback="Loading">
              <ActivityColumn
                selectedNamespaceId={selectedNamespaceId}
                selectedActivityId={selectedActivityId}
                onActivitySelect={setSelectedActivityId}
              />
            </Suspense>
          </div>
          <div className="p-5">
            <button
              disabled={!selectedNamespaceId}
              onClick={() => setCreateActivityModalOpen(true)}
              className="p-5 rounded-lg font-semibold flex items-center justify-center bg-teal-500 w-full text-white"
            >
              <FaPlusCircle className="mr-2" /> Activity hinzufügen
            </button>
          </div>
        </div>
        <div className="flex-grow">
          <div className="p-5">
            <h2 className="uppercase text-sm text-gray-600">Zeiterfassung</h2>
          </div>
          {selectedActivityId ? (
            <div className="p-5">
              <div className="flex w-full flex-row justify-center">
                <h1 className="text-5xl">
                  <span>1</span> <small className="text-gray-500">Stunde</small> <span>26</span>{" "}
                  <small className="text-gray-500">Minuten</small>
                </h1>
              </div>
              <button className="bg-teal-500 text-white font-bold px-5 py-2">Stoppen</button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div>
                <h1 className="text-3xl text-center mb-7">Wähle eine Aktivität aus</h1>
                <p className="text-lg text-gray-600">
                  Um die Zeiterfassung zu starten, musst du zunächst ein Projekt und eine Aktivität
                  auswählen.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Test
