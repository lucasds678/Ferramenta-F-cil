# Ferramenta Fácil — próximos passos para contato, domínio e AdSense

## 1. Ativar o formulário de contato

O formulário de `contato.html` está pronto visualmente, mas não envia mensagens até receber um endpoint válido. Isso é intencional: o projeto ainda não tem um e-mail público e nenhum serviço de formulário foi configurado.

1. Crie uma conta em https://formspree.io/ e cadastre um formulário para receber mensagens.
2. Confirme o endereço de recebimento solicitado pelo serviço.
3. Copie o endpoint do formulário, no formato `https://formspree.io/f/SEU_ID`.
4. Abra `js/config.js` e preencha `contactFormEndpoint` com o endpoint real.
5. Teste o envio publicado e confirme que a mensagem chega ao destino.
6. Revise a Política de Privacidade para identificar o Formspree e explicar o tratamento de dados pelo fornecedor antes de ativar o envio para visitantes.

Não publique um endpoint fictício. O formulário mostra um aviso explícito enquanto não estiver configurado.

## 2. Google AdSense

- Não foi inserido código de anúncio ou identificador fictício.
- Solicite o cadastro e a revisão do site em https://adsense.google.com/ quando o conteúdo e a experiência estiverem prontos.
- Após receber seu identificador real `ca-pub-...`, atualize `adsenseClientId` em `js/config.js` e siga as instruções fornecidas na própria conta do AdSense para instalar o código de anúncio.
- Não copie código de outro editor nem publique anúncios antes de seguir os requisitos do Google.
- Quando a publicidade for ativada, atualize a Política de Privacidade para descrever as tecnologias e escolhas de privacidade efetivamente usadas. Verifique também se é necessário configurar uma plataforma de gestão de consentimento para as regiões atendidas.
- O arquivo `ads.txt` deve ser criado apenas com a linha exata fornecida pela sua conta AdSense; não use valores de exemplo.

## 3. Publicação e SEO

1. Publique o site no Cloudflare Pages.
2. Anote o endereço público real `https://...pages.dev`.
3. Atualize/adicione o sitemap com as URLs públicas definitivas e envie-o no Google Search Console.
4. Teste todas as páginas, calculadoras, links, responsividade e formulário.
5. Verifique a política de privacidade depois de ativar qualquer serviço de terceiros.

## 4. Limitações importantes

- O conteúdo fiscal do site é inicial e não representa uma base completa ou validação automática de CFOP, NCM, CEST, CST/CSOSN ou regras tributárias.
- A aprovação no AdSense não é garantida por páginas institucionais; depende da análise do Google, do conteúdo e do cumprimento das políticas.
- O projeto não configura Analytics por padrão.
