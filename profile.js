/* =========================================================
   UDYAM SAKHI
   PROFILE PAGE JAVASCRIPT
   Connected to Spring Boot + MongoDB
========================================================= */

const API_BASE_URL = "https://udyam-sakhi.onrender.com";


/* =========================================================
   1. PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Protect page when auth.js provides this function
    if (
        typeof protectPage === "function" &&
        !protectPage()
    ) {
        return;
    }

    initializeProfilePage();

});


/* =========================================================
   2. INITIALIZE PROFILE PAGE
========================================================= */

function initializeProfilePage() {

    loadMemberProfile();

    initializeEditProfile();

    initializeSupportLink();

}


/* =========================================================
   3. GET LOGGED-IN USER ID
========================================================= */

function getLoggedInUserId() {

    return localStorage.getItem(
        "udyamSakhiUserId"
    );

}


/* =========================================================
   4. GET LOGGED-IN MEMBER
========================================================= */

function getLoggedInMember() {

    const storedMember =
        localStorage.getItem(
            "udyamSakhiMember"
        );

    if (!storedMember) {
        return null;
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

        console.error(
            "Unable to parse stored member:",
            error
        );

    }

    return null;
}


/* =========================================================
   5. LOAD PROFILE FROM BACKEND
========================================================= */

async function loadMemberProfile() {

    const userId =
        getLoggedInUserId();

    if (!userId) {

        showProfileMessage(
            "User session not found. Please login again.",
            "error"
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/auth/user/${encodeURIComponent(userId)}`
            );

        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                `Unable to load profile (${response.status})`
            );
        }

        const member =
            await response.json();

        /*
         * Keep the latest database data
         * in the frontend session.
         */

        window.currentUdyamMember =
            member;

        localStorage.setItem(
            "udyamSakhiMember",
            JSON.stringify(member)
        );

        localStorage.setItem(
            "udyamSakhiLoginData",
            JSON.stringify(member)
        );

        localStorage.setItem(
            "udyamSakhiUserId",
            member.id || userId
        );

        updateProfileUI(member);

    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        /*
         * Fallback to saved local data.
         */

        const localMember =
            getLoggedInMember();

        if (localMember) {

            window.currentUdyamMember =
                localMember;

            updateProfileUI(
                localMember
            );

        } else {

            showProfileMessage(
                "Unable to load your profile.",
                "error"
            );

        }

    }

}


/* =========================================================
   6. UPDATE PROFILE UI
========================================================= */

function updateProfileUI(member) {

    if (!member) {
        return;
    }

    window.currentUdyamMember =
        member;

    setMemberName(member);

    setMemberInitials(member);

    setMemberEmail(member);

    setMemberMobile(member);

    setMemberId(member);

    setMemberDob(member);

    setMemberGender(member);

    setMemberAddress(member);

    setMemberSince(member);

    setBusinessInformation(member);

}


/* =========================================================
   7. MEMBER NAME
========================================================= */

function setMemberName(member) {

    const name =
        member?.fullName ||
        member?.name ||
        "Member";

    document
        .querySelectorAll(
            "[data-member-name]"
        )
        .forEach(function (element) {

            element.textContent =
                name;

        });

}


/* =========================================================
   8. MEMBER INITIALS
========================================================= */

function setMemberInitials(member) {

    const name =
        member?.fullName ||
        member?.name ||
        "Member";

    const initials =
        getInitials(name);

    document
        .querySelectorAll(
            "[data-member-initials]"
        )
        .forEach(function (element) {

            element.textContent =
                initials;

        });

}


/* =========================================================
   9. GET INITIALS
========================================================= */

function getInitials(name) {

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
   10. MEMBER EMAIL
========================================================= */

function setMemberEmail(member) {

    const email =
        member?.email ||
        "Not added";

    document
        .querySelectorAll(
            "[data-member-email]"
        )
        .forEach(function (element) {

            element.textContent =
                email;

        });

}


/* =========================================================
   11. MEMBER PHONE
========================================================= */

function setMemberMobile(member) {

    const phone =
        member?.phone ||
        member?.mobile ||
        "Not added";

    document
        .querySelectorAll(
            "[data-member-mobile]"
        )
        .forEach(function (element) {

            element.textContent =
                phone;

        });

}


/* =========================================================
   12. MEMBER ID
========================================================= */

function setMemberId(member) {

    const memberId =
        member?.id ||
        member?.memberId ||
        "—";

    document
        .querySelectorAll(
            "[data-member-id]"
        )
        .forEach(function (element) {

            element.textContent =
                memberId;

        });

}


/* =========================================================
   13. DATE OF BIRTH
========================================================= */

function setMemberDob(member) {

    const dob =
        member?.dob ||
        member?.dateOfBirth ||
        "";

    document
        .querySelectorAll(
            "[data-member-dob]"
        )
        .forEach(function (element) {

            element.textContent =
                dob
                    ? formatDate(dob)
                    : "Not added";

        });

}


/* =========================================================
   14. GENDER
========================================================= */

function setMemberGender(member) {

    const gender =
        member?.gender ||
        "";

    document
        .querySelectorAll(
            "[data-member-gender]"
        )
        .forEach(function (element) {

            element.textContent =
                gender ||
                "Not added";

        });

}


/* =========================================================
   15. ADDRESS
========================================================= */

function setMemberAddress(member) {

    let address =
        member?.address ||
        "";

    /*
     * Add city and state only if they
     * are not already included.
     */

    if (
        member?.city &&
        !address.includes(member.city)
    ) {

        address +=
            address
                ? ", " + member.city
                : member.city;

    }

    if (
        member?.state &&
        !address.includes(member.state)
    ) {

        address +=
            address
                ? ", " + member.state
                : member.state;

    }

    document
        .querySelectorAll(
            "[data-member-address]"
        )
        .forEach(function (element) {

            element.textContent =
                address ||
                "Not added";

        });

}


/* =========================================================
   16. MEMBER SINCE
========================================================= */

function setMemberSince(member) {

    const memberSince =
        member?.memberSince ||
        member?.createdAt ||
        member?.created_at ||
        "";

    document
        .querySelectorAll(
            "[data-member-since]"
        )
        .forEach(function (element) {

            element.textContent =
                memberSince
                    ? formatDate(memberSince)
                    : "—";

        });

}


/* =========================================================
   17. BUSINESS INFORMATION
========================================================= */

function setBusinessInformation(member) {

    const businessName =
        member?.businessName ||
        "";

    const businessType =
        member?.businessType ||
        "";

    const udyamNumber =
        member?.udyamNumber ||
        "";

    const businessCategory =
        member?.businessCategory ||
        "";

    const businessAddress =
        member?.businessAddress ||
        member?.address ||
        "";


    document
        .querySelectorAll(
            "[data-business-name]"
        )
        .forEach(function (element) {

            element.textContent =
                businessName ||
                "Not added";

        });


    document
        .querySelectorAll(
            "[data-business-type]"
        )
        .forEach(function (element) {

            element.textContent =
                businessType ||
                "Not added";

        });


    document
        .querySelectorAll(
            "[data-udyam-number]"
        )
        .forEach(function (element) {

            element.textContent =
                udyamNumber ||
                "Not added";

        });


    document
        .querySelectorAll(
            "[data-business-category]"
        )
        .forEach(function (element) {

            element.textContent =
                businessCategory ||
                "Not added";

        });


    document
        .querySelectorAll(
            "[data-business-address]"
        )
        .forEach(function (element) {

            element.textContent =
                businessAddress ||
                "Not added";

        });

}


/* =========================================================
   18. FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "—";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(dateValue);

    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   19. INITIALIZE EDIT PROFILE
========================================================= */

function initializeEditProfile() {

    document.addEventListener("click", function (event) {

        const clickedElement =
            event.target.closest("button, a");

        if (!clickedElement) {
            return;
        }


        const buttonText =
            clickedElement.textContent
                .trim()
                .replace(/\s+/g, " ")
                .toLowerCase();


        const isEditButton =
            clickedElement.id === "editPersonalInfoButton" ||
            buttonText === "edit profile";


        if (!isEditButton) {
            return;
        }


        /*
         * Prevent <a href="profile.html"> from
         * navigating away.
         */

        event.preventDefault();

        event.stopPropagation();


        openEditProfileMode();

    });

}


/* =========================================================
   20. OPEN EDIT PROFILE MODAL
========================================================= */

function openEditProfileMode() {

    const member =
        window.currentUdyamMember ||
        getLoggedInMember();


    if (!member) {

        showProfileMessage(
            "Profile data is not available.",
            "error"
        );

        return;
    }


    const existingModal =
        document.getElementById(
            "profileEditModal"
        );


    if (existingModal) {
        existingModal.remove();
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "profileEditModal";


    modal.innerHTML = `

        <div class="profile-edit-overlay"></div>

        <div class="profile-edit-box">

            <div class="profile-edit-header">

                <div>

                    <span class="profile-edit-label">
                        EDIT PROFILE
                    </span>

                    <h2>
                        Update Your Information
                    </h2>

                    <p>
                        Keep your Udyam Sakhi profile up to date.
                    </p>

                </div>


                <button
                    type="button"
                    id="closeProfileEdit"
                    class="profile-edit-close"
                    aria-label="Close"
                >

                    <i class="bi bi-x-lg"></i>

                </button>

            </div>


            <form id="profileEditForm">

                <div class="profile-edit-grid">


                    <!-- Full Name -->

                    <div class="profile-edit-field">

                        <label for="editFullName">
                            Full Name
                        </label>

                        <input
                            id="editFullName"
                            name="fullName"
                            type="text"
                            autocomplete="name"
                            value="${escapeAttribute(
                                member.fullName ||
                                member.name ||
                                ""
                            )}"
                            required
                        >

                    </div>


                    <!-- Phone -->

                    <div class="profile-edit-field">

                        <label for="editPhone">
                            Mobile Number
                        </label>

                        <input
                            id="editPhone"
                            name="phone"
                            type="tel"
                            inputmode="numeric"
                            maxlength="10"
                            autocomplete="tel"
                            value="${escapeAttribute(
                                member.phone ||
                                member.mobile ||
                                ""
                            )}"
                            required
                        >

                    </div>


                    <!-- Email -->

                    <div class="profile-edit-field">

                        <label for="editEmail">
                            Email Address
                        </label>

                        <input
                            id="editEmail"
                            type="email"
                            value="${escapeAttribute(
                                member.email ||
                                ""
                            )}"
                            disabled
                        >

                        <small>
                            Email cannot be changed here.
                        </small>

                    </div>


                    <!-- Business Name -->

                    <div class="profile-edit-field">

                        <label for="editBusinessName">
                            Business Name
                        </label>

                        <input
                            id="editBusinessName"
                            name="businessName"
                            type="text"
                            value="${escapeAttribute(
                                member.businessName ||
                                ""
                            )}"
                        >

                    </div>


                    <!-- Business Type -->

                    <div class="profile-edit-field">

                        <label for="editBusinessType">
                            Business Type
                        </label>

                        <input
                            id="editBusinessType"
                            name="businessType"
                            type="text"
                            value="${escapeAttribute(
                                member.businessType ||
                                ""
                            )}"
                        >

                    </div>


                    <!-- Udyam Number -->

                    <div class="profile-edit-field">

                        <label for="editUdyamNumber">
                            Udyam Registration Number
                        </label>

                        <input
                            id="editUdyamNumber"
                            name="udyamNumber"
                            type="text"
                            value="${escapeAttribute(
                                member.udyamNumber ||
                                ""
                            )}"
                        >

                    </div>


                    <!-- Address -->

                    <div class="profile-edit-field profile-edit-full">

                        <label for="editAddress">
                            Address
                        </label>

                        <textarea
                            id="editAddress"
                            name="address"
                            rows="3"
                        >${escapeHtml(
                            member.address ||
                            ""
                        )}</textarea>

                    </div>


                    <!-- City -->

                    <div class="profile-edit-field">

                        <label for="editCity">
                            City
                        </label>

                        <input
                            id="editCity"
                            name="city"
                            type="text"
                            value="${escapeAttribute(
                                member.city ||
                                ""
                            )}"
                        >

                    </div>


                    <!-- State -->

                    <div class="profile-edit-field">

                        <label for="editState">
                            State
                        </label>

                        <input
                            id="editState"
                            name="state"
                            type="text"
                            value="${escapeAttribute(
                                member.state ||
                                ""
                            )}"
                        >

                    </div>

                </div>


                <div class="profile-edit-info">

                    <i class="bi bi-database-check"></i>

                    <span>
                        Changes will be saved to your Udyam Sakhi account.
                    </span>

                </div>


                <div class="profile-edit-actions">

                    <button
                        type="button"
                        id="cancelProfileEdit"
                        class="profile-edit-cancel"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        id="saveProfileChanges"
                        class="profile-edit-save"
                    >

                        <i class="bi bi-check2"></i>

                        Save Changes

                    </button>

                </div>

            </form>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    /*
     * Close button
     */

    document
        .getElementById(
            "closeProfileEdit"
        )
        .addEventListener(
            "click",
            closeEditProfile
        );


    /*
     * Cancel button
     */

    document
        .getElementById(
            "cancelProfileEdit"
        )
        .addEventListener(
            "click",
            closeEditProfile
        );


    /*
     * Click outside modal
     */

    document
        .querySelector(
            "#profileEditModal .profile-edit-overlay"
        )
        .addEventListener(
            "click",
            closeEditProfile
        );


    /*
     * Form submit
     */

    document
        .getElementById(
            "profileEditForm"
        )
        .addEventListener(
            "submit",
            handleProfileUpdate
        );

}


/* =========================================================
   21. SAVE PROFILE
========================================================= */

async function handleProfileUpdate(event) {

    event.preventDefault();


    const userId =
        getLoggedInUserId();


    if (!userId) {

        showProfileMessage(
            "Your session has expired. Please login again.",
            "error"
        );

        return;
    }


    /*
     * Read values from form.
     */

    const fullName =
        document
            .getElementById(
                "editFullName"
            )
            .value
            .trim();


    const phone =
        document
            .getElementById(
                "editPhone"
            )
            .value
            .trim();


    const businessName =
        document
            .getElementById(
                "editBusinessName"
            )
            .value
            .trim();


    const businessType =
        document
            .getElementById(
                "editBusinessType"
            )
            .value
            .trim();


    const udyamNumber =
        document
            .getElementById(
                "editUdyamNumber"
            )
            .value
            .trim();


    const address =
        document
            .getElementById(
                "editAddress"
            )
            .value
            .trim();


    const city =
        document
            .getElementById(
                "editCity"
            )
            .value
            .trim();


    const state =
        document
            .getElementById(
                "editState"
            )
            .value
            .trim();


    /*
     * Validation
     */

    if (!fullName) {

        showProfileMessage(
            "Full Name is required.",
            "error"
        );

        return;
    }


    if (!/^\d{10}$/.test(phone)) {

        showProfileMessage(
            "Please enter a valid 10-digit mobile number.",
            "error"
        );

        return;
    }


    /*
     * Existing user data
     */

    const currentUser =
        window.currentUdyamMember ||
        getLoggedInMember() ||
        {};


    /*
     * IMPORTANT:
     *
     * Backend updateUser() updates these fields:
     * fullName
     * phone
     * businessName
     * businessType
     * udyamNumber
     * address
     * city
     * state
     *
     * Email remains unchanged.
     */

    const updatedUser = {

        id:
            currentUser.id ||
            userId,

        fullName:
            fullName,

        email:
            currentUser.email ||
            "",

        phone:
            phone,

        businessName:
            businessName,

        businessType:
            businessType,

        udyamNumber:
            udyamNumber,

        address:
            address,

        city:
            city,

        state:
            state

    };


    const saveButton =
        document.getElementById(
            "saveProfileChanges"
        );


    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
            ></span>

            Saving...
        `;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/auth/user/${encodeURIComponent(userId)}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedUser
                        )
                }
            );


        if (!response.ok) {

            let errorMessage =
                "Unable to update your profile.";

            try {

                const responseText =
                    await response.text();

                if (responseText) {
                    errorMessage =
                        responseText;
                }

            } catch (ignored) {
                // Keep default error
            }


            throw new Error(
                errorMessage
            );

        }


        /*
         * Backend returns updated User.
         */

        const savedUser =
            await response.json();


        /*
         * Update frontend state.
         */

        window.currentUdyamMember =
            savedUser;


        /*
         * Update localStorage.
         */

        localStorage.setItem(
            "udyamSakhiMember",
            JSON.stringify(
                savedUser
            )
        );


        localStorage.setItem(
            "udyamSakhiLoginData",
            JSON.stringify(
                savedUser
            )
        );


        localStorage.setItem(
            "udyamSakhiUserId",
            savedUser.id ||
            userId
        );


        /*
         * Immediately update page.
         */

        updateProfileUI(
            savedUser
        );


        /*
         * Close modal.
         */

        closeEditProfile();


        /*
         * Success message.
         */

        showProfileMessage(
            "Profile updated successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Profile update error:",
            error
        );


        showProfileMessage(
            error.message ||
            "Unable to update your profile.",
            "error"
        );


        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.innerHTML = `
                <i class="bi bi-check2"></i>
                Save Changes
            `;

        }

    }

}


/* =========================================================
   22. CLOSE EDIT PROFILE
========================================================= */

function closeEditProfile() {

    const modal =
        document.getElementById(
            "profileEditModal"
        );


    if (modal) {
        modal.remove();
    }

}


/* =========================================================
   23. SUPPORT LINK
========================================================= */

function initializeSupportLink() {

    const supportLink =
        document.getElementById(
            "profileSupportLink"
        );


    if (!supportLink) {
        return;
    }


    supportLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showProfileMessage(
                "Support contact will be connected to the support module.",
                "info"
            );

        }
    );

}


/* =========================================================
   24. PROFILE MESSAGE
========================================================= */

function showProfileMessage(
    message,
    type = "info"
) {

    const existingToast =
        document.querySelector(
            ".profile-message-toast"
        );


    if (existingToast) {
        existingToast.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `profile-message-toast profile-message-${type}`;


    const icon =
        type === "success"
            ? "bi-check-circle"
            : type === "error"
                ? "bi-exclamation-circle"
                : "bi-info-circle";


    toast.innerHTML = `

        <div class="profile-message-icon">

            <i class="bi ${icon}"></i>

        </div>


        <div class="profile-message-content">

            <strong>
                Udyam Sakhi
            </strong>

            <span>
                ${escapeHtml(message)}
            </span>

        </div>


        <button
            type="button"
            class="profile-message-close"
            aria-label="Close"
        >

            <i class="bi bi-x"></i>

        </button>

    `;


    document.body.appendChild(
        toast
    );


    const closeButton =
        toast.querySelector(
            ".profile-message-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                removeProfileMessage(
                    toast
                );

            }
        );

    }


    setTimeout(
        function () {

            removeProfileMessage(
                toast
            );

        },
        4500
    );

}


/* =========================================================
   25. REMOVE PROFILE MESSAGE
========================================================= */

function removeProfileMessage(
    toast
) {

    if (!toast) {
        return;
    }


    toast.classList.add(
        "profile-message-removing"
    );


    setTimeout(
        function () {

            if (
                toast &&
                toast.parentNode
            ) {

                toast.remove();

            }

        },
        250
    );

}


/* =========================================================
   26. ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    const temporaryElement =
        document.createElement(
            "div"
        );


    temporaryElement.textContent =
        value == null
            ? ""
            : String(value);


    return temporaryElement.innerHTML;

}


/* =========================================================
   27. ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {

    return escapeHtml(
        value
    )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   28. REFRESH PROFILE
========================================================= */

function refreshProfile() {

    loadMemberProfile();

}


/* =========================================================
   29. EXPORT
========================================================= */

window.refreshProfile =
    refreshProfile;