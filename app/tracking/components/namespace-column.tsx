import { Link, Routes, useQuery } from "@blitzjs/core"
import { FC } from "react"
import getNamespacesForCurrentUser from "../queries/get-namespaces-for-current-user"

interface NamespaceColumnProps {
  selectedNamespaceId?: number
}

const NamespaceColumn: FC<NamespaceColumnProps> = (props) => {
  const [namespaces] = useQuery(getNamespacesForCurrentUser, null)
  return (
    <>
      {namespaces.map((namespace) => (
        <div className="px-2" key={namespace.id}>
          <Link href={Routes.TrackingNamespace({ namespaceId: namespace.id })}>
            <button
              className={`block hover:bg-gray-800 rounded-xl w-full text-gray-200 text-left px-3 py-2 ${
                props.selectedNamespaceId === namespace.id
                  ? "bg-gradient-to-r from-teal-400 to-green-600 text-white font-bold"
                  : ""
              }`}
              key={namespace.id}
            >
              <h2 className="text-lg">{namespace.name}</h2>
            </button>
          </Link>
        </div>
      ))}
    </>
  )
}

export const NamespaceColumnSkeleton: FC = () => {
  return (
    <>
      <div className="px-5 py-2">
        <div className="h-6 w-1/5 bg-teal-100 rounded-lg animate-pulse" />
      </div>
      <div className="px-5 py-2">
        <div className="h-6 w-1/2 bg-teal-100 rounded-lg animate-pulse" />
      </div>
      <div className="px-5 py-2">
        <div className="h-6 w-1/4 bg-teal-100 rounded-lg animate-pulse" />
      </div>
      <div className="px-5 py-2">
        <div className="h-6 w-1/6 bg-teal-100 rounded-lg animate-pulse" />
      </div>
    </>
  )
}

export default NamespaceColumn
