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
	name: "Alliage ",
	time: [1977, 2019], // Si rien, laisser la ligne totalement vide (=> enlever le paramètre)
	city: "Paris", // Si rien, laisser la ligne totalement vide (=> enlever le paramètre)
	country: "France", // Si rien, laisser la ligne totalement vide (=> enlever le paramètre)
	about: "lorem ipsum...",
	publisher: "publisher",
	link: "www.lorem.com"
}


var dataRevue = [

	{
		name : "Alliage " ,
		keywords :[ "Fine Arts", "Literature", "Filmmaking", "Science and Technology Studies"],
		time: [1989, 2019],
		locationCoords: [7.266079999999988,43.7031,],
	},

	{
		name : "Archée " ,
		keywords :[ "New Media and Technological", "Aesthetics", "Science and Technology Studies"],
		time: [1997, 2019],
		locationCoords: [-73.6103642,45.4972159,],

	},

	{
		name : "Architecture and Culture " ,
		keywords :[ "Architecture", "Literature", "Filmmaking", "Art History", "Anthropology", "Geography", "Social Sciences & Humanities"],
		time: [2013, 2019],
		locationCoords: [-0.1276474,51.5073219],

	},

	{
		name : "ArteCienciaBrasil " ,
		keywords :[ "Visual (fine Arts)", "Performance", "Science"],
		time: [2015, 2019],
		locationCoords: [-46.6333824,-23.5506507],


	},

	{
		name : "ArtLaboratory Berlin " ,
		keywords :[ "Fine Arts", "Social Sciences & Humanities", "Art History", "Law", "Science", "Biology"],
		time: [2006, 2019],
		locationCoords: [13.3888599,52.5170365],


	},

	{
		name : "Art Nodes " ,
		keywords :[ "Fine Arts", "New Media and Technological", "Social Sciences & Humanities", "Science and Technology Studies"],
		time: [2002, 2019],
		locationCoords: [2.1774322,41.3828939],

	},

	{
		name : "Art & Perception " ,
		keywords :[ "Fine Arts", "Philosophy", "Computer Sciences", "Biology", "Cognitive Sciences"],
		time: [2013, 2019],
		locationCoords: [-3.9614184,55.367],



	},

	{
		name : "Arts & Health " ,
		keywords :[ "Fine Arts & Design", "Education", "social and behavioral", "Health", "Cognitive Sciences"],
		time: [2009, 2019],
		locationCoords: [-3.9614184,55.367],

	},

	{
		name : "Arts Education Policy Review " ,
		keywords :[ "Fine Arts", "Visual (fine arts)", "Sound (fine arts)", "Performance", "Education", "Political Sciences"],
		time: [1992, 2019],
		locationCoords: [-84.6824346,43.6211955],

	},

	{
		name : "Back Office " ,
		keywords :[ "Design", "Media Studies", "Digital Humanities", "Science and Technology Studies", "Computer Sciences"],
		locationCoords: [2.3514616,48.8566969],


	},

	{
		name : "Cahiers Arts & Sciences de l'Art" ,
		keywords :[ "Fine Arts", "Social Sciences & Humanities", "Aesthetics"],
		time: [2000, 2019],
		locationCoords: [2.3514616,48.8566969],//PAris


	},

	{
		name : "Cahiers virtuel " ,
		keywords :[ "Literature", "Aesthetics", "Science and Technology Studies"],
		time: [2008, 2019],
		locationCoords: [-73.6103642,45.4972159],//Montreal


	},

	{
		name : "Creativity Research Journal " ,
		keywords :[ "Fine Arts", "Education", "Aesthetics", "Philosophy", "Psychology", "social and behavioral", "Biology", "Cognitive Sciences", "Science"],
		time: [1988, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan

	},

	{
		name : "Computer Music Journal" ,
		keywords :[ "Sound (fine arts)", "Sound (design)", "New Media and Technological", "Engineering Mechanics and Electronics"],
		time: [1977, 2019],
		locationCoords: [-71.0582912,42.3602534],//Boston

	},


	{
		name : "Creative Disturbance" ,
		keywords :[ "Fine Arts", "Literature", "Philosophy", "Computer Sciences", "Engineering Mechanics and Electronics"],
		time: [2018, 2019],
		locationCoords: [-96.7968559,32.7762719],//Dallas

	},	


	{
		name : "Cybernetics & Human Knowing " ,
		keywords :[ "Fine Arts & Design", "Social Sciences & Humanities", "Political Sciences", "Library and information studies", "Education", "Languages",  "Business, Admin & Management", "Science", "Computer Sciences", "Health", "Cognitive Sciences", "Medicine"],
		time: [2013, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
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
	},

	{
		name : "Design and culture " ,
		keywords :[ "Design", "Anthropology", "Geography", "Business, Admin & Management", "Retailing, marketing, sales, public relations", "Science"],
		time: [2009, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan
	},

	{
		name : "Design for Health " ,
		keywords :[ "Design", "Education", "Psychology", "Health"],
		time: [2017, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan

	},

	{
		name : "Design for Arts in Education" ,
		keywords :[ "Fine Arts", "Visual (fine arts)", "Sound (fine arts)", "Performance", "Education", "Political Sciences"],
		time: [1977, 1992],
	},


	{
		name : "Design Issues " ,
		keywords :[ "Design", "Science and Technology Studies", "Business, Admin & Management", "Engineering, Mechanics and Electronics"],
		time: [2000, 2019],
		locationCoords: [-71.0582912,42.3602534],//Boston
	},


	{
		name : "Design Philosophy Papers " ,
		keywords :[ "Design", "Ethics", "Philosophy", "Anthropology"],
		time: [2003, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan


	},

	{
		name : "Design Science " ,
		keywords :[ "Architecture", "Design", "Science and Technology Studies", "social and behavioral", "Library and information studies", "Business, Admin & Management", "Cognitive Sciences", "Life Sciences", "Computer Sciences", "Engineering, Mechanics and Electronics", "Health"],
		time: [2015, 2019],
		locationCoords: [0.1235817,52.2034823],//Cambridge


	},

	{
		name : "Diafanís " ,
		keywords :[ "Fine Arts", "Languages", "Science"],
		time: [2017, 2019],
		locationCoords: [-99.1333416,19.4326009],//Mexico


	},

	{
		name : "Digicult/DigiMag Journal " ,
		keywords :[ "Fine Arts & Design", "Anthropology", "Science and Technology Studies"],
	},

	{
		name : "Digital Creativity " ,
		keywords :[ "Fine Arts & Design", "Sound (Fine Arts)", "Fashion", "Game Design", "Architecture", "Filmmaking", "Law", "Computer Sciences", "Urban planning"],
		

	},


	{
		name : "Digithum " ,
		keywords :[ "Fine Arts", "Social Sciences & Humanities", "Art History", "Media Studies", "Sociology"],
		time: [1999, 2019],
		locationCoords: [2.1774322,41.3828939],//Barcelona

	},

	{
		name : "Early Popular Visual Culture " ,
		keywords :[ "Filmmaking", "Craft", "Visual (fine arts)", "Performance", "Education", "Sociology", "Economics", "Science"],
		time: [2005, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan

	},

	{
		name : "Ergonomics " ,
		keywords :[ "Design", "Psychology", "Business, Admin & Management", "Engineering, Manufacturing and Construction", "Ergonomics", "Biology", "Cognitive Sciences"],
		time: [1957, 2019],
		locationCoords: [-84.6824346,43.6211955],//Michigan

	},

	{
		name : "E-squared Magazine " ,
		keywords :[ "Fine Arts", "Science", "Biology", "Engineering, Manufacturing and Construction"],
		time: [2016, 2019],
		locationCoords: [-102.868,46.5392],//New england

	},


	{
		name : "Grey Room " ,
		keywords :[ "Fine Arts", "Architecture", "Art History", "Media Studies", "Political Sciences"],
		time: [2000, 2019],
		locationCoords: [0.1235817,52.2034823],//Cambridge

	},


	{
		name : "Harvard design magazine " ,
		keywords :[ "Fine Arts & Design", "Architecture", "Literature", "Science", "Urban planning"],
		time: [1997, 2019],
		locationCoords: [0.1235817,52.2034823],//Cambridge

	},


	{
		name : "Hybrid: Revue des arts et mediations humaines " ,
		keywords :[ "Fine Arts", "Literature", "Digital humanities"],
		time: [2014, 2019],
		locationCoords: [2.3514616,48.8566969],//PAris

	},

	{
		name : "Intelligent Tutoring Media" ,
		keywords :[ "Fine Arts & Design", "Sound (fine arts)", "Fashion", "Game Design", "Filmmaking", "Architecture", "Law", "Computer Sciences", "Urban planning"],
		time: [2014, 2019],

	},


	{
		name : "Interdisciplinary Science Reviews " ,
		keywords :[ "Fine Arts", "Social Sciences & Humanities", "Philosophy", "Mathematics and statistics", "Computer Sciences", "Engineering, Manufacturing and Construction", "Medicine"],
		time: [1976, 2019],

	},


	{
		name : "Interiors Design/Architecture/Culture " ,
		keywords :[ "Architecture", "Design", "Art History", "History", "Anthropology"],
	},

	{
		name : "International Journal of Education through Art " ,
		keywords :[ "Fine Arts & Design", "Craft", "Languages", "Education", "Sociology", "Art History"],
	},


	{
		name : "International Journal of Robots ,Education and Art ",
		keywords :[ "Fine Arts & Design", "Education", "Political Sciences", "Anthropology", "Science and Technology Studies"],
		time: [2010, 2019],
	},


	{
		name : "International Journal of Arts and Technology " ,
		keywords :[ "Fine Arts & Design", "Social Sciences & Humanities", "Aesthetics", "Life Sciences", "Biology", "Cognitive Sciences",  "Computer Sciences", "Engineering, Mechanics and Electronics"],
	},


	{
		name : "International Journal of Design " ,
		keywords :[ "Game Design", "Architecture", "Design", "Engineering, Manufacturing and Construction"],
	},

	{
		name : "The International Journal of Design Creativity and Innovation " ,
		keywords :[ "Fine Arts & Design", "Architecture", "Social Sciences & Humanities", "Linguistic, translation, comparative literature", "Philosophy", "Psychology", "Library and information studies", "Cognitive Sciences", "Computer Sciences", "Engineering, Manufacturing and Construction"],
	},

	// Idem que 2 keywords
	// {
	// 	name : "International Journal of Digital Arts and Design Association (adada) " ,
	// 	keywords :[ "Fine Arts & Design", "Media Studies"],
	// },


	{
		name : "International Journal of Fashion Design ,Technology and Education ",
		keywords :[ "Fashion", "Education", "Manufacturing and processing"],
	},



	{
		name : "The Journal of Aesthetics and Art Criticism " ,
		keywords :[ "Sound (fine arts)", "Fine Arts", "Literature", "Art History", "Aesthetics", "Philosophy", "Psychology", "Law"],
	},


	{
		name : "Journal of Arts Management, Law and Society",
		keywords :[ "Fine Arts & Design", "History", "Aesthetics", "Philosophy", "Economics", "Political Sciences", "Sociology", "Business Admin & Management", "Law"],
	},



	{
		name : "Journal of Design and Science " ,
		keywords :[ "Design" , "Social Sciences & Humanities", "Science"],
		time: [2016, 2019],
	},

	{
		name : "The journal of Information visualization " ,
		keywords :[ "Design", "Media Studies", "Cognitive Sciences", "Computer Sciences"],
		time: [2016, 2019],	
	},


	{
		name : "The Journal of Science and Technology of the Arts (CITARJ)" ,
		keywords :[ "Fine Arts", "Computer Sciences", "Engineering, Mechanics and Electronics"],
		time: [2009, 2019],

	},


	{
		name : "The Journal of the Society for Arts and Science " ,
		keywords :[ "Fine Arts", "Library and information studies", "Science"],
	},

	{
		name : "Journal of Visual Art Practice " ,
		keywords :[ "Visual (fine arts)", "Fine Arts", "Art History", "Economics", "Political Sciences", "Sociology", "Anthropology", "Philosophy", "Aesthetics", "Digital Humanities"],
	},


	{
		name : "Journal on Computing and Cultural Heritage" ,
		keywords :[ "Sound(fine arts)", "Craft", "Performance", "Digital Humanities", "History", "Art History", "Archeology", "Computer Sciences"],
	},

	{
		name : "Laboratory for Aesthetics and Ecology " ,
		keywords :[ "Fine Arts","Curatorial Studies", "Literature", "Philosophy", "Aesthetics", "Art History", "Science"],
	},

	{
		name : "Leonardo " ,
		keywords :[ "Fine Arts & Design", "Social Sciences & Humanities" , "Science"],
		time: [1968, 2019],
	},

	{
		name : "Marronage " ,
		keywords :[ "Visual (fine arts)", "Literature", "History", "Art History", "Aesthetics", "Political Sciences"],
	},


	{
		name : "Media-N " ,
		keywords :[ "New Media and Technological" , "Art History" , "Media Studies"],
		time: [2005, 2019],
	},

	{
		name : "Nautilus " ,
		keywords :[ "Fine Arts", "Literature", "Education", "Languages", "Archeology", "Philosophy", "Economics", "Anthropology", "Sociology", "Psychology", "Life Sciences", "Physical Sciences", "Mathematics and statistics", "Computer Sciences", "Health"],
		time: [2013, 2019],
	},

	{
		name : "Neural " ,
		keywords :[ "Sound (fine arts)" , "New Media and Technological" , "Sound (design)" , "Media Studies" , "Computer Sciences"],
		time: [1993, 2019],
	},


	{
		name : "Nexus Network Journal " ,
		keywords :[ "Architecture" , "Mathematics and statistics" , "Urban planning"],
	},

	{
		name : "Pamlipsets " ,
		keywords :[ "Fine Arts" , "Sound (fine arts)", "Literature", "Philosophy" , "Aesthetics" , "Political Sciences" , "Geography"],
	},

	{
		name : "Plastik Arts & Sciences " ,
		keywords :[ "Fine Arts" , "Aesthetics" , "Science"],
	},

	{
		name : "Polymath " ,
		keywords :[ "Fine Arts", "Visual (fine arts)", "Sound (fine arts)", "Performance ", "Literature", "Social Sciences & Humanities", "Philosophy", "Languages", "History", "Political Sciences", "Sociology", "Psychology", "Biology", "Science", "Physics", "Chemistry", "Mathematics and statistics"],
	},


	{
		name : "Public Art Dialogue " ,
		keywords :[ "Fine Arts", "Architecture", "Art History", "Urban planning"],
	},


	{
		name : "SoundEffects " ,
		keywords :[ "Sound (design)", "Architecture", "Linguistic, translation, comparative literature", "Aesthetics", "Media Studies", "Sociology", "Psychology", "Health"],
	},


	{
		name : "SciArt magazine " ,
		keywords :[ "Fine Arts", "Art History", "Science"],
	},

	{
		name : "Spatial Cognition and Computation " ,
		keywords :[ "Architecture", "Philosophy", "Psychology", "Geology", "Mathematics and statistics", "Computer Sciences", "Urban planning", "Cognitive Sciences"],
	},


	{
		name : "Symploke " ,
		keywords :[ "Literature" , "History" , "Philosophy"],
	},

	{
		name : "Technoetic Arts: A Journal of Speculative Research " ,
		keywords :[ "Fine Arts & Design", "New Media and Technological", "Aesthetics", "Philosophy", "Science and Technology Studies", "Cognitive Sciences", "Life Sciences"],
		time: [2003, 2019],

	},


	{
		name : "Virtual Creativity" ,
		keywords :[ "Fine Arts & Design", "Game Design" , "Architecture", "Education" , "Art History" , "Media Studies" , "Science and Technology Studies" , "Health"],
	},


	{
		name : "Works That Work " ,
		keywords :[ "Design" , "Social Sciences & Humanities", "Science and Technology Studies"],
		time: [2013, 2019],
	}
]


/* TO TEST with smaller datas
var dataRevue = [

	{
		name : "Alliage " ,
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
