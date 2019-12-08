class UserController < ApplicationController
  def create
    permitted = params.required(:user).permit(:salt, :uid, :pubkey64)

    User.create!(uid: params[:uid]) do |u|
      u.salt = permitted[:salt]
      u.pubkey = permitted[:pubkey64]
      session[:uid] = params[:uid]
    end
    return render json: { message: "success" }
  end

  def authenticate
    if @user = User.find_by(uid: params[:uid])
      verify_key = RbNaCl::VerifyKey.new(Base64.decode64(@user.pubkey))
      if @user.challenge_nonce == params[:nonce] &&
         verify_key.verify(Base64.decode64(params[:signature64]), params[:nonce])
        session[:uid] = @user.uid
        return render json: @user.notes.map(&:to_h)
      end
    end
  rescue RbNaCl::BadSignatureError
    return head :forbidden
  end

  def show
    if @user = User.find_by(uid: params[:uid])
      if @user.uid != session[:uid]
        @user.update(challenge_nonce: Base64.encode64(RbNaCl::Random.random_bytes(32)))
      end
    end
  end
end
