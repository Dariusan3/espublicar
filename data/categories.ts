export interface Category {
  label: string;
  value: string; // for search rel or query
  iconClass: string;
  href: string;
}

export const categories: Category[] = [
  {
    label: "Motor",
    value: "motor",
    iconClass: "icon-automative",
    href: "/shop-default?category=motor",
  },
  {
    label: "Inmobiliaria",
    value: "inmobiliaria",
    iconClass: "icon-location", // Placeholder for Real Estate
    href: "/shop-default?category=inmobiliaria",
  },
  {
    label: "Empleo",
    value: "empleo",
    iconClass: "icon-user-2",
    href: "/shop-default?category=empleo",
  },
  {
    label: "Formación y libros",
    value: "formacion-libros",
    iconClass: "icon-list-2", // Placeholder for Books
    href: "/shop-default?category=formacion-libros",
  },
  {
    label: "Servicios",
    value: "servicios",
    iconClass: "icon-tool",
    href: "/shop-default?category=servicios",
  },
  {
    label: "Negocios",
    value: "negocios",
    iconClass: "icon-money-bag",
    href: "/shop-default?category=negocios",
  },
  {
    label: "Informática",
    value: "informatica",
    iconClass: "icon-computer",
    href: "/shop-default?category=informatica",
  },
  {
    label: "Imagen y Sonido",
    value: "imagen-sonido",
    iconClass: "icon-headphone-2",
    href: "/shop-default?category=imagen-sonido",
  },
  {
    label: "Telefonía",
    value: "telefonia",
    iconClass: "icon-phone",
    href: "/shop-default?category=telefonia",
  },
  {
    label: "Juegos",
    value: "juegos",
    iconClass: "icon-fire", // Trending/Hot for Games
    href: "/shop-default?category=juegos",
  },
  {
    label: "Casa y Jardín",
    value: "casa-jardin",
    iconClass: "icon-sofa",
    href: "/shop-default?category=casa-jardin",
  },
  {
    label: "Moda y complementos",
    value: "moda-complementos",
    iconClass: "icon-clothing",
    href: "/shop-default?category=moda-complementos",
  },
  {
    label: "Bebés",
    value: "bebes",
    iconClass: "icon-hearth", // Care/Love for Babies
    href: "/shop-default?category=bebes",
  },
  {
    label: "Aficiones y ocio",
    value: "aficiones-ocio",
    iconClass: "icon-star", // Hobbies
    href: "/shop-default?category=aficiones-ocio",
  },
  {
    label: "Deportes y náutica",
    value: "deportes-nautica",
    iconClass: "icon-delivery", // Motion/Speed
    href: "/shop-default?category=deportes-nautica",
  },
  {
    label: "Mascotas y agricultura",
    value: "mascotas-agricultura",
    iconClass: "icon-globe", // Nature
    href: "/shop-default?category=mascotas-agricultura",
  },
  {
    label: "Comunidad",
    value: "comunidad",
    iconClass: "icon-user-21", // Group
    href: "/shop-default?category=comunidad",
  },
];
