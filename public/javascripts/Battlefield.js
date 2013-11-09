var Battlefield = function(canvasID) {
	this.canvas = document.getElementById(canvasID);
	this.context = this.canvas.getContext('2d');
	this.gridSize = 10;
	this.hoveredCell = {x: 0, y: 0};
	this.barriers = [];
}

Battlefield.prototype.drawGrid = function(size) {
	this.context.lineWidth = 1;
	this.context.strokeStyle = '#aaa';
	this.gridSize = typeof size == 'undefined' ? this.gridSize : size;

	for (var i = Math.floor(this.gridSize/2); i < this.context.canvas.width; i += this.gridSize) {
		this.context.beginPath();
		this.context.moveTo(i+0.5, 0);
		this.context.lineTo(i+0.5, this.context.canvas.height);
		this.context.stroke();
	}

	for (var i = Math.floor(this.gridSize/2); i < this.context.canvas.height; i += this.gridSize) {
		this.context.beginPath();
		this.context.moveTo(0, i+0.5);
		this.context.lineTo(this.context.canvas.width, i+0.5);
		this.context.stroke();
	}

	return this;
}

/**
 * Egy akadályt helyez el a pályán
 * 
 * @param  {int} x      [description]
 * @param  {int} y      [description]
 * @param  {string} fill   [description]
 * @param  {string} stroke [description]
 * 
 * @return {[type]}        [description]
 */
Battlefield.prototype.fillCell = function(x, y, fill, stroke) {
	var left = (x-1) * this.gridSize + (this.gridSize/2) + 0.5;
	var top = (y-1) * this.gridSize + (this.gridSize/2) + 0.5;
	fill = typeof fill == 'undefined' ? '#666' : fill;
	stroke = typeof stroke == 'undefined' ? '#aaa' : stroke;

	if (top < this.context.canvas.height && top >= 0 && left < this.context.canvas.width && left >= 0) {
		this.context.beginPath();
		this.context.fillStyle = fill;
		this.context.rect(left, top, this.gridSize, this.gridSize);
		this.context.fill();
		this.context.lineWidth = 1;
		this.context.strokeStyle = stroke;
		this.context.stroke();
	}

	return this;
}

Battlefield.prototype.drawFence = function() {
	for (var i = 1; i < this.getNumOfCols(); i++) {
		this.addBarrier({x:i, y:1});
		this.addBarrier({x:i, y:this.getNumOfRows()-1});
	}

	for (var i = 1; i < this.getNumOfRows(); i++) {
		this.addBarrier({x:1, y:i});
		this.addBarrier({x:this.getNumOfCols()-1, y:i});
	}
}

Battlefield.prototype.addBarrier = function(pos) {
	if (!this.isBarrier(pos)) {
		this.barriers.push(pos);
		this.fillCell(pos.x, pos.y);
	} else {
		this.removeBarrier(pos);
	}

	return this;
}

Battlefield.prototype.removeBarrier = function(pos) {
	for (var i in this.barriers) {
		if (this.barriers[i].x == pos.x && this.barriers[i].y == pos.y) {
			this.barriers.splice(i, 1);
			return this;
		}
	}

	return this;
}

Battlefield.prototype.getNumOfCols = function() {
	return Math.floor(this.context.canvas.width / this.gridSize);
}

Battlefield.prototype.getNumOfRows = function() {
	return Math.floor(this.context.canvas.height / this.gridSize);
}

/**
 * jQuery mouse event alapján, visszaadja, hogy mi a cella koordinátája
 * 
 * @param  {object} e jQuery mouse event
 * 
 * @return {object}   x és y koordináták
 */
Battlefield.prototype.getPosition = function(e) {
	return {
		x: Math.floor((e.offsetX + this.gridSize/2) / this.gridSize),
		y: Math.floor((e.offsetY + this.gridSize/2) / this.gridSize),
	};
}

Battlefield.prototype.setSize = function(width, height) {
	this.context.canvas.width = width;
	this.context.canvas.height = height;
	return this;
}

Battlefield.prototype.isBarrier = function(pos) {
	return !this.barriers.every(function(item) {
		if (item.x == pos.x && item.y == pos.y) {
			return false;
		} else {
			return true;
		}
	});
}

Battlefield.prototype.posToCoord = function(pos) {
	return {
		left: (pos.x-1) * this.gridSize + (this.gridSize/2) + 0.5,
		top : (pos.y-1) * this.gridSize + (this.gridSize/2) + 0.5
	}
}

$(function(){
	var bf = new Battlefield('battlefield'),
		container = $('#battlefield').parent('div');
	

	var towers = [];
	for (var i = 0; i < 50; i++) {
		towers.push(new Tower(bf).draw({x: Math.floor(Math.random()*100)+5, y: Math.floor(Math.random()*40)+5}));
	}

	setInterval(function() {
		bf.setSize(container.width(), 500);
		towers.forEach(function(item, index) {
			item.rotateToPos().update();
		});
	}, 25);

	$('#battlefield').on('mousemove', function(e) {
		towers.forEach(function(item, index) {
			item.targetVector = {x: e.offsetX, y: e.offsetY};
		});
	}).on('click', function(e) {
		towers.forEach(function(item, index) {
			item.shotToPos({x: e.offsetX, y: e.offsetY});
		});
	});
});