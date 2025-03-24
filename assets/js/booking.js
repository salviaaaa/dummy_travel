// Inisialisasi saat dokumen dimuat
document.addEventListener('DOMContentLoaded', function() {
    initBookingProcess();
    initDatePicker();
    loadPackages();
    
    // Cek apakah ada ID paket yang disimpan dari halaman sebelumnya
    const selectedPackageId = sessionStorage.getItem('selectedPackageId');
    if (selectedPackageId) {
        // Tunggu hingga paket dimuat
        setTimeout(() => {
            const packageSelect = document.getElementById('packageSelect');
            if (packageSelect) {
                packageSelect.value = selectedPackageId;
                // Trigger event change untuk memperbarui UI
                packageSelect.dispatchEvent(new Event('change'));
            }
        }, 500);
    }
});

// Inisialisasi proses booking
function initBookingProcess() {
    // Event listener untuk tombol next
    const nextButtons = document.querySelectorAll('.next-step');
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            goToStep(nextStep);
        });
    });
    
    // Event listener untuk tombol previous
    const prevButtons = document.querySelectorAll('.prev-step');
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            goToStep(prevStep);
        });
    });
    
    // Event listener untuk tombol cetak bukti
    const printButton = document.getElementById('printReceiptBtn');
    if (printButton) {
        printButton.addEventListener('click', printReceipt);
    }
    
    // Event listener untuk perubahan jumlah peserta
    const participantsInput = document.getElementById('participants');
    if (participantsInput) {
        participantsInput.addEventListener('change', updateTotalPrice);
    }
    
    // Event listener untuk select paket
    const packageSelect = document.getElementById('packageSelect');
    if (packageSelect) {
        packageSelect.addEventListener('change', updateSelectedPackage);
    }
    
    // Event listener untuk payment button
    const paymentButton = document.getElementById('paymentButton');
    if (paymentButton) {
        paymentButton.addEventListener('click', processPayment);
    }
    
    // Set min date ke hari ini
    const travelDateInput = document.getElementById('travelDate');
    if (travelDateInput) {
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];
        travelDateInput.setAttribute('min', minDate);
    }
}

// Inisialisasi date picker
function initDatePicker() {
    // Atur tanggal minimal ke hari ini
    const travelDateInput = document.getElementById('travelDate');
    if (travelDateInput) {
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];
        travelDateInput.setAttribute('min', minDate);
        
        // Default ke 3 hari dari sekarang
        const defaultDate = new Date();
        defaultDate.setDate(today.getDate() + 3);
        travelDateInput.valueAsDate = defaultDate;
    }
}

// Fungsi untuk beralih antar langkah
function goToStep(stepNumber) {
    // Validasi input sebelum pindah
    if (!validateCurrentStep(parseInt(stepNumber) - 1)) {
        return;
    }
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    const progressValue = (stepNumber - 1) * 25;
    progressBar.style.width = `${progressValue}%`;
    progressBar.setAttribute('aria-valuenow', progressValue);
    
    // Sembunyikan semua langkah
    const allSteps = document.querySelectorAll('.booking-step');
    allSteps.forEach(step => {
        step.classList.add('d-none');
    });
    
    // Tampilkan langkah yang dipilih
    const currentStep = document.getElementById(`bookingStep${stepNumber}`);
    if (currentStep) {
        currentStep.classList.remove('d-none');
    }
    
    // Update indikator proses
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    for (let i = 0; i < stepNumber; i++) {
        if (processSteps[i]) {
            processSteps[i].classList.add('active');
        }
    }
    
    // Jika langkah 3 (pembayaran), update ringkasan
    if (stepNumber === '3') {
        updateBookingSummary();
    }
    
    // Jika langkah 4 (konfirmasi), isi receipt
    if (stepNumber === '4') {
        fillReceipt();
    }
    
    // Scroll ke atas
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Validasi langkah saat ini sebelum pindah ke langkah berikutnya
function validateCurrentStep(currentStep) {
    if (currentStep === 1) {
        // Validasi langkah 1 (detail pemesanan)
        const packageSelect = document.getElementById('packageSelect');
        const travelDate = document.getElementById('travelDate');
        const participants = document.getElementById('participants');
        
        if (!packageSelect.value) {
            alert('Silakan pilih paket wisata terlebih dahulu!');
            packageSelect.focus();
            return false;
        }
        
        if (!travelDate.value) {
            alert('Silakan pilih tanggal keberangkatan!');
            travelDate.focus();
            return false;
        }
        
        if (!participants.value || participants.value < 1) {
            alert('Jumlah peserta minimal 1 orang!');
            participants.focus();
            return false;
        }
        
        return true;
    } else if (currentStep === 2) {
        // Validasi langkah 2 (detail pemesan)
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const idNumber = document.getElementById('idNumber');
        const address = document.getElementById('address');
        const termsCheck = document.getElementById('termsCheck');
        
        if (!fullName.value) {
            alert('Silakan masukkan nama lengkap Anda!');
            fullName.focus();
            return false;
        }
        
        if (!email.value || !isValidEmail(email.value)) {
            alert('Silakan masukkan alamat email yang valid!');
            email.focus();
            return false;
        }
        
        if (!phone.value) {
            alert('Silakan masukkan nomor telepon Anda!');
            phone.focus();
            return false;
        }
        
        if (!idNumber.value) {
            alert('Silakan masukkan nomor KTP Anda!');
            idNumber.focus();
            return false;
        }
        
        if (!address.value) {
            alert('Silakan masukkan alamat Anda!');
            address.focus();
            return false;
        }
        
        if (!termsCheck.checked) {
            alert('Anda harus menyetujui syarat dan ketentuan!');
            termsCheck.focus();
            return false;
        }
        
        return true;
    }
    
    return true;
}

// Validasi format email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Muat paket wisata dari data JSON
async function loadPackages() {
    const packageSelect = document.getElementById('packageSelect');
    if (!packageSelect) return;
    
    try {
        const data = await fetchData('data/packages.json');
        if (!data || !data.packages) return;
        
        // Tampilkan paket di dropdown
        data.packages.forEach(pack => {
            const option = document.createElement('option');
            option.value = pack.id;
            option.textContent = `${pack.name} - ${formatRupiah(pack.price)}`;
            option.setAttribute('data-price', pack.price);
            option.setAttribute('data-duration', pack.duration);
            option.setAttribute('data-image', pack.image);
            option.setAttribute('data-rating', pack.rating);
            packageSelect.appendChild(option);
        });
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error}`);
    }
}

// Update detail paket yang dipilih
function updateSelectedPackage() {
    const packageSelect = document.getElementById('packageSelect');
    if (!packageSelect || !packageSelect.value) return;
    
    const selectedOption = packageSelect.options[packageSelect.selectedIndex];
    const packageId = packageSelect.value;
    const packageName = selectedOption.textContent.split(' - ')[0];
    const packagePrice = selectedOption.getAttribute('data-price');
    const packageDuration = selectedOption.getAttribute('data-duration');
    const packageImage = selectedOption.getAttribute('data-image');
    const packageRating = selectedOption.getAttribute('data-rating');
    
    // Update tampilan
    document.getElementById('package-name').textContent = packageName;
    document.getElementById('package-duration').textContent = packageDuration;
    document.getElementById('package-price').textContent = formatRupiah(packagePrice);
    
    // Update gambar
    const packageImageEl = document.getElementById('package-image');
    if (packageImageEl && packageImage) {
        packageImageEl.src = packageImage;
    }
    
    // Update rating
    updateRatingStars(packageRating);
    
    // Update total price
    updateTotalPrice();
}

// Update tampilan bintang rating
function updateRatingStars(rating) {
    const ratingContainer = document.getElementById('package-rating');
    if (!ratingContainer) return;
    
    ratingContainer.innerHTML = generateStarRating(rating);
}

// Update total harga berdasarkan paket dan jumlah peserta
function updateTotalPrice() {
    const packageSelect = document.getElementById('packageSelect');
    const participants = document.getElementById('participants');
    
    if (!packageSelect || !packageSelect.value || !participants) return;
    
    const selectedOption = packageSelect.options[packageSelect.selectedIndex];
    const packagePrice = parseFloat(selectedOption.getAttribute('data-price'));
    const totalParticipants = parseInt(participants.value);
    
    const totalPrice = packagePrice * totalParticipants;
    
    // Update tampilan harga
    document.getElementById('package-price').textContent = formatRupiah(totalPrice);
}

// Update ringkasan pemesanan pada langkah pembayaran
function updateBookingSummary() {
    const packageSelect = document.getElementById('packageSelect');
    const travelDate = document.getElementById('travelDate');
    const participants = document.getElementById('participants');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    
    if (!packageSelect || !packageSelect.value) return;
    
    const selectedOption = packageSelect.options[packageSelect.selectedIndex];
    const packageName = selectedOption.textContent.split(' - ')[0];
    const packagePrice = parseFloat(selectedOption.getAttribute('data-price'));
    const totalParticipants = parseInt(participants.value);
    const totalPrice = packagePrice * totalParticipants;
    
    // Format tanggal
    const formattedDate = formatDate(travelDate.value);
    
    // Update ringkasan
    document.getElementById('summary-package').textContent = packageName;
    document.getElementById('summary-date').textContent = formattedDate;
    document.getElementById('summary-participants').textContent = totalParticipants;
    document.getElementById('summary-name').textContent = fullName.value;
    document.getElementById('summary-email').textContent = email.value;
    document.getElementById('summary-phone').textContent = phone.value;
    
    // Update detail pembayaran
    document.getElementById('package-base-price').textContent = formatRupiah(packagePrice);
    document.getElementById('total-participants').textContent = totalParticipants + ' orang';
    document.getElementById('total-payment').textContent = formatRupiah(totalPrice);
}

// Format tanggal dari YYYY-MM-DD ke format lokal
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', options);
}

// Proses pembayaran
function processPayment() {
    // Di implementasi nyata, ini akan menangani proses pembayaran
    // Untuk demo, kita langsung lanjut ke langkah konfirmasi
    generateBookingNumber();
}

// Membuat nomor pemesanan
function generateBookingNumber() {
    const bookingNumber = document.getElementById('booking-number');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    
    bookingNumber.textContent = `MT-${year}${month}${day}-${randomNum}`;
}

// Isi data pada tanda terima
function fillReceipt() {
    const packageSelect = document.getElementById('packageSelect');
    const travelDate = document.getElementById('travelDate');
    const participants = document.getElementById('participants');
    const fullName = document.getElementById('fullName');
    
    if (!packageSelect || !packageSelect.value) return;
    
    const selectedOption = packageSelect.options[packageSelect.selectedIndex];
    const packageName = selectedOption.textContent.split(' - ')[0];
    const packagePrice = parseFloat(selectedOption.getAttribute('data-price'));
    const totalParticipants = parseInt(participants.value);
    const totalPrice = packagePrice * totalParticipants;
    
    // Format tanggal
    const formattedDate = formatDate(travelDate.value);
    
    // Update tanda terima
    document.getElementById('receipt-package').textContent = packageName;
    document.getElementById('receipt-name').textContent = fullName.value;
    document.getElementById('receipt-date').textContent = formattedDate;
    document.getElementById('receipt-participants').textContent = totalParticipants + ' orang';
    document.getElementById('receipt-payment').textContent = formatRupiah(totalPrice);
}

// Cetak tanda terima
function printReceipt() {
    const receiptContent = document.querySelector('.booking-receipt .card').outerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Bukti Pembayaran - Maziila Travel</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                .card {
                    border: 2px dashed #ddd;
                    max-width: 500px;
                    margin: 0 auto;
                }
                .logo {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 24px;
                    font-weight: bold;
                }
                .logo span {
                    color: #1E90FF;
                }
            </style>
        </head>
        <body>
            <div class="logo">Maziila<span>Travel</span></div>
            ${receiptContent}
            <div class="text-center mt-4">
                <p>Terima kasih telah memesan perjalanan dengan Maziila Travel!</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
} 