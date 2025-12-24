document.addEventListener('DOMContentLoaded', function() {

//global error log
let form_errors = [];

const form = document.getElementById("contact-form");
//const form = document.querySelector("form");
const submitBtn = document.getElementById("submit");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const commentField = document.getElementById("comment");
const errorBox = document.getElementById("form-error");
const infoBox = document.getElementById("form-info");
const errorLogField = document.getElementById("form-errors");
const commentCounter = document.getElementById("comment-counter");
const maxChars = 500;

const namePattern = /^[A-Za-z\s']*$/;

//flash and mask for illegal characters
function flashError(msg) {
    //console.log("flash error:", msg);
    errorBox.textContent = msg;
    errorBox.style.opacity = 1

    setTimeout(() => {
        errorBox.style.opacity = 0;
        errorBox.textContent = "";
    }, 2000);
}
function flashInfo(msg) {
    infoBox.textContent = msg;
    infoBox.style.opacity = 1;

    setTimeout(() => {
        infoBox.style.opacity = 0;
        infoBox.textContent = "";
    }, 2000);
}
function enforceNameRules(event) {
    if (!namePattern.test(nameField.value)) {
        const lastValidInput = nameField.value.slice(0, -1);
        nameField.value = lastValidInput;

        flashError("Invalid character");
        flashInfo("Only letters, spaces, and apostrophes allowed in Name");

        /*event.target.value = event.target.value.replace(/^[A-Za-z\s']/g, "");*/

        //log the error
        form_errors.push({
            field: "name",
            value: nameField.value,
            error: "Illegal character",
        });
    }
}
nameField.addEventListener("input", enforceNameRules);
nameField.addEventListener("invalid", (e) => {
    flashError("Please enter your name.");
    form_errors.push({
            field: "name",
            value: nameField.value,
            error: "Invalid empty input or too short",
        });
});

//constraint validation API with custom messages
nameField.addEventListener("input", () => {
    nameField.setCustomValidity (''); 
    if (nameField.validity.tooShort) {
        nameField.setCustomValidity("Name is too short please enter at least 2 characters.");
    }
    if (nameField.validity.patternMismatch) {
        nameField.setCustomValidity("Name contains invalid characters.");
    }
});
emailField.addEventListener("input", () => {
    emailField.setCustomValidity (''); 
    if (emailField.validity.tooLong) {
        emailField.setCustomValidity("Email exceeds 100 characters.");
    }
    if (emailField.validity.typeMismatch) {
        emailField.setCustomValidity("Please enter a valid email address.");
    }
});
commentField.addEventListener("input", () => {
    commentField.setCustomValidity (''); 
    if (commentField.validity.tooLong) {
        commentField.setCustomValidity("Comment exceeds 500 characters.");
    }
    if (commentField.validity.tooShort) {
        commentField.setCustomValidity("Please enter a comment of at least 5 characters.");
    }
});

//comment character counter
commentField.addEventListener("input", () => {
    const remainingChars = maxChars - commentField.value.length;
    commentCounter.textContent = `${remainingChars} characters remaining`;
    
    if (remainingChars < 50) {
        commentCounter.style.color = "red";
    } else if (remainingChars < 100) {
        commentCounter.style.color = "orange";
    } else {
        commentCounter.style.color = "black";
    }

    if (remainingChars < 0) {
        flashError("Too many characters");
        form_errors.push({
            field: "comment",
            error: "Too long",
        });
    }
});

form.addEventListener("submit", (event) => {
    let formIsValid = true;

    //check validity of each field

    if (nameField.validity.tooShort) {
        formIsValid = false;
        form_errors.push({
            field: "name",
            value: nameField.value,
            error: "Too short",
        });
    }
    if (nameField.validity.patternMismatch) {
        formIsValid = false;
        form_errors.push({
            field: "name",
            value: nameField.value,
            error: "Contains invalid characters",
        });
    }

    if (emailField.validity.tooLong) {
        formIsValid = false;
        form_errors.push({
            field: "email",
            value: emailField.value,
            error: "Too long",
        });
    }
    if (emailField.validity.typeMismatch) {
        formIsValid = false;
        form_errors.push({
            field: "email",
            value: emailField.value,
            error: "Invalid email",
        });
    }

    if (commentField.validity.tooLong) {
        formIsValid = false;
        form_errors.push({
            field: "comment",
            error: "Too long",
        });
    }
    if (commentField.validity.tooShort) {
        formIsValid = false;
        form_errors.push({
            field: "comment",
            value: commentField.value,
            error: "Too short",
        });
    }

    //if invalid prevent submission
    if (!formIsValid) {
        event.preventDefault();
    }

    //write error log to hidden field
    errorLogField.value = JSON.stringify(form_errors);    
});


});