import "./globals.css";
import { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core"; 

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body> 
        <CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent"> 
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}