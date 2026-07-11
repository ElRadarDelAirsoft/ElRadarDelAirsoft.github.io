// Contenido del blog. Un solo post por ahora (ver plan de SEO/GEO) —
// el calendario completo de artículos se agrega en una siguiente etapa.
//
// Formato pensado para GEO (que un LLM te pueda citar): cada post abre con
// "respuestaRapida" (2-3 líneas, la respuesta directa a la pregunta del
// título) antes de desarrollar en las secciones. Los headings de sección
// van en formato pregunta natural.

export const blogPosts = [
  {
    id: 1,
    slug: 'airsoft-vs-paintball-vs-gotcha-vs-gelsoft-peru',
    title: 'Airsoft vs Paintball vs Gotcha vs Gelsoft: ¿cuál es la diferencia?',
    metaDescription:
      'Explicamos la diferencia entre airsoft, paintball, gotcha y gelsoft en Perú: munición, costos, nivel de impacto y dónde jugar cada uno.',
    publishedAt: '2026-07-10',
    respuestaRapida:
      'El airsoft usa réplicas de armas reales que disparan bolitas plásticas (BBs) mediante gas, resorte o motor eléctrico. El paintball dispara bolas de pintura con gas comprimido — y es justamente a esto a lo que mucha gente en Perú llama, de forma incorrecta, "gotcha". El gelsoft (o gel blaster) dispara bolitas de gel superabsorbente: es la opción más económica y de menor impacto de las tres.',
    sections: [
      {
        heading: '¿Es lo mismo airsoft que gotcha?',
        body: [
          'No. "Gotcha" no es una modalidad distinta ni una marca — es el nombre con el que, históricamente, se popularizó el paintball en Perú y buena parte de Latinoamérica (viene del inglés "you got me"). Cuando alguien busca "campos de gotcha" casi siempre se refiere a canchas de paintball, con marcadoras de gas comprimido y bolas de pintura, no a réplicas de airsoft.',
          'La confusión es tan común que vale la pena aclararla de entrada: si tu objetivo es jugar con réplicas realistas de armas y munición de BBs plásticas, lo que buscas es "airsoft", no "gotcha".',
        ],
      },
      {
        heading: 'Airsoft vs paintball: ¿en qué se diferencian?',
        body: [
          'La diferencia más notoria está en el equipo. El airsoft usa réplicas (AEG, GBB, resorte) que imitan con detalle armas reales, disparando BBs plásticas de 6mm a velocidades moderadas. El paintball usa marcadoras más grandes, impulsadas por CO2 o aire comprimido, que disparan bolas de gelatina rellenas de pintura de mayor calibre.',
          'Eso cambia la experiencia de juego: el airsoft tiende a priorizar el realismo táctico (CQB, MilSim, roles de escuadra) y duele bastante menos al impacto; el paintball es más intenso al golpear (la bola revienta y marca), las partidas suelen ser más cortas, y el costo por partida es más alto porque cada bola de pintura se usa una sola vez y cuesta más que una BB.',
        ],
      },
      {
        heading: '¿Qué es el gelsoft y en qué se diferencia del airsoft?',
        body: [
          'El gelsoft (también llamado gel blaster u "orbeez gun") es una modalidad más reciente que dispara bolitas de gel superabsorbente en vez de BBs plásticas. Al impactar, la bolita se rompe y se deshace en agua, por lo que el dolor y el riesgo son considerablemente menores que en airsoft o paintball.',
          'Es, en la práctica, la puerta de entrada más económica y accesible: las réplicas de gelsoft suelen costar una fracción de una réplica de airsoft, y en varios países (incluido Perú) tienen una regulación mucho más laxa por no clasificarse como réplica de arma de fuego. Es una buena opción para principiantes, niños o partidas casuales entre amigos, aunque la comunidad de airsoft "serio" en Perú todavía la ve como algo aparte, no como un reemplazo.',
        ],
      },
      {
        heading: 'Airsoft vs Paintball vs Gotcha vs Gelsoft: tabla comparativa',
        body: [
          'Gotcha no aparece como columna aparte porque, como vimos arriba, es el mismo paintball con otro nombre.',
        ],
      },
    ],
    comparativa: {
      headers: ['', 'Airsoft', 'Paintball (Gotcha)', 'Gelsoft'],
      rows: [
        ['Munición', 'BBs plásticas 6mm', 'Bolas de pintura', 'Bolitas de gel superabsorbente'],
        ['Impulso', 'Gas, resorte o eléctrico (AEG)', 'CO2 / aire comprimido', 'Eléctrico o resorte'],
        ['Nivel de impacto', 'Moderado', 'Alto (marca y duele)', 'Bajo'],
        ['Realismo de las réplicas', 'Alto (imitan armas reales)', 'Bajo (marcadoras voluminosas)', 'Medio'],
        ['Costo de entrada', 'Medio-alto', 'Medio', 'Bajo'],
        ['Costo por partida', 'Bajo (BBs económicas)', 'Alto (pintura de un solo uso)', 'Muy bajo'],
        ['Dónde jugar en Perú', 'Campos de airsoft (ver directorio)', 'Campos de paintball/"gotcha"', 'Aún poco extendido'],
      ],
    },
  },
]

export function getBlogPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null
}
