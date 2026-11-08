![EduBlog](./assets/images/eduBlog-logo.png)

# EduBlog Mobile

O **EduBlog Mobile** foi desenvolvido com **React Native, TypeScript e Expo**. Durante o desenvolvimento, utilizamos o **Expo Go** em um dispositivo Android físico, evitando a necessidade de instalar um emulador.

O projeto utiliza o **Expo SDK 58**. Para executar a aplicação no dispositivo físico, a versão do Expo Go instalada no celular precisa ser compatível com esse SDK.

## Pré-requisitos

- Node.js compatível com o Expo SDK 58;
- npm;
- aplicativo **Expo Go compatível com o SDK 58** instalado no celular;
- conexão com a internet;
- computador e celular conectados à mesma rede quando utilizada a conexão LAN;
- firewall configurado para permitir a comunicação local, quando necessária.

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd edublog-mobie
npm install
```

Depois da instalação, verifique se as dependências estão alinhadas com a versão do Expo:

```bash
npx expo install --check
```

O projeto utiliza o Expo SDK 58. Caso seja necessário instalar ou atualizar dependências, consulte o procedimento de atualização do SDK antes de alterar versões manualmente.

## Configuração da API

A aplicação utiliza a variável de ambiente `EXPO_PUBLIC_API_URL` para definir o endereço da API REST do EduBlog.

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=https://blog-api-dnfx.onrender.com
```

A variável deve utilizar o prefixo `EXPO_PUBLIC_` para estar disponível no código do aplicativo Expo.

**Importante:** não armazene senhas, tokens privados ou chaves secretas em variáveis `EXPO_PUBLIC_*`, pois seus valores podem ser incluídos no aplicativo cliente.

---

## Iniciando o projeto

### LAN — modo padrão

Para iniciar o Expo normalmente:

```bash
npm start
```

Ou, alternativamente:

```bash
npx expo start
```

O Expo iniciará o Metro Bundler e exibirá um QR Code no terminal.

Abra o **Expo Go** no celular e escaneie o QR Code.

A comunicação ocorre diretamente pela rede local:

```text
Celular
   ↓
Wi-Fi
   ↓
Computador
   ↓
Expo / Metro Bundler
```

Quando a conexão LAN funciona corretamente, essa é uma opção preferencial por não depender de um serviço externo de Tunnel.

### Como funciona a conexão LAN

Na conexão LAN, o celular precisa conseguir acessar o servidor de desenvolvimento executado no computador. Os dois dispositivos devem estar na mesma rede local, e o roteador e o firewall não podem impedir essa comunicação.

Se o aplicativo não conseguir carregar o projeto, verifique o endereço de rede mostrado pelo Expo, a configuração do firewall e a conectividade entre os dispositivos.

---

## Tunnel — alternativa para problemas de rede

Caso o Expo Go fique carregando ou o celular não consiga acessar o computador pela rede local, o projeto possui suporte à conexão por Tunnel.

O projeto utiliza a dependência `@expo/ngrok` instalada localmente:

```bash
npm install -D @expo/ngrok@4.1.3
```

Essa dependência deve permanecer registrada no `package.json` e no `package-lock.json`, evitando a necessidade de instalação global para esse projeto.

### Tentativa de conexão pelo Tunnel

O comando configurado inicialmente no projeto é:

```bash
npm run start:tunnel
```

O script correspondente no `package.json` é:

```json
{
  "scripts": {
    "start": "expo start",
    "start:tunnel": "expo start --tunnel"
  }
}
```

Se o túnel padrão não conseguir criar uma URL assinada, o próprio Expo poderá sugerir o uso da alternativa com ngrok:

```bash
npx expo start --tunnel ngrok
```

Essa alternativa deve ser testada no ambiente antes de ser considerada funcional.

Se o comando alternativo funcionar e for adotado definitivamente, o script `start:tunnel` poderá ser atualizado para:

```json
{
  "scripts": {
    "start": "expo start",
    "start:tunnel": "expo start --tunnel ngrok"
  }
}
```

Após essa alteração, a inicialização poderá continuar sendo realizada pelo comando habitual:

```bash
npm run start:tunnel
```

### Como funciona a conexão Tunnel

Nesse modo, a comunicação utiliza um serviço de túnel para conectar o celular ao servidor de desenvolvimento:

```text
Celular
   ↓
Internet
   ↓
Serviço Tunnel / ngrok
   ↓
Computador
   ↓
Expo / Metro Bundler
```

O Tunnel é utilizado **somente durante o desenvolvimento**. Ele não faz parte do aplicativo final distribuído aos usuários.

A disponibilidade depende do serviço externo, da conexão com a internet e da configuração do Expo.

### LAN ou Tunnel?

| Comando                         | Uso                                                                 |
| ------------------------------- | ------------------------------------------------------------------- |
| `npm start`                     | Execução normal pela rede local                                     |
| `npm run start:tunnel`          | Inicialização pelo Tunnel, conforme o script configurado            |
| `npx expo start --tunnel ngrok` | Alternativa usando ngrok, quando necessária e funcional no ambiente |

A conexão LAN normalmente apresenta melhor desempenho por utilizar a rede local diretamente. O Tunnel é uma alternativa útil quando existem restrições de firewall, roteador ou isolamento entre dispositivos.

**Atenção:** a URL do túnel pode permitir acesso ao servidor de desenvolvimento a quem a conhecer. Não compartilhe o QR Code publicamente e encerre o servidor quando terminar os testes.

---

## Problemas de conexão com o celular

Se o Expo Go ficar indefinidamente em **"carregando"**, verifique primeiro:

1. Se o celular e o computador estão na mesma rede Wi-Fi, quando utilizada a conexão LAN.
2. Se o servidor do Expo está em execução no computador.
3. Se a versão do Expo Go é compatível com o SDK utilizado pelo projeto.
4. Se o firewall do Windows não está bloqueando a comunicação.
5. Se o roteador permite comunicação entre os dispositivos conectados.
6. Se as dependências do projeto foram instaladas corretamente.

### Teste de conectividade pela rede local

Também é possível testar o endereço do Metro Bundler no navegador do celular:

```text
http://IP_DO_COMPUTADOR:8081
```

Para descobrir o endereço IPv4 do computador no Windows, execute:

```cmd
ipconfig
```

Procure o **Endereço IPv4** do adaptador Wi-Fi ativo.

Substitua `IP_DO_COMPUTADOR` pelo endereço encontrado e abra a URL no navegador do celular.

Esse teste ajuda a verificar se o dispositivo consegue alcançar a porta utilizada pelo servidor de desenvolvimento. Um resultado isolado, porém, não garante que todas as etapas de carregamento do aplicativo funcionarão.

Caso a conexão LAN continue bloqueada, tente a alternativa de Tunnel:

```bash
npx expo start --tunnel ngrok
```

Esse comando é uma alternativa a testar; sua disponibilidade depende da configuração e do serviço de túnel.

### Verificação do firewall e dos perfis de rede do Windows

O Windows utiliza os perfis `Public` e `Private` para aplicar regras diferentes de rede e firewall.

Em uma rede doméstica confiável, o perfil `Private` pode facilitar a comunicação entre dispositivos da rede local. Em redes públicas ou desconhecidas, mantenha o perfil `Public`.

A alteração é feita somente no computador e não modifica a configuração do roteador ou do Wi-Fi para os demais dispositivos.

Para verificar o perfil atual, execute o PowerShell como administrador quando necessário:

```powershell
Get-NetConnectionProfile
```

Para alterar uma rede Wi-Fi confiável para `Private`:

```powershell
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private
```

Para retornar ao perfil `Public`:

```powershell
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Public
```

O nome da interface pode variar de acordo com a configuração do computador.

> **Importante:** não altere uma rede desconhecida ou pública para `Private` apenas para fazer o Expo funcionar. Primeiro, confirme que a rede é confiável.

---

## Diagnóstico do projeto

Para verificar se as dependências estão alinhadas com o SDK:

```bash
npx expo install --check
```

Para executar as verificações de configuração e compatibilidade:

```bash
npx expo-doctor
```

O `expo-doctor` realiza diversas verificações e pode precisar acessar serviços do Expo pela internet.

Se aparecer um erro de conexão, como `ConnectTimeoutError`, isso não significa necessariamente que o código ou as dependências estejam incorretos. Verifique a conectividade e execute o diagnóstico novamente.

Se uma verificação identificar uma incompatibilidade, analise a mensagem antes de modificar as dependências.

---

## Consulta e leitura de conteúdos

A página inicial reúne listagem, cards, pesquisa, navegação por disciplinas e
filtros de autor, série/ano e semestre. Os posts marcados com `isFeatured` aparecem
em um carrossel. Ao abrir um card, a tela de leitura apresenta título, autor,
disciplina, classificação, semestre, série/ano, data e conteúdo completo.

Esse módulo fica em `src/features/posts`, com as rotas em `src/app/(app)` e as
consultas em `src/services/postsService.ts`. A regra de login existente foi mantida.

- `GET /posts`: catálogo de conteúdos e opções dos filtros;
- `GET /posts/search?q=...&discipline=...&author=...`: pesquisa e filtros na API;
- `GET /posts/:id`: leitura de uma publicação;
- `GET /catalog/disciplines`: navegação por disciplinas, inclusive sem publicações.

Série/ano e semestre são filtrados no aplicativo. As telas de consulta e leitura
exibem apenas posts com `status.label` igual a `Publicado`, incluindo os destaques.
A classificação exibida corresponde a `status.label`, o campo disponível no
contrato atual. Comentários não foram adicionados, pois são opcionais e não há
uma implementação existente.

A API configurada em `EXPO_PUBLIC_API_URL` deve oferecer os endpoints acima. A
API de produção indicada neste README oferece `/posts/search`. Versões anteriores
do backend podem não definir essa rota; confirme sua disponibilidade ao usar uma
API local. O termo pesquisado segue o comportamento de acentuação da API.

Para verificar o módulo, sem adicionar dependências de testes:

```bash
node --experimental-strip-types --test scripts/test-posts.mjs
npx tsc --noEmit
```

### Navegação por perfil

A Home exibe o atalho **Painel do Professor** apenas para usuários com
`user.role === "PROFESSOR"`. A rota `/teacher` redireciona para
`/teacher/dashboard`, seguindo o caminho utilizado na versão web.

O grupo de rotas `teacher` é protegido com `Stack.Protected` no layout da área
autenticada. Alunos não têm acesso a esse grupo, inclusive por link direto.
As regras existentes de login e sessão foram preservadas.

O painel contém uma tela-base com identificação do professor e retorno aos
conteúdos. As funções de gestão de publicações serão implementadas pelo módulo
responsável; não foram adicionadas operações de criação, edição ou exclusão.

Para verificar a navegação por perfil:

```bash
node --test scripts/test-professor-navigation.mjs
```

## Gestão de usuários

No dashboard do professor o botão **Painel Administrativo** abre a Área Administrativa, utilizada para a gestão de professores e de alunos. Nas duas listas é possível cadastrar, editar, alterar o status (ativo ou inativo) e excluir usuários. A listagem é paginada, a exclusão pede confirmação e o resultado de cada operação é informado por mensagens de sucesso ou de erro.

Esse módulo fica em `src/features/users`, com as rotas em `src/app/(app)/teacher`, o serviço em `src/services/usersService.ts` e o hook de listagem em `src/hooks/useUsers.ts`. As telas de professores e alunos usam a mesma implementação, os textos e as rotas de cada perfil ficam em `src/features/users/constants/userRoleConfig.ts`.

- `/teacher/users`: Área Administrativa;
- `/teacher/teachers`, `/teacher/teachers/new` e `/teacher/teachers/[id]/edit`: lista, cadastro e edição de professores;
- `/teacher/students`, `/teacher/students/new` e `/teacher/students/[id]/edit`: lista, cadastro e edição de alunos.

As rotas ficam no grupo `teacher` protegido com `Stack.Protected`. Alunos têm acesso apenas à leitura dos posts. A API também exige o token do professor nas operações de escrita.

- `GET /catalog/users`: listagem e carregamento do usuário na edição;
- `POST /catalog/users`: cadastro, com o perfil da tela (`role`) e o status (`isActive`);
- `PUT /catalog/users/:id`: edição, incluindo o status; a senha só é enviada quando preenchida;
- `DELETE /catalog/users/:id`: exclusão, após confirmação em um alerta.

## Scripts disponíveis

| Comando                | Descrição                                            |
| ---------------------- | ---------------------------------------------------- |
| `npm start`            | Inicia o Expo em modo padrão                         |
| `npm run start:tunnel` | Inicia o Expo utilizando o Tunnel definido no script |
| `npm run android`      | Inicia o Expo com destino Android                    |
| `npm run ios`          | Inicia o Expo com destino iOS                        |
| `npm run web`          | Executa a aplicação no navegador                     |
| `npm run lint`         | Executa o lint do projeto                            |

Para interromper o servidor de desenvolvimento:

```text
Ctrl + C
```

---

## Fluxo de desenvolvimento

```text
┌──────────────────────┐
│    EduBlog Mobile    │
│    React Native      │
│    TypeScript        │
│    Expo SDK 58       │
└──────────┬───────────┘
           │
           ▼
        Expo Go
           │
           ▼
     Celular Android
           │
       ┌───┴───┐
       │       │
      LAN    Tunnel
       │       │
       └───┬───┘
           │
           ▼
    Computador / Expo
           │
           ▼
        API REST
```
