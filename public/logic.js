let averageFeePercentage;
let rewardToken;
function getById(name) {
  return document.getElementById(name);
}
$("input.form-control").keyup(function(event) {
  // skip for arrow keys
  if (event.which >= 37 && event.which <= 40) return;

  // format number
  $(this).val(function(index, value) {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  });
});
function removeComma(number) {
  return number.replace(/,/g, "");
}
function calculateFeeInDollar() {
  let data = {};
  const daily = getById("dailyVolume").value;
  const averageFee = 0.1375;
  data.daily = parseInt(removeComma(daily));

  data.averageFee = averageFee;
  $.ajax({
    type: "post",
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    url: "/calculate",
    success: function(result) {
      averageFeePercentage = result;
      console.log("Dollar", result);
      getById("averageFeePercentage").innerText = validation(
        roundOff(result)
      ).toLocaleString();
    },
    error: function(error) {
      console.log("Some error");
    }
  });
}

function calculateRewardToken(rewardLoyaltyPer = 15) {
  let data = {};
  const stake = getById("numberOfStake").value;
  let loyaltyToken = getById("exampleFormControlSelect1");
  loyaltyToken = loyaltyToken.options[loyaltyToken.selectedIndex].value;
  data.stake = removeComma(stake);
  data.loyaltyToken = loyaltyToken;

  if (averageFeePercentage === null) {
    confirm("You miss average fee $. Reward per token need it.");
  }
  $.ajax({
    type: "post",
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    url: "/calculateToken",
    success: function(result) {
      rewardToken = result;
      console.log("Result", result);
      if (result === null) {
        getById("rewardToken").innerText = "No data";
      } else {
        getById("rewardToken").innerText = validation(
          roundOff(result)
        ).toLocaleString();
      }
    },
    error: function(error) {
      console.log("Some error");
    }
  });
}

function onSubmit() {
  let data = {};
  const holdingToken = getById("holdingToken").value;
  data.holdingToken = removeComma(holdingToken);
  console.log(holdingToken, rewardToken);
  if (
    holdingToken === "" ||
    rewardToken === undefined ||
    rewardToken === null ||
    rewardToken === 0
  ) {
    confirm("You may be missing some value.");
  }
  $.ajax({
    type: "post",
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    url: "/calculateTotalEarning",
    success: function(result) {
      getById("dailyCalc").innerHTML = roundOff(
        result.earnPerDay
      ).toLocaleString();
      getById("weeklyCalc").innerHTML = roundOff(
        result.earnPerWeek
      ).toLocaleString();
      getById("yearlyCalc").innerHTML = roundOff(
        result.earnPerMonth
      ).toLocaleString();
    },
    error: function(error) {
      console.log("Some error");
    }
  });
}

function roundOff(number) {
  if (number) {
    return parseFloat(number.toFixed(6));
  }
  return number;
}
function validation(number) {
  if (isNaN(number) || !isFinite(number) || number === undefined) {
    return "No result";
  }
  return number;
}
