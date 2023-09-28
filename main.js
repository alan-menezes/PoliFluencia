// Objeto de textos em espanhol
const textosEspanhol = {
    "Quién es el “Niño Guerrero”, el líder del Tren de Aragua que controlaba la cárcel de Tocorón": "Es catalogado como uno de los hombres más peligrosos de Venezuela Héctor Guerrero Flores, más conocido como el “Niño Guerrero”, es el cabecilla del Tren de Aragua, el mayor grupo de crimen organizado del país y uno de los más importantes de América Latina. Su centro de operaciones era la cárcel de Tocorón, ubicada a unos 140 kilómetros al suroeste de Caracas, que este miércoles fue intervenida por miles de policías y militares con el fin de desarticular a las bandas criminales.Las autoridades venezolanas aseguraron que lograron tomar el control total de la prisión, sin embargo, no precisaron qué ocurrió con los líderes de la organización criminal.",
    "Cómo reconfiguré mi cerebro en 6 semanas": "Cada vez hay más pruebas de que cambios simples y cotidianos en nuestra vida pueden alterar nuestro cerebro y cambiar su funcionamiento. Melissa Hogenboom, periodista de la BBC, sometió su propio cerebro a un escaneo para averiguarlo.'Es sorprendentemente difícil no pensar en nada en absoluto', pienso mientras estoy recostada dentro de las fauces de una máquina que escanea mi cerebro. Me dicen que me concentre en una cruz negra mientras la máquina de imágenes de resonancia magnética funcional (IRMf) hace su ruidoso trabajo. También me resulta imposible mantener los ojos abiertos. El zumbido del escáner es algo hipnótico y me preocupa un poco quedarme dormida y que esto afecte cómo aparezca mi cerebro en las imágenes resultantes.",
    "La conmovedora lucha del músico Luciano Supervielle para que su hija con acondroplasia reciba medicación en Uruguay": "Giras internacionales, conciertos en Europa, proyectos como solista: la carrera del músico uruguayo Luciano Supervielle iba en pleno ascenso cuando a su esposa le diagnosticaron cáncer. Y todo cambió.Supervielle interrumpió su vida profesional para darle prioridad a la salud de Eloísa, cuyo fallecimiento dos años después en 2020 aún recuerda conmovido, y al cuidado de sus dos hijos que viven con él en Montevideo.Esto ha implicado difíciles retos: Julián, de 11 años, tiene síndrome de Down, y Nina, de 9, padece acondroplasia.",
    "La maestra que cada día recorre 200 kilómetros haciendo autostop para dar clase a dos niños en medio del campo en Uruguay": "Al borde de la carretera, donde comienza la ruta 56, con su bata blanca puesta para que identifiquen que es maestra, estira el brazo derecho y muestra su mano. Son las 8 de una gélida mañana de invierno y María Domínguez (29 años) está en la entrada de la pequeña ciudad de Florida, 90 kilómetros al norte de Montevideo, intentando que algún chofer se detenga y le ofrezca un aventón. Tiene que estar antes de las 10 en la escuela rural de Paso de la Cruz del Yí, a 108 kilómetros de su casa, en medio de la nada, para darles clases a Juliana, de 4 años, y a Benjamín, de 9, los únicos dos alumnos de ese centro educativo uruguayo."
    // Adicione mais textos conforme necessário
};

// Função para escolher um texto aleatório em espanhol
function gerarTextoEspanholAleatorio() {
    const chaves = Object.keys(textosEspanhol);
    const textoAleatorio = textosEspanhol[chaves[Math.floor(Math.random() * chaves.length)]];
    return textoAleatorio;
}

// Função para atualizar o conteúdo das tags h2 e p com texto em espanhol
function atualizarTextoAleatorio() {
    const titulo = document.getElementById("titulo");
    const texto = document.getElementById("texto");
    const textoAleatorio = gerarTextoEspanholAleatorio();

    titulo.textContent = Object.keys(textosEspanhol).find(key => textosEspanhol[key] === textoAleatorio);
    texto.textContent = textoAleatorio;
}
let reproduzindo = false;
// Variáveis para gravar áudio
let mediaRecorder;
let audioChunks = [];
let audio = null;

// Função para iniciar a gravação de áudio
function iniciarGravacao() {
    if (!mediaRecorder) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = function (event) {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };
                mediaRecorder.start();
                console.log("Gravação de voz do usuário iniciada");
                document.getElementById("btnGravar").disabled = true;
                document.getElementById("btnPararReproduzir").disabled = false;
            })
            .catch(function (error) {
                console.error("Erro ao iniciar a gravação: " + error);
            });
    } else {
        pararGravacaoEReproduzir();
    }
}

// Função para parar a gravação e reproduzir o áudio gravado
function pararGravacaoEReproduzir() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        console.log("Gravação de voz do usuário encerrada");
        mediaRecorder.onstop = function () {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            const audioUrl = URL.createObjectURL(audioBlob);
            audio = new Audio(audioUrl);
            audio.play();
            console.log("Reproduzindo gravação de voz do usuário");
            audioChunks = [];

            document.getElementById("btnGravar").disabled = false;
            document.getElementById("btnPararReproduzir").disabled = true;
        };
    } else if (audio) {
        audio.pause();
        console.log("Reprodução de voz do usuário pausada");
    }
}

// Função para ouvir o texto gerado em espanhol
function ouvirTexto() {
    const texto = document.getElementById("texto").textContent;
    const utterance = new SpeechSynthesisUtterance(texto);

    // Define a voz em espanhol (espanhol da Espanha)
    utterance.voice = window.speechSynthesis.getVoices().find(voice => voice.lang === "es-ES");

    if (reproduzindo) {
        speechSynthesis.pause();
        reproduzindo = false;
        console.log("Reprodução do áudio do texto pausada");
    } else {
        speechSynthesis.speak(utterance);
        reproduzindo = true;
        console.log("Reproduzindo áudio do texto");
    }
}

// ...

// Adicione um event listener para quando a reprodução de áudio terminar
if (audio) {
    audio.addEventListener("ended", function () {
        reproduzindo = false;
        document.getElementById("btnOuvir").disabled = false; // Reativa o botão quando a reprodução terminar
    });
}

// Chama a função para exibir um texto aleatório inicialmente
document.addEventListener("DOMContentLoaded", function () {
    atualizarTextoAleatorio();
});
