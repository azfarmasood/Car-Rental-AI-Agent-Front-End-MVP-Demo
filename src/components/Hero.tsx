import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero({ onStartChat }: { onStartChat: () => void }) {
  return (
    <section className="bg-white dark:bg-gray-900 pt-24 pb-12 lg:pt-32 lg:pb-24 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 relative z-10">
        <div className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700">
          <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3 shadow-md">
            New
          </span>
          <span className="text-sm font-medium flex items-center gap-2">
            AI-Powered Booking Experience{" "}
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Rent your dream car <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
            in seconds.
          </span>
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
          Talk to our advanced AI agent to find the perfect vehicle for your
          trip. Checks availability, compares prices, and books instantly.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
          <button
            onClick={onStartChat}
            className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            Chat with Agent
            <ArrowRight className="w-5 h-5 ml-2 -mr-1" />
          </button>
          <a
            href="#"
            className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-all"
          >
            Browse Cars
          </a>
        </div>
      </div>
    </section>
  );
}
