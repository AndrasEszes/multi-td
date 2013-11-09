
exports.index = function(req, res){
	res.render('contact/index', {
		title: 'Multi TD - Contact',
		url: req.route.path,
		scripts: [
			'https://maps.googleapis.com/maps/api/js?key=AIzaSyC7lUXNoj_bFIP7sDmaVgv88kTqDPi6E0g&sensor=false',
			'/javascripts/contact.js'
		]
	});
};