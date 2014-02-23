var Monster = function(bf, life, speed, cost) {
    this.bf = bf;

    this.life  = typeof life  === 'undefined' ? 10 : life;
    this.speed = typeof speed === 'undefined' ? 5 : speed;
    this.cost  = typeof cost  === 'undefined' ? 100 : cost;
    this.size  = 5;

    this.position = {x: 0, y: 0};
}

Monster.prototype.draw = function(pos) {
    if (typeof pos != 'undefined') {
        this.position = {
            x: pos.x,
            y: pos.y
        }
    }
}

Monster.prototype.nextSafestStep = function() {

}

Monster.prototype.nextShortestStep = function() {

}