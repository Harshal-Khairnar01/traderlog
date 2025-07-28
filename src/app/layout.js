import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import { SessionProvider } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'X-journal - Track Your Trading Performance',
  description:
    'A personal trade journal and analysis dashboard to track, analyze, and improve your trading performance across stocks, crypto, and forex.',
  keywords: [
    'trade journal',
    'trading dashboard',
    'trading analysis',
    'stock market',
    'forex',
    'crypto',
    'trading performance',
    'day trading',
    'pnl tracker',
  ],

  openGraph: {
    title: 'Trade Journal Dashboard',
    description: 'Track, analyze, and improve your trading performance.',
    url: 'https://trade-trackerrr.vercel.app/',
    siteName: 'TradeTrackerr',
    // images: [
    //   {
    //     url: "https://your-trade-journal-app.com/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Trade Journal Dashboard Screenshot",
    //   },
    // ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  )
}
