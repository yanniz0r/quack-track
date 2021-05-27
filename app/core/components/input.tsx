import { FC, forwardRef, HTMLProps } from "react"

interface InputProps extends HTMLProps<HTMLInputElement> {
  light?: boolean
}

const Input: FC<InputProps> = forwardRef(({ light, ...props }, ref) => {
  const generalClasses = "w-full bg-gray-100 p-2 px-3 rounded-lg"
  const lightClasses = "bg-gray-100 text-black"
  const darkClasses = "bg-gray-700 text-white"
  const classes = [generalClasses, light ? lightClasses : darkClasses].join(" ")
  return <input ref={ref} {...props} className={classes} />
})

export const Label: FC<HTMLProps<HTMLLabelElement>> = (props) => {
  return <label {...props} className="text-teal-600 text-sm mb-2 inline-block" />
}

export default Input
