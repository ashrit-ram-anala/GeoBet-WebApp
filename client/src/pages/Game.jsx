import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";

const Game = ({ userName }) => {
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
  const [highlightedAnswer, setHighlightedAnswer] = useState(null);
  const [coinsGained, setCoinsGained] = useState(0);

  
  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/all");
      const fetchedQuestions = response.data.results;

      setQuestions(fetchedQuestions);
      loadQuestion(0, fetchedQuestions);
    } catch (error) {
      console.error('Error fetching the questions:', error);
    }
  };

  useEffect(() => {
    setBetAmount((betPercentage / 100) * coins);
  }, [coins, betPercentage]);

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

    setHighlightedAnswer(currentQuestion.correct_answer);

    setTimeout(()=>{
    if (timeOut) {
      newCoins -= 500; 
      setCoinsGained(coinsGained - 500);
      newCoins = Math.round(newCoins);
      if (newCoins < 0) {
        newCoins =0;
      }
    } else if (selectedOption === currentQuestion.correct_answer) {
      const coinsEarned = (timeLeft * 2.5) / 2 + betAmount;
      newCoins += coinsEarned;
      setCoinsGained(coinsGained + coinsEarned);
      newCoins = Math.round(newCoins);
      newQuestionsAnswered += 1; 
    } else {
      const coinsLost = betAmount + ((timeLeft * 2.5) / 2); 
      newCoins -= coinsLost;
      setCoinsGained(coinsGained - coinsLost);
      newCoins = Math.round(newCoins);
      newWrongAnswers += 1; 
      if (newCoins < 0) {
        newCoins = 0;
      }
    }

    if (newWrongAnswers >= 5) {
      endGame(newCoins, newQuestionsAnswered, 'lost');
    } else if (newCoins >= 0) {
      setCoins(newCoins);

      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        loadQuestion(nextIndex);
        setTimerActive(true); 
      } else {
        const finalCoins = newCoins + 1000; 
        const finalScore = Math.round(coinsGained * newQuestionsAnswered); 
        setCoins(finalCoins);
        setTotalScore(finalScore);
        setGameResult('won');
        setGameFinished(true);
        saveGameData(finalCoins, finalScore);
      
        const userData = {
          coins: finalCoins,
          score: finalScore,
          questionsAnswered: questionsAnswered
        };
      
        axios.post('http://localhost:8080/api/save-game', userData)
          .then(response => {
            console.log('Game data successfully sent to backend:', response.data);
          })
          .catch(error => {
            console.error('Error sending game data to backend:', error);
          });
      }

      setQuestionsAnswered(newQuestionsAnswered);
      setWrongAnswers(newWrongAnswers);
      
    }
    setHighlightedAnswer(null);
  },1000);
  };

  const saveGameData = (finalCoins, finalScore) => {
    localStorage.setItem('coins', finalCoins);
    const highestScore = Math.max(localStorage.getItem('highestScore') || 0, finalScore);
    localStorage.setItem('highestScore', highestScore);
  };

  const endGame = (finalCoins, newQuestionsAnswered, result) => {
    setCoins(finalCoins);
    setTotalScore(finalCoins * newQuestionsAnswered);
    setGameResult(result);
    setGameFinished(true);
    saveGameData(finalCoins, finalCoins * newQuestionsAnswered);

    const userData = {
      coins: finalCoins,
      score: finalCoins * newQuestionsAnswered,
      questionsAnswered: questionsAnswered
  };

  axios.post('http://localhost:8080/api/save-game', userData)
      .then(response => {
          console.log('Game data successfully sent to backend:', response.data);
      })
      .catch(error => {
          console.error('Error sending game data to backend:', error);
      });
  };

  useEffect(() => {
    const storedCoins = parseInt(localStorage.getItem('coins'));
    if (!isNaN(storedCoins)) {
      setCoins(storedCoins);
    }
    fetchAPI();
  }, []);

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div>
      <NavBar />
      <div className="p-4 flex justify-center mt-10">
        {!gameStarted ? (
           <a href="#" className="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Game Instructions</h2>
              <p className="text-lg text-red-500">Disclaimer: May need to refresh several times if questions not loading. Questions API rate-limits me :(</p>
              <br></br>
              <p className="text-lg">You start this session with {coins} coins. answer trivia and make bets!</p>
              <p className="text-lg">- Each geography trivia question has a 20-second timer.</p>
      <p className="text-lg">- Each second is worth 1 coin. The faster you answer, the more coins you earn.</p>
      <p className="text-lg">- If you are a returning player, you start with your current coin value (100 if first time).</p>
      <p className="text-lg">- Your score is your new coins earned x questions answered correctly. If you lose your bets, your score is 0 as you gained nothing</p>
      <p className="text-lg">- You lose if you get 5 wrong.</p>
      <p className="text-lg">- To beat the house, answer 25 randomly selected multiple choice geography questions in under 5 mistakes.</p>
      <p className="text-lg">- All scores of those who make no money are 0. Losses (5 wrong) still get scores.</p>
      <p className="text-lg">- Happy Gambling.</p>
              <div className="mt-6 flex justify-center">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setGameStarted(true);
                    setTimerActive(true); 
                  }}
                >
                  Start Game
                </button>
              </div>
            </div>
           </a>
        ) : gameFinished ? (
          <div className="flex justify-center items-center card bg-base-300 w-96 h-80 shadow-xl">
            <div className="card-body flex flex-col items-center">
            <h2 className="card-title">
                {gameResult === 'lost' ? 'Never bet against the house. You Lose.' : gameResult === 'debt' ? 'Never bet against the house.  game over.' : 'You beat the house. For now.'}
              </h2>
              <p className="text-lg">
                {gameResult === 'lost'
                  ? 'You got 5 questions wrong!'
                  : gameResult === 'debt'
                  ? 'You went into debt!'
                  : 'You have earned an additional 1000 coins!'}
              </p>
              <p className="text-lg font-bold">Total Coins: {coins}</p>
              <p className="text-lg font-bold">Total Score: {totalScore}</p>
              <div className="mt-4">
                <a href="/" className="btn btn-primary mr-2">Home</a>
                <a href="/game" className="btn btn-accent mr-2">Play Again</a>
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
                      className={`btn ${highlightedAnswer === option ? 'btn-success' : 'btn-primary'}`} 
                      onClick={() => handleNextQuestion(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="mb-4 flex justify-center">
                  <p className="text-lg font-bold">Coins: {coins}</p>
                </div>

                <div className="mb-4 flex justify-center">
                  <label htmlFor="bet" className="mr-2">
                    Bet:
                  </label>
                  <select
                    id="bet"
                    className="select select-bordered"
                    value={betPercentage}
                    onChange={handleBetChange}
                  >
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="25">25%</option>
                    <option value="50">50%</option>
                    <option value="100">All in</option>
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