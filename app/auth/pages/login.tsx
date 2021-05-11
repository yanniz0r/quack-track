import { useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/login-form"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div
      className="min-h-screen min-w-screen bg-green-200 flex justify-center items-center md:items-stretch md:justify-start bg-cover bg-center"
      style={{ backgroundImage: "url(/images/login-background.jpg)" }}
    >
      <div className="bg-gray-900 bg-opacity-95 p-7 flex flex-col justify-center">
        <div>
          <h1 className="text-6xl text-white mb-7">Howdy Fren!</h1>
          <LoginForm
            onSuccess={() => {
              const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
              router.push(next)
            }}
          />
        </div>
      </div>
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
