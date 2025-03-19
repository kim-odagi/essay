import React, { useState } from 'react';
import { Plus, FileText, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Essay {
  id: string;
  title: string;
  createdAt: Date;
  lastModified: Date;
}

interface StudentHomeProps {
  studentName: string;
  studentId: string;
}

const StudentHome: React.FC<StudentHomeProps> = ({ studentName, studentId }) => {
  // 임시 데이터 (실제로는 API에서 가져오거나 상태 관리 라이브러리에서 가져올 것)
  const [essays, setEssays] = useState<Essay[]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  // 검색어에 따라 에세이 필터링
  const filteredEssays = essays.filter(essay => 
    essay.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 날짜 포맷팅 함수
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">내 글 목록</h1>
        <Link 
          to="/essay/new" 
          className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
          aria-label="새 글 작성하기"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="글 제목 검색..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEssays.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredEssays.map((essay) => (
              <li key={essay.id}>
                <Link 
                  to={`/essay/${essay.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {essay.title}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          작성일: {formatDate(essay.createdAt)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          마지막 수정: {formatDate(essay.lastModified)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          {searchTerm ? (
            <div>
              <p className="text-gray-500 mb-2">검색 결과가 없습니다.</p>
              <p className="text-sm text-gray-400">다른 검색어로 시도해보세요.</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 mb-4">아직 작성한 글이 없습니다.</p>
              <Link 
                to="/essay/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                새 글 작성하기
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentHome;
