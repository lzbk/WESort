/**
 * ClasCol
 * User: loizbek
 * Date: 18/09/13 (10:32)
 * Content: The list of element structures used in the system
 * TODO: Ideally the patterns should be self contained associating the proper variables to the pattern
 * for the time being this is handled manually
 */

Patterns = {
    COMMENTITEM: "{0}: {1} <span class='date'>{2}</span>",
    POSITIONITEM: "<li><span class='date'>{2}</span> {0} ({1})</li>\n",
    CARD: "<article id='{0}'><header><h2>{1}</h2><span>&nbsp;</span></header>"+
        "\n\t<section class='details'><img src='{2}' />\n\t<p>{3}</p></section>"+
        "\n\t<footer>"+
        "\n\t\t<p class='comments'>{4}</p>"+
        "\n\t\t<ul class='position'>{5}</ul>"+
        "\n\t\t</footer>\n</article>"

};