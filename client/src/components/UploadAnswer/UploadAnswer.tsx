import React, { useState, useRef, useEffect } from 'react'
import { IoIosCloudUpload } from 'react-icons/io'
import { IoCloudUploadOutline } from "react-icons/io5"
import { FaFileAlt } from "react-icons/fa"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface UploadAnswerProps {
  user_id: string;
  challenge_id: string;
  total_test_case: number;
}

type LogProps = {
  success: string;
  message: string;
  data: string;
};

export default function UploadAnswer({ user_id, challenge_id, total_test_case }: UploadAnswerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [log, setLog] = useState<LogProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passedTestCase, setPassedTestCase] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 99) {
            clearInterval(interval);
            return 99;
          }
          return Math.min(prevProgress + 2, 99);
        });
      }, 500);
    } else if (progress > 0 && progress < 100) {
      // When isLoading becomes false, quickly complete the progress bar
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 20);
    }

    return () => clearInterval(interval);
  }, [isLoading, progress]);

  const handleSubmitAnswer = (file: File) => {
    setProgress(0);
    setIsChecking(true);
    setIsLoading(true);
    setShowModal(true);
    setShowResult(false);
    
    const data = new FormData();
    data.append('userId', user_id);
    data.append('challengeId', challenge_id ?? "");
    data.append('file', file);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8000/submitAnswer',
      headers: { 
        'Authorization': `Bearer ${token}`, 
      },
      data: data,
    };

    axios.request(config)
      .then((response) => {
        const data = response.data;
        console.log(data);
        setSubmissionId(data.data.submission_id);
        setIsSuccess(data.data.status);
        setPassedTestCase(data.data.passed_test_case);
        setIsLoading(false);
        setIsChecking(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setIsChecking(false);
        setIsSuccess(false);
      });
  };

  const testCaseArray: number[] = Array.from({ length: total_test_case }, (_, index) => index + 1); 
  const passedTestCaseArray = String(passedTestCase).split('').map(Number);

  // Count total passed test cases
  const totalPassed = testCaseArray.reduce((count, testCase) => {
    return passedTestCaseArray.includes(testCase) ? count + 1 : count;
  }, 0);

  const getLog = () => {
    const url = process.env.REACT_APP_API_BASE_URL
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${url}/getSubmissionLog/${submissionId}`,
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    };

    axios.request(config)
    .then((response) => {
      const data = response.data;
      setLog(data);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className="mt-4">
      <h3 className="text-4xl text-white font-semibold mb-4">Upload Answer</h3>
      <div 
        className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors duration-300"
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          className="hidden" 
          accept=".js,.py,.php"
        />
        {file ? (
          <div className="flex flex-col items-center">
            <FaFileAlt className="text-5xl text-blue-500 mb-4" />
            <p className="text-lg text-white">{file.name}</p>
            <p className="text-sm text-gray-400 mt-2">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <IoCloudUploadOutline className="text-6xl text-gray-400 mb-4" />
            <p className="text-lg text-white mb-2">Drag and drop your file here</p>
            <p className="text-sm text-gray-400">or</p>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 flex items-center">
              <IoIosCloudUpload className="mr-2" />
              Choose File
            </button>
            <p className="text-xs text-gray-400 mt-4">
              Supported formats: .js, .py, .php
            </p>
          </div>
        )}
      </div>
      {file && (
        <div className="mt-4 flex justify-end">
          <button 
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
            onClick={() => handleSubmitAnswer(file)}
          >
            {isLoading ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="bg-white rounded-lg p-8 w-full max-w-screen-sm"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {progress < 100 ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-64 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-700">
                  {isLoading ? 'Checking your answer...' : 'Almost there...'}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {progress}%
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                {isSuccess ? (
                  <>
                    <div className="text-green-500 text-5xl mb-4">✓</div>
                    <p className="text-lg font-semibold text-green-500">Correct Answer!</p>
                    <p className="mt-2 text-gray-600">You passed {total_test_case} out of {total_test_case} test cases.</p>
                  </>
                ) : (
                  <>
                    <div className="text-red-500 text-5xl mb-4">✗</div>
                    <p className="text-lg font-semibold text-red-500">Incorrect Answer</p>
                    {testCaseArray.map((testCase) => (
                      <p key={testCase} className='mt-2'>
                        TestCase {testCase}:{' '}
                        <span className={passedTestCase.includes(testCase) ? 'text-green-500' : 'text-red-500'}>
                          {passedTestCase.includes(testCase) ? '✓' : '✗'}
                        </span>
                      </p>
                    ))}
                    <p className="mt-2 text-gray-600">You passed {totalPassed} out of {total_test_case} test cases.</p>
                    {log ? (
                      <>
                        <p className="mt-4 text-gray-600 font-semibold underline">Log Message</p>
                        <pre style={{
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          color: 'rgb(75 85 99)',
                          marginTop: "0.5rem"
                        }}
                        className=''>
                          {log.data
                            .replace(/^"|"$/g, '')
                            .replace(/\\n/g, '<br />')}
                        </pre>
                      </>
                    ) : (
                      <p className="mt-2 text-gray-600">Please try again or debug your code.</p>
                    )}
                    <div className="mt-4 flex space-x-4">
                      <button 
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                        onClick={getLog}
                      >
                        Debug
                      </button>
                      <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
                {isSuccess && (
                  <button 
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}