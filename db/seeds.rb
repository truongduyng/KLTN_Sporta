# ['user', 'bussiness admin', 'system admin'].each do |role|
#   Role.find_or_create_by({name: role})
# end

# user = User.create() do |u|
#   u.email = "ntduy@sporta.vn"
#   u.username = 'ntduy'
#   u.password = '123456789'
#   u.fullname = 'Nguyen Truong Duy'
#   u.phone = "01633248188"
# end

# #Khoi tao information for user
# <<<<<<< HEAD
# # user = User.first
# # user.create_information(job: 'Thiet ke web', phone: '06824562')

# #Gan role system admin for first user
# # user = User.first
# # user.role = Role.where(name: 'bussiness admin').first
# # user.save

# # #Them du lieu cho assests_category
# # bussiness = Bussiness.first
# # AssestCategory.create(name: 'San 5 nguoi', bussiness_id: bussiness.id) do |ac|
# # 	ac.fees << Fee.new(begin_time: Time.now, end_time: Time.now, price: 150)
# # 	ac.fees << Fee.new(begin_time: Time.now, end_time: Time.now, price: 250)
# # end

# # AssestCategory.create(name: 'San 10 nguoi', bussiness_id: bussiness.id) do |ac|
# # 	ac.fees << Fee.new(begin_time: Time.now, end_time: Time.now, price: 250)
# # 	ac.fees << Fee.new(begin_time: Time.now, end_time: Time.now, price: 450)
# # end

# # #add branch to first bussiness
# # bussiness = Bussiness.first
# # bussiness.branches << Branch.new(name: 'Chi nhanh 1', address: '120 nguyen van cu')
# # bussiness.branches << Branch.new(name: 'Chi nhanh 2', address: '120 nguyen thi thap')

# ## add assest to bussiness's branch
# # bussiness = Bussiness.first
# # assest_category = bussiness.assest_categories.first
# # first_branch = bussiness.branches.first
# # first_branch.assests << Assest.new(name: 'San bong da nho', quantity: 10, assest_category_id: assest_category.id )
# # puts first_branch.assests.first.inspect


# # #Khoi tao post status
# # PostStatus.create(name: 'Chưa duyệt')
# # PostStatus.create(name: 'Đã duyệt')
# # PostStatus.create(name: 'Từ chối')


# # #Chuyen cac post trong csdl thanh tinh trang da duyet
# # @published_status = PostStatus.where(name: 'Đã duyệt').first
# # Post.all.to_a.each do |post|
# # 	post.post_status = @published_status
# # 	post.save
# # end

# # #Chuyen post vs id 5510dcd56875751cdb030000 thanh chua duyet de test
# # post = Post.find('5510dcd56875751cdb030000')
# # status = PostStatus.where(name: 'Chưa duyệt').first
# # post.post_status = status
# # post.save


# # #Tao role system admin va bussiness admin cho trungnguyenhuu
# # trungnguyenhuu = User.where(username: 'trungnguyenhuu').first
# # system_admin = Role.where(name: 'system admin').first
# # trungnguyenhuu.roles << system_admin
# # bussiness_admin = Role.where(name: 'bussiness admin').first
# # trungnguyenhuu.roles << bussiness_admin


# # # Tao ra nhung post moi chua duyet
# # trungnguyenhuu = User.where(username: 'trungnguyenhuu').first
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 10', body: 'Body 5')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 11', body: 'Body 6')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 12', body: 'Body 7')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 13', body: 'Body 8')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 14', body: 'Body 5')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 15', body: 'Body 6')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 16', body: 'Body 7')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 17', body: 'Body 8')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 18', body: 'Body 5')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 19', body: 'Body 6')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 20', body: 'Body 7')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 21', body: 'Body 8')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 22', body: 'Body 5')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 23', body: 'Body 6')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 24', body: 'Body 7')
# # trungnguyenhuu.posts << Post.new(title: 'post chua duyet 25', body: 'Body 8')



# #Tao ra cac status cho bussiness_request
# # Gom 3 tinh trang:
# # 	Chưa duyệt
# # 	Đã duyệt
# # 	Từ chối
# # BussinessRequestStatus.create(name: 'Chưa duyệt')
# # BussinessRequestStatus.create(name: 'Đã duyệt')
# # BussinessRequestStatus.create(name: 'Từ chối')


# #Tao yeu cau kich hoat tai khoan doanh nghiep
# # trung = User.where(username: 'trung').first
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 1', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 2', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 3', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 4', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 5', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 6', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 7', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 8', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 9', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 10', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 11', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 12', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 13', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 14', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 15', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)
# # trung.bussiness_requests << BussinessRequest.new(name: 'Name 16', address: 'address 1', description: 'description 1', category: 'category 1', latitude: 10.737145268109922, longitude: 106.71767234802246)



# #TAO RA CAC LOAI NOTIFICATION VA TEMPLATE CHO CHUNG
# ##Duyet bai viet thanh cong
# # NotificationCategory.create(name: 'Duyệt bài viết')

# ##Tu choi duyet bai viet
# # n = NotificationCategory.create(name: 'Từ chối bài viết')
# # n.build_notification_template(content: 'Bài viết của bạn không được viết vì nội dung nó không phù hợp với trang web thể thao.')
# # n.save

# ##Chap nhan yeu cau kich hoat tai khoan doanh nghiep
# # n =  NotificationCategory.create(name: 'Chấp nhận yêu cầu kích hoạt tài khoản doanh nghiệp')
# # n.build_notification_template(content: 'Yêu cầu kích hoạt tài khoản doanh nghiệp của bạn đã được chấp nhận. Bạn có làm theo hướng dẫn sau để quản lý doanh nghiệp của bạn')
# # n.save

# ##Từ chối yêu cầu kích hoạt tài khoản doanh nghiệp
# # n =  NotificationCategory.create(name: 'Từ chối yêu cầu kích hoạt tài khoản doanh nghiệp')
# # n.build_notification_template(content: 'Yêu cầu kích hoạt tài khoản doanh nghiệp của bạn đã bị từ chối có thề vì 1 trong các nguyên nhân sau: .....')
# # n.save

# # ##Thích bài viết
# # NotificationCategory.create(name: 'Thích bài viết')
# # ## Bình luận bài viết
# # NotificationCategory.create(name: 'Bình luận bài viết')
# # ## Thích bình luận
# # NotificationCategory.create(name: 'Thích bình luận')
# # ##Phản hồi bình luận
# # NotificationCategory.create(name: 'Phản hồi bình luận')

# # ##Thích phản hồi
# # NotificationCategory.create(name: 'Thích phản hồi')

# # ##Bình luận trên bài viết bạn đang theo dõi
# # NotificationCategory.create(name: 'Bình luận trên bài viết bạn đang theo dõi')

# # ##Thích bài viết bạn đang theo dõi
# # NotificationCategory.create(name: 'Thích bài viết bạn đang theo dõi')

# # # ##Bình luận của chủ bài viết
# # NotificationCategory.create(name: 'Bình luận của chủ bài viết')


# ## clear notification 
# # Notification.destroy_all
# # NotificationChange.destroy_all
# # NotificationChangeTrigger.destroy_all



# ###MOT SO KHOI TAO CSDL CAN PHAI CHAY (CO THE TRUNG VS CAC DONG LENH BEN TREN)
# PostStatus.create(name: 'Chưa duyệt')
# PostStatus.create(name: 'Đã duyệt')
# PostStatus.create(name: 'Từ chối')

# BussinessRequestStatus.create(name: 'Chưa duyệt')
# BussinessRequestStatus.create(name: 'Đã duyệt')
# BussinessRequestStatus.create(name: 'Từ chối')


# #Duyet bai viet thanh cong
# NotificationCategory.create(name: 'Duyệt bài viết')

# #Tu choi duyet bai viet
# n = NotificationCategory.create(name: 'Từ chối bài viết')
# n.build_notification_template(content: 'Bài viết của bạn không được viết vì nội dung nó không phù hợp với trang web thể thao.')
# n.save

# #Chap nhan yeu cau kich hoat tai khoan doanh nghiep
# n =  NotificationCategory.create(name: 'Chấp nhận yêu cầu kích hoạt tài khoản doanh nghiệp')
# n.build_notification_template(content: 'Yêu cầu kích hoạt tài khoản doanh nghiệp của bạn đã được chấp nhận. Bạn có làm theo hướng dẫn sau để quản lý doanh nghiệp của bạn')
# n.save

# #Từ chối yêu cầu kích hoạt tài khoản doanh nghiệp
# n =  NotificationCategory.create(name: 'Từ chối yêu cầu kích hoạt tài khoản doanh nghiệp')
# n.build_notification_template(content: 'Yêu cầu kích hoạt tài khoản doanh nghiệp của bạn đã bị từ chối có thề vì 1 trong các nguyên nhân sau: .....')
# n.save

# ##Thích bài viết
# NotificationCategory.create(name: 'Thích bài viết')
# ## Bình luận bài viết
# NotificationCategory.create(name: 'Bình luận bài viết')
# ## Thích bình luận
# NotificationCategory.create(name: 'Thích bình luận')
# ##Phản hồi bình luận
# NotificationCategory.create(name: 'Phản hồi bình luận')

# ##Thích phản hồi
# NotificationCategory.create(name: 'Thích phản hồi')

# ##Bình luận trên bài viết bạn đang theo dõi
# NotificationCategory.create(name: 'Bình luận trên bài viết bạn đang theo dõi')

# ##Thích bài viết bạn đang theo dõi
# NotificationCategory.create(name: 'Thích bài viết bạn đang theo dõi')

# # ##Bình luận của chủ bài viết
# NotificationCategory.create(name: 'Bình luận của chủ bài viết')
# =======
# user = User.first
# user.create_information(job: 'Thiet ke web', phone: '06824562')

# # Gan role system admin for first user
# user = User.first
# user.role = Role.where(name: 'bussiness admin').first
# user.save

# bussiness = Bussiness.create(name: "Cong ty Sporta", user_id: user.id)

# bussiness.branches << Branch.create(name: 'Chi nhanh 1', url_alias: "chinhanh1", address: '120 nguyen van cu, thanh pho Ho Chi Minh')
# bussiness.branches << Branch.create(name: 'San van dong Sporta', url_alias: "chinhanh2", address: '18 khuong viet, phu trung, tan phu, thanh pho Ho Chi Minh')
# bussiness.branches << Branch.create(name: 'Chi nhanh 3', url_alias: "chinhanh3", address: '30 khuong viet, phu trung, tan phu, thanh pho Ho Chi Minh')
# bussiness.branches << Branch.create(name: 'Chi nhanh 4', url_alias: "chinhanh4", address: '429 au co, phu trung, tan phu, thanh pho Ho Chi Minh')
# bussiness.branches << Branch.create(name: 'Chi nhanh 5', url_alias: "chinhanh5", address: '100 khuong viet, phu trung, tan phu, thanh pho Ho Chi Minh')
# bussiness.branches << Branch.create(name: 'Chi nhanh 6', url_alias: "chinhanh6", address: '225 nguyen van cu, Quan 5, thanh pho Ho Chi Minh')
# bussiness.branches << Branch.create(name: 'Chi nhanh 7', url_alias: "chinhanh7", address: '36 D3, Quan Binh Thanh, thanh pho Ho Chi Minh')

# branch = bussiness.branches[0]

# ac = AssetCategory.create(name: 'San 5 nguoi', branch_id: branch.id)
# ac.fees << Fee.new(begin_time: "7:00", end_time: "10:00", price: 150)
# ac.fees << Fee.new(begin_time: "10:00", end_time: "15:00", price: 250)
# Asset.create(name: "San 1", description: "San gan nhat", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 2", description: "San gan nhi", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 3", description: "San gan ba", branch_id: branch.id, asset_category_id: ac.id)

# ac = AssetCategory.create(name: 'San 10 nguoi', branch_id: branch.id)
# ac.fees << Fee.new(begin_time: "7:00", end_time: "10:00", price: 250)
# ac.fees << Fee.new(begin_time: "10:00", end_time: "15:00", price: 450)
# Asset.create(name: "San 4", description: "San gan nhat", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 5", description: "San gan nhi", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 6", description: "San gan ba", branch_id: branch.id, asset_category_id: ac.id)

# branch = bussiness.branches[1]

# ac = AssetCategory.create(name: 'San 5 nguoi', branch_id: branch.id)
# ac.fees << Fee.new(begin_time: "7:00", end_time: "10:00", price: 150)
# ac.fees << Fee.new(begin_time: "10:00", end_time: "15:00", price: 250)
# Asset.create(name: "San 1", description: "San gan nhat", branch_id: branch.id, asset_category_id: ac.id)


# ac = AssetCategory.create(name: 'San 10 nguoi', branch_id: branch.id)
# ac.fees << Fee.new(begin_time: "7:00", end_time: "10:00", price: 250)
# ac.fees << Fee.new(begin_time: "10:00", end_time: "15:00", price: 450)
# Asset.create(name: "San 2", description: "San gan nhat", branch_id: branch.id, asset_category_id: ac.id)


# branch = bussiness.branches[2]

# ac = AssetCategory.create(name: 'San 5 nguoi', branch_id: branch.id)
# ac.fees << Fee.new(begin_time: "7:00", end_time: "10:00", price: 150)
# ac.fees << Fee.new(begin_time: "10:00", end_time: "15:00", price: 250)
# Asset.create(name: "San 1", description: "San gan nhat", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 2", description: "San gan nhi", branch_id: branch.id, asset_category_id: ac.id)


# ac = AssetCategory.create(name: 'San 10 nguoi', branch_id: branch.id)
# ac.fees << Fee.new(begin_time: "7:00", end_time: "10:00", price: 250)
# ac.fees << Fee.new(begin_time: "10:00", end_time: "15:00", price: 450)
# Asset.create(name: "San 3", description: "San gan nhat", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 4", description: "San gan nhi", branch_id: branch.id, asset_category_id: ac.id)


# branch = bussiness.branches[3]

# ac = AssetCategory.create(name: 'San 5 nguoi', branch_id: branch.id)
# ac.fees << Fee.new(begin_time: "7:00", end_time: "10:00", price: 150)
# ac.fees << Fee.new(begin_time: "10:00", end_time: "15:00", price: 250)
# Asset.create(name: "San 1", description: "San gan nhat", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 2", description: "San gan nhi", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 3", description: "San gan ba", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 4", description: "San gan nhat", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 5", description: "San gan nhi", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 6", description: "San gan ba", branch_id: branch.id, asset_category_id: ac.id)

# ac = AssetCategory.create(name: 'San 10 nguoi', branch_id: branch.id)
# ac.fees << Fee.new(begin_time: "7:00", end_time: "10:00", price: 250)
# ac.fees << Fee.new(begin_time: "10:00", end_time: "15:00", price: 450)
# Asset.create(name: "San 7", description: "San gan nhat", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 8", description: "San gan nhi", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 9", description: "San gan ba", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 10", description: "San gan nhat", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 11", description: "San gan nhi", branch_id: branch.id, asset_category_id: ac.id)
# Asset.create(name: "San 12", description: "San gan ba", branch_id: branch.id, asset_category_id: ac.id)
# >>>>>>> merge_bussiness_admin
