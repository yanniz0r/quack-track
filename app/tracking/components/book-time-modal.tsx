import { Namespace } from ".prisma/client"
import { useMutation } from "@blitzjs/core"
import { FC } from "react"
import Modal from "../../core/components/modal"
import bookSecondsForNamespace from "../mutations/book-seconds-for-namespace"

interface BookTimeModalProps {
  namespace?: Namespace
  close(): void
}

const BookTimeModal: FC<BookTimeModalProps> = (props) => {
  const [bookSeconds] = useMutation(bookSecondsForNamespace)

  const confirm = async () => {
    await bookSeconds({ namespaceId: props.namespace!.id })
    props.close()
  }

  return (
    <Modal open={Boolean(props.namespace)}>
      <div className="p-5">
        <h2 className="text-4xl mb-5">Zeiten Buchen</h2>
        <p className="text-gray-600 text-lg mb-7">
          Durch das Verbuchen deiner Zeiten, wird dein Zeitkonto für den Namespace{" "}
          <span className="bg-gray-200 p-0.5 rounded-md px-1">{props.namespace?.name}</span> zurück
          auf 0 gesetzt. Verbuche deine Zeiten also nur, wenn du die bisherigen Daten nicht mehr
          brauchst. Die verbuchten Stunden werden anschließend zu den anderen bereits verbuchten
          Stunden hinzugefügt.
        </p>
        <div className="flex justify-end">
          <button className="mr-2 px-4 py-2 bg-green-500 rounded-lg text-white" onClick={confirm}>
            Zeiten verbuchen
          </button>
          <button className=" px-4 py-2 bg-gray-200 rounded-lg" onClick={props.close}>
            Abbrechen
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BookTimeModal
