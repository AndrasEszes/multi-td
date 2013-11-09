var Tower = function(bf, power, speed, range, cost) {
    this.bf = bf;

    this.power = typeof power === 'undefined' ? 1 : power;
    this.speed = typeof speed === 'undefined' ? 2 : speed;
    this.range = typeof range === 'undefined' ? 30 : range;
    this.cost = typeof cost === 'undefined' ? 100 : cost;

    this.position = {x: 0, y: 0};
    this.directionVector = {x: 0, y: 0};
    this.targetVector = {x: 0, y: 0};

    this.shots = [];
}

Tower.prototype.draw = function(pos) {
    if (typeof pos != 'undefined') {
        var coords = this.bf.posToCoord(pos);
        this.position = {
            x: coords.left+(this.bf.gridSize/2),
            y: coords.top+(this.bf.gridSize/2)
        }
    }
    
    this.bf.context.lineWidth = 1;
    this.bf.context.strokeStyle = 'black';

    this.bf.context.beginPath();
    this.bf.context.arc(this.position.x,this.position.y, this.bf.gridSize/2, 0, 2*Math.PI);
    this.bf.context.stroke();

    this.bf.context.beginPath();
    this.bf.context.moveTo(this.position.x,this.position.y);
    this.bf.context.lineTo(this.position.x, this.position.y - this.bf.gridSize);
    this.bf.context.stroke();

    return this;
}

Tower.prototype.update = function() {
    this.bf.context.lineWidth = 1;
    this.bf.context.strokeStyle = 'black';

    this.bf.context.beginPath();
    this.bf.context.arc(this.position.x,this.position.y, this.bf.gridSize/2, 0, 2*Math.PI);
    this.bf.context.stroke();

    this.bf.context.beginPath();
    this.bf.context.moveTo(this.position.x,this.position.y);
    this.bf.context.lineTo(this.directionVector.x, this.directionVector.y);
    this.bf.context.stroke();

    // Update shots
    var tower = this;
    var rad = 0;
    var direction = {};

    this.shots.forEach(function(item, index) {
        direction = {x: item.target.x - item.initial.x, y: item.target.y - item.initial.y};
        rad = Math.atan(direction.x/direction.y);
        
        if (direction.y < 0) rad += Math.PI;

        item.position.x += Math.sin(rad)*10;
        item.position.y += Math.cos(rad)*10;

        if (item.position.y < 0 || item.position.x < 0)
            tower.shots.splice(index, 1); 
        else
            item.draw();
    });

    if (this.shots.length === 0) this.shots = [];

    return this;
}

Tower.prototype.rotate = function(rad) {
    rad = typeof rad == 'undefined' ? 0 : rad;
    this.directionVector.x = this.position.x + this.bf.gridSize*Math.sin(rad);
    this.directionVector.y = this.position.y + this.bf.gridSize*Math.cos(rad);
    return this;
}

Tower.prototype.rotateToPos = function(pos) {
    this.targetVector = typeof pos == 'undefined' ? this.targetVector : pos;
    var aVector = {
        x: 0,
        y: this.bf.gridSize
    }
    var bVector = {
        x: this.targetVector.x - this.position.x,
        y: this.targetVector.y - this.position.y
    }

    var scalar = aVector.x * bVector.x + aVector.y * bVector.y;
    var lengthA = Math.sqrt(Math.pow(aVector.x, 2) + Math.pow(aVector.y, 2));
    var lengthB = Math.sqrt(Math.pow(bVector.x, 2) + Math.pow(bVector.y, 2));

    if (bVector.x < 0) {
        this.rotate(Math.PI+(Math.PI-Math.acos(scalar/(lengthA*lengthB))));
    } else {
        this.rotate(Math.acos(scalar/(lengthA*lengthB)));    
    }

    return this; 
}

Tower.prototype.shotToPos = function(pos) {
    var tower = this;
    var bf = this.bf;
    this.shots.push({
        position: JSON.parse(JSON.stringify(tower.directionVector)),
        initial : JSON.parse(JSON.stringify(tower.directionVector)),
        target  : JSON.parse(JSON.stringify(tower.targetVector)),
        draw: function() {
            bf.fillStyle = 'black';
            bf.context.beginPath();
            bf.context.arc(this.position.x, this.position.y, 1, 0, 2*Math.PI);
            bf.context.fill();
        }
    });
}