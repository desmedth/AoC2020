let input = "input_01.txt";
let search = 2020;
let result = 0;

axios.get(input)
  .then(function (response) {
    performB(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  let numbers = data.split('\n').map(function(val, idx) { return +val; });
  let workData = [...numbers];
  workData.sort((a,b) => a-b)

  while (workData.length > 0)
  {
    let max = workData.pop();
    let newArr = workData.filter(number => (number <= search-max));
    if (newArr.length > 0)
    {
      let found = newArr.pop();
      result = found+max;
      if (result === search)
      {
        result = found*max;
        workData = [];
      }
      else
      {
        workData = workData.filter(number => (number > search-max));
      }
    }
  }
}

function performB(data)
{
  let numbers = data.split('\n').map(function(val, idx) { return +val; });
  let workData = [...numbers];
  workData.sort((a,b) => a-b)

  while (workData.length > 0)
  {
    let max = workData.pop();
    let newArr = workData.filter(val => val < search-max);

    if (newArr.length > 0)
    {
      while (newArr.length > 0)
      {
        let secMax = newArr.pop();
        let restArr = newArr.filter(val => val <= search-max-secMax);

        if (restArr.length > 0)
        {
          let found = newArr.pop();
          result = found + secMax + max;
          if (result === search)
          {
            result = found * secMax * max;
            workData = [];
            newArr = [];
          }
          else
          {
            newArr = newArr.filter(number => (number > search-max-secMax));
          }
        }
      }
    }
  }
  console.log(result);
}