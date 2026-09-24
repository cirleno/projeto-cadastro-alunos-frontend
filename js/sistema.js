(function (window) {
  'use strict';

  var STORAGE_KEY = 'sistema_cpe_alunos';
  var DATA_URL = 'data/alunos.json';
  var PAGE_SIZE = 5;

  var DADOS_INICIAIS = [
    { id: 1001, nome: 'X-Marçal', curso: 'Tecnólogo em Gestão da TI', dataInicio: '19/02/2012' },
    { id: 1002, nome: 'X-Marçal', curso: 'Freecodecamp', dataInicio: '01/06/2016' },
    { id: 1003, nome: 'X-Marçal', curso: 'IELTS', dataInicio: '19/09/2016' },
    { id: 1004, nome: 'X-Marçal', curso: 'Técnico em Eletrônica com ênfase em Telecomunicações', dataInicio: '22/12/1999' },
    { id: 1005, nome: 'X-Marçal', curso: 'Congresso de TI on-line', dataInicio: '01/06/2016' }
  ];

  function persistir() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DataStore._alunos));
    } catch (erro) {}
  }

  var DataStore = {
    _alunos: null,

    load: function () {
      if (DataStore._alunos) {
        return Promise.resolve(DataStore._alunos);
      }
      try {
        var salvo = localStorage.getItem(STORAGE_KEY);
        if (salvo) {
          DataStore._alunos = JSON.parse(salvo) || DADOS_INICIAIS.slice();
          return Promise.resolve(DataStore._alunos);
        }
      } catch (erro) {}
      if (typeof fetch !== 'function') {
        DataStore._alunos = DADOS_INICIAIS.slice();
        persistir();
        return Promise.resolve(DataStore._alunos);
      }
      return fetch(DATA_URL)
        .then(function (resposta) {
          if (!resposta.ok) { throw new Error('Falha ao carregar os dados.'); }
          return resposta.json();
        })
        .then(function (dados) {
          DataStore._alunos = dados;
          persistir();
          return DataStore._alunos;
        })
        .catch(function () {
          DataStore._alunos = DADOS_INICIAIS.slice();
          persistir();
          return DataStore._alunos;
        });
    },

    list: function () {
      return (DataStore._alunos || []).slice();
    },

    findById: function (id) {
      id = Number(id);
      var alunos = DataStore._alunos || [];
      for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id === id) { return alunos[i]; }
      }
      return null;
    },

    create: function (dados) {
      var alunos = DataStore.list();
      var maiorId = 1000;
      for (var i = 0; i < alunos.length; i++) {
        if (alunos[i].id > maiorId) { maiorId = alunos[i].id; }
      }
      var aluno = {
        id: maiorId + 1,
        nome: String(dados.nome || '').trim(),
        curso: String(dados.curso || '').trim(),
        dataInicio: String(dados.dataInicio || '').trim()
      };
      alunos.push(aluno);
      DataStore._alunos = alunos;
      persistir();
      return aluno;
    },

    update: function (id, dados) {
      var aluno = DataStore.findById(id);
      if (!aluno) { return null; }
      aluno.nome = String(dados.nome || '').trim();
      aluno.curso = String(dados.curso || '').trim();
      aluno.dataInicio = String(dados.dataInicio || '').trim();
      persistir();
      return aluno;
    },

    remove: function (id) {
      id = Number(id);
      DataStore._alunos = DataStore.list().filter(function (a) {
        return a.id !== id;
      });
      persistir();
    },

    search: function (termo) {
      termo = String(termo || '').trim().toLowerCase();
      if (!termo) { return DataStore.list(); }
      return DataStore.list().filter(function (a) {
        return a.nome.toLowerCase().indexOf(termo) !== -1 ||
               a.curso.toLowerCase().indexOf(termo) !== -1;
      });
    }
  };

  function escapeHtml(texto) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(texto == null ? '' : String(texto)));
    return div.innerHTML;
  }

  function validarDados(dados) {
    var erros = [];
    if (!dados.nome || !String(dados.nome).trim()) { erros.push('Informe o Nome Completo.'); }
    if (!dados.curso || !String(dados.curso).trim()) { erros.push('Informe o Curso.'); }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(String(dados.dataInicio || '').trim())) {
      erros.push('Informe a Data de Início no formato DD/MM/AAAA.');
    }
    return erros;
  }

  function obterParametro(nome) {
    var regex = new RegExp('[?&]' + nome + '=([^&]*)');
    var resultado = regex.exec(window.location.search);
    return resultado ? decodeURIComponent(resultado[1]) : null;
  }

  window.Sistema = {
    DataStore: DataStore,
    PAGE_SIZE: PAGE_SIZE,
    escapeHtml: escapeHtml,
    validarDados: validarDados,
    obterParametro: obterParametro
  };
})(window);