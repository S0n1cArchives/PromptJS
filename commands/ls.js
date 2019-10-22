module.exports = function(...args) {
    if(args.length > 0) {
        var dir = args[0];
    } else {
        var dir = this.pwd;
    }
    return dir;
}