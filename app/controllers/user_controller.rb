class UserController < ApplicationController
  def create
    permitted = params.required(:user).permit(:salt, :uid)

    User.create!(uid: params[:uid]) do |u|
      u.salt = permitted[:salt]
    end
    return render json: { message: "success" }
  end

  def show
    if @user = User.find_by(uid: params[:uid])
      @notes = @user.notes.map(&:to_h)
    end
  end
end
