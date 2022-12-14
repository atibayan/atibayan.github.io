window.addEventListener('resize', function(){
  arrangeComments();
});

window.addEventListener('DOMContentLoaded', function(){
  initializeOptions();
  populateComments();
  styleComments();
  arrangeComments();
  let radios = this.document.querySelectorAll("input[type='radio']");
  for(let i = 0; i < radios.length; i++){
    radios[i].addEventListener('click', formatClickEmoji);
  }
  this.document.querySelector("input[type='reset']").addEventListener('click', resetForm)
});

function populateComments(){
  for(let dComment of dummyComments){
    let article = document.createElement('article');
    article.className = 'comment';
    let emojiBg = document.createElement('p');
    emojiBg.innerText = String.fromCodePoint(emojis[dComment.rate]);

    let heading = constructHeading(dComment.country, dComment.rate);

    let citeText = document.createElement('cite');
    citeText.innerText = dComment.story;

    let from = document.createElement('p');
    from.innerText = '- ' + dComment.fname;

    article.append(emojiBg, heading, citeText, from);
    let commentContainer = document.getElementById('commentContainer');
    commentContainer.prepend(article);
  }
}

function getCssPropertyForRule(rule, prop) {
  var sheets = document.styleSheets;
  var slen = sheets.length;
  for(var i=0; i<slen; i++) {
      var rules = document.styleSheets[i].cssRules;
      var rlen = rules.length;
      for(var j=0; j<rlen; j++) {
          if(rules[j].selectorText == rule) {
              return rules[j].style[prop];
          }
      }
  }
}


function formatClickEmoji(){
  let radios = document.querySelectorAll("input[type='radio']");
  for(let i = 0; i < radios.length; i++){
    if (radios[i].checked)
    {
      document.getElementById('emoji'+(i+1)).style.transform = 'translateY(10%)';
      document.getElementById('emoji7').innerText = radios[i].value.toUpperCase();
      document.getElementById('emoji7').style.opacity = '1';
      break; // means I already saw checked radio and appllied styles
    }
    else
    {
      document.getElementById('emoji'+(i+1)).style.transform = '';
    }
    // for resetting emoji7 styles
    document.getElementById('emoji7').style.opacity = '';
    document.getElementById('emoji7').innerText =
      String.fromCodePoint(0x2B50) +
      String.fromCodePoint(0x2B50) +
      String.fromCodePoint(0x2B50) +
      String.fromCodePoint(0x2B50) +
      String.fromCodePoint(0x2B50);
  }
}

function addComment(form){
  if(validateForm(form))
  {
    let commentContainer = document.getElementById('commentContainer');
    if(commentContainer.childElementCount >= MAX_COMMENT){
      //remove last line as max comments limit is 17 TODO: make dynamic comments count
      commentContainer.removeChild(commentContainer.lastChild);
    }

    let name = form.elements['fname'];
    let country = form.elements['country'];
    let rates = form.elements['rate'];
    let story = form.elements['story'];

    let article = document.createElement('article');
    article.className = 'comment';
    let emojiBg = document.createElement('p');
    emojiBg.innerText = String.fromCodePoint(emojis[rates.value]);

    let heading = constructHeading(country.value, rates.value);

    let citeText = document.createElement('cite');
    citeText.innerText = story.value;

    let from = document.createElement('p');
    from.style.textAlign = 'right';
    from.innerText = '- ' + name.value;
    article.append(emojiBg, heading, citeText, from);
    commentContainer.prepend(article);
    
    styleComments();
    arrangeComments();
    resetForm();
  }
}

function resetForm(){
  let formDiv = document.getElementsByTagName('form')[0];
  formDiv.reset();
  formatClickEmoji();
}

function constructHeading(country, rate){
  let heading = document.createElement('h2');
  let strongCountry = document.createElement('span');
  strongCountry.className = 'strong-country';
  strongCountry.innerText = country.toUpperCase();
  if(rate == 'superb!'){
    heading.append(strongCountry, ' was superb!');
  }
  else if(rate == 'loveit!'){
    heading.append('I love you, ', strongCountry);
  }
  else if(rate == 'pricey!'){
    heading.append(strongCountry, ' is too pricey for me');
  }
  else if(rate == 'it rocks!'){
    heading.append(strongCountry, ', you rock!');
  }
  else if(rate == 'meh!'){
    heading.append('Love-hate relationship with, ', strongCountry);
  }
  else{
    heading.append("Sorry, ", strongCountry, ", I'm never coming back.")
  }
  return heading;
}

function validateForm(form){
  return validateName(form) &&
    validateCountry(form) &&
    validateRate(form) &&
    validateStory(form);
}

function validateName(form){
  let name = form.elements['fname'];
  if(name.validity.valueMissing){
    name.setCustomValidity("Don't be shy. Tell us your name.");
    return false;
  }
  else{
    name.setCustomValidity("");
    return true;
  }
}

function validateCountry(form){
  let country = form.elements['country'];
  if(country.validity.valueMissing){
    country.setCustomValidity("Where did you go?");
    return false;
  }
  else{
    country.setCustomValidity("");
    return true;
  }
}

function validateRate(form){
  let rates = form.elements['rate'];
  let check = false;
  for(let rate of rates)
  {
    check = check || rate.validity.valid;
  }
  if(!check){
    let customText = "Rate your experience " + String.fromCodePoint(0x1F92A);
    rates[0].setCustomValidity(customText);
    return false;
  }
  else{
    rates[0].setCustomValidity("");
    return true;
  }
}

function validateStory(form){
  let story = form.elements['story'];
  if(story.validity.valueMissing){
    story.setCustomValidity("Share a couple of words please " + String.fromCodePoint(0x1F92A));
    return false;
  }
  else if (story.value.split(' ') > 50){
      story.setCustomValidity("Oops! Information overload... Please make your story concise  " + String.fromCodePoint(0x1F92A));
      return false;
  }
  else{
    story.setCustomValidity("");
    return true;
  }
}

function styleComments(){
  let comments = document.querySelectorAll('.comment');
  for(let i = 0; i < comments.length; i++){
    if(i == 0)
      comments[i].style.backgroundColor = colors.colorDarkAccent;
    else{
      comments[i].style.backgroundColor = 'unset';
      comments[i].style.border = '4px solid ' + colors.colorDarkAccent;
    }
  }
}

function arrangeComments(){
  let commentContainer = document.getElementById('commentContainer');
  let comments = commentContainer.children;
  for(let i = 0; i < comments.length; i++){
    if(window.screen.width <= 550 || window.innerWidth <= 550){
      commentContainer.style.gridTemplateColumns = '1fr';
      comments[i].style.gridArea = 'unset';
    }
    else if(window.screen.width <= 1024 || window.innerWidth <= 1024){
      commentContainer.style.gridTemplateColumns = '1fr 1fr';
      comments[i].style.gridArea = gridAreas2Col[i];
    }
    else {
      commentContainer.style.gridTemplateColumns = '1fr 0.8fr 0.5fr';
      comments[i].style.gridArea = gridAreas3Col[i];
    }
  }
}

function initializeOptions(){
  let select = document.getElementById('country');
  for(let country of countryList){
    let option = document.createElement('option');
    option.text = country;
    option.val = country.substring(0, 2);
    select.append(option);
  }
}