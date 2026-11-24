// Order summary and Checkout Animation Logic
const summary = document.getElementById("order-summary");
const placeOrderBtn = document.getElementById("placeOrder");

let redirectTimer = null;
let redirectInterval = null;

function loadSummary() {
    if (!summary) return;

    summary.innerHTML = "";

    if (!cart || cart.length === 0) {
        summary.innerHTML = `
            <div class="alert alert-warning py-2 px-3 small d-flex align-items-center gap-2 mb-0">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <span>Your cart is empty. Add products to continue!</span>
            </div>
        `;
        const totalEl = document.getElementById("checkout-total");
        if (totalEl) totalEl.textContent = "$0.00";
        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
            placeOrderBtn.classList.add("opacity-50");
        }
        return;
    }

    if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.classList.remove("opacity-50");
    }

    cart.forEach(item => {
        summary.innerHTML += `
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                <div class="d-flex align-items-center gap-2">
                    <img src="${item.image}" alt="${item.name}" class="rounded" style="width: 42px; height: 42px; object-fit: contain; background: rgba(255,255,255,0.05); padding: 4px;">
                    <div>
                        <div class="text-white fw-semibold small">${item.name}</div>
                        <div class="text-secondary small">Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
                    </div>
                </div>
                <span class="text-success fw-bold">
                    $${(item.price * item.quantity).toFixed(2)}
                </span>
            </div>
        `;
    });

    const totalEl = document.getElementById("checkout-total");
    if (totalEl) {
        totalEl.textContent = "$" + getCartTotal().toFixed(2);
    }
}

// Confetti Engine
function launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const colors = [
        "#10b981", "#34d399", "#059669",
        "#60a5fa", "#3b82f6",
        "#f59e0b", "#fbbf24",
        "#ec4899", "#a855f7",
        "#ffffff"
    ];

    const particles = [];
    const particleCount = 130;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: width * 0.5 + (Math.random() - 0.5) * 200,
            y: height * 0.35 + (Math.random() - 0.5) * 50,
            w: Math.random() * 10 + 6,
            h: Math.random() * 7 + 4,
            vx: (Math.random() - 0.5) * 16,
            vy: Math.random() * -12 - 5,
            gravity: 0.28,
            drag: 0.98,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 14,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            shape: Math.random() > 0.4 ? "rect" : "circle"
        });
    }

    let animationFrameId;
    let startTime = Date.now();

    function render() {
        const elapsed = Date.now() - startTime;
        ctx.clearRect(0, 0, width, height);

        let activeParticles = 0;

        particles.forEach(p => {
            p.vx *= p.drag;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;

            if (p.y < height + 50) {
                activeParticles++;
            }

            // Slowly fade out after 2.5s
            if (elapsed > 2500) {
                p.opacity = Math.max(0, p.opacity - 0.02);
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;

            if (p.shape === "circle") {
                ctx.beginPath();
                ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }

            ctx.restore();
        });

        if (activeParticles > 0 && elapsed < 6000) {
            animationFrameId = requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, width, height);
            cancelAnimationFrame(animationFrameId);
        }
    }

    render();
}

// Format Estimated Delivery Date (e.g. 4 business days ahead)
function getEstimatedDeliveryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
}

// Trigger Order Confirmation Animation
function triggerConfirmationAnimation(customerDetails, orderTotal) {
    const overlay = document.getElementById("confirmationOverlay");
    if (!overlay) return;

    // Set details
    const orderId = "#VS-" + Math.floor(100000 + Math.random() * 900000);
    const nameEl = document.getElementById("confirmCustomerName");
    const idEl = document.getElementById("confirmOrderId");
    const emailEl = document.getElementById("confirmEmail");
    const addressEl = document.getElementById("confirmAddress");
    const dateEl = document.getElementById("confirmDeliveryDate");
    const totalEl = document.getElementById("confirmTotal");

    if (nameEl) nameEl.textContent = customerDetails.name || "Customer";
    if (idEl) idEl.textContent = orderId;
    if (emailEl) emailEl.textContent = customerDetails.email || "customer@example.com";
    if (addressEl) addressEl.textContent = `${customerDetails.address}, ${customerDetails.city} ${customerDetails.zipcode}`;
    if (dateEl) dateEl.textContent = getEstimatedDeliveryDate();
    if (totalEl) totalEl.textContent = "$" + orderTotal.toFixed(2);

    // Show overlay and launch confetti
    overlay.classList.add("active");
    launchConfetti();

    // Secondary confetti burst 400ms later for extra celebration effect
    setTimeout(() => {
        launchConfetti();
    }, 450);

    // Animate stepper progress bar
    setTimeout(() => {
        const progressBar = document.querySelector(".order-stepper-progress");
        if (progressBar) {
            progressBar.style.width = "25%";
        }
    }, 300);

    // Setup auto-redirect countdown
    let remainingSeconds = 8;
    const counterEl = document.getElementById("redirectCounter");
    const progressEl = document.getElementById("redirectProgressBar");

    if (progressEl) {
        progressEl.style.transition = "width 8s linear";
        setTimeout(() => {
            progressEl.style.width = "0%";
        }, 50);
    }

    redirectInterval = setInterval(() => {
        remainingSeconds--;
        if (counterEl) counterEl.textContent = remainingSeconds;
        if (remainingSeconds <= 0) {
            clearInterval(redirectInterval);
            window.location.href = "index.html";
        }
    }, 1000);
}

// Event Listeners for Confirmation Modal
document.addEventListener("DOMContentLoaded", () => {
    loadSummary();

    const continueBtn = document.getElementById("btnContinueShopping");
    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            if (redirectInterval) clearInterval(redirectInterval);
            window.location.href = "index.html";
        });
    }

    const cancelRedirectBtn = document.getElementById("btnCancelRedirect");
    if (cancelRedirectBtn) {
        cancelRedirectBtn.addEventListener("click", () => {
            if (redirectInterval) clearInterval(redirectInterval);
            const counterEl = document.getElementById("redirectCounter");
            if (counterEl && counterEl.parentElement) {
                counterEl.parentElement.innerHTML = '<span class="text-success"><i class="bi bi-check-circle me-1"></i>Saved! You can review your receipt above.</span>';
            }
            const progressEl = document.getElementById("redirectProgressBar");
            if (progressEl && progressEl.parentElement) {
                progressEl.parentElement.style.display = "none";
            }
        });
    }

    const printBtn = document.getElementById("btnPrintReceipt");
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }
});

// Handle Place Order Button
if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
        const form = document.getElementById("checkoutForm");

        if (cart.length === 0) {
            showToast("Your cart is empty! Please add products first.");
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const customerDetails = {
            name: `${formData.get("name") || ""} ${formData.get("lastname") || ""}`.trim(),
            email: formData.get("email") || "",
            address: formData.get("address") || "",
            city: formData.get("city") || "",
            zipcode: formData.get("zipcode") || ""
        };

        const totalAmount = getCartTotal();

        // Trigger the celebratory confirmation animation
        triggerConfirmationAnimation(customerDetails, totalAmount);

        // Clear cart and state
        cart = [];
        saveCart();
        updateCartCounter();
    });
}
