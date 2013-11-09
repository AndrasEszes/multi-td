
exports.new = function(req, res){
	res.render('game/new', {
		title: 'Multi TD - New Game',
		url: req.route.path,
		scripts: [
			'/javascripts/Battlefield.js',
            '/javascripts/Tower.js'
		]
	});
};