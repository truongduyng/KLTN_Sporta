class BussinessRequestStatus
	include Mongoid::Document

	field :name, type: String
	validates_uniqueness_of :name
	has_many :bussiness_requests, class_name: 'BussinessRequest', inverse_of: :status

	#scope
	def self.chua_duyet_status
		where(name: 'Chưa duyệt').first
	end

	def self.da_duyet_status
		where(name: 'Đã duyệt').first
	end

	def self.tu_choi_status
		where(name: 'Từ chối').first
	end
end
# Gom 3 tinh trang:
# 	Chưa duyệt
# 	Đã duyệt
# 	Từ chối