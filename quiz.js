// quiz.js
// Elmar Krso - IT3203
// This file does two things: runs the hamburger menu on every page,
// and handles the quiz logic on quiz.html (I know i should of created a generic named js file too late)

document.addEventListener('DOMContentLoaded', function () {

    // Grab the hamburger button and the mobile menu drawer
    var toggle = document.getElementById('menuToggle');
    var mobileNav = document.getElementById('mobileNav');

    // Only run the menu code if both elements exist on the page
    if (toggle && mobileNav) {

        // When the hamburger is clicked, toggle the menu open/closed
        toggle.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('open');
            toggle.classList.toggle('open', isOpen);
            toggle.setAttribute('aria-expanded', isOpen);
        });

        // If a link inside the mobile menu gets clicked, close the menu
        mobileNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileNav.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close the menu if the user clicks somewhere outside of it
        document.addEventListener('click', function (e) {
            if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Everything below only matters on the quiz page
    // If there's no quiz form, just stop here
    var quizForm = document.getElementById('quizForm');
    if (!quizForm) { return; }

    // Listen for typing in the text input (question 1)
    var q1Input = document.getElementById('q1');
    if (q1Input) {
        q1Input.addEventListener('input', trackProgress);
    }

    // Listen for changes on all the radio/checkbox groups (questions 2-5)
    ['q2', 'q3', 'q4', 'q5'].forEach(function (name) {
        document.querySelectorAll('input[name="' + name + '"]').forEach(function (el) {
            el.addEventListener('change', trackProgress);
        });
    });

    // Hook up the submit and reset buttons
    var submitBtn = document.getElementById('submitBtn');
    var resetBtn = document.getElementById('resetBtn');
    if (submitBtn) { submitBtn.addEventListener('click', submitQuiz); }
    if (resetBtn)  { resetBtn.addEventListener('click', resetQuiz); }

    // Stop the form from actually submitting to a server
    quizForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });

});


// Counts how many questions have been answered and updates the progress bar
function trackProgress() {
    var answered = 0;

    // Check each question - text box, then radio groups, then checkboxes
    var q1 = document.getElementById('q1');
    if (q1 && q1.value.trim() !== '') { answered++; }
    if (document.querySelector('input[name="q2"]:checked')) { answered++; }
    if (document.querySelector('input[name="q3"]:checked')) { answered++; }
    if (document.querySelector('input[name="q4"]:checked')) { answered++; }
    if (document.querySelector('input[name="q5"]:checked')) { answered++; }

    // Calculate percentage and update the bar + label
    var pct = Math.round((answered / 5) * 100);
    var labelEl = document.getElementById('progressLabel');
    var pctEl = document.getElementById('progressPct');
    var fillEl = document.getElementById('progressFill');

    if (labelEl) { labelEl.textContent = answered + ' of 5 answered'; }
    if (pctEl)   { pctEl.textContent = pct + '%'; }
    if (fillEl)  { fillEl.style.width = pct + '%'; }
}


// Grades the quiz and builds the results HTML when the user submits
function submitQuiz() {
    var score = 0;
    var total = 5;
    var items = []; // will hold result info for each question

    // Q1: bubble sort time complexity (fill-in)
    // Accept a few different ways of writing n squared
    var q1Val = document.getElementById('q1').value.toLowerCase().replace(/\s/g, '');
    if (q1Val.includes('n^2') || q1Val.includes('n\u00b2') || q1Val.includes('n2')) {
        score++;
        items.push({ correct: true, label: 'Question 1', note: 'Correct! Bubble sort is O(n\u00b2).' });
    } else {
        items.push({ correct: false, label: 'Question 1', note: 'Incorrect. The answer is O(n\u00b2).' });
    }

    // Q2: what does CSS stand for? (radio, answer is b)
    var q2 = document.querySelector('input[name="q2"]:checked');
    if (q2 && q2.value === 'b') {
        score++;
        items.push({ correct: true, label: 'Question 2', note: 'Correct! CSS = Cascading Style Sheets.' });
    } else {
        items.push({ correct: false, label: 'Question 2', note: 'Incorrect. CSS stands for Cascading Style Sheets.' });
    }

    // Q3: which HTML tag is used for JavaScript? (radio, answer is b)
    var q3 = document.querySelector('input[name="q3"]:checked');
    if (q3 && q3.value === 'b') {
        score++;
        items.push({ correct: true, label: 'Question 3', note: 'Correct! The &lt;script&gt; tag embeds JavaScript.' });
    } else {
        items.push({ correct: false, label: 'Question 3', note: 'Incorrect. The correct tag is &lt;script&gt;.' });
    }

    // Q4: which language is for styling? (radio, answer is b)
    var q4 = document.querySelector('input[name="q4"]:checked');
    if (q4 && q4.value === 'b') {
        score++;
        items.push({ correct: true, label: 'Question 4', note: 'Correct! CSS is used for styling.' });
    } else {
        items.push({ correct: false, label: 'Question 4', note: 'Incorrect. CSS is the language for styling web pages.' });
    }

    // Q5: select true programming languages (checkbox)
    // JavaScript and Python are correct - HTML and CSS are not programming languages
    var checked = document.querySelectorAll('input[name="q5"]:checked');
    var values = Array.from(checked).map(function (x) { return x.value; });
    if (values.includes('JavaScript') && values.includes('Python') && values.length === 2) {
        score++;
        items.push({ correct: true, label: 'Question 5', note: 'Correct! JavaScript and Python are programming languages.' });
    } else {
        items.push({ correct: false, label: 'Question 5', note: 'Incorrect. JavaScript and Python are programming languages. HTML and CSS are not.' });
    }

    // Figure out pass/fail (need 3 out of 5 to pass)
    var pass = score >= 3;
    var emoji = pass ? '\uD83C\uDF89' : '\uD83D\uDCDA';
    var verdict = pass ? 'PASS' : 'FAIL';
    var headerClass = pass ? 'pass' : 'fail';
    var message = pass ? 'Great job! You passed the quiz.' : 'Keep studying and try again!';

    // Build the HTML for each question result row
    var itemsHTML = items.map(function (item) {
        var cls = item.correct ? 'correct' : 'incorrect';
        var icon = item.correct ? '\u2705' : '\u274C';
        return '<div class="result-item ' + cls + '">'
             + '<span class="result-icon">' + icon + '</span>'
             + '<div>'
             + '<div class="result-item-label">' + item.label + '</div>'
             + '<div class="result-item-note">' + item.note + '</div>'
             + '</div></div>';
    }).join('');

    // Put it all together into the results panel
    var html = '<div class="result-header ' + headerClass + '">'
             + '<div class="result-emoji">' + emoji + '</div>'
             + '<div class="result-verdict">' + verdict + '</div>'
             + '<p class="result-score-text">' + message + '</p>'
             + '<div class="score-ring-row"><div class="score-circle">'
             + '<div class="score-big">' + score + '</div>'
             + '<div class="score-denom">/ ' + total + '</div>'
             + '</div></div>'
             + '</div>'
             + '<div class="result-breakdown">'
             + '<h3>Question Breakdown</h3>'
             + itemsHTML
             + '</div>';

    // Drop it into the results div and scroll to it
    var resultsEl = document.getElementById('results');
    resultsEl.innerHTML = html;
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// Clears the form and hides the results when reset is clicked
function resetQuiz() {
    var form = document.getElementById('quizForm');
    if (form) { form.reset(); }

    // Wipe the results area
    var resultsEl = document.getElementById('results');
    if (resultsEl) { resultsEl.innerHTML = ''; }

    // Reset the progress bar back to zero
    var labelEl = document.getElementById('progressLabel');
    var pctEl = document.getElementById('progressPct');
    var fillEl = document.getElementById('progressFill');
    if (labelEl) { labelEl.textContent = '0 of 5 answered'; }
    if (pctEl)   { pctEl.textContent = '0%'; }
    if (fillEl)  { fillEl.style.width = '0%'; }

    // Scroll back up to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
