/* =========================================================
   UDYAM SAKHI
   BUSINESS PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   1. PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeBusinessPage();

});


/* =========================================================
   2. INITIALIZE BUSINESS PAGE
========================================================= */

function initializeBusinessPage() {

    loadBusinessInformation();

    initializeBusinessEdit();

    initializeBusinessSupport();

}


/* =========================================================
   3. GET MEMBER DATA
========================================================= */

function getBusinessMember() {

    const possibleKeys = [
        "loggedInMember",
        "currentMember",
        "member",
        "user",
        "udyamSakhiMember"
    ];


    for (const key of possibleKeys) {

        const storedMember =
            localStorage.getItem(key);


        if (!storedMember) {
            continue;
        }


        try {

            const member =
                JSON.parse(storedMember);


            if (
                member &&
                typeof member === "object"
            ) {

                return member;

            }

        } catch (error) {

            console.warn(
                `Unable to read ${key}.`,
                error
            );

        }

    }


    /*
     * Fallback object.
     *
     * This keeps the frontend working until
     * the Spring Boot backend is connected.
     */

    return {

        name:
            localStorage.getItem("memberName") ||
            localStorage.getItem("name") ||
            "Member",

        businessName:
            localStorage.getItem("businessName") ||
            localStorage.getItem("business_name") ||
            "",

        businessType:
            localStorage.getItem("businessType") ||
            localStorage.getItem("business_type") ||
            "",

        businessCategory:
            localStorage.getItem("businessCategory") ||
            localStorage.getItem("business_category") ||
            "",

        udyamNumber:
            localStorage.getItem("udyamNumber") ||
            localStorage.getItem("udyam_number") ||
            "",

        businessAddress:
            localStorage.getItem("businessAddress") ||
            localStorage.getItem("business_address") ||
            ""

    };

}


/* =========================================================
   4. LOAD BUSINESS INFORMATION
========================================================= */

function loadBusinessInformation() {

    const member =
        getBusinessMember();


    window.currentBusinessMember =
        member;


    updateMemberHeader(member);

    updateBusinessName(member);

    updateBusinessType(member);

    updateBusinessCategory(member);

    updateUdyamNumber(member);

    updateBusinessAddress(member);

}


/* =========================================================
   5. UPDATE MEMBER HEADER
========================================================= */

function updateMemberHeader(member) {

    const name =
        member.name ||
        member.fullName ||
        member.full_name ||
        "Member";


    document
        .querySelectorAll("[data-member-name]")
        .forEach(function (element) {

            element.textContent = name;

        });


    const initials =
        getBusinessInitials(name);


    document
        .querySelectorAll("[data-member-initials]")
        .forEach(function (element) {

            element.textContent = initials;

        });

}


/* =========================================================
   6. MEMBER INITIALS
========================================================= */

function getBusinessInitials(name) {

    if (!name) {

        return "M";

    }


    const words =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();

}


/* =========================================================
   7. BUSINESS NAME
========================================================= */

function updateBusinessName(member) {

    const value =
        member.businessName ||
        member.business_name ||
        member.business ||
        "";


    setBusinessValue(
        "[data-business-name]",
        value
    );

}


/* =========================================================
   8. BUSINESS TYPE
========================================================= */

function updateBusinessType(member) {

    const value =
        member.businessType ||
        member.business_type ||
        "";


    setBusinessValue(
        "[data-business-type]",
        value
    );

}


/* =========================================================
   9. BUSINESS CATEGORY
========================================================= */

function updateBusinessCategory(member) {

    const value =
        member.businessCategory ||
        member.business_category ||
        member.category ||
        "";


    setBusinessValue(
        "[data-business-category]",
        value
    );

}


/* =========================================================
   10. UDYAM NUMBER
========================================================= */

function updateUdyamNumber(member) {

    const value =
        member.udyamNumber ||
        member.udyam_number ||
        member.udyamRegistrationNumber ||
        member.udyam_registration_number ||
        "";


    setBusinessValue(
        "[data-udyam-number]",
        value
    );

}


/* =========================================================
   11. BUSINESS ADDRESS
========================================================= */

function updateBusinessAddress(member) {

    const value =
        member.businessAddress ||
        member.business_address ||
        member.address ||
        "";


    setBusinessValue(
        "[data-business-address]",
        value
    );

}


/* =========================================================
   12. SET BUSINESS VALUE
========================================================= */

function setBusinessValue(
    selector,
    value
) {

    document
        .querySelectorAll(selector)
        .forEach(function (element) {

            element.textContent =
                value || "Not added";

        });

}


/* =========================================================
   13. EDIT BUSINESS BUTTON
========================================================= */

function initializeBusinessEdit() {

    const editButton =
        document.getElementById(
            "editBusinessButton"
        );


    if (!editButton) {

        return;

    }


    editButton.addEventListener(
        "click",
        function () {

            openBusinessEditMode();

        }
    );

}


/* =========================================================
   14. BUSINESS EDIT MODE
========================================================= */

function openBusinessEditMode() {

    /*
     * The actual edit form will be connected
     * to the Spring Boot API later.
     *
     * For now we show a clean frontend message.
     */

    showBusinessMessage(
        "Business editing will be available when the business profile form is connected.",
        "info"
    );

}


/* =========================================================
   15. BUSINESS SUPPORT
========================================================= */

function initializeBusinessSupport() {

    const supportLink =
        document.getElementById(
            "businessSupportLink"
        );


    if (!supportLink) {

        return;

    }


    supportLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showBusinessMessage(
                "Business support will be connected to the support module.",
                "info"
            );

        }
    );

}


/* =========================================================
   16. BUSINESS MESSAGE
========================================================= */

function showBusinessMessage(
    message,
    type = "info"
) {

    const existingMessage =
        document.querySelector(
            ".business-message-toast"
        );


    if (existingMessage) {

        existingMessage.remove();

    }


    const toast =
        document.createElement("div");


    toast.className =
        "business-message-toast";


    const icon =
        type === "success"
            ? "bi-check-circle"
            : "bi-info-circle";


    toast.innerHTML = `

        <div class="business-message-icon">

            <i class="bi ${icon}"></i>

        </div>


        <div class="business-message-content">

            <strong>
                Udyam Sakhi
            </strong>

            <span>
                ${escapeBusinessHtml(message)}
            </span>

        </div>


        <button
            type="button"
            class="business-message-close"
            aria-label="Close"
        >

            <i class="bi bi-x"></i>

        </button>

    `;


    document.body.appendChild(toast);


    const closeButton =
        toast.querySelector(
            ".business-message-close"
        );


    closeButton.addEventListener(
        "click",
        function () {

            removeBusinessMessage(toast);

        }
    );


    setTimeout(
        function () {

            removeBusinessMessage(toast);

        },
        4500
    );

}


/* =========================================================
   17. REMOVE BUSINESS MESSAGE
========================================================= */

function removeBusinessMessage(toast) {

    if (!toast) {

        return;

    }


    toast.classList.add(
        "business-message-removing"
    );


    setTimeout(
        function () {

            toast.remove();

        },
        250
    );

}


/* =========================================================
   18. ESCAPE HTML
========================================================= */

function escapeBusinessHtml(value) {

    const temporaryElement =
        document.createElement("div");


    temporaryElement.textContent =
        value;


    return temporaryElement.innerHTML;

}


/* =========================================================
   19. REFRESH BUSINESS INFORMATION
========================================================= */

function refreshBusinessPage() {

    loadBusinessInformation();

}


/* =========================================================
   20. EXPORT
========================================================= */

window.refreshBusinessPage =
    refreshBusinessPage;