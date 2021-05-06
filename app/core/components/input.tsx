import { FC, HTMLProps } from "react"

const Input: FC<HTMLProps<HTMLInputElement>> = (props) => {
  return <input {...props} className="w-full bg-gray-100 p-2 rounded-lg" />
}

export const Label: FC<HTMLProps<HTMLLabelElement>> = (props) => {
  return <label {...props} className="text-teal-600 text-sm mb-2" />
}

export default Input
