Rails.application.routes.draw do

  resources 'branches'
  get 'search(/:lat/:lng)' => 'branches#search', constraints:{ lat: /[0-9\.]+/, lng: /[0-9\.]+/ }

  resources 'assests' do
    collection do
      get 'get-assests-by-category'
    end
  end

  resources 'assest_categories' do
    resources 'fees'
  end

  get 'dang-ky-doanh-nghiep' => 'bussinesses#new'
  post 'bussiness-create' => 'bussinesses#create'
  put 'bussinesses/update' => 'bussinesses#update'
  get 'bussinesses/show' => 'bussinesses#show'

  post 'infomations/edit' => 'informations#edit'
  get 'informations/show' => 'informations#show'
  # resources :informations
  get 'check/username' => 'user#check_username'
  get 'check/email' => 'user#check_email'
  devise_for :users
  get 'bussiness-admin' => 'admin#index'
  root 'application#angular'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
