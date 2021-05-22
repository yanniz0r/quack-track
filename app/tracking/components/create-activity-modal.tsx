import { FC, useEffect } from "react"
import Modal from "app/core/components/modal"
import Input, { Label } from "app/core/components/input"
import { useFormik } from "formik"
import { invalidateQuery, useMutation } from "@blitzjs/core"
import createActivityForNamespace from "../mutations/create-activity-for-namespace"
import getNamespaceWithActivities from "../queries/get-namespace-with-activities"

interface CreateActivityModal {
  selectedNamespaceId?: number
  setOpen(open: boolean): void
  open?: boolean
}

const CreateActivityModal: FC<CreateActivityModal> = ({ open, setOpen, selectedNamespaceId }) => {
  const [createActivityMutation, createActivityMutationState] = useMutation(
    createActivityForNamespace
  )
  const form = useFormik({
    async onSubmit(data) {
      await createActivityMutation({
        name: data.name,
        namespaceId: selectedNamespaceId!,
      })
      invalidateQuery(getNamespaceWithActivities)
    },
    initialValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (createActivityMutationState.isSuccess) {
      setOpen(false)
    }
  }, [createActivityMutationState.isSuccess, setOpen])

  return (
    <Modal open={open}>
      <div className="p-7">
        <h2 className="text-4xl mb-5">Aktivität erstellen</h2>
        <p className="text-lg text-gray-600 mb-7">
          Eine Aktivität repräsentiert eine konkrete Aufgabe. Hier bietet es sich an, nach Tickets,
          Aufträgen oder auch nach abstrakten Tätigkeiten zu gliedern.
        </p>
        <form className="flex flex-col" onSubmit={form.handleSubmit}>
          <Label name="name">Name der Aktivität</Label>
          <Input name="name" onChange={form.handleChange} placeholder="Tätigkeit" />
          <button
            disabled={createActivityMutationState.isLoading}
            type="submit"
            className="mt-7 bg-teal-500 rounded-lg text-white px-5 py-2 justify-self-end"
          >
            Aktivität anlegen
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default CreateActivityModal
