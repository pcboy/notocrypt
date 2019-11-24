class NotesController < ApplicationController

  def create
    permitted = params.required(:note).require(:content, :uid)



  end

end
