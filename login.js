/* =========================================================
   UDYAM SAKHI
   MEMBER LOGIN JAVASCRIPT
========================================================= */


/* =========================================================
   1. DOM ELEMENTS
========================================================= */

const loginForm = document.getElementById("loginForm");

const userIdInput = document.getElementById("userId");
const loginPasswordInput = document.getElementById("loginPassword");

const rememberMeCheckbox =
    document.getElementById("rememberMe");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const loginButtonLoader =
    document.getElementById("loginButtonLoader");

const loginButtonIcon =
    document.getElementById("loginButtonIcon");

const loginAlert =
    document.getElementById("loginAlert");

const forgotPasswordLink =
    document.getElementById("forgotPasswordLink");


/* =========================================================
   2. BACKEND API URL
========================================================= */

const LOGIN_API_URL =
    "http://localhost:8080/api/auth/login";


/* =========================================================
   3. HELPER FUNCTIONS
========================================================= */


/*
 * Show field error
 */

function showLoginFieldError(fieldId, message) {

    const errorElement =
        document.getElementById(`${fieldId}Error`);

    const inputElement =
        document.getElementById(fieldId);


    if (errorElement) {

        errorElement.textContent = message;

    }


    if (inputElement) {

        inputElement.classList.add("is-invalid");

    }

}


/*
 * Clear field error
 */

function clearLoginFieldError(fieldId) {

    const errorElement =
        document.getElementById(`${fieldId}Error`);

    const inputElement =
        document.getElementById(fieldId);


    if (errorElement) {

        errorElement.textContent = "";

    }


    if (inputElement) {

        inputElement.classList.remove("is-invalid");

    }

}


/*
 * Clear all login errors
 */

function clearLoginErrors() {

    clearLoginFieldError("userId");

    clearLoginFieldError("loginPassword");

}


/*
 * Show general login alert
 */

function showLoginAlert(
    message,
    type = "danger"
) {

    if (!loginAlert) {
        return;
    }


    loginAlert.className =
        `alert alert-${type}`;

    loginAlert.textContent =
        message;

    loginAlert.classList.remove("d-none");

}


/*
 * Hide login alert
 */

function hideLoginAlert() {

    if (!loginAlert) {
        return;
    }


    loginAlert.classList.add("d-none");

    loginAlert.textContent = "";

}


/* =========================================================
   4. VALIDATE USER ID
========================================================= */

function validateUserId() {

    const userId =
        userIdInput.value.trim();


    if (userId.length === 0) {

        showLoginFieldError(
            "userId",
            "Please enter your User ID."
        );

        return false;

    }


    /*
     * Basic length check.
     *
     * We are keeping this flexible because the
     * final User ID format will be generated
     * by the backend.
     */

    if (userId.length < 3) {

        showLoginFieldError(
            "userId",
            "Please enter a valid User ID."
        );

        return false;

    }


    clearLoginFieldError("userId");

    return true;

}


/* =========================================================
   5. VALIDATE PASSWORD
========================================================= */

function validateLoginPassword() {

    const password =
        loginPasswordInput.value;


    if (password.length === 0) {

        showLoginFieldError(
            "loginPassword",
            "Please enter your password."
        );

        return false;

    }


   if (password.length < 1) {
    showLoginFieldError(
        "loginPassword",
        "Please enter your password."
    );
    return false;
}


    clearLoginFieldError(
        "loginPassword"
    );

    return true;

}


/* =========================================================
   6. COMPLETE LOGIN VALIDATION
========================================================= */

function validateLoginForm() {

    clearLoginErrors();

    hideLoginAlert();


    const userIdValid =
        validateUserId();

    const passwordValid =
        validateLoginPassword();


    return (
        userIdValid &&
        passwordValid
    );

}


/* =========================================================
   7. CREATE LOGIN REQUEST
========================================================= */

function createLoginRequest() {
    return {
        email: userIdInput.value.trim(),
        password: loginPasswordInput.value
    };
}

/* =========================================================
   8. SET LOGIN LOADING STATE
========================================================= */

function setLoginLoading(
    isLoading
) {

    if (!loginButton) {
        return;
    }


    loginButton.disabled =
        isLoading;


    if (isLoading) {

        if (loginButtonText) {

            loginButtonText.classList.add(
                "d-none"
            );

        }


        if (loginButtonIcon) {

            loginButtonIcon.classList.add(
                "d-none"
            );

        }


        if (loginButtonLoader) {

            loginButtonLoader.classList.remove(
                "d-none"
            );

        }

    } else {

        if (loginButtonText) {

            loginButtonText.classList.remove(
                "d-none"
            );

        }


        if (loginButtonIcon) {

            loginButtonIcon.classList.remove(
                "d-none"
            );

        }


        if (loginButtonLoader) {

            loginButtonLoader.classList.add(
                "d-none"
            );

        }

    }

}


/* =========================================================
   9. SAVE LOGIN SESSION
========================================================= */

function saveLoginSession(data) {

    if (!data) {
        return;
    }

    // Backend returns the MongoDB User object directly.
    // Example:
    // {
    //   id: "...",
    //   fullName: "...",
    //   email: "...",
    //   phone: "...",
    //   ...
    // }

    if (data.id) {

        localStorage.setItem(
            "udyamSakhiUserId",
            data.id
        );

    }

    // Store the complete user object as member data
    localStorage.setItem(
        "udyamSakhiMember",
        JSON.stringify(data)
    );

    // Store complete login response
    localStorage.setItem(
        "udyamSakhiLoginData",
        JSON.stringify(data)
    );
}


/* =========================================================
   10. HANDLE SUCCESSFUL LOGIN
========================================================= */

function handleSuccessfulLogin(data) {

    saveLoginSession(data);


    showLoginAlert(
        "Login successful. Redirecting to your dashboard...",
        "success"
    );


    /*
     * Redirect after a short delay.
     *
     * Dashboard will be created next.
     */

    setTimeout(
        function () {

            window.location.href =
                "dashboard.html";

        },
        700
    );

}


/* =========================================================
   11. HANDLE LOGIN API ERROR
========================================================= */

async function handleLoginApiError(
    response
) {

    let message =
        "Invalid User ID or password.";


    try {

        const data =
            await response.json();


        if (
            data &&
            data.message
        ) {

            message =
                data.message;

        }

    } catch (error) {

        console.error(
            "Unable to read login error:",
            error
        );

    }


    switch (response.status) {

        case 400:

            showLoginAlert(
                message,
                "danger"
            );

            break;


        case 401:

            showLoginAlert(
                "Invalid User ID or password.",
                "danger"
            );

            break;


        case 403:

            showLoginAlert(
                "Your account does not currently have access.",
                "warning"
            );

            break;


        case 404:

            showLoginAlert(
                "Member account was not found.",
                "danger"
            );

            break;


        case 500:

            showLoginAlert(
                "Server error. Please try again later.",
                "danger"
            );

            break;


        default:

            showLoginAlert(
                message,
                "danger"
            );

    }

}


/* =========================================================
   12. LOGIN API REQUEST
========================================================= */

async function submitLogin() {

    const requestBody =
        createLoginRequest();


    setLoginLoading(true);


    try {

        const response =
            await fetch(
                LOGIN_API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            requestBody
                        )
                }
            );


        /*
         * Successful response
         */

        if (response.ok) {

            const data =
                await response.json();


            handleSuccessfulLogin(
                data
            );


            return;

        }


        /*
         * Error response
         */

        await handleLoginApiError(
            response
        );


    } catch (error) {

        console.error(
            "Login API error:",
            error
        );


        showLoginAlert(
            "Unable to connect to the server. Please make sure the Spring Boot backend is running.",
            "danger"
        );

    } finally {

        setLoginLoading(false);

    }

}


/* =========================================================
   13. LOGIN FORM SUBMIT
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const isValid =
                validateLoginForm();


            if (!isValid) {

                showLoginAlert(
                    "Please correct the highlighted fields.",
                    "danger"
                );


                /*
                 * Focus first invalid field
                 */

                const firstInvalidField =
                    loginForm.querySelector(
                        ".is-invalid"
                    );


                if (firstInvalidField) {

                    firstInvalidField.focus();

                }


                return;

            }


            await submitLogin();

        }
    );

}


/* =========================================================
   14. PASSWORD SHOW / HIDE
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
   15. USER ID LIVE VALIDATION
========================================================= */

if (userIdInput) {

    userIdInput.addEventListener(
        "blur",
        validateUserId
    );


    userIdInput.addEventListener(
        "input",
        function () {

            if (
                this.classList.contains(
                    "is-invalid"
                )
            ) {

                validateUserId();

            }

        }
    );

}


/* =========================================================
   16. PASSWORD LIVE VALIDATION
========================================================= */

if (loginPasswordInput) {

    loginPasswordInput.addEventListener(
        "blur",
        validateLoginPassword
    );


    loginPasswordInput.addEventListener(
        "input",
        function () {

            if (
                this.classList.contains(
                    "is-invalid"
                )
            ) {

                validateLoginPassword();

            }

        }
    );

}


/* =========================================================
   17. REMEMBER ME
========================================================= */

if (rememberMeCheckbox) {

    /*
     * Restore previous preference.
     */

    const rememberPreference =
        localStorage.getItem(
            "udyamSakhiRememberMe"
        );


    if (
        rememberPreference ===
        "true"
    ) {

        rememberMeCheckbox.checked =
            true;

    }


    /*
     * Save preference whenever changed.
     */

    rememberMeCheckbox.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "udyamSakhiRememberMe",
                this.checked
            );

        }
    );

}


/* =========================================================
   18. FORGOT PASSWORD
========================================================= */

if (forgotPasswordLink) {

    forgotPasswordLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showLoginAlert(
                "Password recovery will be available soon.",
                "info"
            );

        }
    );

}


/* =========================================================
   19. CHECK EXISTING LOGIN
========================================================= */

function checkExistingLogin() {

    const token =
        localStorage.getItem(
            "udyamSakhiToken"
        );


    /*
     * We are intentionally NOT redirecting
     * automatically yet.
     *
     * The final authentication guard will
     * be implemented with auth.js once
     * the backend is ready.
     */

    if (token) {

        console.log(
            "Existing Udyam Sakhi login session found."
        );

    }

}


/* =========================================================
   20. INITIALIZE LOGIN PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        hideLoginAlert();

        setLoginLoading(false);

        checkExistingLogin();

    }
);