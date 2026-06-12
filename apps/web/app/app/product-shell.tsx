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
      <aside className="sidebar" aria-label="Main navigation">
        <div>
          <p className="eyebrow">Stories to CV</p>
          <h1>Workspace</h1>
        </div>
        <nav className="nav-stack">
          {navItems.map((item) => (
            <Link key={item.href} aria-current={pathname === item.href ? "page" : undefined} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="content-area">{children}</section>
    </main>
  );
}
