var Battlefield = function(canvasID) {
	this.canvas = document.getElementById(canvasID);
	this.canvas.oncontextmenu = function() { return false; };
	this.context = this.canvas.getContext('2d');
	this.cellSize = 10;

	this.height = 500;

	this.starts   = [];
	this.destinations = [];

	this.barriers = [];
	this.towers   = [];
	this.monsters = [];

	this.paths = [];
}

Battlefield.prototype.setSize = function(width, height) {
	this.context.canvas.width = width;
	this.context.canvas.height = height;
	return this;
}

Battlefield.prototype.draw = function(container) {
	var self = this;
	this.setSize(container.width(), this.height);
	this.context.rect(0, 0, this.context.canvas.width, this.context.canvas.height);
	this.context.stroke();

	self.context.beginPath();
	this.starts.forEach(function(item, index) {
	    self.context.strokeStyle = 'red';
	    self.context.moveTo(item.x+20, item.y);
	    self.context.arc(item.x, item.y, 20, 0, 2*Math.PI);
	});
	self.context.stroke();

	self.context.beginPath();
	this.destinations.forEach(function(item, index) {
	    self.context.strokeStyle = 'green';
	    self.context.moveTo(item.x+20, item.y);
	    self.context.arc(item.x, item.y, 20, 0, 2*Math.PI);
	});
	self.context.stroke();

	this.towers.forEach(function(item, index) {
		item.draw();
	});

	this.context.beginPath();
	this.context.fillStyle = 'rgba(0,0,0,0.1)';
	this.paths.forEach(function(path, pti) {
		path.forEach(function(point, pni) {
			self.context.moveTo(self.cellSize*point[0]+0.5, self.cellSize*point[1]+0.5);
			self.context.rect(self.cellSize*point[0]+0.5, self.cellSize*point[1]+0.5, self.cellSize, self.cellSize);
		});
	});
	this.context.fill();

	setTimeout(function(){ self.draw(container); }, 20);
}

Battlefield.prototype.findSafePath = function() {
	var self = this;
	var columns = self.context.canvas.width/self.cellSize|0;
	var rows = self.context.canvas.height/self.cellSize|0;
	var grid = new PF.Grid(columns, rows);

	self.towers.forEach(function(item, index) {
		var x = item.position.x/self.cellSize|0;
		var y = item.position.y/self.cellSize|0;
		grid.setWalkableAt(x,y,false);
	});

	var paths = [];
	var finder = new PF.BiAStarFinder({allowDiagonal: false});

	self.starts.forEach(function(start, si) {
		self.destinations.forEach(function(end, ei) {
			var gridBackup = grid.clone();
			paths.push(finder.findPath(start.x/self.cellSize|0, start.y/self.cellSize|0, end.x/self.cellSize|0, end.y/self.cellSize|0, gridBackup));
		});
	});

	self.paths = paths;
}