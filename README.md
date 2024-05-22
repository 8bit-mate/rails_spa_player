# Rails single-page app player

Example of a web application with a build-in audio player tweaked with a 10-band equalizer and a waveform graph.

The app acts like a single-page application, i.e. visiting different pages of the site doesn't affect the playback.

The app was build with the Ruby On Rails, [Hotwire](https://hotwired.dev/) (Turbo Frames + Stimulus), [Bootstrap 5](https://getbootstrap.com/), and the [Wavesurfer.js](https://wavesurfer.xyz/) lib.

## Deployment (development mode)
      $ git clone https://github.com/8bit-mate/rails_spa_player.git
      $ cd rails_spa_player
      $ bundle install
      $ rails db:migrate
      $ rails db:seed
      $ bin/rails server