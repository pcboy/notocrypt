class UserController < ApplicationController

  def show
    permitted = params.require(:user).require(:uid)

    if @user = User.find_by(uid: permitted[:uid])
      @notes = @user.notes
    end
  end

end
