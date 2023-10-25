const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const { initialBlogs, blogsInDb, nonExistingId, usersInDb, getUserApiToken } = require("./test_helper");

const api = supertest(app);

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  token = await getUserApiToken(api)
  const blogsObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogsObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
}, 10000);

describe("getting all blogs", () => {
  test("blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("blogs to json have id property", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    response.body.forEach((element) => {
      expect(element.id).toBeDefined();
    });
  });
});
describe("adding a new blogs", () => {
  test("new blog can be stored", async () => {
    const newBlog = {
      title: "Blog Post Test",
      author: "Enmanuel Urena",
      url: "https://github.com/EnmanuelUrena/fullstack-open2023",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await blogsInDb();
    expect(response).toHaveLength(initialBlogs.length + 1);
    const blogPosted = response.find(
      (blog) => blog.author === newBlog.author
    );
    expect(blogPosted.title).toBe(newBlog.title);
  });

  test("likes property is missing, default must be 0", async () => {
    const newBlog = {
      title: "Blog Test",
      author: "Enmanuel Urena",
      url: "https://github.com/EnmanuelUrena/fullstack-open2023",
    };

    await api
      .post("/api/blogs")
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await blogsInDb();
    expect(response).toHaveLength(initialBlogs.length + 1);
    const blogPosted = response.find(
      (blog) => blog.author === "Enmanuel Urena"
    );
    expect(blogPosted.likes).toBe(0);
  });

  test("title property is missing, response code must be 400", async () => {
    const newBlog = {
      author: "Enmanuel Urena",
      url: "https://github.com/EnmanuelUrena/fullstack-open2023",
      likes: 2,
    };

    await api.post("/api/blogs")
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
  });

  test("url property is missing, response code must be 400", async () => {
    const newBlog = {
      title: "Blog Test",
      author: "Enmanuel Urena",
      likes: 3,
    };

    await api
    .post("/api/blogs")
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
  });

  test("new blog without Authorization can not be stored", async () => {
    const newBlog = {
      title: "Blog Post Test",
      author: "Enmanuel Urena",
      url: "https://github.com/EnmanuelUrena/fullstack-open2023",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

describe('delete a blog', () => {
  test("blog can be deleted", async () => {
    const newBlog = {
      title: "Blog Test",
      author: "Enmanuel Urena",
      url: "https://github.com/EnmanuelUrena/fullstack-open2023",
    };

    const blogToDelete = await api
      .post("/api/blogs")
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    await api
    .delete(`/api/blogs/${blogToDelete.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);

    const response = await blogsInDb();
    expect(response).toHaveLength(initialBlogs.length);
    const blogPosted = response.find((blog) => blog.id === blogToDelete.id);
    expect(blogPosted).not.toBeDefined();
  });
})

describe('update a blog', () => {
  test("blog can be updated", async () => {
    const blogToUpdate = await blogsInDb();
    const users = await usersInDb()
    const newBlog = {
      title: "Blog Test Update",
      author: "Enmanuel Urena",
      url: "https://github.com/EnmanuelUrena/fullstack-open2023",
      likes: 2,
      userId: users[0].id
    };

    await api
      .put(`/api/blogs/${blogToUpdate[0].id}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const response = await blogsInDb();
    expect(response).toHaveLength(initialBlogs.length);
    const blogPosted = response.find((blog) => blog.id === blogToUpdate[0].id);
    expect(blogPosted.title).toContain("Update");
  });
})

afterAll(async () => {
  await mongoose.connection.close();
});
