console.log('DAY 12');
const input = "input_12.txt";
const output = document.getElementById('export');

let shipDirection = 'E';

let shipPosition = {
  N: 0,
  E: 0,
  S: 0,
  W: 0
};

let wayPoint = {
  N: 1,
  E: 10,
  S: 0,
  W: 0
};

const turns = {
  N: {
    L: 'W',
    R: 'E'
  },
  E: {
    L: 'N',
    R: 'S'
  },
  S: {
    L: 'E',
    R: 'W'
  },
  W: {
    L: 'S',
    R: 'N'
  }
};

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  const inputData = data.split('\n').map((x)=>[x.slice(0,1),+x.slice(1)]);
  // console.log(inputData);

  // STEP A
  inputData.forEach(instruction => {
    let insDir = instruction[0];
    let insAmount = instruction[1];
    let turnAmount = 0;

    switch (insDir) {
      case 'L':
        turnAmount = insAmount/90;
        for (let idx=0; idx<turnAmount; idx++)
        {
          shipDirection = turns[shipDirection].L;
        }
        break;
    
      case 'R':
        turnAmount = insAmount/90;
        for (let idx=0; idx<turnAmount; idx++)
        {
          shipDirection = turns[shipDirection].R;
        }
        break;
    
      case 'F':
        shipPosition[shipDirection] += insAmount;
        break;
    
      case 'N':
        shipPosition.N += insAmount;
        break;
    
      case 'S':
        shipPosition.S += insAmount;
        break;
    
      case 'E':
        shipPosition.E += insAmount;
        break;
    
      case 'W':
        shipPosition.W += insAmount;
        break;
    
      default:
        break;
    }
  });

  let NSDist = Math.abs(shipPosition.N-shipPosition.S);
  let EWDist = Math.abs(shipPosition.E-shipPosition.W);

  console.log('[A] Manhattan: '+(NSDist+EWDist));

  shipPosition = {
    N: 0,
    E: 0,
    S: 0,
    W: 0
  };

  shipDirection = 'E';

  // STEP B
  inputData.forEach(instruction => {
    let insDir = instruction[0];
    let insAmount = instruction[1];
    let turnAmount = 0;

    switch (insDir) {
      case 'L':
        turnAmount = insAmount/90;
        for (let idx=0; idx<turnAmount; idx++)
        {
          let newPoint = {
            N: wayPoint[turns.N.R],
            E: wayPoint[turns.E.R],
            S: wayPoint[turns.S.R],
            W: wayPoint[turns.W.R]
          }
          // console.log(newPoint);
          // console.log(wayPoint);
          wayPoint = {...newPoint};
        }
        break;
    
      case 'R':
        turnAmount = insAmount/90;
        for (let idx=0; idx<turnAmount; idx++)
        {
          let newPoint = {
            N: wayPoint[turns.N.L],
            E: wayPoint[turns.E.L],
            S: wayPoint[turns.S.L],
            W: wayPoint[turns.W.L]
          }
          // console.log(newPoint);
          // console.log(wayPoint);
          wayPoint = {...newPoint};
        }
        break;
    
      case 'F':
        shipPosition = {
          N: shipPosition.N+(wayPoint.N*insAmount),
          E: shipPosition.E+(wayPoint.E*insAmount),
          S: shipPosition.S+(wayPoint.S*insAmount),
          W: shipPosition.W+(wayPoint.W*insAmount),
        }
        break;
    
      case 'N':
        wayPoint.N += insAmount;
        break;
    
      case 'S':
        wayPoint.S += insAmount;
        break;
    
      case 'E':
        wayPoint.E += insAmount;
        break;
    
      case 'W':
        wayPoint.W += insAmount;
        break;
    
      default:
        break;
    }
  });

  NSDist = Math.abs(shipPosition.N-shipPosition.S);
  EWDist = Math.abs(shipPosition.E-shipPosition.W);

  console.log('[B] Manhattan: '+(NSDist+EWDist));

}