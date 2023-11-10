document.addEventListener("DOMContentLoaded", () => {
    // Quando a página estiver carregada, execute a função para buscar dados
    buscarDadosDoMongoDB();
});

let profissionalEmEdicao = null;

async function buscarDadosDoMongoDB() {
    try {
        // Realize uma solicitação HTTP para o servidor para buscar os dados do MongoDB
        const response = await fetch('/api/mongodb-data'); // Rota no servidor para buscar dados
        const data = await response.json();

        // Obtenha a tabela onde deseja exibir os dados
        const tabelaDados = document.getElementById('tabela-dados');

        // Limpe o conteúdo existente
        tabelaDados.innerHTML = '';

        // Itere pelos dados e crie linhas da tabela para exibi-los
        data.forEach(item => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.dataNascimento}</td>
                <td>${item.cpf}</td>
                <td>${item.formacaoAcademica}</td>
                <td>${item.especializacao}</td>
                <td>${item.crp}</td>
                <td>${item.rua}</td>
                <td>${item.numeroCasa}</td>
                <td>${item.bairro}</td>
                <td>${item.cidade}</td>
                <td>${item.cep}</td>
                <td>
                    <button class="excluirProfissional" data-id="${item._id}">Excluir</button>
                    <button class="editarProfissional" data-id="${item._id}">Editar</button>
                </td>
            `;
            tabelaDados.appendChild(linha);
        });

        // Adicione eventos aos botões de excluir
        const botoesExcluir = document.querySelectorAll('.excluirProfissional');
        const botoesEditar = document.querySelectorAll('.editarProfissional');

        botoesExcluir.forEach(botao => {
            botao.addEventListener('click', () => {
                const id = botao.getAttribute('data-id');
                deletarProfissional(id);
            });
        });

        botoesEditar.forEach(botao => {
            botao.addEventListener('click', () => {
                const id = botao.getAttribute('data-id');
                profissionalEmEdicao = id;
                exibirFormularioEdicao(id);
            });
        });
    } catch (error) {
        console.error('Erro ao buscar dados do MongoDB:', error);
    }
}

// Função para excluir um profissional
async function deletarProfissional(id) {
    try {
        // Realize uma solicitação DELETE para deletar o profissional pelo ID
        const response = await fetch('/api/mongodb-data/' + id, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Profissional deletado com sucesso');
            buscarDadosDoMongoDB(); // Atualize a tabela após a exclusão
        } else {
            console.error('Erro ao deletar profissional');
        }
    } catch (error) {
        console.error('Erro ao enviar solicitação DELETE:', error);
    }
}

// Função para exibir o formulário de edição com os dados do profissional
function exibirFormularioEdicao(id) {
    const formularioEdicao = document.getElementById('formulario-edicao');
    formularioEdicao.style.display = 'block';

    // Preencha os campos de edição com os dados do profissional
    const nomeEdicao = document.getElementById('nome-edicao');
    const dataNascimento = document.getElementById('dataNascimento-edicao');
    const cpfEdicao = document.getElementById('cpf-edicao');
    const formacaoAcademica = document.getElementById('formacaoAcademica-edicao');
    const especializacao = document.getElementById('especializacao-edicao');
    const crp = document.getElementById('crp-edicao');
    const rua = document.getElementById('rua-edicao');
    const numeroCasa = document.getElementById('numeroCasa-edicao');
    const bairro = document.getElementById('bairro-edicao');
    const cidade = document.getElementById('cidade-edicao');
    const cep = document.getElementById('cep-edicao');

    fetch('/api/mongodb-data/' + id)
        .then(response => response.json())
        .then(data => {
            nomeEdicao.value = data.nome;
            dataNascimento.value = data.dataNascimento;
            cpfEdicao.value = data.cpf;
            formacaoAcademica.value = data.formacaoAcademica;
            especializacao.value = data.especializacao;
            crp.value = data.crp;
            rua.value = data.rua;
            numeroCasa.value = data.numeroCasa;
            bairro.value = data.bairro;
            cidade.value = data.cidade;
            cep.value = data.cep;
        })
        .catch(error => {
            console.error('Erro ao buscar profissional para edição:', error);
        });

    // Atualize o ID do profissional em edição
    document.getElementById('profissional-id').value = id;
}

// Adicione um evento para cancelar a edição
document.getElementById('cancelarEdicao').addEventListener('click', () => {
    ocultarFormularioEdicao();
});

// Função para ocultar o formulário de edição
function ocultarFormularioEdicao() {
    const formularioEdicao = document.getElementById('formulario-edicao');
    formularioEdicao.style.display = 'none';
}

// Adicione um evento para atualizar um profissional
document.getElementById('atualizarProfissional').addEventListener('click', () => {
    const id = document.getElementById('profissional-id').value;
    const nome = document.getElementById('nome-edicao').value;
    const dataNascimento = document.getElementById('dataNascimento-edicao').value;
    const cpf = document.getElementById('cpf-edicao').value;
    const formacaoAcademica = document.getElementById('formacaoAcademica-edicao').value;
    const especializacao = document.getElementById('especializacao-edicao').value;
    const crp = document.getElementById('crp-edicao').value;
    const rua = document.getElementById('rua-edicao').value;
    const numeroCasa = document.getElementById('numeroCasa-edicao').value;
    const bairro = document.getElementById('bairro-edicao').value;
    const cidade = document.getElementById('cidade-edicao').value;
    const cep = document.getElementById('cep-edicao').value;

    const profissionalAtualizado = {
        nome: nome,
        dataNascimento: dataNascimento,
        cpf: cpf,
        formacaoAcademica: formacaoAcademica,
        especializacao: especializacao,
        crp: crp,
        rua: rua,
        numeroCasa: numeroCasa,
        bairro: bairro,
        cidade: cidade,
        cep: cep
    };

    atualizarProfissional(id, profissionalAtualizado);
});

// Adicione um evento para enviar um novo profissional
document.getElementById('enviarProfissional').addEventListener('click', () => {
    const nome = document.getElementById('nome').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const cpf = document.getElementById('cpf').value;
    const formacaoAcademica = document.getElementById('formacaoAcademica').value;
    const especializacao = document.getElementById('especializacao').value;
    const crp = document.getElementById('crp').value;
    const rua = document.getElementById('rua').value;
    const numeroCasa = document.getElementById('numeroCasa').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const cep = document.getElementById('cep').value;

    // Crie um objeto com os dados do novo profissional
    const novoProfissional = {
        nome: nome,
        dataNascimento: dataNascimento,
        cpf: cpf,
        formacaoAcademica: formacaoAcademica,
        especializacao: especializacao,
        crp: crp,
        rua: rua,
        numeroCasa: numeroCasa,
        bairro: bairro,
        cidade: cidade,
        cep: cep
    };

    enviarNovoProfissional(novoProfissional);
});

// Função para enviar um novo profissional
function enviarNovoProfissional(novoProfissional) {
    fetch('/api/mongodb-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoProfissional)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Novo profissional inserido com sucesso');
            buscarDadosDoMongoDB(); // Atualize a tabela após a inserção
        })
        .catch(error => {
            console.error('Erro ao inserir novo profissional:', error);
        });
}

// Função para atualizar um profissional
function atualizarProfissional(id, profissionalAtualizado) {
    fetch('/api/mongodb-data/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profissionalAtualizado)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Profissional atualizado com sucesso');
            ocultarFormularioEdicao();
            buscarDadosDoMongoDB(); // Atualize a tabela após a atualização
        })
        .catch(error => {
            console.error('Erro ao atualizar profissional:', error);
        });
}
