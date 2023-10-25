const blogsRouter = require("express").Router();
const middleware = require('../utils/middleware')
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user

  if (!title || !url) {
    return response.status(400).end();
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id

  });
  const newBlog = await blog.save();
  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()
  response.status(201).json(newBlog);
});

blogsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (blog) {
    return response.json(blog);
  } else {
    return response.status(404).end()
  }
});

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
  const BlogId = request.params.id;
  const user = request.user

  const blog = await Blog.findById(BlogId)

  if(!(blog.user.toString() === user._id.toString())){
    return response.status(401).json({error: "unauthorized user"})
  }
  await Blog.findByIdAndDelete(BlogId);
  return response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  if (!request.body.title || !request.body.url) {
    return response.status(400).end();
  }
  const newBlog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, { new: true });
  return response.json(updatedBlog);
});

module.exports = blogsRouter;
