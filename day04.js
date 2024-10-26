console.log('DAY 04');
const input = "input_04.txt";
const output = document.getElementById('export');

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
const optionFields = ['cid'];

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  let passports = data.split('\n\n');

  let passportsClean = passports.map(function(val)
  {
    let cleaned = val.split(' ');
    cleaned = cleaned.map(elem => elem.split('\n'));
    cleaned = cleaned.flat();
    cleaned = cleaned.map(elem => elem.split(':'));
    let cleanMap = new Map();
    cleaned.forEach(elem => {
      cleanMap.set(elem[0], elem[1]);
    });
    return cleanMap;
  })

  let validPassports = passportsClean.filter(function(pass)
  {
    let valid = false;
    if (pass.size === (requiredFields.length+optionFields.length))
    {
      let validCount = 0;
      pass.forEach(function(fieldData, field)
      {
        validCount += checkValidField(field, fieldData)?1:0;
      });
      valid = validCount === requiredFields.length+optionFields.length;
    }
    else
    {
      let reqFound = requiredFields.filter(val => pass.has(val));
      if(reqFound.length===requiredFields.length)
      {
        let validCount = 0;
        pass.forEach(function(fieldData, field)
        {
          validCount += checkValidField(field, fieldData)?1:0;
        });
        valid = validCount === requiredFields.length;
      }
    }
    return valid;
  });

  console.log(validPassports.length);
}

function checkValidField(field, fieldData)
{
  let output = false;
  switch (field) {
    case 'byr':
      output = (fieldData >= 1920 && fieldData <= 2002);
      break;
    case 'iyr':
      output = (fieldData >= 2010 && fieldData <= 2020);
      break;
    case 'eyr':
      output = (fieldData >= 2020 && fieldData <= 2030);
      break;
    case 'hgt':
      const unit = fieldData.slice(-2);
      const value = fieldData.slice(0,-2);
      if (unit === 'cm')
      {
        output = (value >= 150 && value <= 193);
      }
      else if (unit === 'in')
      {
        output = (value >= 59 && value <= 76);
      }
      break;
    case 'hcl':
      const RegExp = /^#[0-9A-F]{6}$/i;
      output = RegExp.test(fieldData);
      break;
    case 'ecl':
      const correctVals = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
      output = (correctVals.indexOf(fieldData) >= 0);
      break;
    case 'pid':
      output = (fieldData.length === 9);
      break;
    case 'cid':
      output = true;
      break;
    default:
      break;
  }
  return output;
}