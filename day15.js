console.log('DAY 15 - Rambunctious Recitation');
const input = "input_15.txt";
const output = document.getElementById('export');

const turns = 30000000;

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  const inputData = data.split('\n').map(x=> x.split(',').map(y=>+y));

  inputData.forEach(line => {
    let turn = 1;
    let game = new Map();
    let lastNumber = line[0];
    game.set(lastNumber, turn);

    for (let index = 1; index < line.length; index++) {
      const element = line[index];
      turn++;
      lastNumber = element;
      game.set(element, turn);
    }

    while (turn < turns)
    {
      turn++;

      if (!game.has(lastNumber))
      {
        game.set(lastNumber, turn-1);
      }

      let lastTurn = game.get(lastNumber);
      if (lastTurn === turn-1)
      {
        lastNumber = 0;
      }
      else
      {
        let tempLast = lastNumber;
        lastNumber = turn-1-game.get(lastNumber);
        game.set(tempLast, turn-1);
      }
    }

    console.log('[A] Number '+turns+': '+lastNumber);
  });
}