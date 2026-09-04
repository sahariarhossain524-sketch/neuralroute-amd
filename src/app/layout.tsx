import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NeuralRoute AMD | Smart Agentic Model Router & Token Optimizer',
  description: 'Enterprise model routing gateway optimized for AMD ROCm 6.2 and AMD Instinct GPU inference, slashing token spend by 70%.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#070b12] text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
