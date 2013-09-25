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
    CARD: "<article id='{0}'><div class='illustration' style='background-image:url({2});' >&nbsp;</div>"+
        "\n\t<header><h2>{1}</h2><span class='lock'>&nbsp;</span><div class='closeButton'></div></header>"+
        "\n\t<section class='details'>\n\t<p>{3}</p></section>"+
        "\n\t<footer>"+
        "\n\t\t<div class='comments'>{4}</div>"+
        "\n\t\t<ul class='position'>{5}</ul>"+
        "\n\t\t</footer>\n</article>",
    HELP:"<header><h2>Aide</h2><div class='closeButton'></div></header>\n"+
         "<section class='details'>{0}</section>",
    COMMENTING://'<form accept-charset="utf-8">' +
            "\n\t<input id='commentInput' type='text' value="+'"{0}">',/*+
            "</form>",
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
    tableP:
       {THEAD: "<thead>"+
          "\n\t<tr><td colspan='2' rowspan='2'></td><th colspan='{2}' title='{9}'>{0}</th></tr>" +
          "\n\t<tr>{7}</tr>" +
          "\n</thead>" +
          "\n\t<tr id='{4}'><th class='vertical' rowspan='{3}' title='{10}'><div>{1}</div></th><th scope='row' title='{5}'>{6}</th>{8}</tr>",
        THC: "<th scope='col' title='{0}'>{1}</th>",
        TR: "<tr id='{2}'><th scope='row' title='{0}'>{1}</th>{3}</tr>",
        TD : "<td data-cat='{0}'></td>",
        setSizes: function(nbCatX, nbCatY){
            /*should try to find a minimum height #security*/
            var tableWidth = parseInt($("table").css("width")), tableHeight = parseInt($("table").css("height"));
            var headX = 50 / (2*nbCatX + 1.5), headY = 100 / (2*nbCatY+2) ;
            var Xpercent = 2*headX, Ypercent = 2*headY;

            if( (headY/100 * tableHeight) > 20){
                headY = (20/tableHeight)*100;
                Ypercent = (100-2*headY)/nbCatY;
            }
            if( (headX/100 * tableWidth) > 45){
                headX = (45/tableWidth) * 100;
                Xpercent = (100-headX)/(2*nbCatX + 1);
            }
            $('tbody tr').css("height", Ypercent+'%');
            $('thead tr').css("height", headY+'%');
            $('th').css("width", Xpercent+'%');
            $('td[data-cat]').css('width', Xpercent*2+'%');
            $('.vertical').css('width', headX+'%').css('height', $('table').css('height') - $('thead').css('height'));
        }
       }

};