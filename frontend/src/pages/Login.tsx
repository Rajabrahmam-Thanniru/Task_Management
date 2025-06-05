import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../schmea/loginval";
import axios from "axios";

function Login() {
  const nav = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        values
      );
      console.log("Login success:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", response.data.name);
        localStorage.setItem("role", response.data.role);
        if (response.data.role === "team_lead") {
          nav("/teamlead/dashboard");
        } else if (response.data.role === "client") {
          nav("/client/overview");
        } else if (response.data.role === "team_member") {
          nav("/teammember/dashboard");
        } else if (response.data.role === "manager") {
          nav("/manager/dashboard");
        }
      }

      // optionally save the token or navigate
    } catch (error: any) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      // show error to user (toast, modal, etc.)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#d1eaef]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-[#128696]"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mb-2"
            />

            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-[#128696]"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mb-4"
            />

            <button
              type="submit"
              className="w-full text-white py-2 rounded-md bg-[#128696]"
            >
              Login
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Login;
