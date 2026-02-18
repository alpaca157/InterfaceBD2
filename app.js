// ========================================
// SISTEMA DE LOGIN
// ========================================

function fazerLogin(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    if (usuario && senha) {
        // Salva dados da sessão
        sessionStorage.setItem('usuario_logado', usuario);
        sessionStorage.setItem('login_time', new Date().toISOString());
        
        // Redireciona para o menu
        window.location.href = 'menu.html';
    } else {
        alert('❌ Usuário ou senha inválidos!');
    }
}

function logout() {
    // Limpa TODOS os dados da sessão
    sessionStorage.clear();
    localStorage.clear();
    
    // Redireciona para o login
    window.location.href = 'index.html';
}

// ========================================
// NAVEGAÇÃO
// ========================================

function navegar(pagina) {
    window.location.href = pagina;
}

function voltar() {
    window.history.back();
}

// ========================================
// TABS (CADASTRO)
// ========================================

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

// ========================================
// CADASTROS
// ========================================

function cadastrarPaciente(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    // Validação básica
    const nome = dados.get('nome');
    const cpf = dados.get('cpf');
    const cns = dados.get('cns');
    const dataConcepcao = dados.get('data_concepcao');
    
    if (!nome || !cpf || !cns || !dataConcepcao) {
        alert('❌ Preencha todos os campos obrigatórios!');
        return;
    }
    
    // Simulação de insert no banco
    // No Python/Flask: cursor.execute("INSERT INTO Paciente (...) VALUES (...)")
    // id_gerado = cursor.lastrowid
    
    // Simulando ID gerado (na prática viria do banco)
    const idGerado = Math.floor(Math.random() * 100) + 21; // Simula ID entre 21-120
    
    console.log('Dados do paciente:', Object.fromEntries(dados));
    console.log(`INSERT INTO Paciente (Nome, CPF, CNS, Telefone, Rua, Numero, Bairro, Cidade, Complemento, Data_Concepcao) 
                 VALUES ('${nome}', '${cpf}', '${cns}', '${dados.get('telefone')}', '${dados.get('rua')}', '${dados.get('numero')}', '${dados.get('bairro')}', '${dados.get('cidade')}', '${dados.get('complemento')}', '${dataConcepcao}');`);
    
    alert(`✅ Paciente cadastrado com sucesso!\n\n` +
          `🔑 ID Paciente: ${idGerado}\n` +
          `👤 Nome: ${nome}\n` +
          `📋 CPF: ${cpf}\n\n` +
          `⚠️ IMPORTANTE: Anote o ID para consultas futuras!`);
    
    form.reset();
    window.location.href = 'consultas.html';
}

function cadastrarProfissional(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    const senha = dados.get('senha');
    const confirmarSenha = dados.get('confirmar_senha');
    const idPrograma = dados.get('id_programa');
    
    // Validação
    if (senha !== confirmarSenha) {
        alert('❌ As senhas não conferem!');
        return;
    }
    
    if (senha.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    // Simulando ID gerado (na prática viria do banco com lastrowid)
    const idGerado = Math.floor(Math.random() * 100) + 6; // Simula ID entre 6-105
    
    console.log('SQL para cadastrar Profissional:');
    console.log(`INSERT INTO Profissional_Saude (Senha, ID_Programa_Saude, Ativo) VALUES ('${senha}', ${idPrograma}, 1);`);
    console.log(`-- ID gerado: ${idGerado}`);
    
    alert(`✅ Profissional cadastrado com sucesso!\n\n` +
          `🔑 ID: ${idGerado}\n` +
          `🔒 Senha: ${senha}\n` +
          `📋 ID Programa: ${idPrograma}\n\n` +
          `⚠️ IMPORTANTE: Anote o ID e a senha para login!`);
    
    form.reset();
}

function cadastrarAgente(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    const senha = dados.get('senha');
    const confirmarSenha = dados.get('confirmar_senha');
    
    // Validação
    if (senha !== confirmarSenha) {
        alert('❌ As senhas não conferem!');
        return;
    }
    
    if (senha.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    // Simulando ID gerado
    const idGerado = Math.floor(Math.random() * 100) + 5; // Simula ID entre 5-104
    
    console.log('SQL para cadastrar Agente:');
    console.log(`INSERT INTO Agente_Saude (Senha, Ativo) VALUES ('${senha}', 1);`);
    console.log(`-- ID gerado: ${idGerado}`);
    
    alert(`✅ Agente de Saúde cadastrado com sucesso!\n\n` +
          `🔑 ID: ${idGerado}\n` +
          `🔒 Senha: ${senha}\n\n` +
          `⚠️ IMPORTANTE: Anote o ID e a senha para login!`);
    
    form.reset();
}

function cadastrarEstudante(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    const senha = dados.get('senha');
    const confirmarSenha = dados.get('confirmar_senha');
    
    // Validação
    if (senha !== confirmarSenha) {
        alert('❌ As senhas não conferem!');
        return;
    }
    
    if (senha.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    // Simulando ID gerado
    const idGerado = Math.floor(Math.random() * 100) + 4; // Simula ID entre 4-103
    
    console.log('SQL para cadastrar Estudante:');
    console.log(`INSERT INTO Estudante_Saude (Senha, Ativo) VALUES ('${senha}', 1);`);
    console.log(`-- ID gerado: ${idGerado}`);
    
    alert(`✅ Estudante cadastrado com sucesso!\n\n` +
          `🔑 ID: ${idGerado}\n` +
          `🔒 Senha: ${senha}\n\n` +
          `⚠️ IMPORTANTE: Anote o ID e a senha para login!`);
    
    form.reset();
}

// ========================================
// CONSULTAS E BUSCAS
// ========================================

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

// ========================================
// PRONTUÁRIO
// ========================================

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

// ========================================
// ALERTAS
// ========================================

function carregarAlertas() {
    // Atualizar badge de alertas
    const badge = document.getElementById('badge-alertas');
    if (badge) {
        // Simulação - na prática viria da VIEW VW_Alertas do banco
        const totalAlertas = 3;
        badge.textContent = totalAlertas;
        
        if (totalAlertas > 0) {
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// ========================================
// SELEÇÃO DE TIPO DE USUÁRIO (LOGIN)
// ========================================

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

// ========================================
// ABAS DE PROFISSIONAIS/AGENTES/ESTUDANTES
// ========================================

function mudarAbaProfissionais(tipo) {
    // Remove active de todas as tabs
    document.querySelectorAll('.tab-profissional').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active de todos os conteúdos
    document.querySelectorAll('.conteudo-aba').forEach(conteudo => {
        conteudo.classList.remove('active');
    });
    
    // Adiciona active na tab clicada
    event.target.classList.add('active');
    
    // Mostra o conteúdo correspondente
    document.getElementById(`aba-${tipo}`).classList.add('active');
}

function verPacientesProfissional(idProfissional) {
    // Salva o ID e navega para página de pacientes do profissional
    sessionStorage.setItem('profissional_selecionado', idProfissional);
    window.location.href = 'pacientes-profissional.html';
}

// ========================================
// INICIALIZAÇÃO - AO CARREGAR PÁGINA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const paginaAtual = window.location.pathname.split('/').pop();
    
    // ========================================
    // VERIFICAÇÃO DE LOGIN
    // ========================================
    
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
    
    // ========================================
    // CARREGAR ALERTAS (se estiver na página)
    // ========================================
    
    if (paginaAtual === 'alertas.html') {
        carregarAlertas();
    }
    
    // ========================================
    // CARREGAR DADOS DO PACIENTE (se for prontuário)
    // ========================================
    
    if (paginaAtual === 'prontuario.html') {
        const idPaciente = sessionStorage.getItem('paciente_selecionado');
        if (!idPaciente) {
            // Se não tem paciente selecionado, volta para consultas
            window.location.href = 'consultas.html';
            return;
        }
        
        // Aqui você carregaria os dados do paciente do banco
        console.log('Carregar prontuário do paciente ID:', idPaciente);
    }
    
    // ========================================
    // CARREGAR DADOS DO ATENDIMENTO (se for exames)
    // ========================================
    
    if (paginaAtual === 'exames.html') {
        const idAtendimento = sessionStorage.getItem('atendimento_selecionado');
        if (!idAtendimento) {
            window.location.href = 'consultas.html';
            return;
        }
        
        console.log('Carregar exames do atendimento ID:', idAtendimento);
    }
    
    // ========================================
    // MÁSCARAS PARA INPUTS
    // ========================================
    
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
    
    // Máscara CNS
    const inputCNS = document.querySelector('input[name="cns"]');
    if (inputCNS) {
        inputCNS.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            valor = valor.substring(0, 15);
            e.target.value = valor;
        });
    }
    
    // ========================================
    // RESETAR FORMULÁRIOS AO CARREGAR
    // ========================================
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (!form.classList.contains('login-form')) {
            // Não reseta o formulário de login
            form.reset();
        }
    });
    
    // ========================================
    // LOG DE DEBUG
    // ========================================
    
    console.log('=== AVITTA - Sistema de Monitoramento Pré-Natal ===');
    console.log('Página carregada:', paginaAtual);
    console.log('Usuário logado:', sessionStorage.getItem('usuario_logado'));
    console.log('================================================');
});