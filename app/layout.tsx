import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MajiShift — Reservoir planning',
  description: 'Compare reservoir operating scenarios and protect essential water reserves. A Hack The Weather prototype.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
