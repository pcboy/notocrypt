class NotesController < ApplicationController
  before_action :check_auth

  def index
    if u = User.find_by(uid: session[:uid])
      return render json: u.notes.order(:created_at).reverse.map(&:to_h)
    end
    return render json: []
  end

  def update
    permitted = params.required(:note).permit(:nonce, :ciphertext)

    if u = User.find_by(uid: session[:uid]) and note = u.notes.find(params[:id])
      note.update(permitted)
      return render json: note.to_h
    end
    return head :forbidden
  end

  def destroy
    if u = User.find_by(uid: session[:uid]) and note = u.notes.find(params[:id])
      note.destroy
      return head :ok
    end
    return head :forbidden
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
