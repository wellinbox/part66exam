/**
 * Password Protect Script
 * วิธีใช้: นำไฟล์นี้ไป include ในหน้า HTML ที่ต้องการป้องกัน
 * <script src="password-protect.js"></script>
 * 
 * ⚠️ คำเตือน: วิธีนี้ไม่ปลอดภัย 100% ผู้ใช้สามารถดูรหัสผ่านจาก Source Code ได้
 * เหมาะสำหรับป้องกันเบื้องต้นเท่านั้น
 */

(function() {
    // ========== ตั้งค่าตรงนี้ ==========
    const CONFIG = {
        password: "admin1234",           // รหัสผ่านที่ต้องการ
        title: "🔒 พื้นที่ส่วนตัว",         // หัวข้อ
        message: "กรุณากรอกรหัสผ่านเพื่อเข้าสู่ระบบ", // ข้อความ
        errorMessage: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่", // ข้อความเมื่อกรอกผิด
        buttonText: "เข้าสู่ระบบ",          // ข้อความบนปุ่ม
        sessionKey: "isAuthenticated",    // ชื่อ key ใน sessionStorage
        containerId: "password-protect-container" // ID ของ container ที่สร้าง
    };
    // =================================

    // สร้าง CSS และเพิ่มเข้าไปในหน้า
    function injectStyles() {
        const css = `
            #${CONFIG.containerId} {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            #${CONFIG.containerId} .pp-box {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                text-align: center;
                width: 90%;
                max-width: 400px;
            }
            #${CONFIG.containerId} .pp-box h2 {
                margin-top: 0;
                color: #333;
            }
            #${CONFIG.containerId} .pp-box p {
                color: #666;
            }
            #${CONFIG.containerId} .pp-input {
                width: 100%;
                padding: 12px;
                margin: 15px 0;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
                box-sizing: border-box;
            }
            #${CONFIG.containerId} .pp-button {
                width: 100%;
                padding: 12px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.3s;
            }
            #${CONFIG.containerId} .pp-button:hover {
                background-color: #0056b3;
            }
            #${CONFIG.containerId} .pp-error {
                color: red;
                font-size: 14px;
                margin-top: 10px;
                display: none;
            }
            .pp-protected-content {
                display: none;
            }
            .pp-protected-content.pp-visible {
                display: block;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // สร้าง UI ของหน้าล็อกอิน
    function createLoginUI() {
        const overlay = document.createElement('div');
        overlay.id = CONFIG.containerId;
        overlay.innerHTML = `
            <div class="pp-box">
                <h2>${CONFIG.title}</h2>
                <p>${CONFIG.message}</p>
                <input type="password" class="pp-input" id="pp-password" placeholder="กรอกรหัสผ่าน..." autocomplete="off">
                <button class="pp-button" id="pp-submit">${CONFIG.buttonText}</button>
                <p class="pp-error" id="pp-error">${CONFIG.errorMessage}</p>
            </div>
        `;
        document.body.appendChild(overlay);

        // เพิ่ม event listeners
        document.getElementById('pp-submit').addEventListener('click', checkPassword);
        document.getElementById('pp-password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkPassword();
        });
    }

    // ตรวจสอบรหัสผ่าน
    function checkPassword() {
        const input = document.getElementById('pp-password');
        const error = document.getElementById('pp-error');
        const overlay = document.getElementById(CONFIG.containerId);

        if (input.value === CONFIG.password) {
            overlay.style.display = 'none';
            sessionStorage.setItem(CONFIG.sessionKey, 'true');
            
            // แสดงเนื้อหาที่ถูกป้องกัน
            document.querySelectorAll('.pp-protected-content').forEach(el => {
                el.classList.add('pp-visible');
            });
        } else {
            error.style.display = 'block';
            input.value = '';
            input.focus();
        }
    }

    // ฟังก์ชันออกจากระบบ (เรียกใช้จากที่อื่นได้)
    window.ppLogout = function() {
        sessionStorage.removeItem(CONFIG.sessionKey);
        location.reload();
    };

    // เริ่มต้นการทำงาน
    function init() {
        injectStyles();

        // ถ้ายังไม่ได้ล็อกอิน → แสดงหน้าล็อกอิน
        if (sessionStorage.getItem(CONFIG.sessionKey) !== 'true') {
            createLoginUI();
        } else {
            // ถ้าล็อกอินอยู่แล้ว → แสดงเนื้อหา
            document.querySelectorAll('.pp-protected-content').forEach(el => {
                el.classList.add('pp-visible');
            });
        }
    }

    // เรียก init เมื่อ DOM พร้อม
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
