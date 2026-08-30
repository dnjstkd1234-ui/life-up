import { GoogleGenerativeAI } from "@google/generative-ai";

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

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { userStory = '' } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
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
