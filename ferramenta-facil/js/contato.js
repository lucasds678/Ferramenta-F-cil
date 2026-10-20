document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#contactStatus");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const honeypot = form.querySelector('[name="website"]');
    if (honeypot?.value) return;

    const endpoint = window.FERRAMENTA_FACIL_CONFIG?.contactFormEndpoint?.trim();
    if (!endpoint || !/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint)) {
      status.classList.remove("error");
      status.textContent = "O formulário ainda não está conectado a um serviço de recebimento. Nenhuma mensagem foi enviada. Para ativá-lo, siga o arquivo CONFIGURAR-CONTATO-E-ADSENSE.md.";
      status.hidden = false;
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Enviando…";
    status.hidden = true;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });
      if (!response.ok) throw new Error("Falha ao enviar formulário");
      form.reset();
      status.classList.remove("error");
      status.textContent = "Mensagem enviada. Obrigado por entrar em contato.";
      status.hidden = false;
    } catch {
      status.classList.add("error");
      status.textContent = "Não foi possível enviar a mensagem agora. Confira a configuração do formulário ou tente novamente mais tarde.";
      status.hidden = false;
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
});
