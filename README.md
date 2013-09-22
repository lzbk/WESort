ClasCol
============

Collaborative sorting of cards in a table. Runs with node.js and a couple provided libs.

The instantiation of a sorting is provided by a json file and a set of images.

Coding conventions and tags
------------------------
Many functionnalities will not be developped in the first versions. When modifications are necessary for a given anticipated functionnality, a tag will be added in the code.
Existing tags are the following:
* #3d → The current version only works with 2 categories associated to each card (table representation, this tags indicates where to change stuff to expand the number of categories) ;
* #render → Improve rendering ;
* #msg → create constant file with all messages / translation.
* #security → test data types, entry values and such

Order in which the javascript files call each other
---------------------------------------------------
* home calls class / jquery and then main
* main calls ??
* card calls position


List of css classes used:
-------------------------
* selected : for cards to say whether they are selected
* [open=open] : for cards, chatboxes and such when they come to the foreground
* closeButton : for whatever comes in the foreground
* lock : for cards, where we will put the user's name

TODO
* Category
* table
* card.move()