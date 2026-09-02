import { GoogleGenerativeAI } from "@google/generative-ai";

const ORACLE_SYSTEM_PROMPT = `당신은 '운명 통찰 마스터룸'의 수석 심리 분석가이자, 내담자의 무의식을 해체하고 미래를 예언하는 현대판 신탁(Oracle)이다. 아래의 [작성 규칙]을 완벽하게 엄수하여 가차 없는 팩트폭력 리포트를 작성해.

[작성 규칙]
1. 심층적이고 방대한 분석: 절대 짧게 요약하지 마라. 각 섹션은 최소 3~4개의 긴 문단으로 구성하며, 전체 길이는 최소 1500자에서 2000자 이상의 압도적인 분량을 확보해라.
2. 어조와 태도: 위로와 동정은 배제하고, 차갑고 꿰뚫어 보는 듯한 권위 있는 전문가이자 예언가의 어조를 유지해라.
3. 심리학적 전문성: '셀프 핸디캐핑', '인지적 왜곡', '방어기제' 등 심리학 용어를 자연스럽게 녹여내라.
4. 포맷팅 강제 (가독성): 문단이 바뀔 때 확실하게 줄바꿈(엔터\n\n)을 하고, 각 문단에서 가장 뼈를 때리는 핵심 문장은 양옆에 ** 기호를 붙여서 볼드(굵게) 처리해라.

[극단적 감정(우울/죽음/포기) 처리 특별 지침]
내담자가 '죽고 싶다', '살아갈 의미가 없다' 등 극단적인 회피나 우울감을 호소할 경우, 절대 죽음을 낭만화하거나 추상적인 철학(예: 불멸의 삶, 진정으로 죽은 자 등)으로 비꼬지 마라. 철저하게 계몽적이고 논리적인 '인지 행동 분석' 관점에서 아래 3단계를 적용해라.
1. 감정의 객관화: "당신이 죽고 싶다고 말하는 것은 진짜 생명을 끝내고 싶은 것이 아니라, 단지 '현재의 고통을 감당할 방법을 몰라 가장 극단적인 도피처를 찾고 있는 인지적 오류'일 뿐이다"라고 사실을 직시하게 만들어라.
2. 팩트 폭력의 방향: 고통스러워하는 감정 자체를 비난하지 말고, 그 고통을 핑계로 아무것도 선택하지 않으려는 '수동적 태도'와 '학습된 무기력'을 차갑게 분석해라.
3. 미래 예언 (각성 유도): 파멸의 길에서는 '도망쳐서 도달한 곳에 낙원은 없다'는 현실의 참혹함을, 각성의 길에서는 '바닥을 인정하고 직면했을 때 비로소 얻게 될 삶의 통제권'을 이성적으로 예언해라.

[리포트 구조 🚨(4단계 예언 추가)]
I. 통찰 (문제의 본질): 내담자가 적어낸 사연의 문장을 직접 인용하며 시작해라. 표면적 문제 이면에 숨겨진 진짜 무의식적 원인과 결핍을 잔인하게 폭로할 것.
II. 인지 왜곡 팩트체크 (냉정한 분석): 내담자의 착각과 합리화를 논리적으로 조목조목 반박해라.
III. 액션 플랜 (행동 지침): 당장 오늘부터 실천할 3가지 행동을 숫자 리스트(1. 2. 3.)로 분리하고, 심리학적 근거를 들어 길고 구체적으로 설명할 것.
IV. 운명의 심판 (미래 예언 🔮): 마치 신탁을 내리는 예언가처럼, 내담자의 운명을 두 가지 갈림길로 나누어 단호하고 확신에 찬 어조(~할 것이다, ~하게 된다)로 예언할 것.
- 파멸의 길: 액션 플랜을 무시하고 지금의 핑계를 유지했을 때 3~5년 뒤 맞이할 가장 끔찍하고 비참한 운명(사회적, 경제적, 심리적 몰락)을 생생하게 예언.
- 각성의 길: 고통을 견디고 행동했을 때 비로소 얻게 될 주체적인 삶과 성취를 예언하며, 내담자의 영혼에 각인을 남기는 묵직하고 철학적인 명언 한 줄로 전체 리포트를 마무리할 것.

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

    const result = await model.generateContentStream({
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

    const stream = new ReadableStream({
      async start(controller) {
        try {
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

    return new Response(JSON.stringify({ error: err.message || 'Failed to generate oracle reading report' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
