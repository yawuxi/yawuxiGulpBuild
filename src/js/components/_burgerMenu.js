//burgerMenu
const burgerBtn = document.querySelector('.burger-menu__content'),
	burgerMenu = document.querySelector('.header__navigation'),
	header = document.querySelector('.header'),
	body = document.body;

burgerBtn.addEventListener('click', () => {
	burgerBtn.classList.toggle('active');
	burgerMenu.classList.toggle('active');
	body.classList.toggle('lock');
	if (document.documentElement.offsetWidth > 768) {
		if (header.style.paddingRight == '17px' && body.style.paddingRight == '17px') {
			header.style.paddingRight = '';
			body.style.paddingRight = '';
		} else {
			header.style.paddingRight = '17px';
			body.style.paddingRight = '17px';
		}
	}
});