"use strict";
const deleteForm = document.querySelector('.delete-message');
const listMessage = document.querySelector('.list-message');
if (deleteForm) {
    deleteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = window.location.pathname.split('/')[2];
        fetch(`/messages/${id}/delete`, {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) {
                console.log("erreur delte message");
            }
            const res = response.json();
            res.then(datas => {
                window.localStorage.setItem('textMessage', datas.message.text);
                window.localStorage.setItem('typeMessage', datas.message.type);
                window.location.href = datas.url;
            });
        });
    });
}
