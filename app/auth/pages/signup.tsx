import { useRouter, BlitzPage, Routes, Head } from "blitz"
import { SignupForm } from "app/auth/components/signup-form"
import AuthLayout from "../layouts/auth-layout"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Registrieren | Quack Track</title>
      </Head>
      <h1 className="text-6xl text-white mb-7">Howdy Fren!</h1>
      <SignupForm onSuccess={() => router.push(Routes.TrackingDashboard())} />
    </>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default SignupPage
