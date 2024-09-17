import { useEffect, useState } from 'react'
import NavBar from "../components/NavBar"
import axios from 'axios'

const Leaderboard = ({}) => {
   const [users, setUsers] = useState([])
  useEffect(()=>{
    axios.get('https://geo-bet-web-app-backend.vercel.app/api/leaderboard')
      .then(users => setUsers(users.data))
  }, [])

  return (
    <div>
      <NavBar />
    <div className="overflow-x-auto m-5">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Top 100 Best Bets</h2>
      <h4 className="text-2sm font-bold mb-4 text-gray text-center">Categorized By Each User's Single Best Score</h4>
      <div className="flex justify-center items-center">
      <table className="table w-6/12 bg-slate-700">
        
        <thead>
          <tr className="text-primary">
             <th className="w-1/12">Rank</th>
             <th className="w-1/4">User</th>
            <th className="w-1/4">Score</th>
            <th className="w-1/4">Coins</th>
           <th className="w-2/12">Correctly Answered</th>
          </tr>
        </thead>
       
        <tbody>
        {users.map((user, index) => {
                let rowClass = '';
                let rankDisplay = index + 1;
                if (index === 0) {
                  rowClass = 'bg-yellow-400/50';
                  rankDisplay = '🥇';
                } else if (index === 1) {
                  rowClass = 'bg-gray-300/50';
                  rankDisplay = '🥈';
                } else if (index === 2) {
                  rowClass = 'bg-orange-400/50'; 
                  rankDisplay = '🥉';
                }
                if(index+1 === users.length){
                  rowClass = 'bg-red-900/60'
                }

                return (
                  <tr key={index} className={`${rowClass}`}>
                      <td className="text-white">
                      {rankDisplay}
                    </td>
                    <td className="text-white">{user.userDisplayName}</td>
                    <td className="text-white">{user.score}</td>
                    <td className="text-white">{user.coins}</td>
                    <td className="text-white">{user.questionsAnswered}</td>
                  </tr>
                );
              })}
            </tbody>
      </table>
    </div>
    </div>
    </div>

  );
};

export default Leaderboard;
