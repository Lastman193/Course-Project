document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.mobile-logo');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const mobileMenuWrapper = document.querySelector('.mobile-menu-wrapper');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuButton = document.querySelector('.close-menu-button');
    const catalogLink = document.querySelector('.catalog-link');
    const categoriesMenu = document.querySelector('.mobile-menu-categories'); // Получаем элемент
    const backButton = document.querySelector('.back-button');

    // Проверяем, был ли найден элемент categoriesMenu
    if (categoriesMenu) {
        categoriesMenu.classList.remove('show');
    }

    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            mobileMenuContainer.style.display = 'block';
            mobileMenu.classList.add('show');
            if (categoriesMenu) {
                categoriesMenu.classList.remove('show');
            }
        });
    }

    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', function() {
            mobileMenu.classList.remove('show');
            if (categoriesMenu) {
                categoriesMenu.classList.remove('show');
            }
            setTimeout(function() {
                mobileMenuContainer.style.display = 'none';
            }, 300);
        });
    }

    if (catalogLink) {
        catalogLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (categoriesMenu) {
                categoriesMenu.classList.add('show');
            }
        });
    }

    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (categoriesMenu) {
                categoriesMenu.classList.remove('show');
            }
        });
    }

    if (mobileMenuContainer) {
        mobileMenuContainer.addEventListener('click', function(e) {
            if (e.target === mobileMenuContainer) {
                mobileMenu.classList.remove('show');
                if (categoriesMenu) {
                    categoriesMenu.classList.remove('show');
                }
                setTimeout(function() {
                    mobileMenuContainer.style.display = 'none';
                }, 300);
            }
        });
    }
});