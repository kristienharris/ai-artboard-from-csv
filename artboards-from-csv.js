/*
Create artboards from spreadsheet (csv) file data
by Kristien Harris 

Purpose:
Create named artboards from a csv.

Notes:
- save spreadsheet as csv (remove empty rows in text editor)
- file needs column headers (name, width and height)
- dimensions in csv must be in mm
- will create artboards in the order found in the csv file
- use the rearrange artboards function to lay them out how you like

Inspiration/Credits:
CSV Data Parsing
https://stackoverflow.com/questions/67251603/input-csv-data-in-to-layers-with-illustrator-scripting

Point Conversion
https://community.adobe.com/t5/illustrator-discussions/how-to-draw-a-rectangle-in-millimeters/m-p/10213012#:~:text=This%20following%20snippet%20prints%20a%20rectangle%20which%20is,%2880%2C%20%22pt%22%29.as%20%28%22mm%22%29%2C%20new%20UnitValue%20%2880%2C%20%22pt%22%29.as%20%28%22mm%22%29%29%3B

Documentation:
https://developer.adobe.com/console/servicesandapis

Artboard size and prompt
https://community.adobe.com/t5/illustrator-discussions/script-change-artboard-size/m-p/13474097
*/

function run() {
  var doc = app.activeDocument;
  var units = 3; // 0 : point / 1 : pica / 2 : inch / 3 : mm / 4 : cm / 5 : custom / 6 : px
  app.preferences.setIntegerPreference("rulerType", units);

  // Open csv file
  var csv_file = File.openDialog();
  csv_file.open("r");
  var csv = csv_file.read();
  csv_file.close();

  // Get lines from csv
  var lines = csv.split("\n");

  // Set up dimenions and spacing
  var mm = 2.83464567;
  var margin = 10 * mm;

  // Resize the default artboard to the first line in our data
  var ab = doc.artboards[0];
  var data = getData(lines[1]);
  var width = parseFloat(data.width) * mm;
  var height = parseFloat(data.height) * mm;
  var rect = [0, height, width, 0];
  ab.artboardRect = rect;
  ab.name = data.name;

  // Get current artboard position for next artboard
  var x = ab.artboardRect[0];
  var y = ab.artboardRect[1];
  var x1 = ab.artboardRect[2];
  var y1 = ab.artboardRect[3];

  // Loop through the remaining artboards in our data
  for (var i = 2; i < lines.length; i++) {
    var newab = doc.artboards.add([x, y, x1, y1]);
    data = getData(lines[i]);
    width = parseFloat(data.width) * mm;
    height = parseFloat(data.height) * mm;
    x = x;
    y = y + margin;
    x1 = x + width;
    y1 = y - height;
    rect = [x, y, x1, y1];
    newab.artboardRect = [x, y, x1, y1];
    newab.name = data.name;
    // Create layer with name of artboard (optional remove // from line below)
    // makeLayer(data.name);
  }

  function getData(line) {
    var arr = line.split(",");
    var n = arr[0];
    var w = arr[1];
    var h = arr[2];
    return { name: n, width: w, height: h };
  }

  function makeLayer(layer_name) {
    var new_layer = app.activeDocument.layers.add();
    new_layer.name = layer_name;
  }
}

run();
