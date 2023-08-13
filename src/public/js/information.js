let editBtn = document.querySelector('#edit');
let editForm = document.querySelector('.editinfo');
let formoff = document.querySelector('#off');
editBtn.addEventListener('click', () => {
    editForm.classList.add('active');
});
formoff.addEventListener('click', () => {
    editForm.classList.remove('active');
})

var formUploadAvatar = document.querySelector('.image form')
document.querySelector('.image img').onclick=function(e) {
    Object.assign(formUploadAvatar.style, {
        display: 'block',
    })
}
document.querySelector('.content').onclick=function(e) {
    Object.assign(formUploadAvatar.style, {
        display: 'none',
    })
}
document.querySelector('.editinfo').onclick=function(e) {
    Object.assign(formUploadAvatar.style, {
        display: 'none',
    })
}
document.querySelector('.experience').onclick=function(e) {
    Object.assign(formUploadAvatar.style, {
        display: 'none',
    })
}

var imgElement=document.querySelector('.image img')
console.log(imgElement.src)
if(imgElement.src=='http://localhost:5000/uploads/') imgElement.src="http://localhost:5000/image/user.svg"
var dataString=document.querySelector('.image form input')
console.log(document.querySelector('.image form input').textContent)
