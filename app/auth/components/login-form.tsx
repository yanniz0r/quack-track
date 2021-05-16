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
      console.log(values)
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
        <Label>
          Email
          <Input
            name="email"
            placeholder="Email"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Label>
        <Label>
          Password
          <Input
            name="password"
            placeholder="Password"
            type="password"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Label>
        <div>
          <Link href={Routes.ForgotPasswordPage()}>
            <a>Forgot your password?</a>
          </Link>
        </div>
        <button className="bg-gradient-to-r from-teal-400 to-green-600 text-white font-medium px-4 py-2 rounded-lg">
          Anmelden
        </button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        Kein Account? Jetzt <Link href={Routes.SignupPage()}>registrieren</Link>!
      </div>
    </div>
  )
}

export default LoginForm
