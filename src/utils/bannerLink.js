import { whatsappLinkFromPhone } from './whatsapp.js'

// El nombre de archivo de un cartel de banner es o un número de WhatsApp
// (+51 987654321) o una URL externa (formulario, linktree, etc.) codificada
// en base64url. Los caracteres de una URL (":", "/", "?") no son válidos en
// nombres de archivo de Windows, y el percent-encoding (%XX) tampoco sirve
// porque Vite lo reinterpreta al resolver import.meta.glob y descarta el
// archivo silenciosamente. Base64url usa solo [A-Za-z0-9_-], sin ese problema.
//
// Para codificar una URL nueva al subir un cartel:
//   Buffer.from(url, 'utf-8').toString('base64url')   // Node
// Acá solo se decodifica, con atob/TextDecoder (disponibles en browser y Node).
function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function bannerLinkFromContacto(contacto) {
  if (!contacto) return { href: null, kind: 'whatsapp', label: contacto }

  // Los números de WhatsApp llevan "+" y espacios, que no son parte del
  // alfabeto base64url — si contacto no calza con ese alfabeto, ni se intenta decodificar.
  if (/^[A-Za-z0-9_-]+$/.test(contacto)) {
    try {
      const decoded = base64UrlDecode(contacto)
      if (/^https?:\/\//i.test(decoded)) {
        return { href: decoded, kind: 'url', label: 'Inscribirse' }
      }
    } catch {
      // No era base64url válido — se trata como número de WhatsApp.
    }
  }

  return { href: whatsappLinkFromPhone(contacto), kind: 'whatsapp', label: contacto }
}
