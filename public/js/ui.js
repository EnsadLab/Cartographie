// script that contains all necessary javascript code for all gui elements
// navigation bar, magazine menu on the right, detailed magazine view and etc..

d3.select("#testbutton1").on("click", applyTest1 )
d3.select("#testbutton2").on("click", applyTest2 )
d3.select("#testbutton3").on("click", applyTest3 )


// Search input
var options = {
    valueNames: [ 'revue-title' ]
};

var hackerList = new List('menu', options);