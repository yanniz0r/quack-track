import { FC } from "react"

const AuthLayout: FC = ({ children }) => {
  return (
    <>
      <div
        className="min-h-screen min-w-screen flex justify-center items-center bg-center bg-gray-900"
        style={{ backgroundImage: "url(/images/pattern.png)" }}
      >
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl p-7 rounded-xl flex flex-col justify-center">
          <div>{children}</div>
        </div>
      </div>
    </>
  )
}

export default AuthLayout
