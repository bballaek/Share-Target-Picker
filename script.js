// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show toast-${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Show status message
function showStatus(message, type = 'success') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status-${type}`;
    
    setTimeout(() => {
        status.className = '';
    }, 5000);
}

// Send share message
async function sendShare() {
    const flexJsonElement = document.getElementById('flexJson');
    const flexJson = flexJsonElement.value.trim();
    const altText = document.getElementById('altText').value.trim() || "LINE Flex Message";
    
    if (!flexJson) {
        showToast('โปรดใส่ Flex JSON ก่อนแชร์', 'error');
        flexJsonElement.focus();
        return;
    }
    
    try {
        const message = {
            type: "flex",
            altText: altText,
            contents: JSON.parse(flexJson)
        };

        // Initialize LIFF if not initialized
        if (!liff.isLoggedIn() && !liff.isInClient()) {
            await liff.init({ liffId: "2006162669-7BXpAdL8" });
        }
        
        const shareResult = await liff.shareTargetPicker([message]);
        
        if (shareResult) {
            showToast('ส่งข้อความสำเร็จ!', 'success');
            showStatus('ส่งข้อความสำเร็จแล้ว', 'success');
        } else {
            showToast('การแชร์ถูกยกเลิกหรือไม่รองรับ', 'error');
            showStatus('ไม่ได้ส่งข้อความ', 'error');
        }
    } catch (error) {
        console.error(error);
        if (error.message.includes('JSON')) {
            showToast('รูปแบบ JSON ไม่ถูกต้อง', 'error');
            showStatus('รูปแบบ JSON ไม่ถูกต้อง โปรดตรวจสอบอีกครั้ง', 'error');
        } else {
            showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
            showStatus('เกิดข้อผิดพลาดในการส่งข้อความ', 'error');
        }
    }
}

// Logout function
function logOut() {
    if (liff.isLoggedIn()) {
        liff.logout();
        showToast('ออกจากระบบสำเร็จ', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Initialize the app
async function initializeApp() {
    try {
        await liff.init({ liffId: "2006162669-7BXpAdL8" });
        
        // Check if logged in
        if (liff.isLoggedIn()) {
            document.getElementById('btnLogOut').style.display = 'block';
        } else if (!liff.isInClient()) {
            // Add login button for external browser
            const container = document.querySelector('.container');
            const statusDiv = document.getElementById('status');
            
            const loginButton = document.createElement('button');
            loginButton.className = 'button';
            loginButton.innerHTML = 'เข้าสู่ระบบด้วย LINE';
            loginButton.onclick = () => liff.login();
            
            container.insertBefore(loginButton, statusDiv);
            document.getElementById('btnShare').style.display = 'none';
        }
        
        // Enable share button
        document.getElementById('btnShare').addEventListener('click', sendShare);
        document.getElementById('btnLogOut').addEventListener('click', logOut);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                sendShare();
            }
        });
        
    } catch (error) {
        console.error("LIFF initialization failed", error);
        showStatus('ไม่สามารถเชื่อมต่อกับ LINE LIFF SDK ได้', 'error');
    }
}

// Start the app when page loads
window.addEventListener('load', initializeApp);
