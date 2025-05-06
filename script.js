let fifoClientes = [];

// Chamada para iniciar a tela
window.addEventListener('DOMContentLoaded', () => {
    filaClientesAdd('clientes.json');
    document.getElementById('posterFilme').style.display = 'none';
});

//FIFO de CLIENTES
async function filaClientesAdd(jsonPath) {
    try {
      const response = await fetch(jsonPath);
      const clientes = await response.json();
  
      // Embaralha os nomes e adiciona na fila
      const embaralhados = clientes.sort(() => Math.random() - 0.5);
      // Adiciona nomes à fila (FIFO)
      embaralhados.forEach(cliente => {
        fifoClientes.push(cliente.nome);
      });
  
      //console.log('Fila Cliente inicializada:', fifoClientes);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
    atualizarListas();
}
    
function filaClientesRemove() {
    if (fifoClientes.length === 0) {
        console.warn('Fila vazia');
        return undefined;
    }

    const clienteRemovido = fifoClientes.shift();
    console.log(`Cliente removido da fila: ${clienteRemovido}`);
    return clienteRemovido;
}
//
  
document.getElementById('entrarBtn').addEventListener('click', async () => {
  try {

    //Clientes
    const cliente = filaClientesRemove();
    
    // Filmes
    const filmesResponse = await fetch('filmesEmCartaz.json');
    const filmes = await filmesResponse.json();
    const objFilme = filmes[Math.floor(Math.random() * filmes.length)];
    const nomeFilme = objFilme.nome;
    //
    // Consultar a API OMDb usando o nome do filme
    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(nomeFilme)}&apikey=742a0ee`;
    const filmeResponse = await fetch(apiUrl);
    const dadosFilme = await filmeResponse.json();

    // Verifica se o filme foi encontrado
    if (dadosFilme.Response === "False") {
      document.getElementById('nomeFilme').textContent = `Filme não encontrado: ${nomeFilme}`;
      document.getElementById('posterFilme').style.display = 'none';
      return;
    }

    // Atualiza a tela
    document.getElementById('nomePessoa').textContent = cliente;
    document.getElementById('nomeFilme').textContent = dadosFilme.Title;
    document.getElementById('anoFilme').textContent = dadosFilme.Year;

    const poster = document.getElementById('posterFilme');
    poster.src = dadosFilme.Poster;
    poster.alt = `Poster do filme ${dadosFilme.Title}`;
    poster.style.display = 'block';

  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
  
  atualizarListas();
});

// Atualiza a lista de clientes na tela
function atualizarListas() {
  const olClientes = document.getElementById('listaClientes');
  olClientes.innerHTML = '';
  fifoClientes.forEach(cliente => {
    const li = document.createElement('li');
    li.textContent = cliente;
    olClientes.appendChild(li);
  });
}


  