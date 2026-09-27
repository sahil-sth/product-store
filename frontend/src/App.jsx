import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePage from "./pages/CreatePage";
import EditProductPage from "./pages/EditProductPage";
import LoginPage from "./pages/LoginPage";
import useAuth from "./hooks/useAuth";
import SignupPage from "./pages/SignupPage";

function App() {
  const { isSignedIn } = useAuth();
  return (
    <>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <ToastContainer />
          <Routes>
            <Route path="" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="/product/:id" element={<ProductPage />} />
            <Route
              path="/profile"
              element={isSignedIn ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
              path="/create"
              element={isSignedIn ? <CreatePage /> : <Navigate to="/" />}
            />
            <Route
              path="/edit/:id"
              element={isSignedIn ? <EditProductPage /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
