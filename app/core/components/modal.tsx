import { FC } from "react"

interface ModalProps {
  open?: boolean
}

const Modal: FC<ModalProps> = ({ open, children }) => {
  if (!open) {
    return null
  }
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-10 text-gray-800">
      <div className="p-10 max-w-screen-lg mx-auto flex items-center justify-center h-full">
        <div className="bg-white rounded-lg w-full">{children}</div>
      </div>
    </div>
  )
}

export default Modal
