document.addEventListener('DOMContentLoaded', function() {
    const addressesButton = document.querySelector('.addresses button');
    const addressesPopup = document.getElementById('addresses-popup');
    const closeButton = document.querySelector('#addresses-popup .close-button');
    const popupContent = document.querySelector('#addresses-popup .popup-content'); 

    if (addressesButton && addressesPopup && popupContent && closeButton) {
        addressesButton.addEventListener('click', function() {
            addressesPopup.style.display = 'flex';
            setTimeout(() => addressesPopup.classList.add('show'), 0); 
        });

        closeButton.addEventListener('click', function() {
            addressesPopup.classList.remove('show');
            setTimeout(() => addressesPopup.style.display = 'none', 300); 
        });

        window.addEventListener('click', function(event) {
            if (event.target === addressesPopup) {
                addressesPopup.classList.remove('show');
                setTimeout(() => addressesPopup.style.display = 'none', 300); 
            }
        });
    }
});