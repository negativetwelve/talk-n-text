TalkNText::Application.routes.draw do
  root to: "pages#home"

  match "text", to: "pages#text", via: :get
  match "test", to: "pages#test", via: :get
end
