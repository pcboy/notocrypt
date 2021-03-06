Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root to: "welcome#index"

  get "/:uid", to: "user#show"
  post "/:uid/notes", to: "notes#create"
  delete "/:uid/notes/:id", to: "notes#destroy"
  patch "/:uid/notes/:id", to: "notes#update"

  get "/:uid/notes", to: "notes#index"

  post "/:uid", to: "user#create"
  post "/:uid/authenticate", to: "user#authenticate"
end
