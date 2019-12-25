import userStore from "../UserStore";

import { observable, action } from "mobx";
import sodium from "libsodium-wrappers";
import { FromBase64, ToBase64 } from "../Utils";
import axios from "axios";
import { csrfToken } from "rails-ujs";

axios.defaults.headers.common["X-CSRF-Token"] = csrfToken();

(async () => {
  await sodium.ready;
})();

class Note {
  @observable id = null;
  @observable content = null;
  @observable metadata = null;
  @observable ciphertext = null;
  @observable nonce = null;
  @observable locked = true;

  constructor(content, metadata = null) {
    this.content = content;
    this.metadata = metadata;
  }

  fromServerResponse(noteResponse) {
    this.id = noteResponse.id;
    this.ciphertext = noteResponse.ciphertext;
    this.nonce = noteResponse.nonce;
  }

  static fromServerResponse(noteResponse) {
    let note = new Note(null, null);

    note.fromServerResponse(noteResponse);

    return note;
  }

  @action async save() {
    let nonce = await sodium.randombytes_buf(
      sodium.crypto_secretbox_NONCEBYTES
    );

    let ciphertext = await sodium.crypto_secretbox_easy(
      JSON.stringify({ content: this.content, metadata: this.metadata }),
      nonce,
      FromBase64(userStore.pdKey)
    );

    this.ciphertext = ToBase64(ciphertext);
    this.nonce = ToBase64(nonce);

    if (this.id) {
      return axios.patch(`/${userStore.uid}/notes/${this.id}`, {
        ciphertext: this.ciphertext,
        nonce: this.nonce
      });
    } else {
      return axios
        .post(`/${userStore.uid}/notes`, {
          ciphertext: this.ciphertext,
          nonce: this.nonce
        })
        .then(response => {
          this.fromServerResponse(response.data);
        });
    }
  }

  @action async delete() {
    return axios.delete(`/${userStore.uid}/notes/${this.id}`).then(() => {
      userStore.removeNote(this);
    });
  }

  @action async lock() {
    if (!this.locked) {
    }
  }

  @action async unlock() {
    try {
      if (this.locked) {
        let cleartext = await sodium.crypto_secretbox_open_easy(
          FromBase64(this.ciphertext),
          FromBase64(this.nonce),
          FromBase64(userStore.pdKey)
        );
        let json = JSON.parse(new TextDecoder("utf-8").decode(cleartext));
        this.content = json.content;
        this.metadata = json.metadata;
        this.locked = false;
      }
    } catch (err) {
      console.log(err);
      userStore.reset();
      throw err;
    }
  }
}

export default Note;
