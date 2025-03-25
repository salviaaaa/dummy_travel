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
        
        // Fungsi untuk mendapatkan path gambar berdasarkan nama tempat wisata
        const getImagePath = (placeName) => {
            // Mapping nama tempat wisata ke file gambar
            const imageMap = {
                // Jakarta
                "Monumen Nasional (Monas)": "assets/images/destinations/Monas.jpg",
                "Kota Tua Jakarta": "assets/images/destinations/Kota Tua.jpg",
                "Taman Mini Indonesia Indah": "assets/images/destinations/TMII.jpg",
                "Ancol": "assets/images/destinations/Ancol.jpg",
                
                // Bandung
                "Kawah Putih": "assets/images/destinations/Kawah Putih.jpg",
                "Tangkuban Perahu": "assets/images/destinations/Tangkuban Perahu.jpg",
                "Jalan Braga": "assets/images/destinations/Braga.jpg",
                "Lembang": "assets/images/destinations/Lembang.jpg",
                
                // Surabaya
                "Tugu Pahlawan": "assets/images/destinations/Tugu Pahlawan.jpg",
                "House of Sampoerna": "assets/images/destinations/House of Sampoerna.jpg",
                "Jembatan Suramadu": "assets/images/destinations/Jembatan Suramadu.jpg",
                "Kebun Binatang Surabaya": "assets/images/destinations/Kebun Binatang Surabaya.jpg",
                
                // Medan
                "Istana Maimun": "assets/images/destinations/Istana Maimun.jpg",
                "Masjid Raya Medan": "assets/images/destinations/Masjid Raya Medan.jpg",
                "Tjong A Fie Mansion": "assets/images/destinations/Tjong A Fie Mansion.jpg",
                "Danau Toba": "assets/images/destinations/Danau Toba.jpg",
                
                // Makassar
                "Pantai Losari": "assets/images/destinations/Pantai Losari.jpg",
                "Benteng Rotterdam": "assets/images/destinations/Benterng Rotterdam.jpg",
                "Pulau Samalona": "assets/images/destinations/Pulau Samalona.jpg",
                "Trans Studio Makassar": "assets/images/destinations/Trans Studio Makassar.jpg",
                
                // Semarang
                "Lawang Sewu": "assets/images/destinations/Lawang Sewu.jpg",
                "Kota Lama Semarang": "assets/images/destinations/Kota Lama.jpg",
                "Sam Poo Kong": "assets/images/destinations/Sam Poo Kong.jpg",
                "Masjid Agung Jawa Tengah": "assets/images/destinations/Masjid Agung Jawa Tengah.jpg",
                
                // Balikpapan
                "Pantai Kemala": "assets/images/destinations/Pantai Kemala.jpg",
                "Hutan Lindung Sungai Wain": "assets/images/destinations/Hutan Lindung Sungai Wain.jpg",
                "Bukit Bangkirai": "assets/images/destinations/Bukit Bangkirai.jpg",
                "Penangkaran Buaya Teritip": "assets/images/destinations/Penangkaran Buaya Teritip.jpg",
                
                // Palembang
                "Jembatan Ampera": "assets/images/destinations/Jembatan Ampera.jpg",
                "Benteng Kuto Besak": "assets/images/destinations/Benteng Kuto Besak.jpg",
                "Pulau Kemaro": "assets/images/destinations/Pulau Kemaro.jpg",
                "Museum Sultan Mahmud Badaruddin II": "assets/images/destinations/Museum Sultan Mahmud Badaruddin II.jpg",
                
                // Manado
                "Taman Nasional Bunaken": "assets/images/destinations/Bunaken.jpg",
                "Bukit Kasih": "assets/images/destinations/Bukit Kasih.jpg",
                "Danau Tondano": "assets/images/destinations/Danau Tondano.jpg",
                "Pulau Siladen": "assets/images/destinations/Pulau Siladen.jpg",

                // Bali
                "Pantai Kuta": "assets/images/destinations/Pantai Kuta.jpg",
                "Tanah Lot": "assets/images/destinations/Tanah Lot.jpg",
                "Ubud Monkey Forest": "assets/images/destinations/Ubud Monkey Forest.jpg",
                "Tegalalang": "assets/images/destinations/Tegalalang.jpg",

                // Raja Ampat
                "Diving": "assets/images/destinations/diving-raja-ampat.jpg",
                "Island Hopping": "assets/images/destinations/island-hopping-raja-ampat.jpg",
                "Pulau Wayag": "assets/images/destinations/Pulau Wayag.jpg",
                "Piaynemo": "assets/images/destinations/Piaynemo.jpg",

                // Labuan Bajo
                "Komodo Dragon Tour": "assets/images/destinations/komodo_dragon.jpg",
                "Diving": "assets/images/destinations/diving_labuan.jpg",
                "Pink Beach": "assets/images/destinations/pink_beach.jpg",
                "Sunset Watching": "assets/images/destinations/sunset_labuan.jpg",

                // Yogyakarta
                "Borobudur": "assets/images/destinations/Borobudur.jpg",
                "Keraton Yogyakarta": "assets/images/destinations/Keraton Yogyakarta.jpg",
                "Malioboro": "assets/images/destinations/Malioboro.jpg",
                "Pantai Parangtritis": "assets/images/destinations/Pantai Parangtritis.jpg",

                // Danau Toba Activities
                "Boat Tours": "assets/images/destinations/boat-tours-toba.jpg",
                "Cultural Visits": "assets/images/destinations/cultural-toba.jpg",
                "Swimming": "assets/images/destinations/swimming-toba.jpg",
                "Hiking": "assets/images/destinations/hiking-toba.jpg",

                // Lombok
                "Trekking Mount Rinjani": "assets/images/destinations/rinjani.jpg",
                "Beach Hopping": "assets/images/destinations/beach-hopping-lombok.jpg",
                "Surfing": "assets/images/destinations/surfing-lombok.jpg",
                "Visiting Gili Islands": "assets/images/destinations/gili-islands.jpg",

                // Bromo
                "Sunrise Tours": "assets/images/destinations/sunrise-bromo.jpg",
                "Jeep Adventures": "assets/images/destinations/jeep-bromo.jpg",
                "Hiking": "assets/images/destinations/hiking-bromo.jpg",
                "Photography": "assets/images/destinations/photography-bromo.jpg",

                // Tana Toraja
                "Cultural Tours": "assets/images/destinations/cultural-toraja.jpg",
                "Traditional Funeral Ceremonies": "assets/images/destinations/funeral-toraja.jpg",
                "Trekking": "assets/images/destinations/trekking-toraja.jpg",
                "Village Visits": "assets/images/destinations/village-toraja.jpg",

                // Wakatobi
                "Diving": "assets/images/destinations/diving_wakatobi.jpg",
                "Snorkeling": "assets/images/destinations/snorkeling_wakatobi.jpg",
                "Marine Conservation": "assets/images/destinations/marine-wakatobi.jpg",
                "Beach Relaxation": "assets/images/destinations/beach-wakatobi.jpg",

                // Belitung
                "Island Hopping": "assets/images/destinations/island-belitung.jpg",
                "Snorkeling": "assets/images/destinations/snorkeling-belitung.jpg",                
                "Lighthouse Visits": "assets/images/destinations/lighthouse-belitung.jpg",
                "Local Cuisine": "assets/images/destinations/cuisine-belitung.jpg",

                // Kawah Ijen
                "Blue Fire Night Trek": "assets/images/destinations/kawah-ijen.jpg",
                "Crater Lake Visit": "assets/images/destinations/crater-ijen.jpg",
                "Sunrise Viewing": "assets/images/destinations/sunrise-ijen.jpg",
                "Sulfur Mining Tour": "assets/images/destinations/sulfur-mining-ijen.jpg",

                // Derawan Islands
                "Swimming with Jellyfish": "assets/images/destinations/jellyfish-derawan.jpg",
                "Diving": "assets/images/destinations/diving-derawan.jpg",
                "Sea Turtle Watching": "assets/images/destinations/turtle-derawan.jpg",
                "Relaxation": "assets/images/destinations/relax-derawan.jpg",

                // Wae Rebo
                "Cultural Immersion": "assets/images/destinations/cultural-waerebo.jpg",
                "Traditional House Visit": "assets/images/destinations/house-waerebo.jpg",
                "Trekking": "assets/images/destinations/trek-waerebo.jpg",
                "Photography": "assets/images/destinations/photo-waerebo.jpg",

                // Sumba
                "Pasola Festival": "assets/images/destinations/pasola-sumba.jpg",
                "Traditional Village Tours": "assets/images/destinations/village-sumba.jpg",
                "Beach Exploration": "assets/images/destinations/beach-sumba.jpg",
                "Cultural Learning": "assets/images/destinations/culture-sumba.jpg",

                // Bukittinggi
                "Sianok Canyon Tour": "assets/images/destinations/sianok-bukittinggi.jpg",
                "Japanese Tunnels": "assets/images/destinations/tunnels-bukittinggi.jpg",
                "Culinary Tours": "assets/images/destinations/culinary-bukittinggi.jpg",
                "Cultural Visits": "assets/images/destinations/cultural-bukittinggi.jpg",

                // Kepulauan Seribu
                "Snorkeling": "assets/images/destinations/snorkeling-seribu.jpg",
                "Island Hopping": "assets/images/destinations/hopping-seribu.jpg",
                "Beach Activities": "assets/images/destinations/beach-seribu.jpg",
                "Marine Tourism": "assets/images/destinations/marine-seribu.jpg",

                // Tanjung Puting
                "Orangutan Viewing": "assets/images/destinations/orangutan-tanjungputing.jpg",
                "River Cruises": "assets/images/destinations/cruise-tanjungputing.jpg",
                "Wildlife Observation": "assets/images/destinations/wildlife-tanjungputing.jpg",

                // Kepulauan Anambas
                "Pulau Bawah": "assets/images/destinations/pulau-bawah-anambas.jpg",
                "Pulau Penjalin": "assets/images/destinations/pulau-penjalin-anambas.jpg",
                "Diving di Terumbu Karang Anambas": "assets/images/destinations/diving-anambas.jpg",
                "Wisata Bahari & Island Hopping": "assets/images/destinations/island-hopping-anambas.jpg"
            };
            
            return imageMap[placeName] || destination.image;
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
                        <div class="row">
                            ${destination.popular_activities.map(activity => `
                                <div class="col-md-6 mb-3">
                                    <div class="card popular-place-card h-100">
                                        <img src="${getImagePath(activity)}" class="card-img-top" alt="${activity}">
                                        <div class="card-body">
                                            <p class="card-text"><i class="fas fa-map-marker-alt text-primary me-1"></i>${activity}</p>
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
        
        // Tampilkan modal
        const modal = new bootstrap.Modal(document.getElementById('packageModal'));
        modal.show();
        
        // Event listener untuk tombol booking
        const bookingBtn = document.getElementById('bookingBtn');
        if (bookingBtn) {
            bookingBtn.onclick = () => redirectToBooking(id);
        }
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

// Fungsi untuk menginisialisasi newsletter subscription
function initNewsletter() {
    document.querySelectorAll('.btn-primary[type="button"]').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input && input.value) {
                const modal = new bootstrap.Modal(document.getElementById('newsletterModal'));
                modal.show();
                input.value = '';
            }
        });
    });
}

// Inisialisasi semua fungsi saat dokumen dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi loading screen
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);

    // Inisialisasi newsletter
    initNewsletter();

    // Load data berdasarkan halaman
    loadFeaturedDestinations();
    loadPopularPackages();
    loadAllDestinations();
    loadAllPackages();
    initDestinationSearch();
    initPackageSearch();
    initContactForm();
});

// Definisikan fungsi untuk global scope agar bisa dipanggil dari event handler HTML
window.openDestinationModal = openDestinationModal;
window.openPackageModal = openPackageModal;
window.redirectToBooking = redirectToBooking;