var log;

exports.setLogging = function (logging, callback) {
	log = logging;
	callback();
};


exports.getLogging = function (callback) {
	callback(log);
};
