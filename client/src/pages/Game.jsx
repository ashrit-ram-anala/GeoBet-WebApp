import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";

const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [coins, setCoins] = useState(100); 
  const [gameFinished, setGameFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const [betPercentage, setBetPercentage] = useState(5); 
  const [betAmount, setBetAmount] = useState((5 / 100) * 100); 
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [totalScore, setTotalScore] = useState(0); 
  const [gameResult, setGameResult] = useState(''); 
  const [gameStarted, setGameStarted] = useState(false);

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/medium");
      const fetchedQuestions = response.data.results;

      setQuestions(fetchedQuestions);
      loadQuestion(0, fetchedQuestions);
    } catch (error) {
      console.error('Error fetching the questions:', error);
    }
  };

  const loadQuestion = (index, fetchedQuestions = questions) => {
    const currentQuestion = fetchedQuestions[index];
    const allOptions = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    setOptions(shuffledOptions);
    setTimeLeft(20); 
    setProgress(100); 
  };

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0 && gameStarted) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setProgress((timeLeft / 20) * 100);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) { 
      setTimerActive(false);
      handleNextQuestion(null, true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, gameStarted]);

  const handleBetChange = (event) => {
    const percentage = parseInt(event.target.value);
    setBetPercentage(percentage);
    setBetAmount((percentage / 100) * coins);
  };

  const handleNextQuestion = (selectedOption, timeOut = false) => {
    const currentQuestion = questions[currentQuestionIndex];
    setTimerActive(false);

    let newCoins = coins;
    let newQuestionsAnswered = questionsAnswered;
    let newWrongAnswers = wrongAnswers;

    if (timeOut) {
      newCoins -= 100; 
      if (newCoins < 0) {
        setCoins(newCoins);
        setTotalScore(0); 
        setGameResult('debt');
        setGameFinished(true); 
        return;
      }
    } else if (selectedOption === currentQuestion.correct_answer) {
      const coinsEarned = (timeLeft * 5)/2 + betAmount;
      newCoins += coinsEarned;
      newQuestionsAnswered += 1; 
    } else {
      const coinsLost = betAmount + ((timeLeft * 5)/2); 
      newCoins -= coinsLost;
      newWrongAnswers += 1; 
      if (newCoins < 0) {
        setCoins(newCoins);
        setTotalScore(0); 
        setGameResult('debt');
        setGameFinished(true);
        return;
      }
    }

    if (newWrongAnswers >= 5) {
      setCoins(newCoins);
      setTotalScore(newQuestionsAnswered * coins);
      setGameResult('lost'); 
      setGameFinished(true); 
    } else if (newCoins >= 0) {
      setCoins(newCoins);

      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        loadQuestion(nextIndex);
        setTimerActive(true); 
      } else {
        setGameFinished(true);
        setCoins(newCoins + 200);
        setTotalScore(newCoins * newQuestionsAnswered); 
        setGameResult('won');
      }

      setQuestionsAnswered(newQuestionsAnswered);
      setWrongAnswers(newWrongAnswers);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <NavBar />
      <div className="p-4 flex justify-center mt-10">
        {!gameStarted ? (
           <a href="#" class="block  p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="card-body">
            <h2 className="card-title text-center mb-4">Game Instructions</h2>
      <p className="text-lg">- Each geography trivia question has a 20-second timer.</p>
      <p className="text-lg">- Each second is worth 5 points. The faster you answer, the more points you earn.</p>
      <p className="text-lg">- Bet coins for each question.</p>
      <p className="text-lg">- If you are a first time player, you start with 100 coins.</p>
      <p className="text-lg">- If you are a returning player, you start with your current coin value.</p>
      <p className="text-lg">- If you go into debt (negative coin value) then your rounds after will be taxed and 90% of your earned coins will be taken.</p>
      <p className="text-lg">- Your score is your coins earned x questions answered correctly.</p>
      <p className="text-lg">- You lose if you go into debt or get 5 wrong.</p>
      <p className="text-lg">- To beat the house, answer 25 randomly selected multiple choice geography questions in under 5 mistakes and without going into debt.</p>
      <p className="text-lg">- All scores of those who are in debt or go into debt are 0. Losses (5 wrong) still get scores.</p>
      <p className="text-lg">- Happy Gambling.</p>
              <div className="mt-6 flex justify-center">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setGameStarted(true); // Start the game
                    setTimerActive(true);  // Start the timer
                  }}
                >
                  Next
                </button>
              </div>
            </div>
            </a>
          
        ) : gameFinished ? (
          <div className="flex justify-center items-center card bg-base-300 w-96 h-80 shadow-xl">
            <div className="card-body flex flex-col items-center">
              <h2 className="card-title">
                {gameResult === 'lost' ? 'Never bet against the house. \n You Lose.' : gameResult === 'debt' ? 'Never bet against the house. \n game over.' : 'You beat the house. \n For now.'}
              </h2>
              <p className="text-lg">
                {gameResult === 'lost'
                  ? 'You got 5 questions wrong!'
                  : gameResult === 'debt'
                  ? 'You went into debt!'
                  : 'You have earned an additional 200 coins!'}
              </p>
              <p className="text-lg font-bold">Total Coins: {coins}</p>
              <p className="text-lg font-bold">Total Score: {totalScore}</p>
              <div className="mt-4">
                <a href="/" className="btn btn-primary mr-2">Home</a>
                <a href="/game" className="btn btn-accent mr-2">Bet Again</a>
                <a href="/leaderboard" className="btn btn-secondary">Leaderboard</a>
              </div>
            </div>
          </div>
        ) : (
          currentQuestion && (
            <div className="flex justify-center items-center card bg-base-300 w-3/4 h-96 shadow-xl">
              <div className="card-body">
                <div className="w-full bg-gray-200 h-4 rounded-full mb-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <h2 className="card-title mb-4">{currentQuestion.question}</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      className="btn btn-primary"
                      onClick={() => handleNextQuestion(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="mb-4 flex justify-center">
                  <p className="text-lg font-bold">Coins: {coins}</p>
                </div>

                <div className="mb-4 flex justify-end">
                  <label htmlFor="bet" className="mr-4">Bet:</label>
                  <select
                    id="bet"
                    className="select select-primary"
                    onChange={handleBetChange}
                    value={betPercentage}
                  >
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                    <option value="25">25%</option>
                    <option value="50">50%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Game;
