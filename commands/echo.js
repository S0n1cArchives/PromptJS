module.exports = {
    name: "echo",
    description: "Return the arguments u sent spaced out",
    async handler(...args) {
        return args.join(" ")
    }
}