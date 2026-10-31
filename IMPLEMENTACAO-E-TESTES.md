# Ferramenta Fácil — pacote ampliado para testes manuais

## Novidade desta entrega
- Nova página `gestao.html` com contas a pagar/receber, status pago/pendente, painel de totais, tarefas com prioridade e conclusão, orçamentos simples imprimíveis e backup/restauração JSON.
- A página usa `localStorage` no navegador, sem servidor ou banco de dados.
- Link de Gestão adicionado à navegação e sitemap.
- Mantidas as páginas e ferramentas que já estavam no pacote recebido.

## Como executar
1. Extraia todo o ZIP para uma pasta.
2. Abra a pasta no VS Code.
3. Abra `index.html` com Live Server.
4. Acesse Gestão pelo menu ou diretamente em `gestao.html`.

## Testes sugeridos
1. Cadastre uma conta a pagar de R$ 100 e outra a receber de R$ 250. Confira os totais.
2. Marque uma conta como concluída e confirme que ela sai do total pendente.
3. Cadastre tarefa, marque como concluída e atualize a página.
4. Crie orçamento com quantidade 3 e preço 12,50; total esperado R$ 37,50. Teste impressão.
5. Exporte JSON, limpe os dados e restaure o arquivo.
6. Tente restaurar JSON inválido; dados existentes devem permanecer.
7. Teste em celular e computador.

## Limitações importantes e transparentes
- Esta entrega amplia o projeto, mas não transforma o site em ERP nem oferece sincronização entre dispositivos. Dados da página Gestão ficam no navegador/dispositivo usado.
- Contas, tarefas e orçamentos são controles básicos; não há conciliação bancária, recorrência automática, emissão fiscal, envio de cobrança ou cálculo contábil.
- O orçamento é um documento simples para impressão, não nota fiscal nem documento fiscal eletrônico.
- As consultas fiscais e Reforma Tributária são orientativas; valide enquadramento e regras com contador e fontes oficiais.
- O módulo de estoque preexistente deve ser testado manualmente com dados fictícios; não presumir que backup da página Gestão inclua os dados de todos os módulos.
- Ferramentas de PDF usam impressão do navegador quando indicado; não há editor/mesclador PDF completo.
- Não foram realizados testes completos de interface em navegadores reais nem testes fiscais/contábeis de homologação.

## Segurança dos dados
Faça backup JSON antes de limpar cache, trocar de navegador ou dispositivo. Não armazene dados pessoais sensíveis ou informações de clientes sem avaliar os requisitos da LGPD. Use dados fictícios nos testes.
