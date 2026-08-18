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
    // PASSWORD
    // ==========================================

    const now = new Date();

    const year = now.getFullYear();

    const week = getISOWeek(now);

    const weekText = String(week).padStart(2, "0");

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
    // LOCK PAGE IMMEDIATELY
    // ==========================================

    document.documentElement.style.visibility =
        "hidden";


    // ==========================================
    // CREATE LOGIN SCREEN
    // ==========================================

    const loginScreen = document.createElement("div");

    loginScreen.id = "password-protection";

    loginScreen.innerHTML = `
        <div class="password-box">

            <div class="lock-icon">🔐</div>

            <h2>Access Restricted</h2>

            <p>
                กรุณากรอกรหัสผ่านเพื่อเข้าสู่หน้านี้
            </p>

            <input
                type="password"
                id="passwordInput"
                placeholder="Password"
                autocomplete="off"
                autofocus
            >

            <button id="loginButton">
                เข้าสู่ระบบ
            </button>

            <div id="errorMessage"></div>

        </div>
    `;


    // ==========================================
    // LOGIN STYLE
    // ==========================================

    const style = document.createElement("style");

    style.textContent = `

        #password-protection {

            position: fixed;

            inset: 0;

            z-index: 999999;

            display: flex;

            align-items: center;

            justify-content: center;

            background:
                linear-gradient(
                    135deg,
                    #020617,
                    #0f172a,
                    #1e293b
                );

            font-family:
                Arial,
                sans-serif;

        }


        .password-box {

            width: min(90%, 380px);

            padding: 35px 30px;

            text-align: center;

            background: rgba(255,255,255,0.08);

            border: 1px solid
                rgba(255,255,255,0.15);

            border-radius: 20px;

            backdrop-filter: blur(15px);

            box-shadow:
                0 20px 60px
                rgba(0,0,0,0.4);

            color: white;

        }


        .lock-icon {

            font-size: 50px;

            margin-bottom: 15px;

        }


        .password-box h2 {

            margin:
                0 0 10px;

        }


        .password-box p {

            color: #cbd5e1;

            font-size: 14px;

            margin-bottom: 25px;

        }


        #passwordInput {

            width: 100%;

            box-sizing: border-box;

            padding: 14px;

            border: none;

            outline: none;

            border-radius: 10px;

            font-size: 16px;

            margin-bottom: 12px;

        }


        #loginButton {

            width: 100%;

            padding: 14px;

            border: none;

            border-radius: 10px;

            background: #2563eb;

            color: white;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

        }


        #loginButton:hover {

            background: #1d4ed8;

        }


        #errorMessage {

            min-height: 22px;

            margin-top: 15px;

            color: #f87171;

            font-size: 14px;

        }

    `;


    document.head.appendChild(style);

    document.body.appendChild(loginScreen);


    // ==========================================
    // HIDE PAGE CONTENT
    // ==========================================

    document.documentElement.style.visibility =
        "visible";


    // ==========================================
    // ELEMENTS
    // ==========================================

    const input =
        document.getElementById(
            "passwordInput"
        );

    const button =
        document.getElementById(
            "loginButton"
        );

    const error =
        document.getElementById(
            "errorMessage"
        );


    // ==========================================
    // LOGIN FUNCTION
    // ==========================================

    function login() {

        const password =
            input.value.trim();


        if (!password) {

            error.textContent =
                "⚠️ กรุณากรอกรหัสผ่าน";

            input.focus();

            return;
        }


        if (password === correctPassword) {

            // AUTHENTICATED

            sessionStorage.setItem(
                "pageAuthenticated",
                "true"
            );


            // Remove protection screen

            loginScreen.remove();


            // Restore page

            document.documentElement
                .style
                .visibility = "visible";

        } else {

            error.textContent =
                "❌ รหัสผ่านไม่ถูกต้อง";

            input.value = "";

            input.focus();

        }

    }


    // ==========================================
    // BUTTON
    // ==========================================

    button.addEventListener(
        "click",
        login
    );


    // ==========================================
    // ENTER KEY
    // ==========================================

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                login();

            }

        }
    );


    // ==========================================
    // BLOCK ESCAPE
    // ==========================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                event.preventDefault();

            }

        }
    );

})();
