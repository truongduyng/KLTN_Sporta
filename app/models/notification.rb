class Notification
	include Mongoid::Document
	#Thuoc ve ai	
	belongs_to :target_user, class_name: 'User', inverse_of: :notifcations
	#Notificable hoac la post hoac la bussiness_request
	belongs_to :notificable, polymorphic: true
	#1 doi tuong bi tac dong boi nhieu loai hanh dong khac nhau
	has_many :notification_changes

	#cho tim reply, notificable lien he vs reply la embedded document nen ko the tim kiem dc
	def reply 
		comment = Comment.where('replies._id' => notificable_id).first
		if comment
			reply = comment.replies.find(notificable_id)
		end		
	end
end

#55269d7268757511c3860000
#55123c516875750ae52e0000
#Notification.find_reply '55123c516875750ae52e0000'