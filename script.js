const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong(); 
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = allMusic[indexNumb - 1].img;
  mainAudio.src = allMusic[indexNumb - 1].src;
}

//play music function
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//pause music function
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//prev music function
function prevMusic(){
  musicIndex--; //decremento de musicIndex por 1
  //si musicIndex es menor que 1, entonces musicIndex será la longitud de la matriz para que se reproduzca la última música
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

//next music function
function nextMusic(){
  musicIndex++; //incremento de musicIndex en 1
  //si musicIndex es mayor que la longitud de la matriz, musicIndex será 1 para que se reproduzca la primera música
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// evento de botón de reproducción o pausa
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
  //si isPlayMusic es verdadero, entonces llama a pausar música, de lo contrario, llama a reproducir música
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

//evento de botón de música anterior
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

//siguiente evento de botón de música
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// actualizar el ancho de la barra de progreso de acuerdo con la hora actual de la música
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; //reproduciendo la canción hora actual
  const duration = e.target.duration; // obtener la duración total de la canción en reproducción
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", ()=>{
    // actualizar la duración total de la canción
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ //si sec es menor que 10, agregue 0 antes
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // actualizar la hora actual de la canción en reproducción
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ //if sec is less than 10 then add 0 before it
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// actualizar la reproducción de la canción currentTime según el ancho de la barra de progreso
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; //obteniendo el ancho de la barra de progreso
  let clickedOffsetX = e.offsetX; // obteniendo el valor compensado x
  let songDuration = mainAudio.duration; //obteniendo la duración total de la canción
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); //llamar a la función reproducirMúsica
  playingSong();
});

//cambiar bucle, mezclar, repetir icono al hacer clic
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; // obteniendo esta etiqueta texto interno
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

// código de qué hacer después de que termine la canción
mainAudio.addEventListener("ended", ()=>{
  // lo haremos de acuerdo con los medios del icono si el usuario ha configurado el icono en
  // canción en bucle, luego repetiremos la canción actual y lo haremos en consecuencia
  let getText = repeatBtn.innerText; // obteniendo esta etiqueta texto interno
  switch(getText){
    case "repeat":
      nextMusic(); // llamando a la función nextMusic
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //configurando el tiempo actual del audio a 0
      loadMusic(musicIndex); //llamando a la función loadMusic con argumento, en el argumento hay un índice de la canción actual
      playMusic(); //calling playMusic function
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //generando índice/número aleatorio con rango máximo de longitud de matriz
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); //este bucle se ejecuta hasta que el siguiente número aleatorio no sea el mismo que el actual musicIndex
      musicIndex = randIndex; //pasando índicealeatorio a índicemusical
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//muestra la lista de música al hacer clic en el icono de la música
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// permite crear etiquetas li de acuerdo con la longitud de la matriz para la lista
for (let i = 0; i < allMusic.length; i++) {
  //pasemos el nombre de la canción, artista de la matriz
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); // insertando la etiqueta li dentro de ul

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ //si sec es menor que 10, agregue 0 antes
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //pasando la duración total de la canción
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //agregar atributo t-duration con valor de duración total
  });
}

// reproducir una canción en particular de la lista al hacer clic en la etiqueta li
function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      audioTag.innerText = audioTag.getAttribute("t-duration");
    }

    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}


//función particular en la que se hizo clic en li
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; // actualizando el índice de la canción actual con el índice li en el que se hizo clic
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}