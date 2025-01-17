// _app.tsx
import { AuthProvider } from "./context/AuthContext";
import type { AppProps } from "next/app";
import Login from "./login/page";

export default function page({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
     <Login/>
    </AuthProvider>
  );
}
