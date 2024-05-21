class AudioController < ApplicationController
  def fetch_audio
    key = params[:key]
    blob = ActiveStorage::Blob.find_by(key:, content_type: "audio/mpeg")

    redirect_to blob
  end
end
