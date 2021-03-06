class Photo
	include Mongoid::Document
	field :image, type: String
	mount_uploader :image, ImageUploader

	embedded_in :photoable, polymorphic: true
end