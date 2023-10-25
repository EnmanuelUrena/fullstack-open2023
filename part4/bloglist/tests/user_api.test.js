const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const { usersInDb, initialUsers } = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({})
  const userObjects = initialUsers.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
}, 10000);

describe("getting all users", () => {
  test("users are returned as json", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toHaveLength(initialUsers.length);
  });

  test("users to json doesnt have passwordHash property", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    response.body.forEach((element) => {
      expect(element.passwordHash).not.toBeDefined();
    });
  });
});

describe("adding a new users", () => {
  test("new user can be stored", async () => {
    const newUser = {
      username: "martinmoran",
      name: "Martin Moran",
      password: "DevPassword1"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await usersInDb();
    expect(response).toHaveLength(initialUsers.length + 1);
    const userPosted = response.find(
      (user) => user.username === newUser.username
    );
    expect(userPosted.username).toBe(newUser.username);
  });

  test("username property is missing, new user can not be stored", async () => {
    const newUser = {
      username: "",
      name: "Martin Moran",
      password: "DevPassword1"
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
      
      expect(response.body).toEqual({"error": "invalid username or password"});
  });

  test("password property is missing, new user can not be stored", async () => {
    const newUser = {
      username: "martinmoran",
      name: "Martin Moran",
      password: ""
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

      expect(response.body).toEqual({error: "invalid username or password"});
  });

});

afterAll(async () => {
  await mongoose.connection.close();
});
