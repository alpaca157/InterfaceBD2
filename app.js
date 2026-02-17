// SISTEMA DE LOGIN
function fazerLogin(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    // Simulação de login
    if (usuario && senha) {
        // Salva que está logado (apenas para esta sessão)
        sessionStorage.setItem('usuario_logado', usuario);
        sessionStorage.setItem('login_time', new Date().toISOString());
        
        // Redireciona para o menu
        window.location.href = 'menu.html';
    } else {
        alert('Usuário ou senha inválidos!');
    }
}

function logout() {
    // Limpa os dados
    sessionStorage.clear();
    localStorage.clear();
    
    // Força redirecionamento para login
    window.location.href = 'index.html';
}

// NAVEGAÇÃO
function navegar(pagina) {
    window.location.href = pagina;
}

function voltar() {
    window.history.back();
}

// TABS
function mudarTab(tabName) {
    // Remove active de todas as tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active de todos os conteúdos
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // Adiciona active na tab clicada
    event.target.classList.add('active');
    
    // Mostra o conteúdo correspondente
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// CADASTROS
function cadastrarPaciente(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    // Aqui você faria a chamada ao backend Python
    console.log('Dados do paciente:', Object.fromEntries(dados));
    
    alert('Paciente cadastrado com sucesso!');
    form.reset();
    // window.location.href = 'consultas.html';
}

function cadastrarProfissional(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    console.log('Dados do profissional:', Object.fromEntries(dados));
    alert('Profissional cadastrado com sucesso!');
    form.reset();
}

function cadastrarAgente(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    console.log('Dados do agente:', Object.fromEntries(dados));
    alert('Agente cadastrado com sucesso!');
    form.reset();
}

function cadastrarEstudante(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    console.log('Dados do estudante:', Object.fromEntries(dados));
    alert('Estudante cadastrado com sucesso!');
    form.reset();
}

// CONSULTAS
function buscarPaciente() {
    const busca = document.getElementById('busca').value.toLowerCase();
    const tabela = document.getElementById('tabela-pacientes');
    const linhas = tabela.getElementsByTagName('tr');
    
    for (let linha of linhas) {
        const texto = linha.textContent.toLowerCase();
        linha.style.display = texto.includes(busca) ? '' : 'none';
    }
}

function verProntuario(idPaciente) {
    // Salva o ID no localStorage e navega para o prontuário
    localStorage.setItem('paciente_selecionado', idPaciente);
    window.location.href = 'prontuario.html';
}

// PRONTUÁRIO
function novoAtendimento() {
    // Redireciona para página de novo atendimento
    window.location.href = 'novo-atendimento.html';
}

function verExames(idAtendimento) {
    // Salva o ID e navega para página de exames
    localStorage.setItem('atendimento_selecionado', idAtendimento);
    window.location.href = 'exames.html';
}

function editarPaciente() {
    // Implementar edição do paciente
    const idPaciente = localStorage.getItem('paciente_selecionado');
    alert(`Editar paciente ID: ${idPaciente}`);
}

// ALERTAS
function carregarAlertas() {
    // Buscar alertas do backend (VIEW VW_Alertas)
    const alertas = [
        { tipo: 'Exame', paciente: 'Ana Araujo', cpf: '000.000.000-01', exame: 'Ultrassom', data: '10/03/2026', status: 'PENDENTE' },
        { tipo: 'Retorno', paciente: 'Beatriz Barros', cpf: '000.000.000-02', data: '24/02/2026', status: 'PENDENTE' },
        { tipo: 'Exame', paciente: 'Camila Cardoso', cpf: '000.000.000-03', exame: 'Urina', data: '04/02/2026', status: 'ATRASADO' }
    ];
    
    // Atualizar badge
    const badge = document.getElementById('badge-alertas');
    if (badge) {
        badge.textContent = alertas.length;
    }
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se está logado
    const usuario = localStorage.getItem('usuario_logado');
    const paginaAtual = window.location.pathname.split('/').pop();
    
    if (!usuario && paginaAtual !== 'index.html' && paginaAtual !== '') {
        window.location.href = 'index.html';
    }
    
    // Carrega alertas se estiver na página de alertas
    if (paginaAtual === 'alertas.html') {
        carregarAlertas();
    }
});

// Máscaras para inputs
document.addEventListener('input', function(e) {
    // Máscara CPF
    if (e.target.name === 'cpf') {
        let valor = e.target.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = valor;
    }
    
    // Máscara Telefone
    if (e.target.name === 'telefone') {
        let valor = e.target.value.replace(/\D/g, '');
        valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
        valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = valor;
    }
});

// VERIFICAR LOGIN AO CARREGAR QUALQUER PÁGINA
document.addEventListener('DOMContentLoaded', function() {
    const paginaAtual = window.location.pathname.split('/').pop();
    
    if (paginaAtual !== 'index.html' && paginaAtual !== '') {

        localStorage.clear();
        
        window.location.href = 'index.html';
    }
    
    if (paginaAtual === 'index.html' || paginaAtual === '') {
        localStorage.clear();
    }
});