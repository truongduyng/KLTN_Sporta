json.extract! @comment, :_id, :content, :created_at, :updated_at, :user
json.reply_count @comment.replies.count