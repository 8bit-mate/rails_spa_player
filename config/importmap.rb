# Pin npm packages by running ./bin/importmap

pin "application"
pin "wavesurfer", to: "wavesurfer.esm.js"
pin "bootstrap", to: "bootstrap.bundle.min.js", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
