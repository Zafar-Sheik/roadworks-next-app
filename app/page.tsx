// app/page.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content - Centered & Full Height */}
      <main className="flex-grow flex items-center justify-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/construction-bg.svg"
            alt="Construction background"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>

        <div className="max-w-md w-full px-6 py-12 text-center">
          {/* Logo/Title */}
          <div className="mb-16">
            <h1 className="text-5xl font-light tracking-tight text-gray-900">
              Tautlou
            </h1>
            <p className="mt-2 text-lg text-gray-600">Group</p>
          </div>

          {/* Auth Buttons */}
          <div className="space-y-4">
            <div className="w-full py-3 text-lg rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-all">
              <SignInButton />
            </div>
            <div className="w-full py-3 text-lg rounded-full border-gray-300 hover:bg-gray-100 transition-all">
              <SignUpButton />
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-12 text-sm text-gray-500">
            <Link
              href="/user"
              className="hover:text-gray-700 transition-colors">
              Visit our dashboard →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer - Minimal & Clean */}
      <footer className="py-6 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Tautlou Group. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
