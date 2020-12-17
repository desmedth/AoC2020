console.log('DAY 11');
const input = "input_11-test.txt";
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
  const input = data.split('\n').map((x)=>x.split(''));
  console.log(input);
}