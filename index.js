const process = require('process');
const readline = require('readline');
const chalk = require("chalk");
const fs = require("fs")
const path = require("path")
var cmdsDir = fs.readdirSync(path.join(__dirname, "commands"))

class PromptJS {
    constructor({commands}) {
        this.name = "PromptJS";
        this.version = "1.0";
        this.user = {
            username: process.env.USER || process.env.USERNAME.toLowerCase()
        }

        this.commands =  {};

        const fs = require("fs")
        const path = require("path")
       // console.log(__dirname)
        const cmdsDir = fs.readdirSync(path.join(__dirname, "commands"))
       // console.log(cmdsDir)
        cmdsDir.forEach((file) => {
            if(file.endsWith(".js")) {
                this.commands[file.replace(".js", "")] = require(`./commands/${file}`);
            }
        })
        
        Object.keys(commands).forEach((key) => {
            this.commands[key] = commands[key];
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

        this.rl.on('line', async (line) => {
            const cmd = line.trim();
            switch (line.trim()) {
                case '.quit':
                    console.log("Bye!")
                    return process.exit(0);
                    break;
                default:
                    const res = this.parseCmd(cmd)[0];
                 //   console.log(res);
                 try {
                     var r =  await this.run(res.command, res.args)
                 } catch(e) {
                    if(!e.status) {
                        return console.log(e.res)
                    }
                 }
                 
                 if(r.status) {
                    console.log(r.res)
                }

                   

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


    run(command, args) {
        return new Promise( async (resolve, reject) => {
          //  console.log(this.commands, command, args)
            if(!this.commands.hasOwnProperty(command)) {
                return reject(404);
            }
            const cmd = this.commands[command];
           

            var notType = [];
            if(args.length !== 0) { 
                if(cmd.hasOwnProperty('arguments')) { 
                    //console.log(this.commands.arguments)
                    if(cmd.arguments.hasOwnProperty('typeof')) {
                        
                        args = args.filter((arg, i) => {
                            if(typeof arg == cmd.arguments.typeof) {
                                return true;
                            } else {
                  //              console.log("not!", arg, i)
                                notType.push({arg, i, typeof: cmd.arguments.typeof});
                            }
                        })
                //        console.log("testing arguments", args);
                    } else if(typeof cmd.arguments[0] !== 'undefined') {
                        var newargs = {};
                        args.forEach((arg, i) => {
                            if(typeof arg == cmd.arguments[i].typeof) {
                                newargs[cmd.arguments[i].name] = arg;
                            } else {
                                notType.push({arg, i, typeof: cmd.arguments[i].typeof})
                            }
                            
                        })
                        args = newargs;
                    }
                }
            } else {
                
               // console.log("no arguments!")
            }
            //return;
            //console.log(args, notType);
            if(typeof notType !== 'undefined' && notType.length > 0) {
           //     console.log(notType);
                var warnmsg = "";
                notType.forEach((type) => {
                    warnmsg += `The argument at [${type.i}] in the command ${command} is not typeof ${type.typeof}. Given type ${typeof type.arg}.\n`                    
                })
                const warnings = `\`\`\` ${warnmsg} \`\`\``
                return reject({status: false, message: warnmsg})
                return this.send(warnmsg, msg.channel)
            }

            try {
               var res = await cmd.handler.call(this, args);
            } catch(e) {
                return reject({status: false, res: e});
            }
        //    console.log(res, cmd, "res")

            return resolve({status: true, res: res});

        });

    }
}

module.exports = PromptJS;