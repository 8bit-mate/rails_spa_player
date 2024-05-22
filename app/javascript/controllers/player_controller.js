import { Controller } from "@hotwired/stimulus"

import WaveSurfer from "wavesurfer"

export default class extends Controller {
  static targets = [ "title", "waveForm", "eq", "button" ];

  trackKey = null;
  audio = document.getElementById("audioElement");
  audioContext = new AudioContext();

  initialize() {
    console.log("Player controller initialized.");

    this.createEqualizer();

    document.addEventListener("turbo:load", (event) => {
      this.updateBtnState();
    });

    this.buttonTarget.disabled = true;
  }

  connect() {
    console.log("Player controller connected.");
  }

  updateBtnState() {
    if (this.audio.paused) {
      this.setBtnPause();
    } else {
      this.setBtnPlay();
    }
  }

  setBtnPause() {
    let btn = document.getElementById(this.trackKey);
    if (btn) { btn.innerText = "Play" };
    this.buttonTarget.innerText = "Play";
  }

  setBtnPlay() {
    let btn = document.getElementById(this.trackKey);
    if (btn) { btn.innerText = "Pause" };
    this.buttonTarget.innerText = "Pause";
  } 

  activate(event) {
    let target = event.detail.target;
    let trackKey = target.dataset.trackKey;
    this.titleTarget.innerText = target.dataset.title;
    this.buttonTarget.disabled = false;

    if (this.trackKey == trackKey) {
      this.handleSameTrack(event);
    } else {
      this.handleNewTrack(trackKey);
    }
  }

  handleSameTrack(event) {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  handleNewTrack(trackKey) {
    this.setBtnPause();

    this.trackKey = trackKey;

    fetch("/fetch_audio?key=" + trackKey)
    .then(response => response.blob())
    .then(blob => {
        this.audio.src = URL.createObjectURL(blob);
        this.audio.load();
        this.audio.play();
        //this.audio.controls = "controls";
        this.audioContext.resume();
    })
    .catch(console.error);

    this.audio.addEventListener("ended", (event) => {
      this.setBtnPause();
    });

    this.audio.addEventListener("play", (event) => {
      this.setBtnPlay();
    });

    this.audio.addEventListener("pause", (event) => {
      this.setBtnPause();
    });

    this.audio.addEventListener("canplay", (event) => {
      this.waveFormTarget.innerHTML = "";

      const wavesurfer = WaveSurfer.create({
        container: this.waveFormTarget,
        waveColor: "rgb(200, 0, 200)",
        progressColor: "rgb(100, 0, 100)",
        height: "60",
        media: this.audio,
      })
  
    }, { once: true });
  }

  createEqualizer() {
    // Define the equalizer bands (Hz)
    const eqBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

    const filters = eqBands.map((band) => {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = band <= 32 ? "lowshelf" : band >= 16000 ? "highshelf" : "peaking";
      filter.gain.value = 0;
      filter.Q.value = 1; // resonance
      filter.frequency.value = band; // the cut-off frequency
      return filter;
    })

    const mediaNode = this.audioContext.createMediaElementSource(this.audio);

    // Connect the filters and media node sequentially
    const equalizer = filters.reduce((prev, curr) => {
      prev.connect(curr);
      return curr;
    }, mediaNode);

    // Connect the filters to the audio output
    equalizer.connect(this.audioContext.destination);

    this.eqTarget.innerHTML = "";

    filters.forEach((filter) => {
      this.createFilterSlider(filter);
    })
  }

  createFilterSlider(filter) {
    const slider = document.createElement("input");
    slider.type = "range";
    slider.style.width = "25em";
    slider.min = -15;
    slider.max = 15;
    slider.value = filter.gain.value;
    slider.step = 0.1;
    slider.oninput = (e) => (filter.gain.value = e.target.value);
    this.eqTarget.appendChild(slider);

    const label = document.createElement("span");
    label.innerText = `${filter.frequency.value} Hz`;
    this.eqTarget.appendChild(label);
  }
}
