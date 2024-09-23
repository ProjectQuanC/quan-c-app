import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeaderboard } from '../../store/features/leaderboard/leaderboardAction';
import { RootState, AppDispatch } from '../../store/store';
import { LeaderboardEntry } from '../../store/types/types';
import { UserState } from '../../store/reducer/user/userTypes';
import { fetchUserData } from '../../store/features/user/userAction';

const Leaderboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { leaderboard, loading, error, userRank } = useSelector((state: RootState) => state.leaderboard);

  // Fetch the user from the Redux store
  const { user } = useSelector((state: RootState) => state.user as UserState);

  // Get the userId from the app_data if available
  const userId = user?.app_data?.user_id;
  const avatar_url = user?.avatar_url;

  // Extract the challengeId from the URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const challengeId = searchParams.get('id') || '';

  useEffect(() => {
    if (userId && challengeId) {
      dispatch(fetchLeaderboard(userId, challengeId));
    } else {
      dispatch(fetchUserData());
    }
  }, [dispatch, userId, challengeId]);

  return (
    <div className="flex flex-col md:flex-row justify-between p-6 gap-4 text-white">
      {/* Left Section - User Profile */}
      <div className="md:w-1/3 p-4 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center mb-6 md:mb-0">
        {avatar_url && (
          <img
            className="w-24 h-24 rounded-full mb-4"
            src={avatar_url}
            alt={user.name || 'User Avatar'}
          />
        )}
        <h2 className="text-xl font-semibold mb-2">{user?.name || 'Username'}</h2>
        <p className="text-lg text-gray-400">Rank: {userRank}</p>
      </div>

      {/* Right Section - Leaderboard List */}
      <div className="md:w-2/3 p-4 bg-gray-800 rounded-lg shadow-lg">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        
        <ul className="space-y-4">
          {leaderboard.map((entry: LeaderboardEntry) => (
            <li
              key={entry.user_id}
              className="flex items-center bg-gray-700 rounded-lg p-4 shadow-md"
            >
              <img
                className="w-12 h-12 rounded-full mr-4"
                src={entry.user_github_data.avatar_url}
                alt={entry.user_github_data.login}
              />
              <div>
                <p className="text-lg font-semibold">Rank: {entry.rank}</p>
                <p className="text-gray-400">Username: {entry.user_github_data.login}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;