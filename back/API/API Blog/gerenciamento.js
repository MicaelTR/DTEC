const API_URL = "http://localhost:3000/usuarios";

// Containers e formulários
const userCardsContainer = document.getElementById("user-cards-container");
const listarUser = document.getElementById("btnListUsers");

const userForm = document.getElementById("addUserForm");
const name = document.getElementById("addName");
const idade = document.getElementById("addAge");

const EditarUser = document.getElementById("editUserForm");
const editarModal = document.getElementById("editModal");
const editIdinp = document.getElementById("editId");
const editrName = document.getElementById("editName");
const editAge = document.getElementById("editAge");
const btnCancelar = document.getElementById("btnCancelEdit");

// ====================== FUNÇÕES ======================

// Buscar e renderizar usuários
function fetchAndRenderUsers() {
    fetch(API_URL)
        .then(response => response.json())
        .then(users => renderUsers(users))
        .catch(error => {
            console.error("Erro ao buscar usuários:", error);
            userCardsContainer.innerHTML = "<p><strong>Erro ao carregar usuários!</strong></p>";
        });
}

// Adicionar usuário
function addUser(userData) {
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(() => {
        userForm.reset();
        fetchAndRenderUsers();
    })
    .catch(error => console.error("Erro ao adicionar usuário:", error));
}

// Editar usuário
function editUser(userId, userData) {
    fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(() => {
        editarModal.style.display = "none";
        fetchAndRenderUsers();
    })
    .catch(error => console.error("Erro ao editar usuário:", error));
}

// Deletar usuário
function deleteUser(userId) {
    fetch(`${API_URL}/${userId}`, { method: "DELETE" })
        .then(() => fetchAndRenderUsers())
        .catch(error => console.error("Erro ao deletar usuário:", error));
}

// Renderizar usuários na tela
function renderUsers(users) {
    userCardsContainer.innerHTML = "";

    if (users.length === 0) {
        userCardsContainer.innerHTML = "<p><strong>Nenhum usuário cadastrado!</strong></p>";
        return;
    }

    users.forEach(user => {
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
            </div>
        `;

        userCardsContainer.appendChild(userCard);

        // Botão Editar
        const btnEdit = userCard.querySelector(".btn-edit");
        btnEdit.addEventListener("click", () => {
            editarModal.style.display = "flex";
            editIdinp.value = user.id;
            editrName.value = user.nome;
            editAge.value = user.idade;
        });

        // Botão Deletar
        const btnDelete = userCard.querySelector(".btn-delete");
        btnDelete.addEventListener("click", () => {
            if (confirm(`Tem certeza que deseja deletar o usuário ${user.nome}?`)) {
                deleteUser(user.id);
            }
        });
    });
}

// ====================== EVENT LISTENERS ======================

// Listar usuários
listarUser.addEventListener("click", fetchAndRenderUsers);

// Adicionar usuário
userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const novoUsuario = {
        nome: name.value,
        idade: parseInt(idade.value)
    };
    addUser(novoUsuario);
});

// Editar usuário
EditarUser.addEventListener("submit", (e) => {
    e.preventDefault();
    const userId = editIdinp.value;
    const updatedUser = {
        nome: editrName.value,
        idade: parseInt(editAge.value)
    };
    editUser(userId, updatedUser);
});

// Cancelar edição
btnCancelar.addEventListener("click", () => {
    editarModal.style.display = "none";
});
