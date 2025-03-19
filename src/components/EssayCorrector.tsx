import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, XCircle, Plus, X, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentHome from './StudentHome';

interface OREOSection {
  id: string;
  opinion: string;
  reason: string;
  example: string;
  reemphasis: string;
}

interface EssayStructure {
  title: string;
  introduction: string;
  oreoSections: OREOSection[];
  conclusion: string;
}

interface CriteriaMet {
  met: boolean;
  feedback: string;
}

interface IntroductionCriteria {
  greeting: CriteriaMet;
  direction: CriteriaMet;
  general: string;
}

interface BodyOCriteria {
  opinion: CriteriaMet;
  general: string;
}

interface BodyRCriteria {
  reason: CriteriaMet;
  general: string;
}

interface BodyECriteria {
  example: CriteriaMet;
  general: string;
}

interface BodyO2Criteria {
  reemphasis: CriteriaMet;
  general: string;
}

interface ConclusionCriteria {
  summary: CriteriaMet;
  closing: CriteriaMet;
  general: string;
}

interface OREOSectionCorrection {
  bodyO1: BodyOCriteria | string;
  bodyR: BodyRCriteria | string;
  bodyE: BodyECriteria | string;
  bodyO2: BodyO2Criteria | string;
}

interface CorrectionResult {
  introduction: IntroductionCriteria | string;
  oreoSections: OREOSectionCorrection[];
  conclusion: ConclusionCriteria | string;
  overall: string;
}

const EssayCorrector: React.FC = () => {
  const [essayStructure, setEssayStructure] = useState<EssayStructure>({
    title: '',
    introduction: '',
    oreoSections: [
      {
        id: '1',
        opinion: '',
        reason: '',
        example: '',
        reemphasis: ''
      }
    ],
    conclusion: ''
  });
  
  const [correctionResult, setCorrectionResult] = useState<CorrectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: 'title' | 'introduction' | 'conclusion', value: string) => {
    setEssayStructure(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOREOInputChange = (sectionId: string, field: keyof OREOSection, value: string) => {
    setEssayStructure(prev => ({
      ...prev,
      oreoSections: prev.oreoSections.map(section => 
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const addOREOSection = () => {
    const newId = String(Date.now());
    setEssayStructure(prev => ({
      ...prev,
      oreoSections: [
        ...prev.oreoSections,
        {
          id: newId,
          opinion: '',
          reason: '',
          example: '',
          reemphasis: ''
        }
      ]
    }));
  };

  const removeOREOSection = (sectionId: string) => {
    // 최소 하나의 OREO 섹션은 유지
    if (essayStructure.oreoSections.length <= 1) {
      return;
    }
    
    setEssayStructure(prev => ({
      ...prev,
      oreoSections: prev.oreoSections.filter(section => section.id !== sectionId)
    }));
  };

  const compileEssay = (): string => {
    let compiledEssay = `제목: ${essayStructure.title}
    
서론: ${essayStructure.introduction}

`;

    essayStructure.oreoSections.forEach((section, index) => {
      compiledEssay += `본론 ${index + 1}:
O (의견): ${section.opinion}
R (이유): ${section.reason}
E (예시): ${section.example}
O (의견 재강조): ${section.reemphasis}

`;
    });

    compiledEssay += `결론: ${essayStructure.conclusion}`;
    
    return compiledEssay;
  };

  // 해요체를 합니다체로 변환하는 함수 (첨삭 예시 문장만 변환)
  const convertToFormalStyle = (text: string): string => {
    if (!text) return text;
    
    // 예시 문장을 찾기 위한 패턴 (예: "예시: ", "예를 들면: ", "이렇게 써보세요: " 등으로 시작하는 문장)
    const examplePatterns = [
      /예시: ([^\n]+)/g,
      /예를 들면: ([^\n]+)/g,
      /이렇게 써보세요: ([^\n]+)/g,
      /다음과 같이 작성해보세요: ([^\n]+)/g,
      /다음처럼 써보세요: ([^\n]+)/g,
      /이런 식으로 작성해보세요: ([^\n]+)/g,
      /이렇게 바꿔보세요: ([^\n]+)/g,
      /이런 문장은 어떨까요\? ([^\n]+)/g,
      /다음 문장을 참고해보세요: ([^\n]+)/g,
      /이런 표현은 어떨까요\? ([^\n]+)/g,
      /"([^"]+)"/g,  // 따옴표로 둘러싸인 예시 문장
      /'([^']+)'/g   // 작은따옴표로 둘러싸인 예시 문장
    ];
    
    // 해요체 -> 합니다체 변환 패턴
    const patterns = [
      { from: /([가-힣]+)해요/g, to: '$1합니다' },
      { from: /([가-힣]+)예요/g, to: '$1입니다' },
      { from: /([가-힣]+)네요/g, to: '$1습니다' },
      { from: /([가-힣]+)세요/g, to: '$1십시오' },
      { from: /([가-힣]+)이에요/g, to: '$1입니다' },
      { from: /([가-힣]+)죠/g, to: '$1지요' },
      { from: /([가-힣]+)거예요/g, to: '$1것입니다' },
      { from: /([가-힣]+)을까요/g, to: '$1을까요' }, // 의문문은 유지
      { from: /([가-힣]+)나요/g, to: '$1납니다' },
      { from: /([가-힣]+)아요/g, to: '$1습니다' },
      { from: /([가-힣]+)어요/g, to: '$1습니다' },
      { from: /([가-힣]+)해도 돼요/g, to: '$1해도 됩니다' },
      { from: /([가-힣]+)하세요/g, to: '$1하십시오' },
      { from: /([가-힣]+)이에요/g, to: '$1입니다' },
      { from: /([가-힣]+)게요/g, to: '$1겠습니다' },
      { from: /([가-힣]+)군요/g, to: '$1군요' }, // 감탄문은 유지
      { from: /([가-힣]+)겠네요/g, to: '$1겠습니다' }
    ];
    
    let result = text;
    
    // 예시 문장만 찾아서 합니다체로 변환
    examplePatterns.forEach(pattern => {
      result = result.replace(pattern, (match, p1) => {
        let convertedExample = p1;
        patterns.forEach(stylePattern => {
          convertedExample = convertedExample.replace(stylePattern.from, stylePattern.to);
        });
        
        // 원래 매치된 형식을 유지하면서 내용만 변환
        if (pattern.toString().includes('"')) {
          return `"${convertedExample}"`;
        } else if (pattern.toString().includes("'")) {
          return `'${convertedExample}'`;
        } else {
          return match.replace(p1, convertedExample);
        }
      });
    });
    
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const compiledEssay = compileEssay();
    
    if (!compiledEssay.trim()) {
      setError('첨삭할 글을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCn_slGypmhN0TJulf0TGu9wvO5EkwXy6s', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `당신은 중학생들의 글을 첨삭해주는 친절한 선생님입니다. 다음 중학생이 작성한 글을 섹션별로 첨삭해주세요.

중요한 지침:
1. 중학생이 이해할 수 있는 쉬운 단어와 표현을 사용해주세요.
2. 너무 길지 않게 간결하게 첨삭해주세요.
3. 구체적이고 실용적인 조언을 해주세요.
4. 매우 친절하고 격려하는 말투로 첨삭해주세요. 학생에게 직접 말할 때는 반드시 친근한 '해요체'를 사용해주세요. (예: "이렇게 하면 좋아요", "잘했어요", "이 부분을 조금 더 보완하면 좋을 것 같아요")
5. 첨삭 시 예시로 제시하는 문장은 반드시 '합니다체'로 작성하고 문어체로 작성해주세요. 특히 따옴표(" ") 안에 있는 예시 문장은 모두 문어체로 작성해주세요. (예: "저는 환경 보호가 중요하다고 생각합니다", "이러한 이유로 우리는 노력해야 합니다")
   하지만 학생에게 직접 말하는 피드백은 반드시 친근한 '해요체'를 유지해주세요.

각 섹션별로 첨삭 결과를 제공해주세요. 문법, 어휘, 문장 구조, 논리적 흐름 등을 개선하고, 개선된 부분에 대한 설명을 함께 제공해주세요.

특히 각 부분을 첨삭할 때는 다음 기준으로 평가해주세요:

서론:
1. 독자의 흥미를 끄는 인삿말이 들어갔는가?
2. 글의 전체방향을 암시했는가?

본론 O (의견):
1. 자신이 전하고자 하는 의견을 잘 주장했는가?

본론 R (이유):
1. 자신의 주장을 뒷받침해 주는 이유와 근거를 잘 작성했는가?

본론 E (예시):
1. 자신의 주장과 관련된 사례나 예시를 적절하게 잘 들었는가?

본론 O (의견 재강조):
1. 자신의 주장을 다시 한 번 잘 강조했는가?

결론:
1. 본론에서 나온 내용들을 잘 요약했는가?
2. 글을 끝맺는 마무리말을 잘 작성했는가?

위 요소가 미흡하다면 어떻게 써야 하는지 간단한 예시와 함께 첨삭해주세요.
제목은 첨삭하지 마세요.

응답 형식은 다음과 같이 JSON 형식으로 제공해주세요:
{
  "introduction": {
    "greeting": {
      "met": true/false, // 독자의 흥미를 끄는 인삿말이 있는지 여부
      "feedback": "인삿말에 대한 피드백 및 개선 방안"
    },
    "direction": {
      "met": true/false, // 글의 전체방향을 암시했는지 여부
      "feedback": "글의 전체방향 암시에 대한 피드백 및 개선 방안"
    },
    "general": "서론에 대한 일반적인 첨삭 내용"
  },
  "oreoSections": [
    {
      "bodyO1": {
        "opinion": {
          "met": true/false, // 자신의 의견을 잘 주장했는지 여부
          "feedback": "의견 주장에 대한 피드백 및 개선 방안"
        },
        "general": "본론 의견에 대한 일반적인 첨삭 내용"
      },
      "bodyR": {
        "reason": {
          "met": true/false, // 주장을 뒷받침하는 이유와 근거를 잘 작성했는지 여부
          "feedback": "이유와 근거에 대한 피드백 및 개선 방안"
        },
        "general": "본론 이유에 대한 일반적인 첨삭 내용"
      },
      "bodyE": {
        "example": {
          "met": true/false, // 주장과 관련된 사례나 예시를 적절하게 들었는지 여부
          "feedback": "예시에 대한 피드백 및 개선 방안"
        },
        "general": "본론 예시에 대한 일반적인 첨삭 내용"
      },
      "bodyO2": {
        "reemphasis": {
          "met": true/false, // 주장을 다시 한 번 잘 강조했는지 여부
          "feedback": "의견 재강조에 대한 피드백 및 개선 방안"
        },
        "general": "본론 의견 재강조에 대한 일반적인 첨삭 내용"
      }
    }
    // 여러 개의 본론 섹션이 있을 경우 추가
  ],
  "conclusion": {
    "summary": {
      "met": true/false, // 본론 내용을 잘 요약했는지 여부
      "feedback": "요약에 대한 피드백 및 개선 방안"
    },
    "closing": {
      "met": true/false, // 글을 끝맺는 마무리말을 잘 작성했는지 여부
      "feedback": "마무리말에 대한 피드백 및 개선 방안"
    },
    "general": "결론에 대한 일반적인 첨삭 내용"
  },
  "overall": "전체적인 평가 및 조언"
}

학생 글:
${compiledEssay}`
            }]
          }]
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청에 실패했습니다.');
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const correctionText = data.candidates[0].content.parts[0].text;
        
        try {
          // JSON 형식 추출 (텍스트에서 JSON 부분만 추출)
          const jsonMatch = correctionText.match(/\{[\s\S]*\}/);
          
          if (jsonMatch) {
            const correctionJson = JSON.parse(jsonMatch[0]);
            
            // 첨삭 예시 문장들을 합니다체로 변환 (general 필드만 변환)
            if (correctionJson.introduction && typeof correctionJson.introduction === 'object') {
              correctionJson.introduction.general = convertToFormalStyle(correctionJson.introduction.general);
            }
            
            // 여러 개의 OREO 섹션 처리
            if (correctionJson.oreoSections && Array.isArray(correctionJson.oreoSections)) {
              correctionJson.oreoSections.forEach((section: any, index: number) => {
                if (section.bodyO1 && typeof section.bodyO1 === 'object') {
                  section.bodyO1.general = convertToFormalStyle(section.bodyO1.general);
                }
                
                if (section.bodyR && typeof section.bodyR === 'object') {
                  section.bodyR.general = convertToFormalStyle(section.bodyR.general);
                }
                
                if (section.bodyE && typeof section.bodyE === 'object') {
                  section.bodyE.general = convertToFormalStyle(section.bodyE.general);
                }
                
                if (section.bodyO2 && typeof section.bodyO2 === 'object') {
                  section.bodyO2.general = convertToFormalStyle(section.bodyO2.general);
                }
              });
            } else {
              // API가 oreoSections 배열을 반환하지 않은 경우 (이전 형식으로 반환한 경우)
              // 기존 필드를 oreoSections 배열로 변환
              const oreoSections = [];
              
              const section = {
                bodyO1: correctionJson.bodyO1 || '',
                bodyR: correctionJson.bodyR || '',
                bodyE: correctionJson.bodyE || '',
                bodyO2: correctionJson.bodyO2 || ''
              };
              
              // 각 필드 변환
              if (section.bodyO1 && typeof section.bodyO1 === 'object') {
                section.bodyO1.general = convertToFormalStyle(section.bodyO1.general);
              }
              
              if (section.bodyR && typeof section.bodyR === 'object') {
                section.bodyR.general = convertToFormalStyle(section.bodyR.general);
              }
              
              if (section.bodyE && typeof section.bodyE === 'object') {
                section.bodyE.general = convertToFormalStyle(section.bodyE.general);
              }
              
              if (section.bodyO2 && typeof section.bodyO2 === 'object') {
                section.bodyO2.general = convertToFormalStyle(section.bodyO2.general);
              }
              
              oreoSections.push(section);
              
              // 기존 필드 삭제 및 oreoSections 추가
              delete correctionJson.bodyO1;
              delete correctionJson.bodyR;
              delete correctionJson.bodyE;
              delete correctionJson.bodyO2;
              
              correctionJson.oreoSections = oreoSections;
            }
            
            if (correctionJson.conclusion && typeof correctionJson.conclusion === 'object') {
              correctionJson.conclusion.general = convertToFormalStyle(correctionJson.conclusion.general);
            }
            
            setCorrectionResult(correctionJson);
          } else {
            // JSON 형식이 아닌 경우 전체 텍스트를 overall로 설정
            setCorrectionResult({
              introduction: '',
              oreoSections: [],
              conclusion: '',
              overall: correctionText
            });
          }
        } catch (jsonError) {
          console.error('JSON 파싱 오류:', jsonError);
          // JSON 파싱 오류 시 전체 텍스트를 overall로 설정
          setCorrectionResult({
            introduction: '',
            oreoSections: [],
            conclusion: '',
            overall: correctionText
          });
        }
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '첨삭 과정에서 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 점수 계산 함수 추가
  const calculateScore = (): number => {
    if (!correctionResult) return 0;
    
    let score = 100; // 기본 점수
    
    // 서론 체크리스트
    if (typeof correctionResult.introduction === 'object') {
      const intro = correctionResult.introduction as IntroductionCriteria;
      if (!intro.greeting.met) score -= 10;
      if (!intro.direction.met) score -= 10;
    }
    
    // 본론 체크리스트
    correctionResult.oreoSections.forEach((section: any) => {
      if (typeof section.bodyO1 === 'object') {
        const bodyO1 = section.bodyO1 as BodyOCriteria;
        if (!bodyO1.opinion.met) score -= 10;
      }
      
      if (typeof section.bodyR === 'object') {
        const bodyR = section.bodyR as BodyRCriteria;
        if (!bodyR.reason.met) score -= 10;
      }
      
      if (typeof section.bodyE === 'object') {
        const bodyE = section.bodyE as BodyECriteria;
        if (!bodyE.example.met) score -= 10;
      }
      
      if (typeof section.bodyO2 === 'object') {
        const bodyO2 = section.bodyO2 as BodyO2Criteria;
        if (!bodyO2.reemphasis.met) score -= 10;
      }
    });
    
    // 결론 체크리스트
    if (typeof correctionResult.conclusion === 'object') {
      const conclusion = correctionResult.conclusion as ConclusionCriteria;
      if (!conclusion.summary.met) score -= 10;
      if (!conclusion.closing.met) score -= 10;
    }
    
    // 본론 추가 보너스 점수
    if (essayStructure.oreoSections.length > 1) {
      score += 10;
    }
    
    // 최대 100점 제한
    return Math.min(score, 100);
  };

  // 서론 첨삭 결과 렌더링 함수
  const renderIntroductionCorrection = () => {
    if (!correctionResult?.introduction) return null;
    
    // 서론 첨삭 결과가 객체 형태인 경우 (구조화된 피드백)
    if (typeof correctionResult.introduction === 'object') {
      const intro = correctionResult.introduction as IntroductionCriteria;
      
      return (
        <div className="mt-2 p-3 bg-green-50 rounded-md text-sm">
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              {intro.greeting.met ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="font-semibold">독자의 흥미를 끄는 인삿말</p>
            </div>
            <p className="ml-7 text-gray-700">{intro.greeting.feedback}</p>
          </div>
          
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              {intro.direction.met ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="font-semibold">글의 전체방향 암시</p>
            </div>
            <p className="ml-7 text-gray-700">{intro.direction.feedback}</p>
          </div>
          
          {intro.general && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="font-semibold">일반적인 첨삭:</p>
              <p className="whitespace-pre-line">{intro.general}</p>
            </div>
          )}
        </div>
      );
    }
    
    // 서론 첨삭 결과가 문자열인 경우 (기존 방식)
    return (
      <div className="mt-2 p-3 bg-green-50 text-green-800 rounded-md text-sm">
        <p className="font-semibold">첨삭:</p>
        <p className="whitespace-pre-line">{correctionResult.introduction}</p>
      </div>
    );
  };

  // 본론 O (의견) 첨삭 결과 렌더링 함수
  const renderBodyOCorrection = (sectionIndex: number) => {
    if (!correctionResult?.oreoSections || !correctionResult.oreoSections[sectionIndex]?.bodyO1) return null;
    
    const bodyO1 = correctionResult.oreoSections[sectionIndex].bodyO1;
    
    // 본론 O1 첨삭 결과가 객체 형태인 경우 (구조화된 피드백)
    if (typeof bodyO1 === 'object') {
      return (
        <div className="mt-2 p-3 bg-green-50 rounded-md text-sm">
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              {bodyO1.opinion.met ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="font-semibold">자신의 의견을 잘 주장했는가?</p>
            </div>
            <p className="ml-7 text-gray-700">{bodyO1.opinion.feedback}</p>
          </div>
          
          {bodyO1.general && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="font-semibold">일반적인 첨삭:</p>
              <p className="whitespace-pre-line">{bodyO1.general}</p>
            </div>
          )}
        </div>
      );
    }
    
    // 본론 O1 첨삭 결과가 문자열인 경우 (기존 방식)
    return (
      <div className="mt-2 p-3 bg-green-50 text-green-800 rounded-md text-sm">
        <p className="font-semibold">첨삭:</p>
        <p className="whitespace-pre-line">{bodyO1}</p>
      </div>
    );
  };

  // 본론 R (이유) 첨삭 결과 렌더링 함수
  const renderBodyRCorrection = (sectionIndex: number) => {
    if (!correctionResult?.oreoSections || !correctionResult.oreoSections[sectionIndex]?.bodyR) return null;
    
    const bodyR = correctionResult.oreoSections[sectionIndex].bodyR;
    
    // 본론 R 첨삭 결과가 객체 형태인 경우 (구조화된 피드백)
    if (typeof bodyR === 'object') {
      return (
        <div className="mt-2 p-3 bg-green-50 rounded-md text-sm">
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              {bodyR.reason.met ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="font-semibold">주장을 뒷받침하는 이유와 근거를 잘 작성했는가?</p>
            </div>
            <p className="ml-7 text-gray-700">{bodyR.reason.feedback}</p>
          </div>
          
          {bodyR.general && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="font-semibold">일반적인 첨삭:</p>
              <p className="whitespace-pre-line">{bodyR.general}</p>
            </div>
          )}
        </div>
      );
    }
    
    // 본론 R 첨삭 결과가 문자열인 경우 (기존 방식)
    return (
      <div className="mt-2 p-3 bg-green-50 text-green-800 rounded-md text-sm">
        <p className="font-semibold">첨삭:</p>
        <p className="whitespace-pre-line">{bodyR}</p>
      </div>
    );
  };

  // 본론 E (예시) 첨삭 결과 렌더링 함수
  const renderBodyECorrection = (sectionIndex: number) => {
    if (!correctionResult?.oreoSections || !correctionResult.oreoSections[sectionIndex]?.bodyE) return null;
    
    const bodyE = correctionResult.oreoSections[sectionIndex].bodyE;
    
    // 본론 E 첨삭 결과가 객체 형태인 경우 (구조화된 피드백)
    if (typeof bodyE === 'object') {
      return (
        <div className="mt-2 p-3 bg-green-50 rounded-md text-sm">
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              {bodyE.example.met ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="font-semibold">주장과 관련된 사례나 예시를 적절하게 들었는가?</p>
            </div>
            <p className="ml-7 text-gray-700">{bodyE.example.feedback}</p>
          </div>
          
          {bodyE.general && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="font-semibold">일반적인 첨삭:</p>
              <p className="whitespace-pre-line">{bodyE.general}</p>
            </div>
          )}
        </div>
      );
    }
    
    // 본론 E 첨삭 결과가 문자열인 경우 (기존 방식)
    return (
      <div className="mt-2 p-3 bg-green-50 text-green-800 rounded-md text-sm">
        <p className="font-semibold">첨삭:</p>
        <p className="whitespace-pre-line">{bodyE}</p>
      </div>
    );
  };

  // 본론 O2 (의견 재강조) 첨삭 결과 렌더링 함수
  const renderBodyO2Correction = (sectionIndex: number) => {
    if (!correctionResult?.oreoSections || !correctionResult.oreoSections[sectionIndex]?.bodyO2) return null;
    
    const bodyO2 = correctionResult.oreoSections[sectionIndex].bodyO2;
    
    // 본론 O2 첨삭 결과가 객체 형태인 경우 (구조화된 피드백)
    if (typeof bodyO2 === 'object') {
      return (
        <div className="mt-2 p-3 bg-green-50 rounded-md text-sm">
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              {bodyO2.reemphasis.met ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="font-semibold">주장을 다시 한 번 잘 강조했는가?</p>
            </div>
            <p className="ml-7 text-gray-700">{bodyO2.reemphasis.feedback}</p>
          </div>
          
          {bodyO2.general && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="font-semibold">일반적인 첨삭:</p>
              <p className="whitespace-pre-line">{bodyO2.general}</p>
            </div>
          )}
        </div>
      );
    }
    
    // 본론 O2 첨삭 결과가 문자열인 경우 (기존 방식)
    return (
      <div className="mt-2 p-3 bg-green-50 text-green-800 rounded-md text-sm">
        <p className="font-semibold">첨삭:</p>
        <p className="whitespace-pre-line">{bodyO2}</p>
      </div>
    );
  };

  // 결론 첨삭 결과 렌더링 함수
  const renderConclusionCorrection = () => {
    if (!correctionResult?.conclusion) return null;
    
    // 결론 첨삭 결과가 객체 형태인 경우 (구조화된 피드백)
    if (typeof correctionResult.conclusion === 'object') {
      const conclusion = correctionResult.conclusion as ConclusionCriteria;
      
      return (
        <div className="mt-2 p-3 bg-green-50 rounded-md text-sm">
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              {conclusion.summary.met ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="font-semibold">본론 내용을 잘 요약했는가?</p>
            </div>
            <p className="ml-7 text-gray-700">{conclusion.summary.feedback}</p>
          </div>
          
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              {conclusion.closing.met ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="font-semibold">글을 끝맺는 마무리말을 잘 작성했는가?</p>
            </div>
            <p className="ml-7 text-gray-700">{conclusion.closing.feedback}</p>
          </div>
          
          {conclusion.general && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="font-semibold">일반적인 첨삭:</p>
              <p className="whitespace-pre-line">{conclusion.general}</p>
            </div>
          )}
        </div>
      );
    }
    
    // 결론 첨삭 결과가 문자열인 경우 (기존 방식)
    return (
      <div className="mt-2 p-3 bg-green-50 text-green-800 rounded-md text-sm">
        <p className="font-semibold">첨삭:</p>
        <p className="whitespace-pre-line">{correctionResult.conclusion}</p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">글 첨삭하기</h2>
          <div className="flex items-center gap-4">
            {correctionResult && (
              <div className="text-2xl font-bold text-red-600">
                {calculateScore()}점
              </div>
            )}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
            >
              <Home className="h-4 w-4" />
              홈으로
            </Link>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                제목
              </label>
              <input
                id="title"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="제목을 입력하시오"
                value={essayStructure.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={!!correctionResult}
              />
            </div>
            
            <div>
              <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-1">
                서론
              </label>
              <textarea
                id="introduction"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="1. 글의 시작을 여는 인사말 작성
2. 글의 전체 방향 암시"
                value={essayStructure.introduction}
                onChange={(e) => handleInputChange('introduction', e.target.value)}
                disabled={!!correctionResult}
              />
              {renderIntroductionCorrection()}
            </div>
            
            {/* 본론 섹션 (여러 개의 OREO 섹션) */}
            <div className="space-y-6">
              <h3 className="text-md font-semibold">본론 (OREO)</h3>
              
              {essayStructure.oreoSections.map((section, index) => (
                <div key={section.id} className="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
                  {!correctionResult && essayStructure.oreoSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOREOSection(section.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-200"
                      aria-label="본론 섹션 삭제"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  
                  <h4 className="text-sm font-medium text-gray-700 mb-3">본론 {index + 1}</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label htmlFor={`opinion-${section.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        O (의견)
                      </label>
                      <textarea
                        id={`opinion-${section.id}`}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="자신이 전하고자 하는 의견 작성"
                        value={section.opinion}
                        onChange={(e) => handleOREOInputChange(section.id, 'opinion', e.target.value)}
                        disabled={!!correctionResult}
                      />
                      {correctionResult && renderBodyOCorrection(index)}
                    </div>
                    
                    <div>
                      <label htmlFor={`reason-${section.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        R (이유)
                      </label>
                      <textarea
                        id={`reason-${section.id}`}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="의견을 뒷받침하는 이유와 근거 작성"
                        value={section.reason}
                        onChange={(e) => handleOREOInputChange(section.id, 'reason', e.target.value)}
                        disabled={!!correctionResult}
                      />
                      {correctionResult && renderBodyRCorrection(index)}
                    </div>
                    
                    <div>
                      <label htmlFor={`example-${section.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        E (예시)
                      </label>
                      <textarea
                        id={`example-${section.id}`}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="자신의 의견과 관련된 구체적 사례나 예시 작성"
                        value={section.example}
                        onChange={(e) => handleOREOInputChange(section.id, 'example', e.target.value)}
                        disabled={!!correctionResult}
                      />
                      {correctionResult && renderBodyECorrection(index)}
                    </div>
                    
                    <div>
                      <label htmlFor={`reemphasis-${section.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        O (의견 재강조)
                      </label>
                      <textarea
                        id={`reemphasis-${section.id}`}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="자신의 의견 다시 강조"
                        value={section.reemphasis}
                        onChange={(e) => handleOREOInputChange(section.id, 'reemphasis', e.target.value)}
                        disabled={!!correctionResult}
                      />
                      {correctionResult && renderBodyO2Correction(index)}
                    </div>
                  </div>
                </div>
              ))}
              
              {!correctionResult && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addOREOSection}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    본론 추가
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="conclusion" className="block text-sm font-medium text-gray-700 mb-1">
                결론
              </label>
              <textarea
                id="conclusion"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="1. 본론에 나왔던 내용 요약 정리
2. 글을 끝맺는 마무리말 작성"
                value={essayStructure.conclusion}
                onChange={(e) => handleInputChange('conclusion', e.target.value)}
                disabled={!!correctionResult}
              />
              {renderConclusionCorrection()}
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            {!correctionResult ? (
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    첨삭 중...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    첨삭하기
                  </>
                )}
              </button>
            ) : (
              <Link 
                to="/" 
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Home className="h-4 w-4" />
                홈으로
              </Link>
            )}
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {correctionResult?.overall && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">전체 평가</h3>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-line">
              {correctionResult.overall}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EssayCorrector;
