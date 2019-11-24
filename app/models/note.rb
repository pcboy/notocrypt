class Note < ApplicationRecord
  def to_h
    {
      id: self.id,
      nonce: self.nonce,
      content: self.content,
    }
  end
end
