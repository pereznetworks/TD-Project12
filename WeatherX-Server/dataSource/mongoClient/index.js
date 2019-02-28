/* mongoClient.js,
   a simple custom Mongoose connection manager
   I started writing for project 11  */

/* usage:

   // first in your node.js/Express app or index.js....

   const connect = require('./src/utils').connect;
   const onErr = require('./src/utils').onErr;
   const onceConnected = require('./src/utils').onceConnected;

   // give the conneciton a name ...
      // with no args...
         // defaults:
             port: 27017
             database dbName: 'course-api'
             configOptions = {
                 useNewUrlParser: true,
                 useCreateIndex: true,
                 autoIndex: true
               };

          const myMongooseConnectionName = .connect();

    // you can change the port and name of the db and even configOptions...
      // pass port as an interger
        // pass the dbName as a string
          // even pass custom config options as an object

            const configOptions = ;

          const myMongooseConnectionName = startdb(27017, 'myDatabaseName',
               {useNewUrlParser: true, useCreateIndex: true, autoIndex: true});

    // then ... onErr and onceConnected...

        // if error in connection...
        db.on("error", function(err){
        	onErr(err);
        });

        // if connected and all is good...
        db.once("open", function(){
        	onceConnected();
        });

    */

const connect = function(port, dbName, configOptions){

    // importing mongoose
    const mongoose = require("mongoose");

    // adding some configurability options
    if (!port ){
       port = 27017;
    }

    if (!dbName){
      dbName = 'forecastDb';
    }

    if (!configOptions){
      configOptions = {
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: true
      };
    }

    // connecting to mongod db
    /*  DeprecationWarning: current URL string parser is deprecated,
        and will be removed in a future version.
        To use the new parser, pass option { useNewUrlParser: true }
        to MongoClient.connect.
    */

    mongoose.connect(
      `mongodb://localhost:${port}/${dbName}`, configOptions);

    // return the mongoose connection
    return mongoose.connection;

};

//place with in callback functon, db.on('error',function(err){ startMongo.onErr(err)} )
const onErr = function(err){
  // may change how error are logged
	console.error(`**Mongod status**\nconnection error:`, err);
};

// place within callback function db.once('open', function(){ startMongo.onceConnected()} )
const onceConnected = function(){
  // may change how message are logged
	console.log(`**Mongod status**\ndb connection successful\n`);
};


module.exports.connect = connect;
module.exports.onErr = onErr;
module.exports.onceConnected = onceConnected;
