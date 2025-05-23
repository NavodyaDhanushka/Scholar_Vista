import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    terms: false,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      return "Full Name is required.";
    }
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (!formData.username.trim()) {
      return "Username is required.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (!formData.terms) {
      return "You must agree to the Terms and Conditions.";
    }

    return null; // All good
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null); // Clear any previous errors

    const { fullName, terms, ...rest } = formData;
    const cleanFormData = { name: fullName, ...rest };

    try {
      const response = await fetch("http://localhost:8005/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanFormData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Registration failed: ${errorText}`);
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      navigate("/login");
    } catch (error) {
      setError(error.message);
      console.error("Error during registration:", error);
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h2 style={styles.title}>Admin Registration</h2>
          <p style={styles.subtitle}>Create your ScholarVista admin account</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                style={styles.input}
                onChange={handleChange}
                value={formData.fullName}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                style={styles.input}
                onChange={handleChange}
                value={formData.email}
                required
            />
            <input
                type="text"
                name="username"
                placeholder="Username"
                style={styles.input}
                onChange={handleChange}
                value={formData.username}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                style={styles.input}
                onChange={handleChange}
                value={formData.password}
                required
            />
            <div style={styles.checkboxContainer}>
              <input
                  type="checkbox"
                  name="terms"
                  style={styles.checkbox}
                  onChange={handleChange}
                  checked={formData.terms}
                  required
              />
              <label style={styles.label}>
                I agree to the{" "}
                <a href="#" style={styles.link}>
                  Terms and Conditions
                </a>
              </label>
            </div>
            <button type="submit" style={styles.button}>
              Register Account
            </button>
            <p style={styles.footerText}>
              Already have an account?{" "}
              <a href="/login" style={styles.link}>
                Sign in
              </a>
            </p>
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
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    marginRight: "8px",
  },
  label: {
    fontSize: "14px",
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
  footerText: {
    textAlign: "center",
    fontSize: "14px",
  },
};

export default AdminRegister;
