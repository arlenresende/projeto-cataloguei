"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page p-0 lg:p-3">
      <div className="mx-auto flex min-h-screen max-w-[1500px] overflow-hidden rounded-none border border-border bg-card shadow-sm lg:min-h-[calc(100vh-1.5rem)] lg:rounded-[28px]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="min-w-0 flex-1 bg-background">
          <Header onOpenMenu={() => setSidebarOpen(true)} />
          <div className="p-5 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
