console.log('DAY 07');
const input = "input_07.txt";
const output = document.getElementById('export');
const search = "shiny gold";

let hasBeenChecked = new Map();
let level = 0;
let countValid = 0;

axios.get(input)
  .then(function (response) {
    performA(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function performA(data)
{
  let rules = data.split('\n');
  let ruleMap = new Map();

  rules.forEach(rule => {
    let ruleParts = rule.split(' ');
    let color = ruleParts[0]+" "+ruleParts[1];
    let ruleSet = new Map();

    for (let index = 2; index < ruleParts.length; index++) {
      const element = ruleParts[index];
      if (+element > 0)
      {
        ruleSet.set(ruleParts[index+1]+" "+ruleParts[index+2], +element);
        index = index+2;
      }
    }

    ruleMap.set(color, ruleSet);;
  });

  let sortRuleMap = new Map([...ruleMap.entries()].sort());
  console.log(sortRuleMap);

  let canContain = new Map();

  ruleMap.forEach( function(ruleSet, color)
  {
    if(ruleSet.has(search))
    {
      canContain.set(color, 1);
    }
  });

  let hasBeenChecked = new Map();

  ruleMap.forEach( function(ruleSet, color)
  {
    // console.log('Start rule line: '+color);
    let checkedColors = Array.from(hasBeenChecked.keys());
    if (checkedColors.indexOf(color) < 0)
    {
      level = 0;
      countValid += validSet(ruleMap, hasBeenChecked, ruleSet)?1:0;
    }
    else
    {
      countValid += hasBeenChecked.get(color);
    }
    // console.log('Result after rule line: '+countValid);
  });

  console.log(countValid);
  console.log(countBags(ruleMap, ruleMap.get(search))-1);
}

function validSet(ruleMap, hasBeenChecked, ruleSet)
{
  // console.log('Level: '+level);
  // console.log(ruleSet);
  let valid = false;

  if (ruleSet.size > 0)
  {
    let continuSearch = true;
    const colors = ruleSet.keys();
    let checkColor = colors.next();

    while( !checkColor.done && continuSearch && !valid)
    {
      // console.log('Checking: '+checkColor.value);
      if(checkColor.value === search)
      {
        // console.log('found');
        continuSearch = false;
        valid = true;
      }
      else if (hasBeenChecked.get(checkColor.value))
      {
        valid = hasBeenChecked.get(checkColor.value)===1;
      }
      else
      {
        // console.log('not found');
        if (ruleMap.get(checkColor.value))
        {
          // console.log('going down a branch');
          level++;
          valid = validSet(ruleMap, hasBeenChecked, ruleMap.get(checkColor.value));
          if (valid)
          {
            hasBeenChecked.set(checkColor.value, 1);
          }
          else
          {
            hasBeenChecked.set(checkColor.value, 0);
          }
        }
      }
      checkColor = colors.next();
    }
  }
  else
  {
    // console.log('return on branch');
    level--;
  }

  return valid;
}

function countBags(ruleMap, ruleSet)
{
  let totalBags = 1;
  ruleSet.forEach( function(count, color)
  {
    totalBags += count*countBags(ruleMap, ruleMap.get(color));
  });
  return totalBags;
}