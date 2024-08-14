import { Inter } from "next/font/google";
import Provider from "@components/Provider";
import Navbar from "@components/NavBar";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat App",
  description: "Made with Next.js 14",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900`}>
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
