import { format } from 'date-fns';

const PostCard = ({ post }) => {
  const formattedDate = format(new Date(post.createdAt), 'MMM d, yyyy');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h2>
        
        <p className="text-gray-600 mb-4">
          {post.content}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <span className="font-medium text-gray-900">
              {post.authorName || 'Anonymous'}
            </span>
          </div>
          <time dateTime={post.createdAt}>
            {formattedDate}
          </time>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 