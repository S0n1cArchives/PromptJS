const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class PromptJS {
    constructor() {
        this.name = "PromptJS";
        this.version = "1.0";
        this.prompt = `${this.name} v${this.version}`
        rl.question('What do you think of Node.js? ', (answer) => {
            // TODO: Log the answer in a database
            console.log(`Thank you for your valuable feedback: ${answer}`);

            rl.close();
        });
    }
}

module.exports = PromptJS;