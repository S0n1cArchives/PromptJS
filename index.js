const process = require('process');
const readline = require('readline');
const chalk = require("chalk");

class PromptJS {
    constructor() {
        this.name = "PromptJS";
        this.version = "1.0";
        this.user = {
            username: process.env.USER || process.env.USERNAME.toLowerCase()
        }
        this.pwd = `/`
        this.prompt = "";
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: this.prompt
        });
        this.setprompt();
        console.log(`${this.name} v${this.version}`)
        //console.log(this.rl)
       // console.log(process.env);


        this.rl.prompt();

        this.rl.on('line', (line) => {
            const cmd = line.trim();
            switch (line.trim()) {
                case '.quit':
                    console.log("Bye!")
                    return process.exit(0);
                    break;
                default:
                    const result = this.parseCmd(cmd);
                    console.log(result);


                    break;
            }
            this.rl.prompt();
        }).on('close', () => {
           // console.log()
            console.log('Cya later!');
            process.exit(0);
        });


    }

    changePWD(pwd) {
        this.pwd = pwd;
        this.rl.setprompt();
    }

    setprompt() {
        this.prompt = `${chalk.green(this.user.username)}${chalk.green('@promptjs')}:${chalk.blue(`${this.pwd}`)}# `;
        this.rl.setPrompt(this.prompt);
    }

    parseCmd(cmd) {
        
            //if(afterPrefix.contains)
            const splitCommands = cmd.split("|")
            splitCommands.forEach((com, i) => {
                splitCommands[i] = com.trim();
            })

            const commands = [];

            splitCommands.forEach(com => {
                //console.log(com);
                const parts = com.split(/\s/g);
                const command = parts[0];
                var args = parts.splice(1, parts.length);
              //  console.log(args)
                args = args.filter((arg) => {
                    if(arg.length > 0) {
                   //     console.log(arg);
                        return true;
                    }
                })
               // console.log(a)
                args.forEach((arg, i) => {
                    
                    try {
                        args[i] = JSON.parse(arg.trim());
                    } catch (e) {
                        void(0);
                    }

                    arg = arg.trim();

                })
                commands.push({
                    command: command,
                    args: args,
                })
            });
          //  console.log(commands);
            return commands;
        

       // console.log(parse(cmd))
    }
}

module.exports = PromptJS;