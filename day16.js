console.log('DAY 16 - Ticket Translation');
const input = "input_16.txt";
const output = document.getElementById('export');

const ranges = new Array();
const rangesInfo = new Array();
const validRanges = new Array();

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  const inputData = data.split('\n\n').map(x => x.split('\n'));
  // console.log(inputData);

  let rules = inputData[0].map(x => x.split(': '));
  let ticket = inputData[1][1].split(',').map(x => +x);
  inputData[2].splice(0,1);
  let otherTickets = inputData[2].map(x => x.split(',').map(y => +y));

  // SECTION: RULES CLEARING
  rules.forEach(line => {
    let rangeInfo = {
      desc: line[0],
      range: new Array(),
      validFields: new Map()
    };
    line[1] = line[1].split(' or ');
    line[1] = line[1].map(x => x.split('-').map(y => +y));
    line[1].forEach(range => {
      ranges.push(range);
      rangeInfo.range.push(range);
    });

    rangesInfo.push(rangeInfo);
  });

  // console.log(rangesInfo);

  ranges.forEach(range => {
    if (validRanges.length === 0)
    {
      validRanges.push([...range]);
    }
    else
    {
      let min = range[0];
      let max = range[1];
      let newAdd = true;
      validRanges.forEach(valid => {
        let checkMinToMin = min<=valid[0];
        let checkMinToMax = min<=valid[1];

        let checkMaxToMin = max>=valid[0];
        let checkMaxToMax = max>=valid[1];

        if (checkMinToMin && checkMinToMax && checkMaxToMin)
        {
          // console.log(min+'-'+max+' : '+checkMinToMin+'~'+checkMinToMax+'~'+checkMaxToMin+'~'+checkMaxToMax);
          valid[0] = min;
          newAdd = false;
        }
        if (checkMaxToMin && checkMaxToMax && checkMinToMax)
        {
          valid[1] = max;
          newAdd = false;
        }

      });

      if (newAdd)
      {
        validRanges.push([...range]);
      }
    }    
  });

  for (let index = 0; index < validRanges.length-1; index++) {
    const current = validRanges[index];
    const next = validRanges[index+1];

    if (current[1] === next[0]-1)
    {
      current[1] = next[1];
      validRanges.splice(index+1,1);
      index--;
    }
    else if (current[0] <= next[0] && next[1] <= current[1])
    {
      validRanges.splice(index+1,1);
      index--;
    }
  }
  // console.log(validRanges);

  // SECTION CHECK OTHER TICKETS
  let invalids = new Array();
  let validTickets = new Array();

  otherTickets.forEach(single => {
    let invalidTicket = false;
    single.forEach(numero => {
      if (!checkValidNumber(numero))
      {
        invalids.push(numero);
        invalidTicket = true;
      }
    });

    if (!invalidTicket)
    {
      validTickets.push(single);
    }
  });

  console.log('[A] Ticket error scanning rate: '+invalids.reduce((acc, cur) => acc+cur));

  // SECTION CRUNCH THE FIELDS
  validTickets.forEach(single => {
    single.forEach((numero, idx) => {
      rangesInfo.forEach(range => {
        range.range.forEach(singleRange => {  
          if (checkInRange(singleRange[0], singleRange[1], numero))
          {
            if (range.validFields.get(idx))
            {
              range.validFields.set(idx, range.validFields.get(idx)+1);
            }
            else
            {
              range.validFields.set(idx, 1);
            }
          }
        });
      });
    });
  });

  rangesInfo.forEach(field => {
    field.validFields.forEach((val, key) => {
      if (val < validTickets.length)
      {
        field.validFields.delete(key);
      }
    });
  });

  let count = 0;
  rangesInfo.forEach(field => {
    count+=field.validFields.size;
  });


  while (count > rangesInfo.length)
  {
    count = 0
    validateTicketFields();

    rangesInfo.forEach(field => {
      count+=field.validFields.size;
    });

    // console.log(count+' : '+rangesInfo.length);
  }

  // console.log(validTickets);
  // console.log(rangesInfo);

  let ticketValue = 1;

  rangesInfo.forEach(field => {
    if (field.desc.includes('departure'))
    {
      let correctField = field.validFields.keys().next().value;
      // console.log(ticket[correctField]);
      ticketValue *= ticket[correctField];
    }
  });

  // console.log(ticket);
  console.log('[B] Correct ticket value is '+ticketValue);

}

function validateTicketFields(chosen = -1)
{
  if (chosen === -1)
  {
    rangesInfo.forEach(field => {
      if (field.validFields.size === 1)
      {
        // console.log(field);
        validateTicketFields(field.validFields.keys().next().value);
      }
    })
  }
  else
  {
    rangesInfo.forEach(field => {
      if (field.validFields.size > 1)
      {
        field.validFields.delete(chosen);
      }
    });
  }
}

function checkValidNumber(numero)
{
  let valid = false;

  for (let idx = 0; idx < validRanges.length && !valid; idx++) {
    const range = validRanges[idx];
    valid = ( (numero >= range[0]) && (numero <= range[1]) );
  }

  return valid;
}

function checkInRange(min, max, numero)
{
  return ( (numero >= min) && (numero <= max) );
}