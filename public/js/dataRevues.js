var testRevue = {
	//id: "revue0", // généré par Cécile, ne rien faire
	keywords: [ 
		"Fine Arts",
		"Literature",
		"Filmmaking",
		"Science and Technology Studies"
	],

	//links: ["sub1", "sub6", "sub5", "key26"], // généré par cécile, ne rien faire
	locationCoords: [121, 31], // Latitude-longitude. Si rien, laisser la ligne totalement vide (=> enlever le paramètre)
	about: "lorem ipsum...",
	name: "Alliage ",
	time: [1977, 2019], // Si rien, laisser la ligne totalement vide (=> enlever le paramètre)
	city: "Paris", // Si rien, laisser la ligne totalement vide (=> enlever le paramètre)
	country: "France", // Si rien, laisser la ligne totalement vide (=> enlever le paramètre)
	about: "lorem ipsum...",
	publisher: "publisher",
	link: "www.lorem.com"
}


var databaseRevue = [
	{
		id: 0,
		revueID: 1,
		name: "alliage",
		link: "www.alliage.com",
		year_start: 1920,
		year_end: 1980, // can also be empty
		ongoing: true,
		frequency: "biannual",
		publisher: "alliage-publisher",
		city: "London",
		country: "England", // not used... -> Alex?
		lat: 45,
		long: 90,
		language_val: "AR",
		language: "Arabic",
		access_val: "subscription",
		access: "Subscription only",
		medium_val: "print",
		medium: "Print",
		about: "balblablalbla",
		peer_review: true,
		note: "Lorem ipsum dolores lskjd lskdjf jerigj",
	}
]

var databaseRevueGen = [];


/*
var dataRevue = [

	{
		name : "Alliage " ,
		publisher: "Université de Nice Sophia Antipolis",
		keywords :[ "Fine Arts", "Literature", "Filmmaking", "Science and Technology Studies"],
		time: [1989, 2019],
		locationCoords: [7.266079999999988,43.7031,],
		city: "Nice",
		country: "France",
		about:"Alliage, une revue à trois dimensions : - Le vecteur d'une réflexion de fond sur les rapports de la culture, de la technoscience et de la société - Un…",
		link: "http://revel.unice.fr/alliage/"
	},
]

*/


var dataRevue = [

	{
		name : "Alliage " ,
		publisher: "Université de Nice Sophia Antipolis",
		keywords :[ "Fine Arts", "Literature", "Filmmaking", "Science and Technology Studies"],
		time: [1989, 2019],
		locationCoords: [7.266079999999988,43.7031,],
		city: "Nice",
		country: "France",
		about:"Alliage, une revue à trois dimensions : - Le vecteur d'une réflexion de fond sur les rapports de la culture, de la technoscience et de la société - Un…",
		link: "http://revel.unice.fr/alliage/"
	},

	{
		name : "Archée " ,
		keywords :[ "New Media and Technological", "Aesthetics", "Science and Technology Studies"],
		time: [1997, 2019],
		locationCoords: [-73.6103642,45.4972159,],
		city: "Montreal",
		country: "Canada",
		about: "Notre programme éditorial vise une connaissance élargie et approfondie de l’impact des nouvelles technologies de l’information et de la communication. Cela dit, ...",
		link: "http://archee.qc.ca/"

	},

	{
		name : "Architecture and Culture " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Architecture", "Literature", "Filmmaking", "Art History", "Anthropology", "Geography", "Social Sciences & Humanities"],
		time: [2013, 2019],
		locationCoords: [-0.1276474,51.5073219],
		city: "London",
		country: "United Kingdom",
		about: "Architecture and Culture, the international award winning, peer-reviewed journal of the Architectural Humanities Research Association, investigates the relationship between architecture and the culture that shapes and is shaped by it. (…)",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=rfac20"

	},

	{
		name : "ArteCienciaBrasil " ,
		keywords :[ "Visual (fine arts)", "Performance", "Science"],
		time: [2015, 2019],
		locationCoords: [-46.6333824,-23.5506507],
		city: "Sao Paulo",
		country: "Brasil",
		about: "Arte, Ciência e Tecnologia por um olhar transdisciplinar",
		link: "https://www.artecienciabrasil.org"


	},

	{
		name : "ArtLaboratory Berlin " ,
		keywords :[ "Fine Arts", "Social Sciences & Humanities", "Art History", "Law", "Science", "Biology"],
		time: [2006, 2019],
		locationCoords: [13.3888599,52.5170365],
		city: "Berlin",
		country: "Germany",
		about: "The multiple award winning art and research platform Art Laboratory Berlin (ALB) presents interdisciplinary art projects in an international context. It was founded in 2006 by an international team of art historians and artists - including Regine Rapp & Christian de Lutz. Our main goal is the presentation and mediation of contemporary art at the interface of art, science and technology. In recent years, ALB has focused on the field of art, biology and artistic research.",
		link: "http://www.artlaboratory-berlin.org/html/eng-team.htm"


	},

	{
		name : "Art Nodes " ,
		publisher: "Universitat Oberta Catalonia",
		keywords :[ "Fine Arts", "New Media and Technological", "Social Sciences & Humanities", "Science and Technology Studies"],
		time: [2002, 2019],
		locationCoords: [2.1774322,41.3828939],//barcelona
		city: "Barcelona",
		country: "Spain",
		about: "ARTNODES is an e-journal promoted by the UOC, the aim of which is to analyse the intersections between art, science and technology. (…)",
		link: "https://artnodes.uoc.edu"

	},

	{
		name : "Art & Perception " ,
		publisher: "Brill",
		keywords :[ "Fine Arts", "Philosophy", "Computer Sciences", "Biology", "Cognitive Sciences"],
		time: [2013, 2019],
		locationCoords: [-3.9614184,55.367],
		about: "The main objective of Art & Perception is to provide a high-quality platform to publish new artwork and research in the multi-disciplinary emerging bridge between art and perception.(…)",
		link: "https://brill.com/view/journals/artp/artp-overview.xml"



	},

	{
		name : "Arts & Health " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Fine Arts & Design", "Education", "social and behavioral", "Health", "Cognitive Sciences"],
		time: [2009, 2019],
		locationCoords: [-3.9614184,55.367],
		about: "Arts & Health provides a pioneering international forum for the publication of research, policy and best practice within the interdisciplinary field of arts and health. (…)",
		link: "https://www.tandfonline.com/loi/rahe20"

	},

	{
		name : "Arts Education Policy Review " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Fine Arts", "Visual (fine arts)", "Sound (fine arts)", "Performance", "Education", "Political Sciences"],
		time: [1992, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
		city: "Michigan",
		country: "United States",
		about: "Arts Education Policy Review ( AEPR) presents discussion of major policy issues in arts education in the United States and throughout the world. Addressing education in music, visual arts, theatre, and dance, the journal presents a variety of views and emphasizes critical analysis. ",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=vaep20"

	},

	{
		name : "Back Office " ,
		publisher: "Fork Éditions",
		keywords :[ "Design", "Media Studies", "Digital Humanities", "Science and Technology Studies", "Computer Sciences"],
		locationCoords: [2.3514616,48.8566969],
		city: "Paris",
		country: "France",
		about: "Back Office répond à un état de fait : malgré le nombre croissant d’ouvrages dédiés au design graphique dans le contexte francophone, peu de recherches abordent de front les enjeux du numérique. (…)",
		link: "http://www.revue-backoffice.com/en#"


	},

	{
		name : "Cahiers Arts & Sciences de l'Art" ,
		publisher: "Harmattan",
		keywords :[ "Fine Arts", "Social Sciences & Humanities", "Aesthetics"],
		time: [2000, 2019],
		locationCoords: [2.3514616,48.8566969],//PAris
		city: "Paris",
		country: "France",
		// about: "lorem ipsum...",
		link: "https://www.editions-harmattan.fr/index.asp?navig=catalogue&obj=revue&no=54"



	},

	{
		name : "Cahiers virtuel " ,
		publisher: "ALN/NT2",
		keywords :[ "Literature", "Aesthetics", "Science and Technology Studies"],
		time: [2008, 2019],
		locationCoords: [-73.6103642,45.4972159],//Montreal
		city: "Montreal",
		country: "Canada",
		about: "Les cahiers virtuels sont un lieu de diffusion d’articles inédits traitant de divers aspects des arts et des littératures hypermédiatiques.",
		link: "http://nt2.uqam.ca/fr/cahiers-virtuels"


	},

	{
		name : "Creativity Research Journal " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Fine Arts", "Education", "Aesthetics", "Philosophy", "Psychology", "social and behavioral", "Biology", "Cognitive Sciences", "Science"],
		time: [1988, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
		city: "Michigan",
		country: "United States",
		about: "Creativity Research Journal publishes high-quality, scholarly research capturing the full range of approaches to the study of creativity--behavioral, clinical, cognitive, crosscultural, developmental, educational, genetic, organizational, psychoanalytic, psychometrics, and social. ",
		link: "https://www.mitpressjournals.org/toc/comj/current"

	},

	{
		name : "Computer Music Journal" ,
		publisher: "The MIT Press Journals",
		keywords :[ "Sound (fine arts)", "Sound (design)", "New Media and Technological", "Engineering, Mechanics and Electronics"],
		time: [1977, 2019],
		locationCoords: [-71.0582912,42.3602534],//Boston
		city: "Boston",
		country: "United States",
		about: "Computer Music Journal is published quarterly with an annual sound and video anthology containing curated music¹. For four decades, it has been the leading publication about computer music, concentrating fully on digital sound technology and all musical applications of computers. ",
		link: "https://creativedisturbance.org"

	},


	{
		name : "Creative Disturbance" ,
		keywords :[ "Fine Arts", "Literature", "Philosophy", "Computer Sciences", "Engineering, Mechanics and Electronics"],
		time: [2018, 2019],
		locationCoords: [-96.7968559,32.7762719],//Dallas
		city: "Dallas",
		country: "United States",
		about: "Creative Disturbance is an international, multi-lingual, online platform that provides a unique virtual environment for the intellectually curious across the globe to meet, network, collaborate, create, and socialize.",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=hcrj20"

	},	


	{
		name : "Cybernetics & Human Knowing " ,
		publisher: "Imprint Academic",
		keywords :[ "Fine Arts & Design", "Social Sciences & Humanities", "Political Sciences", "Library and information studies", "Education", "Languages",  "Business, Admin & Management", "Science", "Computer Sciences", "Health", "Cognitive Sciences", "Medicine"],
		time: [2013, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
		about: "Cybernetics and Human Knowing is a quarterly international multi- and transdisciplinary journal focusing on second-order cybernetics and cybersemiotic approaches.",
		link: "http://chkjournal.com/about"
	},

	//Problème il n'y a que deux keywords (même dans le fichier d'origine)
	// {
	// 	name : "Demonstrations: Journal for Experiments in Social Studies of Technology " ,
	// 	keywords :[ "Fine Arts & Design", "Science and Technology Studies"],
	// },

	{
		name : "Design" ,
		keywords :[ "Fine Arts", "Visual (fine arts)", "Sound (fine arts)", "Performance", "Education", "Political Sciences"],
		time: [1899, 1977],
		about : "Now: Arts Education Policy Review",

	},

	{
		name : "Design and culture " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Design", "Anthropology", "Geography", "Business, Admin & Management", "Retailing, marketing, sales, public relations", "Science"],
		time: [2009, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
		city: "Michigan",
		country: "United States",
		about: "Design and Culture reflects the state of scholarship in the field of design and nutures new or overlooked lines of inquiry that redefine our understanding of design. ",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=rfdc20"
	},

	{
		name : "Design for Health " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Design", "Education", "Psychology", "Health"],
		time: [2017, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
		city: "Michigan",
		country: "United States",
		about: "Design for Health is an international refereed journal covering all aspects of design in the context of health and wellbeing. The Journal is published twice a year and provides a forum for design and health scholars, design professionals, health-care practitioners, educators and managers worldwide.",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=rfdh20"

	},

	{
		name : "Design for Arts in Education" ,
		keywords :[ "Fine Arts", "Visual (fine arts)", "Sound (fine arts)", "Performance", "Education", "Political Sciences"],
		time: [1977, 1992],
		link: "Now: Arts Education Policy Review"
	},


	{
		name : "Design Issues " ,
		publisher: "The MIT Press Journals",
		keywords :[ "Design", "Science and Technology Studies", "Business, Admin & Management", "Engineering, Mechanics and Electronics"], 
		time: [2000, 2019],
		locationCoords: [-71.0582912,42.3602534],//Boston
		city: "Boston",
		country: "United States",
		about: "The first American academic journal to examine design history, theory, and criticism, Design Issues provokes inquiry into the cultural and intellectual issues surrounding design. ",
		link: "https://www.mitpressjournals.org/toc/desi/current"
	},


	{
		name : "Design Philosophy Papers " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Design", "Ethics", "Philosophy", "Anthropology"],
		time: [2003, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
		city: "Michigan",
		country: "United States",
		about: "Design Philosophy Papers (DPP) exists to advance critical, philosophical engagement with design and ‘the world as designed’. ",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=rfdp20"


	},

	{
		name : "Design Science " ,
		publisher: "Cambridge University Press",
		keywords :[ "Architecture", "Design", "Science and Technology Studies", "social and behavioral", "Library and information studies", "Business, Admin & Management", "Cognitive Sciences", "Life Sciences", "Computer Sciences", "Engineering, Mechanics and Electronics", "Health"],
		time: [2015, 2019],
		locationCoords: [0.1235817,52.2034823],//Cambridge
		city: "Cambridge",
		country: "United Kingdom",
		about: "The aim of the Design Science Journal is to serve as the archival venue of science-based design knowledge across multiple disciplines.",
		link: "http://www.designsciencejournal.org/"


	},

	{
		name : "Design Studies " ,
		publisher: "Elsevier",
		keywords :["Architecture", "Design", "Philosophy", "Ethics", "Cognitive Sciences", "Computer Sciences", "Engineering, Manufacturing and Construction"],
		time: [1979, 2019],
		locationCoords: [2.3514616,48.8566969],
		city: "Paris",
		country: "France",
		about: "Design Studies is a leading international academic journal focused on developing understanding of design processes. It studies design activity across all domains of application, including engineering and product design, architectural and urban design, computer artefacts and systems design.",
		link: "https://www.journals.elsevier.com/design-studies/"

	},

	{
		name : "Diafanís " ,
		keywords :[ "Fine Arts", "Languages", "Science"],
		time: [2017, 2019],
		locationCoords: [-99.1333416,19.4326009],//Mexico
		city: "Mexico city",
		country: "Mexico",
		// about: "lorem ipsum...",
		link: "http://www.revistadiafanis.com.ar/category/archivo/"


	},

	{
		name : "Digicult/DigiMag Journal " ,
		keywords :[ "Fine Arts & Design", "Anthropology", "Science and Technology Studies"],
		link: "http://digicult.it"
	},

	{
		name : "Digital Creativity " ,
		publisher: "Taylor & Francis online",
		time: [1997, 2019],
		keywords :[ "Fine Arts & Design", "Sound (fine arts)", "Fashion", "Game Design", "Architecture", "Filmmaking", "Law", "Computer Sciences", "Urban planning"],
		about : "Digital Creativity is a major peer-reviewed journal at the intersection of the creative arts, design and digital technologies. It publishes articles of interest to those involved in the practical task and theoretical aspects of making or using digital media in creative disciplines.",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=ndcr20"
		

	},


	{
		name : "Digithum " ,
		publisher: "Universitat Oberta Catalonia",
		keywords :[ "Fine Arts", "Social Sciences & Humanities", "Art History", "Media Studies", "Sociology"],
		time: [1999, 2019],
		locationCoords: [2.1774322,41.3828939],//Barcelona
		city: "Barcelona",
		country: "Spain",
		about: "Digithum applies a relational perspective on the analysis of our subjective experiences, our social bonds and our cultural heritage. These objects of study can be approached and studied from different disciplines: sociological/social theory, historical sociology, sociology of culture and sociology of emotions, cultural theory, film theory, media studies, arts, and humanities. ",
		link: "https://digithum.uoc.edu/about/"

	},

	{
		name : "Early Popular Visual Culture " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Filmmaking", "Craft", "Visual (fine arts)", "Performance", "Education", "Sociology", "Economics", "Science"],
		time: [2005, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
		city: "Michigan",
		country: "United States",
		about: "Early Popular Visual Culture (EPVC) is a peer-reviewed, academic journal dedicated to stimulating research and interdisciplinary studies in relation to all forms of popular visual culture before 1930.",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=repv20"

	},

	{
		name : "Ergonomics " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Design", "Psychology", "Business, Admin & Management", "Engineering, Manufacturing and Construction", "Ergonomics", "Biology", "Cognitive Sciences"],
		time: [1957, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
		city: "Michigan",
		country: "United States",
		about: "Ergonomics, also known as human factors, is the scientific discipline that seeks to understand and improve human interactions with products, equipment, environments and systems. Drawing upon human biology, psychology, engineering and design, Ergonomics aims to develop and apply knowledge and techniques to optimise system performance, whilst protecting the health, safety and well-being of individuals involved. ",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=terg20"

	},

	{
		name : "E-squared Magazine " ,
		keywords :[ "Fine Arts", "Science", "Biology", "Engineering, Manufacturing and Construction"],
		time: [2016, 2019],
		locationCoords: [-102.868,46.5392],//New england
		city: "New England",
		country: "United States",
		about: "E-Squared is an international, quarterly print magazine that draws from both art + science and is the embodiment of this synergy.",
		link: "http://www.esquaredmagazine.com/about/"

	},


	{
		name : "Grey Room " ,
		publisher: "The MIT Press Journals",
		keywords :[ "Fine Arts", "Architecture", "Art History", "Media Studies", "Political Sciences"],
		time: [2000, 2019],
		locationCoords: [0.1235817,52.2034823],//Cambridge
		city: "Cambridge",
		country: "United Kingdom",
		about: "Grey Room brings together scholarly and theoretical articles from the fields of architecture, art, media, and politics to forge a cross-disciplinary discourse uniquely relevant to contemporary concerns. ",
		link: "https://www.mitpressjournals.org/loi/grey"

	},


	{
		name : "Harvard design magazine " ,
		publisher: "Harvard University Graduate School of Design",
		keywords :[ "Fine Arts & Design", "Architecture", "Literature", "Science", "Urban planning"],
		time: [1997, 2019],
		locationCoords: [0.1235817,52.2034823],//Cambridge
		city: "Cambridge",
		country: "United Kingdom",
		about: "Relaunched in summer 2014, Harvard Design Magazine probes beyond the established design disciplines to enrich and diversify current discourse. Scholarly, poetic, and visually lush, each issue triggers new interpretations of design’s defining role in today’s culture. ",
		link: "http://www.harvarddesignmagazine.org/about"

	},


	{
		name : "Hybrid: Revue des arts et mediations humaines " ,
		publisher: "Presses Universitaires de Vincennes",
		keywords :[ "Fine Arts", "Literature", "Digital Humanities"],
		time: [2014, 2019],
		locationCoords: [2.3514616,48.8566969],//PAris
		city: "Paris",
		country: "France",
		about: "La revue Hybrid s’inscrit dans le vaste champ de réflexion des humanités digitales. Elle met l’accent en particulier sur la relation entre les technologies numériques et les pratiques artistiques et littéraires, mais aussi sur la place du sujet dans les environnements numériques et les pratiques de recherche transformées par le numérique.",
		link: "http://www.hybrid.univ-paris8.fr/lodel/"

	},

	{
		name : "Intelligent Tutoring Media" ,
		keywords :[ "Fine Arts & Design", "Sound (fine arts)", "Fashion", "Game Design", "Filmmaking", "Architecture", "Law", "Computer Sciences", "Urban planning"],
		time: [1990, 1997],
		link: "Now: Digital Creativity"

	},


	{
		name : "Interdisciplinary Science Reviews " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Fine Arts", "Social Sciences & Humanities", "Philosophy", "Mathematics and statistics", "Computer Sciences", "Engineering, Manufacturing and Construction", "Medicine"],
		time: [1976, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
		city:"Michigan",
		country: "United States",
		about:"Interdisciplinary Science Reviews is a quarterly journal that aims to explore the social, philosophical and historical interrelations of the natural sciences, engineering, mathematics, medicine and technology with the social sciences, humanities and arts. ",
		link: "https://www.tandfonline.com/loi/yisr20"

	},


	{
		name : "Interiors" ,
		publisher: "Taylor & Francis online",
		time:[2010, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
		city:"Michigan",
		country: "United States",
		keywords :[ "Architecture", "Design", "Art History", "History", "Anthropology"],
		about:"Interiors: Design, Architecture, Culture brings together the best critical work on the analysis of all types of spaces. Interiors play a crucial role in the construction of identity and they represent power and control through the contestation or transgression of boundaries. Homes, offices, shopping malls, schools and hospitals, churches and restaurants are all embedded with meaning and evince particular, multi-sensory and psychological responses. This journal will investigate the complexities of the interior  environment’s orchestration and composition and its impact on the inhabitant from a trans-disciplinary perspective.",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=rfin20"

	},

	{
		name : "International Journal of Education through Art " ,
		publisher: "Intellect",
		time:[2005, 2019],
		locationCoords: [-127.647621,53.726669], // BUG? j'ai changé l'ordre
		city:"BC Canada",
		country: "Canada",
		keywords :[ "Fine Arts & Design", "Craft", "Languages", "Education", "Sociology", "Art History"],
		about:" The International Journal of Education through Art [IJETA], is the English language journal that promotes relationships between art and education. The term ‘art education’ should be taken to include art, craft and design education. Each issue, published three times a year within a single volume, consists of peer-reviewed articles mainly in the form of research reports and critical essays, but may also include exhibition reviews and image-text features.",
		link: "http://www.intellectbooks.co.uk/journals/view-Journal,id=121/"
	},


	{
		name : "International Journal of Robots ,Education and Art ",
		publisher: "Convergence Information Society",
		keywords :[ "Fine Arts & Design", "Education", "Political Sciences", "Anthropology", "Science and Technology Studies"],
		time: [2010, 2019],
		about:"The International Journal of Robots, Education and Art is an interdisciplinary, peer-reviewed journal that publishes original papers on the whole spectrum of research work that discusses the theory, practices, interdisciplinary issues and innovations about robots, educational technology, and creative art.",
		link: "http://www.globalcis.org/ijrea/home/cfp.html"
	},


	{
		name : "International Journal of Arts and Technology " ,
		publisher: "InderScience Publishers",
		time: [2008, 2019],
		about:"IJART addresses arts and new technologies, highlighting computational art. With evolution of intelligent devices, sensors and ambient intelligent/ubiquitous systems, projects are exploring the design of intelligent artistic artefacts. Ambient intelligence supports the vision that technology becomes invisible, embedded in our natural surroundings, present whenever needed, attuned to all senses, adaptive to users/context and autonomously acting, bringing art to ordinary people, offering artists creative tools to extend the grammar of the traditional arts. Information environments will be the major drivers of culture.",
		keywords :[ "Fine Arts & Design", "Social Sciences & Humanities", "Aesthetics", "Life Sciences", "Biology", "Cognitive Sciences",  "Computer Sciences", "Engineering, Mechanics and Electronics"],
		link: "https://www.inderscience.com/jhome.php?jcode=ijart"
	},


	{
		name : "International Journal of Design " ,
		time: [2007, 2019],
		about:"The International Journal of Design is a peer-reviewed, open-access journal devoted to publishing research papers in all fields of design, including industrial design, visual communication design, interface design, animation and game design, architectural design, urban design, and other design related fields. ",
		keywords :[ "Game Design", "Sociology", "Design", "Engineering, Manufacturing and Construction", "Ergonomics"],
		link: "http://www.ijdesign.org/index.php/IJDesign"
	},

	{
		name : "The International Journal of Design Creativity and Innovation " ,
		publisher: "Taylor & Francis online",
		time: [2013, 2019],
		about:"The International Journal of Design Creativity and Innovation is an international publication that provides a forum for discussing the nature and potential of creativity and innovation in design from both theoretical and practical perspectives. Design creativity and innovation is truly an interdisciplinary academic research field that will interest and stimulate researchers of engineering design, industrial design, architecture, art, and similar areas.", 
		keywords :[ "Fine Arts & Design", "Architecture", "Social Sciences & Humanities", "Linguistic, translation, comparative literature", "Philosophy", "Psychology", "Library and information studies", "Cognitive Sciences", "Computer Sciences", "Engineering, Manufacturing and Construction"],
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=tdci20"
	},

	// Idem que 2 keywords
	// {
	// 	name : "International Journal of Digital Arts and Design Association (adada) " ,
	// 	keywords :[ "Fine Arts & Design", "Media Studies"],
	//	publisher:"Asia Digital Art and Design Ass.",
	//	city:"Tokyo",
	//  about:"The aim of this association is to establish a theoretical method of media art design that is created by the rich harmony of art sense and human logical thinking based on media technology. Further it aims to use our distinctive ethnic and cultural identities to explore common problems as we contribute to developing academic research and industry in Asia.",
	// 	link:"http://adada.info/index.php/archives/"
	// },


	{
		name : "International Journal of Fashion Design ,Technology and Education ",
		publisher: "Taylor & Francis online",
		time: [2008, 2019],
		about:"International Journal of Fashion Design, Technology and Education aims to provide a high quality peer-reviewed forum for research in fashion design, pattern cutting, apparel production, manufacturing technology and fashion education. The Journal will encourage interdisciplinary research and the development of an academic community which will share newly developed technology, theory and techniques in the fashion and textile industries, as well as promote the development of excellent education practice in the clothing and textile fields. ",
		keywords :[ "Fashion", "Education", "Manufacturing and processing"],
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=tfdt20"
	},



	{
		name : "The Journal of Aesthetics and Art Criticism " ,
		publisher: "The American Society for Aesthetics",
		time: [1942, 2019],
		about:"The Journal of Aesthetics and Art Criticism publishes current research articles, symposia, special issues, and timely book reviews in aesthetics and the arts. The term aesthetics, in this connection, is understood to include all studies of the arts and related types of experience from a philosophic, scientific, or other theoretical standpoint. The arts are taken to include not only the traditional forms such as music, literature, landscape architecture, dance, painting, architecture, sculpture, and other visual arts, but also more recent additions such as photography, film, earthworks, performance and conceptual art, the crafts and decorative arts, contemporary digital innovations, and other cultural practices, including work and activities in the field of popular culture.",
		keywords :[ "Sound (fine arts)", "Fine Arts", "Literature", "Art History", "Aesthetics", "Philosophy", "Psychology", "Law"],
		link: "https://onlinelibrary.wiley.com/page/journal/15406245/homepage/productinformation.html"
	},

	{
		name : "Journal of Arts Management and Law",
		time: [1982, 1992],
		keywords :[ "Fine Arts & Design", "History", "Aesthetics", "Philosophy", "Economics", "Political Sciences", "Sociology", "Business, Admin & Management", "Law"],
		link: "Now Journal of Arts Management, Law and Society"
	},


	{
		name : "Journal of Arts Management, Law and Society",
		publisher: "Taylor & Francis online",
		time: [1992, 2019],
		about:"How will technology change the arts world? Who owns what in the information age? How will museums survive in the future? The Journal of Arts Management, Law, and Society has supplied answers to these kinds of questions for more than twenty-five years, becoming the authoritative resource for arts policymakers and analysts, sociologists, arts and cultural administrators, educators, trustees, artists, lawyers, and citizens concerned with the performing, visual, and media arts, as well as cultural affairs. Articles, commentaries, and reviews of publications address marketing, intellectual property, arts policy, arts law, governance, and cultural production and dissemination, always from a variety of philosophical, disciplinary, and national and international perspectives." , 
		keywords :[ "Fine Arts & Design", "History", "Aesthetics", "Philosophy", "Economics", "Political Sciences", "Sociology", "Business, Admin & Management", "Law"],
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=vjam20"
	},


	{
		name : "Journal on Computing and Cultural Heritage" ,
		publisher: "ACM New York",
		keywords :[ "Sound (fine arts)", "Craft", "Performance", "Digital Humanities", "History", "Art History", "Archeology", "Computer Sciences"],
		locationCoords: [40.712776,-74.005974],//NYC
		city:"New York",
		country: "United States",
		time: [2008, 2019],
		about:"ACM Journal on Computing and Cultural Heritage (JOCCH) publishes papers of significant and lasting value in all areas relating to the use of information and communication technologies (ICT) in support of Cultural Heritage. The journal encourages the submission of manuscripts that demonstrate innovative use of technology for the discovery, analysis, interpretation and presentation of cultural material, as well as manuscripts that illustrate applications in the Cultural Heritage sector that challenge the computational technologies and suggest new research opportunities in computer science.",
		link: "https://jocch.acm.org/about.cfm"
	},



	{
		name : "Journal of Design and Science " ,
		publisher: "MIT Press / MIT Media Lab",
		keywords :[ "Design" , "Social Sciences & Humanities", "Science"],
		locationCoords: [-97.692993,26.164440],//Massachussetts // bug? j'ai changé l'ordre
		city:"Massachussetts",
		country: "United States",
		time: [2016, 2019],
		about:"The Journal of Design and Science (JoDS), a joint venture of the MIT Media Lab and the MIT Press, forges new connections between science and design, breaking down the barriers between traditional academic disciplines in the process. Targeting readers with open, curious minds, JoDS explores timely, controversial topics in science, design, and society with a particular focus on the nuanced interactions among them", 
		link: "https://jods.mitpress.mit.edu/"
	},

	{
		name : "The journal of Information visualization " ,
		keywords :[ "Design", "Media Studies", "Cognitive Sciences", "Computer Sciences"],
		time: [2001, 2019],
		about: "Information Visualization is an international, peer-reviewed journal publishing articles on fundamental research and applications of information visualization. The journal acts as a dedicated forum for the theories, methodologies, techniques and evaluations of information visualization and its applications.",
		link: "https://uk.sagepub.com/en-gb/eur/journal/information-visualization#aims-and-scope"	
	},


	{
		name : "The Journal of Science and Technology of the Arts (CITARJ)" ,
		publisher: "Portuguese Catholic University",
		keywords :[ "Fine Arts", "Computer Sciences", "Engineering, Mechanics and Electronics"],
		locationCoords: [38.722252,-9.139337],//Lisbon
		city:"Lisbon",
		country: "Portugal",
		time: [2009, 2019],
		about:"The Journal of Science and Technology of the Arts (CITARJ) covers a wide range of topics related to the study and practice of Artistic work approached through Science and Technology, ",
		link: "http://artes.ucp.pt/citarj/"

	},


	{
		name : "The Journal of the Society for Arts and Science " ,
		publisher: "The Society for Art and Science",
		locationCoords: [139.691711,35.689487],//Tokyo // bug? => j'ai changé l'ordre
		city:"Tokyo",
		country: "Japan",
		time: [2002, 2019],
		keywords :[ "Fine Arts", "Library and information studies", "Science"],
		link: "https://www.jstage.jst.go.jp/browse/artsci/_pubinfo/-char/en"
	},

	{
		name : "Journal of Visual Art Practice " ,
		publisher: "Taylor & Francis online",
		locationCoords: [-0.136420,50.819520],//Brighton //BUG => c'était inversé
		city:"Birghton",
		country: "United Kingdom",
		time: [2001, 2019],
		about:"The Journal of Visual Art Practice (JVAP) is a forum of debate and inquiry for research in art. JVAP is concerned with visual art practice including the social, economic, political and cultural frames within which the formal concerns of art and visual art practice are located. The journal is concerned with research engaged in these disciplines, and with the contested ideas of knowledge formed through that research.",
		keywords :[ "Visual (fine arts)", "Fine Arts", "Art History", "Economics", "Political Sciences", "Sociology", "Anthropology", "Philosophy", "Aesthetics", "Digital Humanities"],
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=rjvp20"
	},


	{
		name : "Laboratory for Aesthetics and Ecology " ,
		locationCoords: [12.568337,55.676098],//Copenhagen //BUG => c'était inversé
		city:"Copenhagen",
		country: "Denmark",
		time: [2014, 2019],
		about:"Concerned with questions of global multispecies sufferings and environmental distress, we work with experimental exhibition formats and knowledge productions in the knotty entanglements between the human and the non-human, between the arts and the sciences, guided by posthuman and feministic strategies – be they artistic, theoretical, scientific or everything at once.",
		keywords :[ "Fine Arts","Curatorial Studies", "Literature", "Philosophy", "Aesthetics", "Art History", "Science"],
		link: "http://www.labae.org/about/"
	},

	{
		name : "Leonardo " ,
		publisher: "MIT Press",
		keywords :[ "Fine Arts & Design", "Social Sciences & Humanities" , "Science"],
		locationCoords: [-97.692993,26.164440],//Massachussetts // bug? => j'ai changé l'ordre
		city:"Massachussetts",
		country: "United States",
		time: [1968, 2019],
		about:"Leonardo is the leading international peer-reviewed journal on the use of contemporary science and technology in the arts and music and, increasingly, the application and influence of the arts and humanities on science and technology. ",
		link: "https://www.mitpressjournals.org/loi/leon"
	},

	// {
	// 	name : "mcd " ,
	// 	keywords :[ ],
	//	city:"Paris",
	//	time: [2003, 2016],
	// 	link: "https://www.digitalmcd.com/category/magazine/revue-mcd/"
	// },



	{
		name : "Media-N " ,
		keywords :[ "New Media and Technological" , "Art History" , "Media Studies"],
		time: [2005, 2019],
		about:"The mission of the journal is to promote academic inquiry; to reflect the wide variety of themes and areas in new media research; to further the evolving discourses related to theory and practice; to showcase the work of new media artists and their presentation environments; and to investigate the issues surrounding education and new media. ",
		link: "http://median.newmediacaucus.org"
	},

	{
		name : "Nautilus " ,
		keywords :[ "Fine Arts", "Literature", "Education", "Languages", "Archeology", "Philosophy", "Economics", "Anthropology", "Sociology", "Psychology", "Life Sciences", "Physical Sciences", "Mathematics and statistics", "Computer Sciences", "Health"],
		time: [2013, 2019],
		about:"Each issue combines the sciences, culture and philosophy into a single story told by the world’s leading thinkers and writers. We follow the story wherever it leads us. Read our essays, investigative reports, and blogs. Fiction, too. Take in our games, videos, and graphic stories. Stop in for a minute, or an hour. Nautilus lets science spill over its usual borders. We are science, connected.",
		link: "http://nautil.us"
	},

	// {
	// 	name : "Neural " ,
	// 	keywords :[ "Sound (fine arts)" , "New Media and Technological" , "Sound (design)" , "Media Studies" , "Computer Sciences"],
	// time: [1993, 2019],

	// 	link: "www.lorem.com"
	// },


	{
		name : "Pamlipsets " ,
		publisher: "Suny Press",
		keywords :[ "Fine Arts" , "Sound (fine arts)", "Literature", "Philosophy" , "Aesthetics" , "Political Sciences" , "Geography"],
		time: [2012, 2019],
		about:"Palimpsest: A Journal on Women, Gender, and the Black International is a peer-reviewed journal that publishes cutting-edge interdisciplinary scholarship and creative work by and about women of the African Diaspora and their communities in the Atlantic and Indian Ocean worlds.",
		link: "https://muse.jhu.edu/journal/609"
	},

	{
		name : "Performing Arts Review" ,
		time: [1969, 1981],
		keywords :[ "Fine Arts & Design", "Economics", "Political Sciences", "Sociology", "History",	"Business, Admin & Management",	"Law", "Philosophy", "Aesthetics"],
		link: "Now the Journal of Arts Management, Law, and Society"

	},

	{
		name : "Plastik Arts & Sciences " ,
		publisher: "Université Paris 1 Panthéon-Sorbonne",
		keywords :[ "Fine Arts" , "Aesthetics" , "Science"],
		about:"L’objectif essentiel de cette publication est la mise en valeur des deux postures cardinales, création et recherche, telles qu’elles s’entrelacent, se contrarient ou se déploient dans le travail des plasticiens.",
		city:"Paris",
		locationCoords: [2.3514616,48.8566969],
		country: "France",
		time: [2010, 2019],
		link: "https://plastik.univ-paris1.fr/"
	},

	{
		name : "Polymath " ,
		publisher: "College of Arts & Sciences at Southern Illinois university Edwardsville",
		keywords :[ "Fine Arts", "Visual (fine arts)", "Sound (fine arts)", "Performance", "Literature", "Social Sciences & Humanities", "Philosophy", "Languages", "History", "Political Sciences", "Sociology", "Psychology", "Biology", "Science", "Physics", "Chemistry", "Mathematics and statistics"],
		city:"Illinois ",
		locationCoords: [-89.398529,40.633125],//Illinois //BUG? j'ai inversé
		country: "United States",
		time: [2011, 2019],
		about:"Polymath is a peer-reviewed journal dedicated to interdisciplinarity, published biannually in an electronic format at no charge to its readers. The journal celebrates the oft-neglected connections between humanities (language, literature, philosophy, speech and communication), social sciences (history, sociology, political science, psychology, social work), physical sciences (biology, chemistry, mathematics, physics), and the arts (dance, theatre, music, visual arts) where the disciplines can unite, collaborate, and engage with each other towards shared research-oriented and educational goals. ",
		link: "https://ojcs.siue.edu/ojs/index.php/polymath/about"
	},


	{
		name : "Public Art Dialogue " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Fine Arts", "Architecture", "Art History", "Urban planning"],
		time: [2011, 2019],
		about:"Public Art Dialogue serves as a forum for critical discourse and commentary about the practice of public art defined as broadly as possible to include: memorials, object art, murals, urban and landscape design projects, social interventions, performance art, and web-based work. Public Art Dialogue is a scholarly journal, welcoming of new and experimental modes of inquiry and production. Most issues are theme-based, and each features both peer-reviewed articles and artists' projects. ",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=rpad20"
	},


	{
		name : "SoundEffects " ,
		keywords :[ "Sound (design)", "Architecture", "Linguistic, translation, comparative literature", "Aesthetics", "Media Studies", "Sociology", "Psychology", "Health"],
		locationCoords: [12.568337,55.676098],//Copenhagen // bug? j'ai inversé
		city:"Copenhagen",
		country: "Denmark",
		time: [2011, 2019],
		about:"SoundEffects. An Interdisciplinary Journal of Sound and Sound Experience is a peer-reviewed online journal that brings together a plurality of theories, methodologies, and historical approaches applicable to sound as both mediated and unmediated experience. The journal primarily addresses disciplines within media and communication studies, aesthetics, musicology, comparative literature, cultural studies, and sociology. In order to push the border of interdisciplinary sound studies into new areas, we also incourage contributions from disciplines such as psychology, health care, architecture, and sound design. ",
		link: "https://www.soundeffects.dk/about#focusAndScope"
	},


	// {
	// 	name : "Spatial Cognition and Computation " ,
	// 	keywords :[ "Architecture", "Philosophy", "Psychology", "Geology", "Mathematics and statistics", "Computer Sciences", "Urban planning", "Cognitive Sciences"],
		
	// 	// link: "www.lorem.com"
	// },


	{
		name : "Technoetic Arts: A Journal of Speculative Research " ,
		publisher: "Intellect",
		keywords :[ "Fine Arts & Design", "New Media and Technological", "Aesthetics", "Philosophy", "Science and Technology Studies", "Cognitive Sciences", "Life Sciences"],
		locationCoords: [-4.138512,50.374121],//[-85.622410,38.170150],//Plymouth U // bug? 
		city:"University of Plymouth",
		country: "United Kingdom",
		time: [2003, 2019],
		about:"Drawing from academic research and often unorthodox approaches, Technoetic Arts is a peer-reviewed journal that explores the juncture of art practice, technology and the human mind, opening up a forum for trans-disciplinary speculative research.",
		link: "https://www.intellectbooks.com/technoetic-arts-a-journal-of-speculative-research"

	},


	{
		name : "Virtual Creativity (Formerly: Metaverse Creativity)" ,
		publisher: "Intellect",
		keywords :[ "Fine Arts & Design", "Game Design" , "Architecture", "Education" , "Art History" , "Media Studies" , "Science and Technology Studies" , "Health"],
		time: [2010, 2019],
		about:"Virtual Creativity (VCR) is an academic peer-reviewed journal focusing on creativity in online virtual worlds and platforms, as well as in contemporary media art practices and applied contexts. Pieces exploring digital creativity are sought from the perspective of Art, Science and Technology. Examining a widespread field of discourse, VCR seeks to engage with ways in which the virtual reflects on the implications of the physical.",
		link: "https://www.intellectbooks.co.uk/journals/view-journal,id=179/"
	},


]

 
//TO TEST with just 5 entries
/*
var dataRevue = [

	{
		name : "Alliage " ,
		publisher: "Université de Nice Sophia Antipolis",
		keywords :[ "Fine Arts", "Literature", "Filmmaking", "Science and Technology Studies"],
		time: [1989, 2019],
		locationCoords: [7.266079999999988,43.7031,],
		city: "Nice",
		country: "France",
		about:"Alliage, une revue à trois dimensions : - Le vecteur d'une réflexion de fond sur les rapports de la culture, de la technoscience et de la société - Un…",
		link: "http://revel.unice.fr/alliage/"
	},

	{
		name : "Archée " ,
		keywords :[ "New Media and Technological", "Aesthetics", "Science and Technology Studies"],
		time: [1997, 2019],
		locationCoords: [-73.6103642,45.4972159,],
		city: "Montreal",
		country: "Canada",
		about: "Notre programme éditorial vise une connaissance élargie et approfondie de l’impact des nouvelles technologies de l’information et de la communication. Cela dit, ...",
		link: "http://archee.qc.ca/"

	},

	{
		name : "Architecture and Culture " ,
		publisher: "Taylor & Francis online",
		keywords :[ "Architecture", "Literature", "Filmmaking", "Art History", "Anthropology", "Geography", "Social Sciences & Humanities"],
		time: [2013, 2019],
		locationCoords: [-0.1276474,51.5073219],
		city: "London",
		country: "United Kingdom",
		about: "Architecture and Culture, the international award winning, peer-reviewed journal of the Architectural Humanities Research Association, investigates the relationship between architecture and the culture that shapes and is shaped by it. (…)",
		link: "https://www.tandfonline.com/action/journalInformation?show=aimsScope&journalCode=rfac20"

	},

	{
		name : "ArteCienciaBrasil " ,
		keywords :[ "Visual (fine arts)", "Performance", "Science"],
		time: [2015, 2019],
		locationCoords: [-46.6333824,-23.5506507],
		city: "Sao Paulo",
		country: "Brasil",
		about: "Arte, Ciência e Tecnologia por um olhar transdisciplinar",
		link: "https://www.artecienciabrasil.org"


	},

	{
		name : "ArtLaboratory Berlin " ,
		keywords :[ "Fine Arts", "Social Sciences & Humanities", "Art History", "Law", "Science", "Biology"],
		time: [2006, 2019],
		locationCoords: [13.3888599,52.5170365],
		city: "Berlin",
		country: "Germany",
		about: "The multiple award winning art and research platform Art Laboratory Berlin (ALB) presents interdisciplinary art projects in an international context. It was founded in 2006 by an international team of art historians and artists - including Regine Rapp & Christian de Lutz. Our main goal is the presentation and mediation of contemporary art at the interface of art, science and technology. In recent years, ALB has focused on the field of art, biology and artistic research.",
		link: "http://www.artlaboratory-berlin.org/html/eng-team.htm"


	},
]





/* TO TEST with smaller datas
var dataRevue = [

	{
		name : "Alliage " ,
		publisher: "publisher",
		keywords :[ "Fine Arts", "Literature", "Filmmaking", "Science and Technology Studies"],
	},

	{
		name : "Archée " ,
		keywords :[ "New Media and Technological", "Aesthetics", "Science and Technology Studies"],
	},

	{
		name : "ArteCienciaBrasil " ,
		keywords :[ "Visual (fine Arts)", "Performance", "Science"],
	},

	{
		name : "ArtLaboratory Berlin " ,
		keywords :[ "Fine Arts", "Social Sciences & Humanities", "Art History", "Law", "Science", "Biology"],
	},

	{
		name : "Art & Perception " ,
		keywords :[ "Fine Arts", "Philosophy", "Computer Sciences", "Biology", "Cognitive Sciences"],
	},

	{
		name : "Arts & Health " ,
		keywords :[ "Fine Arts & Design", "Education", "social and behavioral", "Health", "Cognitive Sciences"],
	},

]*/

