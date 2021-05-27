import { AuthenticationError, Link, useMutation, Routes } from "blitz"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import Input, { Label } from "../../core/components/input"
import { useFormik } from "formik"
import * as zod from "zod"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  const form = useFormik<zod.TypeOf<typeof Login>>({
    validate(values) {
      try {
        Login.parse(values)
      } catch (error) {
        return error.formErrors.fieldErrors
      }
    },
    initialValues: {
      email: "",
      password: "",
    },
    async onSubmit(values) {
      try {
        await loginMutation(values)
        props.onSuccess?.()
      } catch (error) {
        if (error instanceof AuthenticationError) {
          return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
        } else {
          return {
            [FORM_ERROR]:
              "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
          }
        }
      }
    },
  })

  return (
    <div>
      <form onSubmit={form.handleSubmit}>
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
        <div>
          <Link href={Routes.ForgotPasswordPage()}>
            <a className="text-green-400">Forgot your password?</a>
          </Link>
        </div>
        <button className="bg-gradient-to-r from-teal-400 to-green-600 text-white font-medium px-4 py-2 rounded-lg mt-5">
          Anmelden
        </button>
      </form>

      <div style={{ marginTop: "1rem" }} className="text-gray-400">
        Kein Account? Jetzt{" "}
        <Link href={Routes.SignupPage()}>
          <a className="text-green-400">registrieren</a>
        </Link>
        !
      </div>
    </div>
  )
}

export default LoginForm
