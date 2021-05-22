import { FC, useState } from "react"
import { FaCheck, FaTimes } from "react-icons/fa"

interface EditableContentProps {
  text: string
  children?: never
  onChange(value: string): Promise<void>
}

const EditableContent: FC<EditableContentProps> = ({ text, onChange }) => {
  const [edit, setEdit] = useState(false)
  const [mutating, setMutating] = useState(false)
  const [editedText, setEditedText] = useState(text)

  return (
    <button
      type="button"
      className={`w-full text-left relative ${edit ? "p-1 bg-white" : ""} ${
        mutating ? "animate-pulse" : ""
      } bg-opacity-5 transition-all rounded-lg`}
      onClick={() => setEdit(true)}
    >
      {edit ? (
        <input
          className="w-full bg-transparent"
          defaultValue={text}
          onChange={(e) => setEditedText(e.currentTarget.value)}
        />
      ) : (
        text
      )}
      <div
        className={`absolute right-0 top-0 h-full transform transition-all ${
          edit && !mutating ? "scale-100" : "scale-0"
        }`}
      >
        <button
          className="h-full px-1 hover:text-green-400 text-lg"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setMutating(true)
            onChange(editedText).finally(() => {
              setMutating(false)
              setEdit(false)
            })
          }}
        >
          <FaCheck />
        </button>
        <button
          className="h-full px-1 hover:text-red-400 text-lg"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setEdit(false)
          }}
        >
          <FaTimes />
        </button>
      </div>
    </button>
  )
}

export default EditableContent
