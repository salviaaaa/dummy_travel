/**
 * Maziila Travel - Main JavaScript File
 * Menangani data dan interaksi untuk website Maziila Travel
 * Version 1.0
 */

// Fungsi untuk mengambil data dari file JSON
async function fetchData(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Terjadi kesalahan saat mengambil data: ${error}`);
        return null;
    }
}

// Fungsi untuk memformat harga dalam format Rupiah
function formatRupiah(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

// Fungsi untuk mengambil dan menampilkan destinasi unggulan pada halaman beranda
async function loadFeaturedDestinations() {
    const container = document.getElementById('featured-destinations-container');
    if (!container) return;
    
    try {
        const data = await fetchData('data/destinations.json');
        if (!data || !data.destinations) return;
        
        // Urutkan berdasarkan rating dan ambil 6 teratas
        const featuredDestinations = data.destinations
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
        
        // Kosongkan container dan hilangkan loading spinner
        container.innerHTML = '';
        
        // Tampilkan destinasi
        featuredDestinations.forEach(destination => {
            container.innerHTML += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="destination-card h-100">
                        <div class="destination-img">
                            <img src="${destination.image}" alt="${destination.name}" class="img-fluid">
                            <div class="destination-rating">
                                <i class="fas fa-star"></i> ${destination.rating}
                            </div>
                            <div class="location-icon">
                                <i class="fas fa-map-marker-alt"></i> ${destination.location}
                            </div>
                        </div>
                        <div class="destination-content p-4">
                            <h4 class="destination-title">${destination.name}</h4>
                            <p class="destination-text">${destination.description}</p>
                            <div class="destination-meta">
                                <span><i class="fas fa-calendar-alt"></i> Waktu terbaik: ${destination.best_time_to_visit}</span>
                            </div>
                            <button class="btn btn-sm btn-outline-primary mt-3" onclick="openDestinationModal(${destination.id})">Lihat Detail</button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error}`);
        container.innerHTML = `<div class="col-12 text-center"><p>Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p></div>`;
    }
}

// Fungsi untuk mengambil dan menampilkan paket populer pada halaman beranda
async function loadPopularPackages() {
    const container = document.getElementById('popular-packages-container');
    if (!container) return;
    
    try {
        const data = await fetchData('data/packages.json');
        if (!data || !data.packages) return;
        
        // Urutkan berdasarkan rating dan ambil 3 teratas
        const popularPackages = data.packages
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);
        
        // Kosongkan container dan hilangkan loading spinner
        container.innerHTML = '';
        
        // Tampilkan paket
        popularPackages.forEach(pack => {
            container.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="package-card h-100">
                        <div class="package-img">
                            <img src="${pack.image}" alt="${pack.name}" class="img-fluid">
                            <div class="package-price">
                                ${formatRupiah(pack.price)}
                            </div>
                        </div>
                        <div class="package-content p-4">
                            <div class="package-rating mb-2">
                                ${generateStarRating(pack.rating)}
                            </div>
                            <h4 class="package-title">${pack.name}</h4>
                            <div class="package-info my-3">
                                <span><i class="fas fa-calendar-days"></i> ${pack.duration}</span>
                            </div>
                            <p class="package-text">${pack.description}</p>
                            <button class="btn btn-sm btn-primary mt-3" onclick="openPackageModal(${pack.id})">Lihat Detail</button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error}`);
        container.innerHTML = `<div class="col-12 text-center"><p>Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p></div>`;
    }
}

// Fungsi untuk menghasilkan rating bintang
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }
    
    return stars;
}

// Fungsi untuk menampilkan semua destinasi pada halaman destinasi
async function loadAllDestinations() {
    const container = document.getElementById('destinations-container');
    if (!container) return;
    
    try {
        const data = await fetchData('data/destinations.json');
        if (!data || !data.destinations) return;
        
        // Kosongkan container dan hilangkan loading spinner
        container.innerHTML = '';
        
        // Tampilkan semua destinasi
        data.destinations.forEach(destination => {
            container.innerHTML += `
                <div class="col-md-6 col-lg-4 mb-4 destination-item" 
                     data-name="${destination.name.toLowerCase()}" 
                     data-location="${destination.location.toLowerCase()}">
                    <div class="destination-card h-100">
                        <div class="destination-img">
                            <img src="${destination.image}" alt="${destination.name}" class="img-fluid">
                            <div class="destination-rating">
                                <i class="fas fa-star"></i> ${destination.rating}
                            </div>
                            <div class="location-icon">
                                <i class="fas fa-map-marker-alt"></i> ${destination.location}
                            </div>
                        </div>
                        <div class="destination-content p-4">
                            <h4 class="destination-title">${destination.name}</h4>
                            <p class="destination-text">${destination.description}</p>
                            <div class="destination-meta">
                                <span><i class="fas fa-calendar-alt"></i> Waktu terbaik: ${destination.best_time_to_visit}</span>
                            </div>
                            <button class="btn btn-sm btn-outline-primary mt-3" onclick="openDestinationModal(${destination.id})">Lihat Detail</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Inisialisasi pencarian dan filter
        initDestinationSearch();
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error}`);
        container.innerHTML = `<div class="col-12 text-center"><p>Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p></div>`;
    }
}

// Fungsi untuk menampilkan semua paket wisata pada halaman paket
async function loadAllPackages() {
    const container = document.getElementById('packages-container');
    if (!container) return;
    
    try {
        const data = await fetchData('data/packages.json');
        if (!data || !data.packages) return;
        
        // Kosongkan container dan hilangkan loading spinner
        container.innerHTML = '';
        
        // Tampilkan semua paket
        data.packages.forEach(pack => {
            container.innerHTML += `
                <div class="col-md-6 col-lg-4 mb-4 package-item" 
                     data-name="${pack.name.toLowerCase()}" 
                     data-price="${pack.price}" 
                     data-duration="${pack.duration}">
                    <div class="package-card h-100">
                        <div class="package-img">
                            <img src="${pack.image}" alt="${pack.name}" class="img-fluid">
                            <div class="package-price">
                                ${formatRupiah(pack.price)}
                            </div>
                        </div>
                        <div class="package-content p-4">
                            <div class="package-rating mb-2">
                                ${generateStarRating(pack.rating)}
                            </div>
                            <h4 class="package-title">${pack.name}</h4>
                            <div class="package-info my-3">
                                <span><i class="fas fa-calendar-days"></i> ${pack.duration}</span>
                            </div>
                            <p class="package-text">${pack.description}</p>
                            <button class="btn btn-sm btn-primary mt-3" onclick="openPackageModal(${pack.id})">Lihat Detail</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Inisialisasi pencarian dan filter
        initPackageSearch();
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error}`);
        container.innerHTML = `<div class="col-12 text-center"><p>Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p></div>`;
    }
}

// Fungsi untuk menampilkan detail destinasi pada modal
async function openDestinationModal(id) {
    try {
        const data = await fetchData('data/destinations.json');
        if (!data || !data.destinations) return;
        
        const destination = data.destinations.find(dest => dest.id === id);
        if (!destination) return;
        
        const modalBody = document.getElementById('destinationModalBody');
        if (!modalBody) return;
        
        // Memetakan nama tempat wisata ke path gambar
        const getImagePath = (placeName) => {
            // Menghilangkan tanda kurung jika ada
            const cleanName = placeName.replace(/\([^)]*\)/g, '').trim();
            return `assets/images/${cleanName}.jpg`;
        };
        
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6 mb-4 mb-md-0">
                    <img src="${destination.image}" alt="${destination.name}" class="img-fluid rounded">
                </div>
                <div class="col-md-6">
                    <h3>${destination.name}</h3>
                    <div class="d-flex align-items-center mb-3">
                        <div class="me-3">
                            <i class="fas fa-map-marker-alt text-primary"></i> ${destination.location}
                        </div>
                        <div>
                            <i class="fas fa-star text-warning"></i> ${destination.rating}
                        </div>
                    </div>
                    <p>${destination.description}</p>
                    <div class="mb-4">
                        <h5>Tempat Wisata Populer:</h5>
                        <div class="row g-3">
                            ${destination.popular_activities.map(place => `
                                <div class="col-6">
                                    <div class="card h-100">
                                        <img src="${getImagePath(place)}" class="card-img-top" alt="${place}">
                                        <div class="card-body p-2">
                                            <p class="card-text text-center mb-0 small fw-bold">${place}</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <h5>Waktu Terbaik untuk Berkunjung:</h5>
                        <p><i class="fas fa-calendar-alt text-primary me-2"></i>${destination.best_time_to_visit}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Tampilkan modal
        const modal = new bootstrap.Modal(document.getElementById('destinationModal'));
        modal.show();
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error}`);
    }
}

// Fungsi untuk menangani tombol booking dari modal paket
function redirectToBooking(packageId) {
    // Simpan ID paket di sessionStorage untuk diambil di halaman booking
    sessionStorage.setItem('selectedPackageId', packageId);
    window.location.href = 'booking.html';
}

// Fungsi untuk menampilkan detail paket wisata pada modal
async function openPackageModal(id) {
    try {
        const packagesData = await fetchData('data/packages.json');
        const destinationsData = await fetchData('data/destinations.json');
        
        if (!packagesData || !packagesData.packages || !destinationsData || !destinationsData.destinations) return;
        
        const pack = packagesData.packages.find(p => p.id === id);
        if (!pack) return;
        
        // Dapatkan informasi destinasi terkait
        const relatedDestinations = pack.destinations.map(destId => {
            return destinationsData.destinations.find(d => d.id === destId);
        }).filter(Boolean);
        
        const modalBody = document.getElementById('packageModalBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6 mb-4 mb-md-0">
                    <img src="${pack.image}" alt="${pack.name}" class="img-fluid rounded">
                    <div class="package-rating my-3">
                        ${generateStarRating(pack.rating)}
                    </div>
                </div>
                <div class="col-md-6">
                    <h3>${pack.name}</h3>
                    <div class="package-price-modal mb-3">
                        <h4 class="text-primary">${formatRupiah(pack.price)}</h4>
                    </div>
                    <div class="package-duration mb-3">
                        <i class="fas fa-calendar-days text-primary me-2"></i> ${pack.duration}
                    </div>
                    <p>${pack.description}</p>
                    
                    <div class="mb-4">
                        <h5>Highlights:</h5>
                        <ul class="list-unstyled">
                            ${pack.highlights.map(highlight => `
                                <li class="mb-2"><i class="fas fa-check-circle text-primary me-2"></i>${highlight}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="mb-4">
                        <h5>Termasuk:</h5>
                        <ul class="list-unstyled">
                            ${pack.inclusions.map(inclusion => `
                                <li class="mb-2"><i class="fas fa-check text-primary me-2"></i>${inclusion}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    ${relatedDestinations.length > 0 ? `
                        <div>
                            <h5>Destinasi:</h5>
                            <div class="d-flex flex-wrap">
                                ${relatedDestinations.map(dest => `
                                    <span class="badge bg-light text-dark me-2 mb-2 p-2">${dest.name}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Simpan ID paket ke dalam modal
        const packageModal = document.getElementById('packageModal');
        if (packageModal) {
            packageModal._packageId = id;
        }
        
        // Tampilkan modal
        const modal = new bootstrap.Modal(document.getElementById('packageModal'));
        modal.show();
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error}`);
    }
}

// Inisialisasi pencarian dan filter destinasi
function initDestinationSearch() {
    const searchInput = document.getElementById('destination-search');
    const filterSelect = document.getElementById('destination-filter');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !filterSelect || !searchBtn) return;
    
    // Event listener untuk tombol pencarian
    searchBtn.addEventListener('click', filterDestinations);
    // Event listener untuk input pencarian (ketika user menekan Enter)
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterDestinations();
        }
    });
    // Event listener untuk perubahan filter
    filterSelect.addEventListener('change', filterDestinations);
    
    function filterDestinations() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value.toLowerCase();
        
        const destinationItems = document.querySelectorAll('.destination-item');
        
        destinationItems.forEach(item => {
            const name = item.getAttribute('data-name');
            const location = item.getAttribute('data-location');
            
            // Logika filter
            const matchesSearch = name.includes(searchTerm) || (searchTerm === '');
            const matchesFilter = filterValue === 'all' || location.includes(filterValue);
            
            // Tampilkan atau sembunyikan item berdasarkan filter
            if (matchesSearch && matchesFilter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Inisialisasi pencarian dan filter paket wisata
function initPackageSearch() {
    const searchInput = document.getElementById('package-search');
    const durationFilter = document.getElementById('duration-filter');
    const priceFilter = document.getElementById('price-filter');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !durationFilter || !priceFilter || !searchBtn) return;
    
    // Event listener untuk tombol pencarian
    searchBtn.addEventListener('click', filterPackages);
    // Event listener untuk input pencarian (ketika user menekan Enter)
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterPackages();
        }
    });
    // Event listener untuk perubahan filter
    durationFilter.addEventListener('change', filterPackages);
    priceFilter.addEventListener('change', filterPackages);
    
    function filterPackages() {
        const searchTerm = searchInput.value.toLowerCase();
        const durationValue = durationFilter.value;
        const priceValue = priceFilter.value;
        
        const packageItems = document.querySelectorAll('.package-item');
        
        packageItems.forEach(item => {
            const name = item.getAttribute('data-name');
            const price = parseInt(item.getAttribute('data-price'));
            const duration = item.getAttribute('data-duration');
            const days = parseInt(duration.split(' ')[0]);
            
            // Logika filter pencarian
            const matchesSearch = name.includes(searchTerm) || (searchTerm === '');
            
            // Logika filter durasi
            let matchesDuration = true;
            if (durationValue === '1-3') {
                matchesDuration = days >= 1 && days <= 3;
            } else if (durationValue === '4-7') {
                matchesDuration = days >= 4 && days <= 7;
            } else if (durationValue === '8+') {
                matchesDuration = days >= 8;
            }
            
            // Logika filter harga
            let matchesPrice = true;
            if (priceValue === '0-3000000') {
                matchesPrice = price < 3000000;
            } else if (priceValue === '3000000-7000000') {
                matchesPrice = price >= 3000000 && price <= 7000000;
            } else if (priceValue === '7000000+') {
                matchesPrice = price > 7000000;
            }
            
            // Tampilkan atau sembunyikan item berdasarkan filter
            if (matchesSearch && matchesDuration && matchesPrice) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Inisialisasi form kontak
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        // Tampilkan pesan sukses
        alert(`Terima kasih ${name}! Pesan Anda telah terkirim. Kami akan menghubungi Anda melalui ${email} segera.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Event listener untuk saat dokumen selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-dark', 'navbar-scrolled');
            } else {
                navbar.classList.remove('bg-dark', 'navbar-scrolled');
            }
        });
    }
    
    // Inisialisasi fungsi-fungsi halaman berdasarkan halaman yang sedang dibuka
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html') || currentPage.endsWith('/')) {
        loadFeaturedDestinations();
        loadPopularPackages();
    } else if (currentPage.includes('destinations.html')) {
        loadAllDestinations();
    } else if (currentPage.includes('packages.html')) {
        loadAllPackages();
    } else if (currentPage.includes('contact.html')) {
        initContactForm();
    }
    
    // Inisialisasi tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Tambahkan event listener untuk tombol booking di modal
    const bookingBtn = document.getElementById('bookingBtn');
    if (bookingBtn) {
        bookingBtn.addEventListener('click', function() {
            // Dapatkan ID paket yang sedang aktif di modal
            const packageModal = document.getElementById('packageModal');
            if (packageModal && packageModal._packageId) {
                redirectToBooking(packageModal._packageId);
            }
        });
    }
});

// Definisikan fungsi untuk global scope agar bisa dipanggil dari event handler HTML
window.openDestinationModal = openDestinationModal;
window.openPackageModal = openPackageModal;
window.redirectToBooking = redirectToBooking; 