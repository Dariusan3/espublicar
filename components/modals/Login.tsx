"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const modal = document.getElementById("log");
      const bootstrap = require("bootstrap");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
      setEmail("");
      setPassword("");
      toast.success("¡Inicio de sesión exitoso!");
    } else {
      setError(result.error || "Error al iniciar sesión. Inténtalo de nuevo.");
    }

    setLoading(false);
  };

  if (user) {
    return (
      <div className="modal modalCentered fade modal-log" id="log">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <span
              className="icon icon-close btn-hide-popup"
              data-bs-dismiss="modal"
            />
            <div className="modal-log-wrap list-file-delete text-center">
              <h5 className="title fw-semibold">¡Bienvenido de vuelta!</h5>
              <p className="body-text-3 mt-3">
                Has iniciado sesión como <strong>{user.email}</strong>
              </p>
              <a
                href="/my-account"
                className="tf-btn w-100 text-white mt-4"
                data-bs-dismiss="modal"
              >
                Ir a mi cuenta
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal modalCentered fade modal-log" id="log">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span
            className="icon icon-close btn-hide-popup"
            data-bs-dismiss="modal"
          />
          <div className="modal-log-wrap list-file-delete">
            <h5 className="title fw-semibold">Iniciar sesión</h5>
            <form onSubmit={handleSubmit} className="form-log">
              <div className="form-content">
                {error && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {error}
                  </div>
                )}
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="position-relative">
                  <label className="fw-semibold body-md-2">
                    Contraseña *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <span
                    className="position-absolute text-primary"
                    style={{
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      marginTop: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      userSelect: "none",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </span>
                </fieldset>
                <a
                  href="/forgot-password"
                  className="link text-end body-text-3"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <button
                type="submit"
                className="tf-btn w-100 text-white"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
              <p className="body-text-3 text-center">
                ¿No tienes una cuenta?{" "}
                <a
                  href="#register"
                  data-bs-toggle="modal"
                  className="text-primary"
                >
                  Registrarse
                </a>
              </p>
            </form>
            <div className="orther-log text-center">
              <span className="br-line bg-gray-5" />
              <p className="caption text-main-2">O inicia sesión con</p>
            </div>
            <ul className="list-log">
              <li>
                <a href="#" className="tf-btn btn-line w-100">
                  <i className="icon icon-facebook-2" />
                  <span className="body-md-2 fw-semibold">Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className="tf-btn btn-line w-100">
                  <i className="icon icon-google" />
                  <span className="body-md-2 fw-semibold">Google</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
