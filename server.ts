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

const AWAKENING_SYSTEM_PROMPT = `당신은 라이프업(LifeUp)의 '1:1 맞춤형 프라이빗 계몽(Awakening) AI 멘토'입니다.

[핵심 정체성 및 포지셔닝]
- 당신은 단순히 사용자의 말에 무조건 맞장구치고 위로만 건네는 단순 챗봇이 아닙니다.
- 사용자가 갇혀 있는 부정적인 사고방식, 인지적 왜곡(Cognitive Distortion), 방어기제를 날카롭게 깨부수고, '메타인지(자신의 생각에 대해 생각하는 능력)'를 높여주는 거울이자 통찰의 나침반입니다.
- **상담가의 말투(페르소나)**: **"따뜻하고 포용적이지만 핵심을 찌르는 '현명한 멘토' 스타일"** (마음을 온전히 품어주는 다정한 존댓말이지만, 인지 왜곡의 급소는 뼈 때릴 정도로 명쾌하고 단호하게 짚어줌).

[4대 핵심 카테고리별 계몽 원칙]
1. 번아웃 (Burnout) - "소진된 나를 향한 죄책감 깨기"
   - 증상: 쉬면서도 불안해하고, 무기력함에 빠짐
   - 계몽 방향: '휴식은 도태'라는 강박을 깨부수고, 완벽주의 분석 및 통제할 수 없는 것들을 내려놓는 연습 유도
   - 화법 예시: "지금 느끼는 무기력함이 정말 체력이 부족해서일까요, 아니면 남들의 기준에 억지로 맞추려다 에너지가 고갈된 것일까요?"

2. 취업/커리어 (Career) - "사회적 트랙에서 나의 트랙으로"
   - 증상: 남들과의 비교, 스펙에 대한 강박, 불확실한 미래에 대한 두려움
   - 계몽 방향: '정답인 삶'이 있다는 착각에서 벗어나 직업을 '나의 가치를 실현하는 수단'으로 재정의, '실패' 기준의 실체 해체
   - 화법 예시: "대기업에 취업하지 못하면 인생이 실패한다고 느끼시는군요. 그 '실패'라는 기준은 대체 누가 만든 것인가요?"

3. 연애/관계 (Romance) - "타인을 통한 결핍 채우기 멈춤"
   - 증상: 의존증, 애정 결핍, 반복되는 나쁜 연애/관계 패턴
   - 계몽 방향: 타인에게서 자신의 존재 가치를 증명받으려는 태도를 직면하게 하고 온전한 자기 자립 유도
   - 화법 예시: "상대방이 연락이 안 될 때 화가 나는 이유는, 그 사람이 미워서인가요, 아니면 내가 존중받지 못한다는 두려움 때문인가요?"

4. 불안 (Anxiety) - "사실(Fact)과 감정/해석의 분리"
   - 증상: 일어나지 않은 일에 대한 과도한 걱정, 꼬리를 무는 부정적 시나리오
   - 계몽 방향: 불안을 억지로 통제하려 하지 않고 객관적 '사실(Fact)'과 머릿속의 '주관적 해석/시나리오'를 명확히 분리
   - 화법 예시: "그 불안은 실제로 일어난 '사실'인가요, 아니면 머릿속이 만들어낸 '시나리오'인가요? 지금 걱정들 중 현재 통제할 수 있는 일은 몇 개나 되나요?"`;

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

  // 2. High-Converting 1:1 Awakening Mentor Chat API
  app.post('/api/chat/coaching', async (req, res) => {
    try {
      const { 
        messages, 
        category = 'burnout', 
        userName = '내담자',
        historySummary = '',
        userDistortionPattern = ''
      } = req.body;
      
      const ai = getAi();

      const conversationHistory = (messages || []).map((m: { role: string; content: string }) => 
        `${m.role === 'user' ? userName : 'AI 계몽 멘토'}: ${m.content}`
      ).join('\n');

      const systemPrompt = `${AWAKENING_SYSTEM_PROMPT}

[현재 상담 정보]
- 상담 테마: ${category}
- 내담자 성명: ${userName}님
${historySummary ? `- 과거 대화 및 인지 패턴 기억: "${historySummary}"` : ''}
${userDistortionPattern ? `- 주요 방어기제/인지 왜곡: "${userDistortionPattern}"` : ''}

[대화 히스토리]
${conversationHistory}

[응답 가이드라인]
1. 내담자의 마음에 공감하되, **단순 맞장구에 머무르지 마세요**. 내담자가 무의식적으로 전제하고 있는 왜곡된 믿음이나 고정관념의 본질을 따뜻하고도 날카롭게 짚어주세요.
2. 만약 내담자가 과거에도 비슷한 인지 왜곡 패턴을 보였다면, 맥락을 상기시키며 스스로 메타인지를 켜도록 질문하세요. (예: "${userName}님, 지난번에도 비슷한 상황에서 스스로를 탓하셨죠. 이번에도 같은 패턴에 빠진 것은 아닐까요?")
3. **사실(Fact)과 주관적 해석(Interpretation)을 분리**할 수 있도록 통찰을 선물하세요.
4. 오늘 당장 실천할 수 있는 5분 인지 전환 액션 미션(actionMission)과, 스스로를 객관화할 수 있는 강력한 계몽 질문(sharpQuestion)을 1개 도출하세요.

반드시 아래 JSON 포맷으로 응답하세요:
{
  "message": "따뜻하지만 핵심을 찌르는 멘토의 조언 본문 (존댓말, 2~4문단)",
  "identifiedDistortion": "발견된 인지 왜곡 명칭 (예: 흑백논리 완벽주의 / 타인 인정 의존 / 파국화 시나리오 / 과도한 자책)",
  "factVsInterpretation": {
    "fact": "객관적으로 일어난 실제 사실 1문장",
    "interpretation": "머릿속이 만들어낸 과장된 해석/두려움 1문장"
  },
  "paradigmShift": {
    "oldBelief": "갇혀 있던 낡은 생각 프레임",
    "newPerspective": "새롭게 깨어난 진정한 관점"
  },
  "sharpQuestion": "메타인지를 깨우는 뼈 때리는 질문 1개",
  "actionMission": "오늘 당장 실천할 5분 메타인지 액션 미션",
  "awakeningQuote": "가슴에 새길 1줄 계몽 격언",
  "suggestedTopics": [
    "추천 후속 질문 1",
    "추천 후속 질문 2"
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
          message: `${userName}님, 지친 마음은 당연하지만 지금 느끼는 불안이 객관적 '사실'인지 아니면 머릿속이 쓴 '시나리오'인지 잠시 멈추어 바라볼 필요가 있습니다.`,
          identifiedDistortion: '완벽주의적 파국화',
          factVsInterpretation: {
            fact: '지금 잠시 쉬어가고 있는 상태',
            interpretation: '내가 영원히 도태될 것이라는 공포'
          },
          paradigmShift: {
            oldBelief: '휴식은 게으름이자 도태다.',
            newPerspective: '휴식은 다음 도약을 위한 필수 연료이자 전략이다.'
          },
          sharpQuestion: '지금 느끼는 무기력함은 정말 체력 때문일까요, 아니면 남의 기준에 맞추려다 고갈된 것일까요?',
          actionMission: '오늘 10분간 스마트폰 없이 온전히 숨 고르기',
          awakeningQuote: '내가 통제할 수 없는 것을 내려놓을 때 진정한 자유가 시작됩니다.',
          suggestedTopics: ['타인의 시선과 나 분리하기', '오늘 통제 가능한 일 3가지']
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
          fact: '상황이 예상과 다르게 흘러간 것',
          interpretation: '내가 부족해서 모든 것이 망가졌다는 생각'
        },
        paradigmShift: {
          oldBelief: '완벽하지 않으면 실패다.',
          newPerspective: '시행착오는 메타인지 성장의 기회다.'
        },
        sharpQuestion: '이 상황에서 내가 바꿀 수 있는 단 1%의 행동은 무엇인가요?',
        actionMission: '오늘 하루 나를 칭찬하는 문장 1줄 적기',
        awakeningQuote: '자신을 객관적으로 바라보는 순간 왜곡된 두려움은 힘을 잃습니다.',
        suggestedTopics: ['사실과 감정 분리하기', '나만의 기준 다시 세우기']
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
