import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EssayCorrector from './components/EssayCorrector';
import LoginPage from './components/LoginPage';
import StudentHome from './components/StudentHome';

type UserType = 'student';

interface User {
  type: UserType;
  data: {
    name: string;
    studentId: string;
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userType: UserType, userData: any) => {
    setUser({ type: userType, data: userData });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-indigo-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">안산성호중학교 글쓰기 포트폴리오</h1>
              <p className="text-sm opacity-80">AI를 활용한 학생 에세이 첨삭 도구</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span>{user.data.name} 학생님 환영합니다</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm"
              >
                로그아웃
              </button>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route 
              path="/" 
              element={
                <StudentHome 
                  studentName={user.data.name} 
                  studentId={user.data.studentId} 
                />
              } 
            />
            <Route path="/essay/new" element={<EssayCorrector />} />
            <Route path="/essay/:id" element={<EssayCorrector />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-100 border-t py-6">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} 학생 글 첨삭 서비스. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
