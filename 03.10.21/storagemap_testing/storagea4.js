const SHELFCOLOR = ["#adadad", "#ffffff"];

window.onload = init;

function init() {
	// Asks for marker
	markersub = window.prompt("Товар для поиска").toLowerCase();
	
    mainInit();
	
	let zoomw = canvas.width * 0.00195;
	let zoomh = canvas.height * 0.00295;
	ctx.scale(zoomw, zoomh);
}
