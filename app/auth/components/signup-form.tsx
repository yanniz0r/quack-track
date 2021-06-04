import { useMutation } from "blitz"
import { FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { useFormik } from "formik"
import { TypeOf } from "zod"
import Input, { ErrorMessage, Label } from "../../core/components/input"

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
    validate(values) {
      try {
        Signup.parse(values)
      } catch (error) {
        return error.formErrors.fieldErrors
      }
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

  console.log(form.errors)

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
          {form.errors.name && form.touched.name && <ErrorMessage>{form.errors.name}</ErrorMessage>}
        </div>
        <div className="mb-5">
          <Label>Email</Label>
          <Input
            name="email"
            placeholder="Email"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
          {form.errors.email && form.touched.email && (
            <ErrorMessage>{form.errors.email}</ErrorMessage>
          )}
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
          {form.errors.password && form.touched.password && (
            <ErrorMessage>{form.errors.password}</ErrorMessage>
          )}
        </div>
        <button className="bg-gradient-to-r from-teal-400 to-green-600 text-white font-medium px-4 py-2 rounded-lg mt-5">
          Registrieren
        </button>
      </form>
    </div>
  )
}

export default SignupForm
