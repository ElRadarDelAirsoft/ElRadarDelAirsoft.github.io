// Contenido de la sección "Empieza aquí" — guías para jugadores nuevos.
// Mismo patrón que blogPosts.js: contenido largo en JS, no en airsoft.json.
//
// Los bloques usan "type" para que scripts/prerender.mjs sepa cómo renderizar
// cada uno. El tipo 'canchas-recomendadas' no trae datos propios: se llena en
// build time con data.canchas.filter(c => c.apto_principiantes) para que la
// lista nunca quede desactualizada respecto al JSON.
//
// PROPUESTA — pendiente de validar con el dueño del sitio antes de publicar:
// - No incluye precios de alquiler/entrada (varían por cancha y no los tengo
//   verificados) — en su lugar remite a preguntar directo por WhatsApp.
// - No incluye links a productos de AliExpress (no genero URLs de tiendas que
//   no puedo verificar) — en su lugar da términos de búsqueda en texto plano.
// - El bloque "tips" del tercer post trae solo 3 ejemplos de relleno: está
//   pensado para que el dueño lo reemplace con sus propias anotaciones.

export const guiasInicio = [
  {
    id: 1,
    slug: 'primera-vez-airsoft',
    icon: 'ShieldCheckIcon',
    title: 'Voy a jugar mi primera partida de airsoft',
    subtitle: 'Qué llevar, cuánto cuesta y en qué cancha podría jugar',
    metaDescription:
      'Guía para principiantes: qué llevar a tu primera partida de airsoft en Perú, cómo funciona el alquiler de equipo y en qué canchas podría jugar.',
    intro:
      'No necesitas equipo propio para probar airsoft. Varias canchas alquilan réplica y protección — lo único que sí necesitas es venir con la actitud correcta y algunas cosas básicas.',
    blocks: [
      {
        type: 'checklist',
        heading: 'Qué llevar el primer día',
        items: [
          'Ropa cómoda de preferencia oscura (algo que no te importe ensuciar). De preferencia un buzo en la parte de abajo y en la de arriba un polo largo tipo deportivo o rashguard (para no sudar mucho)',
          'Zapatillas cerradas, nunca sandalias (vas a enterar las zapatillas, literal)',
          'Agua y/o Bebidas — las partidas cansan más de lo que parece y es importante estar hidratado para no pasarla mal',
          'Snacks — la adrenalina hace que gastes energia, lleva snacks que te suban el azucar como frutas o chocolates para seguir jugando sin bajones de energía',          
          'Ropa de cambio, vas a salir sudando fijo de tanto divertirte',
          'Protección extra o Cosas que sumarían: Guantes de gimnasio, gorra, zapatillas de montañismo o gimnasio (con buen agarre). bloqueador solar para rostro y cuerpo, toalla pequeña y paños húmedos.',
        ],
      },
      {
        type: 'texto',
        heading: '¿Cuánto cuesta la entrada y el alquiler de equipo?',
        body: [
          'El precio varía si tienes o no réplica. Si eres nuevo, el promedio de alquiler de equipo completo, réplica + bbs es de 80-120 soles (el fullday de juego que dura como 3 horas y te dan 400 bbs). Esto puede variar entre canchas y cambia con el tiempo, así que en vez de darte un número que puede estar desactualizado, lo más confiable es escribirle directo al organizador de la cancha por WhatsApp antes de ir y preguntar por el precio de entrada y de alquiler de réplica + protección para principiantes.',
          'Todas las canchas de este directorio con "Alquila equipo" activo tienen su WhatsApp a un clic en su ficha.',
        ],
      },
      {
        type: 'glosario',
        heading: 'Glosario básico para no perderte el primer día',
        items: [
          { term: 'CQB', def: 'Close Quarters Battle — combate en espacios cerrados (pasillos, cuartos, contenedores). Partidas rápidas y de corta distancia.' },
          { term: 'MilSim', def: 'Military Simulation — partidas largas con roles, objetivos tipo misión y más énfasis en el realismo táctico. No es lo típico para debutar.' },
          { term: 'Skirmish', def: 'El formato más común: partidas cortas y casuales (eliminación, captura de bandera, etc.). Es el que casi siempre vas a jugar en tu primera vez.' },
          { term: 'Hop-up', def: 'Mecanismo dentro de la réplica que le da efecto retroactivo a la bolita (BB) para que vuele más recto y llegue más lejos.' },
          { term: 'FPS / Joules', def: 'La velocidad de disparo de la réplica (pies por segundo o julios). Cada cancha tiene un límite máximo permitido por seguridad — el equipo de alquiler ya viene dentro de ese límite.' },
        ],
      },
      {
        type: 'canchas-recomendadas',
        heading: 'En qué canchas me conviene jugar',
        note: 'Estas son las canchas marcadas como "apto para principiantes" en el directorio — todas alquilan equipo, así que no necesitas nada propio para ir.',
        hidden: true, // true la oculta de esta guía sin borrar el bloque
      },
      {
        type: 'banner-partidas',
        heading: 'Partidas de esta semana',
      },
    ],
  },
  {
    id: 2,
    slug: 'empezar-hobby-equipo-propio',
    icon: 'WrenchIcon',
    title: 'Quiero empezar el hobby',
    subtitle: 'Un árbol de decisión simple antes de invertir, y qué priorizar al comprar',
    metaDescription:
      'Antes de comprar tu primera réplica de airsoft en Perú: un árbol de decisión simple y qué priorizar al armar tu equipo propio.',
    intro:
      'Comprar equipo propio es una inversión, no el primer paso. Este árbol de decisión es para ayudarte a saber si ya te conviene, y en qué orden priorizar cuando decidas hacerlo.',
    blocks: [
      {
        type: 'arbol',
        heading: '¿Ya me conviene comprar equipo propio?',
        pasos: [
          { pregunta: '¿Ya jugaste al menos 2-3 veces con equipo alquilado?', si: 'Sigue al siguiente paso.', no: 'Todavía no compres nada — sigue alquilando unas partidas más. Es la forma más barata de confirmar que el hobby te gusta.' },
          { pregunta: '¿Vas a jugar de forma regular (más de una vez al mes)?', si: 'Sigue al siguiente paso.', no: 'Si vas a jugar solo un par de veces al año, alquilar sigue siendo más barato que comprar y mantener equipo propio.' },
          { pregunta: '¿Tienes presupuesto separado para esto sin afectar otros gastos?', si: 'Empieza por la protección, no por la réplica (ver abajo).', no: 'Espera a tener el presupuesto completo — es mejor comprar todo de una vez con algo de investigación que apurarte y rearmar equipo después.' },
        ],
      },
      {
        type: 'tiers',
        heading: 'Qué priorizar al armar tu equipo (en este orden)',
        tiers: [
          { nombre: '1. Protección', para_quien: 'Siempre primero, sin excepción', incluye: ['Gafas balísticas certificadas (no lentes de sol ni antiparras genéricas)', 'Protección facial inferior si vas a jugar CQB seguido', 'Guantes tácticos'] },
          { nombre: '2. Réplica de entrada', para_quien: 'Recién cuando ya tengas la protección resuelta', incluye: ['Un AEG (eléctrica) de gama de entrada — es lo más versátil y fácil de mantener para empezar', 'No hace falta la réplica más cara del mercado para tu primera compra'] },
          { nombre: '3. Consumibles y accesorios', para_quien: 'Se van sumando con el uso', incluye: ['BBs de buena calidad (el peso recomendado depende del hop-up de tu réplica)', 'Baterías o gas de repuesto', 'Chaleco / plate carrier básico', 'Mochila o bolso para transportar todo'] },
        ],
      },
      {
        type: 'busqueda',
        heading: 'Dónde buscar equipo',
        nota:
          'No incluimos links directos a tiendas online porque no podemos verificar cada vendedor. Estos son términos de búsqueda que te van a dar buenos resultados en marketplaces como AliExpress o MercadoLibre — compara vendedores, reseñas y tiempos de envío antes de comprar.',
        terminos: [
          'gafas balísticas airsoft mil-spec',
          'AEG airsoft principiante',
          'chaleco plate carrier táctico airsoft',
          'BBs airsoft 0.20g biodegradables',
        ],
      },
    ],
  },
  {
    id: 3,
    slug: 'tips-generales',
    icon: 'NotebookIcon',
    title: 'Tips generales',
    subtitle: 'Notas y consejos que te pueden servir en el camino, los cuales sumo con el tiempo',
    metaDescription: 'Tips generales y notas sueltas para jugar airsoft en Perú, de la experiencia de la comunidad.',
    intro: 'Esta sección es para anotaciones cortas que no alcanzan para un artículo propio. Se va actualizando con el tiempo.',
    blocks: [
      {
        type: 'tips',
        heading: 'Anotaciones',
        items: [
          'Llega temprano tu primera vez: te da tiempo para el briefing de seguridad sin apuro.',
          'Canta tus impactos en voz alta y honesta — es la regla no escrita más importante del deporte.',
          'La protección ocular se queda puesta todo el tiempo que estés en el campo de juego, incluso entre rondas.',
        ],
      },
    ],
  },
]
