(function () {
    // ==============================
    // WEEKLY PASSWORD PROTECTION
    // ==============================

    const PASSWORD_PREFIX = "PART66";

    // หาเลขสัปดาห์ ISO
    function getISOWeek(date) {
        const d = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));

        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);

        const yearStart = new Date(Date.UTC(
            d.getUTCFullYear(), 0, 1
        ));

        return Math.ceil(
            (((d - yearStart) / 86400000) + 1) / 7
        );
    }

    // ปีปัจจุบัน
    const year = new Date().getFullYear();

    // สัปดาห์ปัจจุบัน
    const week = getISOWeek(new Date());

    // ทำเลขสัปดาห์ให้เป็น 2 หลัก
    const weekText = String(week).padStart(2, "0");

    // รหัสผ่านของสัปดาห์นี้
    const correctPassword =
        `${PASSWORD_PREFIX}-${year}-W${weekText}`;

    // ==============================
    // ตรวจสอบ Session
    // ==============================

    if (sessionStorage.getItem("pageAuthenticated") !== "true") {

        let authenticated = false;

        while (!authenticated) {

            const password = prompt(
                "🔐 หน้านี้ต้องใช้รหัสผ่าน\n\n" +
                "กรุณากรอกรหัสผ่านประจำสัปดาห์:"
            );

            // กดยกเลิก
            if (password === null) {
                document.body.innerHTML = `
                    <div style="
                        min-height:100vh;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:#0f172a;
                        color:white;
                        font-family:Arial,sans-serif;
                        text-align:center;
                    ">
                        <div>
                            <h1>🔒 Access Denied</h1>
                            <p>ไม่สามารถเข้าถึงหน้านี้ได้</p>
                        </div>
                    </div>
                `;

                throw new Error("Access denied");
            }

            if (password === correctPassword) {

                authenticated = true;

                sessionStorage.setItem(
                    "pageAuthenticated",
                    "true"
                );

            } else {

                alert(
                    "❌ รหัสผ่านไม่ถูกต้อง\n" +
                    "กรุณาลองใหม่อีกครั้ง"
                );
            }
        }
    }

})();
