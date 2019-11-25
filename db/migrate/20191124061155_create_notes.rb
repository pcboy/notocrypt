class CreateNotes < ActiveRecord::Migration[6.0]
  def change
    create_table :notes do |t|
      t.text :ciphertext, limit: 10.kilobytes
      t.string :nonce
      t.references :user
      t.timestamps
    end
  end
end
