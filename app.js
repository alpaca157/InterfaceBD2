
function fazerLogin(event) {
    event.preventDefault();
    
    const tipoUsuario = document.getElementById('tipo-usuario') ? 
                        document.getElementById('tipo-usuario').value : 'profissional';
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    if (usuario && senha) {
        // Salva dados da sessão
        sessionStorage.setItem('usuario_logado', usuario);
        sessionStorage.setItem('tipo_usuario', tipoUsuario);
        sessionStorage.setItem('login_time', new Date().toISOString());
        
        // Redireciona para o menu
        window.location.href = 'menu.html';
    } else {
        alert('Usuário ou senha inválidos!');
    }
}

function logout() {
    // Limpa TODOS os dados da sessão
    sessionStorage.clear();
    localStorage.clear();
    
    // Redireciona para o login
    window.location.href = 'index.html';
}


function navegar(pagina) {
    window.location.href = pagina;
}

function voltar() {
    window.history.back();
}

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
    const tabContent = document.getElementById(`tab-${tabName}`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
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
    window.location.href = 'consultas.html';
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

// CONSULTAS E BUSCAS

function buscarPaciente() {
    const busca = document.getElementById('busca');
    if (!busca) return;
    
    const filtro = busca.value.toLowerCase();
    const tabela = document.getElementById('tabela-pacientes');
    if (!tabela) return;
    
    const linhas = tabela.getElementsByTagName('tr');
    
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        const texto = linha.textContent.toLowerCase();
        
        if (texto.includes(filtro)) {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    }
}

function verProntuario(idPaciente) {
    // Salva o ID no sessionStorage e navega para o prontuário
    sessionStorage.setItem('paciente_selecionado', idPaciente);
    window.location.href = 'prontuario.html';
}

// PRONTUÁRIO

function novoAtendimento() {
    window.location.href = 'novo-atendimento.html';
}

function verExames(idAtendimento) {
    // Salva o ID e navega para página de exames
    sessionStorage.setItem('atendimento_selecionado', idAtendimento);
    window.location.href = 'exames.html';
}

function editarPaciente() {
    const idPaciente = sessionStorage.getItem('paciente_selecionado');
    alert(`Editar paciente ID: ${idPaciente}`);
    // Implementar edição
}

// ALERTAS

function carregarAlertas() {
    // Atualizar badge de alertas
    const badge = document.getElementById('badge-alertas');
    if (badge) {
        // Simulação - na prática viria do banco
        const totalAlertas = 3;
        badge.textContent = totalAlertas;
        
        if (totalAlertas > 0) {
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// SELEÇÃO DE TIPO DE USUÁRIO (LOGIN)

function selecionarTipo(tipo) {
    // Remove active de todos os botões
    const botoes = document.querySelectorAll('.btn-tipo-usuario');
    botoes.forEach(btn => btn.classList.remove('active'));
    
    // Adiciona active no botão clicado
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Atualiza o tipo de usuário
    const inputTipo = document.getElementById('tipo-usuario');
    if (inputTipo) {
        inputTipo.value = tipo;
    }
    
    console.log('Tipo selecionado:', tipo);
}

// INICIALIZAÇÃO - AO CARREGAR PÁGINA

document.addEventListener('DOMContentLoaded', function() {
    const paginaAtual = window.location.pathname.split('/').pop();
    
    // VERIFICAÇÃO DE LOGIN
    
    // Se NÃO estiver na página de login, verifica se está logado
    if (paginaAtual !== 'index.html' && paginaAtual !== '') {
        const usuarioLogado = sessionStorage.getItem('usuario_logado');
        
        if (!usuarioLogado) {
            // Não está logado - redireciona para login
            window.location.href = 'index.html';
            return;
        }
    }
    
    // Se estiver na página de login e já estiver logado, vai para o menu
    if (paginaAtual === 'index.html' || paginaAtual === '') {
        const usuarioLogado = sessionStorage.getItem('usuario_logado');
        if (usuarioLogado) {
            window.location.href = 'menu.html';
            return;
        }
    }
    
    // CARREGAR ALERTAS (se estiver na página)
    
    if (paginaAtual === 'alertas.html') {
        carregarAlertas();
    }
    
    // CARREGAR DADOS DO PACIENTE (se for prontuário)
    
    if (paginaAtual === 'prontuario.html') {
        const idPaciente = sessionStorage.getItem('paciente_selecionado');
        if (!idPaciente) {
            // Se não tem paciente selecionado, volta para consultas
            window.location.href = 'consultas.html';
        }
    }
    
    // MÁSCARAS PARA INPUTS
    
    // Máscara CPF
    const inputCPF = document.querySelector('input[name="cpf"]');
    if (inputCPF) {
        inputCPF.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = valor;
        });
    }
    
    // Máscara Telefone
    const inputTelefone = document.querySelector('input[name="telefone"]');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
            valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = valor;
        });
    }
    
    // RESETAR FORMULÁRIOS AO CARREGAR
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (!form.classList.contains('login-form')) {
            form.reset();
        }
    });
    
    console.log('Página carregada:', paginaAtual);
});