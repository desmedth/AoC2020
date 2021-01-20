console.log('DAY 13 - Shuttle Search');
const input = "input_13.txt";
const output = document.getElementById('export');

let departure = 0;
let lines = Array();

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  const inputData = data.split('\n').map((x)=>x.split(','));

  departure = +inputData[0];
  let startingTimes = new Array();

  inputData[1].forEach((line, idx) => {
    let busLine = {
      departure: 0,
      stops: 0,
      available: true,
      number: 0,
      margin: idx
    };

    if (line === 'x')
    {
      busLine.available = false;
    }
    else
    {
      busLine.departure = +line;
      busLine.number = +line;
      startingTimes.push(+line);
    }

    lines.push(busLine);

  });

  let minimumWait = Infinity;
  let correctBus = {};

  lines.forEach(busLine => {
    let passes = Math.ceil(departure/busLine.departure);
    let arrival = passes * busLine.departure;

    if (arrival-departure < minimumWait)
    {
      minimumWait = arrival-departure;
      correctBus = busLine;
    }
  });

  // console.log(departure);
  // console.log(lines);
  // console.log(minimumWait);
  console.log('[A] Busline: '+correctBus.number+' ~ Delay-ident: '+ (minimumWait*correctBus.number));

  // B ???

  let t = 0, step = 1;

  lines.forEach(line => {
    let safety = 0;
    // console.log(line);
    if (line.available)
    {
      while ( ( (t+line.margin) % line.number ) != 0  && safety < 10000)
      {
        t += step;
        safety++;
      }
      // console.log("S: "+safety);
      step *= line.number;
    }
  });

  console.log('[B] Timeslot that fits rules: '+t);
}