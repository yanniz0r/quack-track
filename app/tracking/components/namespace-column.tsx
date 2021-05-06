import { useQuery } from "@blitzjs/core"
import { FC } from "react"
import getNamespacesForCurrentUser from "../queries/get-namespaces-for-current-user"

interface NamespaceColumnProps {
  onNamespaceSelect(namespaceId: number): void
  selectedNamespaceId?: number
}

const NamespaceColumn: FC<NamespaceColumnProps> = (props) => {
  const [namespaces] = useQuery(getNamespacesForCurrentUser, null)
  return (
    <>
      {namespaces.map((namespace) => (
        <div className="px-2">
          <button
            className={`block px-3 py-2 ${
              props.selectedNamespaceId === namespace.id
                ? "bg-teal-100 text-teal-700 rounded-xl"
                : ""
            }`}
            key={namespace.id}
            onClick={() => props.onNamespaceSelect(namespace.id)}
          >
            <h2 className="text-2xl">{namespace.name}</h2>
          </button>
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
