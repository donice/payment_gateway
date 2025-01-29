"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <div className="text-center">
        <header className="main-header">
          <h1>Payment Gateway</h1>
        </header>

        <main className="main-content">{children}</main>

        <footer className="main-footer">
          <p>&copy; 2024 Payment Gateway. All rights reserved.</p>
        </footer>
      </div>
    </QueryClientProvider>
  );
};

export default MainLayout;
