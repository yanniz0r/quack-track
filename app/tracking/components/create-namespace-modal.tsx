import { FC, useEffect } from "react"
import Modal from "app/core/components/modal"
import Input, { Label } from "app/core/components/input"
import { useFormik } from "formik"
import { invalidateQuery, useMutation } from "@blitzjs/core"
import createNamespaceForCurrentUser from "../mutations/create-namespace-for-current-user"
import getNamespacesForCurrentUser from "../queries/get-namespaces-for-current-user"

interface CreateNamespaceModal {
  setOpen(open: boolean): void
  open?: boolean
}

const CreateNamespaceModal: FC<CreateNamespaceModal> = ({ open, setOpen }) => {
  const [createNamespaceMutation, createNamespaceMutationState] = useMutation(
    createNamespaceForCurrentUser
  )
  const form = useFormik({
    async onSubmit(data) {
      await createNamespaceMutation({
        name: data.name,
      })
      invalidateQuery(getNamespacesForCurrentUser)
    },
    initialValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (createNamespaceMutationState.isSuccess) {
      setOpen(false)
    }
  }, [createNamespaceMutationState.isSuccess, setOpen])

  return (
    <Modal open={open}>
      <div className="p-7">
        <h2 className="text-4xl mb-5">Namespace erstellen</h2>
        <p className="text-lg text-gray-600 mb-7">
          Ein Namespace dient zur Kategorisierung verschiedener Aktivitäten. Du kannst frei wählen
          was er für dich repräsentiert. Sinnvoll könnten Dinge wie Projekte oder Kunden sein.
        </p>
        <form className="flex flex-col" onSubmit={form.handleSubmit}>
          <Label name="name">Name vom Namespace</Label>
          <Input
            light
            name="name"
            onChange={form.handleChange}
            placeholder="Kunde, Projekt, wonach dir ist"
          />
          <button
            disabled={createNamespaceMutationState.isLoading}
            type="submit"
            className="mt-7 bg-teal-500 rounded-lg text-white px-5 py-2 justify-self-end"
          >
            Namespace anlegen
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default CreateNamespaceModal
