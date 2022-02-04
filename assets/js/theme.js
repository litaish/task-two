// For navbar
const toggleBtn = document.getElementsByClassName('toggle-btn')[0];
const navLinks = document.getElementsByClassName('nav-links')[0];

const firstBar = document.getElementById('firstBar');
const secondBar = document.getElementById('secondBar');
const thirdBar = document.getElementById('thirdBar');

toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    firstBar.classList.toggle('active-bar-one');
    secondBar.classList.toggle('active-bar-two');
    thirdBar.classList.toggle('active-bar-three');
});

// Language selection 
const langContainer = document.getElementById('langContainer')

langContainer.addEventListener('click', (e) => {
    // Get child nodes
    let children = langContainer.children;
    let clicked = e.target;
    // Toggle underline class for selected item
    for (let i = 0; i < children.length; i++) {
        if (children[i] == clicked){
            clicked.classList.toggle('lang-active');
        } else {
            children[i].classList.remove('lang-active');
        }
    }
});




