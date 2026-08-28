import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

let aiClient: GoogleGenerativeAI | null = null;
function getAi(): GoogleGenerativeAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required.');
    }
    aiClient = new GoogleGenerativeAI(key);
  }
  return aiClient;
}

const ORACLE_SYSTEM_PROMPT = `[Role & Persona]
당신은 인생의 방향을 잃고 방황하는 자들에게 단 한 번의 강력한 통찰로 닫힌 시야를 깨워주는(Awakening) '운명 통찰가(Life Oracle)'입니다.
사용자는 1회성 유료 결제를 마친 상태이며, 깊이 있고 압도적인 분량의 '운명 통찰 리포트(PDF)'를 기대하고 있습니다. 당신의 진단은 철학적/심리학적 통찰을 통해 사용자의 뼈를 때리고 인지적 왜곡을 파괴해야 합니다. 
압도적이고 권위 있으며, 깊은 연민과 냉철함이 공존하는 '현자'의 말투(무게감 있는 정중한 존댓말)를 사용하십시오.

[Core Rules]
1. 위로나 공감은 배제하고, 내담자가 착각하고 있는 환상이나 방어 기제를 직설적으로 깨부수세요.
2. 한 문장 한 문장이 문학적이고 철학적인 깊이를 가져야 하며, 비유와 은유를 적극 활용하세요.
3. 반드시 A4 용지 5페이지 분량 수준으로 아주 깊이 있고 방대한 분석을 제공할 것.
4. 각 섹션(통찰, 팩트체크, 액션플랜 등)마다 최소 1,000자 이상 구체적인 예시와 심리학적 근거를 들어 뼈를 때리게 작성할 것.
5. 출력 형식: 리포트 PDF 생성을 위해 **반드시 아래의 JSON 포맷으로만 출력**하세요. 마크다운 코드 블록(\`\`\`json ... \`\`\`) 없이 순수 JSON 문자열만 반환하세요.

[Output JSON Format]
{
  "section1_insight": "내담자의 겉으로 드러난 감정 이면에 숨겨진 진짜 두려움과 결핍을 꿰뚫어보는 통찰. (반드시 1,000자 이상, 구체적 예시와 심리학적 근거 포함)",
  "section2_fact_violence": "내담자가 스스로를 갉아먹고 있는 잘못된 믿음이나 핑계를 단호하게 짚어내고 인지적 왜곡을 파괴하는 구간. (반드시 1,000자 이상, 심리학적 개념 활용)",
  "section3_action_plan": "허상을 깨달은 내담자가 당장 오늘부터 실천해야 할 구체적이고 현실적인 행동 지침 2~3가지. (각 지침마다 왜 그것을 해야 하는지 철학적/심리학적 이유를 포함하여 전체 1,000자 이상 작성할 것)",
  "master_final_quote": "리포트 맨 마지막을 장식할 단 하나의 묵직하고 강렬한 명언격 문장 (50자 이내)"
}`;

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

  // 2. 1:1 운명 통찰 리포트 API (One-time Premium Reading)
  app.post('/api/oracle/reading', async (req, res) => {
    try {
      const { userStory = '' } = req.body;
      
      const ai = getAi();
      const model = ai.getGenerativeModel({ model: 'gemini-3.6-flash' });

      const prompt = `${ORACLE_SYSTEM_PROMPT}

[현재 내담자의 날것의 고민/사연]
${userStory}`;

      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 8192
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT' as any,
            threshold: 'BLOCK_NONE' as any,
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH' as any,
            threshold: 'BLOCK_NONE' as any,
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any,
            threshold: 'BLOCK_NONE' as any,
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any,
            threshold: 'BLOCK_NONE' as any,
          }
        ]
      });

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      for await (const chunk of result.stream) {
        res.write(chunk.text());
      }
      res.end();
    } catch (err: any) {
      console.error('Error in /api/oracle/reading:', err);
      
      if (res.headersSent) {
        // If stream already started, we can't send JSON anymore, just end the stream
        res.end();
        return;
      }
      
      if (err.status === 503 || (err.message && err.message.includes('503'))) {
        return res.status(503).json({ error: '현재 AI 서버 접속자가 많아 분석이 지연되고 있습니다. 잠시 후 다시 버튼을 눌러주세요.' });
      }
      
      if (err.status === 429 || (err.message && err.message.includes('429'))) {
        return res.status(429).json({ error: '현재 API 사용량이 한도를 초과했습니다 (429 Too Many Requests). 잠시 후 다시 시도해주세요.' });
      }
      
      if (err.message && err.message.includes('GEMINI_API_KEY')) {
        return res.status(500).json({ error: 'AI Studio 설정(Settings) 메뉴에서 GEMINI_API_KEY를 먼저 등록해주세요.' });
      }
      res.status(500).json({ error: err.message || 'Failed to generate oracle reading report' });
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
      const model = ai.getGenerativeModel({ model: 'gemini-3.6-flash' });

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

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(result.response.text().trim() || '{}');
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
      const model = ai.getGenerativeModel({ model: 'gemini-3.6-flash' });

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

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(result.response.text().trim() || '{}');
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
