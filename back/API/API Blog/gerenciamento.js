

//====-====-====-====-====-====-====-====-====-====-====-====-====-====-====-====-====

const API_URL = "http://localhost:3000/usuarios"

const userCardsContainer = document.getElementById("user-cards-container");
const listarUser = document.getElementById("btnListUsers");
const userForm = document.getElementById("addUserForm");


// ID 
const editIdinp = document.getElementById("editId");

// Editar
const editarModal = document.getElementById("editModal");
const editrName = document.getElementById("editName");
const editAge = document.getElementById("editAge");
const EditarUser = document.getElementById("editUserForm")

// Botões Editar
const btnCancelar = document.getElementById("btnCancelEdit")

// Editar
const name = document.getElementById("addName");
const idade = document.getElementById("addAge");


// Função

function fetchAndRenderUsers() {
    fetch(API_URL)
        .then(response => response.json())
        .then(users => renderUsers(users))
        .catch(error => {
            console.error("Erro ao buscar usuários:" , error) ,
            userCardsContainer.innerHTML = "<p><strong> Erro ao Carregar usuário! </strong></p>";
        })
        
}

function addUser(userData) {
    fetch(API_URL, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body : JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(() => {
        userForm.reset();
        fetchAndRenderUsers();
    })
    .catch(error => console.error("Erro ao adicionar usuário:", error));
} 

function editUser(userId, userData) {
    fetch(`${API_URL}/${userId}` , {
        method: "PUT",
        headers: {
            "content-type": "application/json"
        },
        body : JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(() => {
        editarModal.style.display = "none";
        fetchAndRenderUsers();
        
    })
    .catch(error => console.error("Erro ao editar usuário:", error));

}

function deleteUser(userId) {
    fetch(`${API_URL}/${userId}` , {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(() => {
        fetchAndRenderUsers()
    })
    .catch(error => console.error("Erro ao deletar usuário:", error));
}

function renderUsers(users) {
    userCardsContainer.innerHTML = "";
    if (users.length === 0) {
        userCardsContainer.innerHTML = `<p><strong> Nenhum usuário cadastrado! </strong></p>`;
        return;
    }
    else {
      users.forEach (user => {
        const userCard = document.createElement("div");
        userCard.className = "user-card";
        userCard.innerHTML = `
            <div class="user-info">
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Nome:</strong> ${user.nome}</p>
                <p><strong>Idade:</strong> ${user.idade}</p>
            </div>
            <div class="card-btns">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Deletar</button>
            </div>`;
        userCardsContainer.appendChild(userCard);

        
        const btnEdit = userCard.querySelector(".btn-edit");
        const btnDelete = userCard.querySelector(".btn-delete");
        
        // Botão Editar
        btnEdit.addEventListener("click", () => {
            editarModal.style.display = "flex";
            editIdinp.value = user.id;
            editrName.value = user.nome;
            editAge.value = user.idade;
        });

        // Botão Deletar
        btnDelete.addEventListener("click", () => {
            if (confirm(`Tem certeza que deseja deletar o usuário ${user.nome}?`)) {
                deleteUser(user.id);
            }
        });
      }) 
    }
}