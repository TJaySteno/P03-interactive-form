// Ensure a value is both present and valid; returns object
const testValue = (value, regex) => {
  let test = {};
  test.hasValue = value !== '';
  if (regex) test.valid = regex.test(value);
  return test;
}

const loadColors = design => {
  const designIsPuns = design === 'js puns';
  $('#color').children().each((index, tshirtColor) => {
    const colorIsPuns = $(tshirtColor).text().indexOf('JS Puns') >= 0;
    const match = (colorIsPuns === designIsPuns) || ($(tshirtColor).val() === '');
    ( match ? $(tshirtColor).show(): $(tshirtColor).hide() );
  });
  $('#color').val('');
  $('#colors-js-puns').fadeIn(300);
}

const configureSchedule = $element => {
  console.log($element);

  // calculateTotalPrice
  // toggleActivities
}

const loadPaymentMethod = $paymentMenu => {
  $paymentMenu.parent().children('div').each((index, element) => $(element).hide());
  if ($paymentMenu.val() === 'credit card') $('#credit-card').fadeIn(300);
  else if ($paymentMenu.val() === 'paypal') $('#paypal').fadeIn(300);
  else if ($paymentMenu.val() === 'bitcoin') $('#bitcoin').fadeIn(300);
}







const errorHandler = (element, turnOn, message) => {
  const $element = $(element);
  if ($element.next().attr('class') === 'error-message') $element.next().remove();

  if (turnOn) {
    $element.addClass('error');
    const $label = $(`<label class="error-message"></label>`);
    if (message) $label.text(message);
    $element.after($label);
  } else {
    $element.removeClass('error');
  }
}





// Takes the name field and tests its value to either throw error or
const validateName = $nameField => {
  const regex = /^[a-z]+\s+[a-z]+\s*$/i;
  const test = testValue($nameField.val(), regex);
  if (!test.hasValue) errorHandler($nameField, true, 'Enter your first and last name above');
  else if (!test.valid) errorHandler($nameField, true, 'Enter your first and last name, letters only with a space');
  else errorHandler($nameField, false);
}

// Takes the email field and tests its value to either throw error or
const validateEmail = $emailField => {
  const regex = /^[a-z0-9\._]+@[a-z]+\.[a-z]+$/i;
  const test = testValue($emailField.val(), regex);
  if (!test.hasValue) errorHandler($emailField, true, 'Enter your email address above');
  else if (!test.valid) errorHandler($emailField, true, 'Email format: someone@example.com');
  else errorHandler($emailField, false);
}

const validateTitle = $titleMenu => {
  const test = testValue($titleMenu.val());
  if (!test.hasValue) errorHandler($titleMenu, true, 'Select your job title');
  else errorHandler($titleMenu, false);
  if ($titleMenu.val() === 'other') $('#other-title').fadeIn(300);
  else $('#other-title').hide();
}

const validateOtherTitle = $otherTitleField => {
  const test = testValue($otherTitleField.val());
  if (!test.hasValue) errorHandler($otherTitleField, true, 'Enter your title above');
  else errorHandler($otherTitleField, false);
}

const validateSize = $sizeMenu => {
  const test = testValue($sizeMenu.val());
  if (!test.hasValue) errorHandler($sizeMenu, true);
  else errorHandler($sizeMenu, false);
}

const validateDesign = $designMenu => {
  const test = testValue($designMenu.val());
  if (!test.hasValue) {
    errorHandler($designMenu, true);
    $('#colors-js-puns').hide();
  } else {
    errorHandler($designMenu, false);
    loadColors($designMenu.val());
  }
}

const validateColor = $colorMenu => {
  const test = testValue($colorMenu.val());
  if (!test.hasValue) errorHandler($colorMenu, true);
  else errorHandler($colorMenu, false);
}

const validateActivities = $activitiesDiv => {
  console.log($activitiesDiv);
  // if any are checked, remove error and move on
  // else create error under legend
}

const validatePayment = ($paymentMenu, newMethod) => {
  const test = testValue($paymentMenu.val());
  if (!test.hasValue) errorHandler($paymentMenu, true, 'Select your payment method above');
  else errorHandler($paymentMenu, false);
  if (newMethod) loadPaymentMethod($paymentMenu);
}








// This function validates every form element
const validateForm = () => {

  validateName($('#name'));
  validateEmail($('#mail'));
  validateTitle($('#title'));
  if ($('#title').val() === 'other') validateOtherTitle($('#other-title'));

  validateSize($('#size'));
  validateDesign($('#design'));
  validateColor($('#color'));

  validateActivities($('.activities'));

  validatePayment($('#payment'));
  if ($('#payment').val() === 'credit card') validateCC($('#credit-card'));

}

/****************** APP ******************/

$('#other-title').hide();
$('#colors-js-puns').hide();
$('#credit-card').hide();
$('#paypal').hide();
$('#bitcoin').hide();

$('#name').focus();



$('#name').focusout(e => { validateName($(e.target)) });
$('#mail').focusout(e => { validateEmail($(e.target)) });
$('#title').change(e => { validateTitle($(e.target)) });
$('#other-title').focusout(e => { validateOtherTitle($(e.target)) });

$('#size').change(e => { validateSize($(e.target)) });
$('#design').change(e => { validateDesign($(e.target)) });
$('#colors-js-puns').change(e => { validateColor($(e.target)) });

$('.activities input').change(e => { configureSchedule($(e.target)) });

$('#payment').change(e => { validatePayment($(e.target), true) });
