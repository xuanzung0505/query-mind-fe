import { Button } from "@/components/ui/button";
import BrandMark from "../components/BrandMark";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <section className="w-full max-w-xl text-center">
        <div className="flex items-center justify-center select-none animate-bounce-custom">
          <BrandMark className="h-8 w-8 sm:w-10 sm:h-10 md:h-12 md:w-12 text-primary" />
          <h1 className={`text-[30px] sm:text-[48px] md:text-[60px] font-extrabold tracking-tight 
          text-transparent bg-clip-text bg-neutral-800 from-primary to-primary/80`}>
            QueryMind
          </h1>
        </div>

        <div className="mt-6">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-neutral-700">
            Welcome to Query Mind
          </h2>
          <p className="mt-2 text-neutral-600">
            Log in with Google to manage your AI projects and conversations.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            className="bg-[#1a73e8] hover:bg-[#1669d5] text-white px-5 h-10 rounded-md shadow-md"
            aria-label="Sign in with Google"
          >
            <GoogleIcon className="h-5 w-5" />
            <span className="ml-2">Sign in with Google</span>
          </Button>
        </div>
      </section>
    </main>
  );
}


function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.9 32.3 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.5 6.1 28.9 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.4 16.2 18.8 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.5 6.1 28.9 4 24 4 16.2 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.3 0 10.2-2 13.8-5.2l-6.4-5.4C29.4 36 26.9 37 24 37c-5.3 0-9.8-3.4-11.5-8.1l-6.6 5.1C9.1 39.7 16 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.3-3.6 5.8-6.5 7.4l6.4 5.4C37.5 39.2 41 32.7 41 25c0-1.6-.1-2.7-.4-4.5z"
      />
    </svg>
  );
}
