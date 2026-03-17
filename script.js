// 1. SUA CHAVE DISFARÇADA (Base64)
const CHAVE_DISFARÇADA = 'ZjQ1ZDhiZDExNjUwODc5ZTY0MzgyZWYyODU5MWIyODE='; 

const descriptografar = (texto) => atob(texto);

let paginaAtual = 1;

async function buscarNoticias(pagina = 1) {
    const feed = document.getElementById('feed-noticias');
    const btn = document.getElementById('btn-proxima');
    const chaveReal = descriptografar(CHAVE_DISFARÇADA);
    
    if (btn) btn.innerText = "VIRANDO A PÁGINA...";

    // URL usando Top Headlines de Entretenimento
    const apiURL = `https://gnews.io/api/v4/top-headlines?category=entertainment&lang=pt&country=br&max=10&page=${pagina}&apikey=${chaveReal}`;
    const endpoint = `https://api.allorigins.win/get?url=${encodeURIComponent(apiURL)}`;

    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        const data = JSON.parse(result.contents);

        if (data.articles && data.articles.length > 0) {
            // A MUDANÇA ESTÁ AQUI: Sempre limpa o feed antes de mostrar as novas
            feed.innerHTML = ''; 
            
            renderizar(data.articles);
            
            if (btn) btn.innerText = "Virar a Página (Ver mais)";
            
            // Rola a página de volta para o topo para o leitor ler a nova página
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } else {
            if (btn) btn.innerText = "Fim das fofocas por hoje!";
            if (pagina === 1) feed.innerHTML = "<h3>Nenhuma fofoca encontrada!</h3>";
        }
    } catch (error) {
        if (btn) btn.innerText = "ERRO AO VIRAR A PÁGINA";
    }
}

function renderizar(artigos) {
    const feed = document.getElementById('feed-noticias');

    artigos.forEach((artigo) => {
        const card = document.createElement('article');
        card.innerHTML = `
            ${artigo.image ? `<img src="${artigo.image}" alt="Notícia">` : ''}
            <a href="${artigo.url}" target="_blank" style="text-decoration:none;">
                <h2 class="manchete-titulo">${artigo.title}</h2>
            </a>
            <p style="color:red; font-weight:bold; font-size:12px;">🔥 FONTE: ${artigo.source.name}</p>
            <p class="texto-jornal">${artigo.description}</p>
        `;
        feed.appendChild(card);
    });
}

// Função do Botão
window.proximaPagina = function() {
    paginaAtual++;
    buscarNoticias(paginaAtual);
}

// Início
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('data-atual').innerText = new Date().toLocaleDateString('pt-BR', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    buscarNoticias(1);
});