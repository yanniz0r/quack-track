import { useMutation } from "blitz"
import { FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { useFormik } from "formik"
import { TypeOf } from "zod"
import Input, { Label } from "../../core/components/input"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  const form = useFormik<TypeOf<typeof Signup>>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    async onSubmit(values) {
      try {
        await signupMutation(values)
        props.onSuccess?.()
      } catch (error) {
        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
          // This error comes from Prisma
          return { email: "This email is already being used" }
        } else {
          return { [FORM_ERROR]: error.toString() }
        }
      }
    },
  })

  return (
    <div>
      <form onSubmit={form.handleSubmit}>
        <div className="mb-5">
          <Label>Name</Label>
          <Input
            name="name"
            placeholder="Name"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </div>
        <div className="mb-5">
          <Label>Email</Label>
          <Input
            name="email"
            placeholder="Email"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </div>
        <div className="mb-5">
          <Label>Password</Label>
          <Input
            name="password"
            placeholder="Password"
            type="password"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </div>
        <button className="bg-gradient-to-r from-teal-400 to-green-600 text-white font-medium px-4 py-2 rounded-lg mt-5">
          Registrieren
        </button>
      </form>
    </div>
  )
}

export default SignupForm
