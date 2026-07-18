import {
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  TagIcon,
  CalendarIcon,
  TruckIcon,
  WrenchIcon,
} from '../components/Icons.jsx'
import { whatsappLinkFromPhone, whatsappGroupLink } from '../utils/whatsapp.js'
import { slugify, stripDiacritics } from '../utils/slug.js'

// Cada entrada define: label/emoji para tabs, y normalize() que convierte
// un item crudo del JSON en el esquema común que consume <Card />.
//
// Esquema común devuelto por normalize():
// {
//   id, nombre, imagen, descripcion, badge,
//   direccion: { texto, mapsQuery } | null,
//   telefono, email, web,
//   whatsapp: { label, href } | null,
//   socials: { instagram, tiktok, youtube, twitch },
//   extra: [{ icon, text }],
//   cta: { label, href } | null,   // ej. link de inscripción a un evento
//   detailUrl: string | null        // página indexable propia (solo canchas/tiendas con departamento/ciudad)
// }

export const categoryConfig = {
  canchas: {
    label: 'Canchas',
    imgAlt: 'Cancha de airsoft',
    emoji: '🎯',
    normalize: (i) => ({
      id: i.id,
      nombre: i.nombre,
      imagen: i.imagen,
      descripcion: i.descripcion,
      badge: i.departamento || null,
      direccion: i.direccion ? { texto: i.direccion, mapsQuery: i.direccion } : null,
      telefono: i.telefono,
      email: i.email,
      web: i.web,
      whatsapp: i.whatsapp ? { label: 'Contactar por WhatsApp', href: whatsappLinkFromPhone(i.whatsapp) } : null,
      socials: { instagram: i.instagram, tiktok: i.tiktok, youtube: null, twitch: null },
      extra: [
        i.organizador ? { icon: UsersIcon, text: `Organizador: ${i.organizador}` } : null,
        i.horarios ? { icon: ClockIcon, text: i.horarios } : null,
      ].filter(Boolean),
      cta: null,
      detailUrl: i.departamento && i.nombre ? `/campos/${slugify(i.departamento)}/${slugify(i.nombre)}/` : null,
    }),
  },

  eventos: {
    label: 'Eventos',
    imgAlt: 'Evento de airsoft',
    emoji: '🔥',
    normalize: (i) => ({
      id: i.id,
      nombre: i.nombre,
      imagen: i.imagen,
      descripcion: i.descripcion,
      badge: null,
      direccion: i.ubicacion ? { texto: i.ubicacion, mapsQuery: i.ubicacion } : null,
      telefono: null,
      email: null,
      web: null,
      whatsapp: i.whatsapp ? { label: 'Contactar por WhatsApp', href: whatsappLinkFromPhone(i.whatsapp) } : null,
      socials: { instagram: null, tiktok: null, youtube: null, twitch: null },
      extra: [
        i.fecha_hora ? { icon: CalendarIcon, text: i.fecha_hora } : null,
        i.aforo ? { icon: UsersIcon, text: `Aforo: ${i.aforo}` } : null,
        i.contacto ? { icon: TagIcon, text: `Contacto: ${i.contacto}` } : null,
      ].filter(Boolean),
      cta: i.link_inscripcion ? { label: 'Inscribirme', href: i.link_inscripcion } : null,
    }),
  },

  grupos_whatsapp: {
    label: 'Grupos WhatsApp',
    imgAlt: 'Grupo de WhatsApp de airsoft',
    emoji: '💬',
    normalize: (i) => ({
      id: i.id,
      nombre: i.nombre,
      imagen: i.imagen,
      descripcion: i.descripcion,
      badge: i.tematica || null,
      direccion: null,
      telefono: null,
      email: null,
      web: null,
      whatsapp: i.link_whatsapp ? { label: 'Unirme al grupo', href: whatsappGroupLink(i.link_whatsapp) } : null,
      socials: { instagram: null, tiktok: null, youtube: null, twitch: null },
      extra: [
        i.miembros_aprox ? { icon: UsersIcon, text: `~${i.miembros_aprox} miembros` } : null,
        i.admin_contacto ? { icon: TagIcon, text: `Admin: ${i.admin_contacto}` } : null,
      ].filter(Boolean),
      cta: null,
    }),
  },

  jugadores: {
    label: 'Jugadores Influencers',
    imgAlt: 'Jugador influencer de airsoft',
    emoji: '🎮',
    dataKey: 'jugadores Influencers',
    normalize: (i) => ({
      id: i.id,
      nombre: i.nombre,
      imagen: i.foto,
      descripcion: i.descripcion,
      badge: null,
      direccion: null,
      telefono: null,
      email: null,
      web: null,
      whatsapp: null,
      socials: { instagram: i.instagram, tiktok: i.tiktok, youtube: i.youtube, twitch: i.twitch, facebook: i.facebook },
      extra: [],
      cta: null,
    }),
  },

  tiendas: {
    label: 'Tiendas',
    imgAlt: 'Tienda de airsoft',
    emoji: '🛒',
    normalize: (i) => ({
      id: i.id,
      nombre: i.nombre,
      imagen: i.imagen,
      descripcion: i.descripcion,
      badge: i.ciudad || null,
      direccion: i.direccion ? { texto: i.direccion, mapsQuery: i.direccion } : null,
      telefono: i.telefono,
      email: i.email,
      web: i.web,
      whatsapp: i.whatsapp ? { label: 'Contactar por WhatsApp', href: whatsappLinkFromPhone(i.whatsapp) } : null,
      socials: { instagram: i.instagram, tiktok: i.tiktok, youtube: null, twitch: null },
      extra: [i.especialidad ? { icon: TagIcon, text: i.especialidad } : null].filter(Boolean),
      cta: null,
      detailUrl: i.ciudad && i.nombre ? `/tiendas/${slugify(i.ciudad)}/${slugify(i.nombre)}/` : null,
    }),
  },

  importadores: {
    label: 'Importadores',
    imgAlt: 'Importador de airsoft',
    emoji: '📦',
    normalize: (i) => ({
      id: i.id,
      nombre: i.nombre,
      imagen: i.imagen,
      descripcion: null,
      badge: null,
      direccion: null,
      telefono: null,
      email: i.email,
      web: null,
      whatsapp: i.whatsapp ? { label: 'Contactar por WhatsApp', href: whatsappLinkFromPhone(i.whatsapp) } : null,
      socials: { instagram: null, tiktok: null, youtube: null, twitch: null },
      extra: [
        i.contacto ? { icon: TagIcon, text: `Contacto: ${i.contacto}` } : null,
        i.especialidad ? { icon: TagIcon, text: i.especialidad } : null,
        i.tiempo_entrega ? { icon: ClockIcon, text: `Entrega: ${i.tiempo_entrega}` } : null,
        i.zonas_cobertura ? { icon: TruckIcon, text: `Cobertura: ${i.zonas_cobertura}` } : null,
      ].filter(Boolean),
      cta: null,
    }),
  },

  workshops: {
    label: 'Armeros & Mecánicos',
    imgAlt: 'Armero y mecánico de airsoft',
    emoji: '🔧',
    dataKey: 'Armeros & Mecánicos',
    normalize: (i) => ({
      id: i.id,
      nombre: i.nombre,
      imagen: i.imagen,
      descripcion: i.especialidad,
      badge: null,
      direccion: i.ubicacion ? { texto: i.ubicacion, mapsQuery: i.ubicacion } : null,
      telefono: null,
      email: i.email,
      web: null,
      whatsapp: i.whatsapp ? { label: 'Contactar por WhatsApp', href: whatsappLinkFromPhone(i.whatsapp) } : null,
      socials: { instagram: null, tiktok: null, youtube: null, twitch: null },
      extra: [
        i.contacto ? { icon: TagIcon, text: `Contacto: ${i.contacto}` } : null,
        i.horarios ? { icon: ClockIcon, text: i.horarios } : null,
        i.tiempo_reparacion_promedio ? { icon: WrenchIcon, text: `Reparación: ${i.tiempo_reparacion_promedio}` } : null,
      ].filter(Boolean),
      cta: null,
    }),
  },

  pintado_de_replicas: {
    label: 'Pintado de Réplicas',
    imgAlt: 'Pintado de réplicas de airsoft',
    emoji: '🎨',
    normalize: (i) => ({
      id: i.id,
      nombre: i.nombre,
      imagen: i.imagen,
      descripcion: i.especialidad,
      badge: null,
      direccion: i.ubicacion ? { texto: i.ubicacion, mapsQuery: i.ubicacion } : null,
      telefono: null,
      email: i.email,
      web: null,
      whatsapp: i.whatsapp ? { label: 'Contactar por WhatsApp', href: whatsappLinkFromPhone(i.whatsapp) } : null,
      socials: { instagram: i.instagram, tiktok: null, youtube: null, twitch: null },
      extra: [
        i.contacto ? { icon: TagIcon, text: `Contacto: ${i.contacto}` } : null,
        i.tiempo_entrega ? { icon: ClockIcon, text: `Entrega: ${i.tiempo_entrega}` } : null,
      ].filter(Boolean),
      cta: null,
    }),
  },

  equipos: {
    label: 'Equipos',
    imgAlt: 'Equipo de airsoft',
    emoji: '🛡️',
    normalize: (i) => ({
      id: i.id,
      nombre: i.nombre,
      imagen: i.logo,
      descripcion: i.descripcion,
      badge: null,
      direccion: null,
      telefono: null,
      email: null,
      web: i.web,
      whatsapp: i.whatsapp ? { label: 'Contactar al capitán', href: whatsappLinkFromPhone(i.whatsapp) } : null,
      socials: { instagram: i.instagram, tiktok: i.tiktok, youtube: i.youtube, twitch: null, facebook: i.facebook },
      extra: [
        i.cantidad_jugadores ? { icon: UsersIcon, text: `${i.cantidad_jugadores} jugadores` } : null,
        i.contacto_capitan ? { icon: TagIcon, text: `Capitán: ${i.contacto_capitan}` } : null,
        i.torneo_o_cancha_principal ? { icon: MapPinIcon, text: i.torneo_o_cancha_principal } : null,
      ].filter(Boolean),
      cta: null,
    }),
  },

  marco_legal: {
    label: 'Marco Legal & Reguladores',
    imgAlt: 'Entidad reguladora de airsoft en Perú',
    emoji: '⚖️',
    normalize: (i) => ({
      id: i.id,
      nombre: i.nombre,
      imagen: i.imagen,
      descripcion: i.descripcion,
      badge: i.tipo || null,
      direccion: i.direccion ? { texto: i.direccion, mapsQuery: i.direccion } : null,
      telefono: i.telefono,
      email: i.email,
      web: i.web,
      whatsapp: null,
      socials: { instagram: null, tiktok: null, youtube: null, twitch: null },
      extra: [i.relevancia ? { icon: TagIcon, text: i.relevancia } : null].filter(Boolean),
      cta: i.archivo_pdf ? { label: 'Ver documento (PDF)', href: i.archivo_pdf } : null,
    }),
  },
}

export const categoryKeys = Object.keys(categoryConfig)

export function getSearchableText(rawItem) {
  return stripDiacritics(
    Object.values(rawItem)
      .filter((v) => typeof v === 'string' || typeof v === 'number')
      .join(' ')
  ).toLowerCase()
}
