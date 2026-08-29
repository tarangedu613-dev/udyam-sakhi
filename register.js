/* =========================================================
   UDYAM SAKHI
   REGISTRATION JAVASCRIPT
========================================================= */


/* =========================================================
   1. DOM ELEMENTS
========================================================= */

const registrationForm = document.getElementById("registrationForm");

const fullNameInput = document.getElementById("fullName");
const mobileInput = document.getElementById("mobile");
const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");
const pincodeInput = document.getElementById("pincode");

const termsCheckbox = document.getElementById("termsCheckbox");

const registerButton = document.getElementById("registerButton");
const registerButtonText = document.getElementById("registerButtonText");
const registerButtonLoader = document.getElementById("registerButtonLoader");
const registerButtonIcon = document.getElementById("registerButtonIcon");

const formAlert = document.getElementById("formAlert");

const registrationSuccess =
    document.getElementById("registrationSuccess");

const generatedUserId =
    document.getElementById("generatedUserId");


/* =========================================================
   2. BACKEND API URL
========================================================= */

const REGISTER_API_URL =
    "http://localhost:8080/api/auth/register";


/* =========================================================
   3. VALIDATION REGEX
========================================================= */

/*
 * Indian mobile number:
 * Starts with 6, 7, 8 or 9
 * Followed by exactly 9 digits
 */

const mobileRegex = /^[6-9][0-9]{9}$/;


/*
 * Basic email validation.
 */

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/*
 * Indian pincode:
 * Exactly 6 digits
 * First digit cannot be zero
 */

const pincodeRegex =
    /^[1-9][0-9]{5}$/;


/* =========================================================
   4. HELPER FUNCTIONS
========================================================= */


/*
 * Get an element by its ID.
 */

function getElement(id) {

    return document.getElementById(id);

}


/*
 * Display field error.
 */

function showFieldError(fieldId, message) {

    const errorElement =
        getElement(`${fieldId}Error`);

    const inputElement =
        getElement(fieldId);


    if (errorElement) {

        errorElement.textContent = message;

    }


    if (inputElement) {

        inputElement.classList.add("is-invalid");

    }

}


/*
 * Remove field error.
 */

function clearFieldError(fieldId) {

    const errorElement =
        getElement(`${fieldId}Error`);

    const inputElement =
        getElement(fieldId);


    if (errorElement) {

        errorElement.textContent = "";

    }


    if (inputElement) {

        inputElement.classList.remove("is-invalid");

    }

}


/*
 * Clear all validation errors.
 */

function clearAllFieldErrors() {

    const fieldIds = [

        "fullName",
        "mobile",
        "email",
        "password",
        "confirmPassword",
        "address",
        "city",
        "state",
        "pincode"

    ];


    fieldIds.forEach(function (fieldId) {

        clearFieldError(fieldId);

    });


    const termsError =
        getElement("termsError");

    if (termsError) {

        termsError.textContent = "";

    }

}


/*
 * Display general form alert.
 */

function showFormAlert(message, type = "danger") {

    if (!formAlert) {
        return;
    }


    formAlert.className =
        `alert alert-${type}`;

    formAlert.textContent = message;

    formAlert.classList.remove("d-none");

}


/*
 * Hide general form alert.
 */

function hideFormAlert() {

    if (!formAlert) {
        return;
    }


    formAlert.classList.add("d-none");

    formAlert.textContent = "";

}


/* =========================================================
   5. VALIDATE FULL NAME
========================================================= */

function validateFullName() {

    const fullName =
        fullNameInput.value.trim();


    if (fullName.length === 0) {

        showFieldError(
            "fullName",
            "Please enter your full name."
        );

        return false;

    }


    if (fullName.length < 2) {

        showFieldError(
            "fullName",
            "Please enter a valid full name."
        );

        return false;

    }


    clearFieldError("fullName");

    return true;

}


/* =========================================================
   6. VALIDATE MOBILE
========================================================= */

function validateMobile() {

    const mobile =
        mobileInput.value.trim();


    if (mobile.length === 0) {

        showFieldError(
            "mobile",
            "Please enter your mobile number."
        );

        return false;

    }


    if (!mobileRegex.test(mobile)) {

        showFieldError(
            "mobile",
            "Please enter a valid 10-digit Indian mobile number."
        );

        return false;

    }


    clearFieldError("mobile");

    return true;

}


/* =========================================================
   7. VALIDATE EMAIL
========================================================= */

function validateEmail() {

    const email =
        emailInput.value.trim();


    if (email.length === 0) {

        showFieldError(
            "email",
            "Please enter your email address."
        );

        return false;

    }


    if (!emailRegex.test(email)) {

        showFieldError(
            "email",
            "Please enter a valid email address."
        );

        return false;

    }


    clearFieldError("email");

    return true;

}


/* =========================================================
   8. VALIDATE PASSWORD
========================================================= */

function validatePassword() {

    const password =
        passwordInput.value;


    if (password.length === 0) {

        showFieldError(
            "password",
            "Please enter your password."
        );

        return false;

    }


    if (password.length < 8) {

        showFieldError(
            "password",
            "Password must contain at least 8 characters."
        );

        return false;

    }


    clearFieldError("password");

    return true;

}


/* =========================================================
   9. VALIDATE CONFIRM PASSWORD
========================================================= */

function validateConfirmPassword() {

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    if (confirmPassword.length === 0) {

        showFieldError(
            "confirmPassword",
            "Please confirm your password."
        );

        return false;

    }


    if (password !== confirmPassword) {

        showFieldError(
            "confirmPassword",
            "Password and Confirm Password do not match."
        );

        return false;

    }


    clearFieldError("confirmPassword");

    return true;

}


/* =========================================================
   10. VALIDATE ADDRESS
========================================================= */

function validateAddress() {

    const address =
        addressInput.value.trim();


    if (address.length === 0) {

        showFieldError(
            "address",
            "Please enter your address."
        );

        return false;

    }


    if (address.length < 5) {

        showFieldError(
            "address",
            "Please enter a valid address."
        );

        return false;

    }


    clearFieldError("address");

    return true;

}


/* =========================================================
   11. VALIDATE CITY
========================================================= */

function validateCity() {

    const city =
        cityInput.value.trim();


    if (city.length === 0) {

        showFieldError(
            "city",
            "Please enter your city."
        );

        return false;

    }


    clearFieldError("city");

    return true;

}


/* =========================================================
   12. VALIDATE STATE
========================================================= */

function validateState() {

    const state =
        stateInput.value.trim();


    if (state.length === 0) {

        showFieldError(
            "state",
            "Please enter your state."
        );

        return false;

    }


    clearFieldError("state");

    return true;

}


/* =========================================================
   13. VALIDATE PINCODE
========================================================= */

function validatePincode() {

    const pincode =
        pincodeInput.value.trim();


    if (pincode.length === 0) {

        showFieldError(
            "pincode",
            "Please enter your pincode."
        );

        return false;

    }


    if (!pincodeRegex.test(pincode)) {

        showFieldError(
            "pincode",
            "Please enter a valid 6-digit Indian pincode."
        );

        return false;

    }


    clearFieldError("pincode");

    return true;

}


/* =========================================================
   14. VALIDATE TERMS
========================================================= */

function validateTerms() {

    const termsError =
        getElement("termsError");


    if (!termsCheckbox.checked) {

        if (termsError) {

            termsError.textContent =
                "Please accept the Terms & Conditions and Privacy Policy.";

        }

        return false;

    }


    if (termsError) {

        termsError.textContent = "";

    }


    return true;

}


/* =========================================================
   15. COMPLETE FORM VALIDATION
========================================================= */

function validateRegistrationForm() {

    clearAllFieldErrors();

    hideFormAlert();


    const fullNameValid =
        validateFullName();

    const mobileValid =
        validateMobile();

    const emailValid =
        validateEmail();

    const passwordValid =
        validatePassword();

    const confirmPasswordValid =
        validateConfirmPassword();

    const addressValid =
        validateAddress();

    const cityValid =
        validateCity();

    const stateValid =
        validateState();

    const pincodeValid =
        validatePincode();

    const termsValid =
        validateTerms();


    return (
        fullNameValid &&
        mobileValid &&
        emailValid &&
        passwordValid &&
        confirmPasswordValid &&
        addressValid &&
        cityValid &&
        stateValid &&
        pincodeValid &&
        termsValid
    );

}


/* =========================================================
   16. CREATE REQUEST BODY
========================================================= */

function createRegistrationRequest() {

    return {

        fullName:
            fullNameInput.value.trim(),

        phone:
            mobileInput.value.trim(),

        email:
            emailInput.value.trim().toLowerCase(),

        password:
            passwordInput.value,

        address:
            addressInput.value.trim(),

        city:
            cityInput.value.trim(),

        state:
            stateInput.value.trim()

    };

}


/* =========================================================
   17. SET LOADING STATE
========================================================= */

function setRegisterLoading(isLoading) {

    if (!registerButton) {
        return;
    }


    registerButton.disabled =
        isLoading;


    if (isLoading) {

        if (registerButtonText) {

            registerButtonText.classList.add("d-none");

        }


        if (registerButtonIcon) {

            registerButtonIcon.classList.add("d-none");

        }


        if (registerButtonLoader) {

            registerButtonLoader.classList.remove("d-none");

        }

    } else {

        if (registerButtonText) {

            registerButtonText.classList.remove("d-none");

        }


        if (registerButtonIcon) {

            registerButtonIcon.classList.remove("d-none");

        }


        if (registerButtonLoader) {

            registerButtonLoader.classList.add("d-none");

        }

    }

}


/* =========================================================
   18. SHOW REGISTRATION SUCCESS
========================================================= */

function showRegistrationSuccess(userId) {

    if (registrationForm) {

        registrationForm.classList.add("d-none");

    }


    if (registrationSuccess) {

        registrationSuccess.classList.remove("d-none");

    }


    if (generatedUserId) {

        generatedUserId.textContent =
            userId || "Your User ID";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   19. HANDLE API ERROR
========================================================= */

async function handleRegistrationError(response) {

    let message =
        "Something went wrong. Please try again.";


    try {

        const data =
            await response.json();


        if (data && data.message) {

            message = data.message;

        }

    } catch (error) {

        console.error(
            "Unable to read API error response:",
            error
        );

    }


    if (response.status === 400) {

        showFormAlert(
            message,
            "danger"
        );

    } else if (response.status === 409) {

        showFormAlert(
            message,
            "warning"
        );

    } else if (response.status === 500) {

        showFormAlert(
            "Server error. Please try again later.",
            "danger"
        );

    } else {

        showFormAlert(
            message,
            "danger"
        );

    }

}


/* =========================================================
   20. SUBMIT REGISTRATION
========================================================= */

async function submitRegistration() {

    const requestBody =
        createRegistrationRequest();


    setRegisterLoading(true);


    try {

        const response =
            await fetch(
                REGISTER_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(requestBody)
                }
            );


        if (response.ok) {

            const data =
                await response.json();

            showRegistrationSuccess(
            data.id
            );


            return;

        }


        await handleRegistrationError(
            response
        );


    } catch (error) {

        console.error(
            "Registration API error:",
            error
        );


        showFormAlert(
            "Unable to connect to the server. Please make sure the Spring Boot backend is running.",
            "danger"
        );

    } finally {

        setRegisterLoading(false);

    }

}


/* =========================================================
   21. FORM SUBMIT EVENT
========================================================= */

if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const isValid =
                validateRegistrationForm();


            if (!isValid) {

                showFormAlert(
                    "Please correct the highlighted fields before submitting.",
                    "danger"
                );


                const firstInvalidField =
                    registrationForm.querySelector(
                        ".is-invalid"
                    );


                if (firstInvalidField) {

                    firstInvalidField.focus();

                }


                return;

            }


            await submitRegistration();

        }
    );

}


/* =========================================================
   22. PASSWORD SHOW / HIDE
========================================================= */

const passwordToggleButtons =
    document.querySelectorAll(
        ".password-toggle"
    );


passwordToggleButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.getAttribute(
                        "data-target"
                    );


                const targetInput =
                    document.getElementById(
                        targetId
                    );


                if (!targetInput) {
                    return;
                }


                const icon =
                    button.querySelector("i");


                if (
                    targetInput.type ===
                    "password"
                ) {

                    targetInput.type =
                        "text";


                    if (icon) {

                        icon.className =
                            "bi bi-eye-slash";

                    }


                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    targetInput.type =
                        "password";


                    if (icon) {

                        icon.className =
                            "bi bi-eye";

                    }


                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }
);


/* =========================================================
   23. MOBILE INPUT RESTRICTION
========================================================= */

if (mobileInput) {

    mobileInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );

        }
    );

}


/* =========================================================
   24. PINCODE INPUT RESTRICTION
========================================================= */

if (pincodeInput) {

    pincodeInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value.replace(
                    /[^0-9]/g,
                    ""
                );

        }
    );

}


/* =========================================================
   25. LIVE VALIDATION
========================================================= */

if (fullNameInput) {

    fullNameInput.addEventListener(
        "blur",
        validateFullName
    );

}


if (mobileInput) {

    mobileInput.addEventListener(
        "blur",
        validateMobile
    );

}


if (emailInput) {

    emailInput.addEventListener(
        "blur",
        validateEmail
    );

}


if (passwordInput) {

    passwordInput.addEventListener(
        "blur",
        validatePassword
    );

}


if (confirmPasswordInput) {

    confirmPasswordInput.addEventListener(
        "blur",
        validateConfirmPassword
    );

}


if (addressInput) {

    addressInput.addEventListener(
        "blur",
        validateAddress
    );

}


if (cityInput) {

    cityInput.addEventListener(
        "blur",
        validateCity
    );

}


if (stateInput) {

    stateInput.addEventListener(
        "blur",
        validateState
    );

}


if (pincodeInput) {

    pincodeInput.addEventListener(
        "blur",
        validatePincode
    );

}


/* =========================================================
   26. PASSWORD MATCH LIVE CHECK
========================================================= */

if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        function () {

            if (
                confirmPasswordInput.value.length > 0
            ) {

                validateConfirmPassword();

            }

        }
    );

}


if (confirmPasswordInput) {

    confirmPasswordInput.addEventListener(
        "input",
        function () {

            if (
                this.value.length > 0
            ) {

                validateConfirmPassword();

            }

        }
    );

}


/* =========================================================
   27. INITIAL STATE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        hideFormAlert();

        setRegisterLoading(false);

    }
);