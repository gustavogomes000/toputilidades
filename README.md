# TOP UTILIDADES E PRESENTES — Portal de Gestão, Fechamento de Caixa, Conciliação e Auditoria (26 Lojas)

Sistema Front-end corporativo de alta fidelidade desenvolvido com a stack oficial da Lovable (**React + Vite + TypeScript + Tailwind CSS + Lucide React + React Router DOM**), concebido para apresentação ao cliente e deploy imediato na Vercel.

---

## 🎨 Identidade Visual & Cores Oficiais da Marca
- **Amarelo Top (Destaque / Fundo da Logo):** `#FFF200` e `#F59E0B`
- **Vermelho Presente (Primária / Botões de Ação):** `#EE2B33` (Hover `#D11F27`)
- **Azul Marinho Institucional (Títulos / Sidebar / Cabeçalhos):** `#0B1560`
- **Fundos Corporativos Limpos:** `#F8FAFC` (Página) e `#FFFFFF` (Cards)

---

## 📱 Responsividade Total & Experiência Mobile-First
- **No Celular (`< 768px`)**:
  - `Bottom Navigation Bar` fixa no rodapé para navegação fácil com o polegar.
  - Alvos de toque com altura mínima de 48px (`min-h-[48px]`).
  - Inputs com tamanho de fonte de 16px para evitar zoom indesejado no iOS/Android.
  - Câmera real do celular acionada instantaneamente com `<input type="file" capture="environment">`.
  - Canvas de assinatura com `touch-action: none` que impede a rolagem da página enquanto se assina na tela com o dedo.
- **No Desktop (`>= 1024px`)**:
  - Sidebar elegante em Azul Marinho `#0B1560`.
  - Layout em colunas balanceadas com gráficos e mapa em tela cheia.

---

## 🚀 Telas & Módulos Implementados

### 🔐 1. Tela de Login (`/login` ou `/`)
- Logo oficial da **TOP Utilidades** em alta resolução e modo alternativo em vetor SVG puro.
- Input Login/CPF com máscara e Senha com alternador `Eye` / `EyeOff`.
- Atalhos de apresentação com 1 clique: `[Gerente Loja 01]` e `[Auditoria Geral]`.
- Modais interativos de **"Esqueci minha senha"** (com envio simulado para o WhatsApp da Matriz) e **"Suporte Técnico às 26 Lojas"** com horários de plantão e botão de WhatsApp.

### 📱 2. Fechamento de Caixa do Gerente (`/fechamento`)
- Baseado nos dados reais da **Loja Nº 7 Campinas (27/10/2026 - Terça-feira)**.
- **Sintegra ERP**: Total apurado de **R$ 24.157,00** com botão interativo de sincronização.
- **Bloco A (Dinheiro & Retiradas)**:
  - Sintegra: `R$ 4.105,50`.
  - Retiradas com foto obrigatória: Lanche (`R$ 54,00`) e Jornal (`R$ 300,00`).
  - Gaveta de Dinheiro: Esperado `R$ 3.751,50` com cálculo automático de quebra/sobra e foto obrigatória.
- **Bloco B (Cartão & PIX)**:
  - Maquininhas POS Stone (`R$ 7.500` Cartão / `R$ 4.000` PIX) e Cielo (`R$ 4.522,50` Cartão / `R$ 2.811` PIX).
  - **Compensação Inteligente**: Detecta que `+R$ 35,00` no Cartão anula `-R$ 35,00` no PIX (Saldo Líquido: R$ 0,00).
- **Aba 2 (Cofre & Depósitos)**:
  - Saldo acumulado no cofre: **R$ 7.153,00** (`26/10: R$ 3.401,50` + `27/10: R$ 3.751,50`).
  - Formulário para registrar novo depósito bancário com anexo de comprovante.
- **Modal de Validação Final (3 Passos)**:
  1. Captura de Selfie com moldura biométrica e timestamp.
  2. Assinatura digital real no Canvas (touch e mouse).
  3. Prévia idêntica ao WhatsApp para confirmação do fechamento.

### 🗺️ 3. Monitoramento Ao Vivo das 26 Lojas (`/monitoramento` ou `/dashboard`)
- **Placar em Tempo Real**: `19 de 26 Lojas Fechadas (73%)` com barra animada e faturamento de **R$ 584.320,00**.
- **Mapa Geográfico Interativo**: 26 pins coloridos e pulsantes (Verde: OK, Amarelo: Compensado, Vermelho: Alerta, Cinza: Aberto).
- **Raio-X Detalhado da Loja**: Espelho de números, galeria com zoom de todas as evidências e **tabela venda a venda** destacando a venda de R$ 35,00 às 15:22.
- **Gráficos Analíticos**: Top 5 lojas em vendas e gráfico de rosca de meios de pagamento (52% Cartão, 31% PIX, 17% Dinheiro).

### 🕵️ 4. Auditoria Presencial na Loja (`/auditoria`)
- Check-in geolocalizado do Supervisor na loja com foto.
- **Contagem "Às Cegas" do Cofre**: O auditor digita o valor físico contado antes de confrontar com o sistema (com botões de simulação rápida para a demo).
- **Checklist Físico (Papel vs. Foto)**: Validação dos recibos de lanche, jornal, filipetas e comprovante bancário de R$ 14.500,00.
- **Dupla Assinatura Biométrica**: Auditor e Gerente assinam juntos na tela.
- Emissão do Termo Oficial de Auditoria em formato PDF simulado e alerta ao WhatsApp da Diretoria.

### 💼 5. Central de Relatórios e WhatsApp do Financeiro (`/relatorios`)
- Espelho formatado em estilo balão do WhatsApp da Matriz com botões de copiar e reenviar.
- Galeria de conferência de anexos com botões de **`[Validar Comprovante]`** e **`[Solicitar Nova Foto]`**.

### 🏪 6. Gestão & Cadastro das 26 Lojas (`/lojas`)
- Cadastro completo das filiais com código Sintegra, gerente, limite de cofre e maquininhas POS vinculadas.
- Modal em 4 etapas para cadastrar novas lojas.

### ⚙️ 7. Administração, Usuários & Integrações (`/admin`)
- Controle de acesso estrito (Gerentes, Supervisores, Financeiro e Diretoria).
- Cadastro de novos usuários e parametrização de segurança.
- Testador ao vivo da API Sintegra e robô de WhatsApp.

---

## 🛠️ Tecnologias Utilizadas
- **React 19 + TypeScript**
- **Vite**
- **Tailwind CSS 3.4**
- **React Router DOM 7**
- **Lucide React** (Ícones modernos)
- **HTML5 Canvas API** (Assinatura touch/mouse)
- **HTML5 Media Capture API** (Câmera do smartphone)
- **Local Storage API** (Persistência e reatividade sem necessidade de back-end)

---

## 💻 Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Compilar para produção
npm run build
```

O aplicativo estará rodando em `http://localhost:5173/`.
Na barra superior azul, use o **Modo Apresentação** para alternar entre qualquer um dos perfis com 1 clique!
