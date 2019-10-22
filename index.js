const process = require('process');
const readline = require('readline');
const chalk = require("chalk");
const fs = require("fs")
const path = require("path")
var cmdsDir = fs.readdirSync(path.join(__dirname, "commands"))

class PromptJS {
    constructor() {
        this.name = "PromptJS";
        this.version = "1.0";
        this.user = {
            username: process.env.USER || process.env.USERNAME.toLowerCase()
        }
        this.commands = this.loadCommands();

        fs.watch(path.join(__dirname, "commands"), (eventType, filename) => {
           // console.log("CHANGE! UPDATING COMMANDS")
            this.commands = [];
            this.requireUncached(path.join(__dirname, `commands/${filename}`))
            this.commands = this.loadCommands();
           
        })


        //console.log(this.commands)
        this.pwd = `/`
        this.prompt = "";
        this.fs = fs;
        this.path = path;
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
                    if(result.length == 0) {
                         console.log("Nothing?")
                        break;
                    }
                    const parsed = result[0];
                    const findcmd = this.commands.filter((com) => com.name == parsed.command);
                    if(findcmd.length == 0) {
                         console.log("Command not found!", parsed)
                        break;
                    }
                    const foundCmd = findcmd[0];
                    //console.log(this.commands.filter((com) => com.name == parsed.command));
                    
                    const runCmd = foundCmd.cmd.call(this, ...parsed.args)
                    console.log(runCmd);
                    break;
                    //console.log(result);


                    break;
            }
            this.rl.prompt();
        }).on('close', () => {
           // console.log()
            console.log('Cya later!');
            process.exit(0);
        });


    }

     requireUncached(module){
        delete require.cache[require.resolve(module)]
        return require(module)
    }

    loadCommands() {
        
        const arr = [];
        cmdsDir.forEach((cmd) => {
            arr.push({
                name: cmd.replace(".js", ""),
                file: `commands/${cmd}`,
                cmd: require(path.join(__dirname, `commands/${cmd}`))
            })
        })
        return arr;
        
    }

    changePWD(pwd) {
        this.pwd = pwd;
        this.setprompt();
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
                if(com.includes(`"`)) {
                    var parts = com.split(`"`).filter(str => str.trim().length > 0) 
                   // console.log(parts);
                } else {
                    var parts = com.split(/\s/g);
                }

             
                
                const command = parts[0].trim();
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