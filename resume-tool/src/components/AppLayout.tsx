import type { ReactNode } from 'react';

interface AppLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
}

export default function AppLayout({ sidebar, main }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <aside className="sidebar">{sidebar}</aside>
      <main className="main">{main}</main>
    </div>
  );
}
