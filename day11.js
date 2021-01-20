console.log('DAY 11');
const input = "input_11.txt";
const output = document.getElementById('export');

const grid = new Array();
let changes = 1;
let safety = 0;


axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  const inputData = data.split('\n').map((x)=>x.split(''));
  
  inputData.forEach((row, x) => {
    let rowArray = new Array();
    row.forEach((element, y) => {
      let square = {
        seat:       false,
        ground:     true,
        neighBours: [],
        occupied:   false
      };

      if (element === 'L')
      {
        square.seat = true;
        square.ground = false;
        square.occupied = false;
      }
      else if (element === '#')
      {
        square.seat = true;
        square.ground = false;
        square.occupied = true;
      }

      for (let iX = -1; iX < 2; iX++)
      {
        for (let iY = -1; iY < 2; iY++)
        {
          if (x+iX >=0 && x+iX < inputData.length && y+iY >= 0 && y+iY < inputData[0].length)
          {
            if (x+iX != x || y+iY != y)
            {
              square.neighBours.push({x: x+iX, y: y+iY});
            }
          }
        }
      }
      rowArray.push(square);
    });
    grid.push(rowArray);
  });
  
  while (changes > 0 && safety < 100)
  {
    changes = 0;
    safety++;

    let tempGrid = cloneArray(grid);

    grid.forEach((row, x) => {
      row.forEach((element, y) => {
        calculateNeighboursB(x,y,tempGrid);
      });
    });

    // printGrid(grid);
    console.log('Run: '+safety+' > '+changes);
  }
  printGrid(grid);

  calculateOccupied();
}

function calculateNeighbours(x, y, calcGrid)
{
  // console.log("Calculate :"+"["+x+","+y+"]");
  let neighBours = calcGrid[x][y].neighBours;
  // console.log(neighBours);
  let empty = 0;
  let occupied = 0;

  neighBours.forEach(element => {
    let square = calcGrid[element.x][element.y];
    // console.log(square);
    if (square.seat && square.occupied)
    {
      occupied++;
    }
    else if (square.seat)
    {
      empty++;
    }
  });

  // console.log("Occ: "+occupied+" - Emp:"+empty);

  if (calcGrid[x][y].seat && !calcGrid[x][y].occupied && occupied === 0)
  {
    grid[x][y].occupied = true;
    // console.log("Occupy: "+x+","+y);
    changes++;
  }
  else if (calcGrid[x][y].seat && calcGrid[x][y].occupied && occupied >= 4)
  {
    grid[x][y].occupied = false;
    // console.log("Leave: "+x+","+y);
    changes++;
  }

}

function calculateNeighboursB(x, y, calcGrid)
{
  let height = calcGrid.length;
  let width = calcGrid[x].length;
  let occupied = 0;

  if(calcGrid[x][y].seat)
  {
    let found = {
      N: false,
      NE: false,
      E: false,
      SE: false,
      S: false,
      SW: false,
      W: false,
      NW: false
    };

    for (let step = 1; step <= height; step++)
    {
      const NW = (x-step >= 0 && y-step >= 0)?calcGrid[x-step][y-step]:false;
      const W = (y-step >= 0)?calcGrid[x][y-step]:false;
      const SW = (x+step < height && y-step >= 0)?calcGrid[x+step][y-step]:false;
      const N = (x-step >= 0)?calcGrid[x-step][y]:false;
      const NE = (x-step >= 0 && y+step < width)?calcGrid[x-step][y+step]:false;
      const E = (y+step < width)?calcGrid[x][y+step]:false;
      const SE = (x+step < height && y+step < width)?calcGrid[x+step][y+step]:false;
      const S = (x+step < height)?calcGrid[x+step][y]:false;
      
      if (NW && !found.NW && NW.seat)
      {
        found.NW = true;
        occupied += NW.occupied?1:0;
      }
      if (W && !found.W && W.seat)
      {
        found.W = true;
        occupied += W.occupied?1:0;
      }
      if (SW && !found.SW && SW.seat)
      {
        found.SW = true;
        occupied += SW.occupied?1:0;
      }
      if (N && !found.N && N.seat)
      {
        found.N = true;
        occupied += N.occupied?1:0;
      }
      if (NE && !found.NE && NE.seat)
      {
        found.NE = true;
        occupied += NE.occupied?1:0;
      }
      if (E && !found.E && E.seat)
      {
        found.E = true;
        occupied += E.occupied?1:0;
      }
      if (SE && !found.SE && SE.seat)
      {
        found.SE = true;
        occupied += SE.occupied?1:0;
      }
      if (S && !found.S && S.seat)
      {
        found.S = true;
        occupied += S.occupied?1:0;
      }
    }

    if (!calcGrid[x][y].occupied && occupied === 0)
    {
      grid[x][y].occupied = true;
      // console.log("Occupy: "+x+","+y);
      changes++;
    }
    else if (calcGrid[x][y].occupied && occupied >= 5)
    {
      grid[x][y].occupied = false;
      // console.log("Leave: "+x+","+y);
      changes++;
    }
  }
}

function printGrid(printable)
{
  printable.forEach(row => {
    let outputLine = '';
    row.forEach(square => {
      if (square.seat)
      {
        if (square.occupied)
        {
          outputLine += '#';
        }
        else
        {
          outputLine += 'o';
        }
      }
      else
      {
        outputLine += '.';
      }
    });
    console.log(outputLine);
  });
}

function cloneArray(cloneGrid)
{
  let len = cloneGrid.length;
  let copy = new Array(len);
  for (let i=0; i<len; ++i)
  {
    copy[i] = new Array(len);
    for (let j=0; j<len; j++)
    {
      copy[i][j] = {...cloneGrid[i][j]};
    }
  }

  return copy;
}

function calculateOccupied()
{
  let occupied = 0;

  grid.forEach(row => {
    row.forEach(square => {
      if (square.seat && square.occupied)
      {
        occupied++;
      }
    });
  });

  console.log(occupied);
}