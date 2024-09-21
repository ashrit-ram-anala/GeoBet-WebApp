import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";

const Game = () => { 
// state variables
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
  const [userName, setUserName] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [hintAvailable, setHintAvailable] = useState(true);
  const [highlightedIncorrectAnswer, setHighlightedIncorrectAnswer] = useState(null); 


  
  const fetchAPI = async () => {
      const response = await axios.get("http://localhost:8080/api/all"); // get endpoint
      const fetchedQuestions = response.data.results;

      for(let i=0; i<fetchedQuestions.length; i++){
        fetchedQuestions[i].question = decodeHtml(fetchedQuestions[i].question) // converts json special characters into readable string
      }
      setQuestions(fetchedQuestions); 
      loadQuestion(0, fetchedQuestions);

  };

  function decodeHtml(html) { //function to convert json into readable string
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    return dom.body.textContent || '';
}

  useEffect(() => { 
    setBetAmount((betPercentage / 100) * coins); //recalculates bet as side effect whenever coins or betpercentage update
  }, [coins, betPercentage]);

  const loadQuestion = (index, fetchedQuestions = questions) => { 
    const currentQuestion = fetchedQuestions[index];
    const allOptions = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers]; // gets current options
    for(let i =0; i< allOptions.length; i++){ 
      allOptions[i] = decodeHtml(allOptions[i]); // changes answers to proper strings, same as before
    }
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5); //shuffles questions for randomization

    setOptions(shuffledOptions);
    setTimeLeft(20);
    setProgress(100);
  };

  useEffect(() => {  // timer updates based on updates to time left, if timer active, and if game even began
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
    setBetAmount((percentage / 100) * coins); //sets bet amount when changed in dropdown
  };

  const handleNextQuestion = (selectedOption, timeOut = false) => {
    const currentQuestion = questions[currentQuestionIndex];
    setTimerActive(false);

    let newCoins = coins;
    let newQuestionsAnswered = questionsAnswered;
    let newWrongAnswers = wrongAnswers;

    setHighlightedAnswer(currentQuestion.correct_answer); //highlights correct answer in green after

    setTimeout(()=>{
      if (selectedOption !== currentQuestion.correct_answer) {
        
        setHighlightedIncorrectAnswer(currentQuestion.correct_answer);  //highlights incorrect answer as a hint
      } else {
        setHighlightedIncorrectAnswer(null); 
      }
    if (timeOut) {
      newCoins -= 5000; //takes away 5K if run out of time
      setCoinsGained(coinsGained - 5000);
      newCoins = Math.round(newCoins);
      if (newCoins < 0) {
        newCoins =0; // cannot go into debt, resets to 0 if negative
      }
    } else if (selectedOption === currentQuestion.correct_answer) {
      const coinsEarned = (timeLeft * 2.5) / 2 + betAmount; //coins earned calculation
      newCoins += coinsEarned;
      setCoinsGained(coinsGained + coinsEarned);
      newCoins = Math.round(newCoins);
      newQuestionsAnswered += 1; 
    } else {
      const coinsLost = betAmount + ((timeLeft * 2.5) / 2); // coins lost calculation
      newCoins -= coinsLost;
      setCoinsGained(coinsGained - coinsLost);
      newCoins = Math.round(newCoins);
      newWrongAnswers += 1; //keeps track of wrong answers, needs to be <5
      if (newCoins < 0) {
        newCoins = 0;
      }
    }

    if (newWrongAnswers >= 5) {
      endGame(newCoins, newQuestionsAnswered, 'lost'); //ends game if 5 wrong
    } else if (newCoins >= 0) {
      setCoins(newCoins);

      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < questions.length) { //logic to keep sending in questions, if less than array length then still more to go
        setCurrentQuestionIndex(nextIndex);
        loadQuestion(nextIndex);
        setTimerActive(true); 
      } else { // logic for if all 25 answered in under 5 wrong
        const finalCoins = newCoins + 1000; 
        const finalScore = Math.round(coinsGained * newQuestionsAnswered); 
        setCoins(finalCoins); //all of these set and save user scores
        setTotalScore(finalScore); 
        setGameResult('won');
        setGameFinished(true);
        saveGameData(finalCoins, finalScore); 
      
        const userData = { //sends to mongo database (for the game lose condition)
          userDisplayName: userName,
          coins: finalCoins,
          score: finalScore,
          questionsAnswered: questionsAnswered
        };
      if(userName != ""){ // user has to be logged in, so name is not empty string
        axios.post('http://localhost:8080/api/save-game', userData) // posts to backend
          .then(response => {
            console.log('game has successfully saved', response.data); //log in case for errors with sending that occurs
          })
        }
      }

      setQuestionsAnswered(newQuestionsAnswered);
      setWrongAnswers(newWrongAnswers);
      
    }
    setHighlightedAnswer(null);
  },1000);
  };

  const saveGameData = (finalCoins, finalScore) => { //saves data to local storage
    localStorage.setItem('coins', finalCoins);
    const highestScore = Math.max(localStorage.getItem('highestScore') || 0, finalScore); //identifies max score and next line saves
    localStorage.setItem('highestScore', highestScore);
  };

  const endGame = (finalCoins, newQuestionsAnswered, result) => { // saves and sets all coin values and ends game
    setCoins(finalCoins);
    setTotalScore(finalCoins * newQuestionsAnswered);
    setGameResult(result);
    setGameFinished(true);
    saveGameData(finalCoins, finalCoins * newQuestionsAnswered);

    const userData = { // sends to mongo database (for the game win condition)
      userDisplayName: userName,
      coins: finalCoins,
      score: finalCoins * newQuestionsAnswered,
      questionsAnswered: questionsAnswered
  };
if(userName != ""){ // same as before, need to login
  axios.post('http://localhost:8080/api/save-game', userData)
      .then(response => {
          console.log('Game data successfully sent to backend:', response.data);
      })
  };
  }

  useEffect(() => {
    const storedCoins = parseInt(localStorage.getItem('coins')); // gets coins to show to user
    if (!isNaN(storedCoins)) {
      setCoins(storedCoins);
    }
    fetchAPI(); // calls fetch
  }, []);

  const currentQuestion = questions[currentQuestionIndex]

  const useHint = () => { // hint manager to make sure only 1 hint and which wrong option is highlighted
    if (!hintUsed && hintAvailable) {
      const incorrectOptions = options.filter(option => option !== currentQuestion.correct_answer);
      const incorrectOption = incorrectOptions[0]; 
      setHighlightedIncorrectAnswer(incorrectOption);
      setHintUsed(true); //sets usehint to true so cannot use again for the round
    }
  };

  return (
    <div>
      <NavBar setUser={setUserName}/>
      <div className="p-4 flex justify-center mt-10">
        {!gameStarted ? (
           <a href="#" className="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="card-body">
              <div className="flex justify-center items-center">
              <h2 className="card-title text-center mb-4">Game Instructions</h2>
              </div>
              <p className="text-lg text-red-500">Disclaimer: May need to refresh several times or close and reopen the tab if questions are not loading. Questions API rate-limits me :(</p>
                <p className="text-lg text-cyan-500">Don't forget to log in! Only logged in users appear on the leaderboard</p>
              <br></br>
              <p className="text-lg">You start this session with {coins} coins. answer trivia and make bets!</p>
      <p className="text-lg">- You have 20 seconds and each second is worth 1 coin. The faster you answer, the more coins you earn.</p>
      <p className="text-lg">- You are allowed 1 hint per game that takes away 1 incorrect option with no penalty</p>
      <p className="text-lg">- Your score is your new coins earned x questions answered correctly. Your coin amount transfers between rounds.</p>
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
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-primary">
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
                  className={`btn ${highlightedAnswer === option ? 'btn-success' : 
                              highlightedIncorrectAnswer === option ? 'btn-error' : 'btn-primary'}`}
                  onClick={() => handleNextQuestion(option)}
                >
                  {option}
                </button>
              ))}

                </div>
                <div className="mb-4 flex">
                  <p className="text-lg font-bold">Coins: {coins}</p>
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
                {!hintUsed && hintAvailable && (
          <button
            className="mb-4 btn btn-primary text-black"
            onClick={useHint}
          >
            Use Hint
            
          </button>
        )}   
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Game;
