const mensagens = {
  nome: 'Informe seu nome.',
  email: 'Informe um e-mail válido.',
  assunto: 'Escolha um assunto.',
  mensagem: 'Escreva uma mensagem.'
};

export function iniciarFormularioContato() {
  const formulario = document.querySelector('#formContato');
  if (!formulario) return;

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const campos = ['nome', 'email', 'assunto', 'mensagem'];
    const valido = campos.every((campo) => validarCampo(formulario, campo));

    if (!valido) {
      const primeiroInvalido = formulario.querySelector('[aria-invalid="true"]');
      primeiroInvalido?.focus();
      return;
    }

    formulario.reset();
    formulario.classList.add('oculto');
    document.querySelector('#mensagemSucesso')?.classList.remove('oculto');
  });

  formulario.querySelectorAll('input, select, textarea').forEach((campo) => {
    campo.addEventListener('blur', () => validarCampo(formulario, campo.id));
    campo.addEventListener('input', () => limparErro(campo));
  });
}

function validarCampo(formulario, id) {
  const campo = formulario.querySelector(`#${id}`);
  if (!campo) return true;

  const valor = campo.value.trim();
  const emailValido = id !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  const valido = Boolean(valor) && emailValido;

  campo.setAttribute('aria-invalid', String(!valido));
  campo.setAttribute('aria-describedby', `erro-${id}`);

  const erro = formulario.querySelector(`#erro-${id}`);
  if (erro) erro.textContent = valido ? '' : mensagens[id];

  return valido;
}

function limparErro(campo) {
  campo.removeAttribute('aria-invalid');
  const erro = document.querySelector(`#erro-${campo.id}`);
  if (erro) erro.textContent = '';
}
