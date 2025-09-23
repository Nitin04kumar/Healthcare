import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./Context/AuthContext.tsx";
import { Toaster } from "react-hot-toast";

const container = document.getElementById('root');
if (!container) {
  throw new Error("Root container not found");
}
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Toaster position="bottom-right" reverseOrder={false}/>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);