import { Navigate, Route, Routes } from "react-router";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import CreatePage from "./pages/CreatePage";
import EditProductPage from "./pages/EditProductPage";
import useAuthRequest from "./hooks/useAuthRequest";

import LoginPage from "./pages/LoginPage";

function App() {
  const { isClerkLoaded, isSignedIn } = useAuthRequest();

  if (!isClerkLoaded) return null;
  return (
    <>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            <Route path="" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

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
