"use client";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  const href = isSignedIn
    ? user?.publicMetadata?.role === "admin"
      ? "/admin/users"
      : "/user/jobs"
    : "/admin/users";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Company Name & Desktop Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Tautlou</span>
              <span className="text-xl font-light text-gray-600 ml-1">
                Group
              </span>
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              {isSignedIn && (
                <Link
                  href={href}
                  className="text-black p-0 border-black text-xl">
                  {user?.publicMetadata?.role === "admin" ? "🤵🏾" : "👷🏿"}
                </Link>
              )}
            </div>
            <SignedOut>
              <SignInButton>
                <button className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              href={href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 px-4 space-y-3">
            <SignedOut>
              <SignInButton>
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gray-900 text-white hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="px-3 py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}
