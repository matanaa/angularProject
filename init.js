// Adds settings data - collectionName = customers
//run mongo.exe:
//	load("init.js")
db = db.getSiblingDB('shop')

db.settings.remove({});

db.settings.insert({'nextSeqNumber': 3, 'collectionName': "Users"});
db.settings.insert({'nextSeqNumber': 2, 'collectionName': "Products"});
//db.settings.insert({'nextSeqNumber': 2, 'collectionName': "Users"});
db.users.remove({});
db.users.insert({"_id" : ObjectId("5b60d54ecb10fd0fa449eb29"),"orders" : [],"firstName" : "admin","lastName" : "admin","email" : "Admin@admin.com","address" : "admin","city" : "dami","gender" : "Male","id" : 1,"password" : "admin","creditCard" : "admin","isAdmin" : true,"__v" : 0});

db.products.remove({});
