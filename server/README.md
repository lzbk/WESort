WESort
============

Server side for the WESort project. See WESort README for more info

INSTALL :
* install mongo db
* log into mongo
    ** create db (use YOURNEWDB)
    ** create user and password for db (http://docs.mongodb.org/manual/tutorial/enable-authentication/) :
        *** for running mongo without auth, you can replace line auth=true by noauth = true in /etc/mongodb and then restart the server using "sudo service mongodb restart".
        *** create db (use YOURNEWDB)
        *** create user db.addUser({user:"<username>", pwd:"<password>", roles:["readWrite", "dbAdmin"]})
        *** switch back to authentified mode (editing back the /etc/mongodb file and restarting the service).
    ** test it by typing :
        *** use YOURDB
        *** db.auth("YOURLOGIN", "YOURPASSWORD")
    ** create the players collection by making a unique index on the email :
        *** db.players.ensureIndex({email:1}, {unique:true, dropDups: true })
* now you can install the node server :
    ** copy server where you want it
    ** in a terminal go to the root of the server directory
    ** type "npm install -d" to install the dependencies
* configuration :
    ** open file config.json and edit the appropriate field to configure websocket port and mongodb access (only db system handled so far).
    ** if you need authentication you can add the appropriate event handlers using uglyAuth.socket.io-server.js package (a client side library also is required). The header of the file explains how to use it.
