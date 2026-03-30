import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TWENTY4 STUDIOS | Connecting Brands & Athletes',
  description: 'Editorial, premium, fashion-tech studio connecting brands and athletes.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#e2dbd0] text-[#22330D] antialiased">
        {children}
      </body>
    </html>
  );
}
