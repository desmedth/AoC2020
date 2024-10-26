console.log('DAY 10');
const input = "input_10.txt";
const output = document.getElementById('export');

let joltDifs = [0,0,0];

const startJolt = 0;
let maxJolt = 0;
let deviceJolt = 0;
let lastJolt = 0;
let possibleBuilds = 0;
let level = 1;

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  const input = data.split('\n').map((x)=>+x).sort((a,b) => a-b);

  maxJolt = input[input.length-1];
  deviceJolt = maxJolt+3;

  console.log(input);
  console.log(maxJolt+" - "+deviceJolt);

  let lastJolt = input[0];

  if (lastJolt - startJolt > 3)
  {
    console.error('Wrong start');
  }
  else
  {
    let diff = lastJolt-startJolt;
    joltDifs[diff-1]++;

    let valid = true;
    for(let idx = 1; idx < input.length && valid; idx++)
    {
      const newJolt = input[idx];

      if (newJolt-lastJolt > 3)
      {
        valid = false;
        console.error('Gap to wide');
      }
      else
      {
        diff = newJolt-lastJolt;
        joltDifs[diff-1]++;
        lastJolt = newJolt;
      }
    }
  }
  joltDifs[2]++;

  console.log(joltDifs);
  console.log('Jolt grader: '+joltDifs[0]*joltDifs[2]);
  checkPossibleConnection(input);
}

function checkPossibleConnection(jolts)
{
  let joltsSorted = jolts.sort((a,b)=>a-b);
  joltsSorted.push(deviceJolt);

  const calced = {};

  function findPaths(node, availableJolts)
  {
    if (node === deviceJolt)
    {
      return 1;
    }

    let countWays = 0;
    for (let i=1; i<4; i++)
    {
      if (availableJolts.includes(node+i))
      {
        const remainingPaths = availableJolts.filter((x) => (x > node+i));
        if (calced[node+i] == null)
        {
          calced[node+i] = findPaths(node+i, remainingPaths);
        }
        countWays += calced[node+i]
      }
    }

    return countWays;
  }

  console.log("Possible paths: "+findPaths(0, joltsSorted));
}