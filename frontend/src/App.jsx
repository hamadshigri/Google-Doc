import { Routes, Route, BrowserRouter, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Document from "./pages/Document";
import Register from "./pages/Register";
import Login from "./pages/Login";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const App = () => {

    const token = localStorage.getItem("token");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={token ? <Navigate to="/" replace/> : <Register />} />
          <Route path="/login" element={token ? <Navigate to="/" replace/> :  <Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/document" element={<ProtectedRoute><Document /></ProtectedRoute>} />
          <Route path="/document/:id" element={<ProtectedRoute><Document /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
