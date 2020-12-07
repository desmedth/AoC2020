console.log('DAY 02');
let input = "input_02.txt";
let output = document.getElementById('export');

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  let passes = data.split('\n').map(val => val.split(' '));
  console.log(passes);

  let correctA = passes.filter(element => {
    let limits = element[0].trim().split('-');
    let char = element[1].trim().slice(0,-1);
    let word = element[2].trim();
    return (validatePass(limits[0], limits[1], char, word));
  });

  let correctB = passes.filter(element => {
    let limits = element[0].trim().split('-');
    let char = element[1].trim().slice(0,-1);
    let word = element[2].trim();
    return (validatePassExtra(limits[0], limits[1], char, word));
  });

  console.log(correctB);

  output.innerHTML = 'A: '+correctA.length+'<br>B: '+correctB.length;
}

function validatePass(min, max, char, word)
{
  word.trim();
  let wordArr = word.split('');
  let occurs = wordArr.filter(val => val===char);
  return (occurs.length>=min && occurs.length<=max);
}

function validatePassExtra(min, max, char, word)
{
  word.trim();
  let wordArr = word.split('');
  let foundA = wordArr[min-1]===char?1:0;
  let foundB = wordArr[max-1]===char?1:0;
  return (foundA+foundB===1);
}