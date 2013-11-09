
exports.index = function(req, res){
	res.render('index', {
		title: 'Multi TD',
		url: req.route.path
	});
};