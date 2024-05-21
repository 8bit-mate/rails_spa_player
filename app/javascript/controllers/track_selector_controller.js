import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "button" ];

  connect() {
    console.log("Track selector controller connected.");
  }

  controlPlayback(event) {
    this.dispatch("select", { detail: { target: event.target } });
  }
}
