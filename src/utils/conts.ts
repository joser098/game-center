// Branding de Coca-Cola
const brandingData = {
  companyName: "Coca-Cola",
  brandColor: "#E60012",
  logoUrl: "/logo.png",
  motive: "¡Destapa la Felicidad en Equipo!",
  color: "red",
  triviaQuestions: [
    {
      question: "¿En qué año se fundó Coca-Cola?",
      options: ["1884", "1885", "1886", "1887"],
      correct: 2,
    },
    {
      question: "¿Quién inventó la fórmula original de Coca-Cola?",
      options: ["John Pemberton", "Asa Candler", "Caleb Bradham", "Charles Hires"],
      correct: 0,
    },
    {
      question: "¿En qué ciudad se creó Coca-Cola?",
      options: ["Nueva York", "Atlanta", "Chicago", "Boston"],
      correct: 1,
    },
    {
      question: "¿Qué color caracteriza a Coca-Cola?",
      options: ["Azul", "Rojo", "Verde", "Amarillo"],
      correct: 1,
    },
    {
      question: "¿Cuál fue el primer envase original de Coca-Cola?",
      options: ["Botella de vidrio", "Lata de aluminio", "Tetra Pak", "Plástico"],
      correct: 0,
    },
    {
      question: "¿Cuál es el eslogan clásico de Coca-Cola?",
      options: ["Disfruta la chispa de la vida", "Abre tu mundo", "Imposible es nada", "Porque tú lo vales"],
      correct: 0,
    },
    {
      question: "¿En qué año se introdujo la Coca-Cola en lata?",
      options: ["1955", "1960", "1965", "1970"],
      correct: 2,
    },
    {
      question: "¿Cuál fue la primera bebida sin azúcar lanzada por Coca-Cola?",
      options: ["Coca-Cola Light", "Coca-Cola Zero", "Pepsi Light", "Fanta Zero"],
      correct: 0,
    },
    {
      question: "¿Qué personaje popularizó Coca-Cola en la Navidad?",
      options: ["Papá Noel", "El Grinch", "Rodolfo el reno", "Frosty el muñeco de nieve"],
      correct: 0,
    },
    {
      question: "¿Cuántas botellas de Coca-Cola se consumen por día en el mundo (aprox.)?",
      options: ["500 millones", "1000 millones", "1900 millones", "3000 millones"],
      correct: 2,
    }
  ],
  wordCategories: {
    Bebidas: ["COCACOLA", "REFRESCO", "BURBUJAS", "FELICIDAD", "COMPARTIR"],
    Animales: ["ELEFANTE", "JIRAFA", "PINGUINO", "DELFIN", "MARIPOSA"],
    Tecnología: ["COMPUTADORA", "INTERNET", "SOFTWARE", "TECLADO", "MONITOR"],
  }
};

// Branding de YPF
// const brandingData = {
//   companyName: "YPF",
//   brandColor: "#0451DD",
//   logoUrl: "/ypf-logo.webp",
//   motive: "Transformamos vidas a través de la energía",
//   color: 'blue',
//   triviaQuestions: [
//     {
//       question: "¿En qué año se fundó YPF?",
//       options: ["1920", "1922", "1925", "1930"],
//       correct: 1,
//     },
//     {
//       question: "¿Quién fue el fundador de YPF?",
//       options: ["Juan Domingo Perón", "Enrique Mosconi", "Hipólito Yrigoyen", "Domingo Cavallo"],
//       correct: 1,
//     },
//     {
//       question: "¿Qué significan las siglas YPF?",
//       options: ["Yacimientos Petrolíferos Fiscales", "Yacimientos Productivos Federales", "Yacimientos del Petróleo y el Gas", "Yacimientos Públicos Federales"],
//       correct: 0,
//     },
//     {
//       question: "¿En qué provincia argentina se descubrió el primer yacimiento importante de petróleo?",
//       options: ["Mendoza", "Chubut", "Neuquén", "Santa Cruz"],
//       correct: 1,
//     },
//     {
//       question: "¿En qué año YPF fue privatizada parcialmente?",
//       options: ["1989", "1990", "1992", "1995"],
//       correct: 2,
//     },
//     {
//       question: "¿Qué empresa compró la mayoría de las acciones de YPF en los años 90?",
//       options: ["ExxonMobil", "Shell", "Repsol", "Chevron"],
//       correct: 2,
//     },
//     {
//       question: "¿En qué año fue reestatizada YPF?",
//       options: ["2008", "2010", "2012", "2014"],
//       correct: 2,
//     },
//     {
//       question: "¿Qué recurso natural es la base de la producción de YPF?",
//       options: ["Carbón", "Gas", "Petróleo", "Litio"],
//       correct: 2,
//     },
//     {
//       question: "¿Cuál es la sede central de YPF?",
//       options: ["Córdoba", "Buenos Aires", "Neuquén", "Santa Cruz"],
//       correct: 1,
//     },
//     {
//       question: "¿Cómo se llama el importante yacimiento no convencional de petróleo y gas explotado por YPF?",
//       options: ["Sierra Grande", "Vaca Muerta", "Cerro Dragón", "Los Molles"],
//       correct: 1,
//     },
//   ],
//   wordCategories: {
//     Bebidas: ["COCACOLA", "REFRESCO", "BURBUJAS", "FELICIDAD", "COMPARTIR"],
//     Animales: ["ELEFANTE", "JIRAFA", "PINGUINO", "DELFIN", "MARIPOSA"],
//     Tecnología: ["COMPUTADORA", "INTERNET", "SOFTWARE", "TECLADO", "MONITOR"],
//   }
// }

const gradientMap = {
  red: 'from-red-900 via-red-800 to-red-900',
  blue: 'from-blue-900 via-blue-800 to-blue-900',
  green: 'from-green-900 via-green-800 to-green-900',
  // agregá más según necesites
};

export default brandingData;