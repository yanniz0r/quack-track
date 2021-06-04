import { Link, Routes, useParam, useQuery } from "@blitzjs/core"
import { FC, ReactNode, Suspense, useState } from "react"
import { FaPlus, FaSearch } from "react-icons/fa"
import getCurrentUser from "../../users/queries/getCurrentUser"
import CreateNamespaceModal from "../components/create-namespace-modal"
import NamespaceColumn, { NamespaceColumnSkeleton } from "../components/namespace-column"
import SearchModal from "../components/search-modal"

const Userinfo: FC = () => {
  const [currentUser] = useQuery(getCurrentUser, null)

  if (!currentUser) return null

  return (
    <div className="h-full border-b border-gray-800 flex items-center">
      <div className="px-4 flex-col flex">
        <span className="font-bold">{currentUser.name}</span>
        <span className="text-gray-600 font-bold text-xs uppercase">Basic</span>
      </div>
      <div className="pr-4">
        <div className="h-12 w-12 rounded-full flex justify-center items-center text-xl font-bold bg-pink-700">
          {currentUser.name[0].toUpperCase()}
        </div>
      </div>
    </div>
  )
}

interface TrackingLayoutProps {
  modals?: ReactNode
}

const TrackingLayout: FC<TrackingLayoutProps> = ({ children, modals }) => {
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
            <Link href={Routes.TrackingOverview()}>
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
          <div className="h-16 flex flex-row">
            <div className="bg-gray-800 flex h-full flex-grow">
              <button
                className="px-7 w-full text-lg flex flex-row items-center"
                onClick={() => setSearchModalOpen(true)}
              >
                <FaSearch className="mr-3" />
                <span>Schnellsuche</span>
              </button>
            </div>
            <Suspense fallback={null}>
              <Userinfo />
            </Suspense>
          </div>
          <div className="relative flex-grow ">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default TrackingLayout
