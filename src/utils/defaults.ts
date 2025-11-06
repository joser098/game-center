const defaults = {
  triviaQuestions: [
    {
      question: "¿Cuál es el país más grande del mundo en superficie?",
      options: ["Canadá", "Rusia", "China", "Estados Unidos"],
      correct: 1,
    },
    {
      question: "¿En qué continente se encuentra Egipto?",
      options: ["Asia", "África", "Europa", "Oceanía"],
      correct: 1,
    },
    {
      question: "¿Cuál es el océano más grande del planeta?",
      options: ["Atlántico", "Índico", "Pacífico", "Ártico"],
      correct: 2,
    },
    {
      question: "¿Qué planeta es conocido como el planeta rojo?",
      options: ["Venus", "Marte", "Júpiter", "Saturno"],
      correct: 1,
    },
    {
      question: "¿Quién pintó la Mona Lisa?",
      options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Miguel Ángel"],
      correct: 0,
    },
    {
      question: "¿En qué año llegó el ser humano a la Luna?",
      options: ["1965", "1969", "1972", "1975"],
      correct: 1,
    },
    {
      question: "¿Cuál es el idioma más hablado del mundo?",
      options: ["Inglés", "Mandarín", "Español", "Hindi"],
      correct: 1,
    },
    {
      question: "¿Cuál es el río más largo del mundo?",
      options: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"],
      correct: 0,
    },
    {
      question: "¿Qué instrumento musical tiene teclas blancas y negras?",
      options: ["Violín", "Guitarra", "Piano", "Arpa"],
      correct: 2,
    },
    {
      question: "¿Cuál es el metal más utilizado en la fabricación de cables eléctricos?",
      options: ["Hierro", "Aluminio", "Cobre", "Plata"],
      correct: 2,
    },
  ],
  wordCategories: {
    "Países": ["ARGENTINA", "BRASIL", "MEXICO", "COLOMBIA", "ITALIA", "ALEMANIA", "CANADA", "CHILE"],
    "Capitales": ["PARÍS", "LONDRES", "TOKIO", "BERLIN", "MADRID", "ROMA", "OTTAWA", "LIMA"],
    "Animales": ["LEON", "TIGRE", "ELEFANTE", "DELFIN", "PINGUINO", "CONEJO", "CABALLO", "OSO"],
    "Deportes": ["FUTBOL", "TENIS", "PADEL", "NATACIÓN", "CICLISMO", "BOXEO", "VOLEY", "RUGBY"],
    "Comidas": ["PIZZA", "PASTA", "EMPANADA", "HAMBURGUESA", "HELADO", "ENSALADA", "SUSHI"],
    "Instrumentos": ["PIANO", "GUITARRA", "VIOLIN", "BATERIA", "FLAUTA", "TROMPETA", "BAJO"],
  }
}

export default defaults;