// 1. SUA CHAVE DISFARÇADA
const CHAVE_DISFARÇADA = 'ZjQ1ZDhiZDExNjUwODc5ZTY0MzgyZWYyODU5MWIyODE='; 
const descriptografar = (texto) => atob(texto);

let paginaAtual = 1;

async function buscarNoticias(pagina = 1) {
    const feed = document.getElementById('feed-noticias');
    const btn = document.getElementById('btn-proxima');
    const chaveReal = descriptografar(CHAVE_DISFARÇADA);
    
    if (btn) btn.innerText = "BUSCANDO NOVIDADES...";

    // TRUQUE 1: Adicionamos um 'timestamp' (hora exata) para burlar o cache do navegador
    const timestamp = new Date().getTime();
    const apiURL = `https://gnews.io/api/v4/top-headlines?category=entertainment&lang=pt&country=br&max=12&page=${pagina}&apikey=${chaveReal}&t=${timestamp}`;
    const endpoint = `https://api.allorigins.win/get?url=${encodeURIComponent(apiURL)}`;

    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        const data = JSON.parse(result.contents);

        if (data.articles && data.articles.length > 0) {
            feed.innerHTML = '';
            
            // TRUQUE 2: Embaralhar as notícias para que a ordem mude sempre
            const noticiasEmbaralhadas = data.articles.sort(() => Math.random() - 0.5);
            
            renderizar(noticiasEmbaralhadas);
            if (btn) btn.innerText = "Virar a Página (Novas Fofocas)";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (btn) btn.innerText = "Sem mais fofocas no momento.";
        }
    } catch (error) {
        if (btn) btn.innerText = "ERRO AO ATUALIZAR";
    }
}

function renderizar(artigos) {
    const feed = document.getElementById('feed-noticias');

    artigos.forEach((artigo) => {
        const card = document.createElement('article');
        card.innerHTML = `
            <a href="${artigo.url}" target="_self">
                ${artigo.image ? `<img src="${artigo.image}" alt="Notícia">` : ''}
            </a>
            <a href="${artigo.url}" target="_self" class="manchete-titulo">
                ${artigo.title}
            </a>
            <p style="color:red; font-weight:bold; font-size:12px;">🔥 FONTE: ${artigo.source.name}</p>
            <p class="texto-jornal">${artigo.description}</p>
        `;
        feed.appendChild(card);
    });
}

window.proximaPagina = function() {
    paginaAtual++;
    buscarNoticias(paginaAtual);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('data-atual').innerText = new Date().toLocaleDateString('pt-BR', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    buscarNoticias(1);
});