console.log('DAY 05');
const input = "input_05.txt";
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
  let passes = data.split('\n');
  let highest = 0;
  let seats = Array();

  passes.forEach(pass => {
    let rowSeq = pass.slice(0,7).split('').map(val => val==='F'?0:1).join('');
    let colSeq = pass.slice(-3).split('').map(val => val==='R'?1:0).join('');
    let row = (binarySearch(0,127,rowSeq));
    let col = (binarySearch(0,7,colSeq));
    let seatId = row*8+col;
    seats.push(seatId);
    highest = Math.max(highest, seatId);
  });
  seats.sort((a,b) => a-b);

  let onlySeat = seats.filter(function (val, index)
  {
    return (index<seats.length-2 && seats[index+1]-val===2);
  });

  console.log(highest);
  console.log(onlySeat[0]+1);

}

function binarySearch(min, max, sequence)
{
    let side = sequence.substring(0,1);
    if (side == 0)
    {
      max -= Math.round((max-min)/2);
      // console.log('lower: '+min+'-'+max);
      if (sequence.substring(1).length === 0)
      {
        return min;
      }
    }
    else
    {
      min += Math.round((max-min)/2);
      // console.log('upper: '+min+'-'+max);
      if (sequence.substring(1).length === 0)
      {
        return max;
      }
    }
    return binarySearch(min, max, sequence.substring(1))
}