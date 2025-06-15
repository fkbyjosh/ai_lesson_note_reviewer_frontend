
// deno-lint-ignore-file no-explicit-any
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lessonTitle, subject, classGroup, noteContent } = await req.json();

    const messages = [
      {
        role: "system",
        content: "You are a Nigerian education expert reviewing primary school lesson notes. Respond in JSON with keys 'clarity', 'structure', 'content', 'suggestions', 'overall'. Give actionable, constructive feedback and suggestions for improvement. Output ONLY valid JSON."
      },
      {
        role: "user",
        content:
          `Lesson Title: ${lessonTitle}\nSubject: ${subject}\nClass: ${classGroup}\nLesson Note:\n${noteContent}\nPlease analyze and respond with specific feedback for clarity, structure, content, suggestions, and overall assessment, in JSON.`
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.5,
        max_tokens: 700,
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    let feedback;
    try {
      feedback = data.choices?.[0]?.message?.content
        ? JSON.parse(data.choices[0].message.content)
        : null;
    } catch {
      feedback = null;
    }
    if (!feedback) {
      return new Response(JSON.stringify({ error: "AI did not return a valid review." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
