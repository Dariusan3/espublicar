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
    href: "#",
  },
  {
    label: "Inmobiliaria",
    value: "inmobiliaria",
    iconClass: "icon-location", // Placeholder for Real Estate
    href: "#",
  },
  {
    label: "Empleo",
    value: "empleo",
    iconClass: "icon-user-2",
    href: "#",
  },
  {
    label: "Formación y libros",
    value: "formacion-libros",
    iconClass: "icon-list-2", // Placeholder for Books
    href: "#",
  },
  {
    label: "Servicios",
    value: "servicios",
    iconClass: "icon-tool",
    href: "#",
  },
  {
    label: "Negocios",
    value: "negocios",
    iconClass: "icon-money-bag",
    href: "#",
  },
  {
    label: "Informática",
    value: "informatica",
    iconClass: "icon-computer",
    href: "#",
  },
  {
    label: "Imagen y Sonido",
    value: "imagen-sonido",
    iconClass: "icon-headphone-2",
    href: "#",
  },
  {
    label: "Telefonía",
    value: "telefonia",
    iconClass: "icon-phone",
    href: "#",
  },
  {
    label: "Juegos",
    value: "juegos",
    iconClass: "icon-fire", // Trending/Hot for Games
    href: "#",
  },
  {
    label: "Casa y Jardín",
    value: "casa-jardin",
    iconClass: "icon-sofa",
    href: "#",
  },
  {
    label: "Moda y complementos",
    value: "moda-complementos",
    iconClass: "icon-clothing",
    href: "#",
  },
  {
    label: "Bebés",
    value: "bebes",
    iconClass: "icon-hearth", // Care/Love for Babies
    href: "#",
  },
  {
    label: "Aficiones y ocio",
    value: "aficiones-ocio",
    iconClass: "icon-star", // Hobbies
    href: "#",
  },
  {
    label: "Deportes y náutica",
    value: "deportes-nautica",
    iconClass: "icon-delivery", // Motion/Speed
    href: "#",
  },
  {
    label: "Mascotas y agricultura",
    value: "mascotas-agricultura",
    iconClass: "icon-globe", // Nature
    href: "#",
  },
  {
    label: "Comunidad",
    value: "comunidad",
    iconClass: "icon-user-21", // Group
    href: "#",
  },
];
