import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TWENTY4 STUDIOS | Connecting Brands & Athletes',
  description: 'Editorial, premium, fashion-tech studio connecting brands and athletes.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="bg-[#e2dbd0] text-[#22330D] antialiased">
        {children}
      </body>
    </html>
  );
}
