// Refuse to start a second dev server on the same .next directory.
//
// When port 3000 is taken, Next quietly starts on 3001 instead. Both servers
// then share ./.next, the newer one rewrites it, and the older one serves
// chunk URLs that no longer exist — every asset 404s with no obvious cause.
const net = require("net");

const PORT = Number(process.env.PORT) || 3000;
const probe = net.createServer();

probe.once("error", (err) => {
  if (err.code !== "EADDRINUSE") throw err;
  console.error(
    `\n  El puerto ${PORT} ya está ocupado por un servidor de desarrollo.\n` +
      `  Compartir .next entre dos procesos rompe el que ya estaba: 404 en todos los chunks,\n` +
      `  o 500 con "Cannot read properties of undefined (reading '/_app')" si encima se compila.\n\n` +
      `  Ciérralo primero:  lsof -ti:${PORT} | xargs kill\n`,
  );
  process.exit(1);
});

probe.once("listening", () => probe.close());
probe.listen(PORT);
