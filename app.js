// CONFIGURAÇÃO - API BASE URL
const API_URL = 'http://localhost:5000/api';

// SISTEMA DE LOGIN
async function fazerLogin(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

// NAVEGAÇÃO
function navegar(pagina) {
    window.location.href = pagina;
}

function voltar() {
    window.history.back();
}

// TABS (CADASTRO)
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

// CADASTRO DE PACIENTE
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
            headers: { 'Content-Type': 'application/json' },
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

// LISTAR PACIENTES
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

// BUSCAR PACIENTE
async function buscarPaciente() {
    const busca = document.getElementById('busca');
    if (!busca) return;
    
    const termo = busca.value.trim();
    
    try {
        if (!termo) {
            await carregarPacientes();
            return;
        }
        
        const response = await fetch(`${API_URL}/pacientes/buscar?termo=${encodeURIComponent(termo)}`);
        const pacientes = await response.json();
        
        const tbody = document.getElementById('tabela-pacientes');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (pacientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                        Nenhum paciente encontrado para "${termo}"
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

// CADASTRAR PROFISSIONAL / AGENTE / ESTUDANTE
async function cadastrarProfissional(event) {
    await _cadastrarUsuario(event, 'profissionais');
}

async function cadastrarAgente(event) {
    await _cadastrarUsuario(event, 'agentes');
}

async function cadastrarEstudante(event) {
    await _cadastrarUsuario(event, 'estudantes');
}

async function _cadastrarUsuario(event, endpoint) {
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
        const body = { senha: senha };
        if (endpoint === 'profissionais') {
            body.id_programa = parseInt(dados.get('id_programa')) || 1;
        }
        
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
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

// PRONTUÁRIO E NAVEGAÇÃO
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

// ✅ PACIENTES DO PROFISSIONAL - FUNÇÃO CORRIGIDA
function verPacientesProfissional(idProfissional) {
    console.log('Navegando para pacientes do profissional:', idProfissional);
    sessionStorage.setItem('profissional_selecionado', idProfissional);
    window.location.href = 'pacientes-profissional.html';
}

// VÍNCULOS
async function carregarVinculosPaciente(idPaciente) {
    try {
        const response = await fetch(`${API_URL}/pacientes/${idPaciente}/vinculos`);
        const vinculos = await response.json();
        
        const divVinculos = document.getElementById('vinculos-paciente');
        if (divVinculos) {
            divVinculos.innerHTML = vinculos.map(v => `
                <div class="vinculo-card">
                    <strong>${v.tipo}</strong> - ID: ${v.id}<br>
                    Início: ${formatarData(v.Data_Inicio)}<br>
                    ${v.Data_Fim ? `Fim: ${formatarData(v.Data_Fim)}` : '<span class="status-ativo">ATIVO</span>'}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar vínculos:', error);
    }
}

// EXAMES
async function realizarExame(idExame) {
    const dataRealizacao = prompt('Data de realização (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!dataRealizacao) return;
    
    try {
        const response = await fetch(`${API_URL}/exames/${idExame}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data_realizacao: dataRealizacao })
        });
        
        const result = await response.json();
        
        if (result.sucesso) {
            alert('✅ Exame marcado como realizado!');
        } else {
            alert('❌ Erro: ' + result.erro);
        }
    } catch (error) {
        alert('❌ Erro de conexão');
    }
}

// ALERTAS - REMOVIDO UPDATE DO BADGE
async function carregarAlertas() {
    try {
        const response = await fetch(`${API_URL}/alertas`);
        const alertas = await response.json();
        
        const container = document.querySelector('.alertas-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (alertas.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:40px;">✅ Sem alertas pendentes!</p>';
            return;
        }
        
        alertas.forEach(alerta => {
            const card = document.createElement('div');
            card.className = 'alert-card';
            card.innerHTML = `
                <div class="alert-header">
                    <h3>${alerta.Nome}</h3>
                    <span class="alert-cidade">${alerta.Cidade} - ${alerta.Bairro}</span>
                </div>
                <div class="alert-body">
                    <p><strong>CPF:</strong> ${alerta.CPF}</p>
                    <p><strong>Telefone:</strong> ${alerta.Telefone || 'N/A'}</p>
                    <p><strong>Endereço:</strong> ${alerta.Rua}, ${alerta.Numero}</p>
                    ${alerta.Tipo_Exame ? `
                        <div class="alert-exame">
                            <strong>Exame:</strong> ${alerta.Tipo_Exame}<br>
                            <strong>Data:</strong> ${formatarData(alerta.Data_Exame)}<br>
                            <strong>Status:</strong> <span class="status-${alerta.Status_Exame.toLowerCase()}">${alerta.Status_Exame}</span>
                        </div>
                    ` : ''}
                    ${alerta.Data_Retorno ? `
                        <div class="alert-retorno">
                            <strong>Retorno:</strong> ${formatarData(alerta.Data_Retorno)}<br>
                            <strong>Status:</strong> <span class="status-${alerta.Status_Retorno.toLowerCase()}">${alerta.Status_Retorno}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="alert-footer">
                    <button class="btn-small" onclick="verProntuario(${alerta.ID_Paciente})">
                        📄 Ver Prontuário
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
        
        // ❌ REMOVIDO: Código que atualizava o badge de alertas
        // const badge = document.getElementById('badge-alertas');
        // if (badge) { ... }
        
    } catch (error) {
        console.error('Erro ao carregar alertas:', error);
    }
}

// UTILITÁRIOS
function formatarCPF(cpf) {
    if (!cpf) return '-';
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// ✅ FORMATAR DATA - VERSÃO CORRIGIDA
function formatarData(dataISO) {
    if (!dataISO || dataISO === 'null' || dataISO === '' || dataISO === 'undefined') return '-';
    
    try {
        // Se for objeto Date
        if (dataISO instanceof Date) {
            if (isNaN(dataISO.getTime())) return '-';
            const dia = String(dataISO.getDate()).padStart(2, '0');
            const mes = String(dataISO.getMonth() + 1).padStart(2, '0');
            const ano = dataISO.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }
        
        // Converte para string e limpa
        const dataStr = dataISO.toString().trim();
        
        // Tenta extrair apenas a parte YYYY-MM-DD
        const match = dataStr.match(/(\d{4}-\d{2}-\d{2})/);
        if (match) {
            const [ano, mes, dia] = match[1].split('-');
            if (ano && mes && dia && !isNaN(dia) && !isNaN(mes)) {
                return `${dia}/${mes}/${ano}`;
            }
        }
        
        // Fallback: tenta parsear como Date
        const data = new Date(dataStr);
        if (!isNaN(data.getTime())) {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }
        
        return '-';
    } catch (e) {
        console.error('Erro ao formatar data:', dataISO, e);
        return '-';
    }
}

// ✅ DESTACAR NAV - FUNÇÃO GLOBAL (FORA DO DOMContentLoaded)
function destacarNavAtivo() {
    const paginaAtual = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === paginaAtual) {
            link.classList.add('active');
        }
    });
}

// INICIALIZAÇÃO
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
    
    // ✅ Chama a função para destacar nav ativo
    destacarNavAtivo();
    
    // Carregar conteúdo específico
    switch(paginaAtual) {
        case 'consultas.html':
            carregarPacientes();
            break;
        case 'alertas.html':
            carregarAlertas();
            break;
        case 'pacientes-profissional.html':
            // Carregamento feito no script da própria página
            break;
    }
    
    // Máscaras de input
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
    
    // Busca com debounce
    const campoBusca = document.getElementById('busca');
    if (campoBusca) {
        campoBusca.addEventListener('input', function() {
            clearTimeout(window.buscaTimeout);
            window.buscaTimeout = setTimeout(buscarPaciente, 300);
        });
    }
    
    console.log('AVITTA - Página:', paginaAtual);
});