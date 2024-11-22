import 'reflect-metadata'
import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const roboto = Inter({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Geoff Faiers',
  description: 'The personal portfolio of Geoff Faiers',
}


zxcvbnOptions.setOptions({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={roboto.className}>
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  )
}
