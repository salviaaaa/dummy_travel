// Get package details from URL parameters
function getPackageDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const packageName = urlParams.get('paket');
    const packagePrice = parseInt(urlParams.get('harga')) || 0;
    
    return { packageName, packagePrice };
}

// Update package details in the order summary
function updatePackageDetails() {
    const { packageName, packagePrice } = getPackageDetails();
    
    // Convert package name to display format
    const displayName = packageName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    // Update package name
    const packageNameElement = document.querySelector('.package-name');
    if (packageNameElement) {
        packageNameElement.textContent = displayName;
    }
    
    // Update price per person
    const priceElement = document.querySelector('.price-details .d-flex:first-child span:last-child');
    if (priceElement) {
        priceElement.textContent = `Rp ${packagePrice.toLocaleString('id-ID')}`;
    }
    
    // Update total based on current number of participants
    updateTotal();
}

// Update total price based on number of participants
function updateTotal() {
    const { packagePrice } = getPackageDetails();
    const participants = parseInt(document.getElementById('participants').value) || 1;
    const totalParticipantsSpan = document.getElementById('totalParticipants');
    const totalPriceSpan = document.getElementById('totalPrice');
    
    if (totalParticipantsSpan && totalPriceSpan) {
        totalParticipantsSpan.textContent = participants;
        const total = packagePrice * participants;
        totalPriceSpan.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const bookingForm = document.getElementById('bookingForm');
    const participantsInput = document.getElementById('participants');

    // Initialize package details
    updatePackageDetails();

    // Update total price when number of participants changes
    if (participantsInput) {
        participantsInput.addEventListener('change', updateTotal);
    }

    // Handle form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                travelDate: document.getElementById('travelDate').value,
                participants: document.getElementById('participants').value,
                specialRequests: document.getElementById('specialRequests').value,
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
                packageDetails: getPackageDetails()
            };

            // Validate form
            if (!validateForm(formData)) {
                return;
            }

            // Store booking data in session storage for invoice
            sessionStorage.setItem('bookingData', JSON.stringify(formData));

            // Process payment based on selected method
            processPayment(formData);
        });
    }
});

// Form validation
function validateForm(data) {
    // Basic validation
    if (!data.firstName || !data.lastName) {
        alert('Mohon lengkapi nama Anda');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        alert('Mohon masukkan alamat email yang valid');
        return false;
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        alert('Mohon masukkan nomor telepon yang valid');
        return false;
    }

    if (!data.travelDate) {
        alert('Mohon pilih tanggal keberangkatan');
        return false;
    }

    // Validate travel date is in the future
    const selectedDate = new Date(data.travelDate);
    const today = new Date();
    if (selectedDate <= today) {
        alert('Tanggal keberangkatan harus di masa depan');
        return false;
    }

    return true;
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone number validation
function isValidPhone(phone) {
    const re = /^(\+62|62|0)[0-9]{9,12}$/;
    return re.test(phone);
}

// Process payment
function processPayment(formData) {
    // Show payment details based on selected method
    switch (formData.paymentMethod) {
        case 'bank':
            showBankTransferDetails(formData);
            break;
        case 'credit':
            showCreditCardForm(formData);
            break;
        case 'ewallet':
            showEWalletOptions(formData);
            break;
    }
}

// Show bank transfer details
function showBankTransferDetails(formData) {
    const total = formData.packageDetails.packagePrice * formData.participants;
    const bankDetails = `
        <div class="payment-details">
            <h3>Transfer Bank</h3>
            <p>Silakan transfer ke rekening berikut:</p>
            <div class="bank-info">
                <p><strong>Bank BCA</strong></p>
                <p>No. Rekening: 1234567890</p>
                <p>Atas Nama: PT Pesona Indonesia Travel</p>
            </div>
            <p>Total yang harus dibayar: Rp ${total.toLocaleString('id-ID')}</p>
            <p>Mohon transfer dalam waktu 24 jam untuk mengkonfirmasi pemesanan Anda.</p>
            <div class="mt-4">
                <button class="btn btn-success" onclick="simulatePayment()">
                    Konfirmasi Pembayaran
                </button>
            </div>
        </div>
    `;
    
    showPaymentModal(bankDetails);
}

// Show credit card form
function showCreditCardForm(formData) {
    const total = formData.packageDetails.packagePrice * formData.participants;
    const creditCardForm = `
        <div class="payment-details">
            <h3>Pembayaran Kartu Kredit</h3>
            <p>Total: Rp ${total.toLocaleString('id-ID')}</p>
            <form id="creditCardForm">
                <div class="mb-3">
                    <label class="form-label">Nomor Kartu</label>
                    <input type="text" class="form-control" placeholder="1234 5678 9012 3456" required>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Tanggal Kadaluarsa</label>
                        <input type="text" class="form-control" placeholder="MM/YY" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">CVV</label>
                        <input type="text" class="form-control" placeholder="123" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nama pada Kartu</label>
                    <input type="text" class="form-control" required>
                </div>
                <button type="button" class="btn btn-primary" onclick="simulatePayment()">Bayar Sekarang</button>
            </form>
        </div>
    `;
    
    showPaymentModal(creditCardForm);
}

// Show e-wallet options
function showEWalletOptions(formData) {
    const total = formData.packageDetails.packagePrice * formData.participants;
    const eWalletOptions = `
        <div class="payment-details">
            <h3>Pembayaran E-Wallet</h3>
            <p>Total: Rp ${total.toLocaleString('id-ID')}</p>
            <div class="list-group">
                <button class="list-group-item list-group-item-action" onclick="simulatePayment('gopay')">
                    <i class="fas fa-wallet"></i> GoPay
                </button>
                <button class="list-group-item list-group-item-action" onclick="simulatePayment('ovo')">
                    <i class="fas fa-wallet"></i> OVO
                </button>
                <button class="list-group-item list-group-item-action" onclick="simulatePayment('dana')">
                    <i class="fas fa-wallet"></i> DANA
                </button>
            </div>
        </div>
    `;
    
    showPaymentModal(eWalletOptions);
}

// Show payment modal
function showPaymentModal(content) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'paymentModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Pembayaran</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;

    // Add modal to body
    document.body.appendChild(modal);

    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    // Remove modal from DOM when hidden
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// Simulate payment process
function simulatePayment(provider = '') {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    }

    // Simulate processing
    setTimeout(() => {
        alert('Pembayaran berhasil! Anda akan diarahkan ke halaman invoice.');
        window.location.href = 'invoice.html';
    }, 1500);
} 