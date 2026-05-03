/* ============================================================
   script.js 
   Contém:
     1. Alternância de tema claro/escuro
     2. Menu hamburguer para mobile
     3. Destaque automático do link ativo ao fazer scroll
     4. Efeito de digitação (typing) na seção hero
     5. Animação das barras de idioma
     6. Animação de reveal ao fazer scroll
     7. Validação e simulação de envio do formulário
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. ALTERNÂNCIA DE TEMA (DARK / LIGHT MODE)
     - Ao clicar no botão, o JS altera a classe "light-mode" no <body>.
  ============================================================ */
  const toggle = document.getElementById('themeToggle');
  const icon   = toggle ? toggle.querySelector('.theme-icon') : null;
  const body   = document.body;
  /*
    document.body: Referência direta ao elemento <body> do HTML.
    É aqui que a classe "light-mode" será adicionada/removida
    para alternar o tema visualmente.
  */

  function aplicarTema() {
    /*Função que lê o tema salvo no localStorage e aplica ao DOM.*/
    const t = localStorage.getItem('tema') || 'dark';
    if (t === 'light') {
      body.classList.add('light-mode');
      if (icon) icon.textContent = '🌙';
      /* Troca o ícone do botão para lua (🌙) quando o tema claro está ativo,
        indicando que clicar novamente voltará ao tema escuro. */
    } else {
      body.classList.remove('light-mode');
      if (icon) icon.textContent = '☀';
      /*Ícone de sol (☀) quando o tema escuro está ativo, indicando que clicar mudará para o tema claro.*/
    }
  }

  aplicarTema();

  if (toggle) {
    toggle.addEventListener('click', function () {
      const atual = localStorage.getItem('tema') || 'dark';
      localStorage.setItem('tema', atual === 'dark' ? 'light' : 'dark');
      /* localStorage.setItem(chave, valor): Salva o novo tema*/
    });
  }

  /* ============================================================
     2. MENU HAMBURGUER (MOBILE)
     ============================================================
     Em telas pequenas (≤768px), o menu de navegação é ocultado por padrão (display:none).
     O botão hamburguer (três linhas) fica visível e, quando clicado,
     adiciona a classe "open" ao <nav>, que muda para display:flex
     e aparece como menu dropdown abaixo do header.
  ============================================================ */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav    = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });

    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header')) {
        mainNav.classList.remove('open');
      }
    });
  }

  /* ============================================================
     3. DESTAQUE DO LINK ATIVO AO FAZER SCROLL
     ============================================================
     Usa IntersectionObserver — uma API do navegador que
     notifica o JavaScript quando um elemento entra ou sai da viewport,
     SEM precisar ouvir o evento "scroll"
  ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        var active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ============================================================
     4. EFEITO DE DIGITAÇÃO (TYPING EFFECT) — SEÇÃO HERO
     ============================================================
     Simula um cursor digitando e apagando frases ciclicamente.
     A lógica usa uma única função recursiva (digitar()) com
     setTimeout para controlar o timing de cada caractere.
     O cursor piscante (|) é adicionado puramente em CSS com
     .hero-subtitle::after { content: '|'; animation: blink ... }
  ============================================================ */
  var typingEl = document.getElementById('typingText');

  if (typingEl) {
    var frases = [
      'Estudante de Ciência da Computação',
      'Desenvolvedor Web',
      'Apaixonado por Tecnologia',
      'Always learning 🚀'
    ];

    var fi = 0,   /* índice da frase atual no array frases[] */
        ci = 0,   /* índice do próximo caractere a ser digitado/apagado */
        apagando = false,  /* false = digitando | true = apagando */
        pausando = false;  /* true = aguardando antes de começar a apagar */

    function digitar() {
      if (pausando) return;

      var f = frases[fi];

      if (!apagando) {
        /* ─── MODO DIGITAÇÃO ─── */
        typingEl.textContent = f.substring(0, ++ci);
        if (ci === f.length) {
          pausando = true;
          setTimeout(function () {
            /*
              Pausa de 2000ms (2 segundos) antes de começar a apagar.
              Dá tempo para o usuário ler a frase.
            */
            pausando = false;
            apagando = true;
            digitar();
            /* Reinicia o ciclo agora no modo apagando. */
          }, 2000);
          return;
        }
        setTimeout(digitar, 70);
        /* Velocidade de digitação: 70ms por caractere*/
      } else {
        /* ─── MODO PARA APAGAR ─── */
        typingEl.textContent = f.substring(0, --ci);
        if (ci === 0) {
          apagando = false;
          fi = (fi + 1) % frases.length;
          setTimeout(digitar, 300);
          return;
        }
        setTimeout(digitar, 40);
        /*Velocidade de backspace: 40ms por caractere*/
      }
    }

    setTimeout(digitar, 900);
    /*Atraso inicial de 900ms antes de começar a digitar a primeira frase.*/
  }

  /* ============================================================
     5. ANIMAÇÃO DAS BARRAS DE IDIOMA
     ============================================================*/
  var barras = document.querySelectorAll('.idioma-progresso');

  if (barras.length) {
    var barraObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.width = e.target.getAttribute('data-width') + '%';
          barraObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    barras.forEach(function (b) { barraObserver.observe(b); });
    /* Inicia a observação de cada barra individualmente. */
  }

  /* ============================================================
     6. REVEAL ON SCROLL
     ============================================================*/
  var reveals = document.querySelectorAll('.reveal');
  /*
    Seleciona todos os elementos marcados com a classe "reveal"
    para receberem a animação de entrada ao fazer scroll.
  */

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(function (r) { revealObserver.observe(r); });
}); 


/* ============================================================
   7. VALIDAÇÃO E SIMULAÇÃO DE ENVIO DO FORMULÁRIO
   ============================================================*/
function validarFormulario() {
  /*
    Função global chamada ao clicar no botão "Enviar mensagem".
    Realiza validação dos três campos (nome, email, mensagem)
    e exibe mensagens de erro específicas para cada problema encontrado.
  */

  /* ── Captura os elementos do DOM ── */
  var nome  = document.getElementById('nome');
  var email = document.getElementById('email');
  var msg   = document.getElementById('mensagem');
  var eNome  = document.getElementById('erroNome');
  var eEmail = document.getElementById('erroEmail');
  var eMsg   = document.getElementById('erroMensagem');
  /*
    Busca os spans de erro associados a cada campo.
    São usados para exibir mensagens de erro específicas abaixo de cada input.
  */
  if (!nome || !email || !msg) return;
  /* ── Limpa erros de validações anteriores ── */
  [nome, email, msg].forEach(function (c, i) {
    c.classList.remove('erro');
    [eNome, eEmail, eMsg][i].textContent = '';

  });

  var valido = true;
  /* ── Captura e limpa os valores digitados ── */
  var nv = nome.value.trim();
  var ev = email.value.trim();
  var mv = msg.value.trim();

  /* ── Validação do nome ── */
  if (!nv) {
    errar(nome, eNome, 'Informe seu nome.');
    valido = false;
  } else if (nv.length < 3) {
    errar(nome, eNome, 'Nome deve ter pelo menos 3 caracteres.');
    valido = false;
  }

  /* ── Validação do e-mail ── */
  if (!ev) {
    errar(email, eEmail, 'Informe seu e-mail.');
    valido = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ev)) {
    /*Expressão regular para validar formato de e-mail*/
    errar(email, eEmail, 'E-mail inválido (ex: usuario@dominio.com).');
    valido = false;
  }

  /* ── Validação da mensagem ── */
  if (!mv) {
    errar(msg, eMsg, 'Escreva sua mensagem.');
    valido = false;
  } else if (mv.length < 10) {
    errar(msg, eMsg, 'Mensagem deve ter pelo menos 10 caracteres.');
    valido = false;
  }

  /* ── Simulação de envio (se tudo válido) ── */
  if (valido) {
    nome.value = email.value = msg.value = '';
    document.getElementById('formularioContato').style.display = 'none';
    document.getElementById('mensagemSucesso').style.display = 'block';
  }
}

/* ============================================================
   Função auxiliar: exibe erro em um campo
============================================================ */
function errar(campo, span, texto) {
  campo.classList.add('erro');
  span.textContent = texto;
}