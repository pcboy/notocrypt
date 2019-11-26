import { observable } from "mobx";
import { action, computed, runInAction } from "mobx";
import { create, persist } from "mobx-persist";

import localForage from "localforage";
import axios from "axios";
import { csrfToken } from "rails-ujs";
import { FromBase64, ToBase64 } from "./Utils";

import sodium from "libsodium-wrappers";

axios.defaults.headers.common["X-CSRF-Token"] = csrfToken();

import Note from "./models/Note";

class UserStore {
  @persist @observable salt = null;
  @persist @observable pdKey = null;
  @observable notes = [];

  async initSodium() {
    await sodium.ready;
  }

  @computed get uid() {
    let u = window.location.pathname;
    return u.substr(1, u.length - 1);
  }

  @computed get isLoggedIn() {
    return !!this.pdKey;
  }

  @action reset() {
    this.salt = null;
    this.pdKey = null;
  }

  @action getNotes() {
    return axios.get(`/${this.uid}/notes`).then(response => {
      this.notes = response.data.map(note => Note.fromServerResponse(note));
    });
  }

  @action async addNote(content) {
    let note = new Note(content, { info: "simpleNote" });
    note.save().then(() => {
      userStore.notes.push(note);
    });
  }

  @action async checkPassword(salt64, password) {
    let note = this.notes[0];

    let salt = FromBase64(salt64);
    let pdKey = await sodium.crypto_pwhash(
      sodium.crypto_box_SEEDBYTES,
      password,
      salt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_DEFAULT
    );
    this.pdKey = ToBase64(pdKey);

    try {
      note.unlock();
    } catch (err) {
      this.pdKey = null;
      throw err;
    }
  }

  @action async register(uid, password) {
    let salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

    this.salt = ToBase64(salt);

    let pdKey = await sodium.crypto_pwhash(
      sodium.crypto_box_SEEDBYTES,
      password,
      salt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_DEFAULT
    );

    this.pdKey = ToBase64(pdKey);

    return axios.post(`/${uid}/`, { salt: this.salt }).then(() => {
      this.addNote("Your First note!");
    });
  }
}

const hydrate = create({
  storage: localForage, // or AsyncStorage in react-native.
  // default: localStorage
  jsonify: true // if you use AsyncStorage, here shoud be true
  // default: true
});

export const userStore = new UserStore();

hydrate("userStore", userStore).then(() => {
  console.log("userStore has been hydrated");
});

export default userStore;
