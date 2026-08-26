import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

const AWAKENING_SYSTEM_PROMPT = `[Role]
당신은 사용자의 닫힌 사고방식을 깨부수고 새로운 관점을 열어주는 '1:1 맞춤형 계몽(Awakening) AI 멘토, 라이프업'입니다.
단순히 위로하거나 정답을 알려주는 챗봇이 아닙니다. 소크라테스식 문답법을 통해 사용자가 자신의 인지적 왜곡(번아웃, 취업, 연애, 불안)을 스스로 깨닫게 만드는 것이 당신의 유일한 목적입니다.

[Context & User Data]
당신은 매 세션이 시작될 때, 사용자가 입력한 [현재 감정(User_Emotion)], [고민 카테고리(User_Category)], [현재 상황(User_Situation)] 데이터를 전달받습니다. 이 데이터를 기반으로 가장 날카롭고 본질적인 첫 질문을 던지며 대화를 시작해야 합니다.

[Core Rules : 계몽을 위한 5대 원칙]
1. 정답 금지: 해결책을 제시하지 마세요. 대신, 사용자의 답변에 내포된 '전제'에 의문을 제기하는 질문을 던지세요.
2. 사실과 해석의 분리: 사용자가 말하는 두려움이나 불안이 '실제 일어난 팩트'인지, '스스로 만들어낸 망상/해석'인지 철저히 분리하도록 유도하세요.
3. 꼬리 질문(Deep Dive): 한 번의 질문으로 끝나지 않고, 사용자의 대답에서 모순이나 방어 기제를 발견하면 연속해서 깊이 파고드세요. (한 번에 최대 1개~2개의 질문만 던질 것)
4. 단호하지만 통찰력 있는 톤앤매너: 감정적으로 동조("너무 힘드시겠어요")하는 것을 최소화하고, 이성적이고 통찰력 있는 태도로 본질을 짚어내세요.
5. 4대 카테고리별 맞춤 타겟팅:
   - [번아웃]: 완벽주의, 타인의 시선, '쉬면 도태된다'는 강박을 타격할 것.
   - [취업]: 사회적 기준과 개인의 진짜 가치를 분리시킬 것.
   - [연애]: 타인을 통한 결핍 충족(의존성)을 직면하게 할 것.
   - [불안]: 통제 불가능한 미래와 통제 가능한 현재(지금 여기)를 구분시킬 것.

[Interaction Flow (대화 시나리오)]
- 첫 대화 시작 시: 유저의 현재 심정과 상황({User_Emotion}, {User_Category}, {User_Situation})을 간략히 요약한 뒤, 그 상황을 낯설게 보게 만드는 묵직한 '첫 번째 질문'을 던진다.
- 진행 중 대화: 사용자의 말 속 전제와 인지 왜곡을 짚어내고 1~2개의 깊이 있는 꼬리 질문을 이어간다.
- [Daily Nudge (자동화 메시지용 규칙)]: 사용자가 "오늘 상담 종료"를 요청하거나 상담 마무리를 요청하면, AI는 오늘 대화의 핵심을 찌르는 단 한 줄의 [계몽 문장]과 내일 생각해 볼 [숙제 질문]을 요약해서 출력합니다.
  종료 시 출력 형식:
  [내일의 계몽 알림톡]
  문장: (오늘 대화를 관통하는 뼈 때리는 한 문장)
  질문: (내일 하루 동안 스스로 고민해볼 질문)`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1. Fast Lead Capture API (빠른 무료 상담 신청)
  app.post('/api/leads/fast-inquiry', async (req, res) => {
    try {
      const { name, phone, content, programType = '1:1 계몽 멘토링' } = req.body;

      if (!name || !phone) {
        return res.status(400).json({ error: '이름과 연락처를 모두 입력해주세요.' });
      }

      const inquiryId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      console.log(`[Fast Lead Captured] ${name} (${phone}) - ${programType}: ${content}`);

      res.json({
        success: true,
        inquiryId,
        message: `${name}님, 1:1 계몽 멘토링 신청이 성공적으로 접수되었습니다. 담당 전문 멘토가 1시간 이내에 안내 연락을 드립니다.`,
        scheduledKakaoAlert: true
      });
    } catch (err: any) {
      console.error('Error in /api/leads/fast-inquiry:', err);
      res.status(500).json({ error: '상담 신청 처리 중 오류가 발생했습니다.' });
    }
  });

  // 2. 1:1 Awakening Mentor Chat API
  app.post('/api/chat/coaching', async (req, res) => {
    try {
      const { 
        messages = [], 
        userEmotion = '',
        userCategory = '번아웃',
        userSituation = '',
        category = 'burnout', 
        userName = '내담자',
        isEndingSession = false
      } = req.body;
      
      const ai = getAi();

      const lastUserMessage = messages[messages.length - 1]?.content || '';
      const isEnding = isEndingSession || lastUserMessage.includes('오늘 상담 종료') || lastUserMessage.includes('상담 종료');

      const conversationHistory = (messages || []).map((m: { role: string; content: string }) => 
        `${m.role === 'user' ? userName : 'AI 계몽 멘토'}: ${m.content}`
      ).join('\n');

      const prompt = `${AWAKENING_SYSTEM_PROMPT}

[현재 내담자 세션 데이터]
- 내담자 성명: ${userName}님
- 고민 카테고리(User_Category): ${userCategory || category}
- 현재 감정(User_Emotion): ${userEmotion || '불안 및 복잡함'}
- 현재 상황(User_Situation): ${userSituation || '고민을 마주하고 있는 상태'}
- 상담 종료 요청 여부: ${isEnding ? '예 (오늘 상담 종료 요청됨)' : '아니오 (대화 진행 중)'}

[대화 히스토리]
${conversationHistory || '(첫 세션 시작)'}

[응답 가이드라인]
${isEnding ? `
- 사용자가 "오늘 상담 종료"를 요청했습니다. 오늘 대화의 핵심을 찌르는 단 한 줄의 [계몽 문장]과 내일 하루 동안 스스로 고민해볼 [숙제 질문]을 작성하세요.
- 출력 형식:
[내일의 계몽 알림톡]
문장: (오늘 대화를 관통하는 뼈 때리는 한 문장)
질문: (내일 하루 동안 스스로 고민해볼 질문)
` : `
- 첫 응답이거나 대화 진행 시, 위 5대 원칙(정답 금지, 사실과 해석 분리, 꼬리 질문 1~2개, 단호하고 통찰력 있는 톤, 4대 카테고리별 맞춤 타겟팅)을 엄격히 준수하세요.
- 첫 응답일 경우: 유저의 현재 심정과 상황을 간략히 짚은 뒤, 그 상황을 낯설게 보게 만드는 묵직한 '첫 번째 질문'을 던지세요.
`}

반드시 아래 JSON 포맷으로 응답하세요:
{
  "message": "AI 멘토의 응답 전문 (종료 시 [내일의 계몽 알림톡] 형식 포함)",
  "identifiedDistortion": "발견된 인지 왜곡 명칭 (예: 흑백논리 / 타인 인정 의존 / 파국화 시나리오 / 당위적 사고)",
  "factVsInterpretation": {
    "fact": "객관적으로 일어난 실제 사실 1문장",
    "interpretation": "머릿속이 만들어낸 과장된 해석/두려움 1문장"
  },
  "sharpQuestion": "메타인지를 깨우는 날카로운 계몽 질문 1~2개",
  "dailyNudge": {
    "sentence": "오늘 대화를 관통하는 뼈 때리는 계몽 문장",
    "homeworkQuestion": "내일 하루 동안 스스로 고민해볼 숙제 질문"
  },
  "isSessionEnded": ${isEnding}
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text?.trim() || '{}';
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        parsed = {
          message: isEnding
            ? `[내일의 계몽 알림톡]\n문장: 내가 통제할 수 없는 타인의 기준을 내려놓을 때 진정한 내 삶이 시작됩니다.\n질문: 내일 하루 동안, 남들의 시선이 아닌 온전한 나를 위한 단 하나의 선택은 무엇인가요?`
            : `${userName}님, 현재 상황에서 느끼는 불안의 이면에 어떤 '전제'가 깔려 있는지 짚어볼 필요가 있습니다. 그 불안은 실제로 일어난 '사실'인가요, 아니면 머릿속이 쓴 '시나리오'인가요?`,
          identifiedDistortion: '인지적 왜곡 및 당위적 사고',
          factVsInterpretation: {
            fact: '현재 상황에 직면해 있는 것',
            interpretation: '내가 실패하거나 도태될 것이라는 공포'
          },
          sharpQuestion: '그 상황에서 당신이 100% 통제할 수 있는 행동은 무엇인가요?',
          dailyNudge: {
            sentence: '내가 통제할 수 없는 것을 내려놓을 때 진정한 자유가 시작됩니다.',
            homeworkQuestion: '내일 하루 동안 남들의 시선에서 벗어나 온전히 나를 위한 선택은 무엇인가요?'
          },
          isSessionEnded: isEnding
        };
      }

      res.json(parsed);
    } catch (err: any) {
      console.error('Error in /api/chat/coaching:', err);
      res.status(500).json({ 
        error: err.message || 'Internal server error',
        message: '잠시 생각을 가다듬는 중입니다. 당신의 내면 깊은 이야기를 언제든 들려주세요.',
        identifiedDistortion: '자기 비판적 사고',
        factVsInterpretation: {
          fact: '상황을 마주하고 있는 것',
          interpretation: '스스로를 과도하게 압박하는 생각'
        },
        sharpQuestion: '이 상황에서 내가 바꿀 수 있는 단 1%의 행동은 무엇인가요?',
        dailyNudge: {
          sentence: '자신을 객관적으로 바라보는 순간 왜곡된 두려움은 힘을 잃습니다.',
          homeworkQuestion: '오늘의 걱정 중 내일 실제로 일어날 일은 몇 개인가요?'
        },
        isSessionEnded: false
      });
    }
  });

  // 3. 3-Minute Initial Awakening & Metacognition Diagnosis API (온보딩 진단)
  app.post('/api/assessment/onboarding', async (req, res) => {
    try {
      const { 
        primaryIssue = 'burnout',
        answers = {},
        userName = '회원'
      } = req.body;

      const ai = getAi();

      const prompt = `사용자가 라이프업의 3분 초기 성향 및 결핍 진단을 완료했습니다.
사용자 이름: ${userName}
가장 큰 고민 테마: ${primaryIssue} (burnout | career | romance | anxiety)
문답 응답 데이터: ${JSON.stringify(answers)}

[요구사항]
이 사용자가 무의식적으로 작동시키고 있는 '방어기제'와 '핵심 인지 왜곡', 그리고 이를 깨부술 수 있는 '패러다임 시프트 계몽 솔루션'을 도출하세요.

반드시 아래 JSON 형식으로 응답하세요:
{
  "primaryCategory": "${primaryIssue}",
  "primaryCategoryName": "번아웃 | 취업/커리어 | 연애/관계 | 불안/마음 중 하나",
  "coreVulnerability": "사용자의 무의식적 핵심 결핍 한 문장",
  "defenseMechanism": "사용 중인 주요 방어 기제 (예: 완벽주의적 회피, 타인 인정 의존, 과잉 통제)",
  "cognitiveDistortion": "대표적인 인지 왜곡 (예: 흑백논리, 파국화, 당위적 사고)",
  "currentParadigm": "현재 사로잡혀 있는 왜곡된 믿음",
  "awakeningDirection": "앞으로 나아갈 계몽 및 메타인지 방향성",
  "metacognitionScore": 68,
  "scores": {
    "burnout": 85,
    "career": 60,
    "romance": 45,
    "anxiety": 78
  },
  "customAlertPreview": "어제 걱정하셨던 최악의 시나리오 중 오늘 아침 실제로 일어난 일이 있나요? 오늘은 '지금 여기'에만 집중해보세요.",
  "recommendedMentorQuote": "진정한 성장은 남의 기준을 모방하는 것이 아니라 나만의 속도를 회복하는 데서 시작됩니다."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      res.json(parsed);
    } catch (err: any) {
      console.error('Error in /api/assessment/onboarding:', err);
      res.json({
        primaryCategory: 'burnout',
        primaryCategoryName: '번아웃 (소진과 무기력)',
        coreVulnerability: '성취하지 못하면 가치가 없다는 무의식적 불안',
        defenseMechanism: '완벽주의적 과잉 몰입 및 회피',
        cognitiveDistortion: '흑백논리 및 당위적 사고 ("반드시 쉬지 않고 증명해야 해")',
        currentParadigm: '휴식은 뒤처짐이고 나의 무가치함을 증명한다.',
        awakeningDirection: '소진된 나를 향한 죄책감을 내려놓고, 통제할 수 없는 외부 기준에서 분리하기',
        metacognitionScore: 72,
        scores: { burnout: 88, career: 65, romance: 40, anxiety: 82 },
        customAlertPreview: '지금 느끼는 압박감 중 남의 기준에 맞추려 만든 가짜 의무는 무엇인가요?',
        recommendedMentorQuote: '잠시 멈추는 것은 멈춤이 아니라 방향을 재정렬하는 가장 용기 있는 선택입니다.'
      });
    }
  });

  // 4. Daily Awakening Alert (카카오톡 데일리 맞춤 계몽 알림톡)
  app.post('/api/notifications/awakening-alert', async (req, res) => {
    const { 
      category = 'anxiety', 
      userName = '회원', 
      lastSessionSummary = '미래에 대한 불확실성 때문에 잠을 못 이루고 불안해함',
      distortion = '파국화 시나리오'
    } = req.body || {};

    try {
      const ai = getAi();

      const prompt = `당신은 라이프업의 '데일리 맞춤 계몽 알림톡' 발송 시스템입니다.
내담자: ${userName}님
주요 테마: ${category}
최근 상담/고민 요약: "${lastSessionSummary}"
사용자의 인지적 맹점/왜곡: "${distortion}"

[목표]
어제 상담한 내용을 바탕으로, 유저의 '인지적 맹점'을 찌르는 단 한 줄의 날카로운 통찰 문장과 질문을 생성하세요.
단순 응원이 아니라, 머릿속의 착각을 깨부수고 웹사이트의 [오늘의 계몽 일기 / 패러다임 시프트]를 작성하도록 유도(Nudge)해야 합니다.

예시 (불안 유저):
"${userName}님, 좋은 아침입니다. 어제 밤에 걱정하셨던 최악의 시나리오 중, 오늘 아침에 실제로 일어난 일이 있나요? 오늘은 '지금 여기'에만 집중해보세요. 👉 [오늘의 계몽 일기 쓰러 가기]"

반드시 JSON 형식으로 출력하세요:
{
  "sharpQuote": "내담자의 인지적 맹점을 찌르는 핵심 한 줄 통찰",
  "deepQuestion": "오늘 하루 스스로에게 던져야 할 메타인지 질문",
  "kakaoTemplateText": "[라이프업 👁️ 오늘의 맞춤 계몽 알림]\\n\\n안녕하세요 ${userName}님!\\n\\n💡 \\"{sharpQuote}\\"\\n\\n⚡ 오늘의 성찰 질문: {deepQuestion}\\n\\n👉 [지금 계몽 노트에 오늘의 관점 기록하기]",
  "actionUrl": "/diary?theme=${category}"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      res.json(parsed);
    } catch (err: any) {
      console.error('Error in /api/notifications/awakening-alert:', err);
      res.json({
        sharpQuote: '어젯밤 당신을 괴롭혔던 수많은 걱정 중, 오늘 아침 실제로 일어난 일은 몇 개인가요?',
        deepQuestion: '오늘 일어날 일 중 내가 100% 통제할 수 있는 일은 무엇인가요?',
        kakaoTemplateText: `[라이프업 👁️ 오늘의 맞춤 계몽 알림]\n\n안녕하세요 ${userName}님!\n\n💡 "어젯밤 당신을 괴롭혔던 걱정 중, 실제로 일어난 일은 몇 개인가요?"\n\n⚡ 오늘의 질문: 오늘 내가 100% 통제할 수 있는 일에만 집중해보세요.\n\n👉 [지금 계몽 노트 작성하기]`,
        actionUrl: `/diary?theme=${category}`
      });
    }
  });

  // 5. Subscription Checkout
  app.post('/api/subscription/checkout', async (req, res) => {
    const { plan = 'subscribed', paymentMethod = 'kakaopay', userName = '회원' } = req.body;
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    res.json({
      success: true,
      transactionId: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      plan: 'subscribed',
      amount: 6500,
      status: 'active',
      currentPeriodEnd: periodEnd.toISOString(),
      message: '라이프업 월간 정기 구독(월 6,500원)이 성공적으로 완료되었습니다!'
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LifeUp Coaching Portal running on port ${PORT}`);
  });
}

startServer();
