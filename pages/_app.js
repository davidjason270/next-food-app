
import Link from "next/link";
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="header">
        <Link href="/">johns kitchen</Link>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp
