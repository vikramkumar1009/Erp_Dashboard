import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // 🔹 Signup Function (Fixed)
  const signup = async (name, email, password, role) => {
    try {
      console.log("Sending signup request:", { name, email, password, role });

      const res = await axios.post(
        "https://erp-r0hx.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
          role, // Ensure this is required by the API
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { user, token } = res.data;
      setUser(user);
      setToken(token);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message  && "Email should be last from einfratech.com or .tech only and password should be alphanumeric password");
    }
  };

  // 🔹 Login Function (Fixed)
  const login = async (email, password) => {
    try {
      console.log("Sending login request:", { email, password });

      const res = await axios.post(
        "https://erp-r0hx.onrender.com/api/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { user, token } = res.data;
      setUser(user);
      setToken(token);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // 🔹 Logout Function
  const logout = async () => {
    try {
      await axios.post("https://erp-r0hx.onrender.com/api/auth/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      delete axios.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
