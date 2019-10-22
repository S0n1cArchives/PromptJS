module.exports = function(...args) {
    if(args.length > 0) {
        var dir = args[0]
    } else {
        var dir = "~"
    }

    switch(dir) {
        case "~": 
            this.changePWD("/")
        default:
            this.changePWD(dir)
    }
    return null
}