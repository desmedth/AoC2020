console.log('DAY 14 - Docking Data');
const input = "input_14-test.txt";
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
  const inputData = data.split('\n');
  console.log(inputData);
}