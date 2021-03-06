const SHOWHELLOMESSAGE = true;
const MOUSEDEBUG = false;
const EDITORDEBUG = false;
const EDITTEMPLATESDEBUG = false;
const EDITSHELFTEMPLATESDEBUG = false;

var SHELFCOLOR = ["#ff5324", "#ffffff", "#36c1f7"];
const DEFAULTCOLOR = "#36c1f7";
const EDITCOLOR = "#a903fc";

const saveProductURL = "./saveproducts.php";
const saveTemplatesURL = "./savetemplates.php";

const SAVEDMESSAGE = "Сохранено";
const HELLOMESSAGE = "Редактор товаров карты \nСохранить текущую расстановку - кнопка Enter \n\
Поменять товары местами - кнопка M \nПереместить товар - кнопка R \nКопировать содержимое полки - кнопка V \n\
Редактировать шаблоны - кнопка T \nРедактировать шаблоны полки - кнопка I \nРедактировать товар и теги - кнопка E \n\
Добавить полку с низу - кнопка S \nУдалить полку - кнопка D \nПоказать эту памятку - кнопка H";

const NoShelfSelectedMessage = "Не выбрана полка.";
const LastShelfMessage = "Последняя полка, удаление отменено.";

var currentSelectFunction;

var shelfTemplatesBuffer;
var shelfTemplatesSelectedShelf;

window.onload = init;

function init() {
    enableMainInterface();
	
	// Display hello message
	displayHelp();

	// Asks for marker
	markersub = "ред.";

	currentSelectFunction = selectShelf;

    mainInit();
	
	ctx.scale(ZOOMW, ZOOMH);

    initEditorInterface();
    initShelfTemplatesInterface();
    initEditTemplatesInterface();
}

function initEditorInterface() {
    let buttons = document.getElementsByClassName("command_button");
    
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", commandButtonEvent);
    }
}

function initShelfTemplatesInterface() {
    let searchField = document.getElementById("shelf_templates_search_field");
    let saveButton = document.getElementById("shelf_templates_save_button");
    let cancelButton = document.getElementById("shelf_templates_cancel_button");

    searchField.addEventListener('input', shelfTemplatesSearch);
    saveButton.addEventListener("click", shelfTemplatesSave);
    cancelButton.addEventListener("click", shelfTemplatesCancel);
}

function shelfTemplatesSearch() {
    let foundTemplates = findTemplates(globalTemplates, this.value);
    updateShelfTemplates(foundTemplates);
}

function shelfTemplatesSave() {
    shelfTemplatesSelectedShelf.templates = shelfTemplatesBuffer;

    disableShelfTemplatesInterface();
    enableMainInterface();
}

function shelfTemplatesCancel() {
    disableShelfTemplatesInterface();
    enableMainInterface();
}

function initEditTemplatesInterface() {
    let searchField = document.getElementById("edit_templates_search_field");
    let addButton = document.getElementById("edit_templates_add_button");
    let saveButton = document.getElementById("edit_templates_save_button");
    let cancelButton = document.getElementById("edit_templates_cancel_button");

    searchField.addEventListener('input', editTemplatesSearch);
    addButton.addEventListener("click", editTemplatesAdd);
    saveButton.addEventListener("click", editTemplatesSave);
    cancelButton.addEventListener("click", editTemplatesCancel);
}

function editTemplatesSearch() {
    let foundTemplates = findTemplates(editTemplatesArray, this.value);

    updateEditTemplates(foundTemplates);
}

function changeEditTemplatesSearch(str) {
    let searchField = document.getElementById("edit_templates_search_field");
    searchField.value = str;
}

function redrawEditTemplates() {
    let searchField = document.getElementById("edit_templates_search_field");

    let foundTemplates = findTemplates(editTemplatesArray, searchField.value);

    updateEditTemplates(foundTemplates);
}

function editTemplatesAdd() {
    let name = prompt("Имя шаблона: ");
    let tags = prompt("Тэги шаблона: ");

    editTemplatesArray.push(new Template(name, tags));

    changeEditTemplatesSearch("");
    updateEditTemplates(findTemplates(editTemplatesArray, ""));
}

function editTemplatesSave() {
    globalTemplates = editTemplatesArray;

    enableMainInterface();
    disableEditTemplatesInterface();
}

function editTemplatesCancel() {
    enableMainInterface();
    disableEditTemplatesInterface();
}

function enableMainInterface() {
    document.getElementById("main_element").style.display = "block";
    document.addEventListener("keyup", keyUpEvent);
    window.addEventListener("mouseup", mouseUpEvent);
}

function disableMainInterface() {
    document.getElementById("main_element").style.display = "none";
    document.removeEventListener("keyup", keyUpEvent);
    window.removeEventListener("mouseup", mouseUpEvent);
}

function enableShelfTemplatesInterface() {
    // Store current shelf and it's templates as global variables
    shelfTemplatesBuffer = selectedShelf.templates.slice();
    shelfTemplatesSelectedShelf = selectedShelf;
    
    document.getElementById("shelf_templates").style.display = "block";
    document.getElementById("shelf_templates_search_field").value = "";
    document.getElementById("shelf_templates_search_field").focus();
    
    // Debug
    if(EDITSHELFTEMPLATESDEBUG) {
    console.log("On creation shelfTemplatesBuffer = " + 
        JSON.stringify(shelfTemplatesBuffer));
    }
}

function disableShelfTemplatesInterface() {
    shelfTemplatesBuffer = null;
    shelfTemplatesSelectedShelf = null;
    
    document.getElementById("shelf_templates").style.display = "none";
}

function enableEditTemplatesInterface() {
    // Clone templates array
    editTemplatesArray = globalTemplates.slice();

    document.getElementById("edit_templates").style.display = "block";
    document.getElementById("edit_templates_search_field").value = "";
    document.getElementById("edit_templates_search_field").focus();
}

function disableEditTemplatesInterface() {
    editTemplatesArray = null;

    document.getElementById("edit_templates").style.display = "none";
}


function keyUpEvent(e) {
	if(e.code == "Enter") {
		dumpDataCommand();
	}
	if(e.code == "KeyM") {
		moveProductsCommand();
	}
	if(e.code == "KeyI") {
		editShelfTemplatesCommand();
	}
	if(e.code == "KeyT") {
		editTemplatesCommand();
	}
	if(e.code == "KeyE") {
		editProductsCommand();
	}
	if(e.code == "KeyR") {
		replaceProductCommand();	
	}
	if(e.code == "KeyV") {
		copyProductCommand();
	}
	if(e.code == "KeyS") {
		addShelfCommand();
	}
	if(e.code == "KeyD") {
		deleteShelfCommand();
	}
	if(e.code == "KeyH") {
		displayHelpCommand();
	}

}

function commandButtonEvent() {
	if(this.id == "save_button") {
		dumpDataCommand();
	}
	if(this.id == "move_button") {
		moveProductsCommand();
	}
	if(this.id == "shelf_templates_button") {
		editShelfTemplatesCommand();
	}
	if(this.id == "edit_templates_button") {
		editTemplatesCommand();
	}
	if(this.id == "edit_button") {
		editProductsCommand();
	}
	if(this.id == "replace_button") {
		replaceProductCommand();	
	}
	if(this.id == "copy_button") {
		copyProductCommand();
	}
	if(this.id == "add_shelf_button") {
		addShelfCommand();
	}
	if(this.id == "delete_shelf_button") {
		deleteShelfCommand();
	}
	if(this.id == "help_button") {
		displayHelpCommand();
	}
}

function dumpDataCommand() {
    dumpData();
    clearShelf();
}

function moveProductsCommand() {
    moveProducts();
}

function editShelfTemplatesCommand() {
    editShelfTemplates();
    clearShelf();
}

function editTemplatesCommand() {
    editTemplates();
    clearShelf();
}

function editProductsCommand() {
    editProducts();
    clearShelf();
}

function replaceProductCommand() {
    replaceProduct();
}

function copyProductCommand() {
    copyProduct();
}

function addShelfCommand() {
    addShelf();
    clearShelf();
}

function deleteShelfCommand() {
    deleteShelf();
    clearShelf();
}

function displayHelpCommand() {
    displayHelp();
}

function moveProducts() {
	if(selectedShelf != null) {
		SHELFCOLOR[2] = EDITCOLOR;
		currentSelectFunction = moveShelf;
	} else {
		alert(NoShelfSelectedMessage);
	}
}

function moveShelf(x, y) {
	let shelf = findShelf(x, y);
	
	if(typeof(shelf) == "undefined")
		return;

	let bufferShelf = shelf.copyShelf();
	shelf.changeShelf(selectedShelf);
	selectedShelf.changeShelf(bufferShelf);

	clearShelf();
}

function editShelfTemplates(){
    if(selectedShelf == null) {
        alert(NoShelfSelectedMessage);
        return;
    }
    
    enableShelfTemplatesInterface();
    disableMainInterface();

    updateShelfTemplates(findTemplates(globalTemplates, ""));
}

function updateShelfTemplates(foundTemplates) {
    let shelfTemplates = shelfTemplatesBuffer;
    let list = document.getElementById("shelf_templates_list");

    list.innerHTML = "";

    // First draw selected templates
    for(let i = 0; i < foundTemplates.length; i++) {
        let id = foundTemplates[i].id;
        if(shelfTemplates.includes(id)) {
            list.innerHTML += makeShelfTemplatesLine(foundTemplates[i]);
        }
    }

    // Then draw not selected 
    for(let i = 0; i < foundTemplates.length; i++) {
        let id = foundTemplates[i].id;
        if(!shelfTemplates.includes(id)) {
            list.innerHTML += makeShelfTemplatesLine(foundTemplates[i]);
        }
    }
}

function makeShelfTemplatesLine(template) {
    let resultStr = '<div>';

    let checkedStr = "";
    if(shelfTemplatesBuffer.includes(template.id)) {
        checkedStr = "checked";
    }

    // Checkbox
    resultStr += '<input type="checkbox" onclick="shelfTemplateClick(' + 
        template.id + ');" id="shelfTemplate' + template.id + '"' + 
        checkedStr + '></input>';

    // Name
    resultStr += '<span>' + template.name + '</span>';

    // End 
    resultStr += '</div>';

    return resultStr;
}

function shelfTemplateClick(templateId) {
    let checkbox = document.getElementById("shelfTemplate" + templateId);

    // Add or delete current shelf template 
    // based on checkbox value
    if(checkbox.checked) {
        shelfTemplatesBuffer.push(templateId);
    }
    else {
        let index = shelfTemplatesBuffer.indexOf(templateId);
        shelfTemplatesBuffer.splice(index, 1);
    }
    
    // Debug
    if(EDITSHELFTEMPLATESDEBUG) {
        console.log("templateId = " +  templateId)
        console.log("shelfTemplatesBuffer = " + JSON.stringify(shelfTemplatesBuffer));
    }
}

function editTemplates(){
    enableEditTemplatesInterface();
    disableMainInterface();
    
    changeEditTemplatesSearch("");
    updateEditTemplates(findTemplates(editTemplatesArray, ""));
}

function updateEditTemplates(foundTemplates) {
    let list = document.getElementById("edit_templates_list");

    list.innerHTML = "";

    for(let i = 0; i < foundTemplates.length; i++) {
        list.innerHTML += makeEditTemplatesLine(foundTemplates[i], i);
    }
}

function makeEditTemplatesLine(template, pos) {
    let resultStr = '<div class="editTemplateItem">';

    // Item head
    resultStr += '<div class="editTemplateItemHead">';
    // ID
    if(EDITTEMPLATESDEBUG) {
        resultStr += '<span>' + template.id + ' </span>';
    }
    // Name
    resultStr += '<span>' + template.name + '</span>';
    // Edit button
    resultStr += '<button onclick="editTemplate(' + template.id + ')">' + 
        'Редактировать' + '</button>';
    // Delete button
    resultStr += '<button onclick="deleteTemplate(' + template.id + ')">' + 
        'Удалить' + '</button>';
    resultStr += '</div>';

    // Item tags
    resultStr += '<div class="editTemplateItemTags">';
    resultStr += template.tags;
    resultStr += '</div>';

    // End 
    resultStr += '</div>';

    return resultStr;
}

function editTemplate(templateId) {
    let pos;

    for(let i = 0; i < editTemplatesArray.length; i++) {
        if(editTemplatesArray[i].id == templateId) {
            pos = i;
            break;
        }
    }

    let template = editTemplatesArray[pos];
    let name = prompt(template.name);
    let tags = prompt(template.tags);

    template.name = changeStrValue(template.name, name);
    template.tags = changeStrValue(template.tags, tags);

    redrawEditTemplates();
}

function deleteTemplate(templateId) {
    let pos;

    // Delete template from list
    for(let i = 0; i < editTemplatesArray.length; i++) {
        if(editTemplatesArray[i].id == templateId) {
            pos = i;
            break;
        }
    }
    editTemplatesArray.splice(pos, 1);

    // Delete template from every shelf
    for(let i = 0; i < stands.length; i++) {
        let shelves = stands[i].shelves;
        for(let j = 0; j < shelves.length; j++) {
            if(shelves[j].templates.includes(templateId)) {
                let temp = shelves[j].templates.filter(id => id != templateId);
                shelves[j].templates = temp;
            }
        }
    }

    redrawEditTemplates();
}

function findTemplates(templatesArray, searchString) {
   // Pick templates based on search string
   let foundTemplates = []; 
    searchString = searchString.toLowerCase();

    for(let i = 0; i < templatesArray.length; i++) {
        if(templatesArray[i].name.toLowerCase().includes(searchString)) {
            foundTemplates.push(templatesArray[i]);
        }   
    }   

    return foundTemplates;
}
                                               
function editProducts() {
	if(selectedShelf == null) {
		alert(NoShelfSelectedMessage);
	}
	let shelf = selectedShelf;

	// Ask change str
	let product = prompt(shelf.product).replace(/\\n/g, '\n');
	let tag = prompt(shelf.tag);

    shelf.product = changeStrValue(shelf.product, product);
    shelf.tag = changeStrValue(shelf.tag, tag, "/ ");
}

function replaceProduct() {
	if(selectedShelf != null) {
		SHELFCOLOR[2] = EDITCOLOR;
		currentSelectFunction = replaceShelf;
	} else {
		alert(NoShelfSelectedMessage);
	}
}

function replaceShelf(x, y) {
	let shelf = findShelf(x, y);

	if(typeof(shelf) == "undefined")
			return;

	shelf.changeShelf(selectedShelf);
	selectedShelf.changeShelf(new Shelf("", "/", "/"));

	clearShelf();
}

function copyProduct() {
	if(selectedShelf != null) {
		SHELFCOLOR[2] = EDITCOLOR;
		currentSelectFunction = copyShelf;
	} else {
		alert(NoShelfSelectedMessage);
	}
}

function copyShelf(x, y) {
	let shelf = findShelf(x, y);

	if(typeof(shelf) == "undefined")
			return;

	shelf.changeShelf(selectedShelf.copyShelf());

	clearShelf();
}

function addShelf() {
	if(selectedShelf == null) {
		alert(NoShelfSelectedMessage);
	}
	
	let stand = selectedShelf.stand;
	let pos;

	// Find shelf position
	for(let i = 0; i < stand.shelves.length; i++) {
		if(stand.shelves[i] == selectedShelf) {
			pos = i + 1;
			break;
		}

	}

	stand.shelves.splice(pos, 0, new Shelf("", "/", "/", stand));
}

function deleteShelf() {
	if(selectedShelf == null) {
		alert(NoShelfSelectedMessage);
		return;
	}
	
	let stand = selectedShelf.stand;

	// Check for last shelf
	if(stand.shelves.length == 1) {
		alert(LastShelfMessage);
		return;
	}

	let pos;

	// Find shelf position
	for(let i = 0; i < stand.shelves.length; i++) {
		if(stand.shelves[i] == selectedShelf) {
			pos = i;
			break;
		}

	}

	if(EDITORDEBUG) {
		alert("pos: " + pos);
		alert("shelves before: " + stand.shelves);
	}

	stand.shelves.splice(pos, 1);

	if(EDITORDEBUG) {
		alert("shelves after: " + stand.shelves);
	}
}

function displayHelp() {
    if(SHOWHELLOMESSAGE) {
        alert(HELLOMESSAGE);
    }
}

function mouseUpEvent(e) {

    let canvas = document.getElementById("canvas_id");

    let br = canvas.getBoundingClientRect();
    let offsetY = br.top + window.pageYOffset;
    let offsetX = br.left + window.pageXOffset;

	let x = (e.pageX - offsetX) / ZOOMW;
	let y = (e.pageY - offsetY) / ZOOMH;

	if(MOUSEDEBUG == true) {
        alert("br.top: " + br.top + "\n" +
        "window.pageYOffset: " + window.pageYOffset + "\n" +
        "offsetY: " + offsetY + "\n" +
        " offsetX: " + offsetX + "\n" +
		"page x: " + e.pageX + " y: " + e.pageY + "\n" +
		"x: " + x + " y: " + y);
	}
	
	currentSelectFunction(x, y);
}


var selectedShelf = null;

function selectShelf(x, y) {
	let shelf = findShelf(x, y);

	if(typeof(shelf) != "undefined") {
		selectedShelf = shelf;
	}
}

function clearShelf() {
	SHELFCOLOR[2] = DEFAULTCOLOR;
	selectedShelf = null;
	currentSelectFunction = selectShelf;
}

function findShelf(x, y) {
	let shelf;
	
	// Find stand
	shelfSearch:
	for(let nextStand of stands) {
		let sx = nextStand.x;
		let sy = nextStand.y;
		let l = nextStand.l;
		let w = nextStand.w;
		
		let offsetX = l * Math.cos(nextStand.orientation) - w * Math.sin(nextStand.orientation);
		let offsetY = w * Math.cos(nextStand.orientation) + l * Math.sin(nextStand.orientation);
		
		let ex = sx + offsetX;
		let ey = sy + offsetY;
		
		let x1 = Math.min(sx, ex);
		let x2 = Math.max(sx, ex);
		let y1 = Math.min(sy, ey);
		let y2 = Math.max(sy, ey);	
		
		if((x >= x1) && (x < x2) && (y >= y1) && (y < y2)) {
			// Find shelf
			let startsoffsetX;
			let startsoffsetY;
			let endsoffsetX;
			let endsoffsetY;
			let shelfl = nextStand.shelves.length;
			
			for(let i = 0; i < nextStand.shelves.length; i++) {
				
				
				startsoffsetX = - i * w * Math.sin(nextStand.orientation) / shelfl;
				startsoffsetY = i * w * Math.cos(nextStand.orientation) / shelfl;
				endsoffsetX = l * Math.cos(nextStand.orientation) - (i + 1) * w * Math.sin(nextStand.orientation) / shelfl;
				endsoffsetY = l * Math.sin(nextStand.orientation) + (i + 1) * w * Math.cos(nextStand.orientation) / shelfl;
				
				let shelfsx = sx + Math.min(startsoffsetX, endsoffsetX);
				let shelfsy = sy + Math.min(startsoffsetY, endsoffsetY);
				
				let shelfex = sx + Math.max(startsoffsetX, endsoffsetX);
				let shelfey = sy + Math.max(startsoffsetY, endsoffsetY);

				if((x >= shelfsx) && (x < shelfex) && (y >= shelfsy) && (y < shelfey)) {		
					shelf = nextStand.shelves[i];
					break shelfSearch;
				}
			}
		}
	}
	return shelf;
}

function changeStrValue(targetStr, str, firstSymbol = "") {
    // Check for + and - sign
    if(str.charAt(0) == "+") {
        return targetStr + str.substring(1);
    }
    else if(str.charAt(0) == "-") {
        let minusStr = str.substring(1);
        return targetStr.replace(minusStr, "");
    }
    else if(str != "") {
        return firstSymbol + str;
    }
    else {
        return targetStr;
    }
}

function dumpData() {
    dumpProducts();
    dumpTemplates();

	alert(SAVEDMESSAGE);
}

function dumpProducts() {
	let products = [];
	
	for(let i = 0; i < stands.length; i++) {
		let name = stands[i].shelves[0].product;
		let tags = stands[i].shelves[0].tag;
		let templates = templatesToStr(stands[i].shelves[0].templates);
		
		for(let j = 1; j < stands[i].shelves.length; j++) {
			let shelf = stands[i].shelves[j];
			
			name += ", " + shelf.product;
			tags += ", " + shelf.tag;
			templates += ", " + templatesToStr(shelf.templates);
		}
		
		products.push([name, tags, templates]); }
	
	// Convert to json
	let saveStr = JSON.stringify(products);
	
	postphp(saveStr, saveProductURL, "products");

}

function dumpTemplates() {
    let dataString = JSON.stringify(globalTemplates);

    postphp(dataString, saveTemplatesURL, "templates");
}

function postphp(data, url, varName) {
	// Send data to php
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(varName + "=" + encodeURIComponent(data));
}

function templatesToStr(templates) {
    return "/" + templates.join(" ");
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
		 .replace(/\n/g, "\\" + "n");
}

function arrayToStr(array) {
    let resultStr = "";
    alert("length = " + array.length);
    for(let i = 0; i < array.length; i++) {
        resultStr += array[i];
    }
}
