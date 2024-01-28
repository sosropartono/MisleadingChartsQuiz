//Node questionsAndAnswers.js
const mysql = require("mysql");
require("dotenv").config();

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL server");

  const createTestQuestionsTable = `
    CREATE TABLE IF NOT EXISTS test_questions (
      question_id int PRIMARY KEY AUTO_INCREMENT,
      category VARCHAR(255) NOT NULL,
      note VARCHAR(255) NOT NULL, 
      article_images JSON NOT NULL,
      options JSON NOT NULL
      
    )
  `;

  const createPrestudyTestQuestionsTable = `
  CREATE TABLE IF NOT EXISTS prestudy_test_questions (
    question_id int PRIMARY KEY AUTO_INCREMENT,
    question_text VARCHAR(255) NOT NULL,
    options JSON NOT NULL,
    correct_answer VARCHAR(255) NOT NULL
  )
`;


  const createResponsesTableSQL = `
  CREATE TABLE IF NOT EXISTS test_responses (
    user_id VARCHAR(10) NOT NULL,
    question_id INT,
    question VARCHAR(255),
    user_answer VARCHAR(255),
    is_correct VARCHAR(5) NOT NULL,
    timestamp VARCHAR(40)
  )
`;

  const createPrestudyResponsesTable = `
  CREATE TABLE IF NOT EXISTS master_table (
    user_id VARCHAR(10) NOT NULL,
    button_name VARCHAR(100),
    question_id INT,
    question_text VARCHAR(700),
    user_answer VARCHAR(255),
    timestamp VARCHAR(40)
  )
`;

  const createMasterTable = `
  CREATE TABLE IF NOT EXISTS master_table (
    user_id VARCHAR(10) NOT NULL,
    button_name VARCHAR(100),
    question_id INT,
    question_text VARCHAR(700),
    user_answer VARCHAR(255),
    timestamp VARCHAR(40)
  )
`;

  const insertDataIntoTestQuestionsTable = `
  INSERT INTO test_questions (category, note, article_images, options) VALUES
  ('Politics, Governments & Events 1', 'Mexico', '["pge1-mex-eng.png", "pge1-mex-esp.png"]', '[
    [
        "Mexico decriminalizes abortion, extending Latin American trend of widening access",
        "Mexico''s Supreme Court threw out all federal criminal penalties for abortion Wednesday, ruling that national laws prohibiting the procedure are unconstitutional and violate women''s rights in a sweeping decision that extended Latin American''s trend of widening abortion access."
    ],
    [
        "Mexico has decriminalized abortion, but politics could decide access",
        "In a sweeping decision that would have once seemed almost impossible in this Catholic country, where women were jailed for ending pregnancies, Mexico''s Supreme Court this week declared it unconstitutional for the federal government to criminalize abortion."
    ],
    [
        "Court decriminalises abortion across Mexico",
        "The judgement comes two years after the court ruled in favour of a challenge to the existing law in the northern state of Coahuila. It had ruled that criminal penalties for terminating pregnancies were unconstitutional."
    ],
    [
        "The judgement comes two years after the court ruled in favour of a challenge to the existing law in the northern state of Coahuila. It had ruled that criminal penalties for terminating pregnancies were unconstitutional.",
        "The decision builds on an earlier high court ruling and reflects how Latin American countries are expanding women''s rights."
    ],
    [
        "Mexico''s Supreme Court Orders Federal Decriminalization of Abortion",
        "Mexico''s Supreme Court ruled this week that Congress must eliminate federal criminal penalties for abortion, which means all federal health facilities should provide abortion care, a massive victory for human rights."
    ],
    [
        "Mexico becomes latest country in Latin America to loosen restrictions on abortion",
        "In a sweeping decision this week, Mexico''s Supreme Court broadened abortion rights in the country. Ali Rogin reports on the trend across Latin America and Geoff Bennett discusses the Mexico ruling with Maria Antonieta Alcalde of Ipas Latin America and the Caribbean."
    ],
    [
        "5 preguntas para entender qué pasa en México tras la despenalización del aborto en todo el país",
        "México ocupó titulares de medios de todo el mundo este miércoles cuando se conoció que el aborto quedaba despenalizado en todo el país."
    ],
    [
        "México despenaliza el aborto al eliminarlo del código penal",
        "La Suprema Corte de Justicia de la Nación de México ha despenalizado el aborto."
    ],
    [
        "La Suprema Corte de Justicia Despenaliza el Aborto en todo México",
        "La Suprema Corte de Justicia de México despenalizó el miércoles el aborto en todo el país en una decisión histórica que impedirá que cualquier mujer vaya a la cárcel por interrumpir su embarazo."
    ],
    [
        "La Suprema Corte de Justicia despenaliza el aborto en todo México",
        "La Suprema Corte de México despenalizó el aborto a nivel federal, en una decisión que mueve al país en la línea de otros países de América Latina a favor del acceso a la interrupción del embarazo."
    ],
    [
        "México: la Suprema Corte de Justicia despenaliza el aborto en todo el país",
        "El Tribunal Superior mexicano anunció este miércoles 6 de septiembre que despenaliza el aborto a nivel federal. Aunque la capital del país legitimó la interrupción voluntaria del embarazo hace 15 años, algunas regiones de la nación aún lo consideran ilegal. El pronunciamiento de la Suprema Corte llega tras un proceso agotador de despenalización del proceso, estado por estado, en los últimos años."
    ],
    [
        "Así se articuló el movimiento feminista para despenalizar el aborto en México",
        "Una sentencia de la Suprema Corte de Justicia despenaliza el aborto en México al considerar inconstitucional el artículo que lo criminaliza. El amparo presentado en el estado de Coahuila marcó el camino de la vía judicial en 2021 tras una larga historia de organización feminista por los derechos reproductivos."
    ]
  ]'),

  ('Politics, Governments & Events 1', 'US', '["pge1-us-eng.png", "pge1-us-esp.png"]', '[
    [
        "GOP makes history when 8 hard-liners succeed in ousting House Speaker McCarthy",
        "NPR''s A Martinez talks to Republican strategist Liam Donovan about what it says about the state of the GOP when a small group of Republican rebels was able to topple the speaker of the House."
    ],
    [
        "¿Por qué destituyeron al republicano Kevin McCarthy como presidente de la Cámara de Representantes?",
        "En un día histórico para la política estadounidense, que parece hundirse aún más en el caos, el representante republicano Kevin McCarthy fue destituido este martes como presidente de la Cámara de Representantes de Estados Unidos."
    ],
    [
        "Kevin McCarthy Got What He Deserved",
        "The House speaker surrendered every principle, and in the end, it still wasn''t enough to save him."
    ],
    [
        "El republicano Kevin McCarthy, primer presidente de la Cámara de Representantes de EE.UU. en ser destituido tras una histórica votación",
        "El republicano Kevin McCarthy se convirtió este martes en el primer presidente de la Cámara de Representantes de EE.UU. en ser destituido en una histórica votación."
    ],
    [
        "Who voted Kevin McCarthy out? These 8 House Republicans.",
        "Rep. Kevin McCarthy (R-Calif.) was ousted as speaker of the House of Representatives after a small group of Republicans rebelled against their leader. It was the first time in history that the chamber had voted out a speaker."
    ],
    [
        "Kevin McCarthy es destituido como presidente de la Cámara de Representantes tras inédita votación",
        "Tras un largo debate y una votación, la Cámara de Representantes decidió sacar de su cargo a Kevin McCarthy, líder republicano que presidía la Cámara Baja del Congreso. La decisión vino tras una moción de destitución presentada por el representante Matt Gaetz, un republicano de extrema derecha de Florida. Una decisión de estas características nunca se había visto en Estados Unidos."
    ],
    [
        "Kevin McCarthy has been ousted as speaker of the House. Here''s what happens next.",
        "The House on Tuesday voted 216 to 210 to remove California Republican Kevin McCarthy from his position as House speaker, a historic move that comes days after he reached an 11th-hour deal to avert a government shutdown with the help of House Democrats."
    ],
    [
        "EEUU | Destituido el presidente de la Cámara de Representantes, el republicano Kevin McCarthy",
        "Una moción de censura lo ha expulsado del puesto menos de diez meses después de haberlo asumido."
    ],
    [
        "Shell shocked'' Kevin McCarthy will not run for House speaker again following removal",
        "Former House Speaker Kevin McCarthy will not run again for House speaker, he told reporters on Tuesday evening following a narrow vote to remove him from the role earlier in the day."
    ],
    [
        "La Cámara de Representantes de EE UU destituye a su presidente y sume al Capitolio en el caos",
        "Matt Gaetz, del ala dura del Partido Republicano, fuerza la salida de su líder, Kevin McCarthy, nueve meses después de su nombramiento. La histórica votación aboca al país a la parálisis legislativa"
    ],
    [
        "Kevin McCarthy is out as speaker of the House. Here''s what''s next",
        "The House of Representatives is entering uncharted territory after a far-right effort to remove fellow Republican Kevin McCarthy from the speakership succeeded thanks to support from Democrats."
    ],
    [
        "Matt Gaetz, del ala dura del Partido Republicano, fuerza la salida de su líder, Kevin McCarthy, nueve meses después de su nombramiento. La histórica votación aboca al país a la parálisis legislativa",
        "La Cámara de Representantes de EE. UU. voto a favor de destituir de su cargo al republicano Kevin McCarthy. Es la primera vez en la historia del país que se remueve del cargo al presidente de la Cámara."
    ]
  ]'),
  
  ('Politics, Governments & Events 1', 'International', '["pge1-int-eng.png", "pge1-int-esp.png"]', '[
    [
        "Japan demographic woes deepen as birth rate hits record low",
        "Japan''s birth rate declined for the seventh consecutive year in 2022 to a record low, the health ministry said on Friday, underscoring the sense of crisis gripping the country as the population shrinks and ages rapidly."
    ],
    [
        "El multimillonario plan de Japón para que las parejas tengan más hijos (y por qué el dinero no siempre es la solución)",
        "Fumio Kishida dijo hace unas semanas que su país está al borde de no poder funcionar como sociedad por la histórica baja en la tasa de natalidad: por primera vez en más de un siglo la cantidad de bebés nacidos en Japón cayó por debajo de los 800.000 el año pasado, según estimaciones oficiales."
    ],
    [
        "Japan births fall to record low as population crisis deepens",
        "The number of births registered in Japan plummeted to another record low last year - the latest worrying statistic in a decades-long decline that the country''s authorities have failed to reverse despite their extensive efforts."
    ],
    [
        "Tasa de natalidad de Japón vuelve a caer y toca un nuevo récord",
        "Lea más: (Tasa de natalidad de Japón vuelve a caer y toca un nuevo récord) https://www.bloomberglinea.com/2023/03/04/tasa-de-natalidad-de-japon-vuelve-a-caer-y-toca-un-nuevo-record/"
    ],
    [
        "Japan''s population drops by nearly 800,000 with falls in every prefecture for the first time",
        "Every one of Japan''s 47 prefectures posted a population drop in 2022, while the total number of Japanese people fell by nearly 800,000. The figures released by the Japan''s internal affairs ministry mark two new unwelcome records for a nation sailing into uncharted demographic territory, but on a course many other countries are set to follow."
    ],
    [
        "La población de Japón se redujo en medio millón de habitantes en 2022",
        "La población de Japón disminuyó por duodécimo año consecutivo, a medida que aumentan las muertes y la tasa de natalidad continúa descendiendo, según datos gubernamentales publicados este miércoles."
    ],
    [
        "Japan''s fertility rate is likely even lower than it seems",
        "The fertility rate calculated by the health ministry — 1.26 in 2022 — is a key benchmark in gauging Japan''s depopulation and comparing its progress with other countries."
    ],
    [
        "Japón se queda sin niños; se agrava crisis de natalidad y alcanza mínimo histórico",
        "La tasa de fecundidad fue de 1.25 de acuerdo con el último informe; el primer ministro Fumio Kishida ha hecho de detener la caída en una prioridad máxima."
    ],
    [
        "More Than 40% of Japanese Women May Never Have Children",
        "An estimated 42% of adult Japanese women may end up never having children, the Nikkei newspaper reported, citing a soon-to-be-published estimate by a government research group."
    ],
    [
        "La tasa de natalidad en Japón cae a mínimo histórico",
        "Las muertes han superado a los nacimientos en Japón durante más de una década, lo que representa un problema creciente para la tercera economía más grande del mundo."
    ],
    [
        "Japan announces plan to address a national crisis: its low birthrate",
        "Japan''s government has a new plan to halt the country''s plunging birthrate. But many Japanese are skeptical, as the government has tried and failed to fix the problem for some three decades."
    ],
    [
        "Japón necesita aumentar la tasa de natalidad antes de que pase la “última oportunidad”",
        "El Gobierno planea aumentar las ayudas para el cuidado de los hijos, proporcionar ayudas para la vivienda a las familias jóvenes que están criando a sus hijos, trabajar para reducir los costes de la educación y aumentar los salarios de los trabajadores más jóvenes"
    ]
  ]'),

  ('Travel & Leisure 1', 'Mexico', '["tl1-mex-eng.png", "tl1-mex-esp.png"]', '[
    [
        "24 Most Beautiful Places in Mexico",
        "From charming small towns to stunning islands, these are the most beautiful places to visit in Mexico."
    ],
    [
        "Los seis mejores lugares para visitar en México",
        "México reúne siglos de cultura ancestral, los mejores platos de la región, diversos paisajes y rincones alucinantes y encantadores, cada uno diferente del otro."
    ],
    [
        "35 Best Places to Visit in Mexico Right Now [2023]",
        "LOOKING FOR THE BEST PLACES TO GO IN MEXICO?"
    ],
    [
        "25 lugares imprescindibles que ver en México",
        "México es uno de los países más visitados del mundo. Sus maravillosos cenotes, las playas caribeñas, su famosa gastronomía y su increíble cultura son algunos de los motivos para hacer una ruta por este hermoso país. Es tan grande y diverso que seguro que encontrarás algo que te enamorará. La Riviera Maya es la zona más turística, pero este país esconde atractivos en casi cualquier rincón de su territorio. En este post te contamos 25 lugares imprescindibles que ver en México."
    ],
    [
        "35 Best Places to Visit in Mexico in 2023",
        "What are the best places to visit in Mexico? This list of destinations will help you start planning your trip."
    ],
    [
        "QUÉ VER EN MÉXICO: LAS 35 MEJORES COSAS QUE HACER Y VISITAR",
        "Qué ver y hacer en México: Los mejores atractivos turísticos"
    ],
    [
        "36 BEST PLACES TO VISIT IN MEXICO IN 2023",
        "We have often considered settling down in Mexico when we retire. Each time we visit México, we love it! We haven''t visited everywhere in the country but love to add a new destination each time we go down. So we combined our extensive travels with Nathan of The TRVL Blog to showcase the best places to visit in Mexico."
    ],
    [
        "28 lugares para viajar con tus amigos en México",
        "Desde exhuberantes destinos llenos de naturaleza hasta bellos viñedos para catar los mejores vinos, en México hay todo tipo de lugares para viajar con amigos."
    ],
    [
        "17 Best Places to Visit in Mexico",
        "Gorgeous beaches, a delicious culinary scene, festive culture and ancient pyramids all make Mexico a popular tourist destination. Mexico is a land of color and contrasts. Crowded beaches lead into quiet colonial towns while resort cities open gateways to jungles ringing with parrots and howler monkeys."
    ],
    [
        "15 Destinos Alucinantes en México que tienes que ver para creer",
        "Nuestro país es un lugar lleno de sorpresas, a veces complejo y difícil de explicar, pero al mismo tiempo fácil de querer. La magia puede suceder en muchos destinos alucinantes en México, ya sea caminando tranquilamente por el sueño de Edward James en la Huasteca Potosina o buceando lleno de adrenalina junto a un remolino de peces en Cabo Pulmo."
    ],
    [
        "35+ BEST PLACES TO VISIT IN MEXICO IN 2023 (TRAVEL BLOGGER''S SPILL THEIR FAVORITE MEXICAN DESTINATIONS)",
        "In this post, I asked my travel blogger friends for the best places to visit in Mexico & you need not look further for your Mexico vacation. The ultimate source for your Mexican trip."
    ],
    [
        "Los 56 lugares turísticos de México que tienes que visitar",
        "México tiene tantos atractivos turísticos, que escoger solo 56 resulta una ardua tarea. Te presentamos esta selección, pidiendo disculpas por la enorme cantidad de sitios maravillosos que tuvimos que dejar fuera."
    ]
  ]'),

  ('Travel & Leisure 1', 'US', '["tl1-us-eng.png", "tl1-us-esp.png"]', '[
    [
        "MY 31 FAVORITE PLACES TO VISIT IN THE USA",
        "From sea to shining sea, the United States is home to a diverse landscape — both culturally and physically. Spending months traveling across it gave me a deep appreciation for all my country has to offer."
    ],
    [
        "25 imprescindibles que visitar en Estados Unidos",
        "Tras dos largos viajes por Estados Unidos, hemos conocido montones de sitios increíbles que quedarán para siempre en nuestro recuerdo. Aunque si algo hemos aprendido es que es un país en el que, más allá de sus controvertidos sistemas políticos y sociales, se necesitaría una vida para poder visitar todos sus rincones maravillosos. Pero para no agobiarnos, vamos a empezar por los que son, para nosotros, los 25 mejores lugares que visitar en Estados Unidos."
    ],
    [
        "The 50 Most Beautiful Places in the U.S.",
        "From magical deserts to gorgeous beaches, these are the most beautiful places in each state."
    ],
    [
        "50 lugares que no te deberías perder cuando puedas viajar a EEUU",
        "EEUU levanta las restricciones a partir del 8 de noviembre y es el momento de volver a ese apasionante país tras la pandemia del Covid. Te contamos cuáles son los requisitos."
    ],
    [
        "101 Best Places to Visit in the USA in 2023 (Ultimate Bucket List)",
        "Throughout my life, I''ve visited 40 of the 50 states in the USA and experienced many of the incredible things to do this country has to offer. From touring big cities like New York to getting lost in national parks like Glacier, I fall more in love with the US each year. There are endless places to visit in the United States, but this list highlights the best."
    ],
    [
        "Los 28 mejores lugares turísticos de Estados Unidos para visitar",
        "Comencemos nuestro Top 28 de mejores lugares turísticos de Estados Unidos con…"
    ],
    [
        "24 Best Places to Visit in the United States",
        "Discover more of America with our list of the best places to visit in the United States."
    ],
    [
        "10 lugares que visitar en Estados Unidos imprescindibles",
        "Hay muchos lugares que visitar en Estados Unidos espectaculares, un inmenso país que reúne desde grandes metrópolis como Nueva York o Chicago, maravillas naturales que te dejarán sin palabras como Yellowstone o las Cataratas del Niágara o recorridos en coche o moto para conocer la América más profunda a través de carreteras como la ruta 66."
    ],
    [
        "The top 12 places to visit in the USA",
        "Whether you''re a nature lover looking for wide open spaces and snow-covered peaks or a culture fiend who wants to lose themselves in museums and galleries, we''ve created a list of the USA''s heavy hitters. Here are the best places to visit in 2023."
    ],
    [
        "12 Mejores Lugares Turísticos en Estados Unidos",
        "El país del norte es en el que se comen más de 40 hectáreas de pizza al día y ¡hasta 120 toneladas de aguacate, para guacamole, durante el Super Bowl! Así que no sería extraño que la variedad de lugares turísticos en Estados Unidos sea inmensa. También podrás encontrar desde increíbles parques temáticos, hasta un gran cañón con una de las vistas más impresionantes que podrás conocer."
    ],
    [
        "The best places to visit in the USA for every month of 2023",
        "We''ve named the 12 best places to visit in the USA with one amazing destination for every month of the year"
    ],
    [
        "11 lugares emblemáticos de Estados Unidos que no te puedes perder",
        "Ya los viste en fotos, ahora visítalos en la vida real"
    ]
  ]'),

  ('Travel & Leisure 1', 'International', '["tl1-int-eng.png", "tl1-int-esp.png"]', '[
    [
        "Bucket List Travel: The Top 50 Places In The World",
        "If you''re like most people, the more you travel, the more places you add to your bucket list. So when the editors of the website Big 7 Travel announced the list of the world''s top 50 bucket list destinations, we stopped in our tracks and started checking off the boxes."
    ],
    [
        "Los 20 lugares más fascinantes del planeta",
        "Destinos imprescindibles para auténticos viajeros"
    ],
    [
        "The 55 Most Beautiful Places in the World",
        "From cloud forests to glacial lakes, these destinations are the world''s best sights to see."
    ],
    [
        "Los 17 lugares más fascinantes del mundo. ¡Descúbrelos!",
        "Por mucho que hayas viajado, estos 17 lugares más fascinantes del mundo que hemos elegido en Skyscanner te dejarán alucinado."
    ],
    [
        "The 50 Most Beautiful Places in the World",
        "Time to dust off your passport."
    ],
    [
        "Los 15 lugares del mundo que debes visitar al menos una vez en la vida",
        "En el top ten aparecen dos escenarios españoles: la Catedral-Mezquita de Córdoba, que a su vez ocupa el segundo puesto en el ranking europeo y el primero en el de España, y la Alhambra de Granada, en la octava posición mundial, cuarta de Europa y segunda nacional. A continuación te presentamos, por orden, los 15 mejores sitios del planeta. ¡No te los pierdas!"
    ],
    [
        "The 62 Most Beautiful Places in the World to Visit",
        "Pack your bags, we''re going!"
    ],
    [
        "Los 25 mejores lugares del mundo para viajar en 2021",
        "¿Cuáles son los mejores lugares para viajar en 2021? Te damos la lista de los 25 sitios top para visitar el siguiente año, según los editores de Traveler de todo el mundo"
    ],
    [
        "World''s 30 Best Travel Destinations, Ranked",
        "The ultimate ranking of travel destinations aims to solve a serious problem: so many places to visit, so little time."
    ],
    [
        "¿Cuáles son los 28 mejores destinos del mundo para visitar en 2022?",
        "A medida que el turismo se reactiva en los diferentes puntos del mundo, pensar nuestras vacaciones ya no resulta un objetivo tan lejano. En este contexto, National Geographic compartió su lista anual de los mejores destinos y que -desde su mirada- se convertirán en los favoritos de 2022."
    ],
    [
        "18 Best Places to Visit in the World",
        "For more ideas on where to go and what to see, read our list of the top places to visit in the world."
    ],
    [
        "Los 30 lugares más bonitos y fascinantes del mundo",
        "La verdad es que, al observarlos, son rincones y destinos bellísimos, capaces de dejarnos sin aliento. Misteriosos templos, paraísos naturales o pueblos coloridos y llenos de encanto forman esta lista de viajes que nos pone los dientes muy, pero que muy largos."
    ]
  ]'),

  ('Food 1', 'Mexico', '["f1-mex-eng.png", "f1-mex-esp.png"]', '[
    [
        "64 Authentic Mexican Food Recipes",
        "Authentic Mexican food is more than tacos and salsa. Check out our favorite Mexican dishes: churros, elote, barbacoa, posole and more. From drinks to dessert, there are so many Mexican recipes to dive into!"
    ],
    [
        "Recetas tradicionales de la cocina mexicana",
        "Explora cientos de recetas mexicanas 100% auténticas con fotos e instrucciones paso a paso fáciles de preparar. ¡Cocina deliciosos platos tipo restaurante preparados desde la comodidad de tu casa!"
    ],
    [
        "45 Fresh & Tasty Mexican Recipes!",
        "Whether you are celebrating Cinco De Mayo or are having a simple family gathering at home, here are 45 Best Mexican Recipes to create the perfect Mexican Feast. Packed full of healthy veggies with authentic flavors, pick out a few to try this week!"
    ],
    [
        "Las mejores recetas de cocina mexicana",
        "México cuenta con una de las gastronomías más apreciadas. Indagamos en las recetas de la cocina mexicana en busca de la receta de los tacos, el guacamole, la cochinita pibil y mucho más."
    ],
    [
        "42 Mexican recipes for your weekend fiesta",
        "Level up your next Taco Tuesday with these 42 easy Mexican recipes. From classic nacho bowls to enchiladas, these tasty dishes will transform your next Mexican meal into a full blown fiesta."
    ],
    [
        "Nueve recetas que debes dominar para celebrar una cena mexicana en casa",
        "Una de las cosas que más me gustan es reunirme con la familia o con los amigos y organizar una cena temática, para salirnos de las recetas rápidas de cena de siempre. Si quieres darle ambiente prepara música de rancheras y corridos porque te vamos a contar nueve recetas que debes dominar si quieres hacer una cena mexicana en tu casa."
    ],
    [
        "The 40+ BEST Mexican Recipes",
        "Mexican food… The cuisine that most of us can dig in to with gutso any day… any time … all the time. I mean, can we really get tired of all those fresh, zingy, zesty flavors in perfectly seasoned meals? I say that''s doubtful."
    ],
    [
        "20 RECETAS DE COMIDA MEXICANA FÁCILES",
        "No saber qué hacer de comer nos pasa a todos, por lo que tener a la mano 20 recetas de comida mexicana fáciles te vendrá muy bien para salir de apuros, tener muchas ideas a la hora de entrar a la cocina y descubrir que ese platillo que siempre te ha encantado es muy sencillo de hacer."
    ],
    [
        "Authentic Mexican Recipes and Dishes",
        "Mexico in my Kitchen''s mission is to show to the world the richness of México''s centennial culinary art. Traditional Mexican cuisine is a comprehensive cultural model comprising farming, ritual practices, age-old skills, culinary techniques, ancestral community customs, and manners. It is made possible by collective participation in the entire traditional food chain: from planting and harvesting to cooking and eating."
    ],
    [
        "100 RECETAS DE COMIDA MEXICANA QUE DEBES PROBAR ANTES DE MORIR",
        "Las recetas de comida mexicana son de las mejores del mundo, así que hacer una lista con sus 100 mejores platos es absolutamente lógico."
    ],
    [
        "70 Recipes for Traditional (& Not-So-Traditional) Mexican Foods",
        "Learn how to make all your restaurant favorites at home."
    ],
    [
        "10 recetas de comida mexicana que no podes perderte!",
        "Bienvenidos a Paulina Cocina! El año pasado estuve en México visitando amigos y familia y quedé atrapadísima con la cultura, con la gente, con los lugares, pero por sobre todas las cosas: con la comida mexicana! En este post voy a enumerar las diez comidas mexicanas que no pueden dejar de probar de ninguna manera si van a México."
    ]
  ]'),

  ('Food 1', 'US', '["f1-us-eng.png", "f1-us-esp.png"]', '[
    [
        "The 99 Most American Recipes Ever",
        "We Americans love our burgers, taco salad and good ol'' apple pie. But what''s on the menu in your neck of the woods? We crossed the country to find the most American recipes of all time."
    ],
    [
        "Las mejores recetas de cocina estadounidense",
        "Un repaso culinario por el recetario de los Estados Unidos, un país con mucho más que ofrecer en la mesa además de fast food: entrantes, platos principales y postres protagonistas en el país de la bandera de las barras y estrellas."
    ],
    [
        "The 45 BEST American Recipes",
        "America is such a big country, home to immigrants from all over the world. It''s no wonder, then, that it features such a big variety of food."
    ],
    [
        "Las 13 mejores recetas de platos estadounidenses o norteamericanos",
        "La cocina americana no es precisamente una cocina famosa por sus notas gourmet, pero indudablemente ha conseguido introducirse en todos los lugares del mundo con sus recetas más populares. Por ese motivo hoy queremos enseñaros las 13 mejores recetas de platos estadounidenses o norteamericanos, que sin duda disfrutaréis."
    ],
    [
        "30 Classic American Recipes We Love",
        "From grilled cheese and burgers to cheesecake and apple pie, these classic American recipes are irresistible."
    ],
    [
        "16 recetas tradicionales de Estados Unidos de América o Norte América",
        "El cuarto jueves de noviembre se celebra en Estados Unidos, el Día de Acción de Gracias, festividad donde familiares y amigos se reunen alrededor de una mesa para cenar un gran banquete, platos tradicionales con ingredientes originarios de los indios nativos. Una cena bastante parecida a la que preparan también en Navidad."
    ],
    [
        "American Recipes",
        "From potato salad, burgers, and meatloaf, to donuts and mac and cheese, these are the classic American recipes we come back to over and over again."
    ],
    [
        "6 de los mejores chefs de Estados Unidos comparten las recetas de sus especialidades",
        "Ideas fáciles y deliciosas para prepararlas en casa, y que gustan a todos."
    ],
    [
        "American recipes",
        "Get inspired by Stateside favourites, from burgers and hotdogs to pancakes and pies."
    ],
    [
        "10 comidas típicas de Estados Unidos: ingredientes, recetas y preparación",
        "Encuentra aquí los ingredientes y preparación de las comidas típicas más famosas de Estados Unidos y de aquellas que serán una grata sorpresa para tu paladar."
    ],
    [
        "11 Traditional American Food Recipes",
        "These dishes are as American as baseball and recipe #9."
    ],
    [
        "Antójate con las 10 comidas típicas de Estados Unidos",
        "Acá te contamos algunas de las comidas más representativas de Estados Unidos."
    ]
  ]'),

  ('Food 1', 'International', '["f1-int-eng.png", "f1-int-esp.png"]', '[
    [
        "95 International Recipes to Make When You''re Craving Global Cuisine",
        "Travel around the world without leaving your kitchen with these international recipes. From Canada to Australia, Nigeria to Brazil—and everywhere in between."
    ],
    [
        "La vuelta al mundo en 20 recetas",
        "Uno de los mayores placeres cuando tenemos la suerte de realizar un viaje a lo largo de los distintos países del mundo es poder disfrutar de su gastronomía. Conocer nuevas culturas, ingredientes desconocidos para nosotros y preparaciones diferentes a las que estamos acostumbrados, se convierte en uno de los objetivos para los viajeros que como a mí nos gusta la cocina estemos donde estemos."
    ],
    [
        "38 Comfort Food Recipes From Around the World",
        "Travel may be off the table, but you can still eat your way around the world without leaving home. Whether you are in need of a little self-care in a bowl, want to experience new tastes, or are simply looking for creative weeknight dinner ideas, these comfort foods are sure to do the trick. We scouted cuisines and cultures around the globe to include soothing soups, meaty mains, plant-powered plates, and more to deliver warm and fuzzy vibes. From cheesy Mexican enchiladas, French-Canadian poutine, and West African peanut butter soup, we''ll take you on a culinary adventure with each of these international recipes."
    ],
    [
        "Las mejores recetas de cocina internacional",
        "Platos de cualquier rincón explicados en detalle, cocina las recetas perfectas para dar la vuelta al mundo de los sabores y disfrutar de todas las gastronomías internacionales y sus secretos."
    ],
    [
        "24 mind-blowing recipes from around the world",
        "From cheesy Mexican nachos and classic butter chicken to rich Italian ragu, these recipes are guaranteed to take you on an unforgettable culinary adventure."
    ],
    [
        "Vuelta al mundo en 20 comidas: Descubrí los secretos culinarios de diferentes culturas",
        "Una de las cosas que más extrañamos como viajeros es incursionar en los platos típicos de los lugares que recorremos, degustar sabores nuevos, descubrir nuevos ingredientes y volver a casa con nuevas recetas y comidas para hacer. Ya te hemos contado en otros posts sobre algunos platos típicos que deberías probar en Perú, Brasil o Barcelona así que hoy te proponemos que disfrutes de la comida internacional desde casa. Aprovechar el tiempo libre que tenemos para probar hacer con nuestras manos los mejores platillos gourmet del mundo. ¿Te animás a dar la vuelta al mundo en 20 comidas?"
    ],
    [
        "44 Recipes That Will Let You Eat Around The World While Quarantining",
        "With travel off limits, you may be experiencing some major wanderlust. And while you can''t hop on a plane right now, you can make a delicious dinner inspired by different cuisines and cultures around the world. Here are 40 recipes to taste your way around the world without leaving the house."
    ],
    [
        "Los 20 mejores platos tradicionales del mundo: solo hay uno español",
        "Para despedir el año, la guía de viajes Taste Atlas ha llevado a cabo un ranking gastronómico, en el que han evaluado los platos típicos de cada país del mundo. China, Turquía, Polonia o Perú son algunos de los países que aparecen en la lista, aunque también una tapa española ha conseguido entrar en el Top 20."
    ],
    [
        "117+ Traditional Foods From Around The World: Recipes for Best Dishes",
        "Welcome to The Storied Recipe, a community that harnesses the power of food to tell stories, preserve cultural heritage, and remember those that loved us through their cooking."
    ],
    [
        "Las 10 comidas más ricas y populares del mundo",
        "Probablemente sea uno de los desafíos más grandes que el hombre se haya impuesto: circunscribir los platillos del mundo entero a un número tan limitado y escueto. De todas maneras, hay algunos clásicos que han traspasado las fronteras de su tierra natal para convertirse en las comidas favoritas de la mayoría de la población mundial."
    ],
    [
        "30 Traditional Foods From Around The World",
        "Devour your foodie bucket list with these traditional foods from around the world. Visit everywhere from England to Thailand with these easy and tasty meals."
    ],
    [
        "Las 32 mejores comidas del mundo para probar al menos una vez en la vida",
        "Algunos de los platos y creaciones más deliciosas provienen de mercados al aire libre, mientras que otros se sirven en restaurantes icónicos con estrellas Michelin. La lista de los imprescindibles para los amantes de la comida"
    ]
  ]'),

  ('Health/healthy living 1', 'Mexico', '["hl1-mex-eng.png", "hl1-mex-esp.png"]', '[
    [
        "What are we waiting for?",
        "Child obesity in Mexico presents an urgency that demands immediate change."
    ],
    [
        "Obesidad y sobrepeso. Menos kilos, más vida",
        "De acuerdo con la Organización Mundial de la Salud (OMS) el desequilibrio entre el ingreso y el gasto de calorías es la causa fundamental de la obesidad y el sobrepeso: una acumulación anormal y excesiva de grasa que puede ser perjudicial para la salud."
    ],
    [
        "Has the United States Exported Its Obesity Rate to Mexico?",
        "Between 1988 and 2012, the rate of obesity among Mexican women increased from 10% to 30%. At the same time, Mexico entered a period of greater economic liberalization by signing the NAFTA trade pact with the United States and Canada. According to the economists Osea Giuntella, Matthias Rieger, and Lorenzo Rotunno, the arrival of American products onto the Mexican market accounts for up to 20% of the increase in obesity among Mexican women."
    ],
    [
        "La Obesidad en México",
        "¡Por tu salud, quítate un peso de encima! La obesidad se puede prevenir."
    ],
    [
        "Mexico''s obesity epidemic",
        "Mexican girls and boys, but especially girls, have seen their mean body mass index (BMI) rise at one of the steepest rates globally over the past 35 years, researchers at Imperial College London found after comparing data from 200 countries."
    ],
    [
        "Obesidad, epidemia agudizada en México",
        "El exceso de peso es un padecimiento en sí mismo y un problema de salud pública sin precedentes; segundo sitio para la OCDE"
    ],
    [
        "Childhood and adult obesity: Mexico''s other epidemic",
        "In 2016, more than 1.9 billion adults (39 per cent of the global population) were overweight, of which over 650 million were obese. According to data from the World Health Organization, in the space of just 45 years, worldwide obesity has nearly tripled"
    ],
    [
        "Sobrepeso y obesidad en niños, niñas y adolescentes",
        "La obesidad y el sobrepeso pueden causar padecimientos como diabetes y problemas del corazón y los riñones."
    ],
    [
        "Childhood obesity in Mexico: Influencing factors and prevention strategies",
        "Overweight and obesity in school-age children, in Mexico as in other countries around the world, is a rapidly increasing public health problem within recent years, with important consequences for the future health of the population. Various national strategies at the individual and community level have been established to prevent these conditions, but none have yet succeeded."
    ],
    [
        "Sobrepeso y obesidad en México",
        "El sobrepeso y obesidad en México son un problema creciente, que no se estanca, y se encuentra en zonas ricas, pobres, rurales y urbanas de nuestro país. Así lo expuso la Dra. Teresa Shamah Levy, directora adjunta del Centro de Investigación en Evaluación y Encuestas (CIEE) del Instituto Nacional de Salud Pública (INSP), durante su entrevista en el programa Simbiosis de TV UNAM."
    ],
    [
        "10 Facts on Obesity in Mexico",
        "Obesity is a public health problem, because it has been associated with the development of chronic, non-communicable diseases such as diabetes, hypertension, cardiovascular disease and cancer."
    ],
    [
        "¿Es realmente México el país más obeso del mundo?",
        "Para muchas personas, el país del taco, las quesadillas y los huaraches es también la nación con más altos índices de obesidad en el mundo."
    ]
  ]'),

  ('Health/healthy living 1', 'US', '["hl1-us-eng.png", "hl1-us-esp.png"]', '[
    [
        "Overweight & Obesity",
        "Obesity is a common, serious, and costly chronic disease of adults and children that continues to increase in the United States. Obesity is putting a strain on American families, affecting overall health, health care costs, productivity, and military readiness."
    ],
    [
        "Cerca de 40% de los Adultos en Estados Unidos son Obesos",
        "Llevar programas de prevención basados en la evidencia a más comunidades, previene las enfermedades y reduce los costos de salud"
    ],
    [
        "State of Obesity 2022: Better Policies for a Healthier America",
        "Trust for America''s Health''s (TFAH) 19th annual report on the nation''s obesity crisis found that 19 states have obesity rates over 35 percent, up from 16 states in 2021, and that social and economic factors are key drivers of increasing obesity rates. The report includes data by race, age, and state of residence and recommendations for policy action."
    ],
    [
        "¿Por qué EE.UU. es el país con más personas con obesidad del mundo?",
        "Estados Unidos es en la actualidad el país con más personas con obesidad del mundo, de acuerdo con datos de la Organización Mundial de la Salud (OMS). La información previa a la pandemia aportada por los Centros para el Control y la Prevención de Enfermedades (CDC, por sus siglas en inglés) indicaba que la prevalencia de la obesidad en adultos de EE.UU. era del 41,9%."
    ],
    [
        "How Obesity In The U.S. Has Grown And What To Do About It",
        "Is America really the most obese country in the world? Well, not quite, it ranks as the 12th most obese country worldwide, but number 1 when considering high-income countries. Obesity refers to a medical condition in which one has an excess amount of fat in the body, and one''s Body Mass Index (BMI) is 30 or more (BMI is a measurement that factors in one''s height, weight, age, and sex)."
    ],
    [
        "¿Qué estado tiene la tasa de obesidad más alta?",
        "La obesidad es una preocupación creciente en los Estados Unidos. Te compartimos cuál es el estado que tiene la tasa de obesidad más alta en el país."
    ],
    [
        "Obesity in America: A Growing Concern",
        "Obesity has been named a chronic disease by leading medical associations."
    ],
    [
        "Porcentaje de adultos con obesidad en Estados Unidos a fecha de 2021, por estado",
        "En 2021, más del 40% de los adultos estadounidenses de Kentucky tenían obesidad. Así, estado este estado se sitúa en la segunda posición del ranking de estados del país con mayor porcentaje de obesos, solo por detrás de Virginia Occidental."
    ],
    [
        "42% Americans are living with obesity",
        "More than 4 in 10 U.S. adults are obese, with states in the South and Midwest showing some of the highest prevalence, a new analysis from NORC at the University of Chicago shows."
    ],
    [
        "Más del 70% de los adultos de EEUU tiene sobrepeso u obesidad, pero no se consideran gordos",
        "Una encuesta reveló que el 40% de los hombres y las mujeres dijeron estar contentos con su peso actual. La obesidad está considerada una epidemia nacional en Estados Unidos."
    ],
    [
        "US obesity rates have tripled over the last 60 years",
        "Nationwide surveys show that 43% of Americans are obese, while 10% are morbidly obese."
    ],
    [
        "El nivel de obesidad de Estados Unidos sigue aumentando",
        "El país no solo registró en el 2014 un porcentaje de obesidad mayor que el año pasado, sino que es el más alto de los últimos siete años."
    ]
  ]'),

  ('Health/healthy living 1', 'International', '["hl1-int-eng.png", "hl1-int-esp.png"]', '[
    [
        "Obesity",
        "Obesity is most commonly measured using the body mass index (BMI) scale. The World Health Organization define BMI as: ''a simple index of weight-for-height that is commonly used to classify underweight, overweight and obesity in adults.''"
    ],
    [
        "La pandemia más fuerte del mundo es la obesidad: Colegio de Cirujanos Bariatras y Enfermedades Metabólicas",
        "Durante una conferencia de prensa, Ortiz Gómez expresó que la pandemia más fuerte del mundo es la obesidad, y esta es provocada principalmente por el consumo de alimentos de menor costo y menor calidad"
    ],
    [
        "Global Obesity Levels",
        "The island country of Nauru is the most obese in the world with obesity affecting 61.0% of the adult population, according to the most recent data available from the World Health Organization (WHO) as of Mar. 26, 2020. Vietnam is the least obese country with 2.1% of the population classified as obese. Among OECD countries, the United States is the most obese (36.2%)."
    ],
    [
        "Sobrepeso y obesidad: Atlas mundial 2023",
        "El recién publicado Atlas mundial de obesidad 2023 predice que más de 4.000 millones de personas en el mundo, el 51% de la población global, sufrirán sobrepeso y obesidad en 2035, frente a los 2.600 millones de 2020. Señala, además, que una de cada cuatro personas será obesa."
    ],
    [
        "Prevalence of Obesity",
        "The worldwide prevalence of obesity nearly tripled between 1975 and 2016. Obesity is now recognised as one of the most important public health problems facing the world today."
    ],
    [
        "Obesidad y sobrepeso",
        "Desde 1975, la obesidad se ha casi triplicado en todo el mundo."
    ],
    [
        "Worldwide obesity on the rise",
        "A diet of processed food is becoming the norm in low- and middle-income countries"
    ],
    [
        "Ranking de los países con mayor número de personas obesas a nivel mundial en 2022",
        "Estados Unidos lidera el ranking mundial de de países con mayor número de población con obesidad. Así en octubre de 2022, más de 77 millones de estadounidenses eran considerados obesos, es decir, tenían un índice de masa corporal (IMC) igual o superior a 30. Completaban el podio China e India, aunque con cifras notablemente inferiores a pesar de sus respectivas superpoblaciones."
    ],
    [
        "Half of world on track to be overweight by 2035",
        "More than half the world''s population will be classed as obese or overweight by 2035 if action is not taken, the World Obesity Federation warns."
    ],
    [
        "Prevención de la obesidad",
        "La obesidad y el sobrepeso se definen como una acumulación anormal o excesiva de grasa que puede ser perjudicial para la salud. Una forma simple de medir la obesidad es el índice de masa corporal (IMC). Se calcula dividiendo el peso de una persona en kilogramos por el cuadrado de la talla en metros."
    ],
    [
        "More than half of the world will be overweight or obese by 2035",
        "More than half of the world''s population will be overweight or obese by 2035 without significant action, according to a new report."
    ],
    [
        "La obesidad en el mundo",
        "El presente artículo analiza el sobrepeso y obesidad, y lo que estos implican como un enorme problema de salud pública en el mundo y en el Perú."
    ]
  ]'),

  ('Science, Computers & Technology 1', 'Mexico', '["sct1-mex-eng.png", "sct1-mex-esp.png"]', '[
    [
        "Top Social Media Networks Websites in Mexico Ranking Analysis for September 2023",
        "facebook.com ranked number 1 and is the most visited Social Media Networks website in Mexico in September 2023, followed by whatsapp.com as the runner up, and instagram.com ranking at 3rd place as the leaders of the Social Media Networks websites in Mexico."
    ],
    [
        "Redes sociales con el mayor porcentaje de usuarios en México en 2022",
        "Facebook sigue siendo la red social más popular en México. Casi un 93% de la población mexicana utilizaba la mencionada plataforma en 2022. Completaban el podio WhatsApp (que le seguía muy de cerca con un 92,2%) y Facebook Messenger con más de un 80%."
    ],
    [
        "Reach of leading social networks in Mexico as of May 2023",
        "According to a May 2023 survey, WhatsApp was the most popular social media platform in Mexico. At that time, 95.6 percent of those interviewed said they had an active account on the messaging app. Also owned by Meta Platforms Inc., Facebook and Instagram ranked second and third, being used by 84.9 and 76.2 percent of respondents, respectively."
    ],
    [
        "Las 5 redes sociales más usadas en México",
        "Existen muchas redes sociales, un día puede aparecer una nueva y al día siguiente desaparecer otra, sin embargo, el usuario mexicano tiene una elección muy marcada entre las redes sociales que más utiliza."
    ],
    [
        "Social Media in Mexico: which are the most used social networks",
        "As we have told you on other occasions, the Mexican digital market is one of the most powerful and dynamic in the entire Latam area. In Mexico, 74% of the population is already online, which translates into 102.5 million active users on both websites and social networks. The statistics were exposed by the Digital 2022 study carried out by We Are Social and Hootsuite to measure the state of Mexico’s connection. The results show that the number of users has been increasing since 2014."
    ],
    [
        "Redes sociales más usadas en México: cómo vender más en línea",
        "Hoy en día, las redes se han convertido en excelentes canales de ventas. Por eso, te vamos a contar cuáles son las redes sociales más usadas en México y cómo aprovecharlas para vender más."
    ],
    [
        "Mexico Social Media",
        "Mexico currently has approximately 85 million internet users as of June of 2017, a number which has increased exponentially since 2015, when the number was around 58 million. Currently, penetration is around 65.3%. Mexico has around 76 million social media users, or around 59% of the total population. The number of social media users is up 27% since January of 2016."
    ],
    [
        "Uso de redes sociales en México: 94 millones acceden al social media, la mayoría a Facebook (2023)",
        "El acceso a internet en nuestro país avanza a paso veloz y con la pandemia su evolución fue mayor. Hoy en día somos 78.6 % de la población mexicana los que navegamos en la Word Wide Web, predominantemente a través de dispositivos móviles, lo que a su vez ha generado más visitas a websites y un uso frecuente de las redes sociales en México, traduciéndose en 94 millones de usuarios activos de las diferentes plataformas que existen para conectarnos con los demás."
    ],
    [
        "The State of Social Media in Mexico",
        "Due to the increasing popularity of social media sites worldwide, we explored the “State of Social Media in Mexico” and uncovered some interesting data that places Mexico in a leadership position in this category worldwide."
    ],
    [
        "Día de las redes sociales: ¿Cuáles son las plataformas que más se usan en México?",
        "De acuerdo con un estudio de Statista, Facebook continúa como la plataforma más popular en el país"
    ],
    [
        "Social Media in Mexico - 2023 Stats & Platform Trends",
        "Mexico has a slightly lower internet and mobile usage compared to South America, with 72% and 97% penetration rate respectively. Despite this, Mexico’s internet usage is diverse due to its large Spanish-speaking population and frequent travel with the US."
    ],
    [
        "Las 5 redes sociales más utilizadas por los jóvenes en México (2022)",
        "En México 9 de cada 10 jóvenes tienen acceso a un teléfono celular. Y la aplicación social más utilizada por ellos es el paquete de mensajería instantánea, WhatsApp. Facebook e Instagram ocupan el segundo y tercer lugar de las redes sociales más usadas por la población de entre 12 y 29 años."
    ]
  ]'),

  ('Science, Computers & Technology 1', 'US', '["sct1-us-eng.png", "sct1-us-esp.png"]', '[
    [
        "Leading social media websites in the United States as of August 2023, based on share of visits",
        "In August 2023, Facebook accounted for around 50 percent of all social media site visits in the United States, confirming its position as the leading social media website by far. Other social media platforms, despite their popularity, had to make do with smaller shares of visits across desktop, mobile, and tablet devices combined. Instagram ranked second with 15.85 percent of all U.S. social media site visits, while Pinterest accounted for 14.69 percent of the total visits in the country. Additionally, the U.S. is home to the third largest social media audience worldwide."
    ],
    [
        "¿Cuáles son las redes sociales más utilizadas en Estados Unidos en 2021?",
        "Facebook continúa siendo una de las redes sociales más utilizadas en Estados Unidos con más 175 millones de usuarios activos."
    ],
    [
        "Top 9 Growing Social Media Platforms In The US",
        "Social media is constantly changing and - as a business or agency owner - you need to know what''s in and what''s out to make sure your social media campaigns are reaching the right people."
    ],
    [
        "Las 3 redes sociales favoritas de los adolescentes de Estados Unidos (y ninguna es Facebook)",
        "La salida de Facebook de los adolescentes estadounidenses es cada vez mayor."
    ],
    [
        "The 15 Biggest Social Media Sites and Apps [2023]",
        "Social networking platforms are locked in a never-ending game of musical chairs."
    ],
    [
        "Volumen de usuarios mensuales de las apps de redes sociales más populares en Estados Unidos a septiembre de 2019",
        "Esta estadística muestra el volumen de usuarios mensuales de las apps de redes sociales más populares en Estados Unidos a septiembre de 2019. La app de la red social Instagram se situó la segunda del ranking con más de 121 millones de usuarios mensuales, por delante de Facebook Messenger, tercera en la lista con 106,4 millones de usuarios al mes."
    ],
    [
        "The 6 Biggest, Baddest, Most Popular Social Media Platforms (+How to Wield Their Power)",
        "I''m 99% sure you can already guess the most popular social media sites in 2022."
    ],
    [
        "EE.UU.: USO DE LAS REDES SOCIALES EN 2021",
        "La mayoría de los estadounidenses dicen que utilizan YouTube y Facebook, mientras que el uso de Instagram, Snapchat y TikTok es especialmente común entre los adultos menores de 30 años."
    ],
    [
        "Social Media Use in 2021",
        "A majority of Americans say they use YouTube and Facebook, while use of Instagram, Snapchat and TikTok is especially common among adults under 30."
    ],
    [
        "¿Qué red social usan más en EEUU?",
        "La red social más popular es Facebook, que ha sido la reina suprema desde su creación. ¿Cuánta gente usa Facebook? Tiene cerca de 2.800 millones de usuarios activos mensuales, y alrededor de 7 de cada 10 adultos en los Estados Unidos (69 %) afirman usar Facebook de alguna manera.Las principales redes sociales en EE.UU."
    ],
    [
        "Top Social Media Statistics And Trends Of 2023",
        "¿Cuál es la red social más utilizada en Estados Unidos?"
    ],
    [
        "¿Cuál es la red social más utilizada en Estados Unidos?",
        "Redes Sociales más usadas en Estados Unidos 2023 Ya sabemos que las redes sociales más usadas en Estados Unidos son Facebook, YouTube, Instagram, TikTok, Linkedin, Snapchat, Twitter y Pinterest e Instagram considerando el mayor tiempo de permanencia."
    ]
  ]'),

  ('Science, Computers & Technology 1', 'International', '["sct1-int-eng.png", "sct1-int-esp.png"]', '[
    [
        "Most popular social networks worldwide as of January 2023, ranked by number of monthly active users",
        "Market leader Facebook was the first social network to surpass one billion registered accounts and currently sits at more than 2.9 billion monthly active users. Meta Platforms owns four of the biggest social media platforms, all with over one billion monthly active users each: Facebook (core platform), WhatsApp, Facebook Messenger, and Instagram. In the final quarter of 2022, Facebook reported over 3.7 billion monthly core Family product users."
    ],
    [
        "Tiempo medio empleado a diario por los internautas en las redes sociales a nivel mundial entre 2012 y 2022",
        "A partir de 2022, el uso promedio diario de las redes sociales por parte de los usuarios de Internet a nivel mundial se situó en torno a 151 minutos por día, frente a los 148 minutos de 2021."
    ],
    [
        "The rise of social media",
        "Social media sites are used by more than two-thirds of internet users. How has social media grown over time?"
    ],
    [
        "Nuevas estadísticas del uso de Redes Sociales que quieres y debes conocer",
        "Cómo consumen los usuarios las redes sociales? Las estadísticas del uso de redes sociales es algo que has de tener siempre muy presente. Estar al día te hará saber cómo abarcar la mayoría de tus proyectos. El nuevo marketing ya no sabe existir sin las redes, así que toma nota de todo que seguro te va a servir para crear tus próximas estrategias."
    ],
    [
        "134 Social Media Statistics You Need To Know For 2023",
        "We''ve rounded up over 130 social media statistics that are useful and informative to represent the 4.8 billion social media users worldwide."
    ],
    [
        "Redes Sociales: casi el 60% de la población mundial ya las usa",
        "De los más de 5,000 millones de personas del mundo que usan internet, casi el 95% utiliza las redes sociales, justo ahora que varias plataformas luchan por su sitio en el tablero, con el auge de TikTok, el poder de Meta y el cambio de Twitter a X."
    ],
    [
        "Number of social media users worldwide from 2017 to 2027",
        "Social media usage is one of the most popular online activities. In 2022, over 4.59 billion people were using social media worldwide, a number projected to increase to almost six billion in 2027."
    ],
    [
        "Las redes sociales en el mundo",
        "Miles de millones de personas se comunican mediante plataformas como Facebook, Twitter o Instagram"
    ],
    [
        "Social Media Users — Global Demographics (2023)",
        "Social media platforms are on a meteoric rise globally. Facebook is the leader in this race, with 3.03 billion members. But did you ever wonder how many people use social media? We did, too, so we did our research and found that as of 2023, 4.9 billion out of the 8.1 billion people on the globe use social media."
    ],
    [
        "Cuáles son las redes sociales con más usuarios del mundo (2023)",
        "No podemos imaginar al mundo sin redes sociales: una afirmación que se refuerza cada día y más desde que el confinamiento por el Covid-19 impulsó aún más el uso de estas plataformas digitales. En este contexto de crecimiento del social media, Facebook ha logrado permanecer en el liderato de las redes sociales con más usuarios del mundo, de acuerdo con el último informe Digital 2023 realizado por We Are Social."
    ],
    [
        "More than half of the people on Earth now use social media",
        "Hootsuite and We Are Social release Q3 results on the growth of social media since the global onset of COVID-19"
    ],
    [
        "Los usuarios de las redes sociales equivalen a más del 58 % de la población mundial",
        "El dato surge del informe Digital 2022, realizado por We Are Social y Hootsuite. Cuáles son las plataformas más populares y el impacto del gaming"
    ]
  ]'),

  ('Media & Entertainment 1', 'Mexico', '["me1-mex-eng.png", "me1-mex-esp.png"]', '[
    [
        "10 Best Mexican Films of the 21st Century So Far And Where to Watch Them",
        "Although it''s sadly not always recognized as such, the Mexican film industry has an intricately rich and interesting history. It grew up alongside Hollywood, having even had a Golden Age not too dissimilar from its big brother''s in the North."
    ],
    [
        "Mejores películas mexicanas de todos los tiempos",
        "Ranking de las películas de México mejor valoradas en Filmaffinity"
    ],
    [
        "The Most Exciting Movies by Mexican Filmmakers to Watch Right Now",
        "Stream classics ''Roma'' and ''Like Water for Chocolate,'' along with thrilling newer works"
    ],
    [
        "Las 100 mejores películas del cine mexicano",
        "En 2020 se actualizó el listado de las 100 mejores películas del cine mexicano. ¡Conoce la selección y cuéntanos cuál es tu favorita!"
    ],
    [
        "19 Best Mexican Movies Of All Time (2023 Update)",
        "Mexico is a country rich with beauty and culture, from cuisine, to music, to film. We''ve put together this list of the Best Mexican Movies of All Time as a guide to get you started exploring Mexico''s fascinating culture and the sensual Spanish language. We''ll cover the 5 Best Mexican Movies of All Time, as well as the Gangster, Romantic, Comedy, Horror, and more! Happy viewing!"
    ],
    [
        "Las diez mejores películas del cine mexicano, según IMDb",
        "Con motivo de esta celebración, la Secretaría de Cultura, a través del Instituto Mexicano de Cinematografía (Imcine), exhibirá en 90 puntos del país lo mejor del cine independiente, con cerca de 60 películas nacionales de reciente producción, con pantallas en ''las montañas, las selvas, los desiertos y los valles'', según Imcine."
    ],
    [
        "34 Sensational Mexican Movies to Watch Before You Visit Mexico",
        "Are you planning a trip to Mexico? Are you a first-time visitor to Mexico? Not sure what to expect? You may have a general notion of the flavors and landscapes of Mexico, but there is so much more! Watch a few of the best Mexican movies before you go to Mexico to get a better feel of the diverse culture that engulfs this popular destination from coast to coast."
    ],
    [
        "Las 10 mejores películas del cine mexicano en los últimos cinco años",
        "Presentamos un listado de grandes cintas realizadas en México de 2018 a la actualidad."
    ],
    [
        "Top Ten Mexican Movies Ever",
        "With the recent plethora of Mexican actors, directors and other creatives having invaded Hollywood and producing some of America''s biggest grossing blockbusters it''s easy to forgot that Mexico has long been a creator of high-quality movies, from the ''golden era'' of Mexican cinema to the new wave of film makers, headed by Cuarón and Iñarritú. It’s very hard to get only ten in this list, but in this countdown, we made our best effort to give you the ten movies you should definitely see."
    ],
    [
        "34 películas mexicanas contemporáneas que no te puedes perder",
        "Si siempre estás buscando una buena película, aquí te proponemos una lista con 34 películas mexicanas que contiene algunos de los mejores títulos que ha dado la industria cinematográfica mexicana, entre el año 2000 y 2022."
    ],
    [
        "10 Best Mexican Movies Of All Time: A Celebration of The Cinema of Mexico",
        "Mexico has a rich cinematic history, with a variety of genres and styles represented in its films."
    ],
    [
        "30 de las mejores películas mexicanas de todos los tiempos",
        "México lleva más de 100 años haciendo cine. De las primeras obras que se tienen registradas está Tepeyac de José Manuel Ramos que data de 1917, a la que le siguieron dos grandes producciones del mismo director como Viaje redondo y El zarco de 1920."
    ]
  ]'),

  ('Media & Entertainment 1', 'US', '["me1-us-eng.png", "me1-us-esp.png"]', '[
    [
        "The 10 Best American Movies of All Time, According to the AFI",
        "The American Film Institute has curated numerous high-profile lists that celebrate excellence in cinema, and these are the top 10 American films featured in the television special AFI''s 100 Years, 100 Movies (10th Anniversary) in 2007."
    ],
    [
        "Mejores películas estadounidenses de todos los tiempos",
        "Ranking de las películas de EEUU mejor valoradas en Filmaffinity"
    ],
    [
        "50 Best Movies About America of the Past 50 Years",
        "From ''All the President''s Men'' to ''The Godfather,'' ''Boyhood'' to ''Boyz n the Hood'' — the movies that have reflected the American experiment back to us on the screen for the past half century"
    ],
    [
        "62 críticos eligen las 100 mejores películas estadounidenses",
        "La BBC ha reunido a 62 críticos de cine de todo el mundo para elaborar una lista con las 100 mejores películas de Estados Unidos. Una labor difícil que ha dado como resultado una lista con títulos emblemáticos del séptimo arte como Ciudadano Kane, Psicosis, El Padrino o 2001: Una odisea en el espacio."
    ],
    [
        "The 100 best American movies of all time, according to the BBC",
        "BBC Culture polled film critics from around the world to determine the best American movies ever made. You might find the results surprising."
    ],
    [
        "Las mejores películas estadounidenses de la historia según el American Film Institute",
        "Con motivo del primer siglo del cine, el American Film Institute (AFI) realizó una encuesta entre más de 1500 artistas y líderes de la industria cinematográfica. Entre 400 películas nominadas, los encuestados eligieron las 100 mejores películas estadounidenses de todos los tiempos (veremos en el listado algunas británicas, pero que fueron incluidas como estadounidenses por haber sido financiadas por estudios de ese país)."
    ],
    [
        "20 greatest American movies of all time",
        "See the greatest American films ever made."
    ],
    [
        "Las 100 mejores películas estadounidenses de la historia",
        "¿Cuál es la mejor película de todos los tiempos? Una pregunta frecuente entre los seguidores del séptimo arte. Aunque es difícil hacer una lista única, para simplificarlo la BBC realizó un conteo que reúne las 100 mejores películas estadounidenses de todos los tiempos y las agrupó por palabras clave como: ídolos, odiseas, sueños, besos, lamentos, entre otras."
    ],
    [
        "The 50 Best American Movies of All Time",
        "SEE IF YOUR FAVORITE FILM GOT LEFT ON THE CUTTING ROOM FLOOR."
    ],
    [
        "¿Son estas las 100 mejores películas estadounidenses de la Historia?",
        "Así lo han decidido 62 críticos de todo el mundo consultados por BBC Culture, de cuyas elecciones sale un canon lleno de sospechosos habituales y con alguna que otra sorpresa."
    ],
    [
        "The Most Important American Films of All Time",
        "Cinema has been a crucial apart of American culture for over a century, and theses are the great films that define Hollywood and America as a whole."
    ],
    [
        "Las 100 mejores películas estadounidenses de todos los tiempos, según los críticos",
        "Las películas norteamericanas figuran entre las mayores exportaciones del país. Desde las innovaciones de Thomas Edison a mediados de la década de 1890, Estados Unidos ha sido siempre una potencia en el desarrollo del cine, desde los entretenimientos masivamente populares de Hollywood, a las películas independientes y de vanguardia. En reconocimiento de la asombrosa influencia de Estados Unidos en lo que sigue siendo la forma de arte más popular en todo el mundo, BBC Culture encuestó a 62 críticos de cine internacionales para determinar las 100 películas estadounidenses más grandes de todos los tiempos."
    ]
  ]'),

  ('Media & Entertainment 1', 'International', '["me1-int-eng.png", "me1-int-esp.png"]', '[
    [
        "The 100 best movies of all time",
        "Silent classics, noir, space operas and everything in between: Somehow we managed to rank the best movies of all time"
    ],
    [
        "Las 100 mejores películas de la historia del cine, ordenadas en ranking",
        "Títulos como ''El padrino'', ''El viaje de Chihiro'', ''La vida es bella'' y la trilogía de ''El señor de los anillos'' se reúnen en esta lista de lo mejor del séptimo arte, según las votaciones del público. ¿Estás de acuerdo con el resultado?"
    ],
    [
        "The 100 Best Movies Of All Time",
        "It’s a big question: what are the best movies of all time? And it''s one with many answers - there are all kinds of reasons why the greatest films ever made endure in the way they do. They create unforgettable images, conjure overwhelming emotions, craft thrilling stories, and deliver characters who leap off the screen."
    ],
    [
        "MEJORES PELÍCULAS SEGÚN LOS USUARIOS",
        "¿Cuales son las mejores películas de todos los tiempos según los usuarios de SensaCine.com? Encuentra las 300 mejores películas de todos los tiempos, según los usuarios"
    ],
    [
        "THE 100 BEST MOVIES OF THE PAST 10 DECADES",
        "TIME’s Stephanie Zacharek on the top films from the 1920s through the 2010s"
    ],
    [
        "Las 110 mejores películas de la historia del cine",
        "Una lista totalmente subjetiva de las mejores películas de todos los tiempos, las que más amamos y las que deberías haber visto al menos una vez en la vida."
    ],
    [
        "30 Best Movies of All Time, Ranked",
        "These are some of the best movies ever made. You will disagree, and you will not like this at all."
    ],
    [
        "Las 10 mejores películas de todos los tiempos",
        "La industria cinematográfica ha dado cientos de obras maestras, pero estas son las más valoradas por los usuarios de la popular plataforma IMDb"
    ],
    [
        "The 100 Greatest Movies of All Time",
        "The movies are now more than 100 years old. That still makes them a young medium, at least in art-form years (how old is the novel? the theater? the painting?). But they’re just old enough to make compiling Variety’s first-ever list of the 100 Greatest Movies of All Time a more daunting task than it once might have been. Think about it: You get an average of one film per year. A great deal of ardent discussion and debate went into the creation of this list. Our choices were winnowed from hundreds of titles submitted by more than 30 Variety critics, writers and editors. As we learned, coming up with which movies to include was the easy part. The hard part was deciding which movies to leave out."
    ],
    [
        "Las 50 mejores películas de la historia, elegidas por los cerebros de Hollywood",
        "La revista «The Hollywood reporter» ha preguntado a más de 2000 personas que trabajan en la meca de los sueños para elegir los mejores filmes de la historia"
    ],
    [
        "Plan a Movie Marathon Weekend—We Ranked the 100 Best Movies of All Time!",
        "Catch up with the essentials. This is the definitive ranking of the 100 greatest films ever made."
    ],
    [
        "Las 100 mejores películas de la historia",
        "Anota esta lista de títulos imprescindibles para tus noches de manta, sofá y peli."
    ]
  ]');

`;

  const insertPrestudy  = `
  INSERT INTO prestudy_test_questions (question_text, options, correct_answer) VALUES
  ("Can I park here?", '["Sorry, I did that.", "It is the same place.", "Only for half an hour."]', "Only for half an hour."),
  ("What colour will you paint the childrens bedroom?", '["I hope it was right.", "We can not decide.", "It was not very difficult."]', "We can not decide."),
  ("I can not understand this email.", '["Would you like some help?", "Do not you know?", "I suppose you can."]', "I suppose you can."),
  ("I would like two tickets for tomorrow night.", '["How much did you pay?", "Afternoon and evening.", "I will just check for you."]', "Afternoon and evening."),
  ("Shall we go to the gym now?", '["I am too tired.", "It is very good.", "Not at all."]', "I am too tired."),
  ("His eyes were ...... bad that he couldnt read the number plate of the car in front.", '["such", "so", "too", "very"]', "so"),
  ("The company needs to decide ...... and for all what its position is on this point.", '["here", "once", "first", "finally"]', "once"),
  ("Do not put your cup on the ...... of the table someone will knock it off.", '["outside", "edge", "boundary", "border"]', "edge"),
  ("Al oír del accidente de su buen amigo, Paco se puso _____", '["hope", "think", "mean", "suppose"]', "mean"),
  ("No puedo comprarlo porque me _____ dinero", '["falta", "dan", "presta", "regalan"]', "regalan"),
  ("Tuvo que guardar cama por estar _____ .", '["enfermo", "vestido", "ocupado", "parado"]', "parado"),
  ("Aquí está tu café, Juanito. No te quemes, que está muy _____", '["dulce", "amargo", "agrio", "caliente"]', "caliente"),
  ("Al romper los anteojos, Juan se asustó porque no podía _____ sin ellos", '["discurrir", "oir", "ver", "entender"]', "entender");

  `;
  con.query(createTestQuestionsTable, (err) => {
    if (err) {
      console.error("Error creating test_questions table:", err);
    } else {
      console.log("test_questions table created successfully");
    }
  });

  // insert data after creating the table
  con.query(insertDataIntoTestQuestionsTable, (err) => {
    if (err) {
      console.error("Error inserting data into test_questions table:", err);
    } else {
      console.log("Data inserted into test_questions table successfully");
    }
  });

  con.query(createResponsesTableSQL, (err) => {
    if (err) {
      console.error("Error creating test_responses table:", err);
    } else {
      console.log("test_responses table created successfully");
    }
  });

  con.query(createPrestudyTestQuestionsTable, (err) => {
    if (err) {
      console.error("Error creating prestudy_questions:", err);
    } else {
      console.log("prestudy_questions_table created successfully");
    }
  });

  con.query(insertPrestudy, (err) => {
    if (err) {
      console.error("Error inserting prestudy_test_questions table:", err);
    } else {
      console.log("poststudy_questions table created successfully");
    }
  });

  con.query(createPrestudyResponsesTable, (err) => {
    if (err) {
      console.error("Error creating prestudy table:", err);
    } else {
      console.log("prestudy_responses table created successfully");
    }
  });

  con.query(createMasterTable, (err) => {
    if (err) {
      console.error("Error creating master_table:", err);
    } else {
      console.log("master_table created successfully");
    }
  });


  // Close the connection
  con.end((error) => {
    if (error) {
      console.error("Error closing MySQL connection:", error);
      return;
    }
    console.log("MySQL connection closed.");
  });
});
