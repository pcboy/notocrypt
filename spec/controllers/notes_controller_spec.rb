require 'rails_helper'

RSpec.describe NotesController, type: :controller do
  fixtures :users

  before do
    @current_user = users(:first)
    
  end

  describe "GET index" do
    context "when logged in" do
      before do
        @request.session['uid'] = @current_user.uid
      end

      it "can get the notes of the current user" do
        note = @current_user.notes.create(nonce: '42', ciphertext: '42')
        get :index, params: {uid: @current_user.uid}
        expect(response.body).to eq([note.to_h.slice(:id, :nonce, :ciphertext)].to_json)
      end
    end
  end

  describe "CREATE notes" do
    context "when logged in" do
      before do
        @request.session['uid'] = @current_user.uid
      end

      it "can create a note for the current user" do
        get :create, params: {uid: @current_user.uid, note: { nonce: '42', ciphertext: '42'}}
        expect(response.status).to be(200)
        expect(@current_user.notes.first.nonce).to eq('42')
        expect(@current_user.notes.first.ciphertext).to eq('42')
      end

      it "should not be able to create a not if not logged in" do
        pending 
      end

    end
  end

  describe "UPDATE notes" do
    context "when logged in" do
      before do
        @request.session['uid'] = @current_user.uid
      end
      it "can update a specific note" do
        pending
      end

      it "should not be able to update a note from another user" do
        pending
      end
    end
  end

  describe "DESTROY notes" do
    context "when logged in" do
      before do
        @request.session['uid'] = @current_user.uid
      end

      it "can destroy notes" do
        pending
      end
    end
  end

end
