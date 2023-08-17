const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");
const rangeFill = document.querySelector(".range-fill");
const volumeFill = document.querySelector(".volume-fill")

const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
  let music = player.getMusic();
  displayMusic(music);
  displayMusicList(player.musicList);
  isPlayingNow();
});

function displayMusic(music) {
  title.innerText = music.getName();
  singer.innerText = music.singer;
  image.src = "img/" + music.img;
  audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
  const isMusicPlay = container.classList.contains("playing");
  isMusicPlay ? pauseMusic() : playMusic();
});

prev.addEventListener("click", () => {
  prevMusic();
});

next.addEventListener("click", () => {
  nextMusic();
});

function prevMusic() {
  player.prev();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlayingNow();
}

function nextMusic() {
  player.next();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlayingNow();
}

function pauseMusic() {
  container.classList.remove("playing");
  play.querySelector("i").classList = "bx bx-play-circle";
  audio.pause();
}
function playMusic() {
  container.classList.add("playing");
  play.querySelector("i").classList = "bx bx-pause-circle";
  audio.play();
}

const calculateTime = (toplamSaniye) => {
  const dakika = Math.floor(toplamSaniye / 60);
  const saniye = Math.floor(toplamSaniye % 60);
  const guncellenenSaniye = saniye < 10 ? `0${saniye}` : `${saniye} `;
  const sonuc = `${dakika}:${guncellenenSaniye}`;
  return sonuc;
};

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = calculateTime(audio.duration);
  progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  progressBar.value = Math.floor(audio.currentTime);
  currentTime.textContent = calculateTime(progressBar.value);

  // rangeFill.style.width = ;
  rangeFill.style.setProperty(
    "width",
    `calc(${
      (Math.floor(audio.currentTime) / Math.round(audio.duration)) * 100 + "%"
    } + 2px)`
  );

   //volume-fill
 volumeFill.style.setProperty(
  "width",
  `calc(${
    (Math.floor(audio.currentTime) / Math.round(audio.duration)) * 100 + "%"
  } + 2px)`
);



});






progressBar.addEventListener("input", () => {
  currentTime.textContent = calculateTime(progressBar.value);
  audio.currentTime = progressBar.value;
});

let muteState = "sesli";

volumeBar.addEventListener("input", (e) => {
  const value = e.target.value;
  audio.volume = value / 100;
  if (value == 0) {
    audio.muted = true;
    muteState = "sessiz";
    volume.classList.remove("bxs-volume-full"); // ben önce kaldırıp sonra istedğimiz classı ekledim ama direktte = ile ekleyebilirsin çünkü direk ona eşit olur.
    volume.classList.add("bxs-volume-mute");
    // volumeBar.value = 0;
  } else {
    audio.muted = false;
    muteState = "sesli";
    volume.classList.remove("bxs-volume-mute");
    volume.classList.add("bxs-volume-full");
    // volumeBar.value = 100;
  }

 
});

volume.addEventListener("click", () => {
  if (muteState === "sesli") {
    audio.muted = true;
    muteState = "sessiz";
    volume.classList.remove("bxs-volume-full"); // ben önce kaldırıp sonra istedğimiz classı ekledim ama direktte = ile ekleyebilirsin çünkü direk ona eşit olur.
    volume.classList.add("bxs-volume-mute");
    volumeBar.value = 0;
  } else {
    audio.muted = false;
    muteState = "sesli";
    volume.classList.remove("bxs-volume-mute");
    volume.classList.add("bxs-volume-full");
    volumeBar.value = 100;
  }
});

const displayMusicList = (list) => {
  for (let i = 0; i < list.length; i++) {
    let liTag = `
                    <li li-index=${i} onclick= "selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                         <span>${list[i].getName()}</span>
                         <span id="music-${i}" class="badge bg-primary rounded-pill">3:40</span>
                         <audio class="music-${i}" src="mp3/${
      list[i].file
    }"></audio>
                    </li>
          `;

    ul.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ul.querySelector(`#music-${i}`);
    let liAudioTag = ul.querySelector(`.music-${i}`);

    liAudioTag.addEventListener("loadeddata", () => {
      liAudioDuration.innerText = calculateTime(liAudioTag.duration);
    });
  }
};

const selectedMusic = (li) => {
  player.index = li.getAttribute("li-index");
  displayMusic(player.getMusic());
  playMusic();
  isPlayingNow();
};

const isPlayingNow = () => {
  for (let li of ul.querySelectorAll("li")) {
    if (li.classList.contains("playing")) {
      li.classList.remove("playing");
    }

    if (li.getAttribute("li-index") == player.index) {
      li.classList.add("playing");
    }
  }
};

audio.addEventListener("ended", () => {
  nextMusic();
});
