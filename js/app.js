$(window).ready(()=> {

  // Hide fields made optional with JavaScript, focus name input, prevent button refresh while in development
  $('#other-title').hide();
  $('#colors-js-puns').hide();
  $('#credit-card').hide();
  $('#paypal').hide();
  $('#bitcoin').hide();
  $('#name').focus();
  $('button').click(e => e.preventDefault());

  // Attach total price display to 'activities' div
  (() => {
    const $h4 = $('<h4>Total Price: $ <span class="price">0</span></h4>');
    $('.activities').append($h4);
  })()

  // When focus moves away from 'name', check the value and alert the user if corrections are needed
  $('#name').focusout( e => {
    const name = $(e.target).val();
    const regex = /^[a-z]+\s+[a-z]+\s*$/i;
    if (name === '') console.log('Error: Please enter your first and last name');
    else if (!regex.test(name)) console.log('Error: Please enter first and last name. Names can only contain letters');
  });

  // When focus moves away from 'email', check the value and alert the user if corrections are needed
  $('#mail').focusout( e => {
    const email = $(e.target).val();
    const regex = /^[\w\.]+@[a-z]+\.[a-z]+$/i;
    if (email === '') console.log('Error: Please enter your email address');
    else if (!regex.test(email)) console.log('Error: Please enter a valid email address with the format of "my_email@google.com". Words can only use letters, numbers, periods, or underscores.');
  });

  // When job dropdown value changes, check for value 'other' and show .other-title input if needed
  $('#title').change( e => {
    const $otherTitle = $('#other-title');
    const showOtherTitle = $(e.target).val() === 'other';
    ( showOtherTitle ? $otherTitle.fadeIn(300) : $otherTitle.fadeOut(300) );
  });

  // Function compares theme against colors to find which to display, resets '#color' value, then displays '#color dropdown'
  const showColors = theme => {
    const themeIsPuns = theme === 'js puns';

    $('#color').children().each((index, tshirtColor) => {
      const colorIsPuns = $(tshirtColor).text().indexOf('JS Puns') >= 0;
      const match = colorIsPuns === themeIsPuns;
      ( match ? $(tshirtColor).show(): $(tshirtColor).hide() );
    });

    $('#color').val('');
    $('#colors-js-puns').fadeIn(300);
  }

  // On selection of tshirt design, show dropdown with only the colors in that style or hide it altogether if no style chosen
  $('#design').change( e => {
    const designTheme = $(e.target).val();
    ( designTheme !== 'Select Theme' ? showColors(designTheme) : $('#colors-js-puns').fadeOut(300) );
  });

  // Take an activity string, divide it into information and return as object
  const findActivityInfo = activity => {
    const regexFull = /([a-z]+)\s([1-9]+[ap]m)-([1-9]+[ap]m),\s\$([0-9]{3})$/i;
    const regexMainConf = /\$([0-9]{3})$/;

    let day, start, end, price;
    let info = activity.match(regexFull);
    if (info === null) price = activity.match(regexMainConf)[1];
    else [, day, start, end, price] = info;

    price = Number(price);

    return {day, start, end, price};
  }


  // On box check, prohibit timing conflicts, and calculate total price
  $('.activities label input').change( e => {
    const activitySelected = $(e.target).parent().text();
    const activityInfo = findActivityInfo(activitySelected);
    const currentPrice = Number($('.price').text());
    const checked = e.target.checked;

    if (checked) $('.price').text( currentPrice + activityInfo.price );
    else $('.price').text( currentPrice - activityInfo.price );
  });

  // On selection of payment method, show proper payment information
  $('#payment').change( e => {
    $(e.target).parent().children('div').hide();

    const paymentMethod = $(e.target).val();
    if (paymentMethod === 'bitcoin') $('#bitcoin').show();
    else if (paymentMethod === 'paypal') $('#paypal').show();
    else if (paymentMethod === 'credit card') $('#credit-card').show();
  });

  // When focus moves away from any credit card field, check the value and alert the user if corrections are needed
  $('#credit-card').focusout(e => {
    const $field = $(e.target);
    const num = $field.val();
    const regex = (() => {
      if ($field.attr('id') === 'cc-num' ) return /^\d{13,16}$/;
      else if ($field.attr('id') === 'zip' ) return /^\d{5}$/;
      else if ($field.attr('id') === 'cvv' ) return /^\d{3}$/;
      else return null;
    })()

    if (regex && !regex.test(num)) console.log($field.attr('id'));
  });
});
