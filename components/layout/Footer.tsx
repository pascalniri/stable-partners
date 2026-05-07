"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-slate-100">
      <div className="container flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <Image
            src="/stable-patners-logo.jpg"
            alt="Stable Partners Group Logo"
            width={180}
            height={60}
            className="h-auto w-auto max-w-[200px]"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Stable Partners Group. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] hover:text-[#1800AC] transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] hover:text-[#1800AC] transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
