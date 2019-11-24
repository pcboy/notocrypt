import userStore from "../UserStore";

import { observable, action } from "mobx";
import sodium from "libsodium-wrappers";
import { FromBase64 } from "../Utils";

(async () => {
  await sodium.ready;
})();

class Note {
  @observable id = null;
  @observable content = null;
  @observable nonce = null;
  @observable locked = true;

  constructor(noteResponse) {
    this.id = noteResponse.id;
    this.content = noteResponse.content;
    this.nonce = noteResponse.nonce;
  }

  @action async lock() {
    if (!this.locked) {
    }
  }

  @action async unlock() {
    try {
      if (this.locked) {
        let cleartext = await sodium.crypto_secretbox_open_easy(
          FromBase64(this.content),
          FromBase64(this.nonce),
          FromBase64(userStore.pdKey)
        );
        this.content = new TextDecoder("utf-8").decode(cleartext);
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
