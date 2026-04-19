"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
export default function Footer1({ fullWidth = false }) {
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };
  const sendEmail = async (e: any) => {
    e.preventDefault(); // Prevent default form submission behavior
    const email = e.target.email.value;

    try {
      const response = await axios.post(
        "https://express-brevomail.vercel.app/api/contacts",
        {
          email,
        }
      );

      if ([200, 201].includes(response.status)) {
        e.target.reset(); // Reset the form
        setSuccess(true); // Set success state
        handleShowMessage();
      } else {
        setSuccess(false); // Handle unexpected responses
        handleShowMessage();
      }
    } catch (error: any) {
      console.error("Error:", error.response?.data || "An error occurred");
      setSuccess(false); // Set error state
      handleShowMessage();
      e.target.reset(); // Reset the form
    }
  };
  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-mobile");

    const toggleOpen = (event: any) => {
      const parent = event.target.closest(".footer-col-block");
      const content = parent.querySelector(".tf-collapse-content");

      if (parent.classList.contains("open")) {
        parent.classList.remove("open");
        content.style.height = "0px";
      } else {
        parent.classList.add("open");
        content.style.height = content.scrollHeight + 10 + "px";
      }
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    // Clean up event listeners when the component unmounts
    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []); // Empty dependency array means this will run only once on mount

  return (
    <footer className="tf-footer">
      <div className="ft-body-wrap">
        <div className="ft-body-inner">
          <div className={`container${fullWidth ? "-full" : ""}`}>
            <div className="ft-inner flex-wrap flex-xl-nowrap">
              <div className="ft-logo">
                <Link href={`/`} className="logo-site">
                  <Image
                    alt="Logo"
                    src="/images/logo/logo.svg"
                    width={185}
                    height={41}
                  />
                </Link>
                <div className="method-payment">
                  <p>Aceptamos:</p>
                  <ul className="method-list">
                    <li>
                      <Image
                        alt="Payment"
                        src="/images/payment/visa.svg"
                        width={50}
                        height={50}
                      />
                    </li>
                    <li>
                      <Image
                        alt="Payment"
                        src="/images/payment/paypal.svg"
                        width={50}
                        height={50}
                      />
                    </li>
                    <li>
                      <Image
                        alt="Payment"
                        src="/images/payment/discover.svg"
                        width={50}
                        height={50}
                      />
                    </li>
                    <li>
                      <Image
                        alt="Payment"
                        src="/images/payment/master.svg"
                        width={50}
                        height={50}
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <ul className="ft-link-wrap w-100 tf-grid-layout md-col-2 lg-col-4">
                <li className="footer-col-block">
                  <h6 className="ft-heading footer-heading-mobile fw-semibold">
                    Ayuda
                  </h6>
                  <div className="tf-collapse-content">
                    <ul className="ft-menu-list">
                      <li>
                        <Link href={`/privacy`} className="link">
                          Información de envío
                        </Link>
                      </li>
                      <li>
                        <Link href={`/faq`} className="link">
                          Términos y condiciones
                        </Link>
                      </li>
                      <li>
                        <Link href={`/privacy`} className="link">
                          Devoluciones y reembolsos
                        </Link>
                      </li>
                      <li>
                        <Link href={`/privacy`} className="link">
                          Aviso de privacidad
                        </Link>
                      </li>
                      <li>
                        <Link href={`/faq`} className="link">
                          Preguntas frecuentes
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="footer-col-block">
                  <h6 className="ft-heading footer-heading-mobile fw-semibold">
                    Categorías populares
                  </h6>
                  <div className="tf-collapse-content">
                    <ul className="ft-menu-list">
                      <li>
                        <Link href="/shop-default?category=Electrónica" className="link">
                          Electrónica
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-default?category=Moda" className="link">
                          Moda
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-default?category=Hogar" className="link">
                          Hogar
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-default?category=Deportes" className="link">
                          Deportes
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-default?category=Vehículos" className="link">
                          Vehículos
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-default?category=Muebles" className="link">
                          Muebles
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-default?category=Libros" className="link">
                          Libros
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="footer-col-block">
                  <h6 className="ft-heading footer-heading-mobile fw-semibold">
                    Atención al cliente
                  </h6>
                  <div className="tf-collapse-content">
                    <ul className="ft-menu-list">
                      <li>
                        <Link href={`/my-account`} className="link">
                          Mi cuenta
                        </Link>
                      </li>
                      <li>
                        <Link href={`/track-your-order`} className="link">
                          Rastrear pedido
                        </Link>
                      </li>
                      <li>
                        <Link href={`/contact`} className="link">
                          Servicio al cliente
                        </Link>
                      </li>
                      <li>
                        <Link href={`/privacy`} className="link">
                          Devoluciones y cambios
                        </Link>
                      </li>
                      <li>
                        <Link href={`/faq`} className="link">
                          Preguntas frecuentes
                        </Link>
                      </li>
                      <li>
                        <Link href={`/contact`} className="link">
                          Soporte
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="footer-col-block type-sp-2">
                  <h6 className="ft-heading footer-heading-mobile fw-semibold">
                    Contacto
                  </h6>
                  <div className="tf-collapse-content">
                    <ul className="ft-menu-list ft-contact-list">
                      <li>
                        <span className="icon">
                          <i className="icon-location" />
                        </span>
                        <a href="#" className="link">
                          Madrid, España
                        </a>
                      </li>
                      <li>
                        <span className="icon">
                          <i className="icon-phone" />
                        </span>
                        <a href="#" className="product-title">
                          <span className="product-title text-primary">
                            +8(800) 123 4567
                          </span>
                        </a>
                      </li>
                      <li>
                        <span className="icon">
                          <i className="icon-direction" />
                        </span>
                        <a href="#" className="">
                          <span className="text-primary">
                            soporte@espublicar.com
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="ft-body-center bg-gray">
          <div className={`container${fullWidth ? "-full" : ""}`}>
            <div className="ft-center justify-content-xxl-between">
              <p className="notice text-white justify-content-xxl-between">
                <span className="main-title fw-semibold">
                  <Image alt="" src="/images/mail.svg" width={24} height={21} />
                  10% de descuento en tu primer pedido
                </span>
                <span className="body-text-3">
                  Sé el primero en conocer ofertas, nuevos productos y
                  descuentos
                </span>
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendEmail(e);
                }}
                className="form-newsletter"
              >
                <div
                  className={`tfSubscribeMsg  footer-sub-element ${
                    showMessage ? "active" : ""
                  }`}
                >
                  {success ? (
                    <p style={{ color: "rgb(52, 168, 83)" }}>
                      Te has suscrito correctamente.
                    </p>
                  ) : (
                    <p style={{ color: "red" }}>Algo salió mal</p>
                  )}
                </div>
                <div className="subscribe-content">
                  <fieldset className="email">
                    <input
                      type="email"
                      name="email"
                      className="subscribe-email type-fs-2"
                      placeholder="Ingresa tu correo electrónico"
                      tabIndex={0}
                      aria-required="true"
                      required
                    />
                  </fieldset>
                  <div className="button-submit">
                    <button
                      className="subscribe-button tf-btn btn-large hover-shine"
                      type="submit"
                    >
                      <span className="body-md-2 fw-semibold text-white">
                        Suscribirse
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="ft-body-bottom">
          <div className={`container${fullWidth ? "-full" : ""}`}>
            <div className="ft-bottom">
              <ul className="social-list">
                <li>
                  <a href="https://www.facebook.com">
                    <i className="icon-facebook" />
                  </a>
                </li>
                <li>
                  <a href="https://x.com/">
                    <i className="icon-x" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/">
                    <i className="icon-instagram" />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/">
                    <i className="icon-linkin" />
                  </a>
                </li>
                <li>
                  <a href="https://web.whatsapp.com/">
                    <i className="icon-whatapp" />
                  </a>
                </li>
              </ul>
              <ul className="ft-menu-list-2 body-text-3">
                <li>
                  <Link
                    href={`/blog-grid`}
                    className="title-sidebar link fw-bold"
                  >
                    Novedades
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/blog-grid`}
                    className="title-sidebar link fw-bold"
                  >
                    Más vendidos
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/blog-grid`}
                    className="title-sidebar link fw-bold"
                  >
                    Oferta del día
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/blog-grid`}
                    className="title-sidebar link fw-bold"
                  >
                    Top 100 ofertas
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/blog-grid`}
                    className="title-sidebar link fw-bold"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/blog-grid`}
                    className="title-sidebar link fw-bold"
                  >
                    <i className="icon-fire" /> 50% OFF
                  </Link>
                </li>
              </ul>
              <p className="nocopy caption text-center">
                <span className="fw-medium">espublicar.</span> © 2025. Todos
                los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
