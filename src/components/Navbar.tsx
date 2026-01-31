import Link from "next/link";
import { Car } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200/20 bg-white/70 backdrop-blur-lg dark:bg-gray-900/70 dark:border-gray-700/30 supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse group"
        >
          <div className="p-2 bg-linear-to-tr from-blue-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
            Asghar Autos
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
