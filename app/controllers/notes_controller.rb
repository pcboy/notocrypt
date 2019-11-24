class NotesController < ApplicationController

  def index
    if u = User.find_by(uid: params[:uid])
      puts u.notes
      return render json: u.notes.map(&:to_h)
    end
  end

  def create
    permitted = params.required(:note).permit(:nonce, :content)

    if u = User.find_by(uid: params[:uid])
      note = u.notes.create(nonce: permitted[:nonce], content: permitted[:content])
      return render json: note.to_h
    end

  end

end
