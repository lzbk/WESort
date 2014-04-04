WESort v0.1
============

This app was designed and implemented at the LIRIS lab (http://liris.cnrs.fr) in the course of the Janus project, sponsored by the IMU Labex (http://imu.universite-lyon.fr/).

Collaborative sorting of cards in a table. Runs with node.js and a couple provided libs.

The instantiation of a sorting game is provided by a json file and a set of images.

Requirements
------------
To run, WESort requires :
* node.js
* socket.io
    * once socket.io is installed, you can fetch node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js to replace the one provided as you might have a more recent version of socket.io. Or if you install socket.io/node properly replacing the link to it with : <script src="/socket.io/socket.io.js"></script> might just work…

Installation
------------
See server readme file (and copy the other two files next to it)

Coding conventions and tags
------------------------
Many functionalities will not be developed in the first versions. When modifications are necessary for a given anticipated functionality, a tag will be added in the code.
Existing tags are the following:
* #3d → The current version only works with 2 categories associated to each card (table representation, this tags indicates where to change stuff to expand the number of categories) ;
* #render → Improve rendering ;
* #msg → create constant file with all messages / translation.
* #security → test data types, entry values and such
* #genericity → to improve functions in order to be closer to an API


Order in which the javascript files call each other (client side)
-----------------------------------------------------------------
* home calls utils, class, jquery libraries, the patterns (all/most strings used) and then main (which can use all those)
* main calls the game and instantiates it based on some content (see example folder for a sample)
* game, which contains the game Class calls pretty much everything:
    * table → for the table containing it all
    * card → for the cards and how to interact with them
        * position → how to store the card position
        * history  → to handle successive elements (generic, in cards it is the position history)
        * player   → not sure whether this could be avoided by calling it earlier in game or by preprocessing card positions but in order to load card history the Player class is required…
    * category → how to sort the cards
    * storage → so far this is used to link with browserquest (untested, maybe unimplemented) and to store the user data (just like a cookie)
    * player
    * team
    * uglyAuth.socket.io-client calls
        * uglyAuth → generic connection form builder
        * socket.io client side library
* lib/utils contains a portable device not compliant longClick event, a shuffle function, url/email check functions and a print method used with almost all the patterns in the app

Configuration files (client side)
---------------------------------
main calls the global config file and the game folder (here example)
* config.json → the config file contains the websocket configuration (see server) and the name of the uglyAuth config file (here uglyAuth.io-FR.json)
* uglyAuth.io-FR.json → the form builder configuration (global info, header, in which element to create which element, id, loading image, content of the login and register form (possible items are text, e-mail, password — with verification or not — and image to put on buttons), css class used and general text
* game folder contains
    * img folder with all images
    * game_data.json, game id, the dimensions and categories according to which the cards should be sorted, whether to shuffle the data to force players to use the name of the dimensions and categories in their exchanges instead of just numbers, the rest is pretty self-explanatory

Partial list of css classes used:
---------------------------------
* selected : for cards to say whether they are selected
* [open=open] : for cards, chatboxes and such when they come to the foreground
* closeButton : for whatever comes in the foreground
* lock : for cards, where we will put the user's name

Order in which the javascript files call each other (server side)
-----------------------------------------------------------------
* main calls configuration, class, dbHandler and uglyAuth.socket.io-server to create the server which will handle exchanges.
* dbHandler calls class and mongojs (it is build to handle various dbms, but mongo is the onlyone handled) handles all calls to db (nb an actions collection was included for raw traces but it has not been used)
* unglyAuth.socket.io-server → handles authentication, requires a db and a socket.io object to load the data linked to the user
* patterns.json → all the strings to display

Configuration files (server side)
---------------------------------
* config.json → db and websocket (see client) config
* package.json → to be able to use “npm -d”

List of messages
----------------
* server (main.js, except to client :
    * connection established → server granted access
    * disconnect             → a player disconnected (maybe will go both ways with logout button, see bugs and TODOs)
* both ways :
    * selectCard             → a player has selected a card
    * unselectCard           → a player has unselected a card
    * moveCard               → a player has moved a card to a new location
    * commentCard            → a player has commented a card
    * request validation     → a player has requested the validation of the table
    * cancel validation      → a player has canceled their validation request

Example of sequence to handle one action (attention les yeux)
-------------------------------------------------------------
* game.loadBoard creates the board and the cards
    * it uses the card's on* (onSendSelect/onSendUnselect/forSendingComment) methods to define what method will handle the events, this is where the socket.io emit method is defined
    * the same process is used to define the events on table cells
* card.setUpEvent will associate the said methods to the appropriate event
* when the event is triggered (for instance select a card), the method defined in game.js will be called and a message sent to the server, caught by the socket.io server instantiated in main.js
* depending on the message server/js/main.js will, when needed, interact with the database to perform the action, in such cases the message sent to the clients is provided to the db method as a callback function.
* after the action has been performed, all clients in the team (rooms separate the players team by team, cf. sockets.in(teamRoom).emit(message)) are made aware of the change via sending a message
* the game client (websocket instance in the game object) will receive the message and trigger the appropriate action in the appropriate object (for instance when a card is selected, the card is found in “game.cards[card_id]” — you see what I mean — and the appropriate action is triggered)

known bugs and TODOs
--------------------
* storage of the comments on cards (expand game.js/restoreState function and follow the same strategy, it's just the last comment so it's easier)
* encrypt password (use sha.js)
* chat (see many tutorials — e.g. http://tr.im/557ph — and adapt it to the present code)
* log-out button (disconnection is handled, but not possible to change user, cf. localstorage)
* css : does not work in chrome or old mobile devices
* events : long click does not work on mobile devices
