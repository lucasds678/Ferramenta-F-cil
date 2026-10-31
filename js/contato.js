document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#contactStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const honeypot = form.querySelector('[name="website"]');
    if (honeypot?.value) return;

    const recipient = window.FERRAMENTA_FACIL_CONFIG?.contactEmail;
    if (!recipient) {
      status.classList.add("error");
      status.textContent = "O canal de contato não está configurado. Nenhum e-mail foi preparado.";
      status.hidden = false;
      return;
    }

    const data = new FormData(form);
    const subject = `[Ferramenta Fácil] ${String(data.get("subject") || "Contato").trim()}`;
    const body = [
      `Nome: ${String(data.get("name") || "").trim()}`,
      `E-mail para resposta: ${String(data.get("email") || "").trim()}`,
      "",
      "Mensagem:",
      String(data.get("message") || "").trim()
    ].join("\\n");

    const mailto = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.classList.remove("error");
    status.textContent = "Seu aplicativo de e-mail será aberto com a mensagem preenchida. Revise e confirme o envio por lá.";
    status.hidden = false;
    window.location.href = mailto;
  });
});
