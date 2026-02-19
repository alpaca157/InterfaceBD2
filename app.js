// ========================================
// CONFIGURAÇÃO - API BASE URL
// ========================================
const API_URL = 'http://localhost:5000/api';

// ========================================
// SISTEMA DE LOGIN
// ========================================

async function fazerLogin(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                usuario: parseInt(usuario),
                senha: senha 
            })
        });
        
        const data = await response.json();
        
        if (data.sucesso) {
            sessionStorage.setItem('usuario_logado', data.usuario);
            sessionStorage.setItem('tipo_usuario', data.tipo);
            sessionStorage.setItem('login_time', new Date().toISOString());
            
            // ✅ Redireciona direto para o menu (sem alert!)
            window.location.href = 'menu.html';
        } else {
            alert('❌ ' + data.mensagem);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro de conexão com o servidor');
    }
}

function logout() {
    sessionStorage.clear();
    localStorage.clear();
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
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    
    const tabContent = document.getElementById(`tab-${tabName}`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
}

// ========================================
// CADASTRO DE PACIENTE
// ========================================

async function cadastrarPaciente(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    const paciente = {
        nome: dados.get('nome'),
        cpf: dados.get('cpf').replace(/\D/g, ''),
        cns: dados.get('cns').replace(/\D/g, ''),
        telefone: dados.get('telefone'),
        rua: dados.get('rua'),
        numero: dados.get('numero'),
        bairro: dados.get('bairro'),
        cidade: dados.get('cidade'),
        complemento: dados.get('complemento'),
        data_concepcao: dados.get('data_concepcao')
    };
    
    try {
        const response = await fetch(`${API_URL}/pacientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paciente)
        });
        
        const data = await response.json();
        
        if (data.sucesso) {
            alert(`✅ Paciente cadastrado com sucesso!\n\nID: ${data.id}`);
            form.reset();
            window.location.href = 'consultas.html';
        } else {
            alert('❌ Erro ao cadastrar: ' + (data.erro || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro de conexão com o servidor');
    }
}

// ========================================
// LISTAR PACIENTES
// ========================================

async function carregarPacientes() {
    const tbody = document.getElementById('tabela-pacientes');
    if (!tbody) return;
    
    try {
        const response = await fetch(`${API_URL}/pacientes`);
        const pacientes = await response.json();
        
        tbody.innerHTML = '';
        
        if (pacientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                        Nenhum paciente cadastrado
                    </td>
                </tr>
            `;
            return;
        }
        
        pacientes.forEach(paciente => {
            const tr = document.createElement('tr');
            tr.onclick = function(e) {
                if (!e.target.closest('button')) {
                    verProntuario(paciente.ID_Paciente);
                }
            };
            
            tr.innerHTML = `
                <td>${paciente.ID_Paciente}</td>
                <td>${paciente.Nome}</td>
                <td>${formatarCPF(paciente.CPF)}</td>
                <td>ID: ${paciente.Prof_Responsavel || '-'}</td>
                <td><span class="status-${paciente.Status_Vinculo.toLowerCase()}">${paciente.Status_Vinculo}</span></td>
                <td>
                    <button class="btn-action" onclick="verProntuario(${paciente.ID_Paciente})">📄 Prontuário</button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #dc3545;">
                    Erro ao carregar pacientes
                </td>
            </tr>
        `;
    }
}

// ========================================
// BUSCAR PACIENTE
// ========================================

async function buscarPaciente() {
    const busca = document.getElementById('busca');
    if (!busca) return;
    
    const termo = busca.value.trim();
    
    try {
        const response = await fetch(`${API_URL}/pacientes/buscar?termo=${encodeURIComponent(termo)}`);
        const pacientes = await response.json();
        
        const tbody = document.getElementById('tabela-pacientes');
        tbody.innerHTML = '';
        
        if (pacientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                        Nenhum paciente encontrado
                    </td>
                </tr>
            `;
            return;
        }
        
        pacientes.forEach(paciente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${paciente.ID_Paciente}</td>
                <td>${paciente.Nome}</td>
                <td>${formatarCPF(paciente.CPF)}</td>
                <td>ID: ${paciente.Prof_Responsavel || '-'}</td>
                <td><span class="status-${paciente.Status_Vinculo.toLowerCase()}">${paciente.Status_Vinculo}</span></td>
                <td><button class="btn-action" onclick="verProntuario(${paciente.ID_Paciente})">📄</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro na busca:', error);
    }
}

// ========================================
// CADASTRAR PROFISSIONAL
// ========================================

async function cadastrarProfissional(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    const senha = dados.get('senha');
    const confirmarSenha = dados.get('confirmar_senha');
    
    if (senha !== confirmarSenha) {
        alert('❌ As senhas não conferem!');
        return;
    }
    
    if (senha.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/profissionais`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senha: senha,
                id_programa: parseInt(dados.get('id_programa')) || 1
            })
        });
        
        const data = await response.json();
        
        if (data.sucesso) {
            alert(`✅ ${data.mensagem}`);
            form.reset();
        } else {
            alert('❌ Erro: ' + data.erro);
        }
    } catch (error) {
        alert('❌ Erro de conexão');
    }
}

// ========================================
// CADASTRAR AGENTE
// ========================================

async function cadastrarAgente(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    const senha = dados.get('senha');
    const confirmarSenha = dados.get('confirmar_senha');
    
    if (senha !== confirmarSenha) {
        alert('❌ As senhas não conferem!');
        return;
    }
    
    if (senha.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/agentes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senha })
        });
        
        const data = await response.json();
        
        if (data.sucesso) {
            alert(`✅ ${data.mensagem}`);
            form.reset();
        } else {
            alert('❌ Erro: ' + data.erro);
        }
    } catch (error) {
        alert('❌ Erro de conexão');
    }
}

// ========================================
// CADASTRAR ESTUDANTE
// ========================================

async function cadastrarEstudante(event) {
    event.preventDefault();
    const form = event.target;
    const dados = new FormData(form);
    
    const senha = dados.get('senha');
    const confirmarSenha = dados.get('confirmar_senha');
    
    if (senha !== confirmarSenha) {
        alert('❌ As senhas não conferem!');
        return;
    }
    
    if (senha.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/estudantes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senha })
        });
        
        const data = await response.json();
        
        if (data.sucesso) {
            alert(`✅ ${data.mensagem}`);
            form.reset();
        } else {
            alert('❌ Erro: ' + data.erro);
        }
    } catch (error) {
        alert('❌ Erro de conexão');
    }
}

// ========================================
// PRONTUÁRIO
// ========================================

function verProntuario(idPaciente) {
    sessionStorage.setItem('paciente_selecionado', idPaciente);
    window.location.href = 'prontuario.html';
}

function novoAtendimento() {
    window.location.href = 'novo-atendimento.html';
}

function verExames(idAtendimento) {
    sessionStorage.setItem('atendimento_selecionado', idAtendimento);
    window.location.href = 'exames.html';
}

// ========================================
// PACIENTES DO PROFISSIONAL
// ========================================

function verPacientesProfissional(idProfissional) {
    sessionStorage.setItem('profissional_selecionado', idProfissional);
    window.location.href = 'pacientes-profissional.html';
}

// ========================================
// ALERTAS
// ========================================

async function carregarAlertas() {
    try {
        const response = await fetch(`${API_URL}/alertas`);
        const alertas = await response.json();
        
        const badge = document.getElementById('badge-alertas');
        if (badge) {
            badge.textContent = alertas.length;
            badge.style.display = alertas.length > 0 ? 'inline-block' : 'none';
        }
    } catch (error) {
        console.error('Erro ao carregar alertas:', error);
    }
}

// ========================================
// UTILITÁRIOS
// ========================================

function formatarCPF(cpf) {
    if (!cpf) return '-';
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarData(dataISO) {
    if (!dataISO) return '-';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const paginaAtual = window.location.pathname.split('/').pop();
    
    // Verificação de login
    if (paginaAtual !== 'index.html' && paginaAtual !== '') {
        const usuarioLogado = sessionStorage.getItem('usuario_logado');
        if (!usuarioLogado) {
            window.location.href = 'index.html';
            return;
        }
    }
    
    if (paginaAtual === 'index.html' || paginaAtual === '') {
        const usuarioLogado = sessionStorage.getItem('usuario_logado');
        if (usuarioLogado) {
            window.location.href = 'menu.html';
            return;
        }
    }
    
    // Carregar conteúdo específico
    switch(paginaAtual) {
        case 'consultas.html':
            carregarPacientes();
            break;
        case 'alertas.html':
            carregarAlertas();
            break;
        case 'pacientes-profissional.html':
            // Carregado pelo script da própria página
            break;
    }
    
    // Máscaras
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
    
    const inputTelefone = document.querySelector('input[name="telefone"]');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
            valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = valor;
        });
    }
    
    console.log('AVITTA - Página:', paginaAtual);
});