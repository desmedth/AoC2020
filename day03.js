console.log('DAY 03');
let input = "input_03.txt";
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
  let trees = Array();
  let row = 0;
  let col = 0;
  let movement = Array(
    {row:  1,col:  1},
    {row:  1,col:  3},
    {row:  1,col:  5},
    {row:  1,col:  7},
    {row:  2,col:  1},
  );

  let map = data.split('\n').map(val => val.split(''));
  let slope = 
  {
    length: map.length,
    width:  map[0].length
  };

  movement.forEach(element => {
    row = 0;
    col = 0;
    let treeCount = 0;
    while (row < slope.length-element.row)
    {
      row += element.row;
      col += element.col;
  
      if (col >= slope.width)
      {
        col -= slope.width;
      }
      treeCount += map[row][col]==='#'?1:0;
    }
    trees.push(treeCount);
  });

  const reducer = (acc, curVal) => acc*curVal;

  console.log(trees.reduce(reducer));
}