track_one = Track.new(title: "Rockabilly Rules O.K.!")
track_one.audio.attach(io: File.open(Pathname(__dir__).join("../storage/seeds/rockabilly_rules.mp3")),
                       filename: "rockabilly_rules.mp3")
track_one.save

track_one = Track.new(title: "Skate & Create")
track_one.audio.attach(io: File.open(Pathname(__dir__).join("../storage/seeds/skate_and_create.mp3")),
                       filename: "skate_and_create.mp3")
track_one.save
