import { FC, ReactNode, Suspense, useState } from "react"
import { FaPlusCircle, FaSearch } from "react-icons/fa"
import CreateNamespaceModal from "./create-namespace-modal"
import NamespaceColumn, { NamespaceColumnSkeleton } from "./namespace-column"
import SearchModal from "./search-modal"

interface TrackingPageProps {
  modals?: ReactNode
}

const TrackingPage: FC<TrackingPageProps> = ({ children, modals }) => {
  const [createNamespaceModalOpen, setCreateNamespaceModalOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  const [selectedNamespaceId, setSelectedNamespaceId] = useState<number>()

  return (
    <div className="bg-gray-900 text-gray-300">
      <CreateNamespaceModal open={createNamespaceModalOpen} setOpen={setCreateNamespaceModalOpen} />
      <SearchModal open={searchModalOpen} setOpen={setSearchModalOpen} />
      {modals}
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
        <div className="flex-grow">
          <div className="bg-gray-800">
            <button
              className="p-5 w-full text-lg flex flex-row items-center"
              onClick={() => setSearchModalOpen(true)}
            >
              <FaSearch className="mr-3" />
              <span>Schnellsuche</span>
            </button>
          </div>
          <div className="relative h-full">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default TrackingPage
