console.log('DAY 17 - Conway Cubes');
const input = "input_17-test.txt";
const output = document.getElementById('export');

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  const inputData = data.split('\n').map(x => x.split(''));
  console.log(inputData);

  let dimension = new Map();

  for (let x = 0; x < inputData.length; x++) {
    const row = inputData[x];
    for (let y = 0; y < row.length; y++) {
      const element = row[y];
      dimension.set(x+','+y+',0', element==='.'?0:1);
    }
  }

  let run = 1;
  const countNeighbours = (x,y,z,dimMap) => {
    let count = 0;

    for (let a = -1; a < 2; a++) 
    {
      for (let b = -1; b < 2; b++) 
      {   
        for (let c = -1; c < 2; c++) 
        {   
          if (a === 0 && b === 0 && c === 0)
          {
          }
          else
          {
            let coord = (x+a)+','+(y+b)+','+(z+c);
            if (dimMap.get(coord))
            {
              count += dimMap.get(coord)===1?1:0;
            }
          }
        }
      }
    }

    return count;
  };

  while (run < 6)
  {
    let oldMap = new Map(dimension);

    if (run === 1)
    {
      for (let z=-1; z<2; z++)
      {
        for (let x=0; x<inputData.length; x++)
        {
          for (let y=0; y<inputData.length; y++)
          {
            let activeNeighs = countNeighbours(x, y, z, dimension);
            let coord = x+','+y+','+z;
            if (dimension.get(coord))
            {
              let active = oldMap.get(coord);
              if (active === 1 && (activeNeighs < 2 || activeNeighs > 3))
              {
                dimension.set(coord, 0);
              }
              else if (active === 0 && activeNeighs === 3)
              {
                dimension.set(coord, 1);
              }
            }
            else
            {
              if (activeNeighs === 3)
              {
                dimension.set(coord, 1);
              }
              else
              {
                dimension.set(coord, 0);
              }
            }
          }
        }
      }
    }

    run++;
  }

  console.log(dimension);
  printMap(dimension);
}

function printMap(map)
{
  for (let z=-1; z<2; z++)
  {
    console.log('Z = '+z);
    for (let x=0; x<3; x++)
    {
      let line = '';
      for (let y=0; y<3; y++)
      {
        let coord = x+','+y+','+z;
        // console.log(coord);
       line += (map.get(coord)===1?'#':'.');
      }
      console.log(line);
    }
  }
}