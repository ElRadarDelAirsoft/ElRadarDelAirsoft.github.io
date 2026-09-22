// Etiqueta personalizada para un cartel del banner, en vez del genérico
// "Inscribirse" que arma bannerLinkFromContacto() por defecto. Sirve cuando
// dos carteles usan la MISMA imagen pero apuntan a links distintos (ej. el
// mismo cartel subido dos veces con dos formularios, uno por fecha) y hace
// falta texto que los diferencie.
//
// Clave = nombre de archivo compilado, igual que bannerEventDates.js. No
// aplica a números de WhatsApp (esos siempre muestran el número).
export const linkLabels = {}
