(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
        }, false)
    })
    })()

const images = document.querySelector('#images');
const ul = document.querySelector('.list-images');

if(images){
    images.addEventListener('change',()=>{    
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        if(images.files.length>0){
            for(let img of images.files){
                const li = document.createElement('li');
                li.innerText = img.name;
                ul.append(li);
            }
            ul.classList.remove('d-none');
        }
    })
}