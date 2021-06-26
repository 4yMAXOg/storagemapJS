const ZOOMW = 3.75 * window.innerWidth / 1920;
const ZOOMH = 3.1 * window.innerHeight / 1080;

// 60 fps
const REFRESH_RATE = 1000 / 60;

const STANDWIDTH = 80;

const STANDLINEWIDTH = 2.0; // 1.5
const SHELFLINEWIDTH = 0.3;

const TEXTALIGN = "justify";
const FONT = "5.5px Arial";
const FONTCOLOR = "#000000";

const FONTXOFFSET = 2;
const FONTYOFFSET = 6;
const FONTYNEXTLINE = 5;

const SEPARATOR = ', ';


var markersub;

var stands = [];
var globalTemplates = [];

var canvas;
var ctx;

function mainInit() {
	initData();
	initTemplates();
	initgfx();
}

function initData() {
	let products = JSON.parse(document.getElementById("products").innerHTML);
	
	// row 1
	stands.push(new Stand(10, 310, 50, STANDWIDTH, "up", products[stands.length]));
	stands.push(new Stand(10, 260, 40, STANDWIDTH, "up", products[stands.length]));
	stands.push(new Stand(10, 220, 40, STANDWIDTH, "up", products[stands.length]));
	stands.push(new Stand(10, 180, 40, STANDWIDTH, "up", products[stands.length]));
	stands.push(new Stand(10, 140, 40, STANDWIDTH, "up", products[stands.length]));
	
	// row 2
	stands.push(new Stand(10, 10, 120, STANDWIDTH, "right", products[stands.length]));
	stands.push(new Stand(130, 10, 120, STANDWIDTH, "right", products[stands.length]));
	stands.push(new Stand(250, 10, 120, STANDWIDTH, "right", products[stands.length]));
	stands.push(new Stand(370, 10, 120, STANDWIDTH, "right", products[stands.length]));
	
	// row 3
	stands.push(new Stand(505, 100, 40, STANDWIDTH, "down", products[stands.length]));
	stands.push(new Stand(505, 140, 40, STANDWIDTH, "down", products[stands.length]));
	stands.push(new Stand(505, 180, 40, STANDWIDTH, "down", products[stands.length]));
	stands.push(new Stand(505, 220, 40, STANDWIDTH, "down", products[stands.length]));
	
	// row 4
	stands.push(new Stand(505, 270, 40, STANDWIDTH, "down", products[stands.length]));
	
	// row 5
	stands.push(new Stand(90, 310, 110, STANDWIDTH / 3, "right", products[stands.length]));
	stands.push(new Stand(200, 310, 110, STANDWIDTH / 3, "right", products[stands.length]));
	stands.push(new Stand(310, 310, 90, STANDWIDTH / 3, "right", products[stands.length]));
	
	// row 6
	stands.push(new Stand(175, 100, 40, STANDWIDTH, "down", products[stands.length]));
	stands.push(new Stand(175, 140, 40, STANDWIDTH, "down", products[stands.length]));
	stands.push(new Stand(175, 180, 40, STANDWIDTH, "down", products[stands.length]));
	stands.push(new Stand(175, 220, 40, STANDWIDTH, "down", products[stands.length]));
	
	// row 7
	stands.push(new Stand(175, 140, 40, STANDWIDTH, "up", products[stands.length]));
	stands.push(new Stand(175, 180, 40, STANDWIDTH, "up", products[stands.length]));
	stands.push(new Stand(175, 220, 40, STANDWIDTH, "up", products[stands.length]));
	stands.push(new Stand(175, 260, 40, STANDWIDTH, "up", products[stands.length]));
	
	// row 8
	stands.push(new Stand(340, 100, 40, STANDWIDTH, "down", products[stands.length]));
	stands.push(new Stand(340, 140, 40, STANDWIDTH, "down", products[stands.length]));
	stands.push(new Stand(340, 180, 40, STANDWIDTH, "down", products[stands.length]));
	
	// row 9
	stands.push(new Stand(340, 140, 40, STANDWIDTH, "up", products[stands.length]));
	stands.push(new Stand(340, 180, 40, STANDWIDTH, "up", products[stands.length]));
	stands.push(new Stand(340, 220, 40, STANDWIDTH, "up", products[stands.length]));
}	

function initTemplates() {
	let templatesData = JSON.parse(document.getElementById("templates").innerHTML);

	for(let i = 0; i < templatesData.length; i++) {
		let td = templatesData[i];
        let template = new Template("", "");
        template.loadFromJSON(td);

		globalTemplates.push(template);
	}
}

function initgfx() {
	canvas = document.getElementById("canvas_id");
	ctx = canvas.getContext('2d');
	fix_dpi();
    
	setInterval(drawroutine, REFRESH_RATE);
}

function drawroutine() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Draw shelves
	for(let i = 0; i < stands.length; i++) {
		stands[i].draw();
	}
	
	// Draw computer icon
	drawImage(90, 308, 30, 30, -90, "pc");
	// Draw exit icon
	drawImage(64, 290, 25, 23, -90, "exit");

    // Draw tag numbers
    drawText(115, 255, 13, 13, "1");
    drawText(273, 215, 13, 13, "2");
    drawText(404, 215, 13, 13, "3");
    drawText(117, 33, 13, 13, "4");
    drawText(483, 34, 13, 13, "4");
	
	// Draw lift
	let liftX = 272;
	let liftY = 235;
	let liftW = 150;
	let liftH = 55;
	
	ctx.beginPath();
	ctx.rect(liftX, liftY, liftW, liftH);
	ctx.lineWidth = 1.8;
	ctx.strokeStyle = "#450c02"
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = "#782f22";
	ctx.fillRect(liftX, liftY, liftW, liftH);
	ctx.closePath();

	ctx.font = '30px sans-serif';
	ctx.fillStyle = 'black';
	ctx.fillText('Лифт', 310, 270);
}

function drawImage(x, y, w, h, rotation, imageId) {
	ctx.save();
	ctx.translate(x, y);
	let rotationConverted= Math.PI * 2 * rotation / 360;
	ctx.rotate(rotationConverted);
	
	let pcImage = document.getElementById(imageId);
	ctx.drawImage(pcImage, 0, 0, w, h);
	
	ctx.restore();

}

function drawText(x, y, w, h, drawString) {
	ctx.save();
	ctx.translate(x, y);
	
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    ctx.fillStyle = "black";
    ctx.font = h + "px sans-serif";
    ctx.fillText(drawString, w/5, 35*h/40);
	
	ctx.restore();

}

function fix_dpi() {
	//get DPI
	let dpi = window.devicePixelRatio;

	//get CSS height
	//the + prefix casts it to an integer
	//the slice method gets rid of "px"
	let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
	//get CSS width
	let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
	
	//scale the canvas
	canvas.setAttribute('height', style_height * dpi);
	canvas.setAttribute('width', style_width * dpi);
}

function fillMultiLineText(context, string, x, y, offset) {
	let strarray = string.split('\n');
	
	for(let i = 0; i < strarray.length; i++) {
		str = strarray[i];
		let stry = y + offset * i;
		context.fillText(str, x, stry);
	}
}

class Stand {
	constructor(x, y, l, w, orientation, shelvesData) {
		this.x = x;
		this.y = y;
		this.l = l;
		this.w = w;
		this.shelves = [];
		
		switch(orientation) {
			case "up":
				this.orientation = -Math.PI / 2;
				break;
			case "right":
				this.orientation = 0;
				break;
			case "down":
				this.orientation = Math.PI / 2;
				break;
			case "left":
				this.orientation = Math.PI;
				break;
		}
		
		let shelvesString = shelvesData[0];
		let shelvesTags = shelvesData[1];
		let shelvesTemplates = shelvesData[2];
		
		let shelves = shelvesString.split(SEPARATOR);
		let tags = shelvesTags.split(SEPARATOR);
		let templates = shelvesTemplates.split(SEPARATOR);
		
		let type;
		for(let i = 0; i < shelves.length; i++) {
			this.add_shelf(new Shelf(shelves[i], tags[i], templates[i], this));
		}
	}
	
	add_shelf(shelf) {
		this.shelves.push(shelf);
	}
	
	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.orientation);
		
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = STANDLINEWIDTH;
		
		ctx.beginPath();
		ctx.rect(0, 0, this.l, this.w);
		ctx.stroke();
		
		for(let i = 0; i < this.shelves.length; i++) {
			let shelf = this.shelves[i];
			let w = this.w / this.shelves.length;
			let y = i * w;
		
			// Find shelf type to find shelf's color
			let type = findShelfType(shelf, markersub);
		
			ctx.fillStyle = SHELFCOLOR[type];
			ctx.fillRect(0, y, this.l, w);
			ctx.lineWidth = SHELFLINEWIDTH;
			ctx.strokeRect(0, y, this.l, w);
			
			let text_x = 0 + FONTXOFFSET;
			let text_y = y + FONTYOFFSET;
			
			ctx.textAlign = TEXTALIGN;
			ctx.font = FONT;
			ctx.fillStyle = FONTCOLOR;
			
			fillMultiLineText(ctx, shelf.product, text_x, text_y, FONTYNEXTLINE);
		}
		
		ctx.restore();
	}
}

function findShelfType(shelf, markersub) {
	// Check for selected type
	if(typeof(selectedShelf) != "undefined"){
		if(selectedShelf == shelf) {
			return 2;
		}
	}

	// Check for markered type
	// Check product name
	if(shelf.product.toLowerCase().includes(markersub)) {
		return 0;
    }
	// Check product tags
 	if(shelf.tag.toLowerCase().includes(markersub)) {
		return 0;
    }
	// Check product templates
	let templateName;
	let templateTags;
	let templateNum;

	for(let i = 0; i < shelf.templates.length; i++) {
		templateNum = shelf.templates[i];
		templateTags = findTemplate(globalTemplates, templateNum).tags;

		if(templateTags.toLowerCase().includes(markersub)) {
			return 0
		}
	}

	// Normal shelf
	return 1;
}

function findTemplate(templates, id) {
    for(let i = 0; i < templates.length; i++) {

        if(templates[i].id == id) {
            return templates[i];
        }
    }

    console.log("Can't find template #" + id);
    return null;
}

class Shelf {	
	constructor(product, tag, templates, stand) {
		this.product = product;
		this.tag = tag;
        this.templates = templates.substring(1).split(" ").filter(item => item).map(item => parseInt(item));
		this.stand = stand;
	}
	changeShelf(shelf) {
		this.product = shelf.product;
		this.tag = shelf.tag;
		this.templates = shelf.templates;
	}
	copyShelf() {
        // Modify templates back to string to be convertable again
        // when creating new shelf
        let templatesString = "/" + this.templates.join(" ");

		let shelf = new Shelf(this.product, this.tag, templatesString, this.stand);
		return shelf;
	}
}

class Template {
	static currentId = 0;

	constructor(name, tags) {
		this.id = Template.currentId;
		Template.currentId++;
		
		this.name = name;
		this.tags = tags;
	}

    loadFromJSON(jsonObject) {
        this.id = jsonObject.id;
        this.name = jsonObject.name;
        this.tags = jsonObject.tags;

        if(Template.currentId <= jsonObject.id) {
            Template.currentId = jsonObject.id + 1;
        }
    }
}
