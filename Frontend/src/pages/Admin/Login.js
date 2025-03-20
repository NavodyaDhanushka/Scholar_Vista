import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);  // To handle errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in:", formData);

    try {
      const response = await fetch("http://localhost:8005/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed, please try again.");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // If login is successful, navigate to the dashboard
      navigate("/researchPaperManagement");
    } catch (error) {
      setError(error.message);  // Set the error message
      console.error("Error during login:", error);
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h2 style={styles.title}>Scholar Vista</h2>
          <p style={styles.subtitle}>Admin Portal Login</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                style={styles.input}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                style={styles.input}
                onChange={handleChange}
                required
            />
            <div style={styles.options}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkbox} /> Remember me
              </label>
              <a href="#" style={styles.link}>Forgot password?</a>
            </div>
            <button type="submit" style={styles.button}>Sign In</button>
          </form>
        </div>
      </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#6b7280",
    textAlign: "center",
    marginBottom: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
  },
  options: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    marginRight: "8px",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "underline",
  },
  button: {
    width: "100%",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.3s",
  },
};

export default AdminLogin;
