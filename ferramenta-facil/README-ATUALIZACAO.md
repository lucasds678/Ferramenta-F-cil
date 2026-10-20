# Ferramenta Fácil — versão ampliada

## Como abrir

1. Extraia a pasta `ferramenta-facil`.
2. Abra a pasta no VS Code.
3. Use a extensão Live Server para abrir `index.html` e navegar entre as páginas. Também é possível abrir alguns arquivos diretamente, mas um servidor local simples tende a dar uma experiência mais consistente.

## Funcionalidades incluídas nesta versão

- Mantém as calculadoras, consultas fiscais, guia, Reforma Tributária e fluxo de caixa que já existiam.
- Adiciona `central-ferramentas.html` com busca local de conceitos, encaminhamento ao Google, pesquisas por domínio oficial, links governamentais, leitor local de XML, cadastro simples de estoque, lembretes e backup/restauração JSON.
- Adiciona exportação CSV do estoque.
- Adiciona notas para publicação e SEO em `SEO-PUBLICACAO.md`.

## Importante

- A busca local contém apenas um conjunto inicial de conceitos, não uma base fiscal completa.
- A pesquisa Google incorporada precisa do ID `cx` que você cria no Programmable Search Engine. Enquanto não configurar esse ID em `js/config.js`, o botão abre a pesquisa Google em outra aba.
- O leitor XML exibe campos comuns de NF-e/NFC-e; não valida assinatura, autorização ou tributação.
- Estoque, lembretes e fluxo de caixa são salvos no `localStorage` do navegador. Não sincronizam entre dispositivos.
- Calendário não determina vencimentos fiscais automaticamente nem envia notificações fora do site.
- Os simuladores tributários existentes são educativos e não substituem apuração fiscal.


## Preparação institucional para publicação

- Páginas adicionadas: `sobre.html`, `contato.html`, `privacidade.html` e `termos.html`.
- Rodapé padronizado com links institucionais.
- `robots.txt` adicionado; o sitemap deve ser concluído depois de definir o endereço público.
- O formulário de contato precisa de um endpoint Formspree real; veja `CONFIGURAR-CONTATO-E-ADSENSE.md`.
- Nenhum código ou ID fictício do AdSense foi inserido. Configure publicidade somente depois de receber o identificador real e seguir as instruções do Google.
- Revise a política de privacidade novamente antes de ativar serviços externos de formulário, Analytics ou AdSense.
