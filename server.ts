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

const COACH_PROMPTS: Record<string, string> = {
  mindset: `당신은 라이프업의 '멘탈 힐링 & 자존감 회복 수석 코치' 김서연입니다.
- 전문 분야: 번아웃 극복, 감정 회복탄력성, 자존감 및 건강한 심리적 경계 설정
- 태도: 따뜻하고 공감 가득하면서도 내면의 단단한 중심을 잡도록 돕는 전문 코칭
- 목표: 사용자가 남과의 비교나 불안에서 벗어나 오늘 당장 실천할 수 있는 긍정적인 행동 1가지를 얻어가도록 돕습니다.`,

  career: `당신은 라이프업의 '커리어 도약 & 목표 달성 마스터 코치' 박민우입니다.
- 전문 분야: 이직/승진 로드맵, 시간 관리 및 실행력 극대화, 비즈니스 몰입 전략
- 태도: 논리적이고 명쾌하며 실질적인 액션 플랜을 제시하는 든든한 페이스메이커
- 목표: 막연한 고민을 구체적인 우선순위와 3단계 실행 과제로 구체화하도록 안내합니다.`,

  routine: `당신은 라이프업의 '모닝 루틴 & 습관 설계 코치' 이지안입니다.
- 전문 분야: 작심삼일 타파, 미루는 습관 교정, 데일리 리추얼 자동화
- 태도: 밝고 활기차며 작은 성취에도 큰 용기를 주는 에너자이저
- 목표: 실패 없는 5분 단위의 최소 습관(Tiny Habit)을 설계해 즉각적인 성취감을 맛보게 합니다.`,

  burnout: `당신은 라이프업의 '스트레스 완화 & 심리 케어 전문의' 최현석입니다.
- 전문 분야: 만성 피로, 직무 스트레스, 불안 및 불면 완화, 편안한 쉼의 기술
- 태도: 온화하고 안정감을 주는 전문가로서 마음에 안전지대를 만들어 줍니다.
- 목표: 스스로를 몰아세우는 완벽주의를 내려놓고 온전한 쉼과 재충전의 방법을 알려줍니다.`
};

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
      const { name, phone, content, programType = '일반 무료 상담' } = req.body;

      if (!name || !phone) {
        return res.status(400).json({ error: '이름과 연락처를 모두 입력해주세요.' });
      }

      const inquiryId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      console.log(`[Fast Lead Captured] ${name} (${phone}) - ${programType}: ${content}`);

      res.json({
        success: true,
        inquiryId,
        message: `${name}님, 무료 상담 신청이 성공적으로 접수되었습니다. 담당 전문 코치가 1시간 이내에 안내 연락을 드립니다.`,
        scheduledKakaoAlert: true
      });
    } catch (err: any) {
      console.error('Error in /api/leads/fast-inquiry:', err);
      res.status(500).json({ error: '상담 신청 처리 중 오류가 발생했습니다.' });
    }
  });

  // 2. High-Converting 1:1 Life Coaching API
  app.post('/api/chat/coaching', async (req, res) => {
    try {
      const { messages, coach = 'mindset', category = 'general', userName = '고객' } = req.body;
      const ai = getAi();
      const coachInstruction = COACH_PROMPTS[coach] || COACH_PROMPTS.mindset;

      const conversationHistory = (messages || []).map((m: { role: string; content: string }) => 
        `${m.role === 'user' ? userName : '라이프 코치'}: ${m.content}`
      ).join('\n');

      const systemPrompt = `${coachInstruction}

상담 주제: ${category}
고객 이름: ${userName}님

[대화 히스토리]
${conversationHistory}

[코칭 지침]
1. 고객의 상황과 감정에 깊이 공감하고, 전문 코치로서 용기를 북돋아 주는 따뜻하고 명확한 조언을 건네세요.
2. 오늘 당장 5분 안에 실천할 수 있는 구체적인 행동 미션 1개(actionItem)를 명확히 제시하세요.
3. 이 대화에서 고객이 기억해야 할 핵심 원 포인트 레슨(keyTakeaway)을 1문장으로 요약하세요.
4. 추가로 이야기 나누어 볼 수 있는 추천 질문 주제 2~3개(suggestedTopics)를 제공하세요.

반드시 아래 JSON 형식으로 응답하십시오:
{
  "message": "코칭 메시지 본문",
  "actionItem": "오늘 실천할 5분 미션",
  "keyTakeaway": "핵심 요약 한 문장",
  "suggestedTopics": [
    "추천 주제 1",
    "추천 주제 2"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: systemPrompt,
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
          message: `${userName}님, 언제나 완벽할 필요는 없습니다. 지금 이 순간 나 자신을 믿고 한 걸음씩 나아가 보세요.`,
          actionItem: '오늘 나에게 가장 편안한 10분의 휴식 선물하기',
          keyTakeaway: '작은 실행이 모여 가장 확실한 변화를 만듭니다.',
          suggestedTopics: ['스트레스 다스리기', '내일의 우선순위 정하기']
        };
      }

      res.json(parsed);
    } catch (err: any) {
      console.error('Error in /api/chat/coaching:', err);
      res.status(500).json({ 
        error: err.message || 'Internal server error',
        message: '잠시 생각을 정리 중입니다. 언제든 당신의 고민을 들려주세요.',
        actionItem: '오늘 감사한 일 1가지 메모해보기',
        keyTakeaway: '변화는 지금 이 순간 시작됩니다.',
        suggestedTopics: ['자존감 채우기', '효율적인 시간 관리']
      });
    }
  });

  // 3. Daily Morning Care Notification Generator (카카오톡 모닝케어)
  app.post('/api/notifications/morning-care', async (req, res) => {
    try {
      const { topic = '동기부여와 활력', userName = '회원', coach = 'mindset' } = req.body;
      const ai = getAi();

      const prompt = `당신은 프리미엄 라이프 코칭 서비스 '라이프업(LifeUp)'의 데일리 모닝 알림톡 발송 엔진입니다.
고객 이름: ${userName}님
오늘의 코칭 테마: ${topic}
담당 코치: ${coach}

[요구사항]
아침에 카카오톡 알림톡을 받았을 때, 하루를 활기차고 주체적으로 시작할 수 있는 강력한 모닝 메시지와 오늘의 1일 1실천 챌린지를 생성하세요.

반드시 JSON 형식으로 응답하십시오:
{
  "topic": "${topic}",
  "morningMessage": "따뜻하고 힘이 나는 2~3문장의 아침 응원 메시지",
  "actionChallenge": "오늘 실천할 명확한 데일리 챌린지 1개",
  "kakaoTemplateText": "[라이프업 🌅 오늘의 모닝 코칭]\\n\\n안녕하세요 ${userName}님! 활기찬 아침입니다.\\n\\n💬 \\"{morningMessage}\\"\\n\\n⚡ 오늘의 챌린지: {actionChallenge}\\n\\n버튼을 눌러 오늘의 실천을 완료하고 성장 포인트를 받아보세요!"
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
      console.error('Error in /api/notifications/morning-care:', err);
      res.status(500).json({
        topic: '오늘의 활력 충전',
        morningMessage: '어제보다 더 빛날 당신의 하루를 응원합니다. 나만의 속도로 당당하게 걸어가세요!',
        actionChallenge: '오늘 가장 중요한 일 1가지에 25분간 온전히 몰입하기',
        kakaoTemplateText: `[라이프업 🌅 오늘의 모닝 코칭]\n\n어제보다 더 빛날 당신의 하루를 응원합니다!\n\n오늘 가장 중요한 일 1가지에 몰입해보세요.`
      });
    }
  });

  // 4. Life Balance Score Analysis
  app.post('/api/analyze/life-balance', async (req, res) => {
    try {
      const { notes = '', category = 'general' } = req.body;
      const ai = getAi();

      const prompt = `사용자의 최근 메모 및 고민: "${notes}"
이 내용을 바탕으로 라이프업의 5대 라이프 밸런스 지수(0~100)와 맞춤 처방을 도출하세요.

JSON 출력 형식:
{
  "mindset": 78,
  "productivity": 82,
  "clarity": 70,
  "routine": 85,
  "relationships": 75,
  "summary": "전반적으로 실행력과 루틴이 안정화되고 있으며, 멘탈 회복 탄력성을 강화할 시점입니다.",
  "recommendedProgram": "1:1 멘탈 케어 & 자존감 회복 코칭"
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
      console.error('Error in /api/analyze/life-balance:', err);
      res.json({
        mindset: 75,
        productivity: 80,
        clarity: 70,
        routine: 85,
        relationships: 72,
        summary: '규칙적인 루틴을 바탕으로 삶의 중심을 단단히 세워가고 계십니다.',
        recommendedProgram: '데일리 모닝케어 & 습관 챌린지'
      });
    }
  });

  // 5. Subscription Checkout
  app.post('/api/subscription/checkout', async (req, res) => {
    const { plan, paymentMethod = 'kakaopay', userName = '회원' } = req.body;
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    res.json({
      success: true,
      transactionId: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      plan,
      status: 'active',
      currentPeriodEnd: periodEnd.toISOString(),
      message: `${plan === 'premium' ? '프리미엄 멤버십' : '베이직 멤버십'} 구독이 성공적으로 완료되었습니다!`
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
