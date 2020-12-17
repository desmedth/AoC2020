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
    let programOriginal = data.split('\n').map( x => x.split(' '));
    console.log(programOriginal);
    let program = programOriginal.map(object => ({ ...object }));

    let index = 0;
    let programRunning = true;
    let lastCommand = "";
    let lastIndex = 0;
    let safety = 0;
    let totalSafety = 0;
    let executedCommands = new Map();
    let correctedIdx = Array();

    while(programRunning && totalSafety < 1000)
    {
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

                // let debugLine = safety+" : "+command+" ("+value+") > ACC: "+acc+" > IDX: "+index;
                // console.log(debugLine);
            }
            else
            {
                console.log('break inner while: '+totalSafety);
                programRunning = false;
            }
        }

        totalSafety++;

        if (programRunning)
        {
            console.log('program ended correct: '+totalSafety);
            programRunning = false;
        }
        else
        {
            console.log('trace error code');
            // console.log(executedCommands);
            let executed = executedCommands.keys();
            let command = executed.next();
            let found = false;

            while(!command.done && !found)
            {
                let correctingIdx = command.value;
                if(program[correctingIdx][0] === 'jmp' || program[correctingIdx][0] === 'nop')
                {
                    if(correctedIdx.indexOf(correctingIdx) < 0)
                    {
                        console.log('change portion @ '+correctingIdx);
                        correctedIdx.push(correctingIdx);
                        program = programOriginal.map(object => ({ ...object }));
                        found = true;
                        programRunning = true;
                        acc = 0;
                        safety = 0;
                        index = 0;
                        executedCommands = new Map();
                        if(program[correctingIdx][0] === 'jmp')
                        {
                            program[correctingIdx][0] = 'nop';
                        }
                        else
                        {
                            program[correctingIdx][0] = 'jmp';
                        }
                    }
                }
                command = executed.next();
            }

            if (!found)
            {
                console.log('reset program');
                program = programOriginal.map(object => ({ ...object }));
                found = true;
                programRunning = true;
                acc = 0;
                safety = 0;
                index = 0;
                executedCommands = new Map();
            }
            console.log(correctedIdx);
        }
    }

    console.log(programRunning+" - "+totalSafety+" ["+safety+"]");
    console.log(program);
    console.log(programOriginal);
    console.log('Stopped with acc @ '+acc);
}