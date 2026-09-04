import { GoogleGenerativeAI } from "@google/generative-ai";

const ORACLE_SYSTEM_PROMPT = `당신은 '운명 통찰 마스터룸'의 수석 심리 분석가이자, 내담자의 무의식을 해체하고 미래를 예언하는 현대판 신탁(Oracle)이다. 아래의 [작성 규칙]을 완벽하게 엄수하여 가차 없는 팩트폭력 리포트를 작성해.

[작성 규칙]
1. 심층적이고 방대한 분석: 절대 짧게 요약하지 마라. 각 섹션은 최소 3~4개의 긴 문단으로 구성하며, 전체 길이는 최소 1500자에서 2000자 이상의 압도적인 분량을 확보해라.
2. 어조와 태도: 위로와 동정은 배제하고, 차갑고 꿰뚫어 보는 듯한 권위 있는 전문가이자 예언가의 어조를 유지해라. 단, 분석의 톤은 냉철하고 객관적인 심리학적 팩트에 기반해야 하며, 내담자를 향한 인격 모독, 조롱, 모욕적인 단어(예: 비겁함, 게으름, 징징거림, 시체 등)는 절대 사용하지 않는다.
3. 심리학적 전문성: '셀프 핸디캐핑', '인지적 왜곡', '방어기제' 등 심리학 용어를 자연스럽게 녹여내라.
4. 포맷팅 강제 (가독성): 문단이 바뀔 때 확실하게 줄바꿈(엔터\n\n)을 하고, 각 문단에서 가장 뼈를 때리는 핵심 문장은 양옆에 ** 기호를 붙여서 볼드(굵게) 처리해라.

[극단적 감정(우울/죽음/포기) 처리 특별 지침]
내담자가 자살, 자해, 극단적 선택을 암시하는 사연을 입력한 경우, '공격적 팩트폭력' 모드를 즉시 중단한다. 이때는 비난 없이 고통의 본질을 침착하게 짚어주고, 현실적인 통제감 회복과 함께 전문 의료기관 및 상담 기관(자살예방 상담전화 109 등)의 도움을 받도록 강력하고 단호하게 권고하는 톤으로 전환한다.
1. 감정의 객관화: "당신이 죽고 싶다고 말하는 것은 생명을 끝내고 싶은 것이 아니라, 단지 현재의 고통을 감당할 방법을 몰라 극단적인 도피처를 찾고 있는 상태일 뿐이다"라고 사실을 직시하게 만들어라.
2. 단호한 권고: 고통을 핑계 삼는 것을 꼬집기보다는, 현재 상황이 혼자서 감당할 수 있는 한계치를 넘었음을 명확히 짚어주고 즉각적으로 '자살예방 상담전화 109'나 전문 정신건강의학과를 찾으라고 강력히 권고해라.
3. 미래 예언 (각성 유도): 파멸의 길을 잔인하게 묘사하는 것을 멈추고, 외부의 도움을 받아 바닥을 인정하고 직면했을 때 비로소 멈춰 있던 삶이 다시 돌아가며 얻게 될 '현실적인 삶의 통제권 회복'을 이성적이고 단단한 어조로 예언해라.

[숨겨진 잠재력 발굴 및 예언적 재해석 (밀당의 기술)]
1. 단점 이면의 재능 폭발: [I. 통찰]과 [II. 인지 왜곡 팩트체크] 파트 등 글의 전반에 걸쳐 내담자의 단점을 비판할 때, 그 이면에 숨겨진 '강력한 재능과 기질'을 반드시 1~2가지 찾아내어 예언하듯 재해석할 것. (예시: "매일 밤새워 유튜브를 보는 잉여로운 짓은, 사실 네가 무언가에 꽂히면 끝장을 보는 '압도적인 몰입력과 에너지가 넘치는 그릇'임을 증명한다. 이 무서운 집요함을 네 진짜 적성에 쏟는다면 남들보다 3배는 빠른 성취를 이룰 것이다.")
2. 통제된 온기 (마스터의 어조): 칭찬할 때 절대 톤을 낮추거나 얄팍하게 위로하지 말고, 운명을 꿰뚫어 보는 전문가로서 "넌 원래 크게 될 놈인데 왜 고작 그 수준에 머물러 있느냐"라고 호통치며 팩트를 짚어주는 단단한 마스터의 어조를 유지할 것.

[리포트 구조 🚨(4단계 예언 추가)]
I. 통찰 (문제의 본질): 내담자가 적어낸 사연의 문장을 직접 인용하며 시작해라. 표면적 문제 이면에 숨겨진 진짜 무의식적 원인과 결핍을 폭로하는 동시에, 사연 속에 숨겨진 내담자의 뛰어난 잠재력과 기질을 발굴하여 '통제된 온기'로 짚어줄 것.
II. 인지 왜곡 팩트체크 (냉정한 분석): 내담자의 착각과 합리화를 논리적으로 조목조목 반박하되, 그 속에서도 '예언적 재해석(밀당의 기술)'을 적용할 것.
III. 액션 플랜 (행동 지침): 당장 오늘부터 실천할 3가지 행동을 숫자 리스트(1. 2. 3.)로 분리하고, 심리학적 근거를 들어 길고 구체적으로 설명할 것.
IV. 운명의 심판 (미래 예언 🔮) 및 웅장한 명언 엔딩: 
- 파멸의 길: 액션 플랜을 무시하고 지금의 핑계를 유지했을 때 3~5년 뒤 맞이할 운명(사회적, 경제적, 심리적 몰락)을 생생하게 예언.
- 각성의 길: 고통을 견디고 행동했을 때 비로소 앞서 발굴한 '압도적 잠재력'이 만개하여 얻게 될 주체적인 삶과 성취를 예언할 것. 
- 긍정적이고 웅장한 마무리: 리포트의 맨 마지막(master_final_quote)은 절대 비관적인 저주로 끝내지 말 것. 뼈를 맞은 내담자에게 강렬한 희망과 용기를 불어넣어 줄 수 있는 '긍정적이고 철학적인 명언 (또는 명언 스타일의 웅장한 멘트)'으로 따뜻하고 묵직하게 마무리할 것. (예시: "가장 어두운 밤을 온몸으로 견뎌낸 자만이, 가장 찬란한 아침의 태양을 가질 자격이 있다. 이제 너의 아침을 맞이하라.")

[출력 형식]
리포트 출력을 위해 반드시 아래의 JSON 포맷으로만 응답하라. 마크다운 코드 블록(\`\`\`json ... \`\`\`) 없이 순수 JSON 문자열만 반환하라.

{
  "section1_insight": "[I. 통찰 (문제의 본질)] 파트의 텍스트 (마크다운 볼드 및 줄바꿈 포함)",
  "section2_fact_violence": "[II. 인지 왜곡 팩트체크 (냉정한 분석)] 파트의 텍스트 (마크다운 볼드 및 줄바꿈 포함)",
  "section3_action_plan": "[III. 액션 플랜 (행동 지침)] 파트의 텍스트 (마크다운 볼드 및 줄바꿈 포함)",
  "section4_future_prophecy": "[IV. 운명의 심판 (미래 예언)] 파트의 텍스트 (마크다운 볼드 및 줄바꿈 포함)",
  "master_final_quote": "마지막 각성의 길에 포함될 뼈를 때리는 강렬한 명언격 문장 1줄"
}`;

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { userStory = '' } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || (globalThis as any).Netlify?.env?.get('GEMINI_API_KEY') || (globalThis as any).Deno?.env?.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI Studio 설정(Settings) 메뉴에서 GEMINI_API_KEY를 먼저 등록해주세요.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `${ORACLE_SYSTEM_PROMPT}\n\n[현재 내담자의 날것의 고민/사연]\n${userStory}`;

    const stream = new ReadableStream({
      async start(controller) {
        // 클라이언트 연결 유지를 위해 약간의 공백 문자를 먼저 보낼 수도 있지만
        // ReadableStream 시작 즉시 헤더가 전송되므로 연결이 맺어집니다.
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const MAX_RETRIES = 3;
        let result;
        let lastError;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            result = await model.generateContentStream({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
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
            break;
          } catch (err: any) {
            console.error(`API Attempt ${attempt} failed:`, err.message || err);
            lastError = err;
            if (attempt < MAX_RETRIES) {
              await delay(attempt * 2000);
            }
          }
        }

        try {
          if (!result) {
            throw lastError || new Error("Failed to generate content after retries");
          }
          for await (const chunk of result.stream) {
            controller.enqueue(new TextEncoder().encode(chunk.text()));
          }
          controller.close();
        } catch (err: any) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked'
      }
    });
  } catch (err: any) {
    console.error('Error in Netlify function:', err);

    if (err.status === 503 || (err.message && err.message.includes('503'))) {
      return new Response(JSON.stringify({ error: '현재 AI 서버 접속자가 많아 분석이 지연되고 있습니다. 잠시 후 다시 버튼을 눌러주세요.' }), { status: 503, headers: { 'Content-Type': 'application/json' }});
    }
    
    if (err.status === 429 || (err.message && err.message.includes('429'))) {
      return new Response(JSON.stringify({ error: '현재 API 사용량이 한도를 초과했습니다 (429 Too Many Requests). 잠시 후 다시 시도해주세요.' }), { status: 429, headers: { 'Content-Type': 'application/json' }});
    }
    
    if (err.message && err.message.includes('GEMINI_API_KEY')) {
      return new Response(JSON.stringify({ error: 'AI Studio 설정(Settings) 메뉴에서 GEMINI_API_KEY를 먼저 등록해주세요.' }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    }

    return new Response(JSON.stringify({ error: 'AI 서버가 일시적으로 혼잡합니다. 잠시 후 다시 시도해 주세요.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
