/* =========================================================
   UDYAM SAKHI
   MEMBER DASHBOARD JAVASCRIPT
========================================================= */


/* =========================================================
   1. DOM ELEMENTS
========================================================= */

const dashboardSidebar =
    document.getElementById("dashboardSidebar");

const dashboardMenuBtn =
    document.getElementById("dashboardMenuBtn");

const sidebarCloseBtn =
    document.getElementById("sidebarCloseBtn");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const logoutButton =
    document.getElementById("logoutButton");

const confirmLogoutButton =
    document.getElementById("confirmLogoutButton");


/* =========================================================
   2. PROTECT DASHBOARD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Dashboard can only be accessed by
         * an authenticated member.
         */

        if (typeof requireAuthentication === "function") {

            const authenticated =
                requireAuthentication();


            if (!authenticated) {

                return;

            }

        }


        initializeDashboard();

    }
);


/* =========================================================
   3. INITIALIZE DASHBOARD
========================================================= */

function initializeDashboard() {

    setupSidebar();

    setupLogout();

    setupSidebarNavigation();

    updateDashboardMemberInformation();

    setupNotificationButton();

    setupResponsiveDashboard();

    loadUserCredits();

}

async function loadUserCredits() {

    const creditsElement =
        document.getElementById("userCredits");

    if (!creditsElement) {
        return;
    }

    // Backend credit API ready hone ke baad
    // yahan actual API call connect karenge.

    creditsElement.textContent = "0";
}

/* =========================================================
   4. SIDEBAR SETUP
========================================================= */

function setupSidebar() {

    if (dashboardMenuBtn) {

        dashboardMenuBtn.addEventListener(
            "click",
            openSidebar
        );

    }


    if (sidebarCloseBtn) {

        sidebarCloseBtn.addEventListener(
            "click",
            closeSidebar
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /*
     * Close sidebar with Escape key.
     */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeSidebar();

            }

        }
    );

}


/* =========================================================
   5. OPEN SIDEBAR
========================================================= */

function openSidebar() {

    if (!dashboardSidebar) {

        return;

    }


    dashboardSidebar.classList.add(
        "sidebar-open"
    );


    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "overlay-visible"
        );

    }


    document.body.classList.add(
        "sidebar-is-open"
    );

}


/* =========================================================
   6. CLOSE SIDEBAR
========================================================= */

function closeSidebar() {

    if (!dashboardSidebar) {

        return;

    }


    dashboardSidebar.classList.remove(
        "sidebar-open"
    );


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "overlay-visible"
        );

    }


    document.body.classList.remove(
        "sidebar-is-open"
    );

}


/* =========================================================
   7. SIDEBAR NAVIGATION
========================================================= */

function setupSidebarNavigation() {

    const navigationLinks =
        document.querySelectorAll(
            ".sidebar-nav-link"
        );


    navigationLinks.forEach(
        function (link) {

            /*
             * Logout button is handled separately.
             */

            if (
                link.classList.contains(
                    "sidebar-logout"
                )
            ) {

                return;

            }


            link.addEventListener(
                "click",
                function () {

                    /*
                     * Remove active class
                     * from all navigation links.
                     */

                    navigationLinks.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    /*
                     * Set clicked link active.
                     */

                    link.classList.add(
                        "active"
                    );


                    /*
                     * Close mobile sidebar.
                     */

                    closeSidebar();

                }
            );

        }
    );

}


/* =========================================================
   8. LOGOUT SETUP
========================================================= */

function setupLogout() {

    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        function () {

            openLogoutModal();

        }
    );


    if (confirmLogoutButton) {

        confirmLogoutButton.addEventListener(
            "click",
            function () {

                performLogout();

            }
        );

    }

}


/* =========================================================
   9. OPEN LOGOUT MODAL
========================================================= */

function openLogoutModal() {

    const logoutModalElement =
        document.getElementById(
            "logoutModal"
        );


    /*
     * Bootstrap modal is available because
     * bootstrap.bundle.js is loaded in dashboard.html.
     */

    if (
        logoutModalElement &&
        typeof bootstrap !== "undefined"
    ) {

        const logoutModal =
            bootstrap.Modal.getOrCreateInstance(
                logoutModalElement
            );


        logoutModal.show();


        return;

    }


    /*
     * Fallback if Bootstrap isn't available.
     */

    const confirmLogout =
        window.confirm(
            "Are you sure you want to sign out of your Udyam Sakhi account?"
        );


    if (confirmLogout) {

        performLogout();

    }

}


/* =========================================================
   10. PERFORM LOGOUT
========================================================= */

function performLogout() {

    /*
     * Use auth.js logout function.
     */

    if (
        typeof logoutUser === "function"
    ) {

        logoutUser();

        return;

    }


    /*
     * Fallback.
     */

    localStorage.removeItem(
        "udyamSakhiToken"
    );

    localStorage.removeItem(
        "udyamSakhiUserId"
    );

    localStorage.removeItem(
        "udyamSakhiMember"
    );

    localStorage.removeItem(
        "udyamSakhiLoginData"
    );


    window.location.href =
        "login.html";

}


/* =========================================================
   11. UPDATE DASHBOARD MEMBER INFORMATION
========================================================= */

function updateDashboardMemberInformation() {

    /*
     * auth.js already provides the common
     * member UI updater.
     */

    if (
        typeof updateMemberUI === "function"
    ) {

        updateMemberUI();

    }


    /*
     * Update first name separately.
     */

    const firstNameElements =
        document.querySelectorAll(
            "[data-member-first-name]"
        );


    if (
        typeof getMemberFirstName === "function"
    ) {

        const firstName =
            getMemberFirstName();


        firstNameElements.forEach(
            function (element) {

                element.textContent =
                    firstName;

            }
        );

    }

}


/* =========================================================
   12. NOTIFICATION BUTTON
========================================================= */

function setupNotificationButton() {

    const notificationButton =
        document.querySelector(
            ".dashboard-notification-btn"
        );


    if (!notificationButton) {

        return;

    }


    notificationButton.addEventListener(
        "click",
        function () {

            showDashboardMessage(
                "No new notifications at the moment.",
                "info"
            );

        }
    );

}


/* =========================================================
   13. DASHBOARD MESSAGE
========================================================= */

function showDashboardMessage(
    message,
    type = "info"
) {

    /*
     * Look for an existing toast container.
     */

    let toastContainer =
        document.getElementById(
            "dashboardToastContainer"
        );


    /*
     * Create one if it doesn't exist.
     */

    if (!toastContainer) {

        toastContainer =
            document.createElement(
                "div"
            );

        toastContainer.id =
            "dashboardToastContainer";

        toastContainer.className =
            "dashboard-toast-container";


        document.body.appendChild(
            toastContainer
        );

    }


    /*
     * Create toast.
     */

    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `dashboard-toast dashboard-toast-${type}`;


    toast.innerHTML = `

        <div class="dashboard-toast-icon">

            <i class="bi bi-info-circle"></i>

        </div>

        <div class="dashboard-toast-content">

            <strong>
                Udyam Sakhi
            </strong>

            <span>
                ${escapeDashboardHTML(message)}
            </span>

        </div>

        <button
            type="button"
            class="dashboard-toast-close"
            aria-label="Close">

            <i class="bi bi-x"></i>

        </button>

    `;


    toastContainer.appendChild(
        toast
    );


    /*
     * Close button.
     */

    const closeButton =
        toast.querySelector(
            ".dashboard-toast-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                removeDashboardToast(
                    toast
                );

            }
        );

    }


    /*
     * Automatically remove after 4 seconds.
     */

    setTimeout(
        function () {

            removeDashboardToast(
                toast
            );

        },
        4000
    );

}


/* =========================================================
   14. REMOVE TOAST
========================================================= */

function removeDashboardToast(
    toast
) {

    if (!toast) {

        return;

    }


    toast.classList.add(
        "toast-removing"
    );


    setTimeout(
        function () {

            if (
                toast.parentNode
            ) {

                toast.parentNode.removeChild(
                    toast
                );

            }

        },
        250
    );

}


/* =========================================================
   15. ESCAPE HTML
========================================================= */

function escapeDashboardHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


/* =========================================================
   16. RESPONSIVE DASHBOARD
========================================================= */

function setupResponsiveDashboard() {

    /*
     * Close mobile sidebar when the window
     * becomes desktop-sized.
     */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth >= 992
            ) {

                closeSidebar();

            }

        }
    );

}


/* =========================================================
   17. SMOOTH INTERNAL NAVIGATION
========================================================= */

function setupSmoothNavigation() {

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        event.preventDefault();

                        showDashboardMessage(
                            "This section will be available soon.",
                            "info"
                        );

                        return;

                    }


                    const targetElement =
                        document.querySelector(
                            targetId
                        );


                    if (!targetElement) {

                        event.preventDefault();

                        showDashboardMessage(
                            "This section will be available soon.",
                            "info"
                        );

                        return;

                    }


                    event.preventDefault();


                    targetElement.scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "start"
                        }
                    );


                    closeSidebar();

                }
            );

        }
    );

}


/* =========================================================
   18. INITIALIZE SMOOTH NAVIGATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupSmoothNavigation();

    }
);


/* =========================================================
   19. PREVENT BODY SCROLL WHEN SIDEBAR IS OPEN
========================================================= */

function updateBodyScrollState() {

    if (
        document.body.classList.contains(
            "sidebar-is-open"
        )
    ) {

        document.body.style.overflow =
            "hidden";

    } else {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   20. OBSERVE SIDEBAR STATE
========================================================= */

if (dashboardSidebar) {

    const sidebarObserver =
        new MutationObserver(
            function () {

                updateBodyScrollState();

            }
        );


    sidebarObserver.observe(
        dashboardSidebar,
        {
            attributes: true,
            attributeFilter: [
                "class"
            ]
        }
    );

}


/* =========================================================
   21. DASHBOARD PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            /*
             * Refresh member information when
             * returning to the dashboard.
             */

            updateDashboardMemberInformation();

        }

    }
);


/* =========================================================
   22. LOG CURRENT USER
========================================================= */

function debugDashboardUser() {

    if (
        typeof getLoggedInMember !==
        "function"
    ) {

        return;

    }


    const member =
        getLoggedInMember();


    const userId =
        typeof getLoggedInUserId ===
        "function"
            ? getLoggedInUserId()
            : null;


    console.log(
        "Udyam Sakhi Dashboard User:",
        {
            userId: userId,
            member: member
        }
    );

}