var pluginId = "com.onthehead.move-layers-specified-distance"; // Plugin ID
var pluginName = "Move Layers to Specified Distance Setting"; // Plugin Name
var posiXTextField, posiYTextField;
var NUD = NSUserDefaults.alloc().initWithSuiteName(pluginId);
var prefPosiX = "posiXKey";
var prefPosiY = "posiYKey";
var dist = {}
	dist.x = getTextValue(NUD, prefPosiX, "256");
	dist.y = getTextValue(NUD, prefPosiY, "512");

function moveTop(context){
	moveLayers(context, "t", false);
}

function moveRight(context){
	moveLayers(context, "r", false);
}

function moveBottom(context){
	moveLayers(context, "b", false);
}

function moveLeft(context){
	moveLayers(context, "l", false);
}

function duplicateTop(context){
	moveLayers(context, "t", true);
}

function duplicateRight(context){
	moveLayers(context, "r", true);
}

function duplicateBottom(context){
	moveLayers(context, "b", true);
}

function duplicateLeft(context){
	moveLayers(context, "l", true);
}

function moveLayers(context, drc, dup){
	var doc = context.document;
	var sels = context.selection;
	if (dup === true){
		for (var i = 0; i < sels.count(); i++){
			var tar = sels[i].duplicate();
			doMove(tar, dist, drc);
			sels[i].select_byExpandingSelection(false, true);
			tar.select_byExpandingSelection(true, true);
		}
	} else {
		for (var i = 0; i < sels.count(); i++){
			doMove(sels[i], dist, drc);
		}
	}
}

function doMove(tar, dist, drc){
	if (drc === "r"){
		tar.frame().left = tar.frame().left() + Number(dist.x);
	} else if (drc === "l"){
		tar.frame().left = tar.frame().left() + Number(dist.x) * -1;
	} else if (drc === "b"){
		tar.frame().top = tar.frame().top() + Number(dist.y);
	} else if (drc === "t"){
		tar.frame().top = tar.frame().top() + Number(dist.y) * -1;
	}
}


function setting(context){
	var res = addDialog(context).runModal();
	if (res === 1000){
		var posXlInput = posiXTextField.stringValue();
		NUD.setObject_forKey(changeFullToHalf(posXlInput), prefPosiX);
		var posYlInput = posiYTextField.stringValue();
		NUD.setObject_forKey(changeFullToHalf(posYlInput), prefPosiY);
		//context.document.showMessage("a");
		
		NUD.synchronize(); // save
		
		return true;
	} else {
		return false;
	}
}

function addDialog(context){ //Add Dialog
	var mainViewW = 300; // Main View Width
	var mainViewH = 90; // Main View Height
	var dialog = COSAlertWindow.new();
	dialog.setMessageText(pluginName);

	// Add Main View
	var mainView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, mainViewW, mainViewH));
	dialog.addAccessoryView(mainView);
	
	// Add Info
	var infoLabel = addStactText([17, 70, 300, 20], "Input and Save Distance Value.", 0);
	mainView.addSubview(infoLabel);
	
	// Add labels
	var posXLabel = addStactText([0, 20, 20, 20], "X: ", 1);
	var posYLabel = addStactText([155, 20, 20, 20], "Y: ", 1);
	
	mainView.addSubview(posXLabel);
	mainView.addSubview(posYLabel);

	// Add TextFields
	posiXTextField = NSTextField.alloc().initWithFrame(NSMakeRect(25, 20, 115, 24));
	posiXTextField.setStringValue(dist.x);
	posiYTextField = NSTextField.alloc().initWithFrame(NSMakeRect(180, 20, 115, 24));
	posiYTextField.setStringValue(dist.y);

	// Tab Focus
	posiXTextField.setNextKeyView(posiYTextField);
	posiYTextField.setNextKeyView(posiXTextField);
	dialog.alert().window().setInitialFirstResponder(posiXTextField);

	mainView.addSubview(posiXTextField);
	mainView.addSubview(posiYTextField);
	
	
	// Add Buttons
	dialog.addButtonWithTitle("Save");
	dialog.addButtonWithTitle("Cancel");

	return dialog;
}

function getTextValue(NUD, keyName, def){ //Get pluginId Value
	var val = NUD.objectForKey(keyName);
	if (val != undefined){
		return val;
	} else {
		return def;
	}
}

function changeFullToHalf(s){
	var str = s.replace(/[！-～]/g, function (tmpStr){
		return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
	});
  return str;
}

function addStactText(rect, text, align){ //Add Statc Text
	var tar = NSTextField.alloc().initWithFrame(NSMakeRect(rect[0], rect[1], rect[2], rect[3]));
	tar.setStringValue(text);
	tar.setSelectable(true);
	tar.setEditable(false);
	tar.setBezeled(false);
	tar.setDrawsBackground(false);
	tar.setAlignment(align);
	return tar;
}