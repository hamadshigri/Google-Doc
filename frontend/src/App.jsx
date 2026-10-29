import { Routes, Route, BrowserRouter, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Document from "./pages/Document";
import Register from "./pages/Register";
import Login from "./pages/Login";


const isTokenExpired = (token) => {
  if(!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch(error){
    return true;
  }
}

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if(!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace state={{from: location}}/>
  }

  return children;
};

const App = () => {

    const token = localStorage.getItem("token");

    const isAuth = token && !isTokenExpired(token);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={isAuth ? <Navigate to="/" replace/> : <Register />} />
          <Route path="/login" element={isAuth ? <Navigate to="/" replace/> :  <Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/document" element={<ProtectedRoute><Document /></ProtectedRoute>} />
          <Route path="/document/:id" element={<ProtectedRoute><Document /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
