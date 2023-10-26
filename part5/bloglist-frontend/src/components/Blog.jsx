import BlogForm from "./BlogForm";
import { LoginInfo } from "./LoginForm";
import Notification from "./Notification";

const Blogs = ({ blogs, setBlogs, user, setUser, successMessage, setSuccessMessage}) => (
  <div>
    <h2>blogs</h2>
    <Notification message={successMessage} className={"success"}/>
    <LoginInfo user={user} setUser={setUser}/>
    <p></p>
    <BlogForm blogs={blogs} setBlogs={setBlogs} setSuccessMessage={setSuccessMessage}/>
    <p></p>
    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog} />
    ))}
  </div>
);

const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>
);

export default Blogs;
