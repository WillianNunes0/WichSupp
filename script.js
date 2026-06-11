// Banco de dados dos suplementos cadastrados no sistema
const dbSuplementos = {
    "insanity": {
        nome: "Insanity (Growth)",
        betaAlanina: "2000 mg",
        arginina: "1000 mg",
        lTirosina: "500 mg",
        taurina: "1000 mg",
        cafeina: "300 mg",
        carbo: "1.5 g",
        perfil: "Estímulo Elevado e Pump Moderado"
    },
    "haze": {
        nome: "Haze (Growth)",
        betaAlanina: "2000 mg",
        arginina: "2000 mg",
        lTirosina: "0 mg (Não possui)",
        taurina: "1500 mg",
        cafeina: "400 mg",
        carbo: "0 g",
        perfil: "Foco Extremo e Altíssima Carga Estimulante"
    },
    "horus": {
        nome: "Horus (Max Titanium)",
        betaAlanina: "2000 mg",
        arginina: "1000 mg",
        lTirosina: "0 mg (Não possui)",
        taurina: "1000 mg",
        cafeina: "150 mg",
        carbo: "1.2 g",
        perfil: "Uso Diário / Estimulação Moderada"
    },
    "insane-clown": {
        nome: "Insane Clown (Demons Lab)",
        betaAlanina: "2500 mg",
        arginina: "3000 mg",
        lTirosina: "400 mg",
        taurina: "1000 mg",
        cafeina: "400 mg",
        carbo: "0.5 g",
        perfil: "Fórmula Hardcore Importada e Vasodilatação Intensa"
    },
    "insane-mad": {
        nome: "Insane Mad (Demons Lab)",
        betaAlanina: "3000 mg",
        arginina: "1500 mg",
        lTirosina: "600 mg",
        taurina: "1200 mg",
        cafeina: "350 mg",
        carbo: "0 g",
        perfil: "Resistência Muscular Prolongada e Nootrópicos altos"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initZoomModal();
    initComparador();
});

/**
 * FUNCIONALIDADE 1: Zoom da Tabela Nutricional 
 */
function initZoomModal() {
    const modalContainer = document.getElementById("zoom-modal-container");
    const modalImg = document.getElementById("img-modal-target");
    const btnClose = document.getElementById("btn-close-modal");
    const zoomButtons = document.querySelectorAll(".btn-zoom");

    zoomButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
           
            const cardElement = e.target.closest(".container-hover-img");
            if (cardElement) {
                const tabelaImg = cardElement.querySelector(".img-fundo");
                if (tabelaImg) {
                    modalImg.src = tabelaImg.src;
                    modalContainer.classList.remove("d-none");
                    document.body.style.overflow = "hidden";
                }
            }
        });
    });

    // Fechar modal ao clicar no 'X' ou fora da imagem
    const fecharModal = () => {
        modalContainer.classList.add("d-none");
        modalImg.src = "";
        document.body.style.overflow = "auto";
    };

    if (btnClose) btnClose.addEventListener("click", fecharModal);
    if (modalContainer) {
        modalContainer.addEventListener("click", (e) => {
            if (e.target === modalContainer) fecharModal();
        });
    }
}

/**
 * FUNCIONALIDADE 2: Mecanismo de Comparação de Componentes
 */
function initComparador() {
    const select1 = document.getElementById("suplemento1");
    const select2 = document.getElementById("suplemento2");
    const btnComparar = document.getElementById("btn-comparar-trigger");
    const wrapperResultado = document.getElementById("tabela-resultado-wrapper");
    const corpoTabela = document.getElementById("corpo-tabela-comparacao");
    const thSuplemento1 = document.getElementById("th-suplemento1");
    const thSuplemento2 = document.getElementById("th-suplemento2");
    const veredictoVencedor = document.getElementById("veredicto-vencedor");

    if (!btnComparar) return;

    btnComparar.addEventListener("click", () => {
        const prodId1 = select1.value;
        const prodId2 = select2.value;

        if (!prodId1 || !prodId2) {
            alert("Por favor, selecione dois suplementos diferentes para comparar.");
            return;
        }

        if (prodId1 === prodId2) {
            alert("Selecione produtos diferentes para uma análise correta.");
            return;
        }

        const p1 = dbSuplementos[prodId1];
        const p2 = dbSuplementos[prodId2];

        // Atualiza cabeçalhos da tabela
        thSuplemento1.textContent = p1.nome;
        thSuplemento2.textContent = p2.nome;

        // Estrutura as linhas de especificações mapeando as chaves do objeto
        const especificacoes = [
            { label: "Beta-alanina (Fadiga)", chave: "betaAlanina" },
            { label: "Arginina (Pump/Vasodilatação)", chave: "arginina" },
            { label: "L-Tirosina (Foco)", chave: "lTirosina" },
            { label: "Taurina (Performance)", chave: "taurina" },
            { label: "Cafeína (Energia)", chave: "cafeina" },
            { label: "Carboidratos", chave: "carbo" },
            { label: "Perfil de Ação Predominante", chave: "perfil" }
        ];

        // Monta o HTML dinamicamente
        let linhasHtml = "";
        especificacoes.forEach(esp => {
            linhasHtml += `
                <tr>
                    <td class="fw-semibold text-white-50">${esp.label}</td>
                    <td>${p1[esp.chave]}</td>
                    <td>${p2[esp.chave]}</td>
                </tr>
            `;
        });

        corpoTabela.innerHTML = linhasHtml;

        // Gera inteligência de veredicto baseado puramente em carga de estimulantes (Cafeína)
        const caf1 = parseInt(p1.cafeina);
        const caf2 = parseInt(p2.cafeina);
        let textoVeredicto = "";

        if (caf1 > caf2) {
            textoVeredicto = `💡 Veredicto: ${p1.nome} possui maior poder estimulante energético. Ideal para treinos exaustivos.`;
        } else if (caf2 > caf1) {
            textoVeredicto = `💡 Veredicto: ${p2.nome} entrega maior intensidade de foco e energia por dose ativa.`;
        } else {
            textoVeredicto = `💡 Veredicto: Ambos possuem bases de estimulação equivalentes. Decida pelo melhor preço ou perfil de aminoácidos!`;
        }

        veredictoVencedor.textContent = textoVeredicto;

        // Exibe a tabela suavizando com a remoção da classe utilitária do bootstrap
        wrapperResultado.classList.remove("d-none");
        
        // Scroll suave até o resultado gerado
        wrapperResultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}