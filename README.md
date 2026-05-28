# Esteira de Propostas — Frontend

SPA (Single Page Application) desenvolvida em **React 18 + Vite 5** para gerenciamento de propostas comerciais, clientes e fluxo de aprovação por esteira.

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

- Node.js 18+ instalado
- Backend rodando em `http://localhost:8080`

---

## Instalação e execução

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação abre em `http://localhost:5173`.

### Build para produção

```bash
npm run build
```

Os arquivos estáticos são gerados na pasta `dist/`.

---

## Configuração da API

A URL base da API está configurada em `src/api/api.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:8080'
})
```

Para apontar para outro ambiente, altere o `baseURL`.

---

## Páginas

| Rota | Componente | Descrição |
|---|---|---|
| `/` | Redirect | Redireciona para `/propostas` |
| `/clientes` | `ClienteList` | Lista de clientes |
| `/clientes/novo` | `ClienteForm` | Cadastro de cliente |
| `/clientes/:id/editar` | `ClienteForm` | Edição de cliente |
| `/propostas` | `PropostaList` | Lista de propostas com status |
| `/propostas/nova` | `PropostaForm` | Nova proposta + upload de PDF obrigatório |
| `/propostas/:id/editar` | `PropostaForm` | Edição de proposta + substituição de PDF |
| `/propostas/:id` | `PropostaDetalhe` | Detalhes, documentos e esteira de aprovação |

---

## Componentes Principais

### `EsteiraControle`
Exibe as ações disponíveis para o status atual da proposta e os canais de notificação.

- **E-mail**: sempre marcado e desabilitado (obrigatório).
- **SMS / WhatsApp / Facebook**: checkboxes opcionais selecionados pelo usuário.
- Chama `POST /esteira/{id}/{acao}` com `{ observacao, canais }`.

### `PropostaForm`
Formulário de criação/edição de propostas.

- Na **criação**: documento PDF é obrigatório. A proposta é criada primeiro, depois o PDF é enviado.
- Na **edição**: PDF é opcional (substitui o documento existente se enviado).
- Validação client-side: aceita somente `application/pdf`.

---

## Módulos de API

| Arquivo | Funções exportadas |
|---|---|
| `src/api/clienteApi.js` | `listarClientes`, `buscarCliente`, `criarCliente`, `atualizarCliente`, `deletarCliente` |
| `src/api/propostaApi.js` | `listarPropostas`, `buscarProposta`, `criarProposta`, `atualizarProposta`, `deletarProposta` |
| `src/api/documentoApi.js` | `listarDocumentos`, `uploadDocumento`, `downloadDocumento`, `deletarDocumento` |
| `src/api/esteiraApi.js` | `buscarAcoes`, `executarAcao` |

---

## Estrutura de Pastas

```
esteira-frontend/
└── src/
    ├── api/             # Módulos Axios por entidade
    ├── components/      # Componentes reutilizáveis (EsteiraControle, Navbar, etc.)
    ├── pages/
    │   ├── clientes/    # ClienteList, ClienteForm
    │   └── propostas/   # PropostaList, PropostaForm, PropostaDetalhe
    ├── App.jsx          # Rotas e ToastContainer
    └── main.jsx         # Entry point
```

---

## Notificações (Toasts)

O `<ToastContainer>` está registrado globalmente em `App.jsx`. Qualquer componente pode disparar notificações com:

```js
import { toast } from 'react-toastify'

toast.success('Operação realizada!')
toast.error('Erro ao salvar.')
```

---

## Versão

`v1.3.0` — Upload de PDF obrigatório, código de proposta automático, seleção de canais de notificação.
