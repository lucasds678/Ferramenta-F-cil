# SEO e publicação — Ferramenta Fácil

## Antes de publicar em um domínio próprio

1. Substitua links e referências de domínio de exemplo pelo domínio real.
2. Adicione uma URL canônica por página depois de saber o domínio definitivo.
3. Gere `sitemap.xml` com as URLs públicas reais (não publique URLs com `SEU-DOMINIO`).
4. Crie `robots.txt` apontando para o sitemap definitivo.
5. Cadastre o domínio no Google Search Console e envie o sitemap.
6. Confira no celular, valide links, formulários e acessibilidade.
7. Publique política de privacidade e contato, especialmente antes de usar publicidade ou ferramentas de terceiros.
8. Adicione conteúdo original e útil. SEO não garante indexação ou tráfego.

## Google Programmable Search Engine

1. Acesse https://programmablesearchengine.google.com/ e crie um mecanismo de pesquisa.
2. Configure quais sites o mecanismo pode pesquisar (a Web inteira ou uma seleção de domínios, conforme sua preferência).
3. Copie o ID do mecanismo, chamado `cx`.
4. Abra `js/config.js` e substitua `COLE_SEU_ID_CX_AQUI` pelo valor fornecido.
5. Teste a página `central-ferramentas.html` com internet ativa.

O elemento padrão do Google é gratuito e pode exibir anúncios. Sem o ID `cx`, a central mantém o botão que abre a pesquisa do Google em outra página. O mecanismo incorporado é fornecido pelo Google; os resultados externos não são lidos nem verificados automaticamente pelo Ferramenta Fácil.

## Armazenamento local

- Fluxo de caixa: `ferramentaFacil.cashFlow.v1`.
- Produtos: `ferramentaFacil.inventory.v1`.
- Lembretes: `ferramentaFacil.tasks.v1`.

Os dados são locais ao navegador/dispositivo. Faça backup regularmente. Importar um backup substitui os registros correspondentes no navegador atual.
