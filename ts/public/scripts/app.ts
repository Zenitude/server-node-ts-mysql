if(document.querySelector('.logout')) {
    const openModal = document.querySelector('.logout') as HTMLButtonElement;
    const modal = document.querySelector('dialog') as HTMLDialogElement;
    const closeModal = document.querySelectorAll('.closeModal');

    openModal?.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        modal?.showModal();
    })
    
    closeModal?.forEach(button => 
        (button as HTMLButtonElement).addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            modal.close();
        })
    );

}

const displayMessage = (content: {type: string; text: string}, element: HTMLFormElement | HTMLLinkElement | HTMLParagraphElement) => {
    const main = document.querySelector('main') as HTMLElement;
    const message = document.createElement('p');
    message.setAttribute('class', 'alert');
    message.classList.add(content.type);
    message.innerHTML = content.text;
    
    main.insertBefore(message, element);

    setTimeout(() => {
        window.localStorage.removeItem('textMessage');
        window.localStorage.removeItem('typeMessage');
        message.remove();
    }, 2000)
}

const home = document.querySelector('.home') as HTMLParagraphElement;
if(home) {
    const message = {
        type: window.localStorage.getItem('typeMessage') ?? '',
        text: window.localStorage.getItem('textMessage') ?? ''
    }
    
    if(message.text && message.text.trim() !== '') {
        displayMessage(message, home);
    }
}