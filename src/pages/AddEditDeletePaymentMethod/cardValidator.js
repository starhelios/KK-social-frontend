function cardnumberAmericanExpress(inputtxt) {
  var cardno = /^(?:3[47][0-9]{13})$/;
  if (inputtxt.match(cardno)) {
    return true;
  } else {
    return false;
  }
}

function cardnumberVisa(inputtxt) {
  var cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  if (inputtxt.match(cardno)) {
    return true;
  } else {
    return false;
  }
}

function cardnumberMasterCard(inputtxt) {
  var cardno = /^(?:5[1-5][0-9]{14})$/;
  if (inputtxt.match(cardno)) {
    return true;
  } else {
    return false;
  }
}

function cardnumberDiscover(inputtxt) {
  var cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  if (inputtxt.match(cardno)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  cardnumberAmericanExpress,
  cardnumberDiscover,
  cardnumberMasterCard,
  cardnumberVisa,
};
