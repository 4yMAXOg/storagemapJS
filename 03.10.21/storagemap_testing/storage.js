const SHELFCOLOR = ["#99ff59", "#ffffff"];

window.onload = init;

function init() {
	if(detectMob()) {
		window.location.href = "mobile.php";
		Location.reload();
	}
	else {
		// Asks for marker
		markersub = window.prompt("Товар для поиска").toLowerCase();
		if(markersub == "") {
		    markersub = "(п)";
		}
	}
	
    mainInit();
	
	ctx.scale(ZOOMW, ZOOMH);
}

  function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}
