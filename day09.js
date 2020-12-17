console.log('DAY 09');
const input = "input_09.txt";
const output = document.getElementById('export');
const preAmble = 25;
let fault = 0;

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  const input = data.split('\n').map((x) => +x);
  
  let sums = Array();
  let valid = true;

  for (let index = preAmble; index<input.length && valid; index++)
  {
    sums = Array();
    const toCheck = input[index];
    const filtered = input.slice(index-preAmble, index);
    // console.log(index+": "+toCheck+" > "+preAmble+" ~ "+(index-preAmble));
    // console.log(filtered);
    filtered.forEach((element, idx) => {
      for (let counter=0; counter<filtered.length; counter++)
      {
        if (counter!=idx)
        {
          sums.push(element+filtered[counter]);
        }
      }
    });

    if (sums.indexOf(toCheck) < 0)
    {
      valid = false;
      console.log('Error with: '+toCheck);
      fault = toCheck;
    }
    // console.log('---');
  }

  if (valid)
  {
    console.error('No error found...');
  }

  let searching = true;

  for(let idx=0; idx<input.length && searching; idx++)
  {
    let counter = idx+1;
    let sum = input[idx];
    // console.log(idx+" : "+sum);

    while (sum < fault)
    {
      sum += input[counter];
      // console.log(sum);
      counter++;
    }
    // console.log('---');

    if (sum === fault)
    {
      let set = input.slice(idx, counter);
      set.sort((a,b)=>a-b);
      console.log(set);
      console.log(set.reduce((a,b)=>a+b));
      let minimum = set[0];
      let maximum = set.pop();
      console.log(minimum+" - "+maximum);
      console.log("Weakness: "+(minimum+maximum));
      searching = false;
    }
  }
}