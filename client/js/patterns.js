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
    CARD: "<article id='{0}'><header><h2>{1}</h2><span class='lock'>&nbsp;</span><div class='closeButton'></div></header>"+
        "\n\t<section class='details'><img src='{2}' />\n\t<p>{3}</p></section>"+
        "\n\t<footer>"+
        "\n\t\t<p class='comments'>{4}</p>"+
        "\n\t\t<ul class='position'>{5}</ul>"+
        "\n\t\t</footer>\n</article>",
    /**
     * 0 → caption;
     * 1 → dimX ;
     * 2 → dimY ;
     * 3 → nbCatX ;
     * 4 → nbCatY ;
     * 5 → CatX[0].id ;
     * 6 → CatX[0].explanation ;
     * 7 → CatX[0].caption ;
     * 8 → Concat THC ;
     * 9 → Concat TD ;
     */
    THEAD: "<thead>"+
           "\n\t<caption>{0}</caption>" +
           "\n\t<tr><td colspan='2' rowspan='2'></td><th colspan='{3}'>{1}</th></tr>" +
           "\n\t<tr>{8}</tr>" +
           "\n</thead>" +
           "\n\t<tr id='{5}'><th rowspan='{4}'>{2}</th><th scope='row' title='{6}'>{7}</th>{9}</tr>",
    THC: "<th scope='col' title='{0}'>{1}</th>",
    TR: "<tr id='{2}'><th scope='row' title='{0}'>{1}</th>{3}</tr>",
    TD : "<td data-cat='{0}'></td>"

};