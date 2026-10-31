# Ferramenta Fácil — versão ampliada para testes manuais

## O que foi incluído nesta entrega
- Página `ferramentas-extras.html`: taxa de cartão, simulação de parcelamento com juros compostos, contador/formatador de texto, gerador de senha, conversor de unidades, leitor CSV com exportação JSON, impressão/Salvar como PDF e gerador de QR Code.
- Favoritos e ferramentas recentes na página inicial, armazenados no navegador.
- Controle de estoque melhorado na Central: estoque mínimo, alerta visual, edição e exclusão de produto, entradas/saídas, bloqueio de saldo negativo, histórico de movimentações e exportação CSV.
- Backup JSON atualizado para incluir movimentos de estoque, com validação antes de importar e tentativa de reversão se o armazenamento falhar.
- Links para a nova página nas categorias, canonical nas páginas, sitemap sem duplicar `/index.html` e ajuste de navegação responsiva.

## Como testar
1. Descompacte a pasta e abra-a no VS Code. Use Live Server na raiz da pasta (a mesma que contém `index.html`).
2. Abra `index.html`; confira a busca, filtros, favoritos, recentes e as calculadoras já existentes. Atualize a página para confirmar que favoritos permanecem salvos.
3. Em `ferramentas-extras.html`, teste taxa de cartão com venda R$ 100 e taxa 2,99% (líquido esperado R$ 97,01 sem taxa fixa), parcelas com juros zero e com juros, texto, senha, conversão 1 m = 100 cm, CSV válido/inválido, impressão e QR Code.
4. Em `central-ferramentas.html`, cadastre um produto, edite-o, defina estoque mínimo, registre entrada, registre saída e tente saída maior que o saldo (deve bloquear). Confira histórico, exclusão e CSV.
5. Baixe um backup JSON; cadastre um dado novo; restaure o backup e confirme que os dados correspondem à cópia. Teste um JSON inválido: deve ser recusado.
6. Teste as páginas no celular e computador. Confira os links, o formulário de contato e as páginas institucionais.
7. Depois de publicar no Cloudflare Pages, teste a URL pública de `sitemap.xml` e abra todas as páginas. Só então envie/atualize o sitemap no Search Console.

## Limitações conhecidas e importantes
- O QR Code carrega uma biblioteca de CDN externo e exige conexão com a internet. Não use dados sensíveis no conteúdo do QR.
- “Salvar como PDF” usa a janela de impressão do navegador; não faz edição, junção ou compressão de PDFs.
- O leitor CSV é uma prévia simples e presume a primeira linha como cabeçalho ao exportar JSON; confirme arquivos com formatos especiais.
- O leitor XML mostra campos comuns de NF-e, não valida assinatura digital, autorização da SEFAZ nem garante compatibilidade com todo XML fiscal.
- Consultas fiscais são orientativas e não substituem análise da operação nem fonte oficial/contador. Não use a página como fonte única para parametrizar tributação.
- Armazenamento é local por navegador/dispositivo. Não sincroniza entre dispositivos e pode ser apagado ao limpar os dados do navegador. Faça backup.
- Nenhum ID de AdSense foi inventado ou adicionado. A aprovação do AdSense não é garantida; revise conteúdo original, consentimento/privacidade e políticas antes de solicitar.
- A verificação automatizada de sintaxe, links e sitemap não substitui os testes manuais de navegador. O ambiente desta preparação bloqueou a automação completa do navegador; por isso, é importante seguir a lista acima.
