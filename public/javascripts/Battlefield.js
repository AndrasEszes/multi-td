var Battlefield = function(canvasID) {
	this.canvas = document.getElementById(canvasID);
	this.context = this.canvas.getContext('2d');
	this.barriers = [];
	this.towers = [];
}

Battlefield.prototype.setSize = function(width, height) {
	this.context.canvas.width = width;
	this.context.canvas.height = height;
	return this;
}

$(function(){
	var bf = new Battlefield('battlefield'),
		container = $('#battlefield').parent('div');

	bf.setSize(container.width(), 500);
	
	var margin = 500;
	for (var i = margin/2; i < bf.context.canvas.width; i += margin) {
		for (var j = margin/2; j < bf.context.canvas.height; j += margin) {
			bf.towers.push(new Tower(bf).draw({x: i, y: j}));
		}
	}

	bf.drawSafePath();
	bf.towers.forEach(function(item, index) {
		item.draw();
	});

	var tick = 0;
	// setInterval(function() {
	// 	bf.setSize(container.width(), 500);
	// 	bf.towers.forEach(function(item, index) {
	// 		item.draw();
	// 	});
	// 	tick++;
	// }, 20);

	$('#battlefield').on('mousemove', function(e) {
		bf.towers.forEach(function(item, index) {
			item.targetVector = {x: e.offsetX, y: e.offsetY};
			if (tick % Math.floor(1000/20/item.speed) == 0) {
				item.shotToPos({x: e.offsetX, y: e.offsetY});
			}
		});
	}).on('click', function(e) {
		if (e.which === 1) {
			bf.towers.forEach(function(item, index) {
				item.shotToPos({x: e.offsetX, y: e.offsetY});
			});
		} else if (e.which === 2) {
			bf.towers.push(new Tower(bf).draw({x: e.offsetX, y: e.offsetY}));
		}
	});
});