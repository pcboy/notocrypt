class NotesController < ApplicationController

  before_action :check_auth

  def index
    if u = User.find_by(uid: session[:uid])
      return render json: u.notes.map(&:to_h)
    end
    return render json: []
  end

  def create
    permitted = params.required(:note).permit(:nonce, :ciphertext)

    if u = User.find_by(uid: session[:uid])
      note = u.notes.create(nonce: permitted[:nonce], ciphertext: permitted[:ciphertext])
      return render json: note.to_h
    end

  end

  private

  def check_auth
    if session[:uid] != params[:uid]
      return head :forbidden
    end
  end

end
