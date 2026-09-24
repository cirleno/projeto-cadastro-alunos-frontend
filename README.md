# Sistema_CPE

Protótipo web de cadastro de alunos (CRUD) front-end.

Autor: **X-Marçal** — [github.com/cirleno](https://github.com/cirleno)

## Funcionalidades

- **Listagem de cadastros** (`index.html`) com tabela paginada (5 registros por página).
- **Busca** por nome ou curso (sem diferenciar maiúsculas/minúsculas).
- **Cadastro** (`add.html`) com validação em JS: nome e curso obrigatórios e data no formato `DD/MM/AAAA`.
- **Edição** (`edit.html?id=...`) com formulário pré-preenchido.
- **Visualização** (`view.html?id=...`) dos detalhes do cadastro.
- **Exclusão** com modal de confirmação (sem confirmação direta destrutiva).
- **Interface responsiva** (mobile-first): navbar colapsável, grid que empilha em telas pequenas e tabela com rolagem horizontal.
- **Proteção contra XSS**: todos os valores são exibidos com escape (`escapeHtml`) ou `textContent`.

## Tecnologias utilizadas

| Tecnologia | Versão | Observação |
|---|---|---|
| HTML5 | — | Semântico, `lang="pt-br"`, `meta viewport` |
| CSS3 / Bootstrap | 5.3.8 | Arquivo local (`css/bootstrap.css`), sem CDN |
| JavaScript | Vanilla (ES5) | Sem frameworks e **sem jQuery** |
| Font Awesome | 7.3.1 | Arquivo local (`css/font-awesome.css`) + `webfonts/` |
| Fetch API | — | Leitura inicial dos dados (`data/alunos.json`) |
| localStorage | — | Persistência das gravações feitas no navegador |

## Estrutura de arquivos

```
Sistema_CPE/
├── index.html      # Listagem + busca + paginação + exclusão
├── add.html        # Formulário de cadastro
├── edit.html       # Formulário de edição (via ?id=...)
├── view.html       # Detalhes do cadastro (via ?id=...)
├── css/
│   ├── bootstrap.css      # Bootstrap 5.3.8
│   └── font-awesome.css   # Font Awesome 7.3.1
├── js/
│   ├── bootstrap.js       # Bundle do Bootstrap 5 (inclui Popper)
│   └── sistema.js         # Lógica do sistema (DataStore + validação)
├── data/
│   └── alunos.json        # Dados de origem (seed)
├── webfonts/              # Fontes do Font Awesome
└── img/               # Logo, favicon e ícones
```

## Como executar

Como as páginas leem `data/alunos.json` via `fetch`, é preciso servir a pasta por HTTP (não funciona abrindo o arquivo direto no navegador):

```bash
# opção 1 — Python
python -m http.server 8000

# opção 2 — Node
npx http-server .
```

Depois acesse: **http://localhost:8000**

## Persistência de dados

- A primeira carga é feita em `data/alunos.json` (`fetch`), com **fallback** para os dados embutidos em `js/sistema.js` caso o servidor não esteja disponível.
- Como o navegador não pode gravar em arquivo, as operações de **criar, editar e excluir** são persistidas no **`localStorage`** (chave `sistema_cpe_alunos`), sobrepujando o JSON a partir daí.
- Em um ambiente real, este `DataStore` seria trocado por chamadas a uma **API** (`/api/alunos`), mantendo o mesmo contrato (`load`, `list`, `findById`, `create`, `update`, `remove`, `search`).

## Segurança e boas práticas

- **Zero dependências externas em runtime**: todos os assets (CSS, JS, fontes) são locais.
- `jQuery` foi removido (o Bootstrap 5 não depende dele), reduzindo a superfície de ataque.
- Links externos (GitHub) usam `rel="noopener"`.
- Escape de valores renderizados dinamicamente (XSS).

## Observações

- `img/x-marçal_Logo_original.png` é o backup da logo antes da conversão para a versão branca usada na navbar.