import { useRouter, BlitzPage, Routes, Head } from "blitz"
import { LoginForm } from "app/auth/components/login-form"
import AuthLayout from "../layouts/auth-layout"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Anmelden | Quack Track</title>
      </Head>
      <h1 className="text-6xl text-white mb-7">Howdy Fren!</h1>
      <LoginForm
        onSuccess={() => {
          const next = router.query.next
            ? decodeURIComponent(router.query.next as string)
            : Routes.TrackingDashboard()
          router.push(next)
        }}
      />
    </>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default LoginPage
