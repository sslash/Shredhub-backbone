// Create shreds
db.shredders.remove({});
db.shreds.remove({});
db.battles.remove({});
db.battleRequests.remove({});

var countries = [ "Norway", "Sweden", "Denmark", "Australia", "USA", "England",
		"Finland", "Germany", "Argentina", "Spain" ];

var g = [ "Gibson les paul", "Fender stratocaster", "Fender telecaster",
		"Music man luke", "Ibanez REM", "Ibanez RG", "Gibson sg",
		"Gibson explorer", "Peavey wolfgang", "Gibson flying v" ];

var eq = [ "Marshall", "Fender", "ENGL", "Mesa", "Orange", "Peavey", "Morgan",
		"Randall", "Line 6", "Vox" ];

var img = [ "EddieVanHalen.jpg", "RobertoDeMicheli.jpg", "michael.jpg",
		"MikeSpike.jpg", "SteveLukather.jpg", "michaelH.jpg", "Hslash.jpg",
		"SteveLukatherH.jpg", "patty ho.jpg", "JohnPetrucci.jpg",
		"SteveMorse.jpg", "richie.jpg", "JohnPetrucciH.jpg", "SteveVai.jpg",
		"richieH.jpg", "Thor.jpg", "slash.jpg", "MartSpart.jpg", "weegs.JPG",
		"MikeSpike.jpg", "YngwieMalmsteen.jpg", "Roberto.jpg" ];

// create 1000 shredders
for ( var i = 1; i <= 1000; i++) {

	var r = Math.floor(Math.random() * 10);
	var r2 = Math.floor(Math.random() * 10);
	var r3 = Math.floor(Math.random() * 10);
	var r4 = Math.floor(Math.random() * 22);
	var r5 = Math.floor(Math.random() * 100);

	var sh = {
		username : "Shredder" + i,
		fanees : new Array(),
		birthdate : new Date(),
		country : countries[r],
		profileImagePath : img[r4],
		email : "shredder" + i + "@slash.com",
		password : "1234",
		guitars : [ g[r2] ],
		equiptment : [ eq[r3] ],
		description : "Simple test shredder #" + i,
		timeCreated : new Date(),
		shredderLevel : r5
	};

	db.shredder.save(sh);
}

var sh = {
	username : "Slash",
	fanees : new Array(),
	birthdate : new Date(),
	country : "USA",
	profileImagePath : "slash.jpg",
	email : "shredder" + i + "@slash.com",
	password : "1234",
	guitars : [ "Gibson les paul" ],
	equiptment : [ "Marshall" ],
	description : "Shreds like a beast",
	timeCreated : new Date(),
	shredderLevel : 0,
};

db.shredder.save(sh);

var shredders = db.shredder.find({});
var count = db.shredder.count();

var shr = [ "23shred1.mp4", "battle-23-8-5.mp4", "fgdf.mp4", "23shred2.mp4",
		"battle-26-14-1.mp4", "g.mp4", "24shred5.mp4", "battle-27-10-1.mp4",
		"h.mp4", "9shred3.mp4", "battle-29-2-1.mp4", "legato.mp4",
		"9shred7.mp4", "battle-29-2-2.mp4", "livinprayer.mp4",
		"battle-17-6-2.mp4", "battle-29-6-1.mp4", "lovaabadname.mp4",
		"battle-17-7-2.mp4", "battle-29-6-2.mp4", "s.mp4",
		"battle-23-12-1.mp4", "battle-33-8-1.mp4", "sap sapsap2.mp4",
		"battle-23-12-2.mp4", "c.mp4", "sfhd.mp4", "battle-23-12-4.mp4",
		"crap.mp4", "sfsdf.mp4", "battle-23-12-5.mp4", "dfh.mp4", "sleep.mp4",
		"battle-23-12-6.mp4", "dminor.mp4", "vid.mp4", "battle-23-8-1.mp4",
		"edf.mp4", "ynsrv.mp4", "battle-23-8-3.mp4", "f.mp4" ];
var tagsArr = [ "Lick", "Fast", "Technique", "Sweeping", "Tapping", "Cover",
		"Solo", "Instruction", "Sound test", "Mind blowing", "Passionate",
		"British", "Punk", "Grip", "Chords", "Melody", "Scale", "Show-off",
		"Jazz", "Fusion", "Rock", "Metal", "Pop", "Rap", "Funk", "Acoustic",
		"Chops", "Jam", "Improvisation" ];
// Create 10 000 shreds 
for ( var i = 1; i <= 10000; i++) {

	var ran = Math.floor(Math.random() * count);
	var ranS = Math.floor(Math.random() * count);
	var ran2 = Math.floor(Math.random() * 41);
	var tagsRan = Math.floor(Math.random() * tagsArr.length);
	var tagsRan2 = Math.floor(Math.random() * tagsArr.length);
	var ranrate = Math.floor(Math.random() * 1000);
	var ranrate2 = Math.floor(Math.random() * 10000);

	var img = shr[ran2].split(".")[0].concat(".jpg");

	db.shred.save({
		description : "Simple test shred #" + i,
		owner : {
			$ref : "shredder",
			$id : shredders[ran]._id
		}, // nice cause java can convert eagerly with dbrefs
		timeCreated : new Date(),
		shredType : "normal",
		shredComments : [ 
		{
			timeCreated : new Date(),
			text : "Lorem ipsum lol cat mode" + i,
			commenterId : shredders[ranS.id],
			commenterName : shredders[ranS.username]
		}, {
			timeCreated : new Date(),
			text : "Saps ipsumalis lol cat mode" + i+1,
			commenterId : shredders[ranS.id],
			commenterName : shredders[ranS.username]		
		} ],
		shredRating : {
			numberOfRaters : ranrate,
			currentRating : ranrate2
		},
		videoPath : shr[ran2],
		videoThumbnail : img,
		tags : [ tagsArr[tagsRan], tagsArr[tagsRan2] ]
	});
}

db.shred.save({
	description : "Super duper shred",
	owner : {
		$ref : "shredder",
		$id : shredders[0]._id
	},
	timeCreated : new Date(),
	shredType : "normal",
	shredComments : new Array(),
	shredRating : {
		numberOfRaters : 0,
		currentRating : 0
	},
	videoPath : shr[1],
	videoThumbnail : img,
	tags : [ tagsArr[0], tagsArr[1] ]
});

// Get shredders
var shredders = db.shredder.find({});
var size = db.shredder.count();

// Create battles
for ( var i = 1; i <= 100000; i++) {
	var ran1 = Math.floor(Math.random() * size);
	var ran2 = Math.floor(Math.random() * size);
	var ran3 = Math.floor(Math.random() * 41);

	var battleRound = {

		battlersShred : {
			rating : {
				currentRating : 0,
				numberOfRaters : 0
			},
			timeCreated : new Date(),
			videoPath : shr[ran3],
			videoThumbnail : "battle_50a508930364e84086ef7b7c_battle2.jpg"

		},
		battleesShred : null
	};

	db.battle.save({
		battler : {
			$ref : "shredder",
			$id : shredders[ran1]._id
		},
		battlee : {
			$ref : "shredder",
			$id : shredders[ran2]._id
		},
		timeCreated : new Date(),
		battleStyle : "Bet you can't shred this",
		round : 1,
		lastBattleShred : new Date(),
		battleRounds : [ battleRound ]
	});
}

// QUERYING 

// remove shreds by slash
db.shreds.remove({
	"owner" : DBRef("shredder", ObjectId("509fe13df4806a301d2f7527"))
});

// Create fanees

var shredders = db.shredder.find();
var size = db.shredder.count();

for ( var i = 0; i < size; i++) {
	var shredder = shredders[i];

	// Max 10 fanees
	var faneeNum = Math.floor(Math.random() * 10);

	for ( var y = 0; y < faneeNum; y++) {
		var fanee = Math.floor(Math.random() * size);

		shredder.fanees.push(shredders[fanee]._id.str);
	}

	db.shredder.save(shredder);
}

// Find slashss fanees
db.shredders.find(
		{
			"_id" : {
				$in : [ ObjectId("50b21f88e14c513bfa72ffd6"),
						ObjectId("50b21f88e14c513bfa72fe81"),
						ObjectId("50b21f88e14c513bfa72ffb4"),
						ObjectId("50b21f88e14c513bfa730058"),
						ObjectId("50b21f88e14c513bfa72fe91"),
						ObjectId("50b21f88e14c513bfa72ff47") ]
			}
		}).pretty();

// shredders and shreds for testing
db.shredders.save({
	username : "Mike",
	_id : ObjectId("50b24c7f724ad1b88627d3df"),
	fanees : [ ObjectId("50b24a2d724ad1b88627d3dc"),
			ObjectId("50b24e72724ad1b88627d3e5") ],
	birthdate : new Date(),
	country : "USA",
	profileImagePath : "slash.jpg",
	email : "mike@slash.com",
	password : "1234",
	guitars : [ "Gibson les paul" ],
	equiptment : [ "Marshall" ],
	description : "Shreds like a beast",
	timeCreated : new Date(),
	shredderLevel : 0,
});

db.shredders.save({
	username : "Michael",
	_id : ObjectId("50b24a2d724ad1b88627d3dc"),
	fanees : new Array(),
	birthdate : new Date(),
	country : "USA",
	profileImagePath : "slash.jpg",
	email : "michael@slash.com",
	password : "1234",
	guitars : [ "Gibson les paul" ],
	equiptment : [ "Marshall" ],
	description : "Shreds like a beast",
	timeCreated : new Date(),
	shredderLevel : 0,
});

db.shredders.save({
	_id : ObjectId("50b24e72724ad1b88627d3e5"),
	username : "Steve",
	fanees : new Array(),
	birthdate : new Date(),
	country : "USA",
	profileImagePath : "slash.jpg",
	email : "steve@slash.com",
	password : "1234",
	guitars : [ "Gibson les paul" ],
	equiptment : [ "Marshall" ],
	description : "Shreds like a beast",
	timeCreated : new Date(),
	shredderLevel : 0,
});

db.shredders.save({
	_id : ObjectId("50b24a2e724ad1b88627d3dd"),
	username : "Thor",
	fanees : [ ObjectId("50b24c7f724ad1b88627d3df") ],
	birthdate : new Date(),
	country : "USA",
	profileImagePath : "slash.jpg",
	email : "thor@slash.com",
	password : "1234",
	guitars : [ "Gibson les paul" ],
	equiptment : [ "Marshall" ],
	description : "Shreds like a beast",
	timeCreated : new Date(),
	shredderLevel : 0,
});

//thor -> mike -> michael
var thor = db.shredders.find({
	username : "Thor"
});
var mike = db.shredders.find({
	username : "Mike"
});
var michael = db.shredders.find({
	username : "Michael"
});

db.shreds.save({
	description : "Mike shred",
	owner : {
		$ref : "shredders",
		$id : ObjectId("50b24c7f724ad1b88627d3df")
	},
	timeCreated : new Date(),
	shredType : "normal",
	shredComments : new Array(),
	shredRating : {
		numberOfRaters : 0,
		currentRating : 0
	},
	videoPath : "",
	videoThumbnail : "",
	tags : [ "lol" ]
});

db.shreds.save({
	description : "Thor shred",
	owner : {
		$ref : "shredders",
		$id : ObjectId("50b24a2e724ad1b88627d3dd")
	},
	timeCreated : new Date(),
	shredType : "normal",
	shredComments : new Array(),
	shredRating : {
		numberOfRaters : 0,
		currentRating : 0
	},
	videoPath : "",
	videoThumbnail : "",
	tags : [ "lol" ]
});

db.shreds.save({
	description : "Michael shred",
	owner : {
		$ref : "shredders",
		$id : ObjectId("50b24a2d724ad1b88627d3dc")
	},
	timeCreated : new Date(),
	shredType : "normal",
	shredComments : new Array(),
	shredRating : {
		numberOfRaters : 0,
		currentRating : 0
	},
	videoPath : "",
	videoThumbnail : "",
	tags : [ "lol" ]
});

db.shreds.save({
	description : "Michael shred 2",
	owner : {
		$ref : "shredders",
		$id : ObjectId("50b24a2d724ad1b88627d3dc")
	},
	timeCreated : new Date(),
	shredType : "normal",
	shredComments : new Array(),
	shredRating : {
		numberOfRaters : 0,
		currentRating : 0
	},
	videoPath : "",
	videoThumbnail : "",
	tags : [ "lol" ]
});
db.shreds.save({
	description : "Michael shred 3",
	owner : {
		$ref : "shredders",
		$id : ObjectId("50b24a2d724ad1b88627d3dc")
	},
	timeCreated : new Date(),
	shredType : "normal",
	shredComments : new Array(),
	shredRating : {
		numberOfRaters : 0,
		currentRating : 0
	},
	videoPath : "",
	videoThumbnail : "",
	tags : [ "lol" ]
});

db.shreds.save({
	description : "Steves shred",
	owner : {
		$ref : "shredders",
		$id : ObjectId("50b24e72724ad1b88627d3e5")
	},
	timeCreated : new Date(),
	shredType : "normal",
	shredComments : new Array(),
	shredRating : {
		numberOfRaters : 0,
		currentRating : 0
	},
	videoPath : "",
	videoThumbnail : "",
	tags : [ "lol" ]
});

db.shreds.save({
	description : "Steves shred 2",
	owner : {
		$ref : "shredders",
		$id : ObjectId("50b24e72724ad1b88627d3e5")
	},
	timeCreated : new Date(),
	shredType : "normal",
	shredComments : new Array(),
	shredRating : {
		numberOfRaters : 0,
		currentRating : 0
	},
	videoPath : "",
	videoThumbnail : "",
	tags : [ "lol" ]
});
