// Convierte un teléfono (+51 987654321) en un link wa.me válido.
export function whatsappLinkFromPhone(phone) {
  if (!phone) return null
  const digits = phone.replace(/[^\d]/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}`
}

// Para grupos, el JSON ya trae el link directo (chat.whatsapp.com/...).
export function whatsappGroupLink(link) {
  return link || null
}
