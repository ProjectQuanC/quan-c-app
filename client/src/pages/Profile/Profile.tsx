import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchUserData } from '../../store/features/user/userAction'; // Update import if necessary
import { FaArrowRight } from 'react-icons/fa';
import Table from '../../components/Table/Table';
import { UserState } from '../../store/reducer/user/userTypes'; // Import UserState if defined in userTypes

const Profile = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Explicitly type the selector
  const { user, loading, error } = useSelector((state: RootState) => state.user as UserState);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const navigateToChallengeDetail = (id: string, link: string, totalTestCase: number) => {
    const urlParts = link.split('/');
    const repoName = urlParts.slice(-2).join('/');
    navigate(`/challenge-detail?id=${id}&link=${encodeURIComponent(repoName)}&total_test_case=${totalTestCase}`);
  };

  const tableHeaders = [
    'Challenge Title',
    'Status',
    'Passed Test Case',
    'Case Detail'
  ];

  return (
    <div className="p-24">
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && user && (
        <div>
          <div className="flex items-center mb-8">
            <img src={user.avatar_url} alt="User Avatar" className="w-24 h-24 rounded-full mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-lg text-gray-400">Points: {user.app_data.total_points}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table
              headers={tableHeaders}
              elements={user.app_data.submissions_history.map((history: { challengeTitle: any; status: any; passedTestCaseCount: any; totalTestCase: number; challengeId: string; repoLink: string; }) => ({
                title: history.challengeTitle,
                status: history.status ? "Passed" : "Failed",
                passedCases: `${history.passedTestCaseCount}/${history.totalTestCase}`,
                detailButton: (
                  <button
                    onClick={() => navigateToChallengeDetail(history.challengeId, history.repoLink, history.totalTestCase)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    Challenge
                    <FaArrowRight className="ml-2 mt-0.5" />
                  </button>
                )
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
