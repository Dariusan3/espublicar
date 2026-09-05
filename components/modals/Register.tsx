"use client";
import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import useUser from "@/hooks/useUser";
import { UserDB } from "@/types/Types";
import { toast } from "react-toastify";

export default function Register() {
  const { signUserUp, signUserIn } = useAuth();
  const { loginWithGoogle, loginWithFacebook } = useAuthContext();
  const { createUserInDB } = useUser();

  const handleOAuth = (provider: "google" | "facebook") => {
    const modal = document.getElementById("register");
    if (modal && typeof window !== "undefined") {
      const bootstrap = require("bootstrap");
      const instance = bootstrap.Modal.getInstance(modal);
      if (instance) instance.hide();
    }
    if (provider === "google") loginWithGoogle();
    else loginWithFacebook();
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const signUpResult = await signUserUp(email, password, name);
      if (!signUpResult.success) {
        setError(signUpResult.message);
        setLoading(false);
        return;
      }

      const signInResult = await signUserIn(email, password);
      if (!signInResult.success) {
        setError(signInResult.message);
        setLoading(false);
        return;
      }

      const newUser: UserDB = {
        name: name,
        email: email,
      };

      const createUserResult = await createUserInDB(newUser, signUpResult.data);
      if (!createUserResult.success) {
        setError(
          "Cuenta creada pero error al guardar el perfil: " +
            createUserResult.message,
        );
        setLoading(false);
        return;
      }

      const modal = document.getElementById("register");
      const bootstrap = require("bootstrap");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      toast.success("¡Registro exitoso! Bienvenido a espublicar");

      setTimeout(() => {
        window.location.href = "/mi-cuenta";
      }, 1000);
    } catch (err: any) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modalCentered fade modal-log" id="register">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span
            className="icon icon-close btn-hide-popup"
            data-bs-dismiss="modal"
          />
          <div className="modal-log-wrap list-file-delete">
            <h5 className="title fw-semibold">Crear cuenta</h5>
            <form onSubmit={handleSubmit} className="form-log">
              <div className="form-content">
                {error && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {error}
                  </div>
                )}
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </fieldset>
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
                    placeholder="Mínimo 8 caracteres"
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
                <fieldset className="position-relative">
                  <label className="fw-semibold body-md-2">
                    Confirmar contraseña *
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Ocultar" : "Mostrar"}
                  </span>
                </fieldset>
              </div>
              <button
                type="submit"
                className="tf-btn w-100 text-white"
                disabled={loading}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
              <p className="body-text-3 text-center">
                ¿Ya tienes una cuenta?{" "}
                <a href="#log" data-bs-toggle="modal" className="text-primary">
                  Iniciar sesión
                </a>
              </p>
            </form>
            <div className="orther-log text-center">
              <span className="br-line bg-gray-5" />
              <p className="caption text-main-2">O regístrate con</p>
            </div>
            <ul className="list-log">
              <li>
                <button
                  type="button"
                  className="tf-btn btn-line w-100"
                  onClick={() => handleOAuth("facebook")}
                >
                  <i className="icon icon-facebook-2" />
                  <span className="body-md-2 fw-semibold">Facebook</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="tf-btn btn-line w-100"
                  onClick={() => handleOAuth("google")}
                >
                  <i className="icon icon-google" />
                  <span className="body-md-2 fw-semibold">Google</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
