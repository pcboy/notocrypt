class Note < ApplicationRecord
  def to_h
    {
      id: self.id,
      nonce: self.nonce,
      ciphertext: self.ciphertext,
    }
  end
end
