"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/app/profile", icon: "person", label: "Profile" },
  { href: "/app/excavation-history", icon: "psychology", label: "Career Excavation" },
  { href: "/app/knowledge-base", icon: "database", label: "Knowledge Base" },
  { href: "/app/archive", icon: "description", label: "CV Lab" },
];

function isNavItemActive(pathname: string, href: string) {
  if (href === "/app/archive") {
    return pathname === href || pathname.startsWith("/app/archive/") || pathname.startsWith("/app/generate-cv");
  }

  if (href === "/app/excavation-history") {
    return pathname === href || pathname === "/app/knowledge-base/new";
  }

  if (href === "/app/knowledge-base") {
    return pathname === href || (pathname.startsWith("/app/knowledge-base/") && pathname !== "/app/knowledge-base/new");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ProductShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="app-shell">
      <aside className="workspace-sidebar" aria-label="Workspace navigation">
        <div className="workspace-profile">
          <img
            alt="User Profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOkjVFy3K0mMvurYgpoWrjsXTuFXh6ogWlbZoYrDKfSpXFTbj8fBWsNfJiMk0sSSP6ii8KjL58zJjOOQZf4oZme0NECq0VKsV9VwQXAjMhEK5DShU2fk_UEH_5xFXWDryLE6ubZn2LXfTmrm5mwvKpgiPifnpi3Ulek2HUBCizDhXlBFwBJF4YMc4PytQxJK4KYYruyeDZ0C4FzPW9xUbjgkoKlOOMhh_YQwqNVtJoRROp4FdAo9MokfAkJxCo0k_Ex_FH5L8MPzKm"
          />
          <div>
            <h1>Career Workspace</h1>
            <p>Expert Strategist</p>
          </div>
        </div>
        <nav className="nav-stack" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              aria-current={isNavItemActive(pathname, item.href) ? "page" : undefined}
              href={item.href}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="workspace-new-button" href="/login">
          <span className="material-symbols-outlined" aria-hidden="true">
            logout
          </span>
          Logout
        </Link>
      </aside>
      <section className="content-area">{children}</section>
    </main>
  );
}
