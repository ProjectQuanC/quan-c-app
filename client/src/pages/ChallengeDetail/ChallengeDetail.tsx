import React, { useState, useEffect } from 'react';
import ChallengeDescription from '../../components/ChallengeDescription/ChallengeDescription';
import RepoClone from '../../components/RepoClone/RepoClone';
import UploadAnswer from '../../components/UploadAnswer/UploadAnswer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { UserState } from '../../store/reducer/user/userTypes';
import { fetchUserData } from '../../store/features/user/userAction';

interface ChallengeDetail {
  challenge_id: string;
  challenge_title: string;
  repo_link: string;
  points: number;
  total_test_case: number;
}

const ChallengeDetail = () => {
  const dispatch: AppDispatch = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id') || '';
  const [challengeDetail, setChallengeDetail] = useState<ChallengeDetail | null>(null);

  const { user } = useSelector((state: RootState) => state.user as UserState);

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getChallengeDetails/${id}`);
        const data = await response.json();
        setChallengeDetail(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChallengeDetails();
    dispatch(fetchUserData());
  }, [id]);

  return (
    <div
      className="collaborate-container-margin lg:flex lg:justify-center"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }}
    >
      {challengeDetail && (
        <div>
          <ChallengeDescription
            repo_link={challengeDetail.repo_link}
          />

          <RepoClone
            repo_link={challengeDetail.repo_link}
          />

          <UploadAnswer 
            user_id={user?.app_data.user_id ?? ""} 
            challenge_id={challengeDetail.challenge_id} 
            total_test_case={challengeDetail.total_test_case} 
          />
        </div>
      )}
    </div>
  );
};

export default ChallengeDetail 