/*******************************************************************************
 *	planquadrat prototyp
 ******************************************************************************/

var planquadrat = planquadrat || {};

/*******************************************************************************
 *	planquadrat.input
 ******************************************************************************/
planquadrat.input = planquadrat.input || {};

planquadrat.input.onMouseClick = function(evt) {
	var x = evt.clientX - planquadrat.scene.canvas.getBoundingClientRect().left;
    var y = evt.clientY - planquadrat.scene.canvas.getBoundingClientRect().top;
	planquadrat.raster.selectTile(x, y);
};

planquadrat.input.init = function() {
	planquadrat.scene.canvas.addEventListener('click', planquadrat.input.onMouseClick, false);
};

/*******************************************************************************
 *	planquadrat.scene
 ******************************************************************************/
planquadrat.scene = planquadrat.scene || {};
planquadrat.scene.canvasId = "gsCanvas";	
breite = 80;  // in Prozent
hoehe = 60;  //in Prozent
planquadrat.scene.width = parseInt((Fensterweite() * breite) / 100);
planquadrat.scene.height =  parseInt((Fensterhoehe() * hoehe) / 100);
planquadrat.scene.canvas = undefined;
planquadrat.scene.context = undefined;

planquadrat.scene.init = function(id) {
	if (id != null) {
		planquadrat.scene.canvasId = id;
	}
	planquadrat.scene.canvas = document.getElementById(planquadrat.scene.canvasId);
	planquadrat.scene.canvas.width  = planquadrat.scene.width;
	planquadrat.scene.canvas.height = planquadrat.scene.height;
	planquadrat.scene.canvas.style.width  = '' + planquadrat.scene.width + 'px';
	planquadrat.scene.canvas.style.height = '' + planquadrat.scene.height + 'px';
	planquadrat.scene.context = planquadrat.scene.canvas.getContext("2d");
};

planquadrat.scene.redraw = function() {
	planquadrat.scene.clear();
	planquadrat.scene.draw();
};

planquadrat.scene.clear = function() {
	planquadrat.scene.context.clearRect(0, 0, planquadrat.scene.canvas.width, planquadrat.scene.canvas.height);
};

planquadrat.scene.draw = function() {
	if(planquadrat.picture.isLoaded) {
		planquadrat.scene.context.drawImage(planquadrat.picture.img, 0, 0, planquadrat.scene.width, planquadrat.scene.height);
	}
	planquadrat.raster.draw();
};

/*******************************************************************************
 *	planquadrat.raster
 ******************************************************************************/
planquadrat.raster = planquadrat.raster || {};

planquadrat.raster.columns = 1;
planquadrat.raster.rows = 1;
planquadrat.raster.color = '#3671B5';
planquadrat.raster.selectedTiles = [];

planquadrat.raster.selectTile = function(x, y) {
	var selectedTile = {x:0,y:0};

	selectedTile.x = Math.floor(x / (planquadrat.scene.width / planquadrat.raster.columns));
	selectedTile.y = Math.floor(y / (planquadrat.scene.height / planquadrat.raster.rows));

	var found = false;
	for(var i = 0; i < planquadrat.raster.selectedTiles.length; i++) {
		if(planquadrat.raster.selectedTiles[i].x == selectedTile.x && planquadrat.raster.selectedTiles[i].y == selectedTile.y) {
			planquadrat.raster.selectedTiles.splice(i, 1);

			found = true;
			break;
		}
	}
	if(!found) {
		planquadrat.raster.selectedTiles.push(selectedTile);
	}
	planquadrat.scene.redraw();
};

planquadrat.raster.draw = function(columns, rows, color) {
	planquadrat.raster.drawRaster();
	planquadrat.raster.drawTiles();
};

planquadrat.raster.drawRaster = function(columns, rows, color) {
	if(typeof columns !== "undefined") {planquadrat.raster.columns = columns;}
	if(typeof rows !== "undefined") {planquadrat.raster.rows = rows;}
	if(typeof color !== "undefined") {planquadrat.raster.color = color;}

	planquadrat.scene.context.beginPath();
    for(var i = 0 /*-1*/; i < (planquadrat.scene.width / planquadrat.raster.columns) /*+ 1*/; i++) {
		planquadrat.scene.context.moveTo((planquadrat.scene.width / planquadrat.raster.columns) * i, 0);
		planquadrat.scene.context.lineTo((planquadrat.scene.width / planquadrat.raster.columns) * i, planquadrat.scene.height);
	}
	for(var i = 0 /*-1*/; i < (planquadrat.scene.height / planquadrat.raster.rows) /*+ 1*/; i++) {
		planquadrat.scene.context.moveTo(0, (planquadrat.scene.height / planquadrat.raster.rows) * i);
		planquadrat.scene.context.lineTo(planquadrat.scene.width, (planquadrat.scene.height / planquadrat.raster.rows) * i);
	}
	planquadrat.scene.context.lineWidth = 6;
	planquadrat.scene.context.strokeStyle = '#ffffff';
    planquadrat.scene.context.stroke();

	planquadrat.scene.context.beginPath();
	for(var i = 0 /*-1*/; i < (planquadrat.scene.width / planquadrat.raster.columns) /*+ 1*/; i++) {
		planquadrat.scene.context.moveTo((planquadrat.scene.width / planquadrat.raster.columns) * i, 0);
		planquadrat.scene.context.lineTo((planquadrat.scene.width / planquadrat.raster.columns) * i, planquadrat.scene.height);
	}
	for(var i = 0 /*-1*/; i < (planquadrat.scene.height / planquadrat.raster.rows) /*+ 1*/; i++) {
		planquadrat.scene.context.moveTo(0, (planquadrat.scene.height / planquadrat.raster.rows) * i);
		planquadrat.scene.context.lineTo(planquadrat.scene.width, (planquadrat.scene.height / planquadrat.raster.rows) * i);
	}
	planquadrat.scene.context.lineWidth = 3;
	planquadrat.scene.context.strokeStyle = planquadrat.raster.color;
    planquadrat.scene.context.stroke();


};

planquadrat.raster.drawTiles = function(columns, rows, color) {
	planquadrat.scene.context.beginPath();
	for(var i = 0; i < planquadrat.raster.selectedTiles.length; i++) {
		var x = (planquadrat.scene.width / planquadrat.raster.columns) * planquadrat.raster.selectedTiles[i].x;
		var y = (planquadrat.scene.height / planquadrat.raster.rows) * planquadrat.raster.selectedTiles[i].y;

		planquadrat.scene.context.fillStyle = 'rgba(0,255,0, 0.3)';
		planquadrat.scene.context.fillRect(x,y,(planquadrat.scene.width / planquadrat.raster.columns),(planquadrat.scene.height / planquadrat.raster.rows));

		/*
		planquadrat.scene.context.moveTo(x, y);
		planquadrat.scene.context.lineTo(x + (planquadrat.scene.width / planquadrat.raster.columns), y + (planquadrat.scene.height / planquadrat.raster.rows));

		planquadrat.scene.context.moveTo(x + (planquadrat.scene.width / planquadrat.raster.columns), y);
		planquadrat.scene.context.lineTo(x, y + (planquadrat.scene.height / planquadrat.raster.rows));
		*/

		(planquadrat.scene.width / planquadrat.raster.columns) * planquadrat.raster.selectedTiles[i].x;

	}
	planquadrat.scene.context.lineWidth = 3;
	planquadrat.scene.context.strokeStyle = planquadrat.raster.color;
	planquadrat.scene.context.stroke();
};

/*******************************************************************************
 *	planquadrat.picture
 ******************************************************************************/
planquadrat.picture = planquadrat.picture || {};

planquadrat.picture.img = document.createElement('img');
planquadrat.picture.isLoaded = false;

planquadrat.picture.loadPicture = function(imageUrl) {
	planquadrat.picture.img.src = imageUrl;
	planquadrat.picture.img.onload = function() {
		planquadrat.picture.isLoaded = true;
		planquadrat.scene.redraw();
	};
};

/*******************************************************************************
 *	planquadrat
 ******************************************************************************/
planquadrat.init = function(id) {
	planquadrat.scene.init(id);
	planquadrat.input.init();
	planquadrat.scene.draw();

};

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
