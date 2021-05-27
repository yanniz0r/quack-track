import { Link, Routes, useQuery } from "@blitzjs/core"
import { FC, Suspense, useState } from "react"
import Input from "../../core/components/input"
import Modal from "../../core/components/modal"
import formatSeconds from "../helper/format-seconds"
import getSearchResults from "../queries/get-search-results"

interface SearchModalProps {
  setOpen(open: boolean): void
  open?: boolean
}

interface SearchResultsProps {
  query: string
  close(): void
}

/* eslint-disable */
const SearchResults: FC<SearchResultsProps> = ({ query, close }) => {
  const [queryResult, queryResultState] = useQuery(
    getSearchResults,
    { query: query! },
    {
      enabled: Boolean(query),
      keepPreviousData: true,
    }
  )

  const activities = queryResult?.activities
  const namespaces = queryResult?.namespaces

  return (
    <div className={`transition-all ${queryResultState.isLoading ? "opacity-75" : "opacity-100"}`}>
      {Boolean(activities?.length) && (
        <div>
          <h2 className="text-gray-500 text-lg mb-3 mt-4">Aktivitäten</h2>
          <ul>
            {activities?.map((activity) => (
              <li>
                <Link
                  href={Routes.TrackingNamespace({
                    namespaceId: activity.namespaceId,
                    activity: activity.id,
                  })}
                >
                  <a
                    onClick={close}
                    className="bg-indigo-100 flex py-2 px-4 my-1 rounded-lg flex-row justify-between"
                  >
                    <span className="font-semibold text-indigo-500">{activity.name}</span>
                    <span className="text-indigo-400">{formatSeconds(activity.clockSeconds)}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Boolean(namespaces?.length) && (
        <div>
          <h2 className="text-gray-500 text-lg mb-3 mt-4">Namespaces</h2>
          <ul>
            {namespaces?.map((namespace) => (
              <li>
                <Link href={Routes.TrackingNamespace({ namespaceId: namespace.id })}>
                  <a
                    onClick={close}
                    className="bg-teal-100 text-teal-500 font-semibold block py-2 px-4 my-1 rounded-lg"
                  >
                    {namespace.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const SearchModal: FC<SearchModalProps> = (props) => {
  const [query, setQuery] = useState<string>("")

  return (
    <Modal open={props.open}>
      <div className="p-5">
        <Input
          autoFocus
          light
          placeholder="Suche nach irgendwas"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
        <div>
          <Suspense fallback="Loading...">
            <SearchResults query={query} close={() => props.setOpen(false)} />
          </Suspense>
        </div>
      </div>
    </Modal>
  )
}

export default SearchModal
