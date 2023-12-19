// studentModal.open = true // funciona para abrir o dialog
// studentModal.open = false// funciona para fechar o dialog
// studentModal.setAttribute('open', true) // funciona para abrir o dialog
// studentModal.setAttribute('open', false) // não funciona para fechar o dialog
// studentModal.removeAttribute('open') funciona para fechar o dialog
// studentModal.showModal() // funciona para abrir o dialog
// studentModal.close() funciona para fechar o dialog

const baseUrl = "http://localhost:3000";

// Passo 1: Selecionar os elementos HTML necessários
const studentModal = document.querySelector("#student-modal");
const studentTable = document.querySelector("#student-table");
const studentForm = document.querySelector("#student-form");
const studentModalTitle = document.querySelector("#student-modal-title");
const saveStudentButton = document.querySelector("#save-student");
// studentModal.showModal()
// Passo 2: Definir função para abrir o modal do estudante
const openStudentModal = () => studentModal.showModal();
const createStudent = () => {
  studentModalTitle.innerHTML = `Novo Aluno`;
  saveStudentButton.innerHTML = "Criar";
  openStudentModal();
  saveStundentData(`${baseUrl}/alunos`, "POST");
};
// Passo 3: Definir função para fechar o modal do estudante
const closeStudentModal = () => studentModal.close();
// Passo 4: Criar uma linha na tabela do estudante
const createStudentTableRow = (id, name, matricula, curso) => {
  const tableTr = document.createElement("tr");
  tableTr.innerHTML = `
    <td>${name}</td>
    <td>${matricula}</td>
    <td>${curso}</td>
    <td align="center">
      <button class="button button--danger" onclick="deleteStudentTable(${id})">Apagar</button>
      <button class="button button--success" onclick="editdStudentModal(${id})"}>Editar</button>
    </td>`;
  studentTable.appendChild(tableTr);
};

const saveStundentData = (url, method) => {
  studentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // capturar os dados do formulário
    const formData = new FormData(studentForm);
    // transformar os dados do formulário em um objeto
    const payload = new URLSearchParams(formData);
    fetch(url, {
      method: method,
      body: payload,
    }).catch((error) => {
      closeStudentModal();
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });
  });
};

// Passo 7: Abrir o modal para criar um novo aluno
// Passo 8: Excluir um aluno da tabela
const deleteStudentTable = (id) => {
  fetch(`${baseUrl}/alunos/${id}`, {
    method: "DELETE",
  }).catch((error) => {
    alert("Ocorreu um erro. Tente mais tarde.");
    console.error(error);
  });
};
// Passo 9: Abrir o modal de edição e carregar os dados do aluno
const editdStudentModal = (id) => {
  fetch(`${baseUrl}/alunos/${id}`)
    .then((resp) => resp.json())
    .then((data) => {
      const { nome, matricula, curso } = data;
      studentModalTitle.innerHTML = `Editar Aluno ${nome}`;
      document.querySelector("#nome").value = nome;
      document.querySelector("#matricula").value = matricula;
      document.querySelector("#curso").value = curso;
      saveStudentButton.innerHTML = "Salvar";
      openStudentModal();
      saveStundentData(`${baseUrl}/alunos/${id}`, "PUT");
    })
    .catch((error) => {
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });
};

// Passo 10: Chamar a função para carregar dados iniciais da tabela ao carregar a página
const loadStudentTable = async () => {
  try {
    const response = await fetch("http://localhost:3000/alunos");
    const data = await response.json();
    data.forEach((student) => {
      createStudentTableRow(
        student.id,
        student.nome,
        student.matricula,
        student.curso
      );
    });
  } catch (error) {
    alert("Ocorreu um erro. Tente mais tarde.");
    console.error(error);
  }
};

const loadStudentTable2 = () => {
  fetch("http://localhost:3000/alunos")
    .then((resp) => resp.json())
    .then((data) => {
      data.forEach((student) => {
        // pode ser feito assim também
        // const { nome, matricula, curso } = student;
        createStudentTableRow(
          student.id,
          student.nome,
          student.matricula,
          student.curso
        );
      });
    })
    .catch((error) => {
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });
};

loadStudentTable();


// CRUD PARA DISCIPLINAS
let disciplinas = [];

function abrirModalEditar() {
  const modalDisciplina = document.getElementById('subject-modal-editar');
  modalDisciplina.showModal();
}

function abrirModal() {
  const modalDisciplina = document.getElementById('subject-modal');
  modalDisciplina.showModal();
}

function fecharModal() {
  const modalDisciplina = document.getElementById('subject-modal');
  modalDisciplina.close();
}

function fecharModalEditar() {
  const modalDisciplina = document.getElementById('subject-modal-editar');
  modalDisciplina.close();
}

async function criarNovaDisciplina() {
  const formularioDisciplina = document.getElementById('subject-form');

  const disciplina = document.getElementById('disciplina').value;
  const cargaHoraria = document.getElementById('carga-horaria').value;
  const professor = document.getElementById('professor').value;
  const status = document.getElementById('status').value;

  if (!disciplina || !cargaHoraria || !professor || !status) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const newDisciplina = {
    disciplina: disciplina,
    cargaHoraria: cargaHoraria,
    professor: professor,
    status: status
  };

  try {
    await salvarDisciplinaAPI(newDisciplina);

    disciplinas.push(newDisciplina);

    atualizaListaDisciplina();

    fecharModal();

    formularioDisciplina.reset();
  } catch (error) {
    alert('Erro ao criar disciplina. Por favor, tente novamente.');
    console.error('Erro:', error.message);
  }
}


function atualizaListaDisciplina() {
  const listaDisciplina = document.getElementById('subject-list');


  if (!listaDisciplina) {
    console.error('Subject list not found.');
    return;
  }

  listaDisciplina.innerHTML = '';

  disciplinas.forEach((disciplina, index) => {
    const card = document.createElement('div');
    card.classList.add('subject-card');

    card.innerHTML = `
          <h3 class="subject-card__title">${disciplina.disciplina}</h3>
          <hr />
          <ul class="subject-card__list">
            <li>carga horária: ${disciplina.cargaHoraria}</li>
            <li>Professor: ${disciplina.professor}</li>
            <li>Status <span class="tag tag--${getStatusClass(disciplina.status)}">${disciplina.status}</span></li>
          </ul>
          <button class="button button--danger" onclick="excluirDisciplina(${index})">APAGAR</button>
          <button class="button button--success" onclick="editarDisciplina(${index})">EDITAR</button>
        `;

    listaDisciplina.appendChild(card);
  });
}

function getStatusClass(status) {
  return status === 'Obrigatória' ? 'danger' : 'success';
}


async function excluirDisciplina(index) {
  const deletarDisciplina = disciplinas[index];

  try {
    await deleteDisciplinaFromAPI(deletarDisciplina.id);

    disciplinas.splice(index, 1);

    atualizaListaDisciplina();

    console.log('Disciplina excluída com sucesso');
  } catch (error) {
    alert('Erro ao excluir disciplina. Por favor, tente novamente.');
    console.error('Erro:', error.message);
  }
}

async function editarDisciplina(index) {
  const disciplina = disciplinas[index];

  if (!disciplina) {
    console.error('Disciplina não encontrada para o índice:', index);
    return;
  }

  document.getElementById('disciplina_edit').value = disciplina.disciplina;
  document.getElementById('carga-horaria_edit').value = disciplina.cargaHoraria;
  document.getElementById('professor_edit').value = disciplina.professor;
  document.getElementById('status_edit').value = disciplina.status;

  abrirModalEditar();

  const editForm = document.getElementById('subject-edit-form');
  editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const disciplinaAtualizada = {
      disciplina: document.getElementById('disciplina_edit').value,
      cargaHoraria: document.getElementById('carga-horaria_edit').value,
      professor: document.getElementById('professor_edit').value,
      status: document.getElementById('status_edit').value,
    };

    try {
      await editarDisciplinaFromAPI(disciplina.id, disciplinaAtualizada);

      disciplina.disciplina = disciplinaAtualizada.disciplina;
      disciplina.cargaHoraria = disciplinaAtualizada.cargaHoraria;
      disciplina.professor = disciplinaAtualizada.professor;
      disciplina.status = disciplinaAtualizada.status;

      atualizaListaDisciplina();

      console.log('Disciplina editada com sucesso');
    } catch (error) {
      alert('Erro ao editar disciplina. Por favor, tente novamente.');
      console.error('Erro:', error.message);
    }

      fecharModalEditar();
  });
}

async function salvarDisciplinaAPI(disciplina) {
  try {
    const response = await fetch('http://localhost:3000/disciplinas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(disciplina),
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar disciplina na API');
    }

    const data = await response.json();
    console.log('Disciplina salva com sucesso:', data);

    disciplina.id = data.id;
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
}

async function deleteDisciplinaFromAPI(id) {
  try {
    const response = await fetch(`http://localhost:3000/disciplinas/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir disciplina na API');
    }

    console.log('Disciplina excluída na API com sucesso');
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
}

async function editarDisciplinaFromAPI(id, disciplina) {
  try {
    const response = await fetch(`http://localhost:3000/disciplinas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(disciplina),
    });

    if (!response.ok) {
      throw new Error('Erro ao editar disciplina na API');
    }

    console.log('Disciplina editada na API com sucesso');
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
}

atualizaListaDisciplina();