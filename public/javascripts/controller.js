$(function(){
    var bf = new Battlefield('battlefield'),
        container = $('#battlefield').parent('div'),
        margin = 100;

    bf.starts.push({x:10, y:200});
    bf.destinations.push({x: container.width()-10, y:400});
    bf.destinations.push({x: 300, y:100});
    bf.draw(container);

    var w = bf.context.canvas.width,
        h = bf.context.canvas.height;

    for (var i = margin/2; i < w; i += margin) {
        for (var j = margin/2; j < h; j += margin) {
            bf.towers.push(new Tower(bf).draw({x: (i/bf.cellSize|0)*bf.cellSize+bf.cellSize/2|0, y: (j/bf.cellSize|0)*bf.cellSize+bf.cellSize/2|0}));
        }
    }
    bf.findSafePath();

    $('#battlefield').on('mousemove', function(e) {
        bf.towers.forEach(function(item, index) {
            item.targetVector = {x: e.offsetX|0, y: e.offsetY|0};
        });
    }).on('mousedown', function(e) {
        switch (e.which) {
            case 1:
                bf.towers.forEach(function(item, index) {
                    item.shotToPos({x: e.offsetX|0, y: e.offsetY|0});
                });
                break;
            case 2:
                alert('Middle mouse button pressed');
                break;
            case 3:
                bf.towers.push(new Tower(bf).draw({x: (e.offsetX/bf.cellSize|0)*bf.cellSize+(bf.cellSize/2|0), y: (e.offsetY/bf.cellSize|0)*bf.cellSize+(bf.cellSize/2|0)}));
                bf.findSafePath();
                break;
            default:
                alert('You have a strange mouse');
        }
    });
});