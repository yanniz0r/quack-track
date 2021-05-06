import { FC } from "react"

interface ModalProps {
  open?: boolean
}

const Modal: FC<ModalProps> = ({ open, children }) => {
  if (!open) {
    return null
  }
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-teal-400 bg-opacity-75">
      <div className="p-10 max-w-screen-lg mx-auto">
        <div className="bg-white rounded-lg">{children}</div>
      </div>
    </div>
  )
}

export default Modal
