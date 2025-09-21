import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received prompt:", body);

    // Pass only the prompt string
    const result = await chatSession.sendMessage(body.prompt);

    // Extract text safely
    const textResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Response from AI:", textResponse);

    // Parse JSON response if possible
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(textResponse);
    } catch {
      jsonResponse = { raw: textResponse };
    }

    return NextResponse.json({ result: jsonResponse });

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
