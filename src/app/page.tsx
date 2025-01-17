// _app.tsx
import Login from "./login/page";
import { AuthProvider } from "./context/AuthContext";


export default function page() {
  return (
    <AuthProvider>
     <Login/>
    </AuthProvider>
  );
}
