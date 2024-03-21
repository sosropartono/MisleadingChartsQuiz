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
    user_answer VARCHAR(255),
    config VARCHAR(255),
    question_number VARCHAR(10) NOT NULL,
    question_sequence VARCHAR(10) NOT NULL,
    question_based_on_seq VARCHAR(10) NOT NULL,
    timestamp VARCHAR(40)
  )
`;

const createPrestudyResponsesTable = `
CREATE TABLE IF NOT EXISTS prestudy_responses (
  user_id VARCHAR(10) NOT NULL,
  question_text VARCHAR(700),
  user_answer VARCHAR(255),
  is_correct VARCHAR(5) NOT NULL,
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
    [[
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
    ]],
    [[
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
    ]]
  ]'),

  ('Politics, Governments & Events 1', 'US', '["pge1-us-eng.png", "pge1-us-esp.png"]', '[
    [[
        "GOP makes history when 8 hard-liners succeed in ousting House Speaker McCarthy",
        "NPR''s A Martinez talks to Republican strategist Liam Donovan about what it says about the state of the GOP when a small group of Republican rebels was able to topple the speaker of the House."
    ],
    [
        "Kevin McCarthy Got What He Deserved",
        "The House speaker surrendered every principle, and in the end, it still wasn''t enough to save him."
    ],
    [
        "Who voted Kevin McCarthy out? These 8 House Republicans.",
        "Rep. Kevin McCarthy (R-Calif.) was ousted as speaker of the House of Representatives after a small group of Republicans rebelled against their leader. It was the first time in history that the chamber had voted out a speaker."
    ],
    [
        "Kevin McCarthy has been ousted as speaker of the House. Here''s what happens next.",
        "The House on Tuesday voted 216 to 210 to remove California Republican Kevin McCarthy from his position as House speaker, a historic move that comes days after he reached an 11th-hour deal to avert a government shutdown with the help of House Democrats."
    ],
    [
        "Shell shocked'' Kevin McCarthy will not run for House speaker again following removal",
        "Former House Speaker Kevin McCarthy will not run again for House speaker, he told reporters on Tuesday evening following a narrow vote to remove him from the role earlier in the day."
    ],
    [
        "Kevin McCarthy is out as speaker of the House. Here''s what''s next",
        "The House of Representatives is entering uncharted territory after a far-right effort to remove fellow Republican Kevin McCarthy from the speakership succeeded thanks to support from Democrats."
    ]],
    [[
        "¿Por qué destituyeron al republicano Kevin McCarthy como presidente de la Cámara de Representantes?",
        "En un día histórico para la política estadounidense, que parece hundirse aún más en el caos, el representante republicano Kevin McCarthy fue destituido este martes como presidente de la Cámara de Representantes de Estados Unidos."
    ],
    [
        "El republicano Kevin McCarthy, primer presidente de la Cámara de Representantes de EE.UU. en ser destituido tras una histórica votación",
        "El republicano Kevin McCarthy se convirtió este martes en el primer presidente de la Cámara de Representantes de EE.UU. en ser destituido en una histórica votación."
    ],
    [
        "Kevin McCarthy es destituido como presidente de la Cámara de Representantes tras inédita votación",
        "Tras un largo debate y una votación, la Cámara de Representantes decidió sacar de su cargo a Kevin McCarthy, líder republicano que presidía la Cámara Baja del Congreso. La decisión vino tras una moción de destitución presentada por el representante Matt Gaetz, un republicano de extrema derecha de Florida. Una decisión de estas características nunca se había visto en Estados Unidos."
    ],
    [
        "EEUU | Destituido el presidente de la Cámara de Representantes, el republicano Kevin McCarthy",
        "Una moción de censura lo ha expulsado del puesto menos de diez meses después de haberlo asumido."
    ],
    [
        "La Cámara de Representantes de EE UU destituye a su presidente y sume al Capitolio en el caos",
        "Matt Gaetz, del ala dura del Partido Republicano, fuerza la salida de su líder, Kevin McCarthy, nueve meses después de su nombramiento. La histórica votación aboca al país a la parálisis legislativa"
    ],
    [
        "Matt Gaetz, del ala dura del Partido Republicano, fuerza la salida de su líder, Kevin McCarthy, nueve meses después de su nombramiento. La histórica votación aboca al país a la parálisis legislativa",
        "La Cámara de Representantes de EE. UU. voto a favor de destituir de su cargo al republicano Kevin McCarthy. Es la primera vez en la historia del país que se remueve del cargo al presidente de la Cámara."
    ]]
  ]'),
  
  ('Politics, Governments & Events 1', 'International', '["pge1-int-eng.png", "pge1-int-esp.png"]', '[
    [[
        "Japan demographic woes deepen as birth rate hits record low",
        "Japan''s birth rate declined for the seventh consecutive year in 2022 to a record low, the health ministry said on Friday, underscoring the sense of crisis gripping the country as the population shrinks and ages rapidly."
    ],
    [
        "Japan births fall to record low as population crisis deepens",
        "The number of births registered in Japan plummeted to another record low last year - the latest worrying statistic in a decades-long decline that the country''s authorities have failed to reverse despite their extensive efforts."
    ],
    [
        "Japan''s population drops by nearly 800,000 with falls in every prefecture for the first time",
        "Every one of Japan''s 47 prefectures posted a population drop in 2022, while the total number of Japanese people fell by nearly 800,000. The figures released by the Japan''s internal affairs ministry mark two new unwelcome records for a nation sailing into uncharted demographic territory, but on a course many other countries are set to follow."
    ],
    [
        "Japan''s fertility rate is likely even lower than it seems",
        "The fertility rate calculated by the health ministry — 1.26 in 2022 — is a key benchmark in gauging Japan''s depopulation and comparing its progress with other countries."
    ],
    [
        "More Than 40% of Japanese Women May Never Have Children",
        "An estimated 42% of adult Japanese women may end up never having children, the Nikkei newspaper reported, citing a soon-to-be-published estimate by a government research group."
    ],
    [
        "Japan announces plan to address a national crisis: its low birthrate",
        "Japan''s government has a new plan to halt the country''s plunging birthrate. But many Japanese are skeptical, as the government has tried and failed to fix the problem for some three decades."
    ]],
    [[
        "El multimillonario plan de Japón para que las parejas tengan más hijos (y por qué el dinero no siempre es la solución)",
        "Fumio Kishida dijo hace unas semanas que su país está al borde de no poder funcionar como sociedad por la histórica baja en la tasa de natalidad: por primera vez en más de un siglo la cantidad de bebés nacidos en Japón cayó por debajo de los 800.000 el año pasado, según estimaciones oficiales."
    ],
    [
        "Tasa de natalidad de Japón vuelve a caer y toca un nuevo récord",
        "Lea más: (Tasa de natalidad de Japón vuelve a caer y toca un nuevo récord) https://www.bloomberglinea.com/2023/03/04/tasa-de-natalidad-de-japon-vuelve-a-caer-y-toca-un-nuevo-record/"
    ],
    [
        "La población de Japón se redujo en medio millón de habitantes en 2022",
        "La población de Japón disminuyó por duodécimo año consecutivo, a medida que aumentan las muertes y la tasa de natalidad continúa descendiendo, según datos gubernamentales publicados este miércoles."
    ],
    [
        "Japón se queda sin niños; se agrava crisis de natalidad y alcanza mínimo histórico",
        "La tasa de fecundidad fue de 1.25 de acuerdo con el último informe; el primer ministro Fumio Kishida ha hecho de detener la caída en una prioridad máxima."
    ],
    [
        "La tasa de natalidad en Japón cae a mínimo histórico",
        "Las muertes han superado a los nacimientos en Japón durante más de una década, lo que representa un problema creciente para la tercera economía más grande del mundo."
    ],
    [
        "Japón necesita aumentar la tasa de natalidad antes de que pase la “última oportunidad”",
        "El Gobierno planea aumentar las ayudas para el cuidado de los hijos, proporcionar ayudas para la vivienda a las familias jóvenes que están criando a sus hijos, trabajar para reducir los costes de la educación y aumentar los salarios de los trabajadores más jóvenes"
    ]]
  ]'),

  ( 'Politics, Governments & Events 2', 'Mexico', '["pge2-mex-eng.png", "pge2-mex-esp.png"]', '[
    [[
        "Popocatépetl volcano spews smoke and ash, putting millions of Mexicans on alert",
        "Popocatépetl volcano just outside Mexico City has been erupting occasionally since 1994, but over the past week it has rumbled every day."
    ],
    [
        "Popocatépetl Volcano Erupts in Mexico",
        "Mexico''s Popocatépetl Volcano, whose name is the Aztec word for smoking mountain, began belching out towering clouds of ash this week. Located about 45 miles southeast of Mexico City in central Mexico, the volcano is considered one of the most dangerous in the world, since roughly 25 million people live within 60 miles of it. Thus, it is also one of the world''s most closely-monitored volcanoes."
    ],
    [
        "Alert Level Is Raised in Central Mexico as Volcano Spews Smoke and Ash",
        "Officials were preparing evacuation routes and shelters around the volcano, Popocatépetl, and some schools and parks were closed to minimize exposure to falling ash."
    ],
    [
        "Concern about Mexico''s Popocatepetl volcano changes with the wind",
        "Concern about the Popocatepetl volcano changes with the wind. While east of the mountain residents swept streets and didn’t remove their masks on Tuesday, here to the west, they casually watched the gas and ash plume emerg they casually watched the gas and ash plume emerging from its crater."
    ],
    [
        "Threat of Popocatepetl volcano looms outside Mexico City",
        "Recent eruptions from the most active volcano in Mexico have coated the region with dangerous pollutants"
    ],
    [
        "Watch: Mexico''s Popocatépetl Volcano Erupts, Spewing Smoke and Ash",
        "A cloud of ash descended over towns around Mexico''s Popocatépetl volcano after it erupted, reducing visibility on Monday. The nearly 18,000-foot mountain is located outside Mexico City."
    ]],
    [[
        "México: Elevan alerta por explosiones del volcán Popocatépetl",
        "Las autoridades mexicanas elevaron el domingo el nivel de alerta por el volcán Popocatépetl, situado unos 80 kilómetros (50 millas) al sureste de Ciudad de México, debido a una intensificación de sus explosiones. Todavía no se requieren evacuaciones, pero el gobierno ultima los preparativos por si fueran necesarias y pidió respetar un radio de seguridad de 12 kilómetros (7,5 millas)."
    ],
    [
        "Volcán retumba cerca de la Ciudad de México, cubriendo ciudades con cenizas e interrumpiendo vuelos",
        "El volcán Popocatépetl, que se eleva a pocas horas de una de las ciudades más grandes del mundo, ha estado cubriendo de ceniza a las ciudades cercanas e interrumpiendo los vuelos en el aeropuerto de la Ciudad de México, el más transitado de América Latina."
    ],
    [
        "Erupciones explosivas, ceniza por todas partes: Cómo es la vida bajo el volcán más peligroso de México",
        "Cada primavera los habitantes de este pueblo enclavado en la base de uno de los volcanes más peligrosos del mundo suben a una cueva cercana a su cráter para hacer una ofrenda de paz."
    ],
    [
        "México: Pueblos en torno al Popocatépetl, vigilantes ante creciente actividad del volcán",
        "A las orillas de este poblado, uno de los más cercanos al volcán Popocatépetl y lejos del ajetreo del tráfico, se sentían el lunes estruendos ocasionales procedentes de la montaña, como el rugir de un motor."
    ],
    [
        "Mira las impresionantes imágenes del volcán Popocatépetl y su lluvia de ceniza",
        "El volcán Popocatépetl, en México, ha incrementado su actividad poniendo en alerta a millones de habitantes. Mira aquí las postales que ha dejado su actividad."
    ],
    [
        "VIDEO EN VIVO | Así está el volcán Popocatépetl en estos momentos",
        "Diferentes cámaras desde diversas ubicaciones se monitorean la actividad del volcán Popocatépetl, que sigue en nivel de alerta amarilla fase 3, con menos emisión de ceniza pero aún bajo el monitoreo constante de las autoridades."
    ]]
  ]'),

  ('Politics, Governments & Events 2', 'US', '["pge2-us-eng.png", "pge2-us-esp.png"]', '[
    [[
        "Inside the complex effort to rid Maui of toxic fire debris and rubble",
        "One of the most complicated wildfire cleanup missions in recent memory is now underway on the Hawaiian island of Maui, where fleets of workers and equipment are being shipped to the island while officials plot how to carefully but quickly remove hundreds of thousands of tons of toxic debris."
    ],
    [
        "One more Lāhainā fire victim identified by police: death toll is 97, unaccounted for is 22",
        "This brings the total number of victims publicly identified to 83 of the estimated 97 fatalities, which is down from the death toll of 115 that had been reported for more than two weeks. Six more people have been identified, but their families have not been located or notified."
    ],
    [
        "Maui Wildfires Latest: Lahaina Reopens to Residents",
        "Some Lahaina residents will be allowed to visit what''s left of their homes for the first time since wildfires swept across Maui."
    ],
    [
        "Some Lahaina residents returned to their burned out neighborhood while dangers still loom",
        "More than a month after catastrophic flames raced across Lahaina, annihilating most of the historic town and killing 97 people in Maui, some residents were finally able to return to the charred remains of their homes Monday."
    ],
    [
        "Lahaina residents sift through rubble as they return home for first time since deadly Hawaii wildfires",
        "Residents last week were allowed to apply for vehicle passes to re-enter the zone and were provided personal protective equipment to wear when combing through charred remains of structures."
    ],
    [
        "Stories from the Maui fires",
        "With the official death toll at 97 as of Sept. 18, the inferno was one of the deadliest in United States history. There are 31 people still missing—a decrease from the roughly 3,000 people who were initially unaccounted for."
    ]],
    [[
        "El número de desaparecidos en el incendio de Maui iba a caer por debajo de 100... y volvió a 385 con nuevos nombres",
        "Después de que el gobernador diera gracias a Dios por el descenso en la lista de personas sin localizar, una avalancha de nuevas denuncias dejó el conteo prácticamente sin cambios."
    ],
    [
        "''Nadie se lo esperaba'': así se inició el fuego que arrasó Lahaina",
        "Entrevistas y videos revisados por el Times muestran que el incendio comenzó bajo un tendido eléctrico que se rompió nueve horas antes de que se quemara la ciudad."
    ],
    [
        "El incendio de Lahaina comenzó con un fuego ''contenido'' que se reactivó poco después",
        "El fiscal general del estado ha dicho que encargará una investigación externa para indagar las causas del incendio de Lahaina y las labores para combatirlo."
    ],
    [
        "Los voraces incendios en Maui han cobrado la vida de al menos 111 personas, según las autoridades. Y aumentan los cuestionamientos",
        "El saldo mortal de los incendios forestales en Maui sigue aumentando. Durante la noche de este miércoles, un comunicado del condado Maui informó que la cifra de personas muertas ascendió a 111. Una actualización que se produce mientras Hawaiian Electric enfrenta crecientes interrogantes por no haber interrumpido las líneas eléctricas cuando los fuertes vientos crearon condiciones peligrosas para un incendio."
    ],
    [
        "Incendios forestales en Hawái: ¿Cuál es la causa de las mortíferas llamas?",
        "Una serie de condiciones climáticas sin precedentes contribuyeron a lo que podría ser la peor catástrofe natural de la historia del Estado."
    ],
    [
        "Incendio de Maui: tras el fuego, la furia y el dolor",
        "Los residentes de Lahaina reclaman explicaciones por lo que consideran una incorrecta gestión del desastre. “Todo porque no sonaron las dichosas alarmas”, lamenta una residente cuya casa quedó reducida a cenizas"
    ]]
  ]'),

  ('Politics, Governments & Events 2', 'International', '["pge2-int-eng.png", "pge2-int-esp.png"]', '[
    [[
        "2023 Turkey-Syria Earthquake",
        "On Feb. 6, a magnitude 7.8 earthquake occurred in southern Turkey near the northern border of Syria. This quake was followed approximately nine hours later by a magnitude 7.5 earthquake located around 59 miles (95 kilometers) to the southwest."
    ],
    [
        "Why the Turkey-Syria Earthquakes Were So Destructive",
        "NC State professor Ashly Cabas explains how the two earthquakes that struck Turkey and Syria earlier this month resulted in so much death and destruction."
    ],
    [
        "Shattered Relief: A 7.8-Magnitude Earthquake Strikes Turkey and Syria",
        "A 7.8-magnitude earthquake struck Turkey and Syria in the early hours of the morning on February 6 with the large southeastern Turkish city of Gaziantep at its epicenter. This was followed less than 10 hours later by a 7.5-magnitude aftershock slightly to Gaziantep''s north. In addition to its impact on Turkey and Turkish citizens, the twin quakes hit the heart of a border area home to millions of Syrian refugees at a time of great economic and geostrategic uncertainty in Turkey and across the region."
    ],
    [
        "Here''s what we know about what caused the Turkey earthquake",
        "The area of Turkey and Syria that has been hardest hit by Monday''s 7.8-magnitude earthquake and its aftershocks is known for having big quakes, but it had been decades since one this large last hit."
    ],
    [
        "Earthquake near Turkish-Syrian border deepens crisis",
        "In the early morning of February 6, the most severe earthquake Turkey had experienced in almost 100 years also sent shockwaves across northern Syria and parts of Lebanon. Find out more about the crisis."
    ],
    [
        "Turkey-Syria Earthquake: Three-Month Update",
        "Over 400 tons of medical aid has been delivered or is pending delivery since the region was devastated by seismic activity."
    ]],
    [[
        "Terremotos de Turquía y Siria: La respuesta de la IFRC hasta la fecha",
        "Dos terremotos devastadores (de magnitud 7,7 y 7,6) sacudieron el sureste de Turquía en la madrugada del lunes 6 de febrero de 2023, seguidos de varias réplicas. Los seísmos mataron a decenas de miles de personas e hirieron a muchas más en la región, así como en la fronteriza Siria."
    ],
    [
        "Terremoto en Turquía y Siria: el día a día tras el sismo",
        "Después del sismo letal que ha dejado miles de muertos, surgen imágenes de solidaridad, duelo y urgencia. Estas son algunas fotografías y videos de las labores de rescate."
    ],
    [
        "Terremoto en Turquía y Siria: miles de muertos tras dos potentes sismos",
        "Dos potentes terremotos, de magnitud 7,8 y 7,5, respectivamente, dejaron miles de muertos y una enorme devastación en Turquía y Siria."
    ],
    [
        "La devastación causada por el terremoto en Turquía y Siria es de dimensiones “apocalípticas”",
        "El máximo responsable de la agencia de la ONU al cargo de la alimentación señala que el alcance de la destrucción “es realmente incomprensible”, destaca que el impacto de este terremoto se dejará sentir durante meses y años y pide apoyo a escala internacional."
    ],
    [
        "Dos potentes terremotos causan miles de muertos en Turquía y Siria",
        "Los equipos de rescate tratan de localizar a las personas atrapadas bajo los escombros en el sureste turco y norte sirio tras dos seísmos, el primero de una magnitud de 7,8 y el segundo de 7,5. Erdogan afirma que su país vive “la mayor tragedia” desde el gran terremoto de Erzincan, en 1939"
    ],
    [
        "Terremotos en Turquía y Siria: ya son casi 45,000 los muertos",
        "Dos poderosos terremotos, uno de magnitud 7.8 y otro de magnitud 7.5, sacudieron amplias franjas de Turquía y Siria la madrugada del lunes 6 de febrero, derribando cientos de edificios y matando al menos a 44,844 personas."
    ]]
  ]'),

  ( 'Politics, Governments & Events 3', 'Mexico', '["pge3-mex-eng.png", "pge3-mex-esp.png"]', '[
    [[
        "Lidia makes landfall as Category 4 hurricane on Mexico''s Pacific coast before weakening",
        "Hurricane Lidia made landfall along the Pacific Coast of west-central Mexico on Tuesday as a Category 4 hurricane before weakening, threatening a stretch of the west-central shoreline home to Puerto Vallarta, a resort town and popular tourist destination in the Mexican state of Jalisco. Its arrival came on the heels of Tropical Storm Max, which hit the southern coast of Mexico on Monday, several hundred miles from Jalisco, before tapering off."
    ],
    [
        "Hurricane Lidia makes landfall as a Category 4 near Mexico''s Puerto Vallarta resort",
        "Hurricane Lidia made landfall as an ''extremely dangerous'' Category 4 storm Tuesday evening with winds of 140 mph (220 kph) near Mexico''s Pacific coast resort of Puerto Vallarta."
    ],
    [
        "Extremely dangerous'' Hurricane Lidia slams into Mexico coast, killing 1",
        "Hurricane Lidia plowed into Mexico''s Pacific coast at the beach town of Las Penitas on Tuesday evening as a powerful Category 4 storm, killing at least one person as resorts hunkered down to shelter from lashing rain, powerful wind and flooding."
    ],
    [
        "Extremely dangerous'' Hurricane Lidia hits Mexico''s Pacific coast",
        "Hurricane Lidia, a Category 4 strength storm, will bring wind speeds of up to 140mph (220km/h) in the state of Jalisco, the US National Hurricane Center (NHC) said before it hit."
    ],
    [
        "Hurricane Lidia strengthens into major hurricane as it approaches Puerto Vallarta along Mexico''s Pacific coast",
        "Hurricane Lidia is expected to make landfall along the Pacific Coast of Mexico on Tuesday night as a major hurricane, potentially threatening a stretch of the west-central shoreline home to Puerto Vallarta, a resort town and popular tourist destination in the Mexican state of Jalisco. Its expected arrival comes on the heels of Tropical Storm Max, which hit the southern coast of Mexico on Monday, several hundred miles from Jalisco, before tapering off."
    ],
    [
        "Hurricane Lidia makes landfall in western Mexico",
        "Hurricane Lidia made landfall in western Mexico just south of the popular resort town of Puerto Vallarta on Tuesday evening."
    ]],
    [[
        "Trayectoria del huracán Lidia frente a Puerto Vallarta en el Pacífico mexicano",
        "La mañana del martes 10 de octubre, Lidia se ubicaba a 235 millas (380 kms) de Puerto Vallarta, en Jalisco. Presentaba vientos máximos sostenidos de 85 mph (140 km/h), mientras se mueve al este a 13 mph (20 km/h), según datos del Centro Nacional de Huracanes."
    ],
    [
        "El huracán Lidia se fortalece a categoría 2",
        "El Servicio Meteorológico Nacional (SMN) de México informó que el huracán Lidia subió en la mañana de este martes a categoría 2 en la escala Saffir-Simpson."
    ],
    [
        "Huracán Lidia Se Debilita Tras Tocar Tierra En El Pacífico De México",
        "El huracán Lidia se degradó a categoría 2 en la escala Saffir-Simpson (de 5) tras tocar tierra este martes en la costa central del Pacífico mexicano, donde ha desatado intensas precipitaciones, alto oleaje y fuertes vientos."
    ],
    [
        "Poderoso Huracán Lidia Toca Tierra En La Costa Pacífico De México",
        "El huracán Lidia, de categoría 4 y considerado ''extremadamente peligroso'', tocó tierra la tarde la martes en la costa del Pacífico central de México, informó el Centro Nacional de Huracanes de Estados Unidos (NHC)."
    ],
    [
        "La costa del Pacífico de México se prepara para recibir un golpe doble de Max y Lidia",
        "Dos tormentas nombradas en menos de 48 horas tocarán tierra en la costa del Pacífico de México a principios de esta semana, y es probable que una de ellas se fortalezca hasta convertirse en un huracán, lo que representa una amenaza inusual de doble impacto."
    ],
    [
        "Huracán Lidia apunta hacia balneario mexicano de Puerto Vallarta con vientos cada vez más fuertes",
        "El huracán Lidia apunta el martes hacia al centro turístico de Puerto Vallarta, en la costa del Pacífico mexicano, y los meteorólogos dijeron que podría tener vientos de más de 140 kilómetros por hora cuando toque tierra al final del día o a primeras horas del miércoles."
    ]]
  ]'),

  ('Politics, Governments & Events 3', 'US', '["pge3-us-eng.png", "pge3-us-esp.png"]', '[
    [[
        "Hurricane Idalia",
        "Hurricane Idalia brought significant damage and flooding across its path through the Southeast. Follow instructions from local authorities and use the resources on this page to stay safe after the storm."
    ],
    [
        "Damaging 2022 Atlantic hurricane season draws to a close",
        "The 2022 Atlantic hurricane season officially ends on November 30, but the impact of Hurricanes Ian, Nicole and Fiona — which brought extensive damage to Florida''s coast and Puerto Rico, respectively — will continue to be felt long after the season is over. "
    ],
    [
        "2022 Hurricane Season Recap: When Florida''s Recent Luck Ran Out",
        "The 2022 Atlantic hurricane season produced a number of damaging hurricanes, particularly for the Florida Peninsula, despite its more muted statistics compared to recent years."
    ],
    [
        "Blow-by-blow: How an erratic 2022 hurricane season brought concentrated suffering to Florida",
        "Whether defined as the six weeks from early September to mid-October in which the Caribbean and southern Gulf saw numerous storms, or the six weeks between Hurricanes Ian and Nicole in Florida, 2022 administered its suffering in a concentrated dose. And while it tallied near-average activity overall, 2022 was once again above normal for U.S. landfalls."
    ],
    [
        "The 2022 hurricane season shows why climate change is so dangerous",
        "What was going on, many wondered? Did this mean there would be a welcome respite from recent years of record-breaking storms? After all, there were a whopping 21 total storms in 2021. And, in 2020, there were so many storms that forecasters ran out of letters in the alphabet to name them."
    ],
    [
        "2022 Hurricane season has come and gone",
        "The 2022 Atlantic hurricane season officially ended on Nov. 30. Regardless, the impact of Hurricanes Ian, Nicole and Fiona, which brought extensive damage to Florida''s coast and Puerto Rico, continue to be felt."
    ]],
    [[
        "Las imágenes que muestran las inundaciones y los daños tras el paso del huracán Idalia por Cuba y Florida",
        "Tras pasar por el oeste de Cuba como tormenta tropical, Idalia se intensificó hasta convertirse en un huracán de gran intensidad en la madrugada de este miércoles."
    ],
    [
        "Video sobre huracán en Florida no es reciente, es de 2022",
        "El gobernador de Florida, Ron DeSantis, declaró emergencia por la inminente llegada del huracán Ian."
    ],
    [
        "Condado de Florida calcula daños por huracán en 481 mdd",
        "Los daños causados por el huracán Nicole ascienden a más de 481 millones de dólares en un condado de la costa central de Florida en donde algunas casas cayeron hacia el Océano Atlántico tras el paso del meteoro la semana pasada."
    ],
    [
        "Riesgo de inundaciones y lluvias fuertes, vigente por paso de Ian sobre la Carolina del Norte y Virginia",
        "El huracán Ian, que se degradó a un ciclón postropical luego de tocar tierra este viernes en Carolina del Sur, causa inundaciones, lluvias severas y fuertes vientos, mientras avanza sobre Carolina del Norte y Virginia, según el Centro Nacional de Huracanes (NHC, por sus siglas en inglés)."
    ],
    [
        "El huracán Idalia toca tierra en Florida como un huracán de categoría 3 con vientos de 125 millas por hora.",
        "l huracán Idalia tocó tierra en la región de Big Bend en Florida a las 7:45 a.m. EDT el 30 de agosto como una tormenta de categoría 3 con vientos de 125 mph y una presión central de 949 mb."
    ],
    [
        "Finaliza la temporada de huracanes: ¿Pueden desarrollarse ciclones tropicales durante diciembre y enero?",
        "La temporada de huracanes, que inició el 1 de junio, finalizó el pasado 30 de noviembre, marcada por un agosto tranquilo, pero un septiembre mortal."
    ]]
  ]'),

  ('Politics, Governments & Events 3', 'International', '["pge3-int-eng.png", "pge3-int-esp.png"]', '[
    [[
        "Ten years on, grief never subsides for some survivors of Japan''s tsunami",
        "After the 2011 disaster, Japan built new neighborhoods, parks and schools. But the scale of loss is beyond any policy response. Today, many of those who remain in hard-hit coastal towns are haunted by all that was lost."
    ],
    [
        "Mar 11, 2011 CE: Tohoku Earthquake and Tsunami",
        "On March 11, 2011, Japan experienced the strongest earthquake in its recorded history. The earthquake struck below the North Pacific, 130 kilometers (81 miles) east of Sendai, the largest city in the Tohoku region, a northern part of the island of Honshu."
    ],
    [
        "Response to the 2011 Great East Japan Earthquake and Tsunami disaster",
        "On 11 March, 2011 a devastating tsunami triggered by a Mw 9.0 earthquake struck the northern Pacific coast of Japan, and completely destroyed many coastal communities, particularly in Iwate, Miyagi and Fukushima prefectures."
    ],
    [
        "Devastated communities, an unseen fear: Japan''s 2011 tsunami",
        "I''ll never forget the moment we arrived in the city of Natori."
    ],
    [
        "On This Day: 2011 Tohoku Earthquake and Tsunami",
        "On March 11, 2011, a magnitude (Mw) 9.1 earthquake struck off the northeast coast of Honshu on the Japan Trench."
    ],
    [
        "Japan earthquake and tsunami of 2011",
        "Japan earthquake and tsunami of 2011, also called Great Sendai Earthquake or Great Tōhoku Earthquake, severe natural disaster that occurred in northeastern Japan on March 11, 2011."
    ]],
    [[
        "A 12 años de Fukushima: las fotos del mayor terremoto y tsunami que azotó a Japón en 2011",
        "Aviones ligeros y otros vehículos se encuentran entre los escombros después de que fueran barridos por un tsunami que golpeó el aeropuerto de Sendai en el norte de Japón el viernes 11 de marzo de 2011. Foto AP Photo/Kyodo News"
    ],
    [
        "Japón sufre su mayor terremoto",
        "Un seísmo de 8,9 grados en la escala de Richter devasta el norte del archipiélago y causa centenares de muertos - Olas de 10 metros de altura barren la costa"
    ],
    [
        "11 de marzo de 2011: a diez años del sismo de Tohoku, Japón",
        "Considerado entre los cuatro terremotos de mayor magnitud que han ocurrido en los últimos cien años. Este sismo generó un devastador tsunami que arrasó una extensa área de la costa noreste de Japón, causando graves daños y pérdidas humanas. Es uno de los eventos mejor documentados."
    ],
    [
        "Implicaciones del tsunami de Tohoku del año 2011 para la gestión de desastres naturales en Japón",
        "El 11 de Marzo del 2011 un terremoto de magnitud 9.0 en la escala Richter generó un devastador tsunami que arrasó una extensa área de la costa noreste de Japón."
    ],
    [
        "El terroemoto y tsunami de Japon de 2011",
        "Il Terremoto de Tōhoku del 11 de marzo de 2011, También conocido como el Gran Terremoto del Este de Japón, fue el terremoto más poderoso jamás registrado en Japón y el cuarto mas poderoso del mundo desde el comienzo de las grabaciones modernas en 1900."
    ],
    [
        "Una fina grava provocó el gran tsunami de Japón en 2011",
        "Investigadores de Caltech avanzan en el estudio de la propagación de terremotos a través de grava de grano fino que se forma a lo largo de las placas tectónicas y que puede generar grandes rupturas. Este proceso parece ser la causa del gran terremoto y posterior tsunami que barrió la costa de Japón en 2011"
    ]]
  ]'),

  ( 'Politics, Governments & Events 4', 'Mexico', '["pge4-mex-eng.png", "pge4-mex-esp.png"]', '[
    [[
        "Drug cartel violence flares in western Mexico after vigilante leader''s killing",
        "The drug cartel violence that citizen self-defense leader Hipolito Mora gave his life fighting flared anew on Sunday, just one day after he was buried, as shootings and road blockades hit the city of Apatzingan, a regional hub in Mexico''s hot lands."
    ],
    [
        "Mexico''s Long War: Drugs, Crime, and the Cartels",
        "Violence continues to rage more than a decade after the Mexican government launched a war against drug cartels."
    ],
    [
        "As Mexico''s epidemic of violence rages on, authorities seem powerless to stop it",
        "With more than 26,000 murders this year, it is clear the president''s strategy of using the military to control the crime gangs has failed"
    ],
    [
        "New Crime, Old Solutions: The Reason Why Mexico is Violent Again",
        "The upsurge in Mexico''s violence is the result of a multi-level, uncoordinated judicial system that has been incapable of controlling criminal networks that are increasingly fractured and geographically dispersed. Today''s crisis is the result of changes in the modus operandi of criminals that are not mirrored by changes in Mexico''s judicial and police institutions."
    ],
    [
        "Twenty-four hours of terror as cartel violence engulfs Mexican city",
        "At least 29 people killed in Culiacán as drug cartel gunmen fight bloody battle to stop transport of El Chapo''s son after arrest"
    ],
    [
        "Drug gangs unleash violence in northern Mexican cities",
        "The Mexican border cities of Tijuana and Mexicali along with Rosarito and Ensenada were hit by gang violence that included vehicles being set ablaze and road blockades."
    ]],
    [[
        "Las pandillas en la Ciudad de México son una forma de pertenencia y protección para los jóvenes",
        "En la Ciudad de México, los jóvenes de estratos populares han sido estigmatizados durante décadas"
    ],
    [
        "Narcotráfico y corrupción: las formas de la violencia en México en el siglo XXI",
        "Indudablemente ligada al aumento del poder del narcotráfico, la violencia ha tomado en México un lugar central en el debate público y ha debilitado al gobierno por su incapacidad para hacerle frente. ¿Quiénes son los actores de esta violencia? ¿Qué relaciones sostienen con otros actores sociales, desde la base hasta el vértice de la pirámide social? ¿Cómo se vinculan estos fenómenos a la cuestión de la ley y la igualdad en la comunidad política?"
    ],
    [
        "Los ''narcotanques'' revelan el nivel de violencia de los cárteles en México",
        "Los grupos del crimen organizado están modificando camionetas con torretas armadas, refuerzos de acero y arietes, llevando el concepto de los camiones monstruo a nuevos niveles de letalidad."
    ],
    [
        "Cuál es la clave para reducir la violencia por el narco en México, según estudio científico",
        "Una base de datos del CIDE expuso la existencia de al menos 150 cárteles activos en el país"
    ],
    [
        "Ola de violencia de los carteles lleva al gobierno mexicano a desplegar el ejército en varias ciudades",
        "Miles de soldados federales fueron desplegados en varias ciudades mexicanas fronterizas luego de una semana de violencia callejera generada por carteles de la droga."
    ],
    [
        "Semana de violencia del narco inquieta a mexicanos",
        "Los tiroteos y los incendios provocados por los cárteles del narcotráfico en cuatro estados en el transcurso de varios días la semana pasada han hecho que los mexicanos se pregunten por qué lo hicieron y qué es lo que quieren las bandas criminales."
    ]]
  ]'),

  ('Politics, Governments & Events 4', 'US', '["pge4-us-eng.png", "pge4-us-esp.png"]', '[
    [[
        "President Biden''s Finest Hour",
        "This column doesn''t always abound with praise for President Biden and his administration. This week''s is an exception."
    ],
    [
        "How the Secret Service plans to keep President Biden safe in Israel: ANALYSIS",
        "Biden''s visit comes as Israel faces dual combat fronts."
    ],
    [
        "President Joe Biden will travel to Israel on Wednesday amid war in the Middle East",
        "President Joe Biden plans to travel to Israel on Wednesday in a dramatic display of support for the U.S. ally as his administration seeks to prevent the Israel-Hamas war from expanding into a larger Middle East conflict."
    ],
    [
        "Biden lands in Israel as Middle East turmoil grows following hospital explosion in Gaza",
        "President Joe Biden touched down in Israel on Wednesday for a diplomatic scramble to prevent the war with Hamas from spiraling into an even larger conflict, a challenge that became more difficult as outrage swept through the Middle East over an explosion that killed hundreds in a Gaza Strip hospital."
    ],
    [
        "How President Joe Biden''s Israel trip came together",
        "The idea of Biden''s visiting Israel was first raised in the early days after the Hamas terrorist attack, and the president signed off on it Monday afternoon."
    ],
    [
        "Biden admin doesn''t want Israel-Hamas to suck U.S. back into the Middle East",
        "He wants to show the U.S. supports Israel, but there''s little appetite in the White House to make the Israel-Hamas fight the top foreign policy priority."
    ]],
    [[
        "En Israel, Biden se enfocará en ayuda humanitaria y evitar un conflicto más grande",
        "Los esfuerzos del presidente Joe Biden para atemperar la escalada bélica entre Israel y Hamas sufrieron un duro revés el martes incluso antes de que partiera hacia Oriente Medio, ya que Jordania suspendió la cumbre prevista entre el mandatario estadounidense y mandatarios árabes después de que una explosión en un hospital de Gaza causara centenares de muertes."
    ],
    [
        "Presidente de EEUU Joe Biden viajará a Israel el miércoles, mientras crece temor de que guerra Israel-Hamas se extienda",
        "Presidente de EEUU Joe Biden viajará a Israel el miércoles, mientras crece temor de que guerra Israel-Hamas se extienda."
    ],
    [
        "Joe Biden: “Nos aseguraremos de que Israel tenga todo lo que necesita para defenderse”",
        "El presidente estadounidense conversa con Netanyahu y considera “puro mal” el ataque de Hamás"
    ],
    [
        "EE.UU. asegura que el paso de Rafah “se abrirá” para permitir la entrada de ayuda a Gaza",
        "El secretario de Estado de EE.UU., Antony Blinken, aseguró que el paso de Rafah, entre Egipto y la Franja de Gaza, “se abrirá” para facilitar la llegada de ayuda humanitaria a los palestinos atrapados en el enclave."
    ],
    [
        "Estados Unidos está listo para ofrecer apoyo a Israel tras ataques: Biden",
        "El presidente estadounidense, Joe Biden, dijo el sábado que Estados Unidos estaba dispuesto a ofrecer ''todos los medios apropiados de apoyo'' a Israel tras un ataque del grupo islamista palestino Hamás."
    ],
    [
        "Biden promete a Israel ''lo que necesite para defenderse''",
        "Hamás, organización calificada como ''terrorista'' por la Unión Europea, lanzó un fuerte ataque a Israel. Siga aquí minuto a minuto los últimos detalles."
    ]]
  ]'),

  ('Politics, Governments & Events 4', 'International', '["pge4-int-eng.png", "pge4-int-esp.png"]', '[
   [ [
        "India''s Top Court Rejects Gay Marriage, While Voicing Sympathy",
        "Though it expanded the definition of discrimination, the ruling was a sharp setback for petitioners seeking a landmark victory on marriage equality."
    ],
    [
        "India''s Supreme Court refuses to legalize same-sex marriage, saying it''s up to Parliament",
        "India''s top court on Tuesday refused to legalize same-sex marriages, passing the responsibility back to Parliament in a ruling that disappointed campaigners for LGBTQ+ rights in the world''s most populous country."
    ],
    [
        "India''s top court declines to legalise same-sex marriage",
        "India''s top court on Tuesday declined to legalise same-sex marriage and left it to parliament to decide, agreeing with Prime Minister Narendra Modi''s government that the legislature is the right forum to rule on the contentious issue."
    ],
    [
        "India''s supreme court declines to legally recognise same-sex marriage",
        "Judges say decision should be made by parliament but stress that such unions should not face discrimination"
    ],
    [
        "India Supreme Court declines to legalise same-sex marriage",
        "India''s Supreme Court has declined to legalise same-sex unions, dashing the hopes of millions of LGBTQ+ people seeking marriage equality."
    ],
    [
        "India''s top court defers same sex marriage decision, upsetting LGBTQ rights advocates",
        "India''s top court refused to legalize same-sex marriages. The five judges hearing the case ruled that only the Indian parliament could make that decision."
    ]],
    [[
        "El Tribunal Supremo Indio Se Niega A Pronunciarse Sobre El Matrimonio Entre Personas Del Mismo Sexo",
        "El Tribunal Supremo indio afirmó el martes no tener autoridad para legalizar el matrimonio entre personas del mismo sexo, lo que elimina las esperanzas de la comunidad LGTB+ de India de obtener el reconocimiento del matrimonio gay a pesar de la oposición del gobierno."
    ],
    [
        "El Supremo indio se niega a reconocer el matrimonio gay y devuelve la cuestión al Gobierno",
        "El Tribunal Supremo de la India se negó hoy a reconocer el matrimonio homosexual, alegando que el matrimonio no está establecido como un derecho constitucional, y ha pedido al gobierno y Parlamento que legisle en la materia."
    ],
    [
        "El no al matrimonio homosexual en la India decepciona pero no derrota a la comunidad LGTB",
        "El ''no'' al matrimonio homosexual por el Tribunal Supremo de la India este martes da un espaldarazo para el Gobierno al tiempo que supone un jarro de agua fría para la comunidad LGTB, que tras esperar décadas a la histórica despenalización de la homosexualidad en 2018 dice que seguirá luchando por la igualdad."
    ],
    [
        "El Supremo indio se niega a reconocer el matrimonio gay y devuelve la cuestión al Gobierno",
        "El Tribunal Supremo de la India se negó hoy a reconocer el matrimonio homosexual, alegando que el derecho al matrimonio no está establecido como un derecho constitucional, y ha pedido al gobierno y Parlamento que legisle en la materia."
    ],
    [
        "El Tribunal Supremo indio se niega a legalizar el «matrimonio gay»: para Modi es «elitista y urbano»",
        "El Tribunal Supremo de India acaba de rechazar legalizar el matrimonio entre personas del mismo sexo. Aunque, es cierto, no lo ha hecho en base a cuestiones morales o tradicionales sino de pura competencia administrativa."
    ],
    [
        "La Corte Suprema de India se niega a aprobar el matrimonio igualitario",
        "El Alto Tribunal indio rechazó el martes la legalización de personas del mismo sexo en repuesta a varias peticiones presentadas por grupos conservadores."
    ]]
  ]'),

  ('Travel & Leisure 1', 'Mexico', '["tl1-mex-eng.png", "tl1-mex-esp.png"]', '[
    [[
        "24 Most Beautiful Places in Mexico",
        "From charming small towns to stunning islands, these are the most beautiful places to visit in Mexico."
    ],
    [
        "35 Best Places to Visit in Mexico Right Now [2023]",
        "LOOKING FOR THE BEST PLACES TO GO IN MEXICO?"
    ],
    [
        "35 Best Places to Visit in Mexico in 2023",
        "What are the best places to visit in Mexico? This list of destinations will help you start planning your trip."
    ],
    [
        "36 BEST PLACES TO VISIT IN MEXICO IN 2023",
        "We have often considered settling down in Mexico when we retire. Each time we visit México, we love it! We haven''t visited everywhere in the country but love to add a new destination each time we go down. So we combined our extensive travels with Nathan of The TRVL Blog to showcase the best places to visit in Mexico."
    ],
    [
        "17 Best Places to Visit in Mexico",
        "Gorgeous beaches, a delicious culinary scene, festive culture and ancient pyramids all make Mexico a popular tourist destination. Mexico is a land of color and contrasts. Crowded beaches lead into quiet colonial towns while resort cities open gateways to jungles ringing with parrots and howler monkeys."
    ],
    [
        "35+ BEST PLACES TO VISIT IN MEXICO IN 2023 (TRAVEL BLOGGER''S SPILL THEIR FAVORITE MEXICAN DESTINATIONS)",
        "In this post, I asked my travel blogger friends for the best places to visit in Mexico & you need not look further for your Mexico vacation. The ultimate source for your Mexican trip."
    ]],
    [[
        "Los seis mejores lugares para visitar en México",
        "México reúne siglos de cultura ancestral, los mejores platos de la región, diversos paisajes y rincones alucinantes y encantadores, cada uno diferente del otro."
    ],
    [
        "25 lugares imprescindibles que ver en México",
        "México es uno de los países más visitados del mundo. Sus maravillosos cenotes, las playas caribeñas, su famosa gastronomía y su increíble cultura son algunos de los motivos para hacer una ruta por este hermoso país. Es tan grande y diverso que seguro que encontrarás algo que te enamorará. La Riviera Maya es la zona más turística, pero este país esconde atractivos en casi cualquier rincón de su territorio. En este post te contamos 25 lugares imprescindibles que ver en México."
    ],
    [
        "QUÉ VER EN MÉXICO: LAS 35 MEJORES COSAS QUE HACER Y VISITAR",
        "Qué ver y hacer en México: Los mejores atractivos turísticos"
    ],
    [
        "28 lugares para viajar con tus amigos en México",
        "Desde exhuberantes destinos llenos de naturaleza hasta bellos viñedos para catar los mejores vinos, en México hay todo tipo de lugares para viajar con amigos."
    ],
    [
        "15 Destinos Alucinantes en México que tienes que ver para creer",
        "Nuestro país es un lugar lleno de sorpresas, a veces complejo y difícil de explicar, pero al mismo tiempo fácil de querer. La magia puede suceder en muchos destinos alucinantes en México, ya sea caminando tranquilamente por el sueño de Edward James en la Huasteca Potosina o buceando lleno de adrenalina junto a un remolino de peces en Cabo Pulmo."
    ],
    [
        "Los 56 lugares turísticos de México que tienes que visitar",
        "México tiene tantos atractivos turísticos, que escoger solo 56 resulta una ardua tarea. Te presentamos esta selección, pidiendo disculpas por la enorme cantidad de sitios maravillosos que tuvimos que dejar fuera."
    ]]
  ]'),

  ('Travel & Leisure 1', 'US', '["tl1-us-eng.png", "tl1-us-esp.png"]', '[
    [[
        "MY 31 FAVORITE PLACES TO VISIT IN THE USA",
        "From sea to shining sea, the United States is home to a diverse landscape — both culturally and physically. Spending months traveling across it gave me a deep appreciation for all my country has to offer."
    ],
    [
        "The 50 Most Beautiful Places in the U.S.",
        "From magical deserts to gorgeous beaches, these are the most beautiful places in each state."
    ],
    [
        "101 Best Places to Visit in the USA in 2023 (Ultimate Bucket List)",
        "Throughout my life, I''ve visited 40 of the 50 states in the USA and experienced many of the incredible things to do this country has to offer. From touring big cities like New York to getting lost in national parks like Glacier, I fall more in love with the US each year. There are endless places to visit in the United States, but this list highlights the best."
    ],
    [
        "24 Best Places to Visit in the United States",
        "Discover more of America with our list of the best places to visit in the United States."
    ],
    [
        "The top 12 places to visit in the USA",
        "Whether you''re a nature lover looking for wide open spaces and snow-covered peaks or a culture fiend who wants to lose themselves in museums and galleries, we''ve created a list of the USA''s heavy hitters. Here are the best places to visit in 2023."
    ],
    [
        "The best places to visit in the USA for every month of 2023",
        "We''ve named the 12 best places to visit in the USA with one amazing destination for every month of the year"
    ]],
    [[
        "25 imprescindibles que visitar en Estados Unidos",
        "Tras dos largos viajes por Estados Unidos, hemos conocido montones de sitios increíbles que quedarán para siempre en nuestro recuerdo. Aunque si algo hemos aprendido es que es un país en el que, más allá de sus controvertidos sistemas políticos y sociales, se necesitaría una vida para poder visitar todos sus rincones maravillosos. Pero para no agobiarnos, vamos a empezar por los que son, para nosotros, los 25 mejores lugares que visitar en Estados Unidos."
    ],
    [
        "50 lugares que no te deberías perder cuando puedas viajar a EEUU",
        "EEUU levanta las restricciones a partir del 8 de noviembre y es el momento de volver a ese apasionante país tras la pandemia del Covid. Te contamos cuáles son los requisitos."
    ],
    [
        "Los 28 mejores lugares turísticos de Estados Unidos para visitar",
        "Comencemos nuestro Top 28 de mejores lugares turísticos de Estados Unidos con…"
    ],
    [
        "10 lugares que visitar en Estados Unidos imprescindibles",
        "Hay muchos lugares que visitar en Estados Unidos espectaculares, un inmenso país que reúne desde grandes metrópolis como Nueva York o Chicago, maravillas naturales que te dejarán sin palabras como Yellowstone o las Cataratas del Niágara o recorridos en coche o moto para conocer la América más profunda a través de carreteras como la ruta 66."
    ],
    [
        "12 Mejores Lugares Turísticos en Estados Unidos",
        "El país del norte es en el que se comen más de 40 hectáreas de pizza al día y ¡hasta 120 toneladas de aguacate, para guacamole, durante el Super Bowl! Así que no sería extraño que la variedad de lugares turísticos en Estados Unidos sea inmensa. También podrás encontrar desde increíbles parques temáticos, hasta un gran cañón con una de las vistas más impresionantes que podrás conocer."
    ],
    [
        "11 lugares emblemáticos de Estados Unidos que no te puedes perder",
        "Ya los viste en fotos, ahora visítalos en la vida real"
    ]]
  ]'),

  ('Travel & Leisure 1', 'International', '["tl1-int-eng.png", "tl1-int-esp.png"]', '[
    [[
        "Bucket List Travel: The Top 50 Places In The World",
        "If you''re like most people, the more you travel, the more places you add to your bucket list. So when the editors of the website Big 7 Travel announced the list of the world''s top 50 bucket list destinations, we stopped in our tracks and started checking off the boxes."
    ],
    [
        "The 55 Most Beautiful Places in the World",
        "From cloud forests to glacial lakes, these destinations are the world''s best sights to see."
    ],
    [
        "The 50 Most Beautiful Places in the World",
        "Time to dust off your passport."
    ],
    [
        "The 62 Most Beautiful Places in the World to Visit",
        "Pack your bags, we''re going!"
    ],
    [
        "World''s 30 Best Travel Destinations, Ranked",
        "The ultimate ranking of travel destinations aims to solve a serious problem: so many places to visit, so little time."
    ],
    [
        "18 Best Places to Visit in the World",
        "For more ideas on where to go and what to see, read our list of the top places to visit in the world."
    ]],
    [[
        "Los 20 lugares más fascinantes del planeta",
        "Destinos imprescindibles para auténticos viajeros"
    ],
    [
        "Los 17 lugares más fascinantes del mundo. ¡Descúbrelos!",
        "Por mucho que hayas viajado, estos 17 lugares más fascinantes del mundo que hemos elegido en Skyscanner te dejarán alucinado."
    ],
    [
        "Los 15 lugares del mundo que debes visitar al menos una vez en la vida",
        "En el top ten aparecen dos escenarios españoles: la Catedral-Mezquita de Córdoba, que a su vez ocupa el segundo puesto en el ranking europeo y el primero en el de España, y la Alhambra de Granada, en la octava posición mundial, cuarta de Europa y segunda nacional. A continuación te presentamos, por orden, los 15 mejores sitios del planeta. ¡No te los pierdas!"
    ],
    [
        "Los 25 mejores lugares del mundo para viajar en 2021",
        "¿Cuáles son los mejores lugares para viajar en 2021? Te damos la lista de los 25 sitios top para visitar el siguiente año, según los editores de Traveler de todo el mundo"
    ],
    [
        "¿Cuáles son los 28 mejores destinos del mundo para visitar en 2022?",
        "A medida que el turismo se reactiva en los diferentes puntos del mundo, pensar nuestras vacaciones ya no resulta un objetivo tan lejano. En este contexto, National Geographic compartió su lista anual de los mejores destinos y que -desde su mirada- se convertirán en los favoritos de 2022."
    ],
    [
        "Los 30 lugares más bonitos y fascinantes del mundo",
        "La verdad es que, al observarlos, son rincones y destinos bellísimos, capaces de dejarnos sin aliento. Misteriosos templos, paraísos naturales o pueblos coloridos y llenos de encanto forman esta lista de viajes que nos pone los dientes muy, pero que muy largos."
    ]]
  ]'),

  ('Travel & Leisure 2', 'Mexico', '["tl2-mex-eng.png", "tl2-mex-esp.png"]', '[
    [[
        "The Best Theme Parks in Mexico",
        "Some people travel to shop, others to eat, and some live to ride rollercoasters and tower over jungles on zip-lines. If the latter category fits you, then turn your eye to Mexico, where theme parks span the width of the country and will surely fulfil your adrenaline quota for the entire summer."
    ],
    [
        "Top 5 Water/Adventure Parks In Mexico",
        "If you would refer to yourself as an adrenaline junkie, then a trip to Mexico should be high up on your bucket list."
    ],
    [
        "12 Best Theme Parks in Cancun",
        "From waterslides that take you into crystal clear waters to zip-lining in the jungle, there are plenty of choices when it comes to the best things to do near Cancun."
    ],
    [
        "6 Awesome Eco Parks in Mexico",
        "Mexico''s Mayan Riviera is a hugely popular place to visit and for good reason. We all know about the world-famous white sand beaches and glistening turquoise colored water and the amazing Mayan ruins. But did you know there is a wide variety of eco parks in Mexico as well?"
    ],
    [
        "9 Best Amusement Parks in Mexico to Scream Out in Fun",
        "Welcome to the world of the best amusement parks in Mexico, including these Mexican water parks."
    ],
    [
        "The 12 best theme parks and amusement parks near Cancun",
        "Many of us love traveling on the Wanderlog team, so naturally we''re always on the hunt find the most popular spots anytime we travel somewhere new. With favorites like Ventura Park, Xcaret, and Garrafon Park - MX and more, get ready to experience the best places in Cancun."
    ]],
    [[
        "Los 6 mejores parques de diversiones en México",
        "Si eres de los apasionados por los parques de diversiones y buscas atracciones llenas de adrenalina, en esta nota te compartimos los 6 mejores parques de diversiones en México."
    ],
    [
        "10 Parques Temáticos en México para ir con los Niños",
        "La diversión en México está a la orden del día, una muestra de ello son los parques temáticos que tenemos para salir de vacaciones con la familia. ¡Se acerca Semana Santa!, así que te presentamos estos 10 parques temáticos ideales para viajar con los niños, desde ecoturísticos hasta parques de diversiones con atracciones que pondrán a mil por hora tu corazón y sentir la adrenalina correr por tu cuerpo. ¡Comenzamos!"
    ],
    [
        "Mejores parques temáticos de México",
        "Lo mejor de los parques temáticos es que la diversión está diseñada para público en general, sin importar edad ni género, permitiendo el disfrute en familia. Sin embargo, si existen parques dirigido más hacia un sector poblacional, en general, son bastante divertidos para todos. Es por esto que les mostraremos los mejores parques temáticos de México que debes visitar alguna vez en tu vida."
    ],
    [
        "Los mejores parques de atracciones en México",
        "Hay un tipo de diversión que conecta con casi todas las personas, que se extiende a todo lo largo y ancho del mundo. Los parques de atracciones son centros de ocio en los que podemos encontrar atracciones mecánicas, espectáculos, tematizaciones o experiencias."
    ],
    [
        "LOS 10 MEJORES PARQUES DE DIVERSIONES EN MÉXICO",
        "Un parque de diversiones o parque de atracciones, también conocido comúnmente como feria o parque temático, es un espacio en el cual se instala un gran número de construcciones utilizadas para el esparcimiento, la diversión, el tejido social y la convivencia, cualidades altamente valoradas por nosotros (Parques Alegres).Es por ello que aquí listamos los 10 mejores parques de diversiones en México, para que tengas más opciones al momento de elegir una actividad recreativa con tu familia, y ¿porque no? replicarla en tu parque. ¿Te imaginas una feria en el parque de tu colonia? ¿Suena bien no?"
    ],
    [
        "Los 5 Mejores Parques Temáticos en México",
        "México es un destino turístico por excelencia, y los parques temáticos no son la excepción. Si estás planeando un viaje al país, te invitamos a conocer los mejores parques temáticos de México, donde encontrarás diversión, adrenalina y emociones para toda la familia."
    ]]
  ]'),

  ('Travel & Leisure 2', 'US', '["tl2-us-eng.png", "tl2-us-esp.png"]', '[
    [[
        "The 17 Top Amusement Parks in the U.S. for 2023",
        "From exhilarating roller coasters to costumed characters, these parks offer fun for everyone."
    ],
    [
        "The best amusement parks in the U.S.",
        "The best amusement parks in the U.S. are filled with thrilling rides, tasty treats and plenty of fun for everyone"
    ],
    [
        "These 10 theme parks are the best in the country, according to USA TODAY 10Best readers",
        "North America is home to more than 400 amusement parks and attractions with some 375 million visitors annually, according to the International Association of Amusement Parks and Attractions. For those looking to plan the perfect vacation, trying to pick which park to visit can be overwhelming."
    ],
    [
        "25 Best Amusement Parks in the US to Visit in 2023",
        "Are roller coasters and theme parks what you are after for your next vacation? You are in luck, there are numerous amusement parks across the USA that have something for every thrill seeker."
    ],
    [
        "9 Best Theme Parks in the USA",
        "Theme parks in the USA are often regarded as must-visits for millions of travelers, young and old. These outdoor playgrounds often consist of thrilling rides, arcade games, and entertaining live shows, as well as larger-than-life characters from cartoons and fairy tales."
    ],
    [
        "34 Amazing Amusement Parks in America",
        "Lovers of adventure, thrills and excitement, do we have the Wanderlist for you! Unless you''ve been sleeping under a rock your entire life, you no doubt are well aware of Disneyland. Most kids aspire to one day visit this wondrous theme park but as adults we might be looking for something a little more than Mickey Mouse."
    ]],
    [[
        "Los 20 mejores parques de diversiones en Estados Unidos",
        "Hoy en Nómadas queremos contarte acerca de los mejores parques de diversiones en Estados Unidos que podrás encontrar, la magia te llenará en Magic Kingdom, subiremos a las montañas rusas más altas, armaremos un parque de diversiones con Legos y descubriremos los secretos del cine en estos parques de diversiones que no puedes dejar de visitar."
    ],
    [
        "15 mejores parques temáticos en Estados Unidos",
        "Los mejores parques temáticos en Estados Unidos pueden ser el toque perfecto para tus vacaciones. ¡Prepárate para unos días de mucha diversión y adrenalina! Los parques no sólo impresionan por sus atracciones sino también por la decoración y el ambiente que han diseñado en cada uno. Te harán sentir como si formarás parte de tus películas favoritas. ¿Quieres saber cuáles son los mejores parques temáticos de Estados Unidos? El país tiene más de 470, así que toma nota y elige tu favorito para el próximo viaje."
    ],
    [
        "Los 5 mejores parques de diversiones en Estados Unidos",
        "Los parques de diversiones en los Estados Unidos ofrecen entretenimiento para toda la familia. Por eso, este es uno de los destinos más buscados del mundo, especialmente cuando se trata de los parques temáticos de Disney, en Orlando. Así que, elegir el país americano para las próximas vacaciones te garantiza mucha diversión."
    ],
    [
        "Los mejores parques temáticos de Estados Unidos",
        "Más grande, más rápido, más emocionante. Estados Unidos es el país de los parques temáticos. Walt Disney World, en Orlando, es el parque temático más grande y visitado del mundo, y con Universal Studios, Six Flags o el mítico Coney Island, el país cuenta con una enorme gama de parques emocionantes y diversos. En este artículo vamos a contarte cuáles son los mejores parques temáticos de Estados Unidos."
    ],
    [
        "Los 10 mejores parques temáticos en Estados Unidos",
        "Los parques temáticos siempre serán una garantía de diversión en un viaje por Estados Unidos. Aunque estuvieron cerrados durante la pandemia, la mayoría ya están abiertos para recibir a las familias, pero ¿cuál es el mejor?"
    ],
    [
        "Los mejores parques de atracciones de Estados Unidos",
        "Si viajáis a Estados Unidos, debéis saber que los lugares que concentran la mayor diversión del país americano son sus variados parques de atracciones. Los hay de todas clases: temáticos, acuáticos, con un sinfín de montañas rusas… Visitar uno de estos mágicos parques es uno de los planes preferidos de las familias estadounidenses, así que te contamos cuáles son los mejores parques de atracciones de Estados Unidos. ¡Tomad nota!"
    ]]
  ]'),

  ('Travel & Leisure 2', 'International', '["tl2-int-eng.png", "tl2-int-esp.png"]', '[
    [[
        "20 Best Amusement Parks in the World",
        "Whether you''re a thrill-seeking solo traveler looking for the world''s most intense roller coasters or a family planning a magical vacation filled with fun for parents and kids alike, theme parks have something for everyone. From historic European destinations to record-setting parks in the Middle East, this list of the world''s best amusement parks highlights some of the most beautiful, thrilling, and downright fun spots to visit across the globe. Disney and Universal dominate the list with their famous theme parks in the U.S. and abroad, but regional options in far-flung destinations offer unique experiences, rides, and themes that you won''t find anywhere else."
    ],
    [
        "Best theme parks in the world",
        "From Ferrari World in Abu Dhabi to Cedar Point in the US — here''s where to get your thrills"
    ],
    [
        "100 Best Theme Parks in the World",
        "Looking to experience an injection of excitement and buzz? Discover our selection of the best theme parks in the world."
    ],
    [
        "The world''s best theme parks: our top 100",
        "Discover the most exciting theme parks across the globe, home to roller coasters, thrill rides and branded attractions."
    ],
    [
        "8 of the world''s best new theme parks",
        "As those of us in the Northern Hemisphere enjoy these last days of summer, many families are flocking to theme parks both in the US and abroad to squeeze in a few more moments of fun."
    ],
    [
        "A Guide to the Best Theme Parks Around the World Worth Travelling For",
        "Other than food, nature, and even historical landmarks, theme parks are an incredible addition to a country''s list of tourist attractions. They are a great place to spend time with your loved ones and even feed your inner child! Whether you''re looking for adrenaline-filled rides or fun shows and parades, here are the 28 best theme parks in the world to check out at least once in your lifetime."
    ]],
    [[
        "Los mejores parques de atracciones del mundo",
        "Divertidos, originales, emocionantes, espectaculares... Los parques de atracciones temáticos del mundo están listos para recibir a grandes y pequeños para hacerles disfrutar de toda la adrenalina. Estos espacios de esparcimiento logran una perfecta combinación entre entretenimiento y emoción gracias a su variedad de atracciones, para todos los gustos, su temática o sus espectáculos."
    ],
    [
        "Los mejores parques temáticos alrededor del mundo",
        "Da igual que tengas 7 ó 70 años. La emoción de visitar un parque de atracciones en familia nunca desaparece. Echa un vistazo a nuestros parques temáticos favoritos del mundo."
    ],
    [
        "Los 12 mejores parques temáticos del mundo",
        "Será por la adrenalina de las montañas rusas más espectaculares, o por la fantasía de los desfiles, o la magia de las mejores atracciones, pero lo cierto es que nadie dudaría en pasar una gran día en alguno de estos parques de atracciones"
    ],
    [
        "Los 7 mejores parques temáticos del mundo para viajar con niños",
        "Si queremos un viaje especial para toda la familia, los mejores parques temáticos del mundo son la opción más recomendable. Los más peques se divertirán de lo lindo y vivirán una experiencia muy especial, casi mágica."
    ],
    [
        "Los 10 mejores parques de atracciones del mundo",
        "En el mundo existen sensacionales parques de atracciones en los que el visitante puede disfrutar como un niño. En esta lista recogemos los 10 mejores parques de atracciones del mundo."
    ],
    [
        "Los mejores parques de atracciones alrededor del mundo para inyectar emoción a tus vacaciones",
        "Que fluya la adrenalina. De Tarragona a Dubái, pasando por Tarragona y París, estos son algunos de los parques temáticos más reputados del planeta."
    ]]
  ]'),

  ('Travel & Leisure 3', 'Mexico', '["tl3-mex-eng.png", "tl3-mex-esp.png"]', '[
    [[
        "Travel + Leisure Readers'' 25 Favorite Resorts in Mexico of 2023",
        "Readers chose accommodations in Mexico that offer spectacular scenery, delicious food, and a wealth of excursion options in our annual ''World''s Best Awards'' survey for 2023."
    ],
    [
        "12 of the Best All-inclusive Resorts in Mexico, According to Hotels.com",
        "Whether you''re planning a romantic getaway or a family vacation, all-inclusive resorts are ideal for a relaxing trip because (nearly) everything you''ll eat, drink, see, and do is covered by one price."
    ],
    [
        "15 Best All-Inclusive Resorts In Mexico You Must Visit",
        "If you''re looking for the best all-inclusive resorts in Mexico, then you''ve come to the right place? Mexico is the perfect place to go if you don''t want to travel too far. From most spots in the US, the flight to Mexico all-inclusive resorts isn''t terribly long."
    ],
    [
        "The 12 Best All-Inclusive Resorts In Mexico",
        "ith thousands of miles of coastline and world-famous beach towns bookending both sides of the country, Mexico regularly draws travelers from around the globe seeking sun, sand and relaxation."
    ],
    [
        "The 40 Best Resorts in Mexico: 2022 Readers'' Choice Awards",
        "Consider it a primer on where to go next—and how to get there. Here are the best resorts in Mexico, as voted by Traveler readers."
    ],
    [
        "The best hotels in Mexico according to the editors of Condé Nast Traveller",
        "Over the last few years a slew of new openings in Mexico has drawn attention away from Cancun''s supersized resorts and towards boutique stays with a focus on local artisans, design and sustainability. Now, some of the best hotels in Mexico are found beyond the typical tourist strips and in places like Tulum, the up-and-coming Zihuatanejo and in flourishing Mexico City – recently voted one of the best cities in the world."
    ]],
    [[
        "Forbes Travel Guide 2023: Estos son los mejores hoteles en México",
        "Cada uno de estos hoteles evaluados por Forbes Travel Guide tienen particularidades que harán de tu hospedaje un suelo hecho realidad."
    ],
    [
        "Los 10 mejores resorts de México para unas vacaciones en la playa",
        "Unas vacaciones inolvidables siempre necesitan el escenario ideal. La revista Travel + Leisure publicó la lista de los mejores resorts de México, los cuales fueron elegidos por sus lectores."
    ],
    [
        "2023 Mejores Resorts Todo Incluido en México",
        " Esto hace que los resorts todo incluido sean adecuados tanto para escapadas románticas como para vacaciones familiares. Es cierto que puedes encontrar resorts todo incluido en todo el mundo, pero nada se compara con México."
    ],
    [
        "Los mejores Resorts de México",
        "Si has elegido México como destino de vacaciones, ¡no te arrepentirás! Ahora sólo te queda escoger el tipo de alojamiento."
    ],
    [
        "10 Mejores Resorts Todo Incluido en México",
        "México es un destino vacacional popular que ofrece vacaciones con todo incluido que son las preferidas por los turistas a quienes les gusta saber cuánto costarán sus vacaciones por adelantado. Los viajeros deben consultar los servicios incluidos en la lista de servicios todo incluido, ya que éstos varían según el resort."
    ],
    [
        "Mejores resorts en México",
        "Cada año, la famosa revista de viajes Condé Nast Traveler realiza encuestas con sus lectores para encontrar los mejores hoteles, resorts, aerolíneas y cruceros a nivel mundial para los Condé Nast Traveler Readers'' Choice Awards, una lista extensa mostrando los servicios de viajes con las calificaciones más altas en una variedad de destinos internacionales."
    ]]
  ]'),

  ('Travel & Leisure 3', 'US', '["tl3-us-eng.png", "tl3-us-esp.png"]', '[
    [[
        "The 20 top tourist attractions in the USA",
        "Discover the top tourist attractions in the USA, from national-park essentials to iconic structures to must-see streets"
    ],
    [
        "25 Top Tourist Attractions in the USA",
        "As one of the largest and most diverse countries in the world, The United States boast an amazing amount of tourist destinations ranging from the skyscrapers of New York and Chicago, the natural wonders of Yellowstone and Alaska to the sunny beaches of California, Florida and Hawaii."
    ],
    [
        "24 Best Places to Visit in the United States",
        "With so much to see in this vast country, it can be difficult to know where to start when it comes to planning a trip in the United States. World-class cities, some known for history and others known for fun or glamour, give you a broad spectrum of places to choose from."
    ],
    [
        "The 100 Most Popular American Tourist Destinations",
        "There''s a whole big beautiful planet out there — but some of its most alluring attractions exist practically in America''s backyard."
    ],
    [
        "15 Places To Visit In USA That Reflect The Charm Of The Country",
        "The United States of America is the third largest country in the world by area. Within this vast country, there are a number of world-class cities and tourist attractions built by the gut and guile of the numerous immigrants that have landed on its shores."
    ],
    [
        "The 50 Best Tourist Attractions in the U.S.",
        "From national parks to iconic symbols of freedom and democracy, these popular and highly regarded U.S. tourist attractions cannot be missed."
    ]],
    [[
        "Las 50 atracciones turísticas más populares de Estados Unidos",
        "n mapa ilustrativo descubre el destino más visitado por los turistas en cada estado del país."
    ],
    [
        "50 lugares que no te deberías perder cuando puedas viajar a EEUU",
        "EEUU levanta las restricciones a partir del 8 de noviembre y es el momento de volver a ese apasionante país tras la pandemia del Covid. Te contamos cuáles son los requisitos."
    ],
    [
        "25 imprescindibles que visitar en Estados Unidos",
        "Tras dos largos viajes por Estados Unidos, hemos conocido montones de sitios increíbles que quedarán para siempre en nuestro recuerdo."
    ],
    [
        "12 Mejores Lugares Turísticos en Estados Unidos",
        "El país del norte es en el que se comen más de 40 hectáreas de pizza al día y ¡hasta 120 toneladas de aguacate, para guacamole, durante el Super Bowl! Así que no sería extraño que la variedad de lugares turísticos en Estados Unidos sea inmensa. También podrás encontrar desde increíbles parques temáticos, hasta un gran cañón con una de las vistas más impresionantes que podrás conocer."
    ],
    [
        "11 lugares emblemáticos de Estados Unidos que no te puedes perder",
        "Desde la popular escultura Cloud Gate (Puerta de la nube) de Chicago al futurista Gateway Arch (arco Gateway) en St. Louis, Estados Unidos está lleno de oportunidades para tomar fotos icónicas que te permitan decir con orgullo: “Estuve allí”. Así que saca tu lista de cosas por hacer antes de morir y prepara el bastón para selfis; los emblemáticos Estados Unidos te están esperando."
    ],
    [
        "Las 50 atracciones turísticas más populares de EE.UU.",
        "Finalmente ha llegado el día más esperado por miles de turistas de todo el mundo: EE.UU abre de nuevo sus fronteras este lunes, 8 de noviembre, tras 18 meses de cierre total por culpa de la pandemia."
    ]]
  ]'),

  ('Travel & Leisure 3', 'International', '["tl3-int-eng.png", "tl3-int-esp.png"]', '[
    [[
        "Worst-rated tourist sites across the globe revealed: ''grubby'' US spot tops list",
        "You might want to take a peek at this list before planning your next vacation."
    ],
    [
        "Worst Places to Travel in 2023",
        "Traveling is one of the most enriching experiences one can have, but not all destinations are worth seeing. While some places are a feast for the senses, others can be a nightmare for even the most experienced traveler."
    ],
    [
        "Worst Travel Destinations In The World - Negative Side Of Travel",
        "Are you sick to death of posts about ''The Best Places To Visit'' clogging up your news feed?"
    ],
    [
        "The 22 Most Dangerous Tourist Destinations in the World",
        "The world is full of fascinating places that attract tourists in their droves. There is a lot of variety in these destinations, from tropical paradises to mountainous peaks, and they attract people ranging from sunseekers to thrill-seekers."
    ],
    [
        "The 10 Most Dangerous Places To Travel To Around the Globe",
        "International travel is as easy as packing a suitcase and hopping on a plane, allowing people to explore countries all over the world with ease. While there''s always a degree of risk involved – the same as you''d experience in your own city – there are some places that tourists tend to avoid due to war, unrest, and crime."
    ],
    [
        "Worst Travel Destinations You Should Avoid",
        "It''s a wide wide world filled with countless wonders — and you''ll never get to see them all. Because of this sad reality, travelers need to be intentional with the places they visit. "
    ]],
    [[
        "Los 15 peores destinos para un turista",
        "Estos destinos representan algunos de los lugares considerados como los peores para los visitantes debido a la inseguridad, los conflictos políticos y la falta de infraestructura turística."
    ],
    [
        "Peores destinos del mundo para viajar",
        "Además, os los presento clasificados ya que hay motivos diversos por los que estos destinos deberían estar fuera de vuestras agendas."
    ],
    [
        "Estos son los 10 peores destinos para un turista, según una viajera que ha visitado todos los países del mundo",
        "According to the youngest traveler in the world to win the Guinness Prize for traveling to each and every country in the world, planning a vacation is not trivial and she confesses that there are some places in the world that she would not recommend to any tourist due to their inaccessibility, because of their insecurity, or because of the risk of being murdered."
    ],
    [
        "LOS 10 PEORES LUGARES PARA VISITAR",
        "Hay lugares que jamás figuran en ninguna guía de viaje y que sólo escuchamos, quizá, en el GPS como zona a evitar. Son rincones feos, peligrosos o definitivamente indignos del mundo, donde la belleza brilla por su ausencia y ningún turista desea adentrarse."
    ],
    [
        "DESTINOS DE ALTO RIESGO: LOS 20 PAÍSES MÁS PELIGROSOS DEL MUNDO PARA VIAJAR EN 2023",
        "La lista que conviene revisar con los países a los que se aconseja no viajar para evitar ponerse en peligro."
    ],
    [
        "Los 10 países más peligrosos para los turistas",
        "Hay muchos destinos turísticos que son altamente atractivos, sin embargo, también suponen un riesgo y es mejor estar al tanto."
    ]]
  ]'),

  ('Travel & Leisure 4', 'Mexico', '["tl4-mex-eng.png", "tl4-mex-esp.png"]', '[
    [[
        "Hiking In Mexico - 9 Top Trails For Hiking Enthusiasts",
        "If you''re going to Mexico to experience the rich culture and delicious food, then why not take a journey through the remarkable landscapes it has to offer."
    ],
    [
        "Hiking in Mexico (13 Best Hikes + 5 Tips for 2023)",
        "Hiking in Mexico is one of the most underrated things to do in a vibrant country. Most tourists venture down south to lounge on a sun-kissed beach or indulge in the delicious flavors of Mexican street food. Yet, many never even wonder what a journey through the Mexican backcountry is like."
    ],
    [
        "These Are the Best Hikes in Mexico",
        "Mexico makes for an ideal hiking destination - it has a number of excellent mountain ranges and (generally) ideal weather, which more than make up for the often brutal altitude issues posed by the country''s capital, Mexico City. The best time to hike in this North American country is during the dry season, from October to April, when you can expect temperate weather and the opportunity for some truly epic hiking trail experiences."
    ],
    [
        "The 6 best hikes in Mexico to explore volcanoes, canyons and ghost towns",
        "Home to tropical beaches, pre-Columbian ruins and some of the world''s most celebrated cooking, Mexico has long captivated visitors. Its hiking trails, however, remain little known, which is great news for those eager to experience the nation''s diverse scenery without the crowds."
    ],
    [
        "Top Hiking Spots in and near Mexico",
        "Looking for the best hiking in Mexico? We''ve got you covered with the top trails, trips, hiking, backpacking, camping and more around Mexico. The detailed guides, photos, and reviews are all submitted by the Outbound community."
    ],
    [
        "5 Best Hikes in Mexico for the Active Traveler",
        "Mexico offers all types of active adventures. Beaches, jungles, mountains, vibrant cultures, ancient sites, modern cities, nightlife and more—Mexico offers it all."
    ]],
    [[
        "Las mejores rutas en México",
        "¿Listo/a para descubrir los mejores itinerarios en México para practicar senderismo, ciclismo de montaña, mochilear y otras actividades al aire libre? AllTrails tiene 8.303 rutas de senderismo, de BTT, para mochilear y mucho más. Descubre mapas de rutas cuidadosamente seleccionadas, junto con reseñas y fotos de otros apasionados de la naturaleza como tú."
    ],
    [
        "Guía de lugares para hacer hiking cerca de la CDMX",
        "Si te gusta el contacto con la naturaleza pero los parques urbanos ya te quedan muy chicos, date una vuelta a estos sitios cerca de la CDMX para una buena dosis de senderismo"
    ],
    [
        "9 increíbles rutas de Senderismo en México",
        "México por su gran biodiversidad a lo largo y ancho del país, permite realizar diversas actividades al aire libre y hacer Senderismo en México por diversos rincones del país debido a la gran cantidad de montañas, volcanes, desierto, cañones y sierras donde puedes internarte y descubrir los paisajes mágicos de montaña para escalar, hacer trail running, espeleo, montañismo, escalada en roca, cañonismo, acampar, bici de montaña o fotografía de naturaleza entre otras actividades de montaña."
    ],
    [
        "Conoce México a través de las mejores rutas para hacer senderismo",
        "Es momento de reconectar con la naturaleza con estas increíbles rutas para realizar senderismo en nuestro país de la zona Centro Occidente ¡Descúbrelas!"
    ],
    [
        "Senderismo en México",
        "Antes de platicarte los lugares para hacer senderismo en CDMX, nos gustaría acercarte al concepto de Senderismo y sus tipos."
    ],
    [
        "Las rutas, volcanes y montañas más increíbles para hacer hiking en México",
        "¿Fanático de hiking? En México hay rutas para todos los niveles y estilos y vas a querer visitarlas todas."
    ]]
  ]'),

  ('Travel & Leisure 4', 'US', '["tl4-us-eng.png", "tl4-us-esp.png"]', '[
    [[
        "The 10 Best Hikes in the USA For Every Type of Adventurer",
        "I''ve hiked all over the world, and mile for mile, the USA has the best hiking out of anywhere I''ve ever been."
    ],
    [
        "The Best Hikes in the U.S. From Maine to California",
        "Explore the great outdoors at these hiking areas across the U.S."
    ],
    [
        "24 BEST HIKES IN THE USA TO ADD TO YOUR BUCKET LIST",
        "We''ve been writing a lot about hiking all around the United States this past year, so we thought it was high time we round up all of the best hikes in the United States in one place. We love creating a bucket list of experiences. Wouldn''t it be cool to be able to say you''ve conquered all of these amazing trails? People might be staying closer to home for the next couple of years as the world figures itself out, so why not start exploring all of these great outdoor destinations in the USA."
    ],
    [
        "Best Hiking Places in the USA",
        "The United States has some of the best hiking trails in the world. Such a vast country, with some of the world''s most iconic national parks, there are countless incredible hiking destinations in the U.S."
    ],
    [
        "25 BEST Hiking Trails in the USA (2023)",
        "There are literally hundreds of thousands of hiking trails in America; every state has a seemingly endless variety of amazing routes to discover, so you can imagine how difficult it is to narrow down a list to the 25 best hikes in the US."
    ],
    [
        "12 Best Hikes In The USA",
        "The United States is a pretty diverse and vast country to visit. And, you know what, that''s what makes it so special. It has a huge mix of the best hikes in the USA that are dotted all across the country. From the eastern rugged shorelines to the rolling great plains, there''s a huge mix of different landscapes and climates that make for some of the best hikes in the USA."
    ]],
    [[
        "Los 5 mejores lugares para hacer senderismo en los EE. UU.",
        "Si te encanta el senderismo, el extremo este de Long Island tiene algunos lugares fantásticos para hacer senderismo. Algunos de los mejores lugares para caminar se encuentran en Jones Beach, una de las playas más populares de Nueva York. Se puede llegar a estos lugares de caminata a través de Long Island Expressway, y es mejor conducir durante el mediodía de lunes a viernes."
    ],
    [
        "Los 10 mejores trekkings en Estados Unidos",
        "Estados Unidos es la meca de las parques nacionales. Desde la apertura de parque nacional de Yellowstone a finales del siglo XIX, la práctica del senderismo y el alpinismo en el país norteamericano ha sido muy difundida y el gobierno ha cuidado con esmero las rutas, el paisaje y la fauna de sus reservas naturales."
    ],
    [
        "Las 14 mejores rutas de trekking en Norteamérica",
        "América del norte ofrece algunos de los mejores trekkings del mundo y recibe cada año a miles y miles de amantes del trekking. Existen numerosos parques nacionales» en los que todo el mundo puede disfrutar de los recorridos y de sus auténticos paisajes."
    ],
    [
        "10 de las mejores rutas de senderismo de Estados Unidos",
        "Estados Unidos es famoso por la gran cantidad de rutas de senderismo que tiene, algunas dentro de sus parques nacionales. Si tienes un espíritu aventurero y amas la naturaleza, entonces esta selección de 10 de las mejores de ellas es el inicio perfecto para ti. - Texto: Maribel Barros"
    ],
    [
        "Senderismo en Estados Unidos",
        "87 rutas de senderismo en Estados Unidos"
    ],
    [
        "Desde California hasta Hawái: cinco increíbles lugares para hacer hiking en los Estados Unidos",
        "El país norteamericano es ideal para andar sin rumbo preciso, o, por el contrario, pasear y explorar distintas rutas y senderos salvajes. Cuáles son algunos de los más apasionantes"
    ]]
  ]'),

  ('Travel & Leisure 4', 'International', '["tl4-int-eng.png", "tl4-int-esp.png"]', '[
    [[
        "20 BEST DAY HIKES IN THE WORLD (+ MAP & PHOTOS)",
        "Where can you go to find that perfect day hike? The hike that leaves you breathless as you climb the summit of the mountain. The hike with the awe-inspiring views. The hike that is so enjoyable because the terrain and its views are always changing. The hike that has you saying “Wow!” over and over again. The hike that looks great in photos but is even better once you are actually there. The hike that you hope to do again someday. Here is our list of the best day hikes in the world."
    ],
    [
        "The 16 best hikes in the world",
        "Get out and immerse yourself in all the maginfience nature that planet Earth has to offer."
    ],
    [
        "The Ten Most Beautiful Hikes in the World",
        "Our trails columnist has hiked thousands of miles. These are the routes at the top of his bucket list. Thrill yourself with a trip to an amazing trail this year."
    ],
    [
        "23 of the world''s best hiking trails",
        "From a multi-day trek tracing the routes of a Japanese poet, to a classic clamber in the Argentinian Lake District, there are thousands of incredible trails that allow us to get up close to nature."
    ],
    [
        "50 Best Hikes in the World to Put on Your Bucket List",
        "There''s nothing like getting out and getting some fresh air on a gorgeous hike. No matter if your idea of a hike is a leisurely walk along the coast of Italy or climbing the highest mountain on Earth, we''ve got you covered. Below are the best hikes in the world."
    ],
    [
        "THE 21 BEST HIKES IN THE WORLD",
        "THE BEST LONG-DISTANCE HIKES IN THE WORLD, HAND PICKED BY OUR HIKING EXPERTS"
    ]],
    [[
        "Las 20 mejores rutas de senderismo alrededor del mundo",
        "¿Cansado de recorrer el mismo camino? Sal de tu zona de confort y viaja hasta uno de estos inspiradores destinos."
    ],
    [
        "10 parques con increíbles senderos para caminar",
        "Descubre a pie los paisajes más espectaculares de Estados Unidos."
    ],
    [
        "10 de los mejores lugares del mundo para caminar durante una semana",
        "Para vivir la verdadera naturaleza salvaje es necesario alejarse de todo. Aquí tienes algunas de las mejores excursiones de senderismo de varios días del planeta."
    ],
    [
        "Las 10 mejores caminatas del mundo 2022 - 2023",
        "Un recorrido de trekking es una oportunidad para que los amantes de la naturaleza hagan realidad sus sueños. Te hace descubrir la majestuosidad de las montañas y te deja sin aliento mientras subes a la cima de la montaña. Caminar entre los gigantes de la naturaleza revela una sensación de libertad que proviene del mundo digital."
    ],
    [
        "11 lugares perfectos para practicar senderismo alrededor del mundo",
        "Once destinos populares para practicar senderismo alrededor del mundo, desde el sendero de los Apalaches hasta Mont Blanc."
    ],
    [
        "Los ''trekkings'' más bellos del mundo",
        "Hay muchas rutas clásicas para los senderistas, unas más difíciles que otras, unas más largas que otras... pero hay algunas que destacan sobre todas las demás: son las que discurren entre paisajes excepcionales, cimas extraordinarias y además ofrecen algunas pinceladas de color local. En estas 12 rutas seleccionadas es imprescindible llevar cámara de fotos en la mochila."
    ]]
  ]'),

  ('Food 1', 'Mexico', '["f1-mex-eng.png", "f1-mex-esp.png"]', '[
    [[
        "64 Authentic Mexican Food Recipes",
        "Authentic Mexican food is more than tacos and salsa. Check out our favorite Mexican dishes: churros, elote, barbacoa, posole and more. From drinks to dessert, there are so many Mexican recipes to dive into!"
    ],
    [
        "45 Fresh & Tasty Mexican Recipes!",
        "Whether you are celebrating Cinco De Mayo or are having a simple family gathering at home, here are 45 Best Mexican Recipes to create the perfect Mexican Feast. Packed full of healthy veggies with authentic flavors, pick out a few to try this week!"
    ],
    [
        "42 Mexican recipes for your weekend fiesta",
        "Level up your next Taco Tuesday with these 42 easy Mexican recipes. From classic nacho bowls to enchiladas, these tasty dishes will transform your next Mexican meal into a full blown fiesta."
    ],
    [
        "The 40+ BEST Mexican Recipes",
        "Mexican food… The cuisine that most of us can dig in to with gutso any day… any time … all the time. I mean, can we really get tired of all those fresh, zingy, zesty flavors in perfectly seasoned meals? I say that''s doubtful."
    ],
    [
        "Authentic Mexican Recipes and Dishes",
        "Mexico in my Kitchen''s mission is to show to the world the richness of México''s centennial culinary art. Traditional Mexican cuisine is a comprehensive cultural model comprising farming, ritual practices, age-old skills, culinary techniques, ancestral community customs, and manners. It is made possible by collective participation in the entire traditional food chain: from planting and harvesting to cooking and eating."
    ],
    [
        "70 Recipes for Traditional (& Not-So-Traditional) Mexican Foods",
        "Learn how to make all your restaurant favorites at home."
    ]],
    [[
        "Recetas tradicionales de la cocina mexicana",
        "Explora cientos de recetas mexicanas 100% auténticas con fotos e instrucciones paso a paso fáciles de preparar. ¡Cocina deliciosos platos tipo restaurante preparados desde la comodidad de tu casa!"
    ],
    [
        "Las mejores recetas de cocina mexicana",
        "México cuenta con una de las gastronomías más apreciadas. Indagamos en las recetas de la cocina mexicana en busca de la receta de los tacos, el guacamole, la cochinita pibil y mucho más."
    ],
    [
        "Nueve recetas que debes dominar para celebrar una cena mexicana en casa",
        "Una de las cosas que más me gustan es reunirme con la familia o con los amigos y organizar una cena temática, para salirnos de las recetas rápidas de cena de siempre. Si quieres darle ambiente prepara música de rancheras y corridos porque te vamos a contar nueve recetas que debes dominar si quieres hacer una cena mexicana en tu casa."
    ],
    [
        "20 RECETAS DE COMIDA MEXICANA FÁCILES",
        "No saber qué hacer de comer nos pasa a todos, por lo que tener a la mano 20 recetas de comida mexicana fáciles te vendrá muy bien para salir de apuros, tener muchas ideas a la hora de entrar a la cocina y descubrir que ese platillo que siempre te ha encantado es muy sencillo de hacer."
    ],
    [
        "100 RECETAS DE COMIDA MEXICANA QUE DEBES PROBAR ANTES DE MORIR",
        "Las recetas de comida mexicana son de las mejores del mundo, así que hacer una lista con sus 100 mejores platos es absolutamente lógico."
    ],
    [
        "10 recetas de comida mexicana que no podes perderte!",
        "Bienvenidos a Paulina Cocina! El año pasado estuve en México visitando amigos y familia y quedé atrapadísima con la cultura, con la gente, con los lugares, pero por sobre todas las cosas: con la comida mexicana! En este post voy a enumerar las diez comidas mexicanas que no pueden dejar de probar de ninguna manera si van a México."
    ]]
  ]'),

  ('Food 1', 'US', '["f1-us-eng.png", "f1-us-esp.png"]', '[
    [[
        "The 99 Most American Recipes Ever",
        "We Americans love our burgers, taco salad and good ol'' apple pie. But what''s on the menu in your neck of the woods? We crossed the country to find the most American recipes of all time."
    ],
    [
        "The 45 BEST American Recipes",
        "America is such a big country, home to immigrants from all over the world. It''s no wonder, then, that it features such a big variety of food."
    ],
    [
        "30 Classic American Recipes We Love",
        "From grilled cheese and burgers to cheesecake and apple pie, these classic American recipes are irresistible."
    ],
    [
        "American Recipes",
        "From potato salad, burgers, and meatloaf, to donuts and mac and cheese, these are the classic American recipes we come back to over and over again."
    ],
    [
        "American recipes",
        "Get inspired by Stateside favourites, from burgers and hotdogs to pancakes and pies."
    ],
    [
        "11 Traditional American Food Recipes",
        "These dishes are as American as baseball and recipe #9."
    ]],
    [[
        "Las mejores recetas de cocina estadounidense",
        "Un repaso culinario por el recetario de los Estados Unidos, un país con mucho más que ofrecer en la mesa además de fast food: entrantes, platos principales y postres protagonistas en el país de la bandera de las barras y estrellas."
    ],
    [
        "Las 13 mejores recetas de platos estadounidenses o norteamericanos",
        "La cocina americana no es precisamente una cocina famosa por sus notas gourmet, pero indudablemente ha conseguido introducirse en todos los lugares del mundo con sus recetas más populares. Por ese motivo hoy queremos enseñaros las 13 mejores recetas de platos estadounidenses o norteamericanos, que sin duda disfrutaréis."
    ],
    [
        "16 recetas tradicionales de Estados Unidos de América o Norte América",
        "El cuarto jueves de noviembre se celebra en Estados Unidos, el Día de Acción de Gracias, festividad donde familiares y amigos se reunen alrededor de una mesa para cenar un gran banquete, platos tradicionales con ingredientes originarios de los indios nativos. Una cena bastante parecida a la que preparan también en Navidad."
    ],
    [
        "6 de los mejores chefs de Estados Unidos comparten las recetas de sus especialidades",
        "Ideas fáciles y deliciosas para prepararlas en casa, y que gustan a todos."
    ],
    [
        "10 comidas típicas de Estados Unidos: ingredientes, recetas y preparación",
        "Encuentra aquí los ingredientes y preparación de las comidas típicas más famosas de Estados Unidos y de aquellas que serán una grata sorpresa para tu paladar."
    ],
    [
        "Antójate con las 10 comidas típicas de Estados Unidos",
        "Acá te contamos algunas de las comidas más representativas de Estados Unidos."
    ]]
  ]'),

  ('Food 1', 'International', '["f1-int-eng.png", "f1-int-esp.png"]', '[
    [[
        "95 International Recipes to Make When You''re Craving Global Cuisine",
        "Travel around the world without leaving your kitchen with these international recipes. From Canada to Australia, Nigeria to Brazil—and everywhere in between."
    ],
    [
        "38 Comfort Food Recipes From Around the World",
        "Travel may be off the table, but you can still eat your way around the world without leaving home. Whether you are in need of a little self-care in a bowl, want to experience new tastes, or are simply looking for creative weeknight dinner ideas, these comfort foods are sure to do the trick. We scouted cuisines and cultures around the globe to include soothing soups, meaty mains, plant-powered plates, and more to deliver warm and fuzzy vibes. From cheesy Mexican enchiladas, French-Canadian poutine, and West African peanut butter soup, we''ll take you on a culinary adventure with each of these international recipes."
    ],
    [
        "24 mind-blowing recipes from around the world",
        "From cheesy Mexican nachos and classic butter chicken to rich Italian ragu, these recipes are guaranteed to take you on an unforgettable culinary adventure."
    ],
    [
        "44 Recipes That Will Let You Eat Around The World While Quarantining",
        "With travel off limits, you may be experiencing some major wanderlust. And while you can''t hop on a plane right now, you can make a delicious dinner inspired by different cuisines and cultures around the world. Here are 40 recipes to taste your way around the world without leaving the house."
    ],
    [
        "117+ Traditional Foods From Around The World: Recipes for Best Dishes",
        "Welcome to The Storied Recipe, a community that harnesses the power of food to tell stories, preserve cultural heritage, and remember those that loved us through their cooking."
    ],
    [
        "30 Traditional Foods From Around The World",
        "Devour your foodie bucket list with these traditional foods from around the world. Visit everywhere from England to Thailand with these easy and tasty meals."
    ]],
    [[
        "La vuelta al mundo en 20 recetas",
        "Uno de los mayores placeres cuando tenemos la suerte de realizar un viaje a lo largo de los distintos países del mundo es poder disfrutar de su gastronomía. Conocer nuevas culturas, ingredientes desconocidos para nosotros y preparaciones diferentes a las que estamos acostumbrados, se convierte en uno de los objetivos para los viajeros que como a mí nos gusta la cocina estemos donde estemos."
    ],
    [
        "Las mejores recetas de cocina internacional",
        "Platos de cualquier rincón explicados en detalle, cocina las recetas perfectas para dar la vuelta al mundo de los sabores y disfrutar de todas las gastronomías internacionales y sus secretos."
    ],
    [
        "Vuelta al mundo en 20 comidas: Descubrí los secretos culinarios de diferentes culturas",
        "Una de las cosas que más extrañamos como viajeros es incursionar en los platos típicos de los lugares que recorremos, degustar sabores nuevos, descubrir nuevos ingredientes y volver a casa con nuevas recetas y comidas para hacer. Ya te hemos contado en otros posts sobre algunos platos típicos que deberías probar en Perú, Brasil o Barcelona así que hoy te proponemos que disfrutes de la comida internacional desde casa. Aprovechar el tiempo libre que tenemos para probar hacer con nuestras manos los mejores platillos gourmet del mundo. ¿Te animás a dar la vuelta al mundo en 20 comidas?"
    ],
    [
        "Los 20 mejores platos tradicionales del mundo: solo hay uno español",
        "Para despedir el año, la guía de viajes Taste Atlas ha llevado a cabo un ranking gastronómico, en el que han evaluado los platos típicos de cada país del mundo. China, Turquía, Polonia o Perú son algunos de los países que aparecen en la lista, aunque también una tapa española ha conseguido entrar en el Top 20."
    ],
    [
        "Las 10 comidas más ricas y populares del mundo",
        "Probablemente sea uno de los desafíos más grandes que el hombre se haya impuesto: circunscribir los platillos del mundo entero a un número tan limitado y escueto. De todas maneras, hay algunos clásicos que han traspasado las fronteras de su tierra natal para convertirse en las comidas favoritas de la mayoría de la población mundial."
    ],
    [
        "Las 32 mejores comidas del mundo para probar al menos una vez en la vida",
        "Algunos de los platos y creaciones más deliciosas provienen de mercados al aire libre, mientras que otros se sirven en restaurantes icónicos con estrellas Michelin. La lista de los imprescindibles para los amantes de la comida"
    ]]
  ]'),

  ('Food 2', 'Mexico', '["f2-mex-eng.png", "f2-mex-esp.png"]', '[
    [[
        "Celebrating Day of the Dead With a Spread of Beloved Recipes",
        "Mexico''s Dia De Los Muertos (Day of the Dead) celebrates loved ones who have passed. Some families put together an ofrenda, an altar created in their honor, featuring photographs and the deceased''s favorite foods and drinks. Other families picnic at the burial sites of their loved ones. “When you travel to the cemetery to feast and celebrate the lives of your ancestors,” Mexican Chef Tello Carreon (formerly of Nixta in St. Louis) says, “It''s an experience you don''t really forget.”"
    ],
    [
        "40 Lively Recipes to Celebrate Day of the Dead",
        "Día de los Muertos is a colorful celebration of life and like most Mexican holidays it includes a festive spread of food and drinks. To celebrate, I''ve put together a collection of recipes from a few of my favorite bloggers — some are time-honored and traditional while others are contemporary interpretations of classic recipes. Needless to say, there''s a little something for everyone to join in on the fun this Day of the Dead."
    ],
    [
        "25 Easy Day of the Dead Recipes",
        "The countdown is on for Day of the Dead in Mexico! This collection of delicious Day of the Dead food recipes is sure to inspire you to host your own Día de Los Muertos gathering for family and friends."
    ],
    [
        "25 Day Of The Dead Food And Recipes To Die For!",
        "Get ready for Día de Los Muertos festivities by stocking up on these fantastic Day of the Dead food ideas! This unique celebration is not spooky but a time to honor the deceased, full of joy and color. And like many other holidays, food plays a huge role in the Day of the Dead celebrations. People prepare altars full of ofrendas (offerings), placing marigolds, sugar skulls, and delicious food as a tribute to loved ones that have passed. So I decided to compile some creative Day of the Dead recipes to give this year''s Día de Los Muertos celebrations a fun twist!"
    ],
    [
        "Day of the Dead Recipes",
        "Treat your family and friends to some spectacular-looking treats and snacks that celebrate Dia de Los Muertos. These Day of the Dead recipes will bring joy to anyone who eats them."
    ],
    [
        "Day of the Dead Recipes",
        "El Día de los Muertos, or Day of the Dead, is one of the most important and colorful celebrations in Mexico. Far from a sad or scary occasion, Muertos is a festive family commemoration of loved ones who have passed on, with homages and tributes in all households and major public places. As with any party, food plays a major role."
    ]],
    [[
        "Recetas para el Día de Muertos",
        "En RecetaGratis nos unimos a esta celebración tan especial ofreciéndote nuestras mejores recetas para el Día de los Muertos, donde se incluyen los platillos mexicanos más tradicionales de esta fecha junto con algunas sugerencias algo más novedosas, pero siempre gustosas y distinguidas."
    ],
    [
        "10 platillos para preparar en Día de Muertos",
        "Cinco de nuestros expertos te ofrecen sus más deliciosas recetas para halagar tanto a vivos como a difuntos durante esta fecha de gran arraigo y tradición en nuestro país. ¡Anímate a cocinarlas!"
    ],
    [
        "Recetas para día de los muertos",
        "El Día de los Muertos (o de los Santos Difuntos) es una de las tradiciones mexicanas más queridas. El recordar a tus amados familiares y amigos que han partido es a la vez un acto de consuelo y de hermosos recuerdos. En esta colección que hemos preparado especialmente para este día tan especial, encontrarás comida casera, recetas mexicanas muy tradicionales, postres y hasta bebidas calientes que sabemos encantarán a tus muertitos... y a los vivos también."
    ],
    [
        "RECETAS PARA EL DÍA DE MUERTOS",
        "En México, el Día de Muertos se celebra el 1 y 2 de noviembre. Es una fecha en la que se recuerda a los difuntos y se les rinde homenaje a través de altares y ofrendas, las cuales se adornan con flor de cempasúchil, velas, papel picado, calaveritas de azúcar, agua, sal, copal, pan de muerto y los platillos favoritos del ser querido que ha partido."
    ],
    [
        "Recetas Día de Muertos",
        "Sabemos que no hay nada más rico que un pan de muerto acompañado de un chocolate caliente, prepáralo en casa con las mejores recetas que le darán variedad al pan consentido de todos."
    ],
    [
        "20 recetas tradicionales para ofrenda de Día de muertos",
        "Porque las delicias tradicionales nunca fallan, ¡prepara estas deliciosas recetas para Día de Muertos!"
    ]]
  ]'),

  ('Food 2', 'US', '["f2-us-eng.png", "f2-us-esp.png"]', '[
    [[
        "Top 10 Thanksgiving Recipes",
        "From a top-rated turkey to legendary side dishes and desserts, cook our best Thanksgiving recipes for your family this holiday season."
    ],
    [
        "TOP 10 THANKSGIVING RECIPES",
        "If it''s your year to host Thanksgiving dinner, you can''t go wrong with any of these recipes. They are the dishes you expect to see on the table every holiday!"
    ],
    [
        "Our 10 Most-Popular Thanksgiving Sides",
        "Looking for a delicious side dish to serve at your Thanksgiving feast? We have you covered. Count down through our top 10 Thanksgiving sides — from Ina Garten, Bobby Flay, Giada De Laurentiis, our test kitchen and more."
    ],
    [
        "I Made 10 Of The Most Popular ''Miracle'' Thanksgiving Recipes On The Internet — Here''s What I Thought Of Each",
        "Instant Pot turkey with gravy, air fryer apple fritters, and everything in between."
    ],
    [
        "The 10 Most Popular Thanksgiving Dishes",
        "From roast turkey to potato recipes to endless side-dishes and mouthwatering Thanksgiving pies, there''s no shortage of choices when it comes to planning your Thanksgiving menu."
    ],
    [
        "Top 10 Must-Have Thanksgiving Side Dishes",
        "We''re counting down our top 10 Thanksgiving side dishes (you''ve got to try #1!)."
    ]],
    [[
        "¿Qué se come en Thanksgiving? | 12 platos de acción de gracias",
        "Thanksgiving o Acción de gracias es un festejo americano. ¡Echa un vistazo a estos 12 platos típicos de este día que te harán la boca agua!"
    ],
    [
        "LAS 10 MEJORES RECETAS DE ACCIÓN DE GRACIAS",
        "RECETAS DE ACCIÓN DE GRACIAS MÁS POPULARES"
    ],
    [
        "15 recetas de Acción de Gracias clásicas y asequibles",
        "¿Hay mejor día festivo que el Día de Acción de Gracias? No hay que preocuparse por hacer regalos ni comprar disfraces, y la comida tan querida es sorprendentemente asequible."
    ],
    [
        "10 PLATILLOS QUE NO PUEDEN FALTAR EN TU CENA DE DÍA DE ACCIÓN DE GRACIAS",
        "Prepara la mejor cena de Día de Acción de Gracias con estas recetas fáciles y deliciosas que no pueden faltar en tu mesa."
    ],
    [
        "Los 12 platos más populares de Acción de Gracias, clasificados",
        "El plato de acción de gracias más popular es..."
    ],
    [
        "Las 10 mejores recetas de Acción de Gracias",
        "Desde un pavo de primera hasta guarniciones y postres legendarios, cocine nuestras mejores recetas de Acción de Gracias para su familia en estas fiestas."
    ]]
  ]'),

  ('Food 2', 'International', '["f2-int-eng.png", "f2-int-esp.png"]', '[
    [[
        "12 Amazing Christmas Recipes From Around The World",
        "Christmas is almost here so I have a little present for you, guys. 12 amazing, colorful, and creative Christmas Recipes From Around The World! Everything from desserts and drinks to main dishes!"
    ],
    [
        "16 festive recipes from around the world",
        "Looking for new Christmas dinner ideas to bring some fresh flavours to your plate? Branch out this Christmas and start some new traditions, starting with the dinner table and our festive recipes from across the globe."
    ],
    [
        "21 Christmas food traditions from around the world",
        "From Australia to France, we''ve rounded up some of the most traditional treats served around the world during the festive period..."
    ],
    [
        "Christmas Recipes",
        "Here are some Christmas Recipes from around the world for you to try."
    ],
    [
        "15 Christmas dishes from around the world",
        "Your festive meal needn''t be the classic British roast this year. Why not try a spicy stew or smoked meat? Explore Christmas culinary celebrations from Puerto Rico to Poland in our roundup of festive dishes from every corner of the globe."
    ],
    [
        "19 Christmas Dinners from Around the World",
        "From fast food to a seven-course feast, here''s what Christmas dinner looks like around the globe."
    ]],
    [[
        "Recetas navideñas alrededor del mundo",
        "Viajar puede ser una necesidad pero también es un placer y una verdadera pasión. En este año tan complicado que ya se nos acaba, son muchos los viajes que han tenido que ser cancelados o pospuestos, escapadas y visitas a familias y amigos que tendrán que esperar solo un poco más para hacerlo con seguridad. A pesar de que nunca será lo mismo, podemos aprovechar para viajar a través de la mesa con platos con los que vivir una Navidad más internacional."
    ],
    [
        "6 comidas típicas navideñas para probar en todo el mundo",
        "La Navidad es una celebración común alrededor del mundo. Sin embargo, cada país tiene sus costumbres y tradiciones - y eso incluye la gastronomía. Además, cada lugar tiene sus propios sabores, desde los más sencillos hasta los más exóticos. Así, es posible encontrar una verdadera variedad de comidas típicas navideñas."
    ],
    [
        "3 platos y postres navideños alrededor del mundo",
        "En los distintos países existen platos típicos diferentes asociados al periodo navideño. Te vamos a presentar 3 de ellos para darte ideas que puedan formar parte de tu menú."
    ],
    [
        "10 platos típicos de Navidad | Recetas navideñas alrededor del mundo",
        "Hoy desde El Viajero Feliz, nos apegamos a la temporada navideña que se acerca, donde familias se reúnen en grandes mesas llenas de comida para celebrar la Navidad y el Año Nuevo. Las cenas navideñas son un clásico, la cual dependiendo del país puede tener distintos elementos. Pollo asado, mariscos, jamón, turrones, pavo, son solo algunos de los platos típicos de cada Navidad. Por la inmensa variedad, queremos hacer un viaje gastronómico por las recetas de Navidad de todo mundo. ¿Nos acompañas?"
    ],
    [
        "La mesa navideña alrededor del mundo",
        "A pesar de que en algunas fronteras los platos navideños puedan tener ciertas similitudes, cada cultura imprime su sello particular a esa comida que se sirve durante las fiestas de diciembre. A través de la gastronomía se expone la manera de vivir y gozar de las tradiciones y de los momentos de celebración, sobre todo los días 24 y 31 de diciembre."
    ],
    [
        "Navidad: qué se come en el resto del mundo",
        "En España, nuestras mesas navideñas se llenan de productos como el jamón o el marisco, de platos como el cordero y de dulces como el turrón o el mazapán. Del mismo modo, la gastronomía de cada país tiene unas peculiaridades y especialidades concretas, además de sus propias tradiciones. Queremos contarte algunas de ellas -sobre todo dulces- y dejarte algunas de sus recetas navideñas más típicas."
    ]]
  ]'),

  ('Food 3', 'Mexico', '["f3-mex-eng.png", "f3-mex-esp.png"]', '[
    [[
        "26 Mexican Dessert Recipes to Make at Home",
        "Celebrate every day with these Mexican desserts, including Mexican wedding cookies, fried ice cream and tres leches cake."
    ],
    [
        "28 Mexican Desserts To Make For Cinco De Mayo (& All Year Long)",
        "No surprise that the birthplace of chocolate has some killer desserts!"
    ],
    [
        "23 Mexican Desserts You''ll Love (+ Easy Recipes)",
        "From fried ice cream and caramel flan cake to the traditional churro and sopapilla, these tasty treats will satisfy every taste bud."
    ],
    [
        "21 Mexican Dessert Recipes",
        "Cinco de Mayo is one of my favorite days of the year. It also happens to be my mom''s birthday – which is obviously the most important part of the day for me – but I also adore Mexican food and, in particular, Mexican desserts. It''s a day when I go all out with a big Mexican feast."
    ],
    [
        "31 BEST MEXICAN DESSERT RECIPES",
        "The ultimate list of Mexican dessert recipes, perfect for a Cinco De Mayo Celebration or just for a little something sweet treat after you enjoy Taco Tuesday! Everything from the best Mexican cakes to Mexican cookies and of course – churros! If you''re looking for some new favorite Mexican desserts, this is the place to find them!"
    ],
    [
        "The 30 BEST Mexican Desserts",
        "If you''re searching for something sweet to finish your taco night, you''ve come to the right place!"
    ]],
    [[
        "RECETAS DE POSTRES MEXICANOS",
        "Perfectos para tu noche mexicana o para cualquier día de antojo, estos postres son muy mexicanos, como buñuelos, arroz con leche, flan napolitano y hasta unas tradicionales alegrías."
    ],
    [
        "17 recetas de postres mexicanos tradicionales y económicos",
        "Dentro de la gastronomía de México, hay recetas que resaltan, como los postres, ya que a la mayoría nos encantan. Este tipo de platillos tradicionales mexicanos tienen ese toque especial de la cultura de nuestro país, con ingredientes como el maíz, amaranto, piloncillo, canela, arroz y otros insumos que, demás, son económicos y deliciosos. Hoy, te compartimos una lista de recetas de postres que te encantarán, ya sea para disfrutar en familia o para vender."
    ],
    [
        "Postres mexicanos tradicionales",
        "La dulcería mexicana no sólo es exquisita y variada, sino también tiene mucha historia debido a su pasado prehispánico y colonial. De hecho, según datos históricos, en México prehispánico ya empleaban la miel, pero no sólo de abeja, sino de avispa y vegetales como el maíz, el maguey, entre otros. Por otra parte, los niños consumían hormigas mieleras o juchileras, pues esos insectos captan el néctar de la miel en su interior, convirtiéndose así en un precedente de la repostería mexicana actual."
    ],
    [
        "Postres mexicanos fáciles e irresistibles",
        "En México tenemos un amor especial hacia los postres. ¡No pueden faltar en la mesa! Especialmente si se trata de una celebración especial como las fiestas patrias. Para celebrar en grande la noche mexicana del 15 de septiembre necesitas postres deliciosos que estén a la altura de los platillos espléndidos que seguro estarán en tu mesa. Por eso, Maizena® te trae algunas ideas de postres mexicanos, fáciles, económicos e irresistibles, perfectos para celebrar en familia."
    ],
    [
        "15 POSTRES MEXICANOS PARA COMPLETAR UN DELICIOSO MENÚ TÍPICO",
        "¡No sorprende que el lugar de nacimiento del chocolate tenga algunos postres increíbles!"
    ],
    [
        "POSTRES MEXICANOS",
        "¡Cada cultura le da un giro único a los postres y dulces y la cultura mexicana no es diferente! Tienen muchas recetas de postres que son audaz con sabor ¡y perfectamente dulce para mantenerte con ganas de más!"
    ]]
  ]'),

  ('Food 3', 'US', '["f3-us-eng.png", "f3-us-esp.png"]', '[
    [[
        "25 Classic American Desserts (+ Easy Recipes)",
        "With Memorial Day and the 4th of July coming up fast, I''ve gathered 25 of my go-to awesome American desserts for you to choose from."
    ],
    [
        "40 Uniquely American Desserts",
        "Sure, we love treats like tiramisu or creme brulee, but some of the best sweets are all-American desserts. Each of these recipes has its roots right in the United States (and they are all delicious)."
    ],
    [
        "45 Classic American Desserts for the History Books",
        "What''s more American than blue jeans and baseball? Well, we''d like to think these classic American desserts are up there on the list of all-American standouts. From old fashioned banana splits to New York cheesecake, these uniquely American desserts go beyond just apple pie (but don''t worry, we included it too). Find all the best American desserts with roots right here in the U.S. — you just might learn a little American history along the way!"
    ],
    [
        "Top 29 American Desserts To Try Out",
        "You''ve heard the phrase “as American as apple pie”. But what about as American as shoofly pie? Or German chocolate cake? America has a rich history of desserts and this list explores the top 29."
    ],
    [
        "The Most Iconic Desserts in America",
        "As Americans, we are serious about our sweets. Whether desserts are chocolatey or fruity, simple or decadent, our country loves sugar in almost any form. But what are the most iconic desserts the United States has to offer?"
    ],
    [
        "Most Popular Desserts in America",
        "I am not going to lie, I like food statistics. In college, one of my favorite classes was Statistics. Learning about analytics and data fascinates me. Especially when it comes to food. I love finding out how popular different things like desserts and other foods are in the United States and the rest of the world. This particular article will cover the Top 10 Most popular desserts in America."
    ]],
    [[
        "Las mejores recetas de postres americanos estadounidenses",
        "Una selección de recetas americanas de postres de todo tipo: tortitas, brownies, tartas, cookies, pasteles… Las mejores recetas de postres estadounidenses presentados de forma sencilla para que sean fáciles de hacer y todo un éxito."
    ],
    [
        "10 postres para ''comerse'' Estados Unidos",
        "Aprovechamos una fecha tan emblemática como el 4 de julio para reunir algunos de los dulces cuyo solo nombre nos hacen viajar con el paladar al país norteamericano"
    ],
    [
        "10 postres típicos de Estados Unidos que debes probar",
        "La gastronomía estadounidense es rica en sabores con platillos para todos los gustos, desde lo salado y picante, hasta lo dulce. Y de esto último es precisamente de lo que conoceremos a continuación."
    ],
    [
        "20 de los mejores postres americanos",
        "Muchos estadounidenses perciben el almuerzo como un preludio del postre, Estados Unidos es un país de amantes de los dulces."
    ],
    [
        "5 Postres Típicos de los Estados Unidos",
        "Cualquier restaurante que tú vayas en los Estados Unidos te ofrecerá una variedad, grande o pequeña, de postres; muchos de estos postres se encuentran comúnmente en muchos, si no la mayoría, de los restaurantes. Hoy vamos a compartir nuestra lista de postres que creemos que son muy comunes en los restaurantes estadounidenses."
    ],
    [
        "Los mejores postres estadounidenses: ¡tienes que probarlos!",
        "Estados Unidos es una nación intensa en todos los sentidos, desde su estilo de vida, su ''sueño americano'' su Pato Donald y hasta su gastronomía, que incluye postres de escándalo. Imagina saborear un irresistible brownie de chocolate, o un fresco, suavemente dulce y cremoso New York Cheescake. Literalmente, se te hace la boca agua. Hasta querrías tener a mano al genio de la lámpara para pedirle esos postres alucinantes ya. Por si el genio no aparece por tu casa, en Just Eat nos encargaremos de llevártelos a tu puerta en un pispas."
    ]]
  ]'),

  ('Food 3', 'International', '["f3-int-eng.png", "f3-int-esp.png"]', '[
    [[
        "International desserts: 50 famous desserts around the world",
        "Imagine the best dessert on Earth. Then ask other people their favorites. Bet you dollars to doughnuts, their answer is different from yours."
    ],
    [
        "46 Desserts from Around the World",
        "Take a trip with desserts from around the world, like German apple cake, Spanish flan, Thai sticky rice, Argentinian alfajores and much more."
    ],
    [
        "25 Best Desserts From Around the World",
        "Try these desserts from around the world to expand your palate!"
    ],
    [
        "102 Best Desserts In The World",
        "We''re on a never-ending quest to eat the best desserts in the world. This guide has our picks for the 102 desserts that make life sweeter and more fun."
    ],
    [
        "The 10 Best Desserts in the World",
        "Let me start by saying that I would consider myself somewhat of a dessert connoisseur. The Google definition precisely states that I am thus claiming myself to be “an expert judge in matters of taste”. Sold. I''ll take that title any day."
    ],
    [
        "22 Best Sweet Treats from Around the World (and How to Make Them at Home)",
        "In this post, I''m sharing a round-up of my favourite international desserts and, seeing as we can''t travel right now, I''m also adding links to recipes so you can recreate them in your own kitchens."
    ]],
    [[
        "La vuelta al mundo en 25 postres",
        "De norte a sur y de este a oeste, viajamos con el paladar para descubrir el lado más dulce de cada rincón del planeta."
    ],
    [
        "Los 40 postres más famosos del mundo que tienes que comer antes de morir",
        "Sin duda probarlos podría provocarte una muerte deliciosa; pero tranquilo, estos postres solo te alegrarán la vida y son los más famosos del mundo, como también los pasteles más finos en el mundo gourmet, tanto por su forma de preparar como por sus nombres. Si llevas un curso de fotografía o eres un community manager experto de una cuenta gastronómica, amarás esta lista para tenerlo como un book fotográfico o contenido."
    ],
    [
        "Los Mejores Postres del Mundo",
        "Esta nueva serie propone un recorrido por los postres más elegidos del mundo. La chef venezolana Andrea Dopico nos devela todos los secretos de cada elaboración, repasando los grandes clásicos y sorprendiéndonos con auténticas joyas dulces."
    ],
    [
        "¿Conoces los mejores postres del mundo? ¡No te los pierdas!",
        "“Una vez al año, no hace daño”. Acompañar las comidas con algún postre es un capricho que nos podemos dar de vez en cuando. Aquí os dejamos una selección de nueve dulces de distintas procedencias, unos más tradicionales que otros, pero que tienen en común que todos han dado la vuelta al mundo por ser deliciosos manjares para momentos especiales y que son considerados por muchos los mejores postres del mundo. Tanto si tienes la suerte de poder degustarlos en su lugar de origen, como si es cerca de casa, ¡no puedes perdértelos!"
    ],
    [
        "Los 20 postres y dulces más famosos y ricos del mundo",
        "Si te encanta viajar y eres goloso, muy goloso, ya estás listo para recorrer el mundo con nosotros y descubrir los postres y dulces más famosos y ricos que existen. ¿Paladar y equipaje preparados?"
    ],
    [
        "La vuelta al mundo en 29 postres",
        "Si eres de los que siempre reservas un hueco para el postre seguro que vas a disfrutar con el recorrido de hoy, pues vamos a dar la vuelta al mundo en 29 postres. Algunos tan conocidos como si fuesen típicos de nuestro propio país, y otros menos vistos, pero todos con nombre propio merecido pues han logrado ser universales."
    ]]
  ]'),

  ('Food 4', 'Mexico', '["f4-mex-eng.png", "f4-mex-esp.png"]', '[
    [[
        "17 Traditional Mexican Drink Recipes",
        "Team Delish LIVES for a Taco Tuesday, a good Cinco de Mayo party, or really any excuse to have a margarita. But did you know there''s tons more incredible traditional Mexican drinks out there to discover? Next time you''re having Mexican food for dinner, mix up one of these 17 Mexican-inspired drinks—we''ve got everything from party favorites (like palomas and micheladas) to our non-alcoholic favorites, watermelon agua fresca and tepache, so you can enjoy them any time you want."
    ],
    [
        "Top 10 Authentic Mexican Drinks You Have To Try",
        "Home to some of the best cuisine in the world, Mexico''s drinks scene is no different. Whether it''s an aged tequila you''re in search of, or a refreshing mocktail made with tropical juices is more your thing, we''ve compiled the 10 top Mexican drinks you have to try when you visit the country famed for its flavors!"
    ],
    [
        "18 Most Popular Mexican Drinks",
        "There''s an array of popular Mexican drinks to choose from. They range from family-friendly breakfast champurrado bowls to hard-hitting cerveza margarita highballs. Other traditional local drinks include jarritos, aguas frescas, horchata, tejate, Mexican ponche, margarita, palome, and tequila."
    ],
    [
        "10 Most Popular Mexican Beverages",
        "Michelada is a Mexican beer-based cocktail with a spicy kick. Since it is easily adaptable to different tastes and preferences, Michelada can be prepared in a variety of ways with beer as a base, and the addition of lime juice, salt, and assorted spices, hot sauces, and peppers."
    ],
    [
        "TOP 11 DRINKS TO TRY IN MEXICO",
        "The list of traditional Mexican drinks and cocktails extends far beyond the classic margaritas, and there''s no better time to sample different Mexican cocktails than when you''re on a beach vacation in Loreto. As you lounge by the ocean in the afternoon or watch the sunset after dinner, savor the flavors of these traditional drinks and popular shots in Mexico."
    ],
    [
        "A Guide to Mexico''s Best Drinks",
        "From iconic cocktails to milky rice drinks, Mexico''s beverages are as colorful and varied as its 761,610 square miles of terrain. After you''ve sampled some of the country''s most delicious dishes, check out this guide to the best beverages - ¡salud!"
    ]],
    [[
        "Top 5: las bebidas mexicanas más tradicionales",
        "En México las bebidas tradicionales son parte de nuestra historia, cultura y vida ritual desde antes que llegaran los españoles, y representan nuestra tradición culinaria y origen."
    ],
    [
        "LAS MEJORES 11 BEBIDAS PARA PROBAR EN MÉXICO",
        "La lista de cocteles y bebidas mexicanas tradicionales va mucho más allá que sólo las clásicas margaritas, y no hay mejor momento para probar diferentes cocteles mexicanos que cuando te encuentras de vacaciones en Loreto en la playa. Mientras descansas por la tarde en la orilla del mar o después de la cena al contemplar la puesta del sol, deléitate con los sabores de estas bebidas tradicionales y tragos populares en México."
    ],
    [
        "Un Sorbo de Paraíso: Las Mejores Bebidas Para Probar Durante tus Vacaciones en México",
        "¿Estás planeando una escapada a México? Prepara tu paladar para un emocionante viaje de sabor por las mejores bebidas de México. Ya sea que estés descansando en las playas de Cabo San Lucas, explorando las vibrantes calles de Puerto Vallarta o paseando por los encantadores pueblos de Riviera Nayarit, hay bebidas para probar en México que te harán sentir renovado y con ganas de disfrutar la fiesta. En tus próximas vacaciones, saborea estas populares bebidas mexicanas y estarás en camino a una deliciosa aventura."
    ],
    [
        "10 bebidas de México que tienes que probar",
        "Gracias a la gran variedad de productos que hay en el país, nacen bebidas llenas de tradición, sabor y color, que son parte de nuestra riqueza cultural y excelentes compañeras de la gastronomía mexicana."
    ],
    [
        "Bebidas mexicanas",
        "Según National Geographic, México se encuentra entre los 10 mejores destinos gastronómicos del mundo. Ciertamente no es para nada extraño, porque el mestizaje culinario en ese territorio es muy variado, y además, su gastronomía siempre está reinventándose, pero sin abandonar sus tradiciones ancestrales."
    ],
    [
        "Las 20 bebidas típicas de México más famosas",
        "México es un país muy reconocido internacionalmente por su exquisita gastronomía, rica en ingredientes y especias, con un gran trasfondo histórico y cultural. "
    ]]
  ]'),

  ('Food 4', 'US', '["f4-us-eng.png", "f4-us-esp.png"]', '[
    [[
        "Best American Wine and Whiskey",
        "Based on a mean of critics scores, updated monthly and weighted according to the number of reviews, and number of critics."
    ],
    [
        "15 Best Wines From The USA Wine Ratings",
        "Comprised of top-level wine buyers, qualified Masters of wine, and sommeliers, the UWR''s panel of judges blind-tasted over 2,000 wines from around the world. Here are the 15 best wines from the USA Wine Ratings that you must know."
    ],
    [
        "TOP 100 WINES OF THE USA 2022",
        "You are going to really enjoy the diversity found on this year''s list of our Top 100 Wines of the USA 2022. We rated more than 4,500 wines from the states this year and we found so many exciting and excellent wines. It was the same with the more than 32,000 wines we rated this year from around the world."
    ],
    [
        "THE 10 MOST PRESTIGIOUS WINES IN THE USA",
        "Ever since the Judgement of Paris in 1976, California has built itself an exceptional reputation for high-quality wine. But there are some wineries that have carried that name even further, with limited production and outstanding quality that has people from all around the world fighting to get just a single bottle in their hands."
    ],
    [
        "Top 10 U.S. Wines of 2020",
        "We surveyed the top rated wines around the web of the leading wine enthusiasts, and we''re excited to report the Top 10 US Wines of 2020. They include reds, whites, and more."
    ],
    [
        "TOP 10 RED WINES MADE IN THE USA",
        "USA stands out in everything and when it comes to wine its flavour profiles are truly distinctive too! There is no cave to hold the barrels of amazing wines of USA as it has inventory of some of the most extracted, rich, and voluptuous wines. The fermentation of grapes can indeed produce some of the lip smacking wines and US has given an authentic example of this."
    ]],
    [[
        "Vinos de Estados Unidos",
        "USA Wine - del mundo del vino bastante nuevo del nuevo mundo. El sueño americano vivido del vino americano, de las gotas casi imbebibles al vino noble de la clase superior en tiempo récord."
    ],
    [
        "Hechas en EE.UU.: 20 bodegas que venden vino bueno y barato",
        "Estados Unidos ha estado impresionando a los aficionados del vino del mundo durante décadas, y por buenas razones."
    ],
    [
        "Los 10 mejores vinos del mundo según la prensa de Estados Unidos",
        "Curiosa la lista publicada por le revista británica The Drinks Business, en la que recopila la lista de los 10 mejores vinos del mundo de acuerdo con lo escrito por la prensa especializada de Estados Unidos. Adelantamos que en la lista tan solo hay un vino de España."
    ],
    [
        "Los 10 mejores vinos de 2022, con las mejores botellas de US$35 a US$35.000",
        "Lea más: (Los 10 mejores vinos de 2022, con las mejores botellas de US$35 a US$35.000) https://www.bloomberglinea.com/2022/12/17/los-10-mejores-vinos-de-2022-con-las-mejores-botellas-de-us35-a-us35000/"
    ],
    [
        "Los 10 Mejores Vinos del Mundo 2016",
        "Wine Spectator acaba de publicar la lista de los 10 Mejores Vinos del Mundo 2016, considerando al Cabernet Sauvignon Napa Valley 2013 de la bodega estadiunidense Lewis, como Mejor Vino del Mundo 2016. Lamentablemente este año no hay ningún vino español en este Top 10 en el que predominan los vinos estadounidenses con seis referencias, y las otras cuatro se reparten entre los vinos italianos y franceses."
    ],
    [
        "7 vinos populares en EE.UU.",
        "Una selección de vinos de todo el mundo que triunfan en Estados Unidos"
    ]]
  ]'),

  ('Food 4', 'International', '["f4-int-eng.png", "f4-int-esp.png"]', '[
    [[
        "25 European Drinks You Must Try On Your Next Trip to Europe",
        "Europe is a fantastic tourist destination for so many reasons. You can hop around from country to country, seeing amazing sights, trying different foods, and learning bits of many languages. You may not even stop to think about what you''re drinking along the way. Well, we think you should!"
    ],
    [
        "50 Most Popular European Beverages",
        "Ireland was presumably the first country that introduced distillation, primarily to produce a clear distillate known as uisge beatha—which is generally considered to be a predecessor of modern-day whiskey."
    ],
    [
        "15 European Drinks You Must Not Miss on Your Next Adventure!",
        "Sampling the local cuisine is one of the best things about travel. This doesn''t just stop at food though! There are plenty of mouthwatering drinks across Europe, all promising to tantalise your tastebuds. "
    ],
    [
        "17 Liquors Across Europe",
        "In addition to specialized cuisines, hyper-local festivals and variations in language and dialect, popular liquors also change with every border crossing. "
    ],
    [
        "10 MUST-TRY TRADITIONAL NON-ALCHOLIC EUROPEAN DRINKS",
        "Many European countries are popular for their alcoholic drinks, but don''t think those are the only incredible thirst-quenching European drinks you will find there during your visit."
    ],
    [
        "The five most popular cocktails in Europe",
        "From rich to refreshing and sour to sickly sweet, what flavours make up the most popular cocktails among Europeans?"
    ]],
    [[
        "Las bebidas europeas tradicionales que no te puedes perder en tu próximo viaje",
        "Para mí, gran parte de la travesía y exploración de un viaje consiste en buscar lugares dónde comer y beber como un local, pero más que eso, disfrutar en ese lugar de una buena sobremesa, o tal vez de un par de cócteles y una buena plática. Afortunadamente, cada país y cada región tienen bebidas tradicionales por descubrir, y aunque algunos de estos cócteles ya son de fama internacional y los podemos encontrar en casi cualquier lugar, nada se compara a vivir la experiencia en su lugar de origen. (Como habrá quién diga que una coronita fuera de México nada más no sabe igual.)"
    ],
    [
        "Las mejores bebidas locales de Europa para brindar como un lugareño",
        "De la cerveza, la sangría o el vino a bebidas autóctonas o cócteles y combinados más fuertes, con esta guía te convertirás en un experto del alcohol europeo."
    ],
    [
        "Bebidas típicas de Europa",
        "Estas son algunas bebidas típicas de Europa que debes probar en tu próximo viaje."
    ],
    [
        "10 bebidas del mundo que tienes que probar",
        "A la mayoría de nosotros, cuando viajamos, nos gusta probar las cosas típicas de cada país ¿no? Pues hoy os vamos a hablar de las 10 bebidas más típicas de ciertos lugares, aquellas que en ningún caso nos podemos perder si vamos a visitarlos."
    ],
    [
        "Las mejores bebidas alcohólicas tradicionales de Europa",
        "Siempre bajo un consumo responsable, las bebidas alcohólicas son en muchas ocasiones baluarte de diversos países, una marca que todo el mundo conoce y por el cual se han hecho famosas diferentes regiones de la Tierra."
    ],
    [
        "Las 32 bebidas tradicionales de los países del Mundial",
        "ada vez está más cerca un acontecimiento muy importante que centra la atención de gran parte del mundo, el Mundial de fútbol 2014 que se celebrará en Brasil del 12 de junio hasta el 13 de julio."
    ]]
  ]'),

  ('Health/healthy living 1', 'Mexico', '["hl1-mex-eng.png", "hl1-mex-esp.png"]', '[
    [[
        "What are we waiting for?",
        "Child obesity in Mexico presents an urgency that demands immediate change."
    ],
    [
        "Has the United States Exported Its Obesity Rate to Mexico?",
        "Between 1988 and 2012, the rate of obesity among Mexican women increased from 10% to 30%. At the same time, Mexico entered a period of greater economic liberalization by signing the NAFTA trade pact with the United States and Canada. According to the economists Osea Giuntella, Matthias Rieger, and Lorenzo Rotunno, the arrival of American products onto the Mexican market accounts for up to 20% of the increase in obesity among Mexican women."
    ],
    [
        "Mexico''s obesity epidemic",
        "Mexican girls and boys, but especially girls, have seen their mean body mass index (BMI) rise at one of the steepest rates globally over the past 35 years, researchers at Imperial College London found after comparing data from 200 countries."
    ],
    [
        "Childhood and adult obesity: Mexico''s other epidemic",
        "In 2016, more than 1.9 billion adults (39 per cent of the global population) were overweight, of which over 650 million were obese. According to data from the World Health Organization, in the space of just 45 years, worldwide obesity has nearly tripled"
    ],
    [
        "Childhood obesity in Mexico: Influencing factors and prevention strategies",
        "Overweight and obesity in school-age children, in Mexico as in other countries around the world, is a rapidly increasing public health problem within recent years, with important consequences for the future health of the population. Various national strategies at the individual and community level have been established to prevent these conditions, but none have yet succeeded."
    ],
    [
        "10 Facts on Obesity in Mexico",
        "Obesity is a public health problem, because it has been associated with the development of chronic, non-communicable diseases such as diabetes, hypertension, cardiovascular disease and cancer."
    ]],
    [[
        "Obesidad y sobrepeso. Menos kilos, más vida",
        "De acuerdo con la Organización Mundial de la Salud (OMS) el desequilibrio entre el ingreso y el gasto de calorías es la causa fundamental de la obesidad y el sobrepeso: una acumulación anormal y excesiva de grasa que puede ser perjudicial para la salud."
    ],
    [
        "La Obesidad en México",
        "¡Por tu salud, quítate un peso de encima! La obesidad se puede prevenir."
    ],
    [
        "Obesidad, epidemia agudizada en México",
        "El exceso de peso es un padecimiento en sí mismo y un problema de salud pública sin precedentes; segundo sitio para la OCDE"
    ],
    [
        "Sobrepeso y obesidad en niños, niñas y adolescentes",
        "La obesidad y el sobrepeso pueden causar padecimientos como diabetes y problemas del corazón y los riñones."
    ],
    [
        "Sobrepeso y obesidad en México",
        "El sobrepeso y obesidad en México son un problema creciente, que no se estanca, y se encuentra en zonas ricas, pobres, rurales y urbanas de nuestro país. Así lo expuso la Dra. Teresa Shamah Levy, directora adjunta del Centro de Investigación en Evaluación y Encuestas (CIEE) del Instituto Nacional de Salud Pública (INSP), durante su entrevista en el programa Simbiosis de TV UNAM."
    ],
    [
        "¿Es realmente México el país más obeso del mundo?",
        "Para muchas personas, el país del taco, las quesadillas y los huaraches es también la nación con más altos índices de obesidad en el mundo."
    ]]
  ]'),

  ('Health/healthy living 1', 'US', '["hl1-us-eng.png", "hl1-us-esp.png"]', '[
    [[
        "Overweight & Obesity",
        "Obesity is a common, serious, and costly chronic disease of adults and children that continues to increase in the United States. Obesity is putting a strain on American families, affecting overall health, health care costs, productivity, and military readiness."
    ],
    [
        "State of Obesity 2022: Better Policies for a Healthier America",
        "Trust for America''s Health''s (TFAH) 19th annual report on the nation''s obesity crisis found that 19 states have obesity rates over 35 percent, up from 16 states in 2021, and that social and economic factors are key drivers of increasing obesity rates. The report includes data by race, age, and state of residence and recommendations for policy action."
    ],
    [
        "How Obesity In The U.S. Has Grown And What To Do About It",
        "Is America really the most obese country in the world? Well, not quite, it ranks as the 12th most obese country worldwide, but number 1 when considering high-income countries. Obesity refers to a medical condition in which one has an excess amount of fat in the body, and one''s Body Mass Index (BMI) is 30 or more (BMI is a measurement that factors in one''s height, weight, age, and sex)."
    ],
    [
        "Obesity in America: A Growing Concern",
        "Obesity has been named a chronic disease by leading medical associations."
    ],
    [
        "42% Americans are living with obesity",
        "More than 4 in 10 U.S. adults are obese, with states in the South and Midwest showing some of the highest prevalence, a new analysis from NORC at the University of Chicago shows."
    ],
    [
        "US obesity rates have tripled over the last 60 years",
        "Nationwide surveys show that 43% of Americans are obese, while 10% are morbidly obese."
    ]],
    [[
        "Cerca de 40% de los Adultos en Estados Unidos son Obesos",
        "Llevar programas de prevención basados en la evidencia a más comunidades, previene las enfermedades y reduce los costos de salud"
    ],
    [
        "¿Por qué EE.UU. es el país con más personas con obesidad del mundo?",
        "Estados Unidos es en la actualidad el país con más personas con obesidad del mundo, de acuerdo con datos de la Organización Mundial de la Salud (OMS). La información previa a la pandemia aportada por los Centros para el Control y la Prevención de Enfermedades (CDC, por sus siglas en inglés) indicaba que la prevalencia de la obesidad en adultos de EE.UU. era del 41,9%."
    ],
    [
        "¿Qué estado tiene la tasa de obesidad más alta?",
        "La obesidad es una preocupación creciente en los Estados Unidos. Te compartimos cuál es el estado que tiene la tasa de obesidad más alta en el país."
    ],
    [
        "Porcentaje de adultos con obesidad en Estados Unidos a fecha de 2021, por estado",
        "En 2021, más del 40% de los adultos estadounidenses de Kentucky tenían obesidad. Así, estado este estado se sitúa en la segunda posición del ranking de estados del país con mayor porcentaje de obesos, solo por detrás de Virginia Occidental."
    ],
    [
        "Más del 70% de los adultos de EEUU tiene sobrepeso u obesidad, pero no se consideran gordos",
        "Una encuesta reveló que el 40% de los hombres y las mujeres dijeron estar contentos con su peso actual. La obesidad está considerada una epidemia nacional en Estados Unidos."
    ],
    [
        "El nivel de obesidad de Estados Unidos sigue aumentando",
        "El país no solo registró en el 2014 un porcentaje de obesidad mayor que el año pasado, sino que es el más alto de los últimos siete años."
    ]]
  ]'),

  ('Health/healthy living 1', 'International', '["hl1-int-eng.png", "hl1-int-esp.png"]', '[
    [[
        "Obesity",
        "Obesity is most commonly measured using the body mass index (BMI) scale. The World Health Organization define BMI as: ''a simple index of weight-for-height that is commonly used to classify underweight, overweight and obesity in adults.''"
    ],
    [
        "Global Obesity Levels",
        "The island country of Nauru is the most obese in the world with obesity affecting 61.0% of the adult population, according to the most recent data available from the World Health Organization (WHO) as of Mar. 26, 2020. Vietnam is the least obese country with 2.1% of the population classified as obese. Among OECD countries, the United States is the most obese (36.2%)."
    ],
    [
        "Prevalence of Obesity",
        "The worldwide prevalence of obesity nearly tripled between 1975 and 2016. Obesity is now recognised as one of the most important public health problems facing the world today."
    ],
    [
        "Worldwide obesity on the rise",
        "A diet of processed food is becoming the norm in low- and middle-income countries"
    ],
    [
        "Half of world on track to be overweight by 2035",
        "More than half the world''s population will be classed as obese or overweight by 2035 if action is not taken, the World Obesity Federation warns."
    ],
    [
        "More than half of the world will be overweight or obese by 2035",
        "More than half of the world''s population will be overweight or obese by 2035 without significant action, according to a new report."
    ]],
    [[
        "La pandemia más fuerte del mundo es la obesidad: Colegio de Cirujanos Bariatras y Enfermedades Metabólicas",
        "Durante una conferencia de prensa, Ortiz Gómez expresó que la pandemia más fuerte del mundo es la obesidad, y esta es provocada principalmente por el consumo de alimentos de menor costo y menor calidad"
    ],
    [
        "Sobrepeso y obesidad: Atlas mundial 2023",
        "El recién publicado Atlas mundial de obesidad 2023 predice que más de 4.000 millones de personas en el mundo, el 51% de la población global, sufrirán sobrepeso y obesidad en 2035, frente a los 2.600 millones de 2020. Señala, además, que una de cada cuatro personas será obesa."
    ],
    [
        "Obesidad y sobrepeso",
        "Desde 1975, la obesidad se ha casi triplicado en todo el mundo."
    ],
    [
        "Ranking de los países con mayor número de personas obesas a nivel mundial en 2022",
        "Estados Unidos lidera el ranking mundial de de países con mayor número de población con obesidad. Así en octubre de 2022, más de 77 millones de estadounidenses eran considerados obesos, es decir, tenían un índice de masa corporal (IMC) igual o superior a 30. Completaban el podio China e India, aunque con cifras notablemente inferiores a pesar de sus respectivas superpoblaciones."
    ],
    [
        "Prevención de la obesidad",
        "La obesidad y el sobrepeso se definen como una acumulación anormal o excesiva de grasa que puede ser perjudicial para la salud. Una forma simple de medir la obesidad es el índice de masa corporal (IMC). Se calcula dividiendo el peso de una persona en kilogramos por el cuadrado de la talla en metros."
    ],
    [
        "La obesidad en el mundo",
        "El presente artículo analiza el sobrepeso y obesidad, y lo que estos implican como un enorme problema de salud pública en el mundo y en el Perú."
    ]]
  ]'),

  ('Health/healthy living 2', 'Mexico', '["hl2-mex-eng.png", "hl2-mex-esp.png"]', '[
    [[
        "Neglected Mental Health Needs of Relatives of Mexico''s ''Disappeared''",
        "Thousands of relatives of the disappeared in Mexico struggle with complicated grief and other mental health challenges. Most receive inadequate mental health care, or none at all. Many suffer alone. But others who bravely search for their disappeared relatives have come up with homespun “therapies” that they say help—at least temporarily."
    ],
    [
        "''An abandoned issue'': Migrants'' mental health mostly ignored by Mexican government",
        "The migrant crisis is evident everywhere in this city of 350,000 near Mexico''s southern border."
    ],
    [
        "Animals become healing companions in Mexico hospital",
        "The National Center for Mental Health and Palliative Care in Mexico City, is the only public hospital in Mexico using animals to treat mental illnesses"
    ],
    [
        "Rising suicides in Mexico expose the mental health toll of living with extreme, chronic violence",
        "Mexico has suffered one of the world''s highest murder rates for over a decade, a consequence of the government''s aggressive, 12-year-long battle against drug trafficking organizations and other criminal groups, which has led lethal violence to escalate across the country."
    ],
    [
        "The Hidden Mental Health Crisis at Mexico''s Border",
        "Migrants'' struggles with trauma and mental health are going overlooked and undertreated."
    ],
    [
        "The Unseen Scars of Violence: Why We Desperately Need to Talk About Mental Health in Mexico",
        "On Wednesday January 18, a 15-year-old student opened fire against his classmates and teacher in a private school in the city of Monterrey, in the north of Mexico. The incident happened around 8 am. After wounding four, the student pointed the gun toward his head and fired one last shot. He was declared dead in a hospital a few hours later."
    ]],
    [[
        "La salud mental en México",
        "Entendemos por salud a un estado de bienestar tanto físico, mental y social, sin embargo, al momento de cuidar nuestra salud muchas personas sólo se enfocan en la cuestión física (hacer ejercicio, ir al médico, comer sano) dejando a un lado la salud mental. Todos a lo largo de la vida hemos enfermado, presentado sensaciones de malestar físico (fatiga, estrés, agitación) o malestar mental (tristeza, ansiedad, pánico, insomnio), siendo estos últimos los que pueden llegar afectar a nuestra salud general, por lo que la salud mental tiene una relevancia importante en nuestra vida diaria y en nuestro alrededor."
    ],
    [
        "Salud mental en México",
        "La Organización Mundial de la Salud (OMS) considera la salud como un estado completo de bienestar físico, mental y social y no solamente la ausencia de afecciones o enfermedades. El concepto de salud mental implica bienestar personal, independencia, competencia, dependencia intergeneracional y aceptación de la capacidad de crecimiento y realización a nivel emocional  e intelectual."
    ],
    [
        "En México, sólo el 20% de las personas con enfermedades mentales reciben atención profesional",
        "En México, el nivel de atención a la salud mental no resuelve las necesidades de los pacientes debido a la falta de presupuesto, falta de capacitación a médicos de primer contacto, diagnósticos tardíos, ausencia de políticas públicas, insuficiencia de centros de atención especializados y estigma social hacia las enfermedades mentales."
    ],
    [
        "Atención de salud mental, un privilegio sólo para el 10% de los trabajadores en México",
        "Tensión física y psicológica, insomnio, depresión y pérdida de concentración son las principales afectaciones a la salud mental de la fuerza laboral en el país, sin embargo, es mínima la cantidad de personas trabajadoras que puede atenderse con un especialista."
    ],
    [
        "En México, salud mental no ha sido prioridad: Shoshana Berenzon",
        "Los trastornos de salud mental ya eran considerados como una problemática, pero la pandemia vino a recrudecerlos, expuso la Directora de Investigaciones Epidemiológicas y Psicosociales del Instituto Nacional de Psiquiatría"
    ],
    [
        "La salud mental en México",
        "Lasaludmentalsedefinecomounestadode bienestar en el cual el individuo es consciente de sus propias capacidades, puedeafrontar lastensionesnormalesdela vida,puedetrabajardeformaproductivay fructífera y es capaz de hacer una contribuciónasucomunidad."
    ]]
  ]'),

  ('Health/healthy living 2', 'US', '["hl2-us-eng.png", "hl2-us-esp.png"]', '[
    [[
        "90% of US adults say the United States is experiencing a mental health crisis, CNN/KFF poll finds",
        "An overwhelming majority of people in the United States think the country is experiencing a mental health crisis, according to a new survey from CNN in partnership with the Kaiser Family Foundation."
    ],
    [
        "Mental health and the pandemic: What U.S. surveys have found",
        "The coronavirus pandemic has been associated with worsening mental health among people in the United States and around the world. In the U.S, the COVID-19 outbreak in early 2020 caused widespread lockdowns and disruptions in daily life while triggering a short but severe economic recession that resulted in widespread unemployment. Three years later, Americans have largely returned to normal activities, but challenges with mental health remain."
    ],
    [
        "The US has a mental health crisis that could undermine our democracy, US surgeons general say",
        "While working in the West Wing under President George W. Bush, then-US Surgeon General Dr. Richard Carmona got a terrible telephone call from his daughter. After he had been missing, she found Carmona''s adult son in a catatonic state. He sat in the corner of his father''s home for two days and he kept screaming “incoming, incoming.” Carmona''s son served in the army for 21 years, and Carmona said while he doesn''t talk much about it, his son has had “crippling PTSD” and been in and out of mental care facilities since that incident. Yet when the family initially sought help from the VA, Carmona said, even with all of his connections as surgeon general, they started to see the cracks in the country''s mental health care system."
    ],
    [
        "America Has Reached Peak Therapy. Why Is Our Mental Health Getting Worse?",
        "The U.S. has reached peak therapy. Counseling has become fodder for hit books, podcasts, and movies. Professional athletes, celebrities, and politicians routinely go public with their mental health struggles. And everyone is talking—correctly or not—in the language of therapy, peppering conversations with references to gaslighting, toxic people, and boundaries."
    ],
    [
        "The Current State of Mental Health in America",
        "A growing number of American adults are struggling with some type of mental illness with each passing year. In 2019 alone, almost 20 percent of the United States population, nearly 50 million people, were diagnosed with a mental illness. That figure was from data gathered before the COVID-19 pandemic began and thrust an entirely new set of stressors on the American population. These new stressors included but were certainly not limited to, illness, job loss, isolation, rising medical costs, and financial insecurity."
    ],
    [
        "What is the current state of mental health in the United States?",
        "Associate Professor of Counseling and Educational Psychology Kristina DePue looks mental health issues related to the pandemic and what we can do about them"
    ]],
    [[
        "Casi 1 de cada 5 adultos estadounidenses fue diagnosticado con depresión y la prevalencia varía drásticamente según el estado, de acuerdo con los CDC",
        "La proporción de adultos estadounidenses a los que se les diagnosticó depresión varía enormemente en función de su lugar de residencia."
    ],
    [
        "¿A qué se debe el aumento de los casos de depresión en EEUU?",
        "Los médicos advierten de la necesidad de implementar más políticas para educar a la población acerca de la importancia de cuidar la salud mental."
    ],
    [
        "El gasto en salud mental de los niños y adolescentes continúa aumentando en Estados Unidos",
        "Una nueva investigación mostró que el gasto en servicios de salud mental para niños y adolescentes de EE. UU. ha aumentado drásticamente desde 2020."
    ],
    [
        "¿Necesitas ayuda en temas de salud mental? Estos condado en California ofrecen asistencia gratuita",
        "Solo el 36% de latinos en Estados Unidos recibe servicios de salud mental en comparación con el 52% de blancos. Recientes estudios revelan que el estigma dentro de la comunidad hispana para recibir asistencia en temas de ansiedad, depresión o esquizofrenia, entre otros, se debe a diversos factores como la vergüenza en su círculo familiar, falta de información y recursos, la barrera del idioma y el estatus migratorio."
    ],
    [
        "Los 3 trastornos de salud mental más comunes en los Estados Unidos",
        "Uno de cada cinco adultos en Estados Unidos padece de una enfermedad mental a lo largo de su vida. En este momento, casi 10 millones de estadounidenses (1 en 25) viven con un trastorno mental grave que incluye ansiedad, depresión y trastorno bipolar. Obtenga más información a través de ACCESS."
    ],
    [
        "El 90% de los adultos estadounidenses considera que hay una crisis de salud mental en el país, según encuesta de CNN/KFF",
        "Una abrumadora mayoría de personas en Estados Unidos cree que el país está experimentando una crisis de salud mental, según una nueva encuesta de CNN en colaboración con la Kaiser Family Foundation."
    ]]
  ]'),

  ('Health/healthy living 2', 'International', '["hl2-int-eng.png", "hl2-int-esp.png"]', '[
    [[
        "Mental Health",
        "Mental health is an essential part of people''s lives and society. Poor mental health affects our well-being, our ability to work, and our relationships with friends, family, and community."
    ],
    [
        "A Look At Mental Health Around The World",
        "During their study of mental health around the world, the World Health Organization found that one in every four people in the world will be directly affected by a mental illness at some point in their lives. Statistics such as these show that mental health undeniably, in one way or another, affects us all."
    ],
    [
        "Global Mental Health Statistics",
        "Mental illness and health are human rights issues and need to be discussed in today''s world. These global mental health statistics give us an overview of how mental illness affects people. Understanding how mental illness affects people around the world can help us better solve the mental health crisis we are in."
    ],
    [
        "Nearly one billion people have a mental disorder: WHO",
        "Nearly one billion people worldwide suffer from some form of mental disorder, according to latest UN data – a staggering figure that is even more worrying, if you consider that it includes around one in seven teenagers."
    ],
    [
        "The Global Mental Health Crisis: 10 Numbers to Note",
        "Mental health issues are on the rise around the world. Here are 10 numbers that highlight the magnitude of the hidden crisis, and the need to take action."
    ],
    [
        "Half of people worldwide at risk of developing mental health condition by age 75, per new study",
        "By the age of 75, half of people worldwide can expect to experience a mental health disorder, according to the finding of a large study of more than 156,000 people across 29 countries."
    ]],
    [[
        "Salud mental, un derecho universal para todos",
        "La Federación Mundial para la Salud Mental, es la organización que tiene como objetivo la promoción de la salud mental y prevención de los trastornos mentales, estableciendo desde el 10 de octubre de 1992, el Dia Mundial de la Salud Mental, con miras principalmente a aumentar la conciencia pública sobre la importancia de la salud mental y mejorar la actitud ante los trastornos mentales. La campaña mundial de este año “La Salud Mental es un Derecho Universal” posiciona la salud mental en el marco de los derechos humanos, como un derecho humano fundamental."
    ],
    [
        "Siete mitos sobre la salud mental",
        "Desmontar los mitos sobre la salud mental puede ayudar a romper el estigma y generar una cultura que anime a personas de todas las edades a buscar apoyo cuando lo necesiten. He aquí siete ideas erróneas habituales en torno a la salud mental:"
    ],
    [
        "Apoyar la salud mental y el bienestar psicosocial es proteger los derechos de la infancia",
        "Hoy son 16 millones las niñas, niños y adolescentes entre los 10 y 19 años que fueron diagnosticados con diversas patologías de salud mental en el mundo -en nuestro país son 1 de cada 7 (Unicef)-."
    ],
    [
        "Llaman expertos al acceso universal de la salud mental",
        "Además de las acciones necesarias para eliminar el estigma, es necesario un aumento en la inversión en salud mental"
    ],
    [
        "''Los padres de adolescentes están tan solos y deprimidos como sus hijos, pero son ignorados''",
        "Ana es profesora de secundaria, pero de poco le sirvió la cercanía que tiene con los alumnos adolescentes cuando su propio hijo entró en esta etapa de la vida."
    ],
    [
        "Salud mental, la pandemia silenciosa",
        "El costo de los padecimientos y enfermedades relacionadas con la salud mental se estima en más del 4 % del PIB mundial, de acuerdo con un estudio. De 2011 a 2030 se prevé que la pérdida de producción económica acumulada asociada con estos problemas sea de 16,3 billones de dólares en todo el mundo."
    ]]
  ]'),

  ('Health/healthy living 3', 'Mexico', '["hl3-mex-eng.png", "hl3-mex-esp.png"]', '[
    [[
        "Diabetes: Leading Cause of Death in Mexico",
        "The World Health Organization released that as of 2016, diabetes was the leading cause of death in Mexico, being responsible for with 14.7% of Mexico''s deaths and thus seizing over 76,000 lives that year. The percent of the population that died to diabetes has tripled since 1990, and by 2050, scientists predict that half of Mexico''s population will suffer from diabetes."
    ],
    [
        "Burden of Type 2 Diabetes in Mexico: Past, Current and Future Prevalence and Incidence Rates",
        "Mexico diabetes prevalence has increased dramatically in recent years. However, no national incidence estimates exist, hampering the assessment of diabetes trends and precluding the development of burden of disease analyses to inform public health policy decision-making."
    ],
    [
        "6 Facts to Know About Diabetes in Mexico",
        "In 2019, diabetes was the second-highest cause of death in Mexico."
    ],
    [
        "Diabetes-Related Excess Mortality in Mexico: A Comparative Analysis of National Death Registries Between 2017-2019 and 2020",
        "Diabetes-related deaths increased among Mexican adults by 41.6% in 2020 after the onset of the COVID-19 pandemic, occurred disproportionately outside the hospital, and were largely attributable to type 2 diabetes and hyperglycemic emergencies."
    ],
    [
        "Ending diabetes in Mexico",
        "Diabetes leads to thousands of deaths and billion-dollar spending even though it is a predictable lifestyle disease."
    ],
    [
        "Diabetes in Mexico: cost and management of diabetes and its complications and challenges for health policy",
        "Mexico has been experiencing some of the most rapid shifts ever recorded in dietary and physical activity patterns leading to obesity."
    ]],
    [[
        "DIABETES EN MÉXICO",
        "Desde el año 2000, la diabetes mellitus en México es la primera causa de muerte entre las mujeres y la segunda entre los hombres(1) . En 2010, esta enfermedad causó cerca de 83 000 muertes en el país."
    ],
    [
        "En México, 12.4 millones de personas viven con diabetes",
        "Puede ocasionar daños irreversibles en la vista, riñón o piel."
    ],
    [
        "EN AUMENTO, LOS CASOS DE DIABETES EN MÉXICO",
        "En 2020, este padecimiento fue la tercera causa de decesos en México (sólo después de las enfermedades del corazón y de la COVID-19); el número de muertes fue más alto que en años anteriores."
    ],
    [
        "Los casos de diabetes en México han aumentado un 10 % en los últimos dos años",
        "Uno de cada 6 mexicanos vive con diabetes, lo que supone un aumento del 10 % en los últimos dos años, aunque estas cifras pueden empeorar por el efecto de la pandemia , que ha afectado la movilidad de las personas y sus hábitos de vida, consideraron este miércoles expertos."
    ],
    [
        "Epidemiología y determinantes sociales asociados a la obesidad y la diabetes tipo 2 en México",
        "La diabetes y la obesidad como problemas de salud pública en México son analizados a la luz de su magnitud y distribución en el contexto de algunos de sus determinantes sociales: alimentación, sedentarismo y distribución del ingreso."
    ],
    [
        "La diabetes y los mexicanos: ¿Por qué están vinculados?",
        "La obesidad y la diabetes eran probablemente poco comunes antes del advenimiento de la agricultura."
    ]]
  ]'),

  ('Health/healthy living 3', 'US', '["hl3-us-eng.png", "hl3-us-esp.png"]', '[
    [[
        "National Diabetes Statistics Report",
        "Estimates of Diabetes and Its Burden in the United States"
    ],
    [
        "Projection of the future diabetes burden in the United States through 2060",
        "In the United States, diabetes has increased rapidly, exceeding prior predictions. Projections of the future diabetes burden need to reflect changes in incidence, mortality, and demographics."
    ],
    [
        "Future Surge in Diabetes Could Dramatically Impact People Under 20 in U.S.",
        "The number of young people under age 20 with diabetes in the United States is likely to increase more rapidly in future decades, according to a new modeling study published today in Diabetes Care. Researchers forecasted a growing number of people under age 20 newly diagnosed with diabetes during 2017-2060."
    ],
    [
        "Study: Diabetes increasing among U.S. youth",
        "The estimated number of U.S. residents under age 20 with type 1 diabetes increased 45% from 2001 to 2017 to 215 per 100,000, while the number with type 2 diabetes increased 95% to 67 per 100,000, according to a federally funded study published today in JAMA."
    ],
    [
        "Why Is Diabetes Increasing in the United States",
        "As per the National Diabetes Statistics Report (2020), around 34.2 million people in the United States have diabetes."
    ],
    [
        "Study Finds Undiagnosed Diabetes in U.S. Less Than Half of Current Estimates",
        "A new study from researchers at the Johns Hopkins Bloomberg School of Public Health estimates that the overall number of undiagnosed diabetes cases in the U.S. is significantly lower than current government estimates suggest."
    ]],
    [[
        "La diabetes en Estados Unidos se dispara a raíz de la pandemia",
        "Por segundo año consecutivo, las muertes por diabetes en Estados Unidos sobrepasaron las 100.000, una barrera que nunca se había superado antes de la pandemia. Las agencias de salud estadounidenses calculan que un tercio de los adultos del país llegarán a desarrollar diabetes si no se revierte esta tendencia."
    ],
    [
        "El número de personas con diabetes en las Américas se ha triplicado en tres décadas, según un informe de la OPS",
        "Washington D.C. 11 de noviembre de 2022 (OPS/OMS) - Las tasas crecientes de obesidad, dietas deficientes y la falta de actividad física, entre otros factores, han contribuido a que el número de adultos que viven con diabetes en la región de las Américas se haya triplicado en los últimos 30 años, según un nuevo informe de la Organización Panamericana de la Salud (OPS)."
    ],
    [
        "EE.UU.: los elevados precios de la insulina ponen en peligro vidas",
        "El hecho de que el Gobierno de Estados Unidos no garantice un acceso equitativo y asequible a la insulina viola el derecho a la salud de las personas con diabetes y provoca regularmente consecuencias trágicas para muchas de ellas, señaló Human Rights Watch en un informe publicado hoy."
    ],
    [
        "Aumento de la diabetes en niños y adolescentes",
        "Un estudio reciente descubrió que las tasas de nuevos casos de diabetes en niños y adolescentes aumentaron entre 2002 y 2012. Los investigadores observaron aumentos en las tasas de diabetes tanto tipo 1 como tipo 2."
    ],
    [
        "El índice de diabetes se estabiliza, El vínculo entre el tamaño de la cintura y El cáncer del seno, y las últimas noticias sobre las alergias al maní",
        "Luego de aumentos inquietantes de diabetes en adultos entre 1990 y 2008, el número total de personas que viven con la enfermedad y el número de nuevos diagnósticos parecen haberse estabilizado, según oficiales de salud estadounidenses."
    ],
    [
        "La tasa de obesidad en adultos de EE. UU. Supera el 42 por ciento; el más alto jamás registrado",
        "Tener obesidad es un factor de riesgo de consecuencias graves durante el COVID; La pandemia podría aumentar los niveles de obesidad en el futuro debido al aumento de la inseguridad alimentaria."
    ]]
  ]'),

  ('Health/healthy living 3', 'International', '["hl3-int-eng.png", "hl3-int-esp.png"]', '[
    [[
        "Diabetes",
        "Diabetes is a chronic disease that occurs either when the pancreas does not produce enough insulin or when the body cannot effectively use the insulin it produces. Insulin is a hormone that regulates blood glucose. Hyperglycaemia, also called raised blood glucose or raised blood sugar, is a common effect of uncontrolled diabetes and over time leads to serious damage to many of the body''s systems, especially the nerves and blood vessels."
    ],
    [
        "Global, regional, and national burden of diabetes from 1990 to 2021, with projections of prevalence to 2050: a systematic analysis for the Global Burden of Disease Study 2021",
        "Diabetes is one of the leading causes of death and disability worldwide, and affects people regardless of country, age group, or sex."
    ],
    [
        "Global and regional diabetes prevalence estimates for 2019 and projections for 2030 and 2045: Results from the International Diabetes Federation Diabetes Atlas, 9th edition",
        "The global diabetes prevalence in 2019 is estimated to be 9.3% (463 million people), rising to 10.2% (578 million) by 2030 and 10.9% (700 million) by 2045."
    ],
    [
        "Global Economic Burden of Diabetes in Adults: Projections From 2015 to 2030",
        "The global costs of diabetes and its consequences are large and will substantially increase by 2030. Even if countries meet international targets, the global economic burden will not decrease. Policy makers need to take urgent action to prepare health and social security systems to mitigate the effects of diabetes."
    ],
    [
        "Trends in the incidence of diabetes mellitus: results from the Global Burden of Disease Study 2017 and implications for diabetes mellitus prevention",
        "The worldwide incident cases of diabetes mellitus has increased by 102.9% from 11,303,084 cases in 1990 to 22,935,630 cases in 2017 worldwide, while the ASIR increased from 234 /100,000 persons (95% UI, 219-249) to 285/100,000 persons (95% UI, 262-310) in this period [EAPC = 0.87, 95% confidence interval (CI):0.79-0.96]."
    ],
    [
        "Global burden of diabetes: new study reveals alarming prevalence and projections for 2050",
        "This indicates that more than six out of 100 people worldwide have diabetes. The prevalence uncertainty interval (UI) ranged from 5.8% to 6.5%, reflecting the variability and potential range of estimates."
    ]],
    [[
        "Los casos de diabetes a nivel mundial se dispararán de 529 millones a 1.3 mil millones para el año 2050",
        "Se pronostica un incremento masivo de casos de diabetes en todos los países "
    ],
    [
        "Prevalencia de diabetes, características epidemiológicas y complicaciones vasculares",
        "La prevalencia global de diabetes resultó del 8.5% con intervalo de confianza del 95% (IC95%): 8.3-8.6 (12,832 de un total de 150,725 afiliados). El estrato etario con mayor prevalencia fue el grupo entre 65 y 80 años, con un 15.7% (IC95%: 15.3-16.1)."
    ],
    [
        "El número de personas con diabetes en las Américas se ha triplicado en tres décadas, según un informe de la OPS",
        "Washington D.C. 11 de noviembre de 2022 (OPS/OMS) - Las tasas crecientes de obesidad, dietas deficientes y la falta de actividad física, entre otros factores, han contribuido a que el número de adultos que viven con diabetes en la región de las Américas se haya triplicado en los últimos 30 años, según un nuevo informe de la Organización Panamericana de la Salud (OPS)."
    ],
    [
        "Epidemia de diabetes: un aumento alarmante de personas que viven con diabetes en todo el mundo",
        "El último Atlas de la Diabetes de la FID informa que la prevalencia mundial de diabetes ha alcanzado el 10,5%, con casi la mitad (44,7%) de las personas adultas sin diagnosticar."
    ],
    [
        "Epidemiología de la diabetes en Argentina",
        "Durante los últimos 50 años se ha observado un marcado aumento en el número de personas con diabetes, con recientes incrementos alarmantes tanto en países en desarrollo como en el mundo desarrollado."
    ],
    [
        "Visión epidemiológica de la diabetes mellitus.",
        "La Prevalencia de la diabetes mellitus, cuya forma más común es la diabetes tipo 2 (DM2) ha alcanzado proporciones epidémicas durante los primero años del siglo XXI."
    ]]
  ]'),

  ('Health/healthy living 4', 'Mexico', '["hl4-mex-eng.png", "hl4-mex-esp.png"]', '[
    [[
        "Mexico Perspective: Air Pollution",
        "According to the World Bank, air pollution kills nearly 33,000 Mexicans every year. Nearly 20,000 of these deaths are due to outdoor air pollution, mainly in towns and cities. The remaining 13,000 are from household air pollution, caused by cooking with wood and other solid fuels. This affects mainly rural communities."
    ],
    [
        "Air quality in Mexico",
        "Air quality index (AQI) and PM2.5 air pollution in Mexico"
    ],
    [
        "Air Pollution in Mexico City",
        "Mexico City was once named as the world''s most polluted city in the world, but according to IQAir, a Swiss company which keeps track of the air quality of cities around the globe, Mexico City has now dropped down to the 917th most polluted city in the world in 2021. Though its concentration of airborne particles (PM 2.5) still currently exceeds the guideline of the World Health Organization (WHO), yet the colossal improvement is undoubtable. What has been done to successfully reduce air pollution in Mexico City? And what lessons can other cities learn from it?"
    ],
    [
        "Mexico City''s air quality worsens in 2022, and post-omicron activities aren''t the only cause",
        "Meteorological conditions have also played a role in this year''s heightened levels of smog in the Mexico City metropolitan area, raising concerns of health officials and environmentalists."
    ],
    [
        "The Unequal Effects of Air Pollution on Health and Income in Mexico City",
        "Perched 7,300 feet above sea level in a valley wrapped round by mountains and volcanoes, Mexico City has long suffered from thick layers of smog produced by cars, factories, and wildfires. Among the worst hazards of that air pollution for its 21 million inhabitants is PM 2.5, inhalable fine particulate matter. People exposed to PM 2.5 can suffer from coughing, shortness of breath, bronchitis, respiratory infections and heart problems. When the city government closes schools or orders cars off the roads on days of particularly heavy smog, the danger from PM 2.5 is a principal concern."
    ],
    [
        "Mexico''s mega city advances the fight for cleaner air",
        "Mexico City joins the BreatheLife campaign with a clean air program that benefits over 8.8 million people"
    ]],
    [[
        "La contaminación ambiental, el monstruo silencioso que mata cada año a más de 8.000 personas en Ciudad de México",
        "La capital acumula contingencias ambientales por el alto nivel de ozono ante las medidas insuficientes del Gobierno para luchar contra la polución"
    ],
    [
        "Calidad del aire en Ciudad de México",
        "Índice de calidad del aire (ICA) y contaminación del aire PM2.5 en Ciudad de México"
    ],
    [
        "¿Fuchi? 99.5% de mexicanos están expuestos a contaminación del aire",
        "México tiene la intención de presentar nuevos objetivos climáticos en la COP27 en Egipto."
    ],
    [
        "¿Qué contaminantes flotan en el aire de la Ciudad de México y cómo afectan a la salud?",
        "La contaminación ambiental tiene en alerta a la Zona Metropolitana del Valle de México (ZMVM), donde se han registrado en los últimos días niveles altos de contaminación por el humo de los incendios y la contaminación."
    ],
    [
        "Cuando se trata de combatir la contaminación del aire en la Ciudad de México, los datos son poder",
        "La Ciudad de México es conocida en todo el mundo por su cultura y su rica historia, pero también por su combate contra la contaminación del aire. En este sentido, la información proporcionada por el avanzado sistema de referencia para el monitoreo de la calidad del aire con el que cuenta la ciudad ha sido crucial para desencadenar acciones que han mejorado de manera significativa la calidad del aire durante los últimos treinta años."
    ],
    [
        "¿Cuánto le costará a México la contaminación del aire?",
        "La falta de políticas coordinadas para reducir las emisiones contaminantes, mejorar el transporte público y desincentivar el uso del automóvil pueden costarle al país al final del año 2018 más de 20,000 millones de pesos, 37,000 muertes prematuras, 100,000 hospitalizaciones y más de 6 millones de consultas médicas relacionadas con la mala calidad del aire."
    ]]
  ]'),

  ('Health/healthy living 4', 'US', '["hl4-us-eng.png", "hl4-us-esp.png"]', '[
    [[
        "Air Quality - National Summary",
        "EPA creates air quality trends using measurements from monitors located across the country. The table below show that air quality based on concentrations of the common pollutants has improved nationally since 1980."
    ],
    [
        "A quarter of Americans live with polluted air, with people of color and those in Western states disproportionately affected, report says",
        "About 1 in 4 people in the United States - more than 119 million residents - live with air pollution that can hurt their health and shorten their lives, according to a new report from the American Lung Association. People of color are disproportionately affected, as are residents of Western cities."
    ],
    [
        "135 million Americans are breathing unhealthy air, American Lung Association says",
        "More than 135 million Americans live with polluted air, placing their health and lives at risk, according to an American Lung Association report published Wednesday."
    ],
    [
        "Air Pollution in United States",
        "Explore national- and state-level data for hundreds of health, environmental and socioeconomic measures, including background information about each measure. Use features on this page to find measures; view subpopulations, trends and rankings; and download and share content."
    ],
    [
        "More than one-third of Americans live in places with unhealthy levels of air pollution: Report",
        "More than one-third of Americans live in places with unhealthy levels of air pollution, according to an annual report published by the American Lung Association. The 24th iteration of the State of the Air report determined 19 million fewer Americans live in these areas."
    ],
    [
        "Revealed: the 10 worst places to live in US for air pollution",
        "The worst 10 hotspots for fine particle air pollution in the US have been revealed by The Guardian in an analysis using cutting-edge modelling."
    ]],
    [[
        "Riesgos para la salud en Estados Unidos Estados por la contaminación del aire por petróleo y gas",
        "Esta mezcla de contaminantes incluye metano, un contaminante climático muy potente, y enormes cantidades de contaminantes atmosféricos tóxicos y contaminantes que provocan el smog de ozono."
    ],
    [
        "Contaminación del aire en EE. UU.: cómo protegerse del humo",
        "El noreste de EE. UU. experimenta niveles históricamente altos de contaminación debido a incendios forestales en Canadá. Los expertos dicen que estos casos aumentarán en el futuro a medida que el clima se caliente."
    ],
    [
        "Estados Unidos: la calidad del aire mejora en el este y el humo se desplaza al sur",
        "Este viernes, ciudades como Nueva York o Washington D. C. mejoraron su nivel de contaminación en el aire provocada por los incendios en la vecina Canadá. Ahora, los expertos estiman que afectará a otras ciudades del sur del país como Saint Louis o Missouri, mientras el alcance del humo ha llegado incluso a Noruega."
    ],
    [
        "La reducción de la contaminación del aire en los EE. UU. durante el cierre por la pandemia se vinculó a una reducción en los ataques cardíacos",
        "Sesiones científicas de la American Heart Association del 2021, presentación P2315/3096"
    ],
    [
        "Calidad del aire en los Estados Unidos: el ranking de ciudades con más contaminación",
        "Los Ángeles registra su peor cifra desde 2020, mientras que, en la misma región, se encuentran Bakersfield, Visalia y Fresno-Madera-Hanford; cuáles son los riesgos respiratorios de este fenómeno"
    ],
    [
        "Las tendencias de contaminación de aire demuestran un aire más limpio y una economía creciente",
        "Hoy la Agencia de Protección Ambiental de EE. UU. (EPA, por sus siglas en inglés) publicó su informe anual sobre la calidad del aire que da seguimiento al progreso de la nación en mejorar la calidad del aire desde promulgar la Ley de Aire Limpio. “El aire de nuestra nación: estado y tendencias hasta el 2017” documenta las mejoras considerables en la calidad del aire en los Estados Unidos por más de 45 años."
    ]]
  ]'),

  ('Health/healthy living 4', 'International', '["hl4-int-eng.png", "hl4-int-esp.png"]', '[
    [[
        "Global Health Impacts of Air Pollution",
        "Exposure to air pollution has serious health consequences. We use a rigorous process to assess the burden of disease from major air pollutants in terms of the deaths and years of healthy life lost borne by populations as a whole in every country of the globe and how these impacts have changed over time."
    ],
    [
        "Air Pollution: Everything You Need to Know",
        "How smog, soot, greenhouse gases, and other top air pollutants are affecting the planet—and your health."
    ],
    [
        "Global air pollution poses huge risk to human health, Air Quality Life Index finds",
        "South Asian residents expected to lose five years from lives on average if current high pollution levels persist"
    ],
    [
        "Half the world''s population are exposed to increasing air pollution",
        "Air pollution is high on the global agenda and is widely recognised as a threat to both public health and economic progress. The World Health Organization (WHO) estimates that 4.2 million deaths annually can be attributed to outdoor air pollution. Recently, there have been major advances in methods that allow the quantification of air pollution-related indicators to track progress towards the Sustainable Development Goals and that expand the evidence base of the impacts of air pollution on health."
    ],
    [
        "Air Pollution and Your Health",
        "Air pollution is a familiar environmental health hazard. We know what we''re looking at when brown haze settles over a city, exhaust billows across a busy highway, or a plume rises from a smokestack. Some air pollution is not seen, but its pungent smell alerts you."
    ],
    [
        "Air Pollution Around The World",
        "The photo on the right above shows Paris, France in December of 2016. That winter, Paris experienced its worst air quality in over 10 years. The air in Paris, or any other location, changes through time. Air quality is shaped by both human and natural activities that create air pollution, as well as by natural processes like wind and precipitation that move and clean air."
    ]],
    [[
        "Solo 13 países y territorios tuvieron una calidad del aire ''saludable'' en 2022",
        "Según un nuevo informe, solo 13 de los países y territorios del mundo tuvieron una calidad del aire ''saludable'' el año pasado, ya que la contaminación atmosférica alcanzó niveles alarmantes en 2022."
    ],
    [
        "Contaminación del aire: causas y tipos",
        "La contaminación del aire es uno de los principales retos a los que nos enfrentamos. Los efectos de la contaminación atmosférica pueden ser irreversibles para la vida en el planeta, por lo que hay que trabajar para evitar, reducir, compensar o mitigar la contaminación del aire."
    ],
    [
        "Contaminación del aire ambiente (exterior)",
        "La contaminación del aire es uno de los mayores riesgos ambientales que existen para la salud. Mediante la disminución de los niveles de contaminación del aire los países pueden reducir la carga de morbilidad derivada de accidentes cerebrovasculares, cardiopatías, cánceres de pulmón y neumopatías crónicas y agudas, entre ellas el asma."
    ],
    [
        "La contaminación del aire mata a 10 millones de personas al año. ¿Por qué nos parece normal?",
        "Por cada 1000 personas vivas en la Tierra, 973 inhalan toxinas con regularidad, solo 27 no lo hacen; lo cual significa, casi con toda seguridad, que tú también lo haces."
    ],
    [
        "Todo el mundo respira niveles nocivos de contaminación atmosférica",
        "Sólo el 0,001 % de la población está expuesta a grados de contaminación considerados seguros por la Organización Mundial de la Salud, según un nuevo estudio publicado esta semana en la revista científica ''Lancet Planet Health''."
    ],
    [
        "El mundo entero debe unirse para combatir la contaminación atmosférica, que mata a 7 millones de personas al año",
        "El Día Internacional del Aire Limpio por un cielo azul, que se celebra cada año el 7 de septiembre, está dirigido a sensibilizar y movilizar la acción mundial para hacer frente a la contaminación del aire, una problemática que el Secretario General de las Naciones Unidas, António Guterres, calificó recientemente de ''emergencia mundial''."
    ]]
  ]'),

  ('Science, Computers & Technology 1', 'Mexico', '["sct1-mex-eng.png", "sct1-mex-esp.png"]', '[
    [[
        "Top Social Media Networks Websites in Mexico Ranking Analysis for September 2023",
        "facebook.com ranked number 1 and is the most visited Social Media Networks website in Mexico in September 2023, followed by whatsapp.com as the runner up, and instagram.com ranking at 3rd place as the leaders of the Social Media Networks websites in Mexico."
    ],
    [
        "Reach of leading social networks in Mexico as of May 2023",
        "According to a May 2023 survey, WhatsApp was the most popular social media platform in Mexico. At that time, 95.6 percent of those interviewed said they had an active account on the messaging app. Also owned by Meta Platforms Inc., Facebook and Instagram ranked second and third, being used by 84.9 and 76.2 percent of respondents, respectively."
    ],
    [
        "Social Media in Mexico: which are the most used social networks",
        "As we have told you on other occasions, the Mexican digital market is one of the most powerful and dynamic in the entire Latam area. In Mexico, 74% of the population is already online, which translates into 102.5 million active users on both websites and social networks. The statistics were exposed by the Digital 2022 study carried out by We Are Social and Hootsuite to measure the state of Mexico’s connection. The results show that the number of users has been increasing since 2014."
    ],
    [
        "Mexico Social Media",
        "Mexico currently has approximately 85 million internet users as of June of 2017, a number which has increased exponentially since 2015, when the number was around 58 million. Currently, penetration is around 65.3%. Mexico has around 76 million social media users, or around 59% of the total population. The number of social media users is up 27% since January of 2016."
    ],
    [
        "Social Media in Mexico - 2023 Stats & Platform Trends",
        "Mexico has a slightly lower internet and mobile usage compared to South America, with 72% and 97% penetration rate respectively. Despite this, Mexico’s internet usage is diverse due to its large Spanish-speaking population and frequent travel with the US."
    ],
    [
        "The State of Social Media in Mexico",
        "Due to the increasing popularity of social media sites worldwide, we explored the “State of Social Media in Mexico” and uncovered some interesting data that places Mexico in a leadership position in this category worldwide."
    ]],
    [[
        "Redes sociales con el mayor porcentaje de usuarios en México en 2022",
        "Facebook sigue siendo la red social más popular en México. Casi un 93% de la población mexicana utilizaba la mencionada plataforma en 2022. Completaban el podio WhatsApp (que le seguía muy de cerca con un 92,2%) y Facebook Messenger con más de un 80%."
    ],
    [
        "Las 5 redes sociales más usadas en México",
        "Existen muchas redes sociales, un día puede aparecer una nueva y al día siguiente desaparecer otra, sin embargo, el usuario mexicano tiene una elección muy marcada entre las redes sociales que más utiliza."
    ],
    [
        "Redes sociales más usadas en México: cómo vender más en línea",
        "Hoy en día, las redes se han convertido en excelentes canales de ventas. Por eso, te vamos a contar cuáles son las redes sociales más usadas en México y cómo aprovecharlas para vender más."
    ],
    [
        "Uso de redes sociales en México: 94 millones acceden al social media, la mayoría a Facebook (2023)",
        "El acceso a internet en nuestro país avanza a paso veloz y con la pandemia su evolución fue mayor. Hoy en día somos 78.6 % de la población mexicana los que navegamos en la Word Wide Web, predominantemente a través de dispositivos móviles, lo que a su vez ha generado más visitas a websites y un uso frecuente de las redes sociales en México, traduciéndose en 94 millones de usuarios activos de las diferentes plataformas que existen para conectarnos con los demás."
    ],
    [
        "Día de las redes sociales: ¿Cuáles son las plataformas que más se usan en México?",
        "De acuerdo con un estudio de Statista, Facebook continúa como la plataforma más popular en el país"
    ],
    [
        "Las 5 redes sociales más utilizadas por los jóvenes en México (2022)",
        "En México 9 de cada 10 jóvenes tienen acceso a un teléfono celular. Y la aplicación social más utilizada por ellos es el paquete de mensajería instantánea, WhatsApp. Facebook e Instagram ocupan el segundo y tercer lugar de las redes sociales más usadas por la población de entre 12 y 29 años."
    ]]
  ]'),

  ('Science, Computers & Technology 1', 'US', '["sct1-us-eng.png", "sct1-us-esp.png"]', '[
    [[
        "Leading social media websites in the United States as of August 2023, based on share of visits",
        "In August 2023, Facebook accounted for around 50 percent of all social media site visits in the United States, confirming its position as the leading social media website by far. Other social media platforms, despite their popularity, had to make do with smaller shares of visits across desktop, mobile, and tablet devices combined. Instagram ranked second with 15.85 percent of all U.S. social media site visits, while Pinterest accounted for 14.69 percent of the total visits in the country. Additionally, the U.S. is home to the third largest social media audience worldwide."
    ],
    [
        "Top 9 Growing Social Media Platforms In The US",
        "Social media is constantly changing and - as a business or agency owner - you need to know what''s in and what''s out to make sure your social media campaigns are reaching the right people."
    ],
    [
        "The 15 Biggest Social Media Sites and Apps [2023]",
        "Social networking platforms are locked in a never-ending game of musical chairs."
    ],
    [
        "The 6 Biggest, Baddest, Most Popular Social Media Platforms (+How to Wield Their Power)",
        "I''m 99% sure you can already guess the most popular social media sites in 2022."
    ],
    [
        "Social Media Use in 2021",
        "A majority of Americans say they use YouTube and Facebook, while use of Instagram, Snapchat and TikTok is especially common among adults under 30."
    ],
    [
        "Top Social Media Statistics And Trends Of 2023",
        "Recent announcements at Google I/O have propelled social media into an even larger share of the web spotlight. Platforms such as TikTok, Instagram, Facebook and YouTube are poised to become powerful marketing stages for your brand to interact with your audience."
    ]],
    [[
        "¿Cuáles son las redes sociales más utilizadas en Estados Unidos en 2021?",
        "Facebook continúa siendo una de las redes sociales más utilizadas en Estados Unidos con más 175 millones de usuarios activos."
    ],
    [
        "Las 3 redes sociales favoritas de los adolescentes de Estados Unidos (y ninguna es Facebook)",
        "La salida de Facebook de los adolescentes estadounidenses es cada vez mayor."
    ],
    [
        "Volumen de usuarios mensuales de las apps de redes sociales más populares en Estados Unidos a septiembre de 2019",
        "Esta estadística muestra el volumen de usuarios mensuales de las apps de redes sociales más populares en Estados Unidos a septiembre de 2019. La app de la red social Instagram se situó la segunda del ranking con más de 121 millones de usuarios mensuales, por delante de Facebook Messenger, tercera en la lista con 106,4 millones de usuarios al mes."
    ],
    [
        "EE.UU.: USO DE LAS REDES SOCIALES EN 2021",
        "La mayoría de los estadounidenses dicen que utilizan YouTube y Facebook, mientras que el uso de Instagram, Snapchat y TikTok es especialmente común entre los adultos menores de 30 años."
    ],
    [
        "¿Qué red social usan más en EEUU?",
        "La red social más popular es Facebook, que ha sido la reina suprema desde su creación. ¿Cuánta gente usa Facebook? Tiene cerca de 2.800 millones de usuarios activos mensuales, y alrededor de 7 de cada 10 adultos en los Estados Unidos (69 %) afirman usar Facebook de alguna manera.Las principales redes sociales en EE.UU."
    ],
    [
        "¿Cuál es la red social más utilizada en Estados Unidos?",
        "Redes Sociales más usadas en Estados Unidos 2023 Ya sabemos que las redes sociales más usadas en Estados Unidos son Facebook, YouTube, Instagram, TikTok, Linkedin, Snapchat, Twitter y Pinterest e Instagram considerando el mayor tiempo de permanencia."
    ]]
  ]'),

  ('Science, Computers & Technology 1', 'International', '["sct1-int-eng.png", "sct1-int-esp.png"]', '[
    [[
        "Most popular social networks worldwide as of January 2023, ranked by number of monthly active users",
        "Market leader Facebook was the first social network to surpass one billion registered accounts and currently sits at more than 2.9 billion monthly active users. Meta Platforms owns four of the biggest social media platforms, all with over one billion monthly active users each: Facebook (core platform), WhatsApp, Facebook Messenger, and Instagram. In the final quarter of 2022, Facebook reported over 3.7 billion monthly core Family product users."
    ],
    [
        "The rise of social media",
        "Social media sites are used by more than two-thirds of internet users. How has social media grown over time?"
    ],
    [
        "134 Social Media Statistics You Need To Know For 2023",
        "We''ve rounded up over 130 social media statistics that are useful and informative to represent the 4.8 billion social media users worldwide."
    ],
    [
        "Number of social media users worldwide from 2017 to 2027",
        "Social media usage is one of the most popular online activities. In 2022, over 4.59 billion people were using social media worldwide, a number projected to increase to almost six billion in 2027."
    ],
    [
        "Social Media Users — Global Demographics (2023)",
        "Social media platforms are on a meteoric rise globally. Facebook is the leader in this race, with 3.03 billion members. But did you ever wonder how many people use social media? We did, too, so we did our research and found that as of 2023, 4.9 billion out of the 8.1 billion people on the globe use social media."
    ],
    [
        "More than half of the people on Earth now use social media",
        "Hootsuite and We Are Social release Q3 results on the growth of social media since the global onset of COVID-19"
    ]],
    [[
        "Tiempo medio empleado a diario por los internautas en las redes sociales a nivel mundial entre 2012 y 2022",
        "A partir de 2022, el uso promedio diario de las redes sociales por parte de los usuarios de Internet a nivel mundial se situó en torno a 151 minutos por día, frente a los 148 minutos de 2021."
    ],
    [
        "Nuevas estadísticas del uso de Redes Sociales que quieres y debes conocer",
        "Cómo consumen los usuarios las redes sociales? Las estadísticas del uso de redes sociales es algo que has de tener siempre muy presente. Estar al día te hará saber cómo abarcar la mayoría de tus proyectos. El nuevo marketing ya no sabe existir sin las redes, así que toma nota de todo que seguro te va a servir para crear tus próximas estrategias."
    ],
    [
        "Redes Sociales: casi el 60% de la población mundial ya las usa",
        "De los más de 5,000 millones de personas del mundo que usan internet, casi el 95% utiliza las redes sociales, justo ahora que varias plataformas luchan por su sitio en el tablero, con el auge de TikTok, el poder de Meta y el cambio de Twitter a X."
    ],
    [
        "Las redes sociales en el mundo",
        "Miles de millones de personas se comunican mediante plataformas como Facebook, Twitter o Instagram"
    ],
    [
        "Cuáles son las redes sociales con más usuarios del mundo (2023)",
        "No podemos imaginar al mundo sin redes sociales: una afirmación que se refuerza cada día y más desde que el confinamiento por el Covid-19 impulsó aún más el uso de estas plataformas digitales. En este contexto de crecimiento del social media, Facebook ha logrado permanecer en el liderato de las redes sociales con más usuarios del mundo, de acuerdo con el último informe Digital 2023 realizado por We Are Social."
    ],
    [
        "Los usuarios de las redes sociales equivalen a más del 58 % de la población mundial",
        "El dato surge del informe Digital 2022, realizado por We Are Social y Hootsuite. Cuáles son las plataformas más populares y el impacto del gaming"
    ]]
  ]'),

  ('Science, Computers & Technology 2', 'Mexico', '["sct2-mex-eng.png", "sct2-mex-esp.png"]', '[
    [[
        "What is the most used cell phone brand in Mexico?",
        "Have you ever wondered which cell phone brand is the most popular in Mexico? If you are like most people, you probably have some ideas in mind, but do you really know which is the most used cell phone brand in Mexico?"
    ],
    [
        "Market share held by leading smartphone brands in Mexico from January 2020 to July 2023",
        "In July 2023, Samsung was the brand with the highest market share in Mexico, accounting for nearly 23 percent of the smartphone web traffic in the North American country. As of November 2022, the brand also ranked first in South America."
    ],
    [
        "This smartphone manufacturer beat Samsung and Apple in Mexico",
        "On average, Samsung is the world''s largest smartphone manufacturer. However, it doesn''t lead all its rivals in every market and performs better in some regions than others. In some markets, Samsung is the leading brand by a wide margin. While in others, such as Mexico, the company is trying to maintain its spot on the podium."
    ],
    [
        "Popular Android phones and tablets in Mexico",
        "Most used Android phones and tablets in Mexico."
    ],
    [
        "The 10 best-selling mobiles in Mexico during the second quarter of 2023",
        "Mexico is an extremely competitive smartphone market. It is located in the second place in Latin America, with a huge base of potential consumers. In addition, the lack of tariff barriers and the growing purchasing power of the population make it an attractive market for smartphone companies."
    ],
    [
        "Most popular Android phones and tablets in Mexico as of July 2023",
        "As of July 2023, the most popular smartphone models in Mexico were the Motorola Moto G(20) and the Huawei HONOR 9X, with a market share of two percent each, followed by the Motorola Moto G(60), with a share of 1.8 percent. Even so, Samsung was still the most used smartphone brand in the North American country in 2022."
    ]],
    [[
        "Los 5 celulares más vendidos en México en 2023",
        "Un reciente estudio reveló que los modelos más vendidos representa el 35 por ciento del mercado total de teléfonos inteligentes durante el segundo trimestre de este 2023."
    ],
    [
        "¿Buscas un smartphone? Estos son los más vendidos en México",
        "El mercado de los smartphones es uno de los más competidos y atractivos por sus pocas barreras de importación de dispositivos, algo que ha dado pie a la llegada de más jugadores los últimos años; si bien poco a poco los consumidores buscan teléfonos de gamas más altas, compatibles con 5G, aun los modelos de la gama media y baja siguen encabezando las preferencias ¿Cuáles son los más vendidos?"
    ],
    [
        "¿Cuál es la marca de smartphones más vendida en México?",
        "El mercado de los smartphones en México es uno de los principales dentro del sector tecnológico. De acuerdo con el Inegi, hay casi 92 millones de personas que utilizan la telefonía celular para comunicarse dentro del territorio mexicano. "
    ],
    [
        "Estos fueron los celulares más vendidos en México durante el 2T23",
        "Durante el segundo trimestre de 2023, los smartphones más vendidos en México representaron el 35% del mercado total de celulares del país, que es el segundo mercado de teléfonos inteligentes más importante de América Latina."
    ],
    [
        "LISTA de smartphones más vendidos en México en 2023",
        "A pesar de la creciente disponibilidad de dispositivos 5G, solo dos modelos en la lista de los más vendidos son compatibles con esta tecnología"
    ],
    [
        "¿Qué marcas de celulares se pueden comprar en México? | Octubre 2023",
        "El mercado de la telefonía celular es una competencia muy cerrada en México y cada vez más empresas ven al país como una oportunidad demasiado buena para crecer."
    ]]
  ]'),

  ('Science, Computers & Technology 2', 'US', '["sct2-us-eng.png", "sct2-us-esp.png"]', '[
    [[
        "Smartphones in the U.S. - statistics & facts",
        "Since the introduction of the smartphone, the device has played an increasingly important role in people''s life, to the point that today, we could not imagine a day without it. The smartphone market in the United States is one of the world''s largest, with over 310 million smartphone users as of 2023."
    ],
    [
        "US Smartphone Market Share: By Quarter",
        "US smartphone shipments declined 24% YoY. Low-end smartphone sale declines were the biggest contributing factor to the downturn."
    ],
    [
        "The Top 10 Selling Smartphones Of 2023 Are All From Just 2 Companies",
        "No smartphone manufacturer other than Apple or Samsung cracked the list of the top 10 selling smartphones on the planet in the first half of 2023, according to a new report."
    ],
    [
        "The Unexpected Reason Apple Is Dominating the U.S. Smartphone Market",
        "It''s not just lavish marketing and the threat of green bubbles—Apple''s commitment to supporting old phones has allowed it to capture a part of the market once cornered by inexpensive Android devices"
    ],
    [
        "iOS vs Android Market Share: Do More People Have iPhones or Android Phones?",
        "Android holds the global market share largely due to its affordability compared to Apple worldwide. However, Apple''s cost spreading in addition to its branding and presence in pop culture give it an edge in the U.S. market space."
    ],
    [
        "US Smartphone Market Share (Oct 2023)",
        "In 2023, Apple leads the smartphone yearly market share in the United States at 57.93%, followed by Samsung at 27.45%. Together, they have the bulk of the market share, with a total of 85.38% combined. Lenovo-acquired Motorola takes third place at 4.44%."
    ]],
    [[
        "Aquí están, estos son: los celulares más vendidos en el 2023",
        "La competencia comercial entre los Estados Unidos y China impactó en forma demoledora en el mercado mundial de telefonía móvil: de acuerdo con un informe de la consultora Omdia, entre los 10 celulares más vendidos en el primer semestre de este año no hay ninguno de una marca china."
    ],
    [
        "¿Cuál es el teléfono más vendido en Estados Unidos?",
        "Apple tiene un éxito incontestable en Estados Unidos, situando habitualmente entre los primeros puestos de móviles más vendidos a varios de sus iPhone."
    ],
    [
        "Solo dos Android entre los móviles más vendidos en Estados Unidos en lo que llevamos de 2019",
        "Estados Unidos, con una población de 327,2 millones de habitantes es uno de los principales mercados de smartphones a nivel mundial, y, tradicionalmente, ha sido el feudo de Apple, empresa que nació en el país norteamericano, y que está muy implantada allí. De hecho, algunas encuestan afirman que la mayoría de estadounidenses se comprarían un iPhone como su próximo móvil."
    ],
    [
        "Estos son los dos Android que se venden más que el iPhone 11 Pro en Estados Unidos",
        "Estados Unidos es el país natal de Apple, y no sólo eso, sino que también es el país en el que la compañía de la manzana cuenta con una mayor cuota de mercado, es decir, es el mercado fuerte de la compañía, y como tal, suele tener una posición dominante en la lista de fabricantes."
    ],
    [
        "Las marcas de teléfonos celulares más vendidas en Estados Unidos y México",
        "El uso de teléfonos inteligentes en todo el mundo se ha disparado gracias a los avances tecnológicos que han hecho posible contar con dispositivos más potentes y versátiles."
    ],
    [
        "Top 10 - Tienda de celulares en USA: ¿Dónde comprar? (2023)",
        "¿Estás buscando un nuevo teléfono móvil? No busques más que en nuestra lista de las 10 mejores tienda de celulares para comprar uno en Estados Unidos."
    ]]
  ]'),

  ('Science, Computers & Technology 2', 'International', '["sct2-int-eng.png", "sct2-int-esp.png"]', '[
    [[
        "21 Best Selling Phones of All Time",
        "In this article, we take a look at the 21 Best Selling Phones of All Time. For more such phones, go to 5 Best Selling Phones of All Time."
    ],
    [
        "Global Smartphone Shipments Market Data (Q3 2021 - Q2 2023)",
        "Among the top five brands, Apple experienced the least YoY shipment decline. Among the top 10 brands, Tecno and Infinix, part of the Transsion Group, saw double digit annual growth."
    ],
    [
        "iPhone 14 Pro Max tops global smartphone shipments as people shun budget phones for top-end devices",
        "Last year, the iPhone 13 was the bestselling device on the market, indicating consumers were still buying flagship devices but at the entry level rather than the top end."
    ],
    [
        "Top 10 Best-Selling Mobile Phones in the World in 2022",
        "The mobile phone market gets a long list of products every year. However, some of these devices sell far better than others."
    ],
    [
        "Most Popular Mobile Phone Brands | 2010/2023",
        "Which mobile phone brand has the most phones sold worldwide? According to the latest available data from February 2023, the cell phone brand that sells the most in 2023 is Apple."
    ],
    [
        "Apple First to Capture 8 Spots in List for Global Top 10 Smartphones",
        "In 2022, Apple became the first brand to capture eight spots in the list of top 10 best-selling smartphones, according to Counterpoint Research''s Global Monthly Handset Model Sales Tracker. The remaining two spots were taken by Samsung. The top-10 list contributed 19% of the total global smartphone sales in 2022, the same as in 2021."
    ]],
    [[
        "Top 10 de marcas de celulares más vendidas en el mundo: Samsung y Apple siguen líderes",
        "La caída en la demanda de celulares -aunque en volumen resulte insignificante- es un llamado de atención a la industria móvil."
    ],
    [
        "Estos son los diez celulares más populares del mundo en la primera mitad de 2023",
        "Un estudio analiza cuáles son los modelos más enviados en los últimos meses; hay teléfonos económicos y otros mucho más caros"
    ],
    [
        "Estas son las marcas de celulares más vendidas en el mundo",
        "Samsung y Apple son los líderes del mercado en los primeros meses del año, aunque las compras hayan disminuido"
    ],
    [
        "Las 10 marcas de celulares más vendidas del mundo: quién gana la guerra de los Android",
        "Casi todos los grandes fabricantes registraron caídas en los envíos de 2022 en comparación con el año anterior."
    ],
    [
        "Apple y Samsung, líderes indiscutibles del mercado de telefonía móvil",
        "Hoy se cumplen 50 años de la primera llamada realizada desde un teléfono móvil. Martin Cooper, ingeniero y gerente de sistemas de Motorola, es considerado el padre del teléfono móvil ya que hizo la primera llamada en un celular el 3 de abril de 1973, en Nueva York."
    ],
    [
        "Apple domina mercado de teléfonos de gama alta en el mundo, ¿cuáles son los más vendidos?",
        "Un estudio de los teléfonos celulares más vendidos y enviados en el mundo reveló que Apple y sus móviles de gama alta continúan ganando terreno en el mercado."
    ]]
  ]'),
  
  
  ('Science, Computers & Technology 3', 'Mexico', '["sct3-mex-eng.png", "sct3-mex-esp.png"]', '[
    [[
        "Awesome Things You Didn''t Know Mexico Gave the World",
        "Everyone knows that Mexico gave the world guacamole, tortillas, mariachi and pulque, not to mention tequila and mezcal, but what other inventions and discoveries can be traced back to this North American country? Here are some of the most awesome things you had no idea Mexico gave the world, from the Mesoamerican peoples to the modern day. Did you know – Culture Trip now does bookable, small-group trips? Pick from authentic, immersive Epic Trips, compact and action-packed Mini Trips and sparkling, expansive Sailing Trips."
    ],
    [
        "Gifts to the World: 7 Things That Were Made in Mexico",
        "When you think of things that were made in Mexico, the first things that come to mind are probably tequila, mariachi music, and enchiladas. Of course, all of these things are things that Mexico has gifted to the world, but what you probably don''t know is that Mexico is actually the origin of some of the things you probably use on a daily basis."
    ],
    [
        "The 30 Most Important Mexican Inventions (Current and Historical)",
        "The Mexican inventions Such as color television, chocolate or the contraceptive pill, demonstrate the talent and creativity of Mexicans, despite the economic and historical difficulties that the country has experienced."
    ],
    [
        "Great inventions that you did not know were Mexican",
        "In Mexico there has always been artistic, musical and cultural talent, but what few know is that there''s a great technological potential that has given life to many outstanding inventions."
    ],
    [
        "5 interesting Mexican inventions",
        "Mexico, the country of mariachis, pomp, color, and fun. Mexico is a country of amazing beaches, great culture, and great food. It is famous for tortillas, Mayan temples, burritos, tacos, and amazing people. You might know Mexico for ''Day of the Dead'' and its agricultural prowess. Something you might not know about Mexico is that it is the home of really amazing inventions! These five things that we have used or interacted with, in our daily lives are from Mexico. Check them out!"
    ],
    [
        "6 technological inventions that the world owes to Mexico",
        "Despite not being a power in technological development, the inventiveness of some Mexicans has made important contributions to the world."
    ]],
    [[
        "Los 10 inventos creados en México o por mexicanos",
        "México es reconocido por su riqueza, diversidad y gastronomía, la cual fue registrada como Patrimonio Inmaterial de la Humanidad por la Unesco. Sin embargo, el país Latinoamericano también ha contribuido a la historia de la humanidad con varios inventos. Te contamos cuáles llevan el sello ''Hecho en México''."
    ],
    [
        "Los 28 mejores inventos mexicanos y sus creadores",
        "Aunque la televisión a color es el más conocido, hay diversos inventos mexicanos que han cambiado la historia del mundo."
    ],
    [
        "Estos 5 inventos mexicanos cambiaron la historia de la humanidad",
        "El mundo no sería el mismo, si México no tuviera la relevancia que se ha forjado. Podrías pensar que nuestro país se dedica a esperar con los brazos cruzados, mientras le llega la tecnología desde otros lugares; pero eso está muy lejos de la realidad."
    ],
    [
        "De México para el mundo: los inventos más importantes del país norteamericano",
        "Los inventos de México han sido fundamentales en el mundo contemporáneo y han dejado precedentes para desarrollos posteriores."
    ],
    [
        "Cuáles son los mejores inventos mexicanos que cambiaron al mundo",
        "Desde la televisión a color hasta la pastilla anticonceptiva, en México han tenido su origen algunas de las invenciones más importantes a nivel mundial"
    ],
    [
        "5 inventos mexicanos que transformaron al mundo",
        "Los primeros inventos de los que se tienen registro, datan desde la prehistoria, y somos testigos de ellos a través de las vitrinas de los museos por todo el mundo. Inventar herramientas, el lenguaje, sistemas, etc. ha sido algo natural en el ser humano para mejorar su calidad de vida."
    ]]
  ]'),

  ('Science, Computers & Technology 3', 'US', '["sct3-us-eng.png", "sct3-us-esp.png"]', '[
    [[
        "Top 10: American Innovations",
        "This week Americans celebrated the 246th birthday of our country. We wanted to pile on by celebrating the 10 greatest inventions our nation has contributed to the world in that time. Some are big and some are small, but life changed for us all after these 10 ideas (in no particular order) hit the mainstream!"
    ],
    [
        "The Greatest American Inventions of the Past 50+ Years",
        "The past half-century has produced some of the most significant and astounding inventions ever developed in human history, and many notable ones came to life in the United States. From advances in computing to critical innovations in our medicine cabinets, many American inventions on this list play a role in our daily lives, while others have had a broader impact on society as a whole. All, however, are uniquely American creations."
    ],
    [
        "Twelve Notable American Inventions",
        "THE granting of patents in the United States was provided for in the Constitution, and on April 10, 1790, Congress specified how patents were to be issued. It was, however, not until an act of July 4, 1836, that the Patent Office was established under a Commissioner. In that year, too, the Patent Office started numbering serially the patents issued. In connexion with the centenary of these events, a list of twelve of the inventions that have done most to change life in America, together with the inventors'' names, has been drawn up."
    ],
    [
        "20 American Inventions That Changed the World",
        "From the mundane to the truly spectacular, numerous American inventions have changed the world. Here is a list of 20 things invented by Americans that have become part of everyday lives here and around the world."
    ],
    [
        "21 Most Important American Inventions of the 21st Century",
        "The human race has in a relatively short period of time traveled a path of innovation that took us from making fire and stone-tipped arrows on the plains of Africa to building smartphone apps and autonomous robots worldwide. Technological progress is not only continuing but is arguably accelerating, especially in areas that could quickly change the way we work, live, and survive in the coming decades."
    ],
    [
        "Made in the USA: American tech inventions",
        "The IBM 350 is widely considered to be the very first computer with a hard disk drive. Model 1 was announced on September 4, 1956. The data processing machine was used mainly for recording transactions for businesses."
    ]],
    [[
        "23 inventos estadounidenses que usamos en la vida diaria",
        "1. En 1858 se inventó el abrelatas en Waterbury, Connecticut. Antes las latas se tenían que abrir a martillazos."
    ],
    [
        "Cuatro grandes inventos de Edison más allá de sus bombillas",
        "Del primer aparato capaz de grabar y reproducir sonidos al precursor del moderno proyector de películas pasando por una batería alcalina para coches eléctricos. Analizamos los logros de uno de los inventores más famosos de la historia, que registró más de 1.000 patentes en Estados Unidos."
    ],
    [
        "Los 10 inventos estadounidenses que transformaron al mundo",
        "¿Qué persona no soñó en algún momento con registrar una invención? La invención número 10.000.000 ha sido registrada en Estados Unidos y este sistema de registro fue ideado más de dos siglos atrás."
    ],
    [
        "13 inventos estadounidenses más importantes del siglo",
        "Los avances en la medicina y las telecomunicaciones han traído grandes beneficios a la sociedad moderna"
    ],
    [
        "Descubrimientos que marcaron la historia de la Ciencia en EE.UU",
        "Demos un paseo por importantes acontecimientos y contribuciones del ámbito científico estadounidense, a fin de comprender por qué este país ubicado al norte de América es el destino de estudios más solicitado por quienes desean hacer carrera en el mundo de la Ciencia. ¿Quieres seguirle los pasos a Einstein, Bell y Tesla; quienes se mudaron a Estados Unidos para continuar con sus grandiosos trabajos?"
    ],
    [
        "Inventos patentados en EE.UU. que cambiaron la vida a millones de personas en todo el mundo",
        "El foco, el telégrafo y otras creaciones, han hecho que las personas se desenvuelvan de mejor manera."
    ]]
  ]'),

  ('Science, Computers & Technology 3', 'International', '["sct3-int-eng.png", "sct3-int-esp.png"]', '[
    [[
        "20 inventions that changed the world",
        "From the wheel 5,500 years ago to the birth control pill, these 20 inventions had huge ramifications and have helped humans shape the world around us."
    ],
    [
        "The Greatest Inventions In The Past 1000 Years",
        "During the technology-feeding frenzy of the late 1990s, many experts declared the Internet one of the most important inventions since the Industrial Revolution. However, after the happenings of the past few years that perspective has changed. While the Internet and the World Wide Web have certainly impacted the lives of many millions of people it is certainly not the greatest invention of the past millennium, it might not even make the top ten."
    ],
    [
        "Top 100 Famous Inventions and Greatest Ideas of All Time",
        "Many ideas and invention designs are groundbreaking, and they have the potential to completely change the way we perceive the world and carry out our daily duties. Some inventions are so ahead of their time that they set the path for future generations to build on. Brilliant people build gadgets, vehicles, and just about anything else you can think of. Throughout history, human civilizations have witnessed engineering marvels from time to time that help improve the quality of life and, in some cases, are overwhelmingly destructive. Here are 100 famous inventions and ideas you should know about."
    ],
    [
        "The 20 Greatest Inventions of All Time",
        "I was flat on my back and everybody standing around me had their faces covered. They covered my mouth and nose with a rubber mask; told me to close my eyes and start counting backwards from ten – which is exactly what I did. I tried to be brave, but it was scary. 10… 9… 8… Maybe I got to 5 or 4. And then I passed out. I was seven years old, and in the hospital to get my tonsils removed."
    ],
    [
        "35 of the most revolutionary inventions that shaped our world",
        "From ancient tools to the latest digital advances, these human inventions changed the world and transformed life on Earth."
    ],
    [
        "10 Inventions That Changed Your World",
        "You may think you can''t live without your tablet computer and your cordless electric drill, but what about the inventions that came before them? Humans have been innovating since the dawn of time to get us to where we are today. Here are just 10 of the hundreds of inventions that profoundly changed your world. What else would be on your list?"
    ]],
    [[
        "Los 15 inventos más importantes de la historia",
        "A lo largo de la historia, han habido multitud de inventos. Algunos han caído en el olvido, pero otros han supuesto grandes avances sociales y tecnológicos para la humanidad. ¿Sabes cuáles han sido aquellos que cambiaron el curso de la historia?"
    ],
    [
        "Los inventos más importantes de la humanidad",
        "La evolución humana está irremediablemente ligada inventos que han desempeñado un papel fundamental en el camino hacia lo que ahora somos. Sin la invención de determinados elementos muy probablemente el ser humano nunca hubiera desarrollado determinadas habilidades y nuestra evolución hubiera seguido otros derroteros."
    ],
    [
        "Los 10 inventos que han cambiado la historia del mundo",
        "Hay inventos que han cambiado la historia del mundo, han permitido que la humanidad avance en todas las direcciones posibles."
    ],
    [
        "Cuáles son los mejores inventos de la historia",
        "La evolución del ser humano está estrechamente vinculada a los inventos, los cuales han desempeñado un papel esencial en el trayecto hacia lo que es ahora la humanidad. Sin la aparición de ciertos elementos, el ser humano probablemente nunca hubiera podido desarrollar determinadas habilidades y su evolución hubiera continuado por otros derroteros."
    ],
    [
        "Inventos que cambiaron la historia del mundo",
        "Para responder la pregunta, ¿cuándo una invención puede considerarse que tiene trascendencia?, hicimos una selección de 10 artefactos o fenómenos que por su naturaleza esencial pueden considerarse los inventos que son el legado del mundo. Posiblemente, algunos de los enlistados te puedan resultar muy básicos, pero si lo piensas bien, aún así son la piedra […]"
    ],
    [
        "13 inventos que cambiaron la historia",
        "¿Sabes quién inventó estos artilugios o de dónde surgieron estas ideas que cambiaron para siempre la civilización? Recorremos la historia a través de este ingenioso TEST."
    ]]
 ]'),

  ('Science, Computers & Technology 4', 'Mexico', '["sct4-mex-eng.png", "sct4-mex-esp.png"]', '[
    [[
        "Mexico''s Nobel Prize winners",
        "Did you know the Nobel Prize has also been awarded three times to Mexican citizens?"
    ],
    [
        "Mexican Nobel Prize Winners",
        "The Nobel Prize is awarded to outstanding researchers, those who have invented revolutionary techniques or equipment, or have contributed to society. According to Alfred Nobelâs last wish, a Swedish inventor who created dynamite, he signed his will in Paris on the 27th of November, 1895."
    ],
    [
        "Mario Molina: Google Doodle celebrates Mexican Nobel Laureate who helped save the ozone layer",
        "Today''s Google Doodle celebrates the 80th birthday of Dr Mario Molina, a Mexican chemist who successfully convinced governments to come together to save the planet''s ozone layer. A co-recipient of the 1995 Nobel Prize in Chemistry, Dr Molina was one of the researchers who exposed how chemicals deplete Earth''s ozone shield, which is vital to protecting humans, plants, and wildlife from harmful ultraviolet light."
    ],
    [
        "Mexico Pride: Get to Know the Three Nobel Laureates from Mexico and Their Contributions",
        "Three Nobel laureates came from Mexico. This is the second-highest total in the entire Latin American region. Argentina takes the lead with five."
    ],
    [
        "Remembering Mario Molina, Nobel Prize-winning chemist who pushed Mexico on clean energy - and, recently, face masks",
        "Dr. Mario Molina, the Nobel Prize-winning scientist who died on Oct. 7 at age 77, did not become a scientist to change the world; he just loved chemistry. Born in Mexico City in 1943, Molina as a young boy conducted home experiments with contaminated water just for the fun of it."
    ],
    [
        "Mexican Nobel laureate Molina, ozone layer prophet, dies at 77",
        "Mexican scientist Mario Molina, who became his country''s first winner of the Nobel Prize for Chemistry for his work on the threat to the ozone layer from chlorofluorocarbons (CFCs), died on Wednesday at the age of 77."
    ]],
    [[
        "Ellos son los mexicanos que han ganado el Premio Nobel",
        "Ellos son los tres mexicanos que han tenido el honor de ganar el Premio Nobel."
    ],
    [
        "¿Qué mexicanos han ganado un Premio Nobel?",
        "México también ha sido representado en los premios Nobel y aquí te diremos quienes han sido los galardonados"
    ],
    [
        "Premios Nobel Mexicanos",
        "En este recurso podrás aprender sobre Alfred Nobel, mismo que le da nombre a este afamado premio. Así mismo, se enfoca en los tres mexicanos que han sido merecedores de este galardón en literatura (Octavio Paz), química (Mario Molina) y en el premio nobel de la paz (Alfonso G. Robles)."
    ],
    [
        "Quiénes son los mexicanos egresados de la UNAM que han ganado un Premio Nobel",
        "Este jueves se cumple un aniversario más de la fundación de la Máxima casa de estudios, de donde han salido algunas de las mentes más brillantes de México"
    ],
    [
        "De México para el Mundo: los Premios Nobel mexicanos",
        "Pocos reconocimientos tienen tanta importancia a nivel mundial como los Premios Nobel. Desde 1901 este galardón se encarga de reconocer la vida y el trabajo de las mentes más connotadas por sus aportaciones científicas y técnicas en el campo de la física, la química y la medicina, así como el desarrollo humano a través de la literatura y los esfuerzos para alcanzar la paz. A través de este reconocimiento se han podido hacer visibles no sólo el trabajo y la dedicación de las personas más brillantes de las ciencias y las humanidades, sino también las polémicas y las respuestas que los seres humanos son capaces de dar para resolver mediante el conocimiento los problemas de la sociedad, y colocarlos en la agenda de gobiernos y organizaciones con la finalidad de construir un mundo mejor."
    ],
    [
        "Quiénes son los mexicanos que han ganado un Premio Nobel",
        "A lo largo de la historia del Premio Nobel se ha reconocido el trabajo de tres mexicanos, pero ¿quiénes son estos ganadores?"
    ]]
  ]'),

  ('Science, Computers & Technology 4', 'US', '["sct4-us-eng.png", "sct4-us-esp.png"]', '[
    [[
        "UNITED STATES NOBEL PRIZE WINNERS",
        "The following table contains a listing of US Nobel Prize winners as of 2023, using the definition of nationality employed by the Nobel Foundation (citizenship at the time of award)."
    ],
    [
        "American nobel prize winners",
        "The United States has won the most Nobel prizes. Most Nobel prizes are for high level scientific research and it''s awarded by a western country so it''s to be expected that by far the largest of the western developed countries, the USA, has the most Nobel prizes. This page looks at a more detailed breakdown of the characteristics of US Nobel prize winners."
    ],
    [
        "Immigrants, Nobel Prizes And The American Dream",
        "The significant number of immigrant Nobel Prize winners is a sign of America''s openness to new ideas and people. A new study shows recent immigrants have played an outsized role in bringing honor and recognition to America in scientific fields."
    ],
    [
        "USA Literary Nobel Laureates",
        "1930 - Sinclair Lewis (1885 - 1951) American writer. Received the 1930 Nobel Prize for Literature “for his vigorous and graphic art of description and his ability to create, with wit and humor, new types of characters.”"
    ],
    [
        "American Nobel Prize Winners",
        "The Nobel Prize is an international award given yearly for oustanding achievements in the fields of physics, chemistry, medicine, literature, economic science, and for peace. Since its inception in 1901 by Alfred Nobel, many have received the prestigious award. Listed below are the Americans who have received the prize amount, a gold medal and a diploma (with any non-American co-recipients listed in parentheses, as applicable)."
    ],
    [
        "Nobel Laureates in the United States",
        "THE philanthropy of Alfred Nobel, the Swedish industrialist, is usually commemorated on December 10 in Stockholm or Oslo with the announcement of the new Nobel Prize winners. In its place a dinner was held in the United States on December 11 at which eleven Nobel laureates were guests of honour. The celebration marked the fortieth anniversary of the first awards. Nobel laureates who were present at the dinner included Dr. Viktor F. Hess, Dr. C. J. Davisson, Prof. Enrico Fermi, Prof. Otto Meyerhof, Dr. Karl Landsteiner, Dr. Irving Langmuir, Prof. H. C. Urey and Prof. Peter J. W. Debye. Dr. Vilhjal-mur Stefansson presided."
    ]],
    [[
        "Tres economistas residentes en EE. UU. ganan Nobel de Economía",
        "Los ganadores son David Card, de la Universidad de California en Berkeley; Joshua Angrist, del Instituto de Tecnología de Massachusetts, y Guido Imbens, de la Universidad de Stanford."
    ],
    [
        "12 Nobel de Literatura que Estados Unidos dejó al mundo",
        "El premio es otorgado a todos aquellos que realizan contribuciones notables en la química, la física, la literatura, la paz y la fisiología o la medicina"
    ],
    [
        "ESTADOS UNIDOS TAMBIÉN DOMINA LOS NOBEL",
        "A Estados Unidos se le puede criticar por muchas cosas, pero también se le debe defender cuando en materia de propósitos y hacer las cosas bien se trata. Por ejemplo, hasta hace unos años el fútbol (no el americano) era una simple diversión y algo esporádico en ese país, sin embargo se propusieron a aprender a jugarlo y jugarlo bien, a hacer un mundial. Hoy son campeones mundiales en fútbol femenino y disputan con muy buenas oportunidades un cupo al mundial del 2000 en el grupo de la Concacaf. Ese es sólo un ejemplo."
    ],
    [
        "De Roosevelt a Obama: los presidentes que han recibido Premio Nobel de la Paz",
        "La lista es larga, aquí te decimos los más importantes"
    ],
    [
        "Un tercio de los premios Nobel de EE.UU. son inmigrantes",
        "La contribución científica de personas procedentes del exterior alimenta el debate sobre la paralizada reforma inmigratoria"
    ],
    [
        "12 Escritores Estadounidenses Ganadores del Premio Nobel",
        "Los ganadores estadounidenses del Premio Nobel de Literatura se distinguieron del resto a través de estructuras y reglas literarias bien definidas, entre las que destacan recursos narrativos fragmentados y alternativos."
    ]]
  ]'),

  ('Science, Computers & Technology 4', 'International', '["sct4-int-eng.png", "sct4-int-esp.png"]', '[
    [[
        "The 10 Noblest Nobel Prize Winners of All Time",
        "The 2011 Nobel Prizes are being handed out this week. So far, the prize for physiology or medicine has gone to a trio of researchers who uncovered various aspects of the nature of immunity, and the physics prize has gone to a trio of physicists who discovered in the late 1990s that the expansion of the universe is accelerating."
    ],
    [
        "40 Nobel Prize Winners Kids Should Know",
        "Marie Curie, Albert Einstein, Malala Yousafzai, Toni Morrison, and more!"
    ],
    [
        "Nobel Peace Prize 2022: Ten of the most famous winners - including Barack Obama and Malala Yousafzai",
        "As the Norwegian Nobel Committee prepares to announce the 2022 Peace Prize, we look back at a few previous winners."
    ],
    [
        "10 Nobel Prize Winners Who Will Inspire Your Students",
        "The prestigious Nobel Prize is the mark of excellence in many fields of endeavor. While your students might not relate to obscure economic theories, lofty literature, or subatomic particles, they will be inspired by the impact and dynamic real-life stories of these ten outstanding Nobel Prize winners."
    ],
    [
        "Winners of the Nobel Prize for Literature",
        "The Nobel Prize for Literature is awarded, according to the will of Swedish inventor and industrialist Alfred Bernhard Nobel, “to those who, during the preceding year, shall have conferred the greatest benefit on mankind” in the field of literature. It is conferred by the Swedish Academy in Stockholm."
    ],
    [
        "Winners of the Nobel Prize for Physics",
        "The Nobel Prize for Physics is awarded, according to the will of Swedish inventor and industrialist Alfred Bernhard Nobel, “to those who, during the preceding year, shall have conferred the greatest benefit on mankind” in the field of physics. It is conferred by the Royal Swedish Academy of Sciences in Stockholm."
    ]],
    [[
        "Premio Nobel: las 5 personas que han ganado dos veces el prestigioso galardón",
        "Durante 121 años, más de 900 personas han recibido el prestigioso Premio Nobel por sus valiosos aportes a las ciencias, la literatura y la paz."
    ],
    [
        "PREMIOS NOBEL",
        "Premios Nobel de Química, Física y Fisiología o Medicina."
    ],
    [
        "Historia del Premio Nobel, el galardón más prestigioso del mundo",
        "Cada año, el mundo cultural se paraliza con expectación ante la entrega de los Premios Nobel, el galardón más importante del mundo. ¿Sabes quién era Alfred Nobel? ¿Cuántas categorías hay? ¿Cuál es la dotación económica a los premiados?"
    ],
    [
        "Premio Nobel: qué es, a quiénes se da y qué obtienen los laureados",
        "Desde 1901 el Premio Nobel es una de las máximas muestras de reconocimiento que el mundo ofrece a las grandes eminencias de distintos campos."
    ],
    [
        "De Luther King a Mandela, los Nobel de Paz más famosos de la historia",
        "El presidente Santos ya hace parte de una selecta lista de íconos de la historia reciente."
    ],
    [
        "En qué gastaron su premio algunos de los más importantes ganadores del Nobel",
        "Dotado con 8 millones de coronas suecas, el equivalente a algo más de 870.000 euros, los premios Nobel que cada año se conceden en distintas categorías no cabe duda que son, además de un reconocimiento honorífico, también económico."
    ]]
  ]'),

  ('Media & Entertainment 1', 'Mexico', '["me1-mex-eng.png", "me1-mex-esp.png"]', '[
    [[
        "10 Best Mexican Films of the 21st Century So Far And Where to Watch Them",
        "Although it''s sadly not always recognized as such, the Mexican film industry has an intricately rich and interesting history. It grew up alongside Hollywood, having even had a Golden Age not too dissimilar from its big brother''s in the North."
    ],
    [
        "The Most Exciting Movies by Mexican Filmmakers to Watch Right Now",
        "Stream classics ''Roma'' and ''Like Water for Chocolate,'' along with thrilling newer works"
    ],
    [
        "19 Best Mexican Movies Of All Time (2023 Update)",
        "Mexico is a country rich with beauty and culture, from cuisine, to music, to film. We''ve put together this list of the Best Mexican Movies of All Time as a guide to get you started exploring Mexico''s fascinating culture and the sensual Spanish language. We''ll cover the 5 Best Mexican Movies of All Time, as well as the Gangster, Romantic, Comedy, Horror, and more! Happy viewing!"
    ],
    [
        "34 Sensational Mexican Movies to Watch Before You Visit Mexico",
        "Are you planning a trip to Mexico? Are you a first-time visitor to Mexico? Not sure what to expect? You may have a general notion of the flavors and landscapes of Mexico, but there is so much more! Watch a few of the best Mexican movies before you go to Mexico to get a better feel of the diverse culture that engulfs this popular destination from coast to coast."
    ],
    [
        "Top Ten Mexican Movies Ever",
        "With the recent plethora of Mexican actors, directors and other creatives having invaded Hollywood and producing some of America''s biggest grossing blockbusters it''s easy to forgot that Mexico has long been a creator of high-quality movies, from the ''golden era'' of Mexican cinema to the new wave of film makers, headed by Cuarón and Iñarritú. It’s very hard to get only ten in this list, but in this countdown, we made our best effort to give you the ten movies you should definitely see."
    ],
    [
        "10 Best Mexican Movies Of All Time: A Celebration of The Cinema of Mexico",
        "Mexico has a rich cinematic history, with a variety of genres and styles represented in its films."
    ]],
    [[
        "Mejores películas mexicanas de todos los tiempos",
        "Ranking de las películas de México mejor valoradas en Filmaffinity"
    ],
    [
        "Las 100 mejores películas del cine mexicano",
        "En 2020 se actualizó el listado de las 100 mejores películas del cine mexicano. ¡Conoce la selección y cuéntanos cuál es tu favorita!"
    ],
    [
        "Las diez mejores películas del cine mexicano, según IMDb",
        "Con motivo de esta celebración, la Secretaría de Cultura, a través del Instituto Mexicano de Cinematografía (Imcine), exhibirá en 90 puntos del país lo mejor del cine independiente, con cerca de 60 películas nacionales de reciente producción, con pantallas en ''las montañas, las selvas, los desiertos y los valles'', según Imcine."
    ],
    [
        "Las 10 mejores películas del cine mexicano en los últimos cinco años",
        "Presentamos un listado de grandes cintas realizadas en México de 2018 a la actualidad."
    ],
    [
        "34 películas mexicanas contemporáneas que no te puedes perder",
        "Si siempre estás buscando una buena película, aquí te proponemos una lista con 34 películas mexicanas que contiene algunos de los mejores títulos que ha dado la industria cinematográfica mexicana, entre el año 2000 y 2022."
    ],
    [
        "30 de las mejores películas mexicanas de todos los tiempos",
        "México lleva más de 100 años haciendo cine. De las primeras obras que se tienen registradas está Tepeyac de José Manuel Ramos que data de 1917, a la que le siguieron dos grandes producciones del mismo director como Viaje redondo y El zarco de 1920."
    ]]
  ]'),

  ('Media & Entertainment 1', 'US', '["me1-us-eng.png", "me1-us-esp.png"]', '[
    [[
        "The 10 Best American Movies of All Time, According to the AFI",
        "The American Film Institute has curated numerous high-profile lists that celebrate excellence in cinema, and these are the top 10 American films featured in the television special AFI''s 100 Years, 100 Movies (10th Anniversary) in 2007."
    ],
    [
        "50 Best Movies About America of the Past 50 Years",
        "From ''All the President''s Men'' to ''The Godfather,'' ''Boyhood'' to ''Boyz n the Hood'' — the movies that have reflected the American experiment back to us on the screen for the past half century"
    ],
    [
        "The 100 best American movies of all time, according to the BBC",
        "BBC Culture polled film critics from around the world to determine the best American movies ever made. You might find the results surprising."
    ],
    [
        "20 greatest American movies of all time",
        "See the greatest American films ever made."
    ],
    [
        "The 50 Best American Movies of All Time",
        "SEE IF YOUR FAVORITE FILM GOT LEFT ON THE CUTTING ROOM FLOOR."
    ],
    [
        "The Most Important American Films of All Time",
        "Cinema has been a crucial apart of American culture for over a century, and theses are the great films that define Hollywood and America as a whole."
    ]],
    [[
        "Mejores películas estadounidenses de todos los tiempos",
        "Ranking de las películas de EEUU mejor valoradas en Filmaffinity"
    ],
    [
        "62 críticos eligen las 100 mejores películas estadounidenses",
        "La BBC ha reunido a 62 críticos de cine de todo el mundo para elaborar una lista con las 100 mejores películas de Estados Unidos. Una labor difícil que ha dado como resultado una lista con títulos emblemáticos del séptimo arte como Ciudadano Kane, Psicosis, El Padrino o 2001: Una odisea en el espacio."
    ],
    [
        "Las mejores películas estadounidenses de la historia según el American Film Institute",
        "Con motivo del primer siglo del cine, el American Film Institute (AFI) realizó una encuesta entre más de 1500 artistas y líderes de la industria cinematográfica. Entre 400 películas nominadas, los encuestados eligieron las 100 mejores películas estadounidenses de todos los tiempos (veremos en el listado algunas británicas, pero que fueron incluidas como estadounidenses por haber sido financiadas por estudios de ese país)."
    ],
    [
        "Las 100 mejores películas estadounidenses de la historia",
        "¿Cuál es la mejor película de todos los tiempos? Una pregunta frecuente entre los seguidores del séptimo arte. Aunque es difícil hacer una lista única, para simplificarlo la BBC realizó un conteo que reúne las 100 mejores películas estadounidenses de todos los tiempos y las agrupó por palabras clave como: ídolos, odiseas, sueños, besos, lamentos, entre otras."
    ],
    [
        "¿Son estas las 100 mejores películas estadounidenses de la Historia?",
        "Así lo han decidido 62 críticos de todo el mundo consultados por BBC Culture, de cuyas elecciones sale un canon lleno de sospechosos habituales y con alguna que otra sorpresa."
    ],
    [
        "Las 100 mejores películas estadounidenses de todos los tiempos, según los críticos",
        "Las películas norteamericanas figuran entre las mayores exportaciones del país. Desde las innovaciones de Thomas Edison a mediados de la década de 1890, Estados Unidos ha sido siempre una potencia en el desarrollo del cine, desde los entretenimientos masivamente populares de Hollywood, a las películas independientes y de vanguardia. En reconocimiento de la asombrosa influencia de Estados Unidos en lo que sigue siendo la forma de arte más popular en todo el mundo, BBC Culture encuestó a 62 críticos de cine internacionales para determinar las 100 películas estadounidenses más grandes de todos los tiempos."
    ]]
  ]'),

  ('Media & Entertainment 1', 'International', '["me1-int-eng.png", "me1-int-esp.png"]', '[
    [[
        "The 100 best movies of all time",
        "Silent classics, noir, space operas and everything in between: Somehow we managed to rank the best movies of all time"
    ],
    [
        "The 100 Best Movies Of All Time",
        "It''s a big question: what are the best movies of all time? And it''s one with many answers - there are all kinds of reasons why the greatest films ever made endure in the way they do. They create unforgettable images, conjure overwhelming emotions, craft thrilling stories, and deliver characters who leap off the screen."
    ],
    [
        "THE 100 BEST MOVIES OF THE PAST 10 DECADES",
        "TIME''s Stephanie Zacharek on the top films from the 1920s through the 2010s"
    ],
    [
        "30 Best Movies of All Time, Ranked",
        "These are some of the best movies ever made. You will disagree, and you will not like this at all."
    ],
    [
        "The 100 Greatest Movies of All Time",
        "The movies are now more than 100 years old. That still makes them a young medium, at least in art-form years (how old is the novel? the theater? the painting?). But they’re just old enough to make compiling Variety’s first-ever list of the 100 Greatest Movies of All Time a more daunting task than it once might have been. Think about it: You get an average of one film per year. A great deal of ardent discussion and debate went into the creation of this list. Our choices were winnowed from hundreds of titles submitted by more than 30 Variety critics, writers and editors. As we learned, coming up with which movies to include was the easy part. The hard part was deciding which movies to leave out."
    ],
    [
        "Plan a Movie Marathon Weekend—We Ranked the 100 Best Movies of All Time!",
        "Catch up with the essentials. This is the definitive ranking of the 100 greatest films ever made."
    ]],
    [[
        "Las 100 mejores películas de la historia del cine, ordenadas en ranking",
        "Títulos como ''El padrino'', ''El viaje de Chihiro'', ''La vida es bella'' y la trilogía de ''El señor de los anillos'' se reúnen en esta lista de lo mejor del séptimo arte, según las votaciones del público. ¿Estás de acuerdo con el resultado?"
    ],
    [
        "MEJORES PELÍCULAS SEGÚN LOS USUARIOS",
        "¿Cuales son las mejores películas de todos los tiempos según los usuarios de SensaCine.com? Encuentra las 300 mejores películas de todos los tiempos, según los usuarios"
    ],
    [
        "Las 110 mejores películas de la historia del cine",
        "Una lista totalmente subjetiva de las mejores películas de todos los tiempos, las que más amamos y las que deberías haber visto al menos una vez en la vida."
    ],
    [
        "Las 10 mejores películas de todos los tiempos",
        "La industria cinematográfica ha dado cientos de obras maestras, pero estas son las más valoradas por los usuarios de la popular plataforma IMDb"
    ],
    [
        "Las 50 mejores películas de la historia, elegidas por los cerebros de Hollywood",
        "La revista «The Hollywood reporter» ha preguntado a más de 2000 personas que trabajan en la meca de los sueños para elegir los mejores filmes de la historia"
    ],
    [
        "Las 100 mejores películas de la historia",
        "Anota esta lista de títulos imprescindibles para tus noches de manta, sofá y peli."
    ]]
  ]'),
  
  ('Media & Entertainment 2', 'Mexico', '["me2-mex-eng.png", "me2-mex-esp.png"]', '[
    [[
        "25 Of The Greatest And Most Famous Mexican Singers",
        "Mexico is a country with an incredibly rich and diverse music scene. From Mariachi bands to pop singers, many famous vocalists come from there or have Mexican heritage. So much so, that you might be surprised at how many of your favorite artists are Mexicans."
    ],
    [
        "The 10 Biggest Regional Mexican Musicians: A Cinco De Mayo Celebration",
        "Here are the top 10 names in the past five years (2017 - 2022) on the Billboard Regional Mexican charts."
    ],
    [
        "10 Sensational Mexican Music Artists You Don''t Want To Miss",
        "Welcome to this Mexican music artists list! In it you will find the most talented, versatile, charismatic singers of Mexico. Their songs are so catchy, clear, and relatable that you can learn Spanish by understanding, memorizing, and practicing them."
    ],
    [
        "Top Ten Mexican Male Singers of all Time",
        "Since the days when Mexico was a serious rival to Hollywood in terms of film production and quality, The US''s closest Latin neighbour has been producing most of the biggest selling singers of Latin America. Their imagery of the Charro (cowboy) easily evolved into the modern day crooner in a way that has been hugely appealing to millions of people. Here are our Top Ten Mexican singers, in no particular order, who happened to be Latin America''s most popular."
    ],
    [
        "12 Most Famous Mexican Singers of All Time",
        "As a very significant part of Mexican culture, music is always included in any Mexican celebration, no matter big or small it may be."
    ],
    [
        "35 Best Mexican Singers of All Time (Most Famous)",
        "Below, we reveal the 35 best Mexican singers of all time."
    ]],
    [[
        "10 de los mejores cantantes mexicanos de la historia",
        "México es un país que siempre ha tenido gran variedad a nivel artístico musical. Si por algo destaca su música es por que tiene una mezcla de música tradicional creando sus propios sonidos. Son muchos los cantantes que a lo largo de la historia nos han ido conquistando con su música. Actualmente aún podemos escuchar sus nombres y podemos sentir su música."
    ],
    [
        "Grandes cantantes de México de la Época del Oro",
        "Sin duda alguna, los cantantes más famosos de México son aquellos que resplandecieron en los años 50, puesto que muchas de sus canciones continúan escuchándose y no sólo eso, también siendo retomadas hasta por los cantantes mexicanos modernos más reconocidos. Es por esto, que hemos seleccionado a los cinco más representativos."
    ],
    [
        "Estos son los únicos mexicanos incluidos en la lista “Los 200 mejores cantantes de todos los tiempos”",
        "La revista Rolling Stone publicó un polémico artículo donde fueron incluidos diversos latinos como Rosalía, Marc Anthony e, incluso, Celia Cruz"
    ],
    [
        "México: listado de cantantes mexicanos más populares en varios géneros musicales",
        "México es un país con una amplia y variada cultura musical, son muchos los cantantes y grupos mexicanos que son reconocidos en el mundo entero: Luis Miguel, Vicente y Alejandro Fernández, Juan Gabriel, Maná, Pedro Fernández, Marco Antonio Solìs, Belinda, Alejandra Guzmán y Reik entre muchos otros, representan muy bien al país azteca."
    ],
    [
        "18 cantantes mexicanos famosos que hicieron historia",
        "En este artículo hablaremos de los cantantes mexicanos famosos del pasado y de la actualidad quienes han dejado huella en la escena musical. La música mexicana es conocida por sus rancheras y baladas tradicionales, pero con el paso del tiempo los sonidos se reinventan y dan lugar a nuevos géneros y nuevos artistas que tocan otros ámbitos."
    ],
    [
        "10 Cantantes mexicanos más populares en el mundo",
        "México es sin duda uno de los países del continente americano que más exponentes dentro de la música y del cine, ha dado al mundo."
    ]]
  ]'),

  ('Media & Entertainment 2', 'US', '["me2-us-eng.png", "me2-us-esp.png"]', '[
    [[
        "20 Famous American Musicians",
        "List of the Top 20 Famous American Musicians"
    ],
    [
        "31 Best American Singers Of All Time",
        "There are a lot of great singers from countries around the world. Britain alone has and had people like Annie Lennox, Freddie Mercury, David Bowie, Kate Bush, and Elton John, to name a few. Australia had Olivia Newton-John and Michael Hutchence. Canada has Aimee Mann, while Germany has… well, they adopted David Hasselhoff. America can also more than hold its own."
    ],
    [
        "Famous American Musicians",
        "If you love your Bob Dylan, Jim Morrison and Bob Marley and cannot do without your daily dose of Frank Sinatra, Bruce Springsteen and Stevie Wonder, you have landed in the right page. America has been blessed enough to home a world of soul-stirring, mind-blowing, Grammy-worthy musicians whose innovative, mellifluous, energizing and eclectic music have inspired several generations of musical buffs. They are the musicians whom you will find on every music lover''s playlist — young or old. They are the musical trendsetters, timeless in their music, fame and appeal. They are the true force behind America''s music legacy. These are the music makers who have left something lasting behind — music that won''t wither with time. They are America''s real musical survivors. Read on to explore to mind-bending biographies, trivia and facts on America''s most famous, most celebrated, most heard musicians who continue to awe the music lovers to this day."
    ],
    [
        "35 Best American Singers of All Time (Most Famous)",
        "We''re dedicating today''s article to the best American singers of all time."
    ],
    [
        "The 30 Greatest American Singers of All Time",
        "Being a prominent singer in America is not an easy journey. A lot of singers tried their shots in the music industry but had no luck. However, These are the artists who have helped shape the musical landscape and made amazing songs that captured the hearts of listeners in different generations."
    ],
    [
        "The Most Famous Contemporary Music Artists (Q3 2023)",
        "Fame is defined by the % of people who have heard of a contemporary music artist."
    ]],
    [[
        "15 cantantes americanos famosos: actuales y clásicos",
        "No hay mejor sensación que estar en el coche escuchando la radio y que de repente empiece a sonar tu canción favorita, esa canción con la que tantas veces te has emocionado, que te transporta a otro lugar con tan solo escuchar las primeras notas. En Espectáculos BCN nos encanta la música y creemos que la mejor forma de disfrutarla que escuchando una buena canción."
    ],
    [
        "Los 8 mejores cantantes estadounidenses de los años 80",
        "Los años 80 vieron el inicio de las carreras de nuevos artistas que marcaron toda una época con su música y estilo."
    ],
    [
        "Mejores Cantantes Americanos: Lista de Cantantes Estadounidenses [Actualizado]",
        "La música de Estados Unidos es un reflejo de su población multi-étnica por lo cual se caracteriza por contener variedad de estilos y géneros como el hip hop, el blues, el jazz, el country, el R&B, el metal, el pop, el rock, etc."
    ],
    [
        "Los 10 mejores cantantes en inglés para aprender el idioma",
        "En Poliglota nos gustan los idiomas, la música y también los rankings, por eso hoy decidimos combinar todas estas cosas y mostrarte nuestros top 10 mejores cantantes para aprender inglés."
    ],
    [
        "Cantantes Americanas",
        "Las cantantes americanas han marcado a generaciones enteras con sus canciones, desde Ella Fitgerald a Taylor Swift pasando por Withney Houston o Madonna."
    ],
    [
        "Los 12 Mejores Cantantes Americanos: La Crema de la Crema del Sonido",
        "Agárrense, nos vamos de viaje a través de las melodías y los ritmos que han moldeado la banda sonora de América."
    ]]
  ]'),

  ('Media & Entertainment 2', 'International', '["me2-int-eng.png", "me2-int-esp.png"]', '[
    [[
        "100 Greatest Artists",
        "The Beatles, Eminem and more of the best of the best"
    ],
    [
        "The Most Famous All-time Music Artists (Q3 2023)",
        "Fame is defined by the % of people who have heard of a all-time music artist."
    ],
    [
        "TOP 20 MUSICIANS OF ALL TIME, IN ANY GENRE: THE COMPLETE LIST",
        "Yeah, yeah, we know. The top 20 greatest musicians of all time, in any genre. Where do we get off? Well, we''ll tell you where we get off — at Accuracy Station. Our team of writers listened to thousands and thousands of hours of music for this list, digging deep into the annals of history and exploring the sounds of the entire globe. We painstakingly researched the shit out of practically all music ever made, modern and classical, popular and experimental, chart-topping and obscure. You may not agree with every artist on this list, but one thing is for certain: You''re going to respect the hell out of it. -Ben Westhoff"
    ],
    [
        "The Greatest Musical Artists of All Time",
        "We''re ranking the greatest musical artists of all time, with the order decided by fans internationally. From some of the greatest female vocalists of the past 10 years, to incredible current bands, as well as many of the best rock bands and artists of all time, this list includes all of your favorite famous, popular, talented stars across every genre. And of course, many of them are featured in the Rock and Roll Hall of Fame."
    ],
    [
        "The 20 Greatest Musicians of All Time",
        "The world has been blessed with some incredibly talented musicians throughout the years. Choosing the top 20 among them can be challenging!"
    ],
    [
        "The 15 Most Famous Musicians in the World",
        "Many genres are out there in the music world we have all come to know and love. Some of the most outstanding performers and musicians hit the stages worldwide within the genres. Some of them are still performing and doing quite well."
    ]],
    [[
        "Estos son los 10 mejores artistas de todos los tiempos según Billboard",
        "Fundada en 1894, la revista estadounidense Billboard se convirtió en uno de los medios especializados en la industria musical más importantes del mundo. Sus listas han sido punto clave para identificar o incluso marcar tendencias y memorias musicales a lo largo de la historia reciente de la música."
    ],
    [
        "Los 50 músicos más GQ de todos los tiempos",
        "David Bowie. 1. David Bowie ''Siempre he tenido una repulsiva necesidad de ser algo más que un humano''. El camaleón, el “rebel rebel”, Ziggy Stardust. No podía ser de otra manera. El cantante más GQ de todos los tiempos es, y creemos que será por mucho tiempo, David Robert Jones."
    ],
    [
        "Estos son las 200 mejores cantantes de todos los tiempos, según Rolling Stone",
        "La revista Rolling Stone publicó la lista de los 200 mejores cantantes de los tiempos y, como suele suceder, grandes nombres quedaron fuera."
    ],
    [
        "Estos son los 20 mejores cantantes de todos los tiempos cuyas canciones han trascendido todas las generaciones",
        "De Presley a Raphael; estilos e íconos cuyas voces han trascendido el tiempo y las generaciones logrando posicionarse entre los mejores cantantes del mundo"
    ],
    [
        "Los 5 artistas musicales más famosos de todos los tiempos",
        "A lo largo de los años ha habido algunos artistas que han sobresalido en el panorama musical, pasando a formar parte de la historia de la música. Se trata de cantantes inolvidables, que han marcado un antes y un después en su género, y cuya música se seguirá escuchando durante muchos años más."
    ],
    [
        "Si has escuchado al menos a 17 de los 30 mejores cantantes de todos los tiempos, sabes más de música que la mayoría",
        "Llegó el momento de mostrar tu gran gusto musical"
    ]]
  ]'),

  ('Media & Entertainment 3', 'Mexico', '["me3-mex-eng.png", "me3-mex-esp.png"]', '[
    [[
        "Five of the Best Classic Mexican Novels",
        "We asked the award-winning Mexican novelist Ave Barrera—whose latest book, The Forgery, has recently been translated into English—to recommend five classic Mexican novels. Here she discusses her choices, which include books by Juan Rulfo, Elena Garro and Nellie Campobello."
    ],
    [
        "10 Essential Modern Mexican Novels",
        "Mexico is one of the great literary nations of the world; home to some of the most celebrated poets and novelists of all time."
    ],
    [
        "100 Best Mexico Books of All Time",
        "We''ve researched and ranked the best mexico books in the world, based on recommendations from world experts, sales data, and millions of reader ratings."
    ],
    [
        "The 20 Best Books About Mexico",
        "Are you dreaming of Mexico, but can''t visit at the moment? Whether you''re saving up for a trip or experiencing wanderlust, one of the best ways to explore Mexico is through books! This article will cover the best classic books about Mexico, books on Mexican history, and fiction books by Mexican authors."
    ],
    [
        "22 Best Books About Mexico",
        "Travel to North America with the best books about Mexico. These Mexican books are sure to teach you more and take you there."
    ],
    [
        "Top 10 Contemporary Mexican Novels You Must Read",
        "The Latin American literature world is booming at the moment, as more and more publishing houses are choosing to translate the works published in Spanish into English, bringing their novels to a wider audience. In Mexico, the situation is no different. Known for the famed Mexican writers Carlos Fuentes, Juan Rulfo and Octavio Paz, Mexico has a plethora of contemporary authors that are still battling for the wider recognition of their forefathers. Here are the top ten must-read texts."
    ]],
    [[
        "Grandes libros de autores mexicanos que debes leer al menos una vez",
        "Relájate, encuentra un rincón cómodo y ponte a leer uno de los grandes libros por autores mexicanos."
    ],
    [
        "50 Novelas mexicanas que debes leer o leer",
        "Ahora que está en Remate del Auditorio Nacional y que empieza la Semana Santa -ese tiempo donde nos programamos para hacer cosas y lo mejor es leer mucho- démonos la oportunidad para ponernos al día con nuestra literatura."
    ],
    [
        "10 libros de escritores mexicanos que debes leer en tu vida",
        "Hoy 23 de abril se conmemora el Día Mundial del Libro. Y qué mejor manera de celebrar este día que recomendándote este Top 10 de lecturas de la literatura nacional que deben formar parte de tu biblioteca personal."
    ],
    [
        "Los mejores libros escritos por autores mexicanos",
        "Los clásicos de la literatura mexicana que no pueden faltar en tu librero."
    ],
    [
        "Los mejores libros mexicanos",
        "Prolífica e hipnótica, la literatura mexicana siempre estuvo marcada por el mestizaje o la influencia de una Revolución mexicana que convirtió el género periodístico en antecesor de historias y autores nacionalista. Una vertiente que explota en estos mejores libros mexicanos que debes leer al menos una vez en la vida."
    ],
    [
        "Literatura mexicana en 50 libros",
        "Conoce la literatura producida en México a través de estos 50 libros."
    ]]
  ]'),

  ('Media & Entertainment 3', 'US', '["me3-us-eng.png", "me3-us-esp.png"]', '[
    [[
        "The Great American Novel",
        "Every couple years somebody writes a book that gets called ''the Great American Novel.'' So which actually is? Fitzgerald, Twain, Chabon, or somebody less obvious? (I''m hoping somebody less obvious. Maybe even a lady!) English majors and iconoclasts, let''s argue."
    ],
    [
        "The Great American Read Book List",
        "The Great American Read, hosted by Meredith Vieira, is an eight-part television and online series designed to spark a national conversation about reading and the books that have inspired, moved, and shaped us. Get caught up on the reads below, and learn what trusted book people at Penguin Random House have to say about a few of their favorites as well!"
    ],
    [
        "The 100 Books on the Great American Read List",
        "America''s Best-Loved Novel will be chosen by viewers like you based on The Great American Read top 100 books list. The top 100 books were chosen through a survey of Americans conducted by PBS, The Great American Read and a polling service (more on that selection process below). The books chosen could be from anywhere in the world as long as they were published in English - the only requirement was that they be fiction. From beloved world literature to contemporary bestsellers, the list contains a broad range of novels, authors, time periods, countries, genres and subject matter."
    ],
    [
        "Read the 100 List",
        "Below is the list of America''s 100 most-loved books brought to you by The Great American Read. Explore the book list and visit the book pages to learn more."
    ],
    [
        "A Brief Survey of the Great American Novel(s)",
        "Do We Need The G.A.N.? Why Do We Keep Looking?"
    ],
    [
        "100 Best American Literature Books of All Time",
        "We''ve researched and ranked the best american literature books in the world, based on recommendations from world experts, sales data, and millions of reader ratings."
    ]],
    [[
        "Las 20 mejores novelas estadounidenses del siglo",
        "Se busca la gran novela novela americana."
    ],
    [
        "Clásicos imprescindibles de la literatura norteamericana",
        "Hemos realizado una amplia selección de clásicos de la literatura de Estados Unidos, obras que como el caso de ''Walden'', ''Moby Dick'' o ''Las aventuras de Huckleberry Finn'', ya forman parte de la cultura universal de todos los tiempos."
    ],
    [
        "Cien mejores novelas norteamericanas",
        "Obras maestras de la Novela Norteamericana siglo"
    ],
    [
        "Mejores libros de la literatura estadounidense",
        "A pesar de su carácter contemporáneo en comparación a la literatura de otros países del mundo, la estadounidense está llena de grandes historias. Relatos surgidos de una historia marcada por la esclavitud, el progresismo o la paranoia que, en cierto modo, no solo representan un determinada período de la historia del país, sino también de Occidente. Estos mejores libros de la literatura estadounidense se convierten en los mejores ejemplos."
    ],
    [
        "Historia de EE. UU.: 10 mejores libros sobre historia estadounidense",
        "La historia de EE. UU. o se puede decir, una de las superpotencias del mundo es vibrante y colorida, y diferentes autores e historiadores la han visto desde varias perspectivas. Algunos son negativos, algunos positivos, algunos desde la perspectiva de los pueblos indígenas, hispanos, negros o más, mientras que otros son desde la perspectiva de los blancos."
    ],
    [
        "Los libros que recomiendan las universidades de EEUU: qué enseñan",
        "Las universidades de Harvard, Stanford, Yale y Chicago son consideradas entre las mejores de los Estados Unidos. Tras un sondeo entre sus profesores realizaron una selección de libros que recomienda leer a sus alumnos."
    ]]
  ]'),

  ('Media & Entertainment 3', 'International', '["me3-int-eng.png", "me3-int-esp.png"]', '[
    [[
        "65 Best Japanese Books of All Time",
        "Choosing the fifty best Japanese books ever written is a monumental task, invariably leading to the omission of so many wonderful works of literature. After all, Japan has given rise to some of the world''s best writers, both past and present, with styles that have borrowed from and further informed Western literature. But here are 65 books that, together, speak to the rich history of literature in Japan."
    ],
    [
        "54 Best Japanese Books (In 13 Genres)",
        "If you''re wondering where to start with Japanese literature, these are the best Japanese books across sci-fi, mystery, literary fiction, and more."
    ],
    [
        "10 Best Japanese Novels to Read in English",
        "Japanese Books You Must Read in English"
    ],
    [
        "The Best Japanese Novels & Books About Japan",
        "Japanese literature has rapidly gained popularity in the West and for good reason too. Japanese authors seem to write with an elegant, often ethereal quality, no matter what the subject matter is."
    ],
    [
        "30 Best Japanese Books To Read (From & Set There)",
        "Travel across Asia with the best Japanese books to read before you go. These books about, from, and set in Japan are sure to transport you there."
    ],
    [
        "The 50 Best Japanese Books of All Time",
        "Japan is a beautiful country that has a lot to offer. But if you can''t travel to Japan anytime soon, the next best thing is to read about it. That is why we decided to list the 50 best Japanese books of all time. Keep reading to find out what they are."
    ]],
    [[
        "10 libros de autores japoneses para descubrir",
        "En un pequeño callejón en Tokyo, reside un café que ha servido a su gente durante cien años. Pero esta cafetería, es un lugar inusual, y le ofrece al cliente una experiencia única: La oportunidad de volver atrás en el tiempo."
    ],
    [
        "12 mejores novelas japonesas que puedes leer",
        "Japón es un país que atrae a Occidente, y lo hace de formas muy diversas; a través de su idioma, su historia, su cultura y, por supuesto, su literatura. A pesar de su lejanía tenemos mucho de Japón muy cerca, tanto es así que muchas de sus novelas pueblan nuestras estanterías."
    ],
    [
        "8 libros japoneses famosos que debes leer",
        "La literatura japonesa no deja de sorprendernos cada año con nuevas obras que muestran el lado más oculto del país del que proceden. Hay libros japoneses que se han convertido en clásicos de la literatura a nivel mundial, altamente recomendados, y otros que todavía se están dando a conocer, y que pueden resultar todo un descubrimiento para ti."
    ],
    [
        "Las 10 mejores novelas japonesas",
        "Si te gusta mucho leer te recomiendo leer novelas japonesas y que empieces por esta lista de las 10 mejores novelas japonesas. La literatura japonesa data de principios del siglo VIII cuando los caracteres Kanji se importaron de China. La crónica más antigua llamada Kojiki fue escrita en el año 712 y la segunda más antigua fue Nihon Shoki (Crónicas de Japón) completada en el año 720. En 1008 Murasaki Shikibu escribió El cuento de Genji, la que se considera la primera novela del mundo."
    ],
    [
        "Libros imprescindibles de la literatura japonesa",
        "Hacer una selección con los títulos imprescindibles de la literatura japonesa es tarea casi imposible dado el alto nivel que siempre han tenido sus autores."
    ],
    [
        "Diez libros recomendados de literatura japonesa contemporánea",
        "Todos conocemos los clásicos, pero ¿qué se escribe hoy en Japón? Ensayista, narradora, docente e investigadora, Matayoshi también colaboró en la revista literaria Tokonoma, dirigida por Amalia Sato, y ofrecerá pronto un taller al respecto en la librería (consultas a cursosytalleres@eternacadencia.com.ar). Mientras tanto, vamos calentando motores con esta lista."
    ]]
  ]'),
  
  ('Media & Entertainment 4', 'Mexico', '["me4-mex-eng.png", "me4-mex-esp.png"]', '[
    [[
        "THE BEST MEXICAN SPANISH NETFLIX SERIES",
        "Hello, my name is Ricardo, and I am a Spanish teacher in Mexico City and I created this post to share my experiences with foreigners living in Mexico and learning Spanish. In this post I want to talk about some mexican series that will help you to improve your understand of Spanish. I have to say that I already watched them all and they got all my attention. Also I recommend this shows to all my students who take Mexican Spanish Lessons Online."
    ],
    [
        "9 Best Mexican Series On Netflix",
        "Netflix has a lot of great series, but when it comes to Mexican-themed ones, they really hit the nail on the head. Prepare to turn your subtitles on, then sit back and relax as you watch some great Mexican series on Netflix, with different genres from drama to fantasy and crime."
    ],
    [
        "The Best Mexican TV Shows on Netflix: A Must-Watch List",
        "Looking for some binge-worthy Mexican TV shows to add to your Netflix watchlist? Look no further as we have compiled a must-watch list of the best Mexican TV shows available on Netflix. Get ready to immerse yourself in captivating storylines, rich cultural experiences, and top-notch performances."
    ],
    [
        "Top 15 Mexican TV Shows to Boost Your Spanish",
        "Passive learning is an essential component of adopting a new language and making it second nature. It''s not all about sitting down, cracking the books, and studying verb tenses. It''s about immersing yourself in the culture and letting the rhythm, cadence, and structure of that new language subtly seep into you."
    ],
    [
        "10 Mexican TV Shows to Watch on Netflix",
        "Netflix is a treasure trove of binge-worthy TV shows, films and documentaries, but who hasn''t sat for hours scrolling through the catalogue trying to find something they actually feel like watching? We''ve decided to make your life easier, listing the top ten Mexican TV shows and telenovelas that you can waste away an evening (or four) with to your heart''s content."
    ],
    [
        "26 Spanish-Language Shows on Netflix Begging to Be Binged",
        "Yes, they all have English subtitles if you don''t happen to be fluent."
    ]],
    [[
        "Las mejores series mexicanas de ayer y hoy",
        "Descubre cuáles han sido las series mexicanas que han hecho historia, las que se han estrenado últimamente y de las que todo el mundo habla."
    ],
    [
        "Estos son los mejores reality shows de la televisión mexicana",
        "En la historia de la televisión mexicana se han presentado reality shows que han sido muy vistos por los mexicanos, ¡checa cuáles son!"
    ],
    [
        "20 Programas mexicanos que pegan justo en los recuerdos (y algunos datos curiosos sobre ellos)",
        "Hay historias, momentos y personas que se quedan en lo más profundo de nuestros recuerdos y también en una parte importante de nuestro corazón. A pesar de que no conocemos en persona a los artistas que están detrás de la pantalla, de alguna manera nos encariñamos con ellos y con su trabajo. Hay programas que duraron tanto tiempo al aire que, de manera inevitable, se convirtieron en algo muy especial de nuestra infancia o adolescencia, y es por eso que hoy queremos recordar a algunos de ellos."
    ],
    [
        "Los 5 mejores reality shows que se han transmitido en México",
        "Ya sea con programas de retos o de habilidad y talento, estos shows han cobrado una popularidad cada vez mayor en nuestro país y han llegado incluso a registrar niveles de ratings nunca antes vistos."
    ],
    [
        "Los mejores 7 shows de stand up mexicanos disponibles Netflix para ver mientras estás en casa",
        "Continúa el tiempo de cuarentenna y definitivamente lo que más necesita uno es distraerse y pasar un buen rato. Por eso en Spoiler Time nos dimos a la tarea de buscar 7 shows de stand up mexicano para ver en Netflix mientras estás en casa."
    ],
    [
        "5 series mexicanas que puedes ver en HBO Max",
        "Te traemos cinco series mexicanas que puedes ver en la plataforma HBO Max, pues desde hace tiempo ha estado innovando con historias hechas en nuestro país."
    ]]
  ]'),

  ('Media & Entertainment 4', 'US', '["me4-us-eng.png", "me4-us-esp.png"]', '[
    [[
        "America''s most popular TV shows of all time, ranked",
        "What''s the most popular TV show ever? According to a YouGov poll, the answer is not ''The Office,'' ''Game of Thrones'' or ''The Sopranos.''"
    ],
    [
        "The Greatest American TV Shows of All Time",
        "This list features the series ranked the twenty greatest in TV (the Book): Two Experts Pick the Greatest American Shows of All Time. I''ve included here the earliest season or disc in Hennepin County Library''s collection. For additional seasons/discs of these shows, please search the library catalog. The additional series on the authors'' list is #18 Louie."
    ],
    [
        "Top 10 Best American TV Series Of All Time",
        "When it comes to American TV series, everyone is fascinated by the beautiful cinematography and compelling plot. Although a new year has a movie season, most young people are willing to wait to see and experience great entertainment moments. Here are the top 10 best American TV series of all time you should not miss this summer."
    ],
    [
        "The 50 best US television shows",
        "The quality of entertainment arriving from across the pond is so good viewers are taking television seriously again: click on the blue links to watch clips"
    ],
    [
        "10 Must Watch American TV Series That Are Worth Watching",
        "Numerous television series strike our vision, but only a few of them seem impressive and sometimes unforgettable. We''ve come up with the 10 must watch American TV series before you get old, including those who will bring fresh seasons for the desperate audience."
    ],
    [
        "The Greatest American Television Shows, Ranked",
        "What''s the greatest TV show of all time? American show. Narrative drama. Not talk shows or comedy sketches. What would you choose? My guests this hour are two great critics who have sized up all of American television history and ranked the shows. The best. The top five. The top 100. Ranked for storytelling, innovation, performance, influence. We are in the golden age of television, they say. But that''s a lot of history. This hour On Point: The best ever American TV, ranked."
    ]],
    [[
        "Los 5 Mejores Programas televisión en USA para ver",
        "No hay ninguna duda: los estadounidenses aman la televisión. Se trata de un pasatiempo común y una forma de vida en Estados Unidos. Los personajes de la televisión en USA se convierten en amigos entrañables, y las ambientaciones de tus programas de televisón preferidos empiezan a ser familiares, casi como un segundo hogar. Para los au pairs que viven en Estados Unidos, una de las formas más populares de relajarse tras un día largo es ver una serie de televisión."
    ],
    [
        "Hulu: los 10 programas más vistos en Estados Unidos",
        "Nunca habíamos tenido al alcance de nuestras manos tantas series como en la actualidad, por lo que no siempre es sencillo encontrar esa que tanto anhelamos. Los usuarios de Hulu solemos ir a lo fácil y apuntar a las novedades."
    ],
    [
        "¿Cuáles son las películas y programas de televisión más populares en Estados Unidos?",
        "Si vives en USA o piensas mudarte pronto, posiblemente aún no sepas qué hacer en tus tiempos libres. En este artículo te mostraremos cuáles son las películas y programas de televisión más populares en Estados Unidos, para que sepas cómo entretenerte."
    ],
    [
        "Los 10 mejores programas de TV para aprender inglés",
        "Todos escuchamos las historias de celebridades como la actriz Mila Kunis aprendiendo inglés solo por mirar programas de televisión de origen británico o estadounidense, y a pesar de que es verdad que uno debe ser más que inteligente para poder aprender un idioma nada más leyendo subtítulos, una vez que ya se está aprendiendo inglés, mirar series puede ayudar mucho a absorber hasta lo más nuevo y conseguir un acento autentico. Acá están mis elecciones para las 10 mejores series para aprender inglés"
    ],
    [
        "Las 60 mejores series de ficción de la televisión USA",
        "Estas son las series líder en el ranking de IMDb, una selección de todos los géneros y para todos los gustos que incluyen títulos como ''Breaking Bad'', ''Juego de tronos'' y hasta estrenos recientes como ''Gambito de dama''. ¿Echáis en falta alguna?"
    ],
    [
        "Los 20 mejores programas de televisión de realidad en EE. UU. Que debes anticipar",
        "Simplemente la última temporada de televisión, The Bachelor, The Voice y Survivor se clasificaron entre los veinte primeros programas más vistos."
    ]]
  ]'),

  ('Media & Entertainment 4', 'International', '["me4-int-eng.png", "me4-int-esp.png"]', '[
    [[
        "The Most Iconic Korean Dramas Ever Made, Ranked",
        "Have you watched these Korean dramas? They''re pretty iconic."
    ],
    [
        "The 55 Best K-Dramas You''ll Be Completely Hooked On",
        "If you''re not watching Korean dramas, better known as K-dramas, then you''re missing out in several ways. First, there''s the big-picture, cultural impact to consider: K-dramas and K-movies have become a worldwide phenomenon, and if you''re going to be a pop culture connoisseur/productive denizen of the entertainment-loving internet—and you''re here, so you obviously are both of those things—then you need to be versed in all things K-drama. And then there''s the more important reason to watch Korean dramas: They are addictive and amazing, and you''ll thank yourself for adding them to your pop culture diet."
    ],
    [
        "The Best Korean Dramas on Netflix Right Now",
        "Here''s your go-to guide for jumping into the Korean drama craze."
    ],
    [
        "The Top 50 Highest-Rating Korean Dramas of All Time",
        "There''s no deterring our love affair with all things K-drama. In our continuous search for the best K-dramas of all time, we give you the lowdown on the highest rating Korean dramas on cable TV. Think of it as an essential tried-and-tested listicle of shows any genuine K-fan should watch"
    ],
    [
        "The 8 Best Korean Dramas on Netflix Right Now",
        "When TIME first curated its list of the 10 best Korean dramas available on Netflix in 2020, Squid Game had yet to be released. Since then, the show has become the most watched non-English show of all time. The broader landscape of Korean offerings on the streaming platform has also transformed massively, thanks to Netflix''s continuing billion-dollar investment in South Korea."
    ],
    [
        "The Best K-Dramas to Stream Right Now",
        "Get ready to dive into the world of K-dramas!"
    ]],
    [[
        "Los mejores programas coreanos para ver en Netflix: no se los puede perder",
        "Netflix ha hecho mucho por la industria de la televisión y el cine. Pero el mayor impacto que ha tenido es presentar al mundo los mejores espectáculos coreanos."
    ],
    [
        "Los 15 mejores reality shows coreanos y programas de variedades",
        "Aquellos que necesitan un descanso de todos los K-dramas tentadores que existen hoy en día encontrarán placer en ver programas de variedades y telerrealidad coreanos. El género de la televisión es un gran éxito en Corea y tiene fans de todo el mundo que entienden rápidamente por qué. Los reality shows y programas de variedades no solo incluyen temas divertidos, sino también celebridades, actores e ídolos de K-Pop coreanos conocidos."
    ],
    [
        "8 programas de variedades coreanos para todos los gustos",
        "La belleza de los programas de variedades coreanos es que siempre hay algo para todos. Además de los talk shows y reality shows que te permiten conocer de cerca a tus celebridades favoritas, hay un puñado de programas culinarios que estimulan las papilas gustativas y enseñan a la gente sobre la cocina coreana. Además, ha habido muchos programas de actividades que mantienen a los espectadores alerta durante los diversos segmentos. Seguramente, todas estas categorías lo mantendrán entretenido durante toda la vida."
    ],
    [
        "Las 45 mejores series coreanas de Netflix que harán que te enganches a los k-dramas o doramas",
        "Los dramas coreanos se han convertido en el ''must'' para seriéfilos de los que todo el mundo está hablando en redes sociales y, por ello, hemos elegido los mejores k-dramas de Netflix para principiantes que te engancharán desde el primer capítulo."
    ],
    [
        "Las mejores series coreanas a las que engancharte en Netflix",
        "El K-Pop, música popular coreana, se ha convertido en uno de los géneros musicales más extendidos en todo el mundo y todo un éxito entre los más jóvenes y adolescentes. Cuentan con atención en todo el mundo pero no es el único éxito de Corea en la cultura, también lo es la televisión. Algunas de las mejores series coreanas están disponibles en Netflix y cuentan con miles de fieles a historias que te aseguramos que te engancharán desde el principio y te pegarán al televisor."
    ],
    [
        "10 Dramas Coreanos para aprender el idioma",
        "Si estás estudiando coreano, algunas de las mejores herramientas para aprender el idioma están a sólo unos clics de distancia. Los programas de televisión coreanos se han hecho superpopulares en todo el mundo, y verlos con regularidad puede ayudarte a dominar la pronunciación, la cadencia y el vocabulario. Además, nuestro buen amigo *los subtítulos* tiene un valor incalculable; selecciona el coreano para ayudarte a trabajar en la comprensión de los personajes coreanos, o elige tu lengua materna para ayudarte a seguir el audio en coreano."
    ]]
  ]');

`;

  const insertPrestudy  = `
  INSERT INTO prestudy_test_questions (question_text, options, correct_answer) VALUES
  ("What is your proficiency in English? 1 being Elementary, 5 being Native", '["1", "2", "3", "4", "5"]', "1"),
  ("What is your proficiency in Spanish? 1 being Elementary, 5 being Native", '["1", "2", "3", "4", "5"]', "1"),
  ("Can I park hereee?", '["Sorry, I did that.", "It is the same place.", "Only for half an hour."]', "Only for half an hour."),
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
