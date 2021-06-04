import { BlitzPage, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"

const Home: BlitzPage = () => {
  return (
    <div
      className="w-screen h-screen bg-gray-900"
      style={{ backgroundImage: 'url("/images/pattern.png")' }}
    >
      <div className="mx-auto max-w-screen-lg flex h-full items-center">
        <div>
          <h1 className="text-white text-6xl my-5">Zeiterfassung in einfach</h1>
          <p className="text-gray-300 text-xl my-5">
            Lass Zeiterfassung einfach sein. Quack Track lässt dich deinen Fokus ganz auf deine
            Arbeit richten.
          </p>
          <Link href={Routes.SignupPage()} passHref>
            <a className="bg-green-400 rounded-lg px-4 py-2 text-lg font-bold">Jetzt loslegen</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
