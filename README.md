# Notocrypt

WIP

## Background

I use Google keep a lot and that scares me a bit so I made Notocrypt. It's a fully client side encrypted alternative.  
Beware: It's still pretty much a work in progress and I don't have a lot of spare time to work on it.  

Current Status: Can Create / Edit / Delete notes.

## Usage

To run the server just do:

```
bundle install && bundle exec rails s
```

There is no log in or anything. You can access your vault by going `http://localhost:3000/username-you-want`.  
Then if it's the first time, you'll have to set up a password. 
Next time you access the url from a fresh browser you'll have to enter that same password again otherwise there is no way for anyone to decrypt your notes.
