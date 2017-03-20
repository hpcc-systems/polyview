/**
	Read a JSON file
	@param {String} file - Relative File Path of the JSON File
	@param {requestCallback} callback - The callback that handles response
**/
function readJSONFile(file, callback) {
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open("GET", file, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status == "200") {
			callback(xhr.responseText);
		}
	}
	xhr.send(null);
}

/**
	Returns an 2D array of targetWidget_IDs if a widget has interactions defined.
	@param {Array} widgetsArray - Array of all the widgets defined in the JSON file
	@return {Array} interactionsArray - 2D array of targetWidget_IDs
**/
function getWidgetsWithInteractions(widgetsArray) {
	var interactionsArray = [];
	for (var i = 0; i < widgetsArray.length; i++) {
		var interactions = widgetsArray[i].interactions;
		if (interactions) {
			interactionsArray.push(interactions.targetWidget_ID);
		}
	}

	return interactionsArray;
}

/**
	Returns the Google Chart equivalent for the chart type specified by the user in JSON
	@param {String} chartType - Chart Type
	@return {String} Google Chart Type
**/
function getGoogleChartType(chartType) {
	// Valid Google Chart Types: area, bar, bubble, candlestick, column, combo, geo, histogram, line, pie, scatter, stepped-area, treemap
	if (chartType.toLowerCase() === 'geo') {
		return 'geo';
	} else if (chartType.toLowerCase() === 'column') {
		return 'column';
	} else if (chartType.toLowerCase() === 'pie') {
		return 'pie';
	} else if (chartType.toLowerCase() === 'line') {
		return 'line';
	} else if (chartType.toLowerCase() === 'table') {
		return 'table';
	} else {
		return 'ChartType is not a google chart type';
	}
}

function getRoxieServiceURlForInputParams(inputParameter, roxieServiceURL) {
	var noOfParameters = Object.keys(inputParameter).length;
	var inputParameterString = "";
	for ( var jsonKey in inputParameter) {
		inputParameterString += jsonKey + "=" + inputParameter[jsonKey];
		if (noOfParameters > 1) {
			inputParameterString += '&';
		}
		noOfParameters--;
	}
	roxieServiceURL = roxieServiceURL + "?" + inputParameterString;
	return roxieServiceURL;
}

/**
	Returns the Widget object for the given widget ID
	@param {String} widgetId - WidgetID of the widget
	@return {Object} Widget - Widget object
**/
function getWidgetProperties(widgetId) {
	var noOfDashboards = data.dashboards.length
	if (noOfDashboards > 0) {
		for (var i = 0; i < noOfDashboards; i++) {
			//Dashboard specific parameters
			var dashboard = data.dashboards[i];
			var widgetsArray = dashboard.widgets;
			for (var j = 0; j < widgetsArray.length; j++) {
				//Widget specific parameters
				if (widgetId === widgetsArray[j].id) {
					return widgetsArray[j];
				}
			}
		}
	}

}


/**
 	Checks if a String is a valid URL.
 	@param {String} url - URL string to be checked if it is a valid url
 	@return {boolean} result - valid or invalid
 **/
function IsURL(url) {
    var strRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
    var re = new RegExp(strRegex);
    return re.test(url);
 }

/**
 	Checks if a String starts with http or https and is a valid URL.
 	@param {String} url - URL string to be checked if it is a valid url
 	@return {boolean} result - valid or invalid
 **/
function urlChecker(url) {
	if (url.startsWith("http") || url.startsWith("https")) {
		return IsURL(url) ? true : false;
	} else {
		return false;
	}
}

function isNumeric(num){
    return !isNaN(num)
}


function convertTo2DArray(response, cols) {
	var innerArrayLength = cols.length;
	var my2dArray = new Array(response.length);
	for(var i = 0; i < (response.length); i++){
		my2dArray[i] = new Array(cols.length);
	}

	for(var j = 0; j < my2dArray.length; j++) {
		for(var k = 0; k < my2dArray[j].length; k++){
			my2dArray[j][k] = isNumeric(response[j][cols[k]]) ? parseFloat(response[j][cols[k]]) : response[j][cols[k]];
		}
	}

	return my2dArray;
}

function getFields(fields){
	var myArr = new Array();
	fields.forEach(function(column, index){
		for(var prop in column) {
			if(prop === 'endpointValue'){
				myArr.push(column[prop]);
			}
		}
	});

	return myArr;
}