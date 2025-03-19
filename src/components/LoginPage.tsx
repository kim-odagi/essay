import React, { useState, useEffect } from 'react';
import { UserCircle, Lock, School, User } from 'lucide-react';
import PasswordChangeModal from './PasswordChangeModal';

type UserType = 'student' | 'admin';

interface LoginProps {
  onLogin: (userType: UserType, userData: any) => void;
}

// 테스트용 계정 데이터
const TEST_ACCOUNTS = {
  students: [
    { studentId: '10801', name: '김옥현', password: '1234', isFirstLogin: true }
  ],
  admins: [
    { username: 'admin', password: 'admin123' }
  ]
};

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [userType, setUserType] = useState<UserType>('student');
  const [grade, setGrade] = useState('');
  const [classNum, setClassNum] = useState('');
  const [studentNum, setStudentNum] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [studentId, setStudentId] = useState('');

  // 학년, 반, 번호가 변경될 때마다 학번 생성
  useEffect(() => {
    if (grade && classNum && studentNum) {
      // 학번 형식: 학년(1) + 반(2) + 번호(2) = 10801 형식
      const formattedClass = classNum.padStart(2, '0');
      const formattedNumber = studentNum.padStart(2, '0');
      const generatedId = `${grade}${formattedClass}${formattedNumber}`;
      setStudentId(generatedId);
    } else {
      setStudentId('');
    }
  }, [grade, classNum, studentNum]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (userType === 'student') {
      // 학생 로그인 검증
      if (!studentId || !name || !password) {
        setError('모든 필드를 입력해주세요.');
        return;
      }

      const studentIndex = TEST_ACCOUNTS.students.findIndex(
        s => s.studentId === studentId && s.name === name && s.password === password
      );

      if (studentIndex !== -1) {
        const student = TEST_ACCOUNTS.students[studentIndex];
        
        if (student.isFirstLogin) {
          // 첫 로그인인 경우 비밀번호 변경 모달 표시
          setCurrentStudent({ ...student, index: studentIndex });
          setShowPasswordChange(true);
        } else {
          // 첫 로그인이 아닌 경우 바로 로그인 처리
          onLogin('student', { studentId, name });
        }
      } else {
        setError('학번, 이름 또는 비밀번호가 일치하지 않습니다.');
      }
    } else {
      // 관리자 로그인 검증
      if (!username || !password) {
        setError('모든 필드를 입력해주세요.');
        return;
      }

      const admin = TEST_ACCOUNTS.admins.find(
        a => a.username === username && a.password === password
      );

      if (admin) {
        onLogin('admin', { username });
      } else {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    if (currentStudent && currentStudent.index !== undefined) {
      // 비밀번호 변경 및 첫 로그인 상태 업데이트
      TEST_ACCOUNTS.students[currentStudent.index].password = newPassword;
      TEST_ACCOUNTS.students[currentStudent.index].isFirstLogin = false;
      
      // 모달 닫기
      setShowPasswordChange(false);
      
      // 로그인 처리
      onLogin('student', { studentId: currentStudent.studentId, name: currentStudent.name });
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordChange(false);
    setCurrentStudent(null);
  };

  // 학년, 반, 번호 옵션 생성
  const gradeOptions = [1, 2, 3];
  const classOptions = Array.from({ length: 8 }, (_, i) => i + 1);
  const studentNumOptions = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            안산성호중학교
          </h2>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            글쓰기 포트폴리오
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            로그인하여 서비스를 이용해주세요
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex border-b mb-6">
            <button
              className={`pb-2 px-4 ${
                userType === 'student'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setUserType('student')}
            >
              학생 로그인
            </button>
            <button
              className={`pb-2 px-4 ${
                userType === 'admin'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setUserType('admin')}
            >
              관리자 로그인
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {userType === 'student' ? (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                      학년
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    >
                      <option value="">선택</option>
                      {gradeOptions.map((g) => (
                        <option key={g} value={g}>
                          {g}학년
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                      반
                    </label>
                    <select
                      id="class"
                      name="class"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                      value={classNum}
                      onChange={(e) => setClassNum(e.target.value)}
                    >
                      <option value="">선택</option>
                      {classOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}반
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="studentNum" className="block text-sm font-medium text-gray-700">
                      번호
                    </label>
                    <select
                      id="studentNum"
                      name="studentNum"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                      value={studentNum}
                      onChange={(e) => setStudentNum(e.target.value)}
                    >
                      <option value="">선택</option>
                      {studentNumOptions.map((n) => (
                        <option key={n} value={n}>
                          {n}번
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {studentId && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      학번: <span className="font-medium">{studentId}</span>
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    이름
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      placeholder="이름을 입력하세요"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  아이디
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    placeholder="관리자 아이디를 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPasswordChange && (
        <PasswordChangeModal 
          onPasswordChange={handlePasswordChange}
          onCancel={handleCancelPasswordChange}
        />
      )}
    </div>
  );
};

export default LoginPage;
