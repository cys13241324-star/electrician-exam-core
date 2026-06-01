"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SearchModal from "./SearchModal";

const categories = [
  { name: "공기업", href: "https://www.addto.co.kr/", external: true },
  { name: "자격증", href: "https://www.addto.co.kr/", external: true },
  { name: "대기업", href: "https://www.addto.co.kr/", external: true },
  { name: "전기기능사", href: "/", active: true },
];

const utilityLinks = [
  { name: "로그인", href: "#" },
  { name: "회원가입", href: "#" },
  { name: "나의 쿠폰", href: "#" },
  { name: "장바구니", href: "#" },
  { name: "1:1 문의", href: "#" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      {/* Top utility bar (hidden on mobile) */}
      <div className="hidden border-b border-zinc-100 sm:block">
        <div className="mx-auto flex h-10 max-w-6xl items-center justify-end gap-4 px-6 text-xs text-zinc-500">
          {utilityLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-zinc-900">
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link
          href="/"
          className="flex items-center"
          aria-label="애드투 홈"
        >
          <Image
            src="/addto-bi.png"
            alt="addto"
            width={120}
            height={40}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href={cat.href}
              target={cat.external ? "_blank" : undefined}
              rel={cat.external ? "noreferrer" : undefined}
              className={
                cat.active
                  ? "relative whitespace-nowrap px-4 py-2 text-sm font-semibold text-blue-600 after:absolute after:inset-x-3 after:-bottom-[17px] after:h-0.5 after:bg-blue-600"
                  : "whitespace-nowrap px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
              }
            >
              {cat.name}
            </a>
          ))}
        </nav>

        <div className="hidden flex-1 lg:block" />

        {/* Right CTAs (desktop) */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="검색"
            title="검색 (Ctrl+K)"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
          >
            <span aria-hidden="true">🔍</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="메뉴 열기/닫기"
          aria-expanded={mobileOpen}
          className="ml-auto flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-zinc-200 lg:hidden"
        >
          <span
            className={`block h-0.5 w-5 bg-zinc-700 transition ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-zinc-700 transition ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-zinc-700 transition ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-100 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                target={cat.external ? "_blank" : undefined}
                rel={cat.external ? "noreferrer" : undefined}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  cat.active
                    ? "bg-blue-50 text-blue-700"
                    : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {cat.name}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-zinc-100 pt-3">
              <Link
                href="/simulator"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                시뮬레이터 시작
              </Link>
              <button
                type="button"
                className="flex-1 rounded-md border border-zinc-200 px-4 py-2 text-center text-sm font-medium text-zinc-700"
              >
                내강의실
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
              {utilityLinks.map((link) => (
                <a key={link.name} href={link.href} className="hover:text-zinc-900">
                  {link.name}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
