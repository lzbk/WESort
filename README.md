ClasCol
============

Collaborative sorting of cards in a table. Runs with node.js and a couple provided libs.

The instantiation of a sorting is provided by a json file and a set of images.

Requirements
------------
To run, clascol requires :
* node.js
* socket.io
    * once socket.io is installed, you can fetch node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js to replace the one provided as you might have a more recent version of socket.io. Or if you install socket.io/node properly replacing the link to it with : <script src="/socket.io/socket.io.js"></script> might just work…

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
* home calls utils, class, jquery libraries, the patterns and then main (which can use all those)
* main calls game and the uglyAuthentication-io package
* uglyAuth.socket.io-client calls uglyAuth and the socket.io client side library
* game calls table, card and category
* card calls position and history


List of css classes used:
-------------------------
* selected : for cards to say whether they are selected
* [open=open] : for cards, chatboxes and such when they come to the foreground
* closeButton : for whatever comes in the foreground
* lock : for cards, where we will put the user's name

List of messages exchanged:
---------------------------
* server to client :
    ** connection established: server granted access
    ** connection denied: server denied access

TODO
* storage
* authentication
* chat