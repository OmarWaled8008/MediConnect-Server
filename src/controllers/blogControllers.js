const Blog = require("../models/blog");

const saveBlogPost = async (blog, res, successMessage) => {
  try {
    await blog.save();
    res.status(200).json({ message: successMessage, blog });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createBlogPost = async (req, res) => {
  const { title, content } = req.body;
  let imageUrl = "";

  // التحقق إذا كان هناك صورة مرفوعة
  if (req.file) {
    imageUrl = req.file.path; // حفظ مسار الصورة المرفوعة
  }

  const blog = new Blog({
    title,
    content,
    imageUrl, // ربط مسار الصورة بالمدونة
    author: req.user.userId, // ربط الـ author بالـ user الحالي
    authorType: req.user.role, // ربط الـ role بالـ user الحالي (facility أو patient)
  });

  await saveBlogPost(blog, res, "Blog post created successfully");
};

const findBlogPostByIdAndCheckOwnership = async (blogId, userId, res) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    res.status(404).json({ message: "Blog post not found" });
    return null;
  }

  if (blog.author.toString() !== userId) {
    res.status(403).json({
      message:
        "You do not have permission to perform this action on this blog post",
    });
    return null;
  }

  return blog;
};

exports.editOwnBlogPost = async (req, res) => {
  const { blogId } = req.params;
  const updates = req.body;

  try {
    const blog = await findBlogPostByIdAndCheckOwnership(
      blogId,
      req.user.userId,
      res
    );
    if (!blog) return;

    if (req.file) {
      updates.imageUrl = req.file.path; // تحديث الصورة لو مرفوعة
    }

    Object.assign(blog, updates);
    await saveBlogPost(blog, res, "Blog post updated successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteOwnBlogPost = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await findBlogPostByIdAndCheckOwnership(
      blogId,
      req.user.userId,
      res
    );
    if (!blog) return;

    await blog.remove();
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name"); // جلب البلوجات مع اسم المؤلف
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlogPost = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId).populate("author", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const findBlogPostById = async (blogId, res) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    res.status(404).json({ message: "Blog post not found" });
    return null;
  }

  return blog;
};

const handleBlogInteraction = async (
  req,
  res,
  interactionCallback,
  successMessage
) => {
  const { blogId } = req.params;

  try {
    const blog = await findBlogPostById(blogId, res);
    if (!blog) return;

    await interactionCallback(blog);

    await blog.save();
    res.status(200).json({ message: successMessage, blog });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addCommentToBlogPost = async (req, res) => {
  const { text } = req.body;

  await handleBlogInteraction(
    req,
    res,
    (blog) => {
      blog.comments.push({
        user: req.user.userId, // ربط التعليق بالمستخدم الحالي
        text,
      });
    },
    "Comment added successfully"
  );
};

exports.addReactionToBlogPost = async (req, res) => {
  const { reactionType } = req.body;

  await handleBlogInteraction(
    req,
    res,
    (blog) => {
      blog.reactions.set(
        reactionType,
        (blog.reactions.get(reactionType) || 0) + 1
      );
    },
    "Reaction added successfully"
  );
};
