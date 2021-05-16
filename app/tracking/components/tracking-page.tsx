import { Link, Routes, useParam } from "@blitzjs/core"
import { FC, ReactNode, Suspense, useState } from "react"
import { FaPlus, FaSearch } from "react-icons/fa"
import CreateNamespaceModal from "./create-namespace-modal"
import NamespaceColumn, { NamespaceColumnSkeleton } from "./namespace-column"
import SearchModal from "./search-modal"

interface TrackingPageProps {
  modals?: ReactNode
}

const TrackingPage: FC<TrackingPageProps> = ({ children, modals }) => {
  const [createNamespaceModalOpen, setCreateNamespaceModalOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const selectedNamespaceId = useParam("namespaceId", "string")

  return (
    <div className="bg-gray-900 text-gray-300">
      <CreateNamespaceModal open={createNamespaceModalOpen} setOpen={setCreateNamespaceModalOpen} />
      <SearchModal open={searchModalOpen} setOpen={setSearchModalOpen} />
      {modals}
      <div className="flex flex-row min-h-screen">
        <div className="w-1/4 xl:w-1/6 flex-shrink-0 border-r border-gray-800 flex flex-col">
          <div className="h-16 px-3 flex items-center justify-center">
            <img alt="Logo" src="/images/logo.png" />
          </div>
          <div className="p-2">
            <Link href={Routes.TrackingDashboard()}>
              <a className="block p-3 hover:bg-gray-800 rounded-xl">Dashboard</a>
            </Link>
            <Link href={Routes.TrackingDashboard()}>
              <a className="block p-3 hover:bg-gray-800 rounded-xl">Zeitübersicht</a>
            </Link>
          </div>
          <div className="px-5 pb-2 pt-5">
            <h2 className="uppercase text-sm text-gray-400 bg-opacity-0 flex justify-between">
              <span>Namespaces</span>
              <button
                className="bg-teal-500 bg-opacity-0 hover:bg-opacity-100 transition-all text-white h-5 w-5 flex text-xs items-center justify-center rounded-full"
                onClick={() => setCreateNamespaceModalOpen(true)}
              >
                <FaPlus />
              </button>
            </h2>
          </div>
          <div className="flex-grow">
            <Suspense fallback={<NamespaceColumnSkeleton />}>
              <NamespaceColumn
                selectedNamespaceId={
                  selectedNamespaceId ? parseInt(selectedNamespaceId) : undefined
                }
              />
            </Suspense>
          </div>
        </div>
        <div className="min-h-screen flex-grow flex flex-col">
          <div className="bg-gray-800 flex">
            <button
              className="h-16 px-7 w-full text-lg flex flex-row items-center"
              onClick={() => setSearchModalOpen(true)}
            >
              <FaSearch className="mr-3" />
              <span>Schnellsuche</span>
            </button>
          </div>
          <div className="relative flex-grow ">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default TrackingPage
