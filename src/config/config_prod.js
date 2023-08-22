var config = {};

const root = "C:/EDOO"
config.videos = root + "/resources/videos/"
config.sounds = root + "/resources/sounds/"
config.images = root + "/resources/images/"

config.player = root + "/viewer/"
config.controller = root + "/controller/"

config.privateKey = root + "/server/ssl/key.pem"
config.certificate = root + "/server/ssl/cert.pem"

config.httpPort = 2999;
config.httpsPort = 3000;

module.exports = config;