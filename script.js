let request = new XMLHttpRequest();
let itemImagePath = "https://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/";
const questionStr = "Select the most expensive item (total gold cost)";
let parse;
let items;
let itemQuestions;
let answerHighestValue;
let answerIsCorrect;
let answerSubmitted;
let answerCorrect;
let itemKeys = [];
let itemKeyQuestions;
let score;
let question;
request.open(
  "GET",
  "https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json ",
  true
);

function updateQuestions(goNext) {
  let itemKeysShuffled = itemKeys;
  let valid = false;

  while (!valid) {
    removeInvalidItems(items, itemKeys);
    shuffle(itemKeysShuffled);
    itemKeyQuestions = itemKeysShuffled.slice(0, 4);
    itemQuestions = [
      items[itemKeyQuestions[0]],
      items[itemKeyQuestions[1]],
      items[itemKeyQuestions[2]],
      items[itemKeyQuestions[3]]
    ];
    valid = checkQuestionIsValid();
  }

  $("img.a1").attr(
    "src",
    `${itemImagePath}${items[itemKeyQuestions[0]].image.full}`
  );
  $("img.a2").attr(
    "src",
    `${itemImagePath}${items[itemKeyQuestions[1]].image.full}`
  );
  $("img.a3").attr(
    "src",
    `${itemImagePath}${items[itemKeyQuestions[2]].image.full}`
  );
  $("img.a4").attr(
    "src",
    `${itemImagePath}${items[itemKeyQuestions[3]].image.full}`
  );

  $("label.a1").html(items[itemKeyQuestions[0]].name);
  $("label.a2").html(items[itemKeyQuestions[1]].name);
  $("label.a3").html(items[itemKeyQuestions[2]].name);
  $("label.a4").html(items[itemKeyQuestions[3]].name);
}

function checkQuestionIsValid() {
  let valid = true;
  let highestValue = 0;
  for (let i = 0; i < 4; ++i) {
    let gold = items[itemKeyQuestions[i]].gold.total;
    if (gold == highestValue) {
      //dont allow questions with 2 of the same answer
      valid = false;
    }
    if (gold > highestValue) {
      highestValue = gold;
    }
  }

  return valid;
}

function showResult() {
  question++;
  let name = items[itemKeyQuestions[answerCorrect]].name;
  let gold = items[itemKeyQuestions[answerCorrect]].gold.total;
  $("div.result").show();

  if (answerIsCorrect) {
    score++;
    $("#question").text(
      `Correct! ${name} has the highest value at ${gold} total cost.`
    );

    $("#question").addClass("correct");
  } else {
    $("#question").text(
      `Not Correct. ${name} has the highest value at ${gold} total cost.`
    );
    $("#question").addClass("incorrect");
  }

  document.getElementById("score").textContent = `Score: ${score}/${question}`;

  $("label.a1").html(
    items[itemKeyQuestions[0]].name +
      " (" +
      items[itemKeyQuestions[0]].gold.total +
      ")"
  );
  $("label.a2").html(
    items[itemKeyQuestions[1]].name +
      " (" +
      items[itemKeyQuestions[1]].gold.total +
      ")"
  );
  $("label.a3").html(
    items[itemKeyQuestions[2]].name +
      " (" +
      items[itemKeyQuestions[2]].gold.total +
      ")"
  );
  $("label.a4").html(
    items[itemKeyQuestions[3]].name +
      " (" +
      items[itemKeyQuestions[3]].gold.total +
      ")"
  );
}

function resetQuestion() {
  $("div.result").hide();
  //$( "div.question" ).show();
  $('input[type="radio"]').show();
  $("#submit").show();
  $("#question").text(questionStr);
  $("#question").removeClass("correct incorrect");
  //$("#question").removeClass("incorrect");
  updateQuestions();
}

function calculateCorrectAnswer() {
  let answerSubmittedValue;
  answerIsCorrect = true;
  answerSubmitted = $("input[name=answer]:checked").attr("data");
  answerCorrect = answerSubmitted;
  answerSubmittedValue = items[itemKeyQuestions[answerSubmitted]].gold.total;

  answerHighestValue = answerSubmittedValue;
  for (let i = 0; i < 4; ++i) {
    if (items[itemKeyQuestions[i]].gold.total > answerHighestValue) {
      answerIsCorrect = false;
      answerCorrect = i;
      answerHighestValue = items[itemKeyQuestions[i]].gold.total;
    }
  }

  console.log(answerSubmitted);
}

function submitAnswer() {
  if ($("input[name=answer]:checked").length > 0) {
    calculateCorrectAnswer();
    $('input[type="radio"]').prop("checked", false);
    $('input[type="radio"]').hide();
    $("#submit").hide();
    showResult();
  }
}

function removeInvalidItems(items, keys) {
  let mapSummonersRift = 11;
  let remove;
  for (let i = keys.length - 1; i >= 0; --i) {
    remove = false;
    if (!items[keys[i]].maps[mapSummonersRift]) {
      console.log(`${items[keys[i]].name}: removed (non-summoners rift)`);
      remove = true;
    } else if (!items[keys[i]].gold.purchasable) {
      console.log(`${items[keys[i]].name}: removed (not buyable)`);
      remove = true;
    } else if (items[keys[i]].gold.total <= 0) {
      console.log(`${items[keys[i]].name}: removed (no gold value)`);
      remove = true;
    }

    if (remove) {
      keys.splice(i, 1);
    }
  }
}

function shuffle(array) {
  for (var i = array.length; i > 1; i--) {
    var r = Math.floor(Math.random() * i);
    var temp = array[r];
    array[r] = array[i - 1];
    array[i - 1] = temp;
  }
}

request.onload = function() {
  parse = JSON.parse(this.response);
  items = parse.data;
  score = 0;
  question = 0;
  //console.log(Object.keys(items));

  Object.keys(items).forEach(key => {
    itemKeys.push(key);
    let itemStr = `${items[key].name} : ${items[key].gold.total}`;
  });

  //$( "#button" ).html( "Next Step..." ) //ID selector, selecting id "button"
  $("#submit").click(submitAnswer);
  $("#log").click(() => console.log(parse));
  //items.forEach(function(element) {
  //    console.log(element.name);
  //});

  updateQuestions();

  console.log(itemImagePath);
};

$(document).ready(function() {
  $("div.result").hide();
  $("#next").click(resetQuestion);
  $("#question").text(questionStr);
});

request.send();
