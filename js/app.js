import { iniciarMenu } from './components/menu.js';
import { iniciarFormularioContato } from './components/formulario.js';
import { iniciarCarrosseis } from './components/carrossel.js';
import { prepararImagens } from './components/imagens.js';
import { carregarConteudo } from './components/conteudo.js';
import { iniciarChatEducacional } from './components/chat-widget.js';

document.addEventListener('DOMContentLoaded', () => {
  prepararImagens();
  iniciarMenu();
  iniciarFormularioContato();
  iniciarCarrosseis();
  carregarConteudo();
  iniciarChatEducacional();
  atualizarAno();
});

function atualizarAno() {
  document.querySelectorAll('[data-current-year]').forEach((elemento) => {
    elemento.textContent = String(new Date().getFullYear());
  });
}
