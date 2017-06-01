var mongodb = require("mongodb");

var client = mongodb.MongoClient;

client.connect("mongodb://127.0.0.1:27017/limenghua", function(err, db){
	var collection = db.collection("class");
	collection.find({}).toArray(function(err, result){
		console.log(result);
		db.close();
	})
})