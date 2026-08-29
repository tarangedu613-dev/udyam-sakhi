/* =========================================================
   UDYAM SAKHI
   AUTHENTICATION & SESSION MANAGEMENT
========================================================= */


/* =========================================================
   1. STORAGE KEYS
========================================================= */

const AUTH_TOKEN_KEY =
    "udyamSakhiToken";

const USER_ID_KEY =
    "udyamSakhiUserId";

const MEMBER_KEY =
    "udyamSakhiMember";

const LOGIN_DATA_KEY =
    "udyamSakhiLoginData";

const REMEMBER_ME_KEY =
    "udyamSakhiRememberMe";


/* =========================================================
   2. GET AUTH TOKEN
========================================================= */

function getAuthToken() {

    return localStorage.getItem(
        AUTH_TOKEN_KEY
    );

}


/* =========================================================
   3. GET LOGGED-IN USER ID
========================================================= */

function getLoggedInUserId() {

    return localStorage.getItem(
        USER_ID_KEY
    );

}


/* =========================================================
   4. GET MEMBER INFORMATION
========================================================= */

function getLoggedInMember() {

    const memberData =
        localStorage.getItem(
            MEMBER_KEY
        );


    if (!memberData) {

        return null;

    }


    try {

        return JSON.parse(
            memberData
        );

    } catch (error) {

        console.error(
            "Unable to read member data:",
            error
        );

        return null;

    }

}


/* =========================================================
   5. GET COMPLETE LOGIN DATA
========================================================= */

function getLoginData() {

    const loginData =
        localStorage.getItem(
            LOGIN_DATA_KEY
        );


    if (!loginData) {

        return null;

    }


    try {

        return JSON.parse(
            loginData
        );

    } catch (error) {

        console.error(
            "Unable to read login data:",
            error
        );

        return null;

    }

}


/* =========================================================
   6. CHECK WHETHER USER IS LOGGED IN
========================================================= */

function isLoggedIn() {

    const userId = getLoggedInUserId();
    const loginData = getLoginData();
    const member = getLoggedInMember();

    return Boolean(
        userId ||
        member ||
        loginData
    );
}
/* =========================================================
   7. SAVE AUTH SESSION
========================================================= */

function saveAuthSession(data) {

    if (!data) {

        return;

    }


    /*
     * Save authentication token.
     */

    if (data.token) {

        localStorage.setItem(
            AUTH_TOKEN_KEY,
            data.token
        );

    }


    /*
     * Save User ID.
     */

    if (data.userId) {

        localStorage.setItem(
            USER_ID_KEY,
            data.userId
        );

    }


    /*
     * Save member information.
     */

    if (data.member) {

        localStorage.setItem(
            MEMBER_KEY,
            JSON.stringify(
                data.member
            )
        );

    }


    /*
     * Save complete login response.
     */

    localStorage.setItem(
        LOGIN_DATA_KEY,
        JSON.stringify(data)
    );

}


/* =========================================================
   8. CLEAR AUTH SESSION
========================================================= */

function clearAuthSession() {

    localStorage.removeItem(
        AUTH_TOKEN_KEY
    );

    localStorage.removeItem(
        USER_ID_KEY
    );

    localStorage.removeItem(
        MEMBER_KEY
    );

    localStorage.removeItem(
        LOGIN_DATA_KEY
    );

}


/* =========================================================
   9. LOGOUT
========================================================= */

function logoutUser() {

    clearAuthSession();


    /*
     * Keep Remember Me preference.
     *
     * The user can still choose whether
     * they want the preference remembered.
     */

    window.location.href =
        "login.html";

}


/* =========================================================
   10. AUTHENTICATION GUARD
========================================================= */

function requireAuthentication() {

    if (!isLoggedIn()) {

        /*
         * Remember where the user was trying
         * to go. This can be used later to
         * redirect them back after login.
         */

        sessionStorage.setItem(
            "udyamSakhiRedirectAfterLogin",
            window.location.href
        );


        window.location.href =
            "login.html";

        return false;

    }


    return true;

}


/* =========================================================
   11. REDIRECT AFTER LOGIN
========================================================= */

function redirectAfterLogin() {

    const redirectUrl =
        sessionStorage.getItem(
            "udyamSakhiRedirectAfterLogin"
        );


    if (redirectUrl) {

        sessionStorage.removeItem(
            "udyamSakhiRedirectAfterLogin"
        );


        window.location.href =
            redirectUrl;

        return;

    }


    window.location.href =
        "dashboard.html";

}


/* =========================================================
   12. AUTHENTICATED FETCH
========================================================= */

async function authenticatedFetch(
    url,
    options = {}
) {

    const token =
        getAuthToken();


    /*
     * If there is no token, send the user
     * to the login page.
     */

    if (!token) {

        window.location.href =
            "login.html";

        return null;

    }


    /*
     * Copy existing headers.
     */

    const headers = {

        ...(options.headers || {}),

        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${token}`

    };


    try {

        const response =
            await fetch(
                url,
                {
                    ...options,
                    headers
                }
            );


        /*
         * Token expired or unauthorized.
         */

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            clearAuthSession();


            window.location.href =
                "login.html";


            return null;

        }


        return response;

    } catch (error) {

        console.error(
            "Authenticated request failed:",
            error
        );

        throw error;

    }

}


/* =========================================================
   13. GET CURRENT MEMBER NAME
========================================================= */

function getMemberDisplayName() {

    const member =
        getLoggedInMember();


    if (
        member &&
        member.fullName
    ) {

        return member.fullName;

    }


    return "Member";

}


/* =========================================================
   14. GET MEMBER FIRST NAME
========================================================= */

function getMemberFirstName() {

    const fullName =
        getMemberDisplayName();


    if (!fullName) {

        return "Member";

    }


    const nameParts =
        fullName.trim().split(/\s+/);


    return nameParts[0] ||
        "Member";

}


/* =========================================================
   15. GET MEMBER INITIALS
========================================================= */

function getMemberInitials() {

    const fullName =
        getMemberDisplayName();


    if (
        !fullName ||
        fullName === "Member"
    ) {

        return "M";

    }


    const nameParts =
        fullName
            .trim()
            .split(/\s+/);


    if (nameParts.length === 1) {

        return nameParts[0]
            .charAt(0)
            .toUpperCase();

    }


    return (
        nameParts[0].charAt(0) +
        nameParts[
            nameParts.length - 1
        ].charAt(0)
    ).toUpperCase();

}


/* =========================================================
   16. UPDATE COMMON MEMBER UI
========================================================= */

function updateMemberUI() {

    const member =
        getLoggedInMember();


    const memberNameElements =
        document.querySelectorAll(
            "[data-member-name]"
        );


    const memberIdElements =
        document.querySelectorAll(
            "[data-member-id]"
        );


    const memberInitialElements =
        document.querySelectorAll(
            "[data-member-initials]"
        );


    /*
     * Member name
     */

    memberNameElements.forEach(
        function (element) {

            element.textContent =
                getMemberDisplayName();

        }
    );


    /*
     * User ID
     */

    const userId =
        getLoggedInUserId();


    memberIdElements.forEach(
        function (element) {

            element.textContent =
                userId || "—";

        }
    );


    /*
     * Initials
     */

    const initials =
        getMemberInitials();


    memberInitialElements.forEach(
        function (element) {

            element.textContent =
                initials;

        }
    );


    /*
     * If member data exists,
     * populate common fields.
     */

    if (member) {

        const emailElements =
            document.querySelectorAll(
                "[data-member-email]"
            );


        emailElements.forEach(
            function (element) {

                element.textContent =
                    member.email || "—";

            }
        );


        const mobileElements =
            document.querySelectorAll(
                "[data-member-mobile]"
            );


        mobileElements.forEach(
            function (element) {

                element.textContent =
                    member.phone || "—";

            }
        );

    }

}


/* =========================================================
   17. PROTECT CURRENT PAGE
========================================================= */

function protectPage() {

    return requireAuthentication();

}


/* =========================================================
   18. AUTO UPDATE MEMBER UI
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Only update the UI if the page
         * contains member-related elements.
         */

        if (
            document.querySelector(
                "[data-member-name]"
            ) ||
            document.querySelector(
                "[data-member-id]"
            ) ||
            document.querySelector(
                "[data-member-initials]"
            )
        ) {

            updateMemberUI();

        }

    }
);