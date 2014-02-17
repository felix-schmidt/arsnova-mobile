/*******************************************************************************
 *	gridsquare.js
 ******************************************************************************/

var gridsquare = gridsquare || {};


/*******************************************************************************
 *	class gridsquare.gridsquare
 ******************************************************************************/
gridsquare.gridsquare = function(_canvasId, _width, _height, _gridColumns, _gridRows, _imageScale) {
	var canvasId;
	var width;
	var height;
	var canvas;
	var context;
	
	var picture;
	var grid;
	
	var pictureDrag;
	
	function init() {
		// setup canvas
		canvasId = _canvasId;
		width = _width;
		height = _height;
		canvas = document.getElementById(canvasId);
		console.log(width);
		canvas.width = width;
		canvas.height = height;
		canvas.style.width  = '' + width + 'px';
		canvas.style.height = '' + height + 'px';
		context = canvas.getContext("2d");
		
		pictureDrag = {};
		pictureDrag.startTimeMouseDown = 0;
		pictureDrag.positionOfDrag = {x:0, y:0};
		pictureDrag.positionOfPictureBeforeMove = {x:0, y:0};
		pictureDrag.mouseDown = false;
		pictureDrag.dragged = false;
		
		canvas.addEventListener('mousedown', onMouseDown, false);
		canvas.addEventListener('mouseup', onMouseUp, false);
		canvas.addEventListener('mousemove', onMouseMove, false);
		
		// setup picture
		picture = new gridsquare.picture(_imageScale);
		
		// setup grid
		grid = new gridsquare.grid(_gridColumns, _gridRows);
		
		// render
		render();
	}

	function onMouseDown(evt) {
		pictureDrag.dragged = false;
		pictureDrag.mouseDown = true;
		pictureDrag.startTimeMouseDown = new Date().getTime();
		pictureDrag.positionOfDrag.x = evt.clientX - canvas.getBoundingClientRect().left;
		pictureDrag.positionOfDrag.y = evt.clientY - canvas.getBoundingClientRect().top;
	}

	function onMouseUp(evt) {
		if(!pictureDrag.dragged) {
			var x = evt.clientX - canvas.getBoundingClientRect().left;
			var y = evt.clientY - canvas.getBoundingClientRect().top;
			selectGridTile(x, y);
		}
		pictureDrag.dragged  = false;
		pictureDrag.mouseDown = false;
	}

	function onMouseMove(evt) {
		if(pictureDrag.dragged) {
			Ext.getCmp('newQuestionPanelId').setScrollable( false );
			Ext.getCmp('questionDetailsPanelId').setScrollable( false );
			var x = evt.clientX - canvas.getBoundingClientRect().left;
			var y = evt.clientY - canvas.getBoundingClientRect().top;
			// make position relative to the drag start position
			x = x - pictureDrag.positionOfDrag.x;
			y = y - pictureDrag.positionOfDrag.y;
			// set new picture position
			var position = {x:(pictureDrag.positionOfPictureBeforeMove.x + x), y:(pictureDrag.positionOfPictureBeforeMove.y + y)};
			picture.setPosition(position);
			//render
			render();
		}
		else if(pictureDrag.mouseDown && ((new Date().getTime() - pictureDrag.startTimeMouseDown) > 250)) {
			var picturePosition = picture.getPosition();
			pictureDrag.positionOfPictureBeforeMove.x = picturePosition.x;
			pictureDrag.positionOfPictureBeforeMove.y = picturePosition.y;
			pictureDrag.dragged = true;
		}
		else {
			Ext.getCmp('newQuestionPanelId').setScrollable( true ); 
			Ext.getCmp('questionDetailsPanelId').setScrollable( true ); 
		}
	}
	
	function selectGridTile(_x, _y) {
		var selectedTile = {x:0,y:0};
		var gridSize = grid.getSize();
		
		selectedTile.x = Math.floor(_x / (width / gridSize.col));
		selectedTile.y = Math.floor(_y / (height / gridSize.row));
		
		var found = false;
		var selectedTiles = grid.getSelected();
		for(var i = 0; i < selectedTiles.length; i++) {
			if(selectedTiles[i].x == selectedTile.x && selectedTiles[i].y == selectedTile.y) {
				selectedTiles.splice(i, 1);
				found = true;
				break;
			}
		}
		if(!found) {
			selectedTiles.push(selectedTile);
		}
		grid.setSelected(selectedTiles);
		render();
	}
	
	function render() {
		//console.log("render");
		context.clearRect(0, 0, canvas.width, canvas.height);
		renderPicture();
		renderGrid();
		renderSelectedGridTiles();
	}
	
	function renderPicture() {
		var image = picture.getImage();
		var scale = picture.getScale() / 100;
		var position = picture.getPosition();
		context.drawImage(image, position.x, position.y, width * scale, height * scale);
	}
	
	function renderGrid() {
		var gridSize = grid.getSize();
		
		// draw first line
		context.beginPath();

		// draw vertical lines
		for(var i = 0 ; i < (width / gridSize.col) ; i++) {
			context.moveTo((width / gridSize.col) * i, 0);
			context.lineTo((width / gridSize.col) * i, height);
		}
		
		// draw horizontal lines
		for(var i = 0 ; i < (height / gridSize.row) ; i++) {
			context.moveTo(0, (height / gridSize.row) * i);
			context.lineTo(width, (height / gridSize.row) * i);
		}

		context.setLineDash([0,0]);
		context.lineWidth = 2;
		context.strokeStyle = '#000000';
		context.stroke();
		
		// draw second line
		context.beginPath();

		// draw vertical lines
		for(var i = 0 ; i < (width / gridSize.col) ; i++) {
			context.moveTo((width / gridSize.col) * i, 0);
			context.lineTo((width / gridSize.col) * i, height);
		}
		
		// draw horizontal lines
		for(var i = 0 ; i < (height / gridSize.row) ; i++) {
			context.moveTo(0, (height / gridSize.row) * i);
			context.lineTo(width, (height / gridSize.row) * i);
		}

		context.setLineDash([5,5]);
		context.lineWidth = 2;
		context.strokeStyle = '#ffffff';
		context.stroke();
	}
	
	function renderSelectedGridTiles() {
		context.beginPath();
		
		var selectedGridTiles = grid.getSelected();
		var gridSize = grid.getSize();
		
		for(var i = 0; i < selectedGridTiles.length; i++) {		
			var x = (width / gridSize.col) * selectedGridTiles[i].x;
			var y = (height / gridSize.row) * selectedGridTiles[i].y;
						
			context.rect(x, y, (width / gridSize.col), (height / gridSize.row));
		}
		
      context.fillStyle = 'rgba(0,225,0,0.5)';
      context.fill();
	}
	
	this.setGridSize = function(_x, _y) {
		grid.setSize(_x, _y);
		render();
    };
	
	this.loadImage = function(url) {
		var imageObj = new Image();
		imageObj.onload = function() {
			picture.setImage(imageObj);
			render();
		};
		imageObj.src = url;
	};
	
	this.setScale = function(_scale) {
		picture.setScale(_scale);
		render();
	};
	
	this.exportGrid = function() {
		result = [];
		var gridSize = grid.getSize();
		for(var r = 0; r < gridSize.row; r++) {
			for(var c = 0; c < gridSize.col; c++) {
				var field = String.fromCharCode(97 + r)+ "" + c;
				var correct = false;
				
				var selectedGridTiles = grid.getSelected();
				for(var i = 0; i < selectedGridTiles.length; i++) {
					if(selectedGridTiles[i].x === c && selectedGridTiles[i].y === r) {
						correct = true;
					}
				}
				
				result.push({text:field,correct:correct});
			}	
		}
		return result;
	};
	
	this.exportAnswerText = function() {
		var result = "";
		var firstValue = true;
		var gridSize = grid.getSize();
		for(var r = 0; r < gridSize.row; r++) {
			for(var c = 0; c < gridSize.col; c++) {
				var field = String.fromCharCode(97 + r)+ "" + c;
				var correct = false;
				
				var selectedGridTiles = grid.getSelected();
				for(var i = 0; i < selectedGridTiles.length; i++) {
					if(selectedGridTiles[i].x === c && selectedGridTiles[i].y === r) {
						correct = true;
					}
				}
				
				if(firstValue) {
					firstValue = false;
				}
				else {
					result += ","
				}
				if(correct) {
					result += "1"
				}
				else {
					result += "0"
				}
						
			}	
		}
		return result;
	};
	
	this.setSize = function(_width, _height) {
		this.width = _width;
		this.height = _height;
		this.canvas.width = width;
		this.canvas.height = height;
		this.canvas.style.width  = '' + width + 'px';
		this.canvas.style.height = '' + height + 'px';
	};
	
	this.exportPicture = function() {
		var tmpCanvas = document.createElement('canvas');
		tmpCanvas.width = width;
		tmpCanvas.height = height;
		
		var tmpContext = tmpCanvas.getContext('2d');
		tmpContext.drawImage(picture.getImage(), 0, 0);
		
		return tmpCanvas.toDataURL();
	}
	
	init();
};

/*******************************************************************************
 *	class gridsquare.picture
 ******************************************************************************/
gridsquare.picture = function(_scale) {
	var scale;
	var position;
	var image;

	function init() {
		scale = _scale;
		position = {x:0,y:0};
		image = new Image();
	}
	
	this.setScale = function(_scale) {
		scale = _scale;
	};
	
	this.getScale = function() {
		return scale;
	};
	
	this.setPosition = function(_position) {
		position = _position;
	};
	
	this.getPosition = function() {
		return position;
	};
	
	this.setImage = function(_image) {
		image = _image;
	};
	
	this.getImage = function() {
		return image;
	};
	
	init();
};

/*******************************************************************************
 *	class gridsquare.grid
 ******************************************************************************/
gridsquare.grid = function(_columns, _rows) {
	var size;
	var selected;
	
	function init() {
		size = {col:_columns,row:_rows};
		selected = [];
	}
	
	this.setSize = function(_col, _row) {
		if(_col > 0 && _row > 0) {
			size.col = _col;
			size.row = _row;
		}
		selected = [];
	};
	
	this.getSize = function() {
		return size;
	};
	
	this.getSelected = function() {
		return selected;
	};
	
	this.setSelected = function(_selected) {
		selected = _selected;
	};
	
	init();
};

// additional functions

gridsquare.gridsquarestore = [];

function createGridSquare(_id, _canvasId, _width, _height, _gridColumns, _gridRows, _imageScale) {
	var found = false;
	for(var i = 0; i < gridsquare.gridsquarestore.length; i++) {
		if(gridsquare.gridsquarestore[i].id == _id) {
			found = true;
			break;
		}
	}
	if(!found) {
		gridsquare.gridsquarestore.push({id:_id,object:new gridsquare.gridsquare(_canvasId, _width, _height, _gridColumns, _gridRows, _imageScale)});
	}
}

function getGridSquare(_id) {
	for(var i = 0; i < gridsquare.gridsquarestore.length; i++) {
		if(gridsquare.gridsquarestore[i].id == _id) {
			return gridsquare.gridsquarestore[i].object;
			break;
		}
	}
	return null;
}

function deleteGridSquare(_id) {
	for(var i = 0; i < gridsquare.gridsquarestore.length; i++) {
		if(gridsquare.gridsquarestore[i].id == _id) {
			gridsquare.gridsquarestore.splice(i, 1);
			break;
		}
	}
}


function Fensterweite () {
	  if (window.innerWidth) {
	    return window.innerWidth;
	  } else if (document.body && document.body.offsetWidth) {
	    return document.body.offsetWidth;
	  } else {
	    return 0;
	  }
	}

	function Fensterhoehe () {
	  if (window.innerHeight) {
	    return window.innerHeight;
	  } else if (document.body && document.body.offsetHeight) {
	    return document.body.offsetHeight;
	  } else {
	    return 0;
	  }
	}
	
/*******************************************************************************
 *	gridsquare todo
 ******************************************************************************/
//	-keep image ratio
//	-lock picture moving and scaling in student view
//	-remove console output
	
