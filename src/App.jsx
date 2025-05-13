import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import "./App.css";
import Main from "./components/Main";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Footer from "./components/Footer";
import FormSubmitPage from "./pages/FormSubmitPage";
import ServicesPage from "./pages/ServicesPage";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";
import Tabs from "./components/Tabs";

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user || user.email !== adminEmail) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const [user] = useAuthState(auth);
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-10">
          <Tabs />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Main />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/submit-form" element={<FormSubmitPage />} />
            <Route path="/services" element={<ServicesPage />} />

            {/* Auth routes */}
            <Route
              path="/login"
              element={isAdmin ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
