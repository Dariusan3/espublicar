# Infraestructura — estado actual

Fecha de referencia: 12 septiembre 2026. Este documento describe cómo está
desplegado el proyecto ahora mismo, no cómo debería estar. Actualízalo cuando
cambie algo aquí descrito.

## Diagrama

```
Navegador
   │
   │  HTTPS a espublicar.com / www.espublicar.com
   ▼
Cloudflare (solo DNS, sin proxy)
   │  registros A → 76.76.21.21, "DNS only" (nube gris)
   ▼
Vercel  ── build, hosting, funciones de servidor, certificado TLS
   │
   ├── Supabase (Postgres + Auth + Storage)
   └── Stripe (Checkout + webhook)
```

## Dominio y DNS

- Dominio `espublicar.com` comprado fuera de Vercel; nameservers apuntan a
  Cloudflare (`mustafa.ns.cloudflare.com`, `rosa.ns.cloudflare.com`).
- Dentro de Cloudflare, DNS → Records, solo estos dos importan:
  ```
  A   espublicar.com       76.76.21.21   DNS only (nube gris)
  A   www.espublicar.com   76.76.21.21   DNS only (nube gris)
  ```
- **"DNS only" es obligatorio, no opcional.** Si cualquiera de los dos se
  pone en "Proxied" (nube naranja), Cloudflare intercepta el TLS antes de
  que llegue a Vercel y el dominio deja de cargar con un error de
  certificado (`SAN mismatch` / `ERR_QUIC_PROTOCOL_ERROR` en Chrome).
- El registro `CAA` en `espublicar.com` permite `letsencrypt.org` entre
  otras CAs — Vercel emite con Let's Encrypt, así que no lo toques.
- El dominio está añadido al proyecto `espublicar` en Vercel
  (`vercel domains add espublicar.com` y `www.espublicar.com`). Vercel
  emite y renueva el certificado solo; no hay nada que renovar a mano.
- Quedan restos de la configuración anterior con Appwrite
  (`*.espublicar.com` y `www` apuntaban a `appwrite.network`, además de
  varios registros A/AAAA hacia IPs de Appwrite/Fastly). Esos ya se
  borraron de Cloudflare; si reaparecen algún día, hay que volver a
  eliminarlos.

## Hosting: Vercel

- Proyecto: `dariusan3s-projects/espublicar` (`prj_YHhBzaLBV1zoIsg5b6ANGDK6KhKL`).
- Framework preset: Next.js. Build command por defecto (`next build`).
- **El repositorio de GitHub (`Dariusan3/espublicar`) todavía no está
  conectado al proyecto de Vercel.** Cada deploy hasta ahora se ha hecho a
  mano con `vercel --prod` desde este equipo. Conectar Git (Vercel →
  proyecto → Settings → Git → Connect Git Repository) para que un `git
  push` a `main` despliegue solo, y cada rama/PR genere su propio preview,
  es un paso pendiente y consciente — no ocurre automáticamente por tener
  el dominio o las env vars puestas.
- Variables de entorno están puestas en **Production** en Vercel; el
  entorno **Preview** solo tiene las variables antiguas de Appwrite (ver
  tabla abajo), así que un deploy de preview todavía correría contra
  `placeholder.supabase.co`. Cuando se conecte Git y empiecen a existir
  previews reales, hay que copiar las mismas variables a Preview.

### Variables de entorno — Production

| Variable | Para qué sirve | Dónde se consigue |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (viaja al navegador) | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_BUCKET` | Bucket de Storage para imágenes (`images`) | fijo, no cambia |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe, modo **test** (`sk_test_…`) | Stripe → Developers → API keys |
| `ORDER_CONFIRM_SECRET` | Secreto compartido con la función Postgres `confirm_order_payment` — sin él, ningún pago se puede marcar pagado | generado una vez, guardado también en la tabla `app_secrets` de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **Vacía a propósito.** El webhook de Stripe confirma pagos a través de `ORDER_CONFIRM_SECRET`, no con la service role | Supabase → Project Settings → API → `service_role`, solo si algún día se prefiere esa vía |
| `STRIPE_WEBHOOK_SECRET` | **Todavía NO está en Vercel.** Solo existe una versión de prueba local (`whsec_…` de `stripe listen`), que no sirve en producción | ver sección Stripe abajo |
| `STRIPE_PRO_PRICE_ID` | Precio recurrente del plan Pro (2,99 €/mes) | creado una vez vía Stripe CLI, ver sección Pro |
| `PLAN_CONFIRM_SECRET` | Secreto de `set_user_plan`, mismo rol que `ORDER_CONFIRM_SECRET` pero para el plan | generado por la propia base de datos en la migración `pro_plan` |

Variables **NEXT_PUBLIC_APPWRITE_\*** (`BUCKET_ID`, `ENDPOINT`,
`PROJECT_ID`, `DATABASE_ID`) siguen en Vercel desde antes de la migración a
Supabase, en Production y Preview. Ningún código las lee ya. Se pueden
borrar cuando se quiera; no rompen nada estando.

## Base de datos: Supabase

- Proyecto `espublicar`, ref `drctqixwwhahbierhmuu`, región `eu-west-1`.
- Postgres 17. Todo el acceso pasa por RLS — no hay ninguna ruta que use la
  service role en producción ahora mismo.
- Migraciones aplicadas, en orden:
  1. `messages_offer_type` — mensajes de tipo oferta en el chat.
  2. `user_addresses` — direcciones guardadas en el perfil (columna jsonb).
  3. `lock_down_user_emails_and_admin_role` — cierra `user_read` público
     (antes cualquiera con la clave anónima leía email de todos), añade
     columna `role`, función `is_admin()`, vista `public_profiles` (sin
     email/teléfono) para perfiles de vendedor, y política de admin sobre
     `orders`.
  4. `lock_payment_status_to_server` — tabla `app_secrets` (RLS sin
     políticas, ilegible por API), función `confirm_order_payment(order_id,
     secret)`, trigger que rechaza cualquier cambio de `paymentStatus` o
     `status` que no venga de esa función o de la service role.
  5. `confirm_payment_skips_cancelled` — un pedido cancelado no se puede
     marcar pagado por esta vía (si llegó dinero después de cancelar, es un
     reembolso, no una venta).
- Cuenta admin: el `role = 'admin'` está puesto manualmente en la fila de
  `dariusosadici@gmail.com` en la tabla `user`. Para dar acceso de admin a
  otra cuenta, hay que actualizar esa columna a mano (no hay UI para esto).

## Plan de compradores: espublicar Pro

- Suscripción recurrente real (Stripe, modo test), **2,99 €/mes**, no un
  flag decorativo. Producto `prod_VG8aC9Cu6MdllL`, precio
  `price_1UFcJT9GaZBKOiTySRwTMe9A` (variable `STRIPE_PRO_PRICE_ID`).
- Perks en vivo, ya funcionando:
  1. **Envío gratis** cuando el vendedor ofrece envío — cambia una línea en
     `Checkout.tsx` (`shippingCost`), no toca el 3 % de comisión.
  2. **Oferta destacada** — en `Mis ofertas → Recibidas`, las ofertas de un
     comprador Pro se ordenan primero y llevan una insignia "Pro". Lee el
     plan del comprador desde `public_profiles` (no expone email/teléfono).
- Marcado como "Próximamente" en la página `/pro`, no construido:
  **alertas de búsquedas guardadas**. Es el único perk que pide una tabla
  nueva (`saved_searches`) y un motor de coincidencia — no existía nada de
  eso y no se ha fingido que funciona.
- Se decidió explícitamente NO ofrecer "ventana de protección extendida":
  no existe ningún mecanismo real de disputa/reembolso en el código (solo
  texto de marketing — "Reembolso garantizado" en Hero/HowItWorks/Checkout
  no está respaldado por ninguna lógica). Prometer una ventana *más larga*
  de algo que no existe habría sido la misma mentira que ya se corrigió con
  `trackingNumber` (ver debajo), así que se dejó fuera del plan v1.

### Seguridad del plan
Mismo patrón que la confirmación de pago: el cliente puede leer su propio
`plan`, pero solo puede cambiarlo la función `set_user_plan(...)`, protegida
por el secreto `PLAN_CONFIRM_SECRET` (tabla `app_secrets`, fila
`plan_confirm`) y un trigger (`user_guard_plan_state`) que rechaza cualquier
edición de `plan`/`stripeCustomerId`/`stripeSubscriptionId` que no venga de
esa función o de la service role. Nadie puede dar de alta su propia cuenta
Pro editando su fila.

### Rutas de servidor
- `app/api/pro/checkout/route.ts` — crea la sesión de Stripe en
  `mode: "subscription"`. El `userId` viaja en `subscription_data.metadata`,
  así que llega en todos los eventos futuros de esa suscripción (renovación,
  cancelación) sin necesitar una búsqueda por customer.
- `app/api/pro/portal/route.ts` — abre el Billing Portal de Stripe para
  cancelar/gestionar. Deliberadamente no hay lógica de cancelación propia:
  la gestiona Stripe, así el estado nunca se desincroniza de lo que
  realmente se cobró.
- `app/api/stripe/webhook/route.ts` — el mismo endpoint que confirma pedidos
  ahora también escucha `customer.subscription.created/updated/deleted` y
  llama a `set_user_plan`.

### ⚠️ Pendiente para producción, además de lo ya anotado en la lista de
más abajo: cuando se cree el endpoint de webhook real en Stripe (paso ya
listado), hay que seleccionar **también**
`customer.subscription.created`, `customer.subscription.updated` y
`customer.subscription.deleted` — no solo los dos eventos de
`checkout.session`. Sin ellos, suscribirse cobra pero nunca activa el plan.

### Nota técnica: `current_period_end` cambió de sitio
En la versión de API en uso (`2026-08-26.dahlia`, `billing_mode: flexible`),
la fecha de renovación ya no vive en `subscription.current_period_end`
(queda `undefined`) sino en `subscription.items.data[0].current_period_end`.
El webhook ya lee de ahí con fallback al campo viejo — solo se documenta
aquí porque es fácil volver a caer en el mismo bug si se toca ese código
sin saberlo.

## Pagos: Stripe

- Cuenta Stripe: `acct_1UAYKF7B0pHg7Ujq`. El proyecto corre en **modo
  test** (`sk_test_…`) — cualquiera puede "comprar" con la tarjeta
  `4242 4242 4242 4242` sin que se cobre nada de verdad. Intencional para
  un proyecto de portfolio.
- Métodos de pago activos: solo tarjeta. Bizum y PayPal están escritos en
  el código (`components/shop-cart/Checkout.tsx`) pero comentados, porque
  no están activados en Stripe → Settings → Payment methods.
- Comisión de la plataforma: 3 % sobre el subtotal, calculada en
  `app/api/checkout/route.ts`.
- Rutas de servidor relacionadas:
  - `app/api/checkout/route.ts` — crea la sesión de Stripe Checkout.
  - `app/api/checkout/confirm/route.ts` — el comprador vuelve aquí después
    de pagar; confirma con Stripe y llama a `confirm_order_payment`.
  - `app/api/stripe/webhook/route.ts` — red de seguridad para cuando el
    comprador cierra la pestaña antes de volver. Stripe reintenta este
    endpoint durante días si falla, así que un pedido pagado nunca se queda
    colgado en "pendiente" para siempre.
- **El webhook todavía no está conectado a nada en producción.** Falta:
  1. Stripe (modo **test**, no live) → Developers → Webhooks → Add
     endpoint → `https://espublicar.com/api/stripe/webhook`, eventos
     `checkout.session.completed` y `checkout.session.async_payment_succeeded`.
  2. Copiar el `whsec_…` que da ese endpoint (es distinto del que usa
     `stripe listen` en local) a Vercel como `STRIPE_WEBHOOK_SECRET`,
     entorno Production.
  3. Redeploy.

  Sin esto, la confirmación normal (comprador vuelve a `/checkout/success`)
  sigue funcionando igual — el webhook solo cubre el caso de que no vuelva.

## Lo que falta, en una lista

- [ ] Conectar `Dariusan3/espublicar` al proyecto de Vercel (deploy
      automático en cada push a `main`).
- [ ] Añadir `STRIPE_WEBHOOK_SECRET` de producción y crear el endpoint en
      Stripe (test mode), con **los cinco eventos**: `checkout.session.completed`,
      `checkout.session.async_payment_succeeded`,
      `customer.subscription.created`, `customer.subscription.updated`,
      `customer.subscription.deleted` — los tres últimos son los que
      activan/cancelan el plan Pro.
- [ ] Copiar las variables de Supabase/Stripe/Pro al entorno **Preview** de
      Vercel, para cuando existan deploys de rama/PR.
- [ ] Construir el perk que falta: alertas de búsquedas guardadas (tabla
      `saved_searches` + motor de coincidencia sobre `notifications`). Está
      anunciado como "Próximamente" en `/pro`, no como disponible.
- [ ] Borrar las variables `NEXT_PUBLIC_APPWRITE_*` (opcional, no rompen
      nada estando).
