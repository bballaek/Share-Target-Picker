async function sendShare() {
    const flexJson = document.getElementById("flexJson").value;
    const altText = document.getElementById("altText").value || "Default Alternative Text";

    try {
        const message = {
            type: "flex",
            altText: altText,
            contents: JSON.parse(flexJson)
        };

        const result = await liff.shareTargetPicker([message]);

        if (result) {
            alert(`[${result.status}] Message sent!`);
            document.getElementById("status").textContent = "Message sent successfully!";
        } else {
            alert("ShareTargetPicker was canceled or unsupported version.");
            document.getElementById("status").textContent = "Message not sent.";
        }
    } catch (error) {
        alert("Invalid JSON format!");
        console.error(error);
    }
}

function logOut() {
    liff.logout();
    window.location.reload();
}

async function main() {
    try {
        await liff.init({ liffId: "2006162669-7BXpAdL8" });
        
        if (liff.isLoggedIn()) {
            document.getElementById("btnShare").style.display = "block";
            if (!liff.isInClient()) {
                document.getElementById("btnLogOut").style.display = "block";
            }
        } else {
            document.getElementById("btnLogin").style.display = "block";
        }
    } catch (error) {
        console.error("LIFF initialization failed", error);
    }
}

main();
