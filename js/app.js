/**************************************
GENERAL PURPOSE
**************************************/
// Ensure a value is both present and valid; returns object
const testValue = (value, regex) => {
  let test = {};
  test.hasValue = value !== '';
  if (regex) test.valid = regex.test(value);
  return test;
}

// Determine proper colors to display based on design, then fade in '#color' menu
const loadColors = design => {
  const designIsPuns = design === 'js puns';
  $('#color').children().each((i, tshirtColor) => {
    const colorIsPuns = $(tshirtColor).text().indexOf('JS Puns') >= 0;
    const match = (colorIsPuns === designIsPuns) || ($(tshirtColor).val() === '');
    ( match ? $(tshirtColor).show(): $(tshirtColor).hide() );
  });
  $('#color').val('');
  $('#colors-js-puns').fadeIn(300);
}

// Divide class string into the proper info; returns an object
const getClassInfo = classString => {
  const dayAndTime = classString.match(/([a-z]+)\s([1-9]+[ap]m)/i);
  let day, time;
  if (dayAndTime !== null) [, day, time] = dayAndTime;
  const price = Number(classString.match(/\$([0-9]{3})$/)[1]);
  return {day, time, price};
}

//
const formatClass = (classNode, allow) => {
  if (!allow) {
    $(classNode).css('color', 'grey');
    $(classNode.firstChild).css('visibility', 'hidden');
  } else {
    $(classNode).css('color', 'black');
    $(classNode.firstChild).css('visibility', 'visible');
  }
}

// Show conflicting activities as available or unavailable depending whether user selects and unselects a class
const toggleActivities = (classInfo, toggle) => {
  const classes = $('.activities').children();
  if (classInfo.day === 'Tuesday' && classInfo.time === '9am') {
    if (toggle === 'allow') {
      formatClass(classes[2], true);
      formatClass(classes[4], true);
    } else if (classes[2].firstChild.checked) formatClass(classes[4], false);
    else formatClass(classes[2], false);
  } else if (classInfo.day === 'Tuesday' && classInfo.time === '1pm') {
    if (toggle === 'allow') {
      formatClass(classes[3], true);
      formatClass(classes[5], true);
    } else if (classes[3].firstChild.checked) formatClass(classes[5], false);
    else formatClass(classes[3], false);
  }
}

// Add or subtract an activity's price from the total
const calculateTotalPrice = (activityPrice, operation) => {
  const currentPrice = Number($('.price').text());

  if (operation === '+') $('.price').text( currentPrice + activityPrice );
  else $('.price').text( currentPrice - activityPrice );
}

// Upon class selection, calculate price change and disallow activities at conflicting times
const configureSchedule = $element => {
  const classInfo = getClassInfo($element.parent().text());
  if ($element.prop('checked')) {
    toggleActivities(classInfo, 'disallow');
    calculateTotalPrice(classInfo.price, '+');
  } else {
    toggleActivities(classInfo, 'allow');
    calculateTotalPrice(classInfo.price, '-');
  }
}

// Reset payment display, then load the proper div
const loadPaymentMethod = $paymentMenu => {
  $paymentMenu.parent().children('div').each((i, element) => $(element).hide());
  $('#credit-card').children('div').each((i, div) => errorHandler($(div).children('input'), false) );
  $('#credit-card').children('select').each((i, select) => errorHandler($(select), false) );

  if ($paymentMenu.val() === 'credit card') $('#credit-card').fadeIn(300);
  else if ($paymentMenu.val() === 'paypal') $('#paypal').fadeIn(300);
  else if ($paymentMenu.val() === 'bitcoin') $('#bitcoin').fadeIn(300);
}

// Assigns to removes an error from a given element
const errorHandler = ($element, turnOn, message) => {
  if ($element.next().attr('class') === 'error-message') $element.next().remove();

  if (turnOn) {
    $element.addClass('error');
    if (message) {
      const $label = $(`<label class="error-message"></label>`);
      $label.text(message);
      $element.after($label);
    }
  } else $element.removeClass('error');
}



/**************************************
FORM VALIDATION
**************************************/

// Tests 'name' field's value, throws error on a bad match
const validateName = $nameField => {
  const regex = /^[a-z]+\s+[a-z]+\s*$/i;
  const test = testValue($nameField.val(), regex);
  if (!test.hasValue) errorHandler($nameField, true, 'Enter your first and last name above');
  else if (!test.valid) errorHandler($nameField, true, 'Enter your first and last name, letters only with a space');
  else errorHandler($nameField, false);
}

// Tests 'email' field's value, throws error on a bad match
const validateEmail = $emailField => {
  const regex = /^[a-z0-9\._]+@[a-z]+\.[a-z]+$/i;
  const test = testValue($emailField.val(), regex);
  if (!test.hasValue) errorHandler($emailField, true, 'Enter your email address above');
  else if (!test.valid) errorHandler($emailField, true, 'Email format: someone@example.com');
  else errorHandler($emailField, false);
}

// Tests 'title' menu's value, throws error if no value given. Loads 'other-title' when needed.
const validateTitle = $titleMenu => {
  const test = testValue($titleMenu.val());
  if (!test.hasValue) errorHandler($titleMenu, true, 'Select your job title');
  else errorHandler($titleMenu, false);
  if ($titleMenu.val() === 'other') $('#other-title').fadeIn(300);
  else {
    errorHandler($('#other-title'), false);
    $('#other-title').hide();
  }
}

// Tests 'other-title' field's value, throws error if no value given
const validateOtherTitle = $otherTitleField => {
  const test = testValue($otherTitleField.val());
  if (!test.hasValue) errorHandler($otherTitleField, true, 'Enter your title above');
  else errorHandler($otherTitleField, false);
}

// Tests 'size' menu's value, throws error if no value given
const validateSize = $sizeMenu => {
  const test = testValue($sizeMenu.val());
  if (!test.hasValue) errorHandler($sizeMenu, true);
  else errorHandler($sizeMenu, false);
}

// Tests 'design' menu's value, throws error if no value given. Loads 'color' when needed.
const validateDesign = ($designMenu, newColors) => {
  const test = testValue($designMenu.val());
  if (!test.hasValue) {
    errorHandler($designMenu, true);
    $('#colors-js-puns').hide();
  } else {
    errorHandler($designMenu, false);
    if (newColors) loadColors($designMenu.val());
  }
}

// Tests 'color' menu's value, throws error if no value given
const validateColor = $colorMenu => {
  const test = testValue($colorMenu.val());
  if (!test.hasValue) errorHandler($colorMenu, true);
  else errorHandler($colorMenu, false);
}

// Ensures at least one activity is selected, throws error if none have been chosen
const validateActivities = $activitiesDiv => {
  let nothingChecked = true;
  $activitiesDiv.children('label').each((i, label) => {
    if (label.firstChild.checked) nothingChecked = false;
  });
  if (nothingChecked) {
    $('.activities legend').addClass('error-message').text('Register for at least one activity');
  } else {
    $('.activities legend').removeClass('error-message').text('Register for Activities');
  }
}

// Tests 'payment' menu's value, throws error if no value given. Loads proper payment method.
const validatePayment = ($paymentMenu, newMethod) => {
  const test = testValue($paymentMenu.val());
  if (!test.hasValue) errorHandler($paymentMenu, true, 'Select your payment method above');
  else errorHandler($paymentMenu, false);
  if (newMethod) loadPaymentMethod($paymentMenu);
}

// Tests 'cc-num' field's value, throws error on a bad match
const validateCCN = $ccnField => {
  const regex = /^\d{13,16}$/;
  const test = testValue($ccnField.val(), regex);
  if (!test.hasValue) errorHandler($ccnField, true, 'Enter your credit card number above');
  else if (!test.valid) errorHandler($ccnField, true, 'Enter 13-16 digits');
  else errorHandler($ccnField, false);
}

// Tests 'zip' field's value, throws error on a bad match
const validateZip = $zipField => {
  const regex = /^\d{5}$/;
  const test = testValue($zipField.val(), regex);
  if (!test.hasValue) errorHandler($zipField, true, 'Enter zip');
  else if (!test.valid) errorHandler($zipField, true, '5 digits');
  else errorHandler($zipField, false);
}

// Tests 'cvv' field's value, throws error on a bad match
const validateCVV = $cvvField => {
  const regex = /^\d{3}$/;
  const test = testValue($cvvField.val(), regex);
  if (!test.hasValue) errorHandler($cvvField, true, 'Enter CVV');
  else if (!test.valid) errorHandler($cvvField, true, '3 digits');
  else errorHandler($cvvField, false);
}

// Checks expiration date against today's date
const validateExpiration = ($monthMenu, $yearMenu) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if ( currentYear < Number($yearMenu.val())
    || (currentYear === Number($yearMenu.val()) && currentMonth < Number($monthMenu.val())) ) {
      errorHandler($monthMenu, false);
      errorHandler($yearMenu, false)
  } else {
      errorHandler($monthMenu, true);
      errorHandler($yearMenu, true, 'Double check expiration dates');
  }
}

// Runs a list of functions to ensure the credit card values are valid
const validateCreditCard = $creditCardDiv => {
  validateCCN($creditCardDiv.find('#cc-num'));
  validateZip($creditCardDiv.find('#zip'));
  validateCVV($creditCardDiv.find('#cvv'));
  validateExpiration($creditCardDiv.find('#exp-month'),
                     $creditCardDiv.find('#exp-year'));
}

// Verifies info given is valid. If anything is missing it returns a user to the top, otherwise it will submit the form.
const validateForm = e => {
  e.preventDefault()


  validateName($('#name'));
  validateEmail($('#mail'));
  validateTitle($('#title'));
  if ($('#title').val() === 'other') validateOtherTitle($('#other-title'));

  validateSize($('#size'));
  validateDesign($('#design'));
  validateColor($('#color'));

  validateActivities($('.activities'));

  validatePayment($('#payment'));
  if ($('#payment').val() === 'credit card') validateCreditCard($('#credit-card'));


  if ($('.error').length || $('.error-message').length) {
    document.location.replace(`#`);
    if (!$('.error-header').length) {
      const $errorHeader = $('<label class="error-header">You seem to have missed something</label>');
      $($('legend')[0]).after($errorHeader);
    }
  } else {
    $('.error-header').remove();
    $('button').unbind('validateForm').submit();
  }
}



/**************************************
APP EXECUTION
**************************************/

// Focus 'name', hide situational elements
$('#name').focus();
$('#other-title').hide();
$('#colors-js-puns').hide();
$('#credit-card').hide();
$('#paypal').hide();
$('#bitcoin').hide();

// Create price display
const $h4 = $('<h4>Total Price: $ <span class="price">0</span></h4>');
$('.activities').append($h4);

// Event Listeners
$('#name').focusout(e => { validateName($(e.target)) });
$('#mail').focusout(e => { validateEmail($(e.target)) });
$('#title').change(e => { validateTitle($(e.target)) });
$('#other-title').focusout(e => { validateOtherTitle($(e.target)) });

$('#size').change(e => { validateSize($(e.target)) });
$('#design').change(e => { validateDesign($(e.target), true) });
$('#colors-js-puns').change(e => { validateColor($(e.target)) });

$('.activities input').change(e => { configureSchedule($(e.target)) });

$('#payment').change(e => { validatePayment($(e.target), true) });
$('#cc-num').focusout(e => { validateCCN($(e.target)) });
$('#zip').focusout(e => { validateZip($(e.target)) });
$('#cvv').focusout(e => { validateCVV($(e.target)) });
$('#exp-year').focusout(e => { validateExpiration($(e.target).parent().find('#exp-month'), $(e.target)) });

$('button').click(e => { validateForm(e) });
