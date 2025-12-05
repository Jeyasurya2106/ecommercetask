import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/component/header';
import Footer from '@/component/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NaturalCare - 100% Natural & Toxin-Free Beauty Products',
  description: 'Shop natural, toxin-free beauty and personal care products. Made Safe Certified, Dermatologically Tested.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}