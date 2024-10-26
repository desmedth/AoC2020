console.log('DAY 06');
const input = "input_06.txt";
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
  let forms = data.split('\n\n');

  let formsClean = forms.map(function(val)
  {
    let cleaned = val.split('\n');
    cleaned = cleaned.map(elem => elem.split(''));
    return cleaned;
  })

  let formsMapped = Array();
  let validFormsCount = 0;

  formsClean.forEach(function (element)
  {
    let formMap = new Map();

    element.forEach(form => {
      form.forEach(answer => {
        if (formMap.has(answer))
        {
          formMap.set(answer, formMap.get(answer)+1);
        }
        else
        {
          formMap.set(answer, 1);
        }
      })
    });

    formsMapped.push(formMap);

    let formValues = Array.from(formMap.values());
    let validQuestions = formValues.filter((x) => (x===element.length));
    validFormsCount += validQuestions.length;
  });

  let formsCount = Array();

  formsMapped.forEach(element => {
    let count = element.size;
    formsCount.push(count);
  });

  console.log(formsCount.reduce((x,y) => (x+y)));
  console.log(validFormsCount);
}