const submitBtn = document.getElementById('contactSubmit');
// Group of elements that will be removed and replaced by success message
const successGroup = document.getElementById('successGroup');

const successMsgLarge = document.createElement('p');
successMsgLarge.innerText = 'Paldies, ka sapņo!';
successMsgLarge.classList.add('f-mont-yellow-success-large');
successMsgLarge.style.marginBottom = '2.125em';

const successMsgsmall = document.createElement('p');
successMsgsmall.innerText = 'Ja tavs sapnis tiks izvēlēts, mēs ar tevi sazināsimies.';
successMsgsmall.classList.add('f-mont-yellow-success-small');


const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Remove original form content
    successGroup.innerHTML = '';
    successGroup.style.textAlign = 'center';
    // Replace with success message
    successGroup.appendChild(successMsgLarge);
    successGroup.appendChild(successMsgsmall);

    // Clear form fields
    form.reset();
})

const selectCityEl = document.getElementById('selectCity');

selectCityEl.addEventListener('change', () => {
    console.log('changed')
})




