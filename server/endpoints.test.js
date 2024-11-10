const request = require("supertest");
const axios = require("axios");
const { app, userModel } = require("../server");

jest.mock("axios");

describe("API Tests", () => {
  const mockResponse = {
    data: [
      { question: "Question 1", correct_answer: "Answer 1", incorrect_answers: ["Answer 2", "Answer 3"] },
      { question: "Question 2", correct_answer: "Answer 2", incorrect_answers: ["Answer 1", "Answer 3"] },
    ],
  };

  const mockUsers = [
    { userDisplayName: "User1", score: 1000, coins: 100, questionsAnswered: 5 },
    { userDisplayName: "User2", score: 1500, coins: 200, questionsAnswered: 10 },
  ];

  it("should fetch 25 trivia questions from /api/all", async () => {
    axios.get.mockResolvedValue(mockResponse);

    const res = await request(app).get("/api/all");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse.data);
  });

  it("should fetch easy trivia questions from /api/easy", async () => {
    axios.get.mockResolvedValue(mockResponse);

    const res = await request(app).get("/api/easy");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResponse.data);
  });

  it("should return leaderboard sorted by score from /api/leaderboard", async () => {
    const mockFind = jest.spyOn(userModel, "find").mockResolvedValue(mockUsers);

    const res = await request(app).get("/api/leaderboard");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUsers);
    expect(mockFind).toHaveBeenCalled();
  });

  it("should save a new user in /api/save-game if user doesn't exist", async () => {
    const newUser = { userDisplayName: "NewUser", score: 100, coins: 50, questionsAnswered: 3 };

    const mockFindOne = jest.spyOn(userModel, "findOne").mockResolvedValue(null);
    const mockSave = jest.spyOn(userModel.prototype, "save").mockResolvedValue(newUser);

    const res = await request(app).post("/api/save-game").send(newUser);

    expect(res.status).toBe(200);
    expect(mockFindOne).toHaveBeenCalledWith({ userDisplayName: "NewUser" });
    expect(mockSave).toHaveBeenCalled();
  });

  it("should update an existing user if score is higher in /api/save-game", async () => {
    const existingUser = { 
      userDisplayName: "ExistingUser", score: 100, coins: 50, questionsAnswered: 3, 
      save: jest.fn().mockResolvedValue() 
    };

    const updatedUserData = { userDisplayName: "ExistingUser", score: 200, coins: 100, questionsAnswered: 5 };

    const mockFindOne = jest.spyOn(userModel, "findOne").mockResolvedValue(existingUser);

    const res = await request(app).post("/api/save-game").send(updatedUserData);

    expect(res.status).toBe(200);
    expect(mockFindOne).toHaveBeenCalledWith({ userDisplayName: "ExistingUser" });
    expect(existingUser.save).toHaveBeenCalled();
  });

  it("should not update existing user if score is not higher in /api/save-game", async () => {
    const existingUser = { 
      userDisplayName: "ExistingUser", score: 200, coins: 100, questionsAnswered: 5, 
      save: jest.fn().mockResolvedValue() 
    };

    const newUserData = { userDisplayName: "ExistingUser", score: 100, coins: 50, questionsAnswered: 3 };

    const mockFindOne = jest.spyOn(userModel, "findOne").mockResolvedValue(existingUser);

    const res = await request(app).post("/api/save-game").send(newUserData);

    expect(res.status).toBe(200);
    expect(mockFindOne).toHaveBeenCalledWith({ userDisplayName: "ExistingUser" });
    expect(existingUser.save).not.toHaveBeenCalled();
  });
});
