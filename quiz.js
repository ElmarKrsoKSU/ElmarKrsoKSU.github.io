function submitQuiz() {
    let score = 0;
    let total = 5;
    let output = "";

    // question 1
    let q1 = document.getElementById("q1").value.toLowerCase();
    if (q1.includes("n^2")) {
        score++;
        output += "<p style='color:green'>Q1 Correct</p>";
    } else {
        output += "<p style='color:red'>Q1 Incorrect (Answer: O(n^2))</p>";
    }

    // question2
    let q2 = document.querySelector('input[name="q2"]:checked');
    if (q2 && q2.value === "b") {
        score++;
        output += "<p style='color:green'>Q2 Correct</p>";
    } else {
        output += "<p style='color:red'>Q2 Incorrect</p>";
    }

    // question3
    let q3 = document.querySelector('input[name="q3"]:checked');
    if (q3 && q3.value === "b") {
        score++;
        output += "<p style='color:green'>Q3 Correct</p>";
    } else {
        output += "<p style='color:red'>Q3 Incorrect</p>";
    }

    // question4
    let q4 = document.querySelector('input[name="q4"]:checked');
    if (q4 && q4.value === "b") {
        score++;
        output += "<p style='color:green'>Q4 Correct</p>";
    } else {
        output += "<p style='color:red'>Q4 Incorrect</p>";
    }

    // question5
    let checked = document.querySelectorAll('input[name="q5"]:checked');
    let values = Array.from(checked).map(x => x.value);

    if (values.includes("JavaScript") && values.includes("Python") && values.length === 2) {
        score++;
        output += "<p style='color:green'>Q5 Correct</p>";
    } else {
        output += "<p style='color:red'>Q5 Incorrect</p>";
    }

    let pass = score >= 3 ? "PASS" : "FAIL";

    document.getElementById("results").innerHTML =
        `<h2>${pass}</h2>
         <p>Score: ${score}/${total}</p>
         ${output}`;
}

function resetQuiz() {
    document.getElementById("quizForm").reset();
    document.getElementById("results").innerHTML = "";
}
