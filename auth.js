<!-- Bootstrap 5 CSS -->
<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
>

(function () {
    "use strict";

    // ==========================================
    // CONFIG
    // ==========================================

    const PASSWORD_PREFIX = "PART66";
    const HOME_PAGE = "index.html";


    // ==========================================
    // ISO WEEK
    // ==========================================

    function getISOWeek(date) {

        const d = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));

        const dayNum = d.getUTCDay() || 7;

        d.setUTCDate(
            d.getUTCDate() + 4 - dayNum
        );

        const yearStart = new Date(
            Date.UTC(
                d.getUTCFullYear(),
                0,
                1
            )
        );

        return Math.ceil(
            (((d - yearStart) / 86400000) + 1) / 7
        );
    }


    // ==========================================
    // CREATE WEEKLY PASSWORD
    // ==========================================

    const now = new Date();

    const year = now.getFullYear();

    const week = getISOWeek(now);

    const weekText =
        String(week).padStart(2, "0");

    const correctPassword =
        `${PASSWORD_PREFIX}-${year}-W${weekText}`;


    // ==========================================
    // CHECK SESSION
    // ==========================================

    if (
        sessionStorage.getItem(
            "pageAuthenticated"
        ) === "true"
    ) {
        return;
    }


    // ==========================================
    // HIDE PAGE
    // ==========================================

    document.documentElement.style.visibility =
        "hidden";


    // ==========================================
    // CREATE MODAL
    // ==========================================

    const modalHTML = `

        <div
            class="modal fade"
            id="passwordModal"
            tabindex="-1"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            aria-hidden="true"
        >

            <div
                class="
                    modal-dialog
                    modal-dialog-centered
                    modal-sm
                "
            >

                <div
                    class="
                        modal-content
                        border-0
                        shadow-lg
                        rounded-4
                    "
                >

                    <!-- HEADER -->

                    <div
                        class="
                            modal-header
                            border-0
                            justify-content-center
                            pt-4
                            pb-2
                        "
                    >

                        <div
                            class="
                                rounded-circle
                                bg-primary
                                bg-opacity-10
                                p-3
                            "
                        >

                            <span
                                style="
                                    font-size:42px;
                                "
                            >
                                🔐
                            </span>

                        </div>

                    </div>


                    <!-- BODY -->

                    <div
                        class="
                            modal-body
                            text-center
                            px-4
                            pb-4
                        "
                    >

                        <h4
                            class="
                                fw-bold
                                mb-2
                            "
                        >
                            Access Restricted
                        </h4>


                        <p
                            class="
                                text-secondary
                                small
                                mb-4
                            "
                        >
                            หน้านี้ต้องใช้รหัสผ่าน
                            <br>
                            กรุณากรอกรหัสผ่านประจำสัปดาห์
                        </p>


                        <!-- PASSWORD -->

                        <div
                            class="
                                input-group
                                mb-3
                            "
                        >

                            <span
                                class="
                                    input-group-text
                                    bg-light
                                    border-end-0
                                "
                            >
                                🔑
                            </span>

                            <input
                                type="password"
                                id="pagePassword"
                                class="
                                    form-control
                                    form-control-lg
                                    bg-light
                                    border-start-0
                                "
                                placeholder="Password"
                                autocomplete="off"
                                autofocus
                            >

                        </div>


                        <!-- ERROR -->

                        <div
                            id="passwordError"
                            class="
                                alert
                                alert-danger
                                d-none
                                py-2
                                small
                            "
                        >
                        </div>


                        <!-- LOGIN -->

                        <button
                            type="button"
                            id="loginButton"
                            class="
                                btn
                                btn-primary
                                btn-lg
                                w-100
                                rounded-3
                                fw-semibold
                            "
                        >
                            🔓 เข้าสู่ระบบ
                        </button>


                        <div
                            class="
                                mt-3
                                text-secondary
                                small
                            "
                        >
                            PART 66 Examination System
                        </div>

                    </div>

                </div>

            </div>

        </div>
    `;


    // ==========================================
    // INSERT MODAL
    // ==========================================

    document.body.insertAdjacentHTML(
        "beforeend",
        modalHTML
    );


    // ==========================================
    // LOAD BOOTSTRAP JS
    // ==========================================

    function loadBootstrap() {

        if (
            window.bootstrap &&
            window.bootstrap.Modal
        ) {

            showModal();

            return;

        }


        const script =
            document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";

        script.onload = showModal;

        document.body.appendChild(script);

    }


    // ==========================================
    // SHOW MODAL
    // ==========================================

    function showModal() {

        const modalElement =
            document.getElementById(
                "passwordModal"
            );

        const modal =
            new bootstrap.Modal(
                modalElement,
                {
                    backdrop: "static",
                    keyboard: false
                }
            );


        modal.show();


        setTimeout(function () {

            document
                .getElementById("pagePassword")
                .focus();

        }, 500);


        setupLogin(modal);

    }


    // ==========================================
    // LOGIN
    // ==========================================

    function setupLogin(modal) {

        const input =
            document.getElementById(
                "pagePassword"
            );

        const button =
            document.getElementById(
                "loginButton"
            );

        const error =
            document.getElementById(
                "passwordError"
            );


        function login() {

            const password =
                input.value.trim();


            // EMPTY

            if (!password) {

                error.textContent =
                    "⚠️ กรุณากรอกรหัสผ่าน";

                error.classList.remove(
                    "d-none"
                );

                input.focus();

                return;

            }


            // CORRECT

            if (
                password ===
                correctPassword
            ) {

                sessionStorage.setItem(
                    "pageAuthenticated",
                    "true"
                );


                error.classList.add(
                    "d-none"
                );


                modal.hide();


                setTimeout(function () {

                    document.documentElement
                        .style
                        .visibility = "visible";


                    document
                        .getElementById(
                            "passwordModal"
                        )
                        .remove();

                }, 300);


                return;

            }


            // WRONG

            error.textContent =
                "❌ รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่";

            error.classList.remove(
                "d-none"
            );


            input.value = "";

            input.focus();

        }


        // BUTTON

        button.addEventListener(
            "click",
            login
        );


        // ENTER

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    login();

                }

            }
        );

    }


    // ==========================================
    // START
    // ==========================================

    loadBootstrap();


})();
