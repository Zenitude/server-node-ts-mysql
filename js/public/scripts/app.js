"use strict";
if (document.querySelector('.logout')) {
    const openModal = document.querySelector('.logout');
    const modal = document.querySelector('dialog');
    const closeModal = document.querySelectorAll('.closeModal');
    openModal?.addEventListener('click', (e) => {
        e.preventDefault();
        modal?.showModal();
    });
    closeModal?.forEach(button => button.addEventListener('click', (e) => {
        e.preventDefault();
        modal.close();
    }));
}
const displayMessage = (content, element) => {
    const main = document.querySelector('main');
    const message = document.createElement('p');
    message.setAttribute('class', 'alert');
    message.classList.add(content.type);
    message.innerHTML = content.text;
    main.insertBefore(message, element);
    setTimeout(() => {
        window.localStorage.removeItem('textMessage');
        window.localStorage.removeItem('typeMessage');
        message.remove();
    }, 2000);
};
const home = document.querySelector('.home');
if (home) {
    const message = {
        type: window.localStorage.getItem('typeMessage') ?? '',
        text: window.localStorage.getItem('textMessage') ?? ''
    };
    if (message.text && message.text.trim() !== '') {
        displayMessage(message, home);
    }
}
