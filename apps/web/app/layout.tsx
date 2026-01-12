import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "DistroKid Upload Assistant",
  description: "Bulk-ready release packaging for DistroKid"
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body>
      <div className="page">{children}</div>
    </body>
  </html>
);

export default RootLayout;
