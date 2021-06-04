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
    <div
      className="w-full text-left relative cursor-pointer"
      onClick={() => setEdit(true)}
    >
      {edit ? (
        <input
          className="w-full bg-transparent z-20 relative"
          defaultValue={text}
          onChange={(e) => setEditedText(e.currentTarget.value)}
        />
      ) : (
        text
      )}
      <div className={`bg-white bg-opacity-5 w-full h-full absolute top-0 rounded-lg transition-all transform ${edit ? 'scale-105' : 'scale-0'}`} />
      <div
        className={`absolute z-30 right-0 top-0 h-full transform transition-all ${
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
    </div>
  )
}

export default EditableContent
