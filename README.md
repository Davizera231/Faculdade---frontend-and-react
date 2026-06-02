# Esteira de Propostas — Frontend

SPA desenvolvida em **React 18 + Vite 5** para gerenciamento de propostas comerciais, clientes e fluxo de aprovação por esteira.

---

## Tecnologias

| Tecnologia | Versão |
|---|---|
| React | 18 |
| Vite | 5 |
| React Router DOM | 6 |
| Axios | — |
| Bootstrap | 5.3 |
| react-toastify | 10 |

---

## Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:8080`

---

## Instalação e execução

```bash
npm install
npm run dev
```

Acesse em `http://localhost:5173`.

```bash
# Build de produção
npm run build
```

---

## Configuração da API

Em `src/api/api.js`, altere o `baseURL` para apontar ao backend desejado:

```js
const api = axios.create({
  baseURL: 'http://localhost:8080'
})
```

---

## Páginas

| Rota | Componente | Descrição |
|---|---|---|
| `/` | — | Redireciona para `/propostas` |
| `/clientes` | `ClientesList` | Lista de clientes |
| `/clientes/novo` | `ClienteForm` | Cadastro de cliente |
| `/clientes/:id/editar` | `ClienteForm` | Edição de cliente |
| `/propostas` | `PropostasList` | Lista de propostas com status |
| `/propostas/nova` | `PropostaForm` | Nova proposta + upload de PDF obrigatório |
| `/propostas/:id/editar` | `PropostaForm` | Edição de proposta + substituição de PDF |
| `/propostas/:id` | `PropostaDetalhe` | Detalhes, documentos e esteira de aprovação |

---

## Validações nos formulários

### ClienteForm
| Campo | Obrigatório | Validação |
|---|---|---|
| Nome | Sim | Não pode ser vazio — toast de erro |
| CPF / CNPJ | Sim | Não pode ser vazio — toast de erro |
| E-mail | Não | Se preenchido, valida formato via regex — toast de erro |
| Tipo | Sim | Seleção fixa: `PESSOA_FISICA` ou `PESSOA_JURIDICA` |

### PropostaForm
| Campo | Obrigatório | Validação |
|---|---|---|
| Valor | Sim | `min="0.01"`, atributo `required` HTML |
| Título | Sim | Atributo `required` HTML |
| Cliente | Sim | Select com `required` HTML |
| Documento PDF | Sim na criação | Valida `type === 'application/pdf'` — toast de erro; opcional na edição |

---

## Mensagens de erro da API

Todos os erros retornados pela API têm o formato:
```json
{ "erro": "Mensagem descritiva do problema." }
```

O frontend exibe essas mensagens diretamente no toast de erro. Abaixo as situações mais comuns:

### Clientes
| Situação | Mensagem exibida |
|---|---|
| CPF/CNPJ já cadastrado | `"Já existe um cliente com este CPF/CNPJ."` |
| Cliente não encontrado | `"Cliente não encontrado: id=99"` |

### Propostas
| Situação | Mensagem exibida |
|---|---|
| Proposta não encontrada | `"Proposta não encontrada: id=99"` |
| Tentar editar fora do RASCUNHO | `"Edição permitida apenas em RASCUNHO."` |
| Título vazio no backend | `"Título obrigatório."` |
| Valor zero ou negativo | `"Valor deve ser maior que zero."` |

### Documentos
| Situação | Mensagem exibida |
|---|---|
| Nenhum arquivo enviado | `"Nenhum arquivo enviado."` |
| Arquivo não é PDF (Content-Type) | `"Apenas arquivos PDF são aceitos. Tipo recebido: image/png"` |
| PDF com conteúdo inválido | `"O arquivo não é um PDF válido (assinatura de arquivo inválida)."` |
| Documento não encontrado | `"Documento não encontrado: id=99"` |

### Esteira
| Situação | Mensagem exibida |
|---|---|
| Reprovar proposta em rascunho | `"Não é possível reprovar uma proposta em rascunho."` |
| Avançar proposta já aprovada | `"Proposta já aprovada. Nenhuma transição disponível."` |
| Reabrir proposta em análise | `"Não é possível reabrir uma proposta em análise."` |
| Reprovar proposta já reprovada | `"Proposta já está reprovada."` |
| Avançar proposta reprovada | `"Use 'reabrir' para retornar ao rascunho."` |
| Ação inválida enviada | `"Ação desconhecida: XPTO"` |

---

## Componentes principais

### `EsteiraControle`
Exibe ações disponíveis para o status atual da proposta e os canais de notificação.

- **E-mail**: sempre marcado e desabilitado (obrigatório pelo backend).
- **SMS / WhatsApp / Facebook**: checkboxes opcionais selecionados pelo usuário.
- Envia `POST /esteira/{id}/{acao}` com `{ observacao, canais }`.

### `PropostaForm`
- Na **criação**: PDF obrigatório. A proposta é criada primeiro, depois o PDF é enviado (dois passos).
- Na **edição**: PDF opcional — substitui o documento existente se enviado.

---

## Módulos de API

| Arquivo | Funções |
|---|---|
| `src/api/clienteApi.js` | `listarClientes`, `buscarCliente`, `criarCliente`, `atualizarCliente`, `deletarCliente` |
| `src/api/propostaApi.js` | `listarPropostas`, `buscarProposta`, `criarProposta`, `atualizarProposta`, `deletarProposta` |
| `src/api/documentoApi.js` | `listarDocumentos`, `uploadDocumento`, `downloadDocumento`, `deletarDocumento` |
| `src/api/esteiraApi.js` | `buscarAcoes`, `executarAcao` |

---

## Estrutura de pastas

```
esteira-frontend/
└── src/
    ├── api/                 # Módulos Axios por entidade
    ├── components/          # EsteiraControle, Header
    ├── pages/
    │   ├── clientes/        # ClientesList, ClienteForm
    │   └── propostas/       # PropostasList, PropostaForm, PropostaDetalhe
    ├── App.jsx              # Rotas + ToastContainer global
    └── main.jsx             # Entry point
```

---

## Versão

`v1.4.0` — Validação JS com toast em ClienteForm. `v1.3.0` — Upload PDF obrigatório, código automático, canais de notificação.
