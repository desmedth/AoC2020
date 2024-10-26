console.log('DAY 14 - Docking Data');
const input = "input_14.txt";
const output = document.getElementById('export');

let memory = new Map();
let commands = new Array();

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  const inputData = data.split('\n').map(x => x.split(' = '));
  // console.log(inputData);
  let mask = new Array(36);

  inputData.forEach(input => {
    let command = {
      action: 'mem',
      location: 0,
      locationBit: new Array(36).fill(0),
      bitmask : new Array(36).fill(0),
      number: 0,
      mask: mask
    };

    if (input[0] === 'mask')
    {
      mask = input[1].trim().split('').map(x => +x);
    }
    else
    {
      let comTxt = input[0].split('[');
      command.action = comTxt[0].trim();
      command.location = +(comTxt[1].trim().slice(0,-1));
      command.locationBit = command.location.toString(2).padStart(36,0).split('').map((x)=>+x);
      command.number = +input[1];
      command.bitmask = command.number.toString(2).padStart(36,0).split('').map((x)=>+x);
      command.mask = mask;
      commands.push(command);
    }
  });

  commands.forEach(command => {
    if (command.action === 'mem')
    {
      let result = command.bitmask.map((bit, idx) => {
        if (!isNaN(command.mask[idx]))
        {
          return command.mask[idx];
        }
        return bit;
      });

      let memoryBank = {
        bitArray: result,
        bit: result.join(""),
        number: parseInt(result.join(''), 2)
      };

      memory.set(command.location, memoryBank);
    }
  });
  
  let memorySum = 0;

  memory.forEach(memBank => {
    memorySum += memBank.number;
  });

  console.log('[A] decoder v1 ~ Sum of all memorybanks: '+memorySum);
  // console.log(commands);
  // console.log(inputData);

  memory = new Map();

  commands.forEach(command => calculateLocations(command));

  memorySum = 0;

  memory.forEach(memBank => {
    memorySum += memBank.number;
  });

  console.log('[B] decoder v2 ~ Sum of all memorybanks: '+memorySum);
}

function writeToMemory(command, location)
{
  let memoryBank = {
    bitArray: command.bitmask,
    bit: command.bitmask.join(""),
    number: command.number
  };

  memory.set(location, memoryBank);
}

function calculateLocations(command)
{
  let location = command.locationBit.map((bit, idx) => {
    if (!isNaN(command.mask[idx]))
    {
      return command.mask[idx]===0?bit:1;
    }
    else
    {
      return 'X';
    }
  });

  let variance = location.join('').split('X').length-1;

  for (let index = 0; index < Math.pow(2, variance); index++) {
    let variant = (index.toString(2)).padStart(variance, 0).split('').map(x=>+x);
    let newLocation = [...location];

    variant.forEach(bit => {
      newLocation[newLocation.indexOf('X')] = bit;
    });

    writeToMemory(command, parseInt(newLocation.join(''), 2));
  }
}