"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/app/knowledge-base", label: "Knowledge Base" },
  { href: "/app/generate-cv", label: "Generate CV" },
];

export function ProductShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="brand-lockup" href="/app/knowledge-base" aria-label="Stories to CV home">
          <span className="brand-mark">S</span>
          <span>Stories to CV</span>
        </Link>
        <nav className="nav-stack" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} aria-current={pathname === item.href ? "page" : undefined} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="topbar-actions">
          <Link href="/app/knowledge-base/session-ai-impact">Open chat</Link>
          <Link className="primary-action compact gradient-action" href="/app/knowledge-base/new">
            New session
          </Link>
        </div>
      </header>
      <section className="content-area">{children}</section>
    </main>
  );
}
