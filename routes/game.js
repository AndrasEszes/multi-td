
exports.new = function(req, res){
	res.render('game/new', {
		title: 'Multi TD - New Game',
		url: req.route.path,
		scripts: [
            '/javascripts/pathfinding-browser.min.js',
			'/javascripts/Battlefield.js',
            '/javascripts/Tower.js',
            '/javascripts/Monster.js',
            '/javascripts/controller.js'
		]
	});
};