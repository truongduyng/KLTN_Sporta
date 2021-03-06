#Nhung actor tham gia vao thay doi notification len 1 doi tuong
class NotificationChange
	include Mongoid::Document
	include Mongoid::Timestamps
	#Co nhieu trigger tac dong vao notification change loai nay
	#trigger_ids: [] cho thay nhung nguoi tac dong vao notification change nay
	has_and_belongs_to_many :triggers, class_name: 'NotificationChangeTrigger', inverse_of: :notification_changes
	#has_and_belongs_to_many :triggers, class_name: 'NotificationChangeTrigger', inverse_of: nil
	#Luu 1 array id trigger_ids: []
	#Loai tac dong gi
	belongs_to :notification_category
	#Thuoc 1 ve notification nao do
	belongs_to :notification
	#Da click vao de xem chi tiet. Giup hien thi mau va cho biet notification nao da duoc click vao va xem chi tiet
	field :watched, type: Boolean, default: ->{false}
	#Cho thay da load hay chua. Neu no chua dc load thi co the loai bo 1 notification khi no bi bo boi nguoi tac dong.
	#vi du 1 nguoi like thi khi 1 notification chua dc load thi khi nguoi do bo like thi se bo lun thong bao
	field :loaded, type: Boolean, default: ->{false}
	#Cho thay da dc xem hay chua. Giup xac dinh so luong notification moi.
	field :is_new, type: Boolean, default: ->{true}


	#Lay nhung trigger khac nhau boi trigger_user_id
	def distinct_triggers_by_user
		self.triggers.desc(:updated_at).uniq{|trigger| trigger.trigger_user_id}
	end
	#Chua xet tao notification den nhieu nguoi, viec tai su dung trigger va xoa trigger co hop ly hay ko
	#Vi 1 xet truong: 1 nguoi like bai viet dc theo boi 2 nguoi va sau do unlike: tuy nhien 1 nguoi da xem truoc unlike mong muon thay like cua nguoi do
	#va 1 nguoi xem sau unlike mong muon ko thay thong bao like cua nguoi do
	def self.create_notification target_user, target_object, trigger_user, trigger_source, notification_category
		#B1: Tim hoac tao notification
		# byebug
		notification = Notification.find_or_create(target_user, target_object)
		#Tim notification_change cho target_object, target_user va category va no chua dc xem. Neu dc xem rui thi tao ra 1 notification change moi
		notification_change = NotificationChange.all_of(notification_id: notification.id, notification_category_id: notification_category.id, is_new: true).first
		#TH1: Neu co 1 notification change thoa man (chua dc xem) thi them no vao
		if notification_change
			#B1: Tao ra trigger (chu y trigger nay neu da ton tai thi tai su dung lai)
			trigger = NotificationChangeTrigger.find_or_create(trigger_user, trigger_source)
			trigger.add_notification_changes(notification_change)
			#Them trigger vao notification_change
			notification_change.trigger_ids << trigger.id
			notification_change.updated_at = Time.now
			notification_change.save
			#B5: Thong bao toi client realtime, Trigger thong bao 1 notification change da thay doi can cap nhat
			ac = ActionController::Base.new()
			#Giup chuyen notification_change thanh json object thich hop dung template show.json.jbuilder.
			notification_change_json = ac.render_to_string( template: 'notifications/show.json.jbuilder', locals: { :@notification_change => notification_change})

			Fiber.new{WebsocketRails[target_user.id.to_s].trigger("on_update_notification", notification_change_json)}.resume
		else
			#TH2: Neu ko co notification change thoa man thi tao moi
			#B1: Tao notification change
			notification_change = NotificationChange.new
			#notification_change.trigger = [trigger_user]
			notification_change.notification_category = notification_category
			notification_change.notification = notification
			#B2: Tao trigger
			trigger = NotificationChangeTrigger.find_or_create(trigger_user, trigger_source)
			#B3: Gan trigger vao notification changes
			notification_change.trigger_ids = [trigger.id]
			notification_change.save
			#B4: Add notification change cho trigger
			trigger.add_notification_changes(notification_change)
			#B5: Thong bao toi client realtime, Trigger thong bao 1 notification moi, can them vao ds notification
			ac = ActionController::Base.new()
			notification_change_json = ac.render_to_string( template: 'notifications/show.json.jbuilder', locals: { :@notification_change => notification_change})

			Fiber.new{WebsocketRails[target_user.id.to_s].trigger("on_new_notification", notification_change_json)}.resume
		end
	end

	#Tao ra notification cho nhieu nguoi
	def self.create_notifications target_user_ids, target_object, trigger_user, trigger_source, notification_category
		#B1: Tao ra trigger (chu y trigger nay neu da ton tai thi tai su dung lai)
		trigger = NotificationChangeTrigger.find_or_create(trigger_user, trigger_source)
		#B2: Lap qua ds target_users va gui thong bao den tung nguoi
		target_user_ids.each do |target_user_id|
			# byebug
			#B2: Tim notification cua target_user vs target_object
			notification = Notification.find_or_create(target_user_id, target_object)
			#Tim notification_change cho target_object, target_user va category va no chua dc xem. Neu dc xem rui thi tao ra 1 notification change moi
			notification_change = NotificationChange.all_of(notification_id: notification.id, notification_category_id: notification_category.id, is_new: true).first
			#TH1: Neu co 1 notification change thoa man (chua dc xem) thi them no vao
			if notification_change
				#Them trigger vao notification_change
				notification_change.trigger_ids << trigger.id
				#Add notification change cho trigger
				trigger.add_notification_changes(notification_change)
				notification_change.updated_at = Time.now
				notification_change.save
				#B5: Thong bao toi client realtime, Trigger thong bao 1 notification change da thay doi can cap nhat
				ac = ActionController::Base.new()
				#Giup chuyen notification_change thanh json object thich hop dung template show.json.jbuilder.
				notification_change_json = ac.render_to_string( template: 'notifications/show.json.jbuilder', locals: { :@notification_change => notification_change})
				# WebsocketRails[target_user_id.to_s].trigger("on_update_notification", notification_change_json)
				Fiber.new{WebsocketRails[target_user_id.to_s].trigger("on_update_notification", notification_change_json)}.resume
			else
				#TH2: Neu ko co notification change thoa man thi tao moi
				#B1: Tao notification change
				notification_change = NotificationChange.new
				#notification_change.trigger = [trigger_user]
				notification_change.notification_category = notification_category
				notification_change.notification = notification
				#B2: Gan trigger vao notification changes
				notification_change.trigger_ids = [trigger.id]
				notification_change.save
				#Add notification change cho trigger
				trigger.add_notification_changes(notification_change)
				#B5: Thong bao toi client realtime, Trigger thong bao 1 notification moi, can them vao ds notification
				ac = ActionController::Base.new()
				notification_change_json = ac.render_to_string( template: 'notifications/show.json.jbuilder', locals: { :@notification_change => notification_change})

				Fiber.new{WebsocketRails[target_user_id.to_s].trigger("on_new_notification", notification_change_json)}.resume
			end
		end

	end

	def self.find_notification_change target_user, target_object, trigger_user, trigger_source, notification_category
		#B1: Kiem tra target_user la user object hay la id cua user
		if target_user.class.to_s == 'User'
			target_user_id = target_user.id
		else
			if target_user.class.to_s == 'BSON::ObjectId'
				target_user_id = target_user
			end
		end
		#B2: Tim notification cho target_user tuong ung vs target_object
		notification  = Notification.all_of(target_user_id: target_user_id, notificable_id: target_object.id).first
		if !notification
			return nil
		else
			#Tim trigger notification change
			trigger = NotificationChangeTrigger.all_of(trigger_user_id: trigger_user.id, trigger_source_id: trigger_source.id).first
			if !trigger
				return nil
			else
				notification_change = NotificationChange.all_of('trigger_ids' => trigger.id, notification_id: notification.id, notification_category_id: notification_category.id).first
				return notification_change
			end
		end
	end

	#Xoa 1 notification change
	def self.delete_notification_change target_user, target_object, trigger_user, trigger_source, notification_category
		notification_change = NotificationChange.find_notification_change(target_user, target_object, trigger_user, trigger_source, notification_category)
		#Neu co notification_change va no chua dc load (loaded = false) thi xoa no di.
		#Trong truong hop bi tac dong boi nhieu nguoi thi xoa nguoi do di thoi, va khi mang tac dong = [] thi xoa notification change di
		if notification_change && !notification_change.loaded
			#B1: Tim triggger. Luon tim dc vi tim dc notification_change
			trigger = NotificationChangeTrigger.all_of(trigger_user_id: trigger_user.id, trigger_source_id: trigger_source.id).first
			#B2: Bo trigger_user ra kho mang triggers
			notification_change.trigger_ids.delete(trigger.id)
			trigger.notification_change_ids.delete(notification_change.id)
			trigger.save
			#B5: Kiem tra trigger no co trigger 1 notification change nao khac ko, neu ko thi cung xoa no di
			if trigger.notification_change_ids.count == 0
				trigger.destroy
			end
			#B3: Khi ko con triggers (co nghia la ko con notification change cho loai category) thi xoa no di
			if notification_change.trigger_ids.count == 0
				notification_change.destroy
				#Kiem tra notification coi thu co con notification_change nao hay ko, neu ko xoa no di
				notification = Notification.find_or_create(target_user, target_object)
				if notification.notification_changes.count == 0
					notification.destroy
				end
			else
				#B4: Cap nhat lai thoi gian cua notification_change thanh thoi gian cua trigger moi nhat
				newest_triggger = notification_change.triggers.desc(:updated_at).first
				notification_change.updated_at = newest_triggger.updated_at
				notification_change.save
			end
		end
	end

	#Xoa nhieu notifications
	def self.delete_notification_changes target_user_ids, target_object, trigger_user, trigger_source, notification_category
		#B1: Tim triggger. Luon tim dc vi tim dc notification_change
		trigger = NotificationChangeTrigger.all_of(trigger_user_id: trigger_user.id, trigger_source_id: trigger_source.id).first
		target_user_ids.each do |target_user_id|
			#B2: Tim notification_change
			notification_change = NotificationChange.find_notification_change(target_user_id, target_object, trigger_user, trigger_source, notification_category)
			#Neu co notification_change va no chua dc load (loaded = false) thi xoa no di.
			#Trong truong hop bi tac dong boi nhieu nguoi thi xoa nguoi do di thoi, va khi mang tac dong = [] thi xoa notification change di
			if notification_change && !notification_change.loaded
				#B2: Bo trigger_user ra kho mang triggers
				notification_change.trigger_ids.delete(trigger.id)
				trigger.notification_change_ids.delete(notification_change.id)
				trigger.save
				#B5: Kiem tra trigger no co trigger 1 notification change nao khac ko, neu ko thi cung xoa no di
				if trigger.notification_change_ids.count == 0
					trigger.destroy
				end
				#B3: Khi ko con triggers (co nghia la ko con notification change cho loai category) thi xoa no di
				if notification_change.trigger_ids.count == 0
					notification_change.destroy
					#Kiem tra notification coi thu co con notification_change nao hay ko, neu ko xoa no di
					notification = Notification.find_or_create(target_user_id, target_object)
					if notification.notification_changes.count == 0
						notification.destroy
					end
				else
					#B4: Cap nhat lai thoi gian cua notification_change thanh thoi gian cua trigger moi nhat
					newest_triggger = notification_change.triggers.desc(:updated_at).first
					notification_change.updated_at = newest_triggger.updated_at
					notification_change.save
				end
			end
		end
	end
end


#De gui thong bao den nhung nguoi theo doi bai viet:
#B1: them thuoc tinh followers cho post
#B2: Moi khi 1 nguoi tac dong den post thi them nguoi do thanh theo doi post
#B3: moi khi 1 nguoi trigger 1 thong bao thi tao ra thong bao cho moi
#nguoi followers (phai tao ra loai hang thong bao phu hop: Binh luan bai post ban theo doi, thich bai post ban theo doi)

#Comment cung co follower, trong truong hop nguoi reply comment thi phai thong bao cho nguoi reply khi co ai do reply cung comment

#GIAI PHAP KHAC
#Notification change se la 1 mang cua trigger_users. Khi them 1 notification change thi tim cai notification change theo loai va lay cai moi nhat, neu
#cai moi nhat do chua dc xem is_new = true thi don gian them 1 trigger user vao mang trigger users. Nguoc lai,
#neu no da dc xem rui thi chi can tao ra 1 notification change moi.
#Uu diem: Ko can group gi ca, chi lay notification change ve va hien thi (nhanh va chinh xac)


#NotificationChange.all_of('trigger_users._id' => '54cf9a3f6875752467010000', notification_id: '552771dc6875750c31060000', notification_category_id: '55225d2b68757540e3000000').first

#NotificationChange.all_of(notification_id: notification.id, notification_category_id: notification_category.id, is_new: true).first


#tra ve gia triggers rieng biet dua tren user_id