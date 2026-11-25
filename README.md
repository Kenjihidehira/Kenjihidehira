<a id="inicio"></a>

<div align="center">

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/Kenjihidehira/Kenjihidehira/main/assets/capa-portfolio-mobile.png">
  <img src="https://raw.githubusercontent.com/Kenjihidehira/Kenjihidehira/main/assets/capa-portfolio.png" width="100%" alt="Wesley Kenji Hidehira · Portfólio de desenvolvimento web · Douradina, PR">
</picture>

<br><br>

<a href="#jusimed"><img src="./assets/card-nav-jusimed.png" width="146" alt="Ir para Jusimed"></a>
<a href="#patrimônio-ops"><img src="./assets/card-nav-patrimonio.png" width="146" alt="Ir para Patrimônio Ops"></a>
<a href="#outros-projetos"><img src="./assets/card-nav-projetos.png" width="146" alt="Ir para outros projetos"></a>
<a href="#contato"><img src="./assets/card-nav-contato.png" width="146" alt="Ir para contato"></a>

</div>

---

## Projetos em destaque

### Jusimed

[![Painel do Jusimed com indicadores de disponibilidade, validade e movimentação de estoque](./assets/vitrine-jusimed.png)](./assets/portfolio-jusimed-current.png)

`Estoque de dispositivos médicos` · `Protótipo independente`

Protótipo web para acompanhar o saldo por lote, validade e localização. O fluxo conecta o pedido à reserva, à conferência e à expedição, com dados fictícios.

**[Explorar o projeto ↗](https://github.com/Kenjihidehira/jusimed-estoque-prototipo#readme)** · [Ler a proposta](https://github.com/Kenjihidehira/jusimed-estoque-prototipo/blob/main/docs/proposta-apresentacao.md)

<details>
<summary><strong>Explorar o fluxo do Jusimed</strong></summary>

1. **Consultar o estoque** por lote, validade e localização.
2. **Reservar e separar o pedido** com conferência de código, lote e quantidade.
3. **Expedir** e acompanhar a baixa de saldo no histórico do pedido.

[Ampliar o painel](./assets/portfolio-jusimed-current.png) · [Ver regras de pedidos e expedição](https://github.com/Kenjihidehira/jusimed-estoque-prototipo/blob/main/docs/pedidos-expedicao.md) · [Consultar os indicadores](https://github.com/Kenjihidehira/jusimed-estoque-prototipo/blob/main/docs/analytics.md)

</details>

---

### Patrimônio Ops

[![Painel do Patrimônio Ops com indicadores de inventário, custódia e movimentações](./assets/vitrine-patrimonio.png)](./assets/portfolio-patrimonio-current.png)

`Inventário e custódia` · `Sistema com acesso autenticado`

Sistema de controle patrimonial por núcleo. Reúne inventário de ativos, importação de dados, emissão de termos de custódia e histórico de movimentações para auditoria.

**[Ver código ↗](https://github.com/Kenjihidehira/patrimonio-ops-control)** · [Ler arquitetura](https://github.com/Kenjihidehira/patrimonio-ops-control/blob/main/docs/arquitetura.md) · [Acessar sistema (login)](https://patrimonio-ops-control.vercel.app/demo)

<sub>Captura do laboratório local com dados fictícios.</sub>

<details>
<summary><strong>Explorar o fluxo do Patrimônio Ops</strong></summary>

1. **Cadastrar ou importar ativos** e consultar os registros por núcleo.
2. **Acompanhar inventário e custódia** com termos e registro de movimentações.
3. **Consultar a trilha de auditoria** e revisar as permissões por perfil.

[Ampliar o painel](./assets/portfolio-patrimonio-current.png) · [Ver documentação da API](https://github.com/Kenjihidehira/patrimonio-ops-control/blob/main/docs/api.md) · [Consultar controle de acesso](https://github.com/Kenjihidehira/patrimonio-ops-control/blob/main/docs/controle-de-acesso.md)

</details>

[↑ Voltar ao menu](#inicio)

---

<a id="projetos"></a>

## Outros projetos

[Finanças](#cobreflow) · [Serviços em campo](#fieldops) · [Marketing](#leadops) · [Pós-venda](#returnops) · [Gestão comercial](#servicehub)

<a id="cobreflow"></a>

[![CobreFlow · Recebíveis, cobrança e conciliação](./assets/card-cobreflow.png)](https://github.com/Kenjihidehira/cobreflow-finance-ops)

[Demonstração do CobreFlow ↗](https://cobreflow-finance.dadosepesquisa.chatgpt.site)

<a id="fieldops"></a>

[![FieldOps · Margem, SLA e serviços em campo](./assets/card-fieldops.png)](https://github.com/Kenjihidehira/fieldops-margin-control)

[Demonstração do FieldOps ↗](https://fieldops-margin.dadosepesquisa.chatgpt.site)

<a id="leadops"></a>

[![LeadOps · Atribuição de campanhas e pontuação de leads](./assets/card-leadops.png)](https://github.com/Kenjihidehira/leadops-campaign-attribution)

[Demonstração do LeadOps ↗](https://leadops-attribution.dadosepesquisa.chatgpt.site)

<a id="returnops"></a>

[![ReturnOps · Devoluções, reembolsos e controle de SLA](./assets/card-returnops.png)](https://github.com/Kenjihidehira/returnops-rma-command-center)

[Demonstração do ReturnOps ↗](https://returnops-rma-control.dadosepesquisa.chatgpt.site)

<a id="servicehub"></a>

[![ServiceHub · Agenda, funil e cobranças para serviços](./assets/card-servicehub.png)](https://github.com/Kenjihidehira/servicehub-agendamentos-crm)

[Demonstração do ServiceHub ↗](https://servicehub-crm-ops.dadosepesquisa.chatgpt.site)

---

## Sobre meu trabalho

<a id="como-trabalho"></a>

![Como trabalho · Entendo o fluxo, modelo as regras, construo a interface e a API e testo os cenários críticos.](./assets/card-metodo.png)

<a id="tecnologias"></a>

![Tecnologias · TypeScript, JavaScript, Node.js, PHP, SQL, Supabase e GitHub Actions.](./assets/card-tecnologias.png)

<details>
<summary><strong>Ver como aplico essas tecnologias</strong></summary>

- **Interface e regras de estoque.** Veja como o [protótipo Jusimed](https://github.com/Kenjihidehira/jusimed-estoque-prototipo#estrutura) organiza a interface React e as regras em TypeScript.
- **Dados e acesso.** A [arquitetura do Patrimônio Ops](https://github.com/Kenjihidehira/patrimonio-ops-control/blob/main/docs/arquitetura.md) documenta a integração entre aplicação, autenticação e persistência.

</details>

## Contato

[![Contato · Clique para abrir uma proposta no GitHub](./assets/card-contato.png)](https://github.com/Kenjihidehira/Kenjihidehira/issues/new?title=Proposta%20de%20projeto)

[Abrir proposta ↗](https://github.com/Kenjihidehira/Kenjihidehira/issues/new?title=Proposta%20de%20projeto) · [Todos os repositórios ↗](https://github.com/Kenjihidehira?tab=repositories)

[↑ Voltar ao menu](#inicio)
