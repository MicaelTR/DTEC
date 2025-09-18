function modal() {
    const modal = document.querySelector(".modal");
    modal.style.display = "flex";
    
}

document.addEventListener("click" , (e) => {
    if(e.target.classList.contains("btn-edit")) {
        modal()
    }

})

function closeModal() {
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
}

document.addEventListener("click" , (e) => {
    if(e.target.classList.contains("btn-cancel")) {
        closeModal()
    }
})

