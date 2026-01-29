import User from "../models/User.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";


export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();


        const likesAggregation = await Like.aggregate([
            { $match: { type: "like" } },
            { $group: { _id: "$postId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        let mostLikedPost = null;
        if (likesAggregation.length > 0) {
            mostLikedPost = await Post.findById(likesAggregation[0]._id).populate("author", "name username");
            if (mostLikedPost) {
                mostLikedPost = mostLikedPost.toObject();
                mostLikedPost.likeCount = likesAggregation[0].count;
            }
        }

        const commentsAggregation = await Comment.aggregate([
            { $group: { _id: "$postId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        let mostCommentedPost = null;
        if (commentsAggregation.length > 0) {
            mostCommentedPost = await Post.findById(commentsAggregation[0]._id).populate("author", "name username");
            if (mostCommentedPost) {
                mostCommentedPost = mostCommentedPost.toObject();
                mostCommentedPost.commentCount = commentsAggregation[0].count;
            }
        }

        res.json({
            totalUsers,
            totalPosts,
            mostLikedPost,
            mostCommentedPost
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!["active", "blocked"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const user = await User.findByIdAndUpdate(userId, { status }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name username email")
            .sort({ createdAt: -1 });


        const enrichedPosts = await Promise.all(posts.map(async (post) => {
            const likeCount = await Like.countDocuments({ postId: post._id, type: "like" });
            const commentCount = await Comment.countDocuments({ postId: post._id });
            return {
                ...post.toObject(),
                likeCount,
                commentCount
            };
        }));

        res.json(enrichedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePostStatus = async (req, res) => {
    try {
        const { postId } = req.params;
        const { status } = req.body;

        if (!["active", "disabled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const post = await Post.findByIdAndUpdate(postId, { status }, { new: true });
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (status === 'disabled') {
            await Notification.create({
                userId: post.author,
                postId: post._id,
                message: `Your post titled "${post.title}" has been disabled by the admin.`,
                type: 'warning'
            });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findByIdAndDelete(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        await Like.deleteMany({ postId });
        await Comment.deleteMany({ postId });

        await Notification.create({
            userId: post.author, // Assuming post.author is available before deletion, but findByIdAndDelete returns the doc.
            postId: post._id, // Providing ID even if deleted for reference
            message: `Your post titled "${post.title}" has been deleted by the admin.`,
            type: 'error'
        });

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostDetails = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate("author", "name username email profileImage");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likes = await Like.countDocuments({ postId, type: "like" });
        const dislikes = await Like.countDocuments({ postId, type: "dislike" });

        const comments = await Comment.find({ postId })
            .populate("userId", "name username profileImage")
            .sort({ createdAt: -1 });

        res.json({
            ...post.toObject(),
            likeCount: likes,
            dislikeCount: dislikes,
            comments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getActiveUsers = async (req, res) => {
    try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const activeUsers = await User.find({ lastSeen: { $gte: fifteenMinutesAgo } })
            .select("name username email profileImage lastSeen status")
            .sort({ lastSeen: -1 });

        res.json(activeUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
