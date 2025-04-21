import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                likedBy: doc.data().likedBy || []
            }));
            setPosts(postsData);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const userId = currentUser?.id || 'anonymous';
            const postRef = doc(db, 'posts', postId);
            const post = posts.find(p => p.id === postId);
            
            if (!post) return;

            const isLiked = post.likedBy.includes(userId);
            
            // Update Firestore
            await updateDoc(postRef, {
                likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
            });

            // Update local state
            setPosts(posts.map(p => {
                if (p.id === postId) {
                    const newLikedBy = isLiked
                        ? p.likedBy.filter(id => id !== userId)
                        : [...p.likedBy, userId];
                    
                    return {
                        ...p,
                        likedBy: newLikedBy
                    };
                }
                return p;
            }));
        } catch (err) {
            console.error('Error updating like:', err);
            setError('Failed to update like');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-4">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="grid gap-6">
                {posts.map(post => {
                    const isLiked = post.likedBy.includes(currentUser?.id || 'anonymous');
                    
                    return (
                        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
                                        <p className="text-sm text-gray-500">
                                            Posted by {post.username} • {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                
                                {post.imageBase64 && (
                                    <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg">
                                        <img
                                            src={post.imageBase64}
                                            alt={post.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                
                                {post.caption && (
                                    <p className="text-lg text-gray-800 mb-2">{post.caption}</p>
                                )}
                                
                                {post.description && (
                                    <p className="text-gray-600">{post.description}</p>
                                )}

                                <div className="mt-4 flex items-center text-gray-500 text-sm">
                                    <button 
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center space-x-1 transition-colors duration-200 ${
                                            isLiked 
                                                ? 'text-red-500 hover:text-red-600' 
                                                : 'text-gray-500 hover:text-red-500'
                                        }`}
                                    >
                                        <svg 
                                            className="w-5 h-5" 
                                            fill={isLiked ? "currentColor" : "none"} 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth="2" 
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                                            />
                                        </svg>
                                        <span>{post.likedBy.length} {post.likedBy.length === 1 ? 'like' : 'likes'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PostList; 