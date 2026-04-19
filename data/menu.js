export const demoItems = [
  {
    id: 1,
    href: "/",
    active: true,
    imageSrc: "/images/demo/home-1.jpg",
    labels: [{ text: "Inicio", className: "demo-new" }],
    name: "Inicio",
  },
];

export const shopPages = [
  {
    id: 1,
    heading: "TIENDA",
    items: [
      { id: 1, href: "/shop-default", text: "Tienda" },
      { id: 2, href: "/shop-right-sidebar", text: "Tienda con filtros" },
      { id: 3, href: "/shop-fullwidth", text: "Tienda completa" },
      { id: 4, href: "/shop-cart", text: "Carrito" },
    ],
  },
  {
    id: 2,
    heading: "MI CUENTA",
    items: [
      { id: 1, href: "/wishlist", text: "Favoritos" },
      { id: 3, href: "/checkout", text: "Finalizar compra" },
      { id: 4, href: "/track-your-order", text: "Rastrear pedido" },
      { id: 5, href: "/my-account", text: "Mi cuenta" },
    ],
  },
];

export const shopDetailsPages = [
  {
    id: 1,
    heading: "PRODUCTO",
    items: [
      { id: 1, href: "/product/1", text: "Detalle del producto" },
    ],
  },
];

export const blogMenuItems = [
  { id: 1, href: "/blog-list", text: "Lista de artículos" },
  { id: 2, href: "/blog-grid", text: "Artículos" },
  { id: 3, href: "/blog-detail", text: "Detalle del artículo" },
];

export const othersPages = [
  { id: 1, href: "/contact", text: "Contacto" },
  { id: 2, href: "/about", text: "Sobre nosotros" },
  { id: 3, href: "/privacy", text: "Privacidad" },
  { id: 4, href: "/faq", text: "Preguntas frecuentes" },
  { id: 5, href: "/404", text: "404" },
];
