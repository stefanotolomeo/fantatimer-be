var config = {};

config.videos = __dirname + "/../../../edoo-resources/videos/"
config.sounds = __dirname + "/../../../edoo-resources/sounds/"
config.images = __dirname + "/../../../edoo-resources/images/"

config.player = __dirname + "/../../../edoo-viewer/src"

config.privateKey = __dirname + "/../ssl/key.pem"
config.certificate = __dirname + "/../ssl/cert.pem"

config.httpPort = 2999;
config.httpsPort = 3000;

module.exports = config;