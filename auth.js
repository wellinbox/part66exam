(function () {
    "use strict";

    // ==========================================
    // CONFIG
    // ==========================================

    const PASSWORD_PREFIX = "PART66";

    // หน้าหลัก
    const HOME_PAGE = "index.html";

    // ==========================================
    // หาเลขสัปดาห์ ISO
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
            (
                (
                    (d - yearStart) / 86400000
                ) + 1
            ) / 7
        );
    }

    // ==========================================
    // สร้างรหัสผ่านประจำสัปดาห์
    // ==========================================

    const now = new Date();

    const year = now.getFullYear();

    const week = getISOWeek(now);

    const weekText = String(week).padStart(2, "0");

    const correctPassword =
        `${PASSWORD_PREFIX}-${year}-W${weekText}`;


    // ==========================================
    // ตรวจสอบ Session
    // ==========================================

    const authenticated =
        sessionStorage.getItem("pageAuthenticated");


    // ==========================================
    // ถ้าเคยผ่านแล้ว → ปล่อยให้เข้าเว็บ
    // ==========================================

    if (authenticated === "true") {
        return;
    }


    // ==========================================
    // ฟังก์ชันกลับหน้าหลัก
    // ==========================================

    function goHome() {

        // ล้างสถานะการยืนยัน
        sessionStorage.removeItem(
            "pageAuthenticated"
        );

        // กลับหน้า index.html
        window.location.replace(HOME_PAGE);
    }


    // ==========================================
    // ขอรหัสผ่าน
    // ==========================================

    while (true) {

        const password = prompt(
            "🔐 หน้านี้ต้องใช้รหัสผ่าน\n\n" +
            "กรุณากรอกรหัสผ่านประจำสัปดาห์:"
        );


        // ======================================
        // กด "ยกเลิก"
        // ======================================

        if (password === null) {

            alert(
                "🔒 ยกเลิกการเข้าสู่ระบบ\n\n" +
                "กำลังกลับไปหน้าหลัก..."
            );

            goHome();

            // หยุดการทำงานทันที
            return;
        }


        // ======================================
        // รหัสผ่านถูกต้อง
        // ======================================

        if (password === correctPassword) {

            sessionStorage.setItem(
                "pageAuthenticated",
                "true"
            );

            // ออกจากฟังก์ชัน
            return;
        }


        // ======================================
        // รหัสผ่านผิด
        // ======================================

        alert(
            "❌ รหัสผ่านไม่ถูกต้อง\n\n" +
            "กรุณาลองใหม่อีกครั้ง"
        );
    }

})();
