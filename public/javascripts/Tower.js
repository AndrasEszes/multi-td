var Tower = function(bf, power, speed, range, cost) {
    this.bf = bf;

    this.power = typeof power === 'undefined' ? 1 : power;
    this.speed = typeof speed === 'undefined' ? 5 : speed;
    this.range = typeof range === 'undefined' ? 45 : range;
    this.cost  = typeof cost  === 'undefined' ? 100 : cost;
    this.size  = 5;

    this.position     = {x: 0, y: 0};
    this.targetVector = {x: 0, y: 0};
    this.barrelVector = {x: 0, y: 0};

    this.shots = [];
}

Tower.prototype.draw = function(pos) {
    if (typeof pos != 'undefined') {
        this.position = {
            x: pos.x,
            y: pos.y
        }
    }

    this.shiftShots().targetTracking();

    this.bf.context.beginPath();
    this.bf.context.lineWidth = 1;
    this.bf.context.strokeStyle = 'black';

    this.bf.context.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);

    this.bf.context.moveTo(this.position.x, this.position.y);
    this.bf.context.lineTo(this.barrelVector.x, this.barrelVector.y);
    this.bf.context.stroke();

    return this;
}

Tower.prototype.shiftShots = function() {
    var tower = this;
    var rad = 0;
    var direction = {};

    this.bf.context.beginPath();
    this.shots.forEach(function(item, index) {
        direction = {x: item.target.x - item.initial.x, y: item.target.y - item.initial.y};
        rad = Math.atan(direction.x/direction.y);

        if (direction.y < 0) rad += Math.PI;

        item.position.x += Math.sin(rad)*7|0;
        item.position.y += Math.cos(rad)*7|0;

        if (item.position.y < 0 || item.position.x < 0)
            tower.shots.splice(index, 1);
        else
            item.draw();
    });
    this.bf.context.fill();

    if (this.shots.length === 0) this.shots = [];

    return this;
}

Tower.prototype.targetTracking = function(targetPosition) {
     targetPosition = typeof targetPosition === 'undefined' ? this.targetVector : targetPosition;
     var direction = {x: targetPosition.x - this.position.x, y: targetPosition.y - this.position.y};
     var rad = Math.atan(direction.x/direction.y);

     if (direction.y < 0) rad += Math.PI;

     this.barrelVector = {
        x: (Math.sin(rad)*this.size*2 + this.position.x)|0,
        y: (Math.cos(rad)*this.size*2 + this.position.y)|0
    };

     return this;
}

Tower.prototype.shotToPos = function(pos) {
    var tower = this;
    var bf = this.bf;

    this.shots.push({
        position: JSON.parse(JSON.stringify(tower.barrelVector)),
        initial : JSON.parse(JSON.stringify(tower.barrelVector)),
        target  : JSON.parse(JSON.stringify(tower.targetVector)),
        draw: function() {
            bf.context.moveTo(this.position.x, this.position.y);
            bf.context.arc(this.position.x, this.position.y, 2, 0, 2*Math.PI);
        }
    });

    return this;
}