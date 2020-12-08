console.log('DAY 08');
const input = "input_08.txt";
const output = document.getElementById('export');
let acc = 0;

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
    let program = data.split('\n').map( x => x.split(' '));
    // console.log(program);

    let index = 0;
    let programRunning = true;
    let lastCommand = "";
    let lastIndex = 0;
    let safety = 0;
    let totalSafety = 0;
    let executedCommands = new Map();

    while(programRunning && totalSafety < 25)
    {
        safety = 0;
        index = 0;
        lastCommand = "";
        lastIndex = 0;

        while(index >= 0 && index < program.length && programRunning && safety < 1000)
        {
            if (!executedCommands.get(index))
            {
                let commandLine = program[index];
                let command = commandLine[0];
                let value = +commandLine[1];

                switch (command) {
                    case "nop":
                        executedCommands.set(index, {command: command, value: value});
                        lastCommand = "nop";
                        lastIndex = index;
                        index++;
                        break;
                    case "acc":
                        executedCommands.set(index, {command: command, value: value});
                        acc += value;
                        index++;
                        break;
                    case "jmp":
                        executedCommands.set(index, {command: command, value: value});
                        lastCommand = "jmp";
                        lastIndex = index;
                        index += value;
                        break;
                    default:
                        break;
                }
                safety++;

                let debugLine = safety+" : "+command+" ("+value+") > ACC: "+acc+" > IDX: "+index;
                console.log(debugLine);
            }
            else
            {
                programRunning = false;
            }
        }

        totalSafety++;

        if (programRunning)
        {
            programRunning = false;
        }
        else
        {
            console.log("Need to change: "+lastCommand+" > "+lastIndex);
            programRunning = true;
            if (lastCommand === "jmp")
            {
                program[lastIndex] = "nop";
            }
            else
            {
                program[lastIndex] = "jmp";
            }
        }
    }

    console.log(programRunning+" - "+totalSafety+" ["+safety+"]");
    console.log(program);
    console.log('Stopped with acc @ '+acc);
}