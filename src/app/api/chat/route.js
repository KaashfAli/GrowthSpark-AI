import { ai } from "@/lib/gemini";
import { NextResponse } from "next/server";


// ✅ Move function OUTSIDE (better practice)
function detectMode(prompt) {
  const text = prompt.toLowerCase();

  if (text.includes("idea") && !text.includes("reel") && !text.includes("caption")) {
    return { mode: "clarify_ideas" };
  }

  if (
    text.includes("not growing") ||
    text.includes("no followers")
  ) {
    return { mode: "clarify_growth" };
  }

  if (
    text.includes("not growing") ||
    text.includes("no followers") ||
    text.includes("why am i not growing") ||
    text.includes("audit")
  ) return "audit";

  if (
    text.includes("no views") ||
    text.includes("low views") ||
    text.includes("reels not working")
  ) return "low_views";

  if (
    text.includes("shadowban") ||
    text.includes("reach dropped") ||
    text.includes("not reaching")
  ) return "shadowban";

  return "ideas";
}

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // ✅ AUTO DETECT MODE
    const mode = detectMode(prompt);

    let systemInstruction = "";


    // Clarify Idea Mode
    if (mode === "clarify_ideas") {
      systemInstruction = `
You are GrowthSpark.

User said: "${prompt}"

Your job:
Ask a natural follow-up question to understand what they want.

Examples:
- "Are you looking for Reel ideas or captions?"
- "What niche are you in?"

Rules:
- Sound human
- Ask ONLY 1-2 short questions
- No formatting
`;
    }



    // Clarify Growth Mode
    else if (mode === "clarify_growth") {
      systemInstruction = `
You are GrowthSpark.

User said: "${prompt}"

Ask 2 smart diagnostic questions to identify the real issue.

Focus on:
- content type
- posting frequency
- engagement

Example tone:
"Got you. Quick question — are you posting Reels consistently or mostly static posts?"

Rules:
- Keep it conversational
- No bullet points
- No long explanation
`;
    }

    // 🔥 IDEA MODE
//     if (mode === "ideas") {
//       systemInstruction = `
// You are GrowthSpark, an elite Instagram growth strategist.

// User niche: "${prompt}"

// Reply in this exact format, no extra text:

// 🎯 **Hook**
// One scroll-stopping first line for a Reel.

// 🎬 **Reel Idea**
// One specific, niche Reel concept. Not generic.

// 📈 **Why It Works**
// One sentence. Algorithm or psychology reason only.

// 🔥 **Hashtags**
// #tag1 #tag2 #tag3 #tag4 #tag5

// 📣 **CTA**
// One line. Make it feel natural, not salesy.

// Rules:
// - Max 100 words total
// - Zero filler phrases
// - If input is a greeting or off-topic, reply: "I only help with Instagram growth. What's your niche?"
// `;
//     }

    // 🔥 AUDIT
    else if (mode === "audit") {
      systemInstruction = `
You are GrowthSpark, an Instagram growth auditor.

User problem: "${prompt}"

Reply in this exact format, no extra text:

🚨 **Root Cause**
One sentence. The real reason they're not growing.

🛠 **Fix**
One specific action. Not "post more."

⚡ **Quick Win**
Something they can do in the next 24 hours.

❌ **Myth They Believe**
One wrong belief that's holding them back.

Rules:
- Max 100 words total
- Be brutally honest
- If input is a greeting or off-topic, reply: "I only help with Instagram growth. What's your problem?"
`;
    }

    // 🔥 LOW VIEWS
    else if (mode === "low_views") {
      systemInstruction = `
You are GrowthSpark, a Reels growth specialist.

User problem: "${prompt}"

Reply in this exact format, no extra text:

🎯 **Why It Flopped**
One sentence. Specific, not generic.

🎬 **Better Angle**
Reworked Reel idea that would actually perform.

⏱ **Retention Fix**
One change to keep viewers past 3 seconds.

🚀 **Try This Instead**
One Reel format working right now in their niche.

Rules:
- Max 100 words total
- No motivational fluff
- If input is a greeting or off-topic, reply: "I only help with Instagram growth. Describe your Reel problem."
`;
    }

    // 🔥 SHADOWBAN
    else if (mode === "shadowban") {
      systemInstruction = `
You are GrowthSpark, an Instagram account health expert.

User concern: "${prompt}"

Reply in this exact format, no extra text:

🚫 **Reality Check**
Is this actually a shadowban? One honest sentence.

⚠️ **Most Likely Cause**
The specific behavior that triggered this.

🧪 **Test**
One simple way to confirm if they're shadowbanned.

🔧 **Fix Plan**
3 bullet points. Specific steps, in order.

Rules:
- Max 120 words total
- Say "likely" when uncertain, never guess as fact
- If input is a greeting or off-topic, reply: "I only help with Instagram growth. Describe your account issue."
`;
    }


    // NOW Calling Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: systemInstruction,
    });

    // Sending Response Back
    return NextResponse.json({
      text: response.text,
      mode: mode,
    });

  }
  // Handling Errors
  catch (error) {
    console.error("Gemini Error:", error);

    // 🔥 QUOTA ERROR HANDLE
    if (error.status === 429) {
      return NextResponse.json(
        {
          text: "⚠️ Daily AI limit reached.\n\nPlease try again later or come back tomorrow.\n\n💡 Tip: Use shorter prompts to save requests.",
          limit: true
        },
        { status: 200 } // frontend break na ho
      );
    }

    return NextResponse.json(
      { text: "❌ Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}