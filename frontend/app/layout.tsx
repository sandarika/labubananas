import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { UserProvider } from "@/lib/user-context"
import { LayoutWrapper } from "@/components/layout-wrapper"

import { Manrope as V0_Font_Manrope, Geist_Mono as V0_Font_Geist_Mono, Arvo as V0_Font_Arvo } from "next/font/google"

// Initialize fonts
const _manrope = V0_Font_Manrope({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800"] })
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _arvo = V0_Font_Arvo({ subsets: ["latin"], weight: ["400", "700"] })

export const metadata: Metadata = {
  title: "BunchUp - Join the Bunch! 🍌",
  description: "Modern platform connecting unions and their members across North America",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <UserProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
