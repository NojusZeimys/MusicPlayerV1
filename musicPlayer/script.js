"Use strict";
// UI elements
const nameBox = document.querySelector(".song-name_box");
const disc = document.querySelector(".disk");
const creatorBox = document.querySelector(".song-creator_box");
const lengthBox = document.querySelector("song-length_box");
const nameMain = document.querySelector(".song-name_main");
const creatorMain = document.querySelector(".song-creator-main");
const thumbnailMain = document.querySelector(".song-cover_main");
const musicPlayer = document.querySelector(".music-src");
const playListContainer = document.querySelector(".playlist-container");
const currentSongContainer = document.querySelector(".now-playing-cotainer");
const mainPlaylistContainer = document.querySelector(".playlist_UI");
const controlsContainer = document.querySelector(".controls");
const songProgressContainer = document.querySelector(
  ".song-progress_container"
);
const songProgress = document.querySelector(".song-progress");
const volumeContainer = document.querySelector(".volume-container");
const volumeSelected = document.querySelector(".volume-selected");
const volumeIcon = document.querySelector(".volume-icon");
const time = document.querySelector(".time");
//buttons
const playPauseBtn = document.querySelector(".play-pause_btn_main");
const prewBtn = document.querySelector(".prew-btn");
const nextBtn = document.querySelector(".next-btn");
const volumeBtn = document.querySelector(".volume-btn");

class Song {
  id = "S" + Math.floor(Math.random() * 1000000) + 1;
  constructor(songName, songCreator, songSrc, songLength, thumbnail) {
    this.songName = songName;
    this.songCreator = songCreator;
    this.songSrc = songSrc;
    this.songLength = songLength;
    this.thumbnail = thumbnail;
  }
}

const popeIsARockStar = new Song(
  "POPE IS A ROCK STAR",
  "Sales",
  "music/popeIsARockstar.mp3",
  "3.03",
  "./images/musicTumbnails/PopeIsARockstar.jpg"
);

const ladbrokeGrove = new Song(
  "LADBROKE GROVE",
  "AJ Tracey",
  "music/LadbrokeGrove.mp3",
  "3.12",
  "./images/musicTumbnails/landbrokeGrove.jpg"
);

const youAndI = new Song(
  "YOU & I",
  "Bru-C",
  "music/You&I.mp3",
  "2.57",
  "./images/musicTumbnails/You&I.jpg"
);

// ----------------APP--------------------
class App {
  #songs = [popeIsARockStar, ladbrokeGrove, youAndI];
  #activeSong;
  #activeSongEl;
  #isPaused;
  #isMuted = false;
  #volume = 0.5;
  constructor() {
    this._loadPage();

    //event listeners
    mainPlaylistContainer.addEventListener("click", this._eCallback.bind(this));
    playPauseBtn.addEventListener("click", this._playPauseSong.bind(this));
    prewBtn.addEventListener("click", this._prewSong.bind(this));
    nextBtn.addEventListener("click", this._nextSong.bind(this));
    songProgressContainer.addEventListener(
      "click",
      this._setProgress.bind(this)
    );
    volumeBtn.addEventListener("mouseover", this._openVolumeUI.bind(this));
    volumeBtn.addEventListener("click", this._mute.bind(this));
    volumeContainer.addEventListener("click", this._setVolume.bind(this));
    window.addEventListener("click", this._closeVolumeUI);
  }

  _loadPage() {
    musicPlayer.volume = 0.5;
    this.#songs.forEach((song) => this._createSongBox(song));
    this._setCurrentSong(document.getElementById(`${this.#songs[0].id}`));
    document.getElementById(`${this.#songs[0].id}`).classList.add("fa-play");
  }
  // mainPlayContainer event listener function listens for all song buttons in playlist
  _eCallback(e) {
    e.preventDefault;
    const element = e.target;
    if (element.classList.contains("play-pause_btn")) {
      this._setCurrentSong(element);
      this._playPauseSong(element);
    }
  }

  _setProgress(e) {
    const fullLength = songProgressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = musicPlayer.duration;
    musicPlayer.currentTime = Math.floor((clickX / fullLength) * duration);
  }

  _updateProgress(fullLength) {
    const update = function () {
      {
        const fullLength = songProgressContainer.clientWidth;
        songProgress.style.width = `${
          (musicPlayer.currentTime / musicPlayer.duration) * fullLength
        }px`;
        this._setTime();
        if (musicPlayer.ended) this._nextSong();
      }
    };
    setInterval(update.bind(this), 100);
  }

  _setTime() {
    const durationMin = Math.floor(musicPlayer.duration / 60).toString();
    const durationsec = Math.floor(musicPlayer.duration % 60).toString();
    const progressMin = Math.floor(musicPlayer.currentTime / 60).toString();
    const progressSec = Math.floor(musicPlayer.currentTime % 60).toString();

    time.textContent = `${progressMin.padStart(2, "0")}:${progressSec.padStart(
      2,
      "0"
    )}/${durationMin.padStart(2, "0")}:${durationsec.padStart(2, "0")}`;
    //console.log(musicPlayer.duration);
  }
  _openVolumeUI() {
    if (this.#isMuted === true) return;
    volumeContainer.classList.remove("hide");
  }
  _closeVolumeUI(e) {
    console.log(e.target);
    if (
      e.target.classList.contains("volume-selected") ||
      e.target.classList.contains("volume-container") ||
      e.target.classList.contains("volume-icon")
    )
      return;
    volumeContainer.classList.add("hide");
  }
  _mute() {
    if (this.#isMuted === false) {
      musicPlayer.volume = 0;
      this._muteUI();
      this.#isMuted = true;
    } else if (this.#isMuted === true) {
      musicPlayer.volume = this.#volume;
      this._muteUI();
      this.#isMuted = false;
    }
  }
  _setVolume(e) {
    const fullLength = volumeContainer.clientWidth;
    const clickX = e.offsetX;
    this.#volume = (clickX / fullLength).toFixed(2);
    musicPlayer.volume = this.#volume;
    volumeSelected.style.width = `${clickX}px`;
    if (this.#volume <= 0.01) {
      musicPlayer.volume = 0;
      this.#isMuted = true;
      volumeIcon.classList = "volume-icon fa-solid fa-volume-xmark fa-2x";
    } else {
      volumeIcon.classList = "volume-icon fa-solid fa-volume-low fa-2x";
      this.#isMuted = false;
    }
  }

  _muteUI() {
    if (this.#isMuted === false) {
      volumeIcon.classList = "volume-icon fa-solid fa-volume-xmark fa-2x";
      volumeContainer.classList.add("hide");
    } else if (this.#isMuted === true) {
      volumeIcon.classList = "volume-icon fa-solid fa-volume-low fa-2x";
      volumeContainer.classList.remove("hide");
    }
  }

  _playPauseSong(element) {
    this.#isPaused = musicPlayer.paused;
    this.#isPaused ? this._playSong(element) : this._pauseSong(element);
    console.log("asd");
  }

  _playSong(element) {
    musicPlayer.play();

    //add spining animation to thumbnail
    disc.classList.add("spin-animation");
    disc.classList.remove("paused");

    //thumbnailMain.classList.add("spin-animation");
    //thumbnailMain.classList.remove("paused");
    const icon = this.#activeSongEl.querySelector("i");
    icon.classList.add("fa-pause");
    icon.classList.remove("fa-play");
    playPauseBtn.querySelector("I").classList.add("fa-pause");
    playPauseBtn.querySelector("I").classList.remove("fa-play");
  }

  _pauseSong(element) {
    musicPlayer.pause();
    disc.classList.add("paused");
    //thumbnailMain.classList.add("paused");
    const icon = this.#activeSongEl.querySelector("i");
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
    playPauseBtn.querySelector("I").classList.remove("fa-pause");
    playPauseBtn.querySelector("I").classList.add("fa-play");
  }

  //prew btn callback sets prew song as current
  _prewSong() {
    let index =
      this.#songs.findIndex((song) => song.id === this.#activeSong.id) - 1;

    if (index < 0) {
      index = this.#songs.length - 1;
    }
    this.#activeSong = this.#songs[index];

    this._renderCurrentSong(this.#activeSong);
    this.#activeSongEl = currentSongContainer
      .querySelector(`#${this.#activeSong.id}`)
      .closest(".song-box");
    console.log(this.#activeSongEl);
    this._playSong();
  }

  _nextSong() {
    let index =
      this.#songs.findIndex((song) => song.id === this.#activeSong.id) + 1;

    if (index > this.#songs.length - 1) {
      index = 0;
    }
    this.#activeSong = this.#songs[index];

    this._renderCurrentSong(this.#activeSong);
    this.#activeSongEl = currentSongContainer
      .querySelector(`#${this.#activeSong.id}`)
      .closest(".song-box");
    this._playSong();
  }

  //set current song when play button in playlist is clicked
  _setCurrentSong(element) {
    console.log(element);
    if (!element.id) return;
    const clickedSong = this.#songs.find((song) => song.id === element.id);
    //Makes sure only new song are rendered and old song is just left
    if (this.#activeSong !== clickedSong) {
      this.#activeSong = clickedSong;
      this._renderCurrentSong(this.#activeSong, element);
      const clickedSongEl = currentSongContainer
        .querySelector(`#${this.#activeSong.id}`)
        .closest(".song-box");
      this.#activeSongEl = clickedSongEl;
      console.log(clickedSongEl);
    }
  }

  _autoplay() {
    if (musicPlayer.ended) {
      this._nextSong();
    }
  }
  // creates song box in playlist or now playinng sections
  _createSongBox(song, current = false) {
    const html = `
        <div class="song-box"  style="background: url(${
          song.thumbnail
        }) no-repeat right
        center;  background-size: 40%, 100%;">
            <div class="song-info_box">
              <h4 class="song-name_box">${song.songName}</h4>
              <div class="second-info_box">
                <h5 class="song-creator_box">${song.songCreator}</h5>
                <h6 class="song-length_box">${song.songLength}</h6>
              </div>
            </div>
            <button>
              <i class="fa-solid ${
                current ? "fa-pause" : "fa-play"
              } fa-2xl play-pause_btn ${current}" id="${song.id}"></i>
            </button>
          </div>
    `;

    current
      ? currentSongContainer.insertAdjacentHTML("beforeend", html)
      : playListContainer.insertAdjacentHTML("beforeend", html);
  }

  // updates Ui to current song
  _renderCurrentSong(song) {
    currentSongContainer.innerHTML = `<h2 class="now-Playing_title">Now playing</h2>`;
    this._createSongBox(song, true);
    //remove active song from playlist
    if (playListContainer.querySelector(`#${this.#activeSong.id}`)) {
      playListContainer
        .querySelectorAll(".song-box")
        .forEach((box) => box.classList.remove("hide"));
      playListContainer
        .querySelector(`#${this.#activeSong.id}`)
        .closest(".song-box")
        .classList.add("hide");
    }

    //renders player img and text with current song
    thumbnailMain.src = song.thumbnail;
    nameMain.textContent = song.songName;
    creatorMain.textContent = song.songCreator;

    //set song src to current song
    musicPlayer.src.includes(song.songSrc)
      ? 0
      : (musicPlayer.src = song.songSrc);

    //update progress interval
    this._updateProgress();
  }
}

const app = new App();
