/* =========================================================
   UDYAM SAKHI
   DOCUMENTS PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   1. PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeDocumentsPage();

});


/* =========================================================
   2. INITIALIZE DOCUMENTS PAGE
========================================================= */

function initializeDocumentsPage() {

    loadDocumentMember();

    initializeDocumentFilter();

    initializeDocumentUpload();

    initializeChecklistUpload();

    initializeDocumentActions();

    updateDocumentCounters();

}


/* =========================================================
   3. MEMBER INFORMATION
========================================================= */

function loadDocumentMember() {

    const member =
        getDocumentMember();


    const memberName =
        member.name ||
        member.fullName ||
        member.full_name ||
        "Member";


    const initials =
        getDocumentInitials(memberName);


    document
        .querySelectorAll("[data-member-name]")
        .forEach(function (element) {

            element.textContent =
                memberName;

        });


    document
        .querySelectorAll("[data-member-initials]")
        .forEach(function (element) {

            element.textContent =
                initials;

        });

}


/* =========================================================
   4. GET MEMBER DATA
========================================================= */

function getDocumentMember() {

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
                "Unable to read member information.",
                error
            );

        }

    }


    return {

        name:
            localStorage.getItem("memberName") ||
            localStorage.getItem("name") ||
            "Member"

    };

}


/* =========================================================
   5. MEMBER INITIALS
========================================================= */

function getDocumentInitials(name) {

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
   6. DOCUMENT FILTER
========================================================= */

function initializeDocumentFilter() {

    const filter =
        document.getElementById(
            "documentFilter"
        );


    if (!filter) {

        return;

    }


    filter.addEventListener(
        "change",
        function () {

            filterDocuments(
                this.value
            );

        }
    );

}


/* =========================================================
   7. FILTER DOCUMENTS
========================================================= */

function filterDocuments(status) {

    const documentRows =
        document.querySelectorAll(
            ".document-row"
        );


    let visibleDocuments = 0;


    documentRows.forEach(
        function (row) {

            const rowStatus =
                row.dataset.documentStatus;


            if (
                status === "all" ||
                rowStatus === status
            ) {

                row.style.display =
                    "grid";

                visibleDocuments++;

            } else {

                row.style.display =
                    "none";

            }

        }
    );


    updateEmptyState(
        visibleDocuments === 0
    );

}


/* =========================================================
   8. EMPTY STATE
========================================================= */

function updateEmptyState(show) {

    const emptyState =
        document.getElementById(
            "documentsEmptyState"
        );


    if (!emptyState) {

        return;

    }


    emptyState.style.display =
        show ? "flex" : "none";

}


/* =========================================================
   9. DOCUMENT UPLOAD
========================================================= */

function initializeDocumentUpload() {

    const uploadButton =
        document.getElementById(
            "uploadDocumentButton"
        );


    const fileInput =
        document.getElementById(
            "documentFileInput"
        );


    if (
        !uploadButton ||
        !fileInput
    ) {

        return;

    }


    uploadButton.addEventListener(
        "click",
        function () {

            fileInput.click();

        }
    );


    fileInput.addEventListener(
        "change",
        function () {

            handleDocumentUpload(
                this.files
            );

        }
    );

}


/* =========================================================
   10. HANDLE DOCUMENT UPLOAD
========================================================= */

function handleDocumentUpload(files) {

    if (
        !files ||
        files.length === 0
    ) {

        return;

    }


    const file =
        files[0];


    const allowedTypes = [

        "application/pdf",

        "image/jpeg",

        "image/png",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        showDocumentMessage(
            "Please select a PDF, JPG, PNG, DOC or DOCX file.",
            "error"
        );

        return;

    }


    const maxSize =
        10 * 1024 * 1024;


    if (file.size > maxSize) {

        showDocumentMessage(
            "The document size must be less than 10 MB.",
            "error"
        );

        return;

    }


    /*
     * Frontend demonstration only.
     *
     * Later this file will be sent to the
     * Spring Boot backend using FormData.
     */

    showDocumentMessage(
        `${file.name} selected successfully.`,
        "success"
    );


    addTemporaryDocument(
        file
    );

}


/* =========================================================
   11. ADD TEMPORARY DOCUMENT
========================================================= */

function addTemporaryDocument(file) {

    const documentsList =
        document.getElementById(
            "documentsList"
        );


    const emptyState =
        document.getElementById(
            "documentsEmptyState"
        );


    if (!documentsList) {

        return;

    }


    const documentRow =
        document.createElement("div");


    documentRow.className =
        "document-row";


    documentRow.dataset.documentStatus =
        "pending";


    documentRow.innerHTML = `

        <div class="document-file-icon">

            <i class="bi bi-file-earmark"></i>

        </div>


        <div class="document-details">

            <strong>
                ${escapeDocumentHtml(file.name)}
            </strong>

            <span>
                ${getDocumentType(file)} · Newly uploaded
            </span>

        </div>


        <div class="document-status pending">

            <i class="bi bi-clock"></i>

            Pending

        </div>


        <div class="document-date">

            Just uploaded

        </div>


        <button
            type="button"
            class="document-action-btn"
            data-document-action="view"
            aria-label="View document"
        >

            <i class="bi bi-three-dots-vertical"></i>

        </button>

    `;


    if (emptyState) {

        documentsList.insertBefore(
            documentRow,
            emptyState
        );

    } else {

        documentsList.appendChild(
            documentRow
        );

    }


    initializeSingleDocumentAction(
        documentRow
    );


    updateDocumentCounters();


    /*
     * Reset the file input so that
     * the same file can be selected again.
     */

    const fileInput =
        document.getElementById(
            "documentFileInput"
        );


    if (fileInput) {

        fileInput.value = "";

    }

}


/* =========================================================
   12. DOCUMENT TYPE
========================================================= */

function getDocumentType(file) {

    const extension =
        file.name
            .split(".")
            .pop()
            .toUpperCase();


    return extension;

}


/* =========================================================
   13. CHECKLIST UPLOAD
========================================================= */

function initializeChecklistUpload() {

    const uploadButtons =
        document.querySelectorAll(
            ".document-check-upload"
        );


    uploadButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const uploadType =
                        this.dataset.uploadType ||
                        "document";


                    openChecklistUpload(
                        uploadType
                    );

                }
            );

        }
    );

}


/* =========================================================
   14. CHECKLIST FILE UPLOAD
========================================================= */

function openChecklistUpload(type) {

    const fileInput =
        document.getElementById(
            "documentFileInput"
        );


    if (!fileInput) {

        return;

    }


    fileInput.dataset.uploadType =
        type;


    fileInput.click();

}


/* =========================================================
   15. DOCUMENT ACTIONS
========================================================= */

function initializeDocumentActions() {

    const actionButtons =
        document.querySelectorAll(
            ".document-action-btn"
        );


    actionButtons.forEach(
        function (button) {

            const row =
                button.closest(
                    ".document-row"
                );


            if (row) {

                initializeSingleDocumentAction(
                    row
                );

            }

        }
    );

}


/* =========================================================
   16. SINGLE DOCUMENT ACTION
========================================================= */

function initializeSingleDocumentAction(row) {

    const button =
        row.querySelector(
            ".document-action-btn"
        );


    if (!button) {

        return;

    }


    /*
     * Prevent duplicate listeners.
     */

    if (
        button.dataset.actionInitialized ===
        "true"
    ) {

        return;

    }


    button.dataset.actionInitialized =
        "true";


    button.addEventListener(
        "click",
        function () {

            const documentName =
                row.querySelector(
                    ".document-details strong"
                );


            const name =
                documentName
                    ? documentName.textContent.trim()
                    : "Document";


            showDocumentMessage(
                `${name} is available in your document center.`,
                "info"
            );

        }
    );

}


/* =========================================================
   17. UPDATE COUNTERS
========================================================= */

function updateDocumentCounters() {

    const rows =
        document.querySelectorAll(
            ".document-row"
        );


    let total = 0;

    let verified = 0;

    let pending = 0;


    rows.forEach(
        function (row) {

            total++;


            const status =
                row.dataset.documentStatus;


            if (
                status === "verified"
            ) {

                verified++;

            }


            if (
                status === "pending"
            ) {

                pending++;

            }

        }
    );


    updateCounter(
        "totalDocuments",
        total
    );


    updateCounter(
        "verifiedDocuments",
        verified
    );


    updateCounter(
        "pendingDocuments",
        pending
    );

}


/* =========================================================
   18. UPDATE COUNTER
========================================================= */

function updateCounter(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.textContent =
        value;

}


/* =========================================================
   19. DOCUMENT MESSAGE
========================================================= */

function showDocumentMessage(
    message,
    type = "info"
) {

    const existingToast =
        document.querySelector(
            ".documents-message-toast"
        );


    if (existingToast) {

        existingToast.remove();

    }


    const toast =
        document.createElement("div");


    toast.className =
        "documents-message-toast";


    let icon =
        "bi-info-circle";


    if (type === "success") {

        icon =
            "bi-check-circle";

    }


    if (type === "error") {

        icon =
            "bi-exclamation-circle";

    }


    toast.innerHTML = `

        <div class="documents-message-icon">

            <i class="bi ${icon}"></i>

        </div>


        <div class="documents-message-content">

            <strong>
                Udyam Sakhi
            </strong>

            <span>
                ${escapeDocumentHtml(message)}
            </span>

        </div>


        <button
            type="button"
            class="documents-message-close"
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
            ".documents-message-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                toast.remove();

            }
        );

    }


    setTimeout(
        function () {

            if (
                document.body.contains(
                    toast
                )
            ) {

                toast.remove();

            }

        },
        4500
    );

}


/* =========================================================
   20. ESCAPE HTML
========================================================= */

function escapeDocumentHtml(value) {

    const temporaryElement =
        document.createElement("div");


    temporaryElement.textContent =
        value;


    return temporaryElement.innerHTML;

}


/* =========================================================
   21. PUBLIC REFRESH FUNCTION
========================================================= */

function refreshDocumentsPage() {

    updateDocumentCounters();

    const filter =
        document.getElementById(
            "documentFilter"
        );


    if (filter) {

        filterDocuments(
            filter.value
        );

    }

}


window.refreshDocumentsPage =
    refreshDocumentsPage;