// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const generationConfig = {
  responseMimeType: "application/json",
};

const model = ai.getGenerativeModel({ model: "gemini-2.5-pro" });
  const tools = [
    {
      googleSearch: {}
    },
  ];


 const history = [
    {
      role: 'user',
      parts: [
        {
          text: `Write a script to generate 30 seconds video on topic : Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field ,No Plain text`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `**Beginning Story Creation**

I've decided to start by finding a compelling historical story, keeping it short and scene-focused. My plan now is to draft a concise narration for each scene. Afterward, I'll move on to crafting detailed AI image prompts.


**Outlining the Narrative**

I'm now in the process of identifying a captivating historical narrative, ideally a short one with clear, distinct scenes. My current strategy is to first draft concise narrations for each scene. Following that, I'll focus on developing detailed, realistic AI image prompts for each scene. The goal is to culminate in a JSON object that neatly encapsulates the story.


**Refining the JSON Output**

I've been working on structuring the JSON output. Each scene will now have two core components. The first is a textual description of what will happen in that scene, like a mini-script. The second will dictate the visual elements, such as the setting or the actors. My goal is to strike a good balance between detail and flexibility.


**Defining Scene Content**

I've decided on the Chevalier d'Éon. Structuring the video into 5 scenes with roughly 6 seconds each feels right. Scene 1 will introduce him as a spy. I'm aiming for concise \`ContentText\` narration while crafting realistic \`imagePrompt\` visuals for each.


**Finalizing Scene Narratives**

I've been meticulously refining each scene's \`ContentText\` narration and matching it with compelling \`imagePrompt\` descriptions. Scene 1 sets the stage with the Chevalier as a spy; I'm picturing a serious, enigmatic portrait. Scene 2 delves into his Russian disguise, which will be a visually rich court scene. Scene 3's a battle scene! Scene 4… is being meticulously refined now.


**Refining the Scene Details**

I've been working on the specific details for each scene. I'm focusing on ensuring the \`ContentText\` narration flows naturally and the \`imagePrompt\` descriptions are detailed enough for the visual generation. I've given each scene a unique \`ContentText\` and matching \`imagePrompt\` now. Each scene covers an interesting stage in the Chevalier's life and is ready for the video.


**Structuring the Scene Sequence**

I've crafted a comprehensive JSON structure that now includes narration (\`ContentText\`) and detailed visual descriptions (\`imagePrompt\`) for five scenes. Each scene encapsulates a significant stage in Chevalier d'Éon's life, from his initial role as a spy to the enigmatic post-mortem discovery. My aim is to deliver a concise yet compelling visual story within the 30-second window.


`,
        },
        {
          text: `\`\`\`json
[
  {
    "imagePrompt": "A highly detailed, realistic portrait of the young Chevalier d'Éon in the 1750s. He is presented as an androgynous yet masculine figure in an aristocratic French diplomat's attire, standing in a dimly lit, ornate room in the Palace of Versailles. He holds a sealed letter with a red wax seal, his expression is sharp, intelligent, and enigmatic. The lighting should be reminiscent of a classic oil painting, with soft light illuminating one side of his face.",
    "ContentText": "In the 18th century, France had a secret weapon: the Chevalier d'Éon, a brilliant diplomat, and a formidable spy for King Louis XV."
  },
  {
    "imagePrompt": "A realistic, cinematic scene inside the opulent Russian court of Empress Elizabeth. The Chevalier d'Éon is flawlessly disguised as a beautiful woman, 'Lia de Beaumont', mingling with other ladies of the court. The camera is focused on the Chevalier, who is engaged in a subtle, secretive conversation, with the lavish gold and grandeur of the palace ballroom blurred in the background. The lighting is warm and comes from chandeliers.",
    "ContentText": "To gain the trust of the Russian Empress, the Chevalier transformed, spending years undercover as a woman, and successfully infiltrated the highest circles of power. [20]"
  },
  {
    "imagePrompt": "A dynamic and gritty, realistic battle scene from the Seven Years' War. Chevalier d'Éon, dressed in the blue uniform of a French Dragoon captain, is shown in the heat of battle, with a determined and courageous expression. He is on horseback, sword raised, leading a charge. The atmosphere is chaotic, with smoke, cannon fire, and soldiers clashing in the background.",
    "ContentText": "But the Chevalier was also a celebrated soldier, a captain of the Dragoons, decorated for bravery on the battlefield. [20]"
  },
  {
    "imagePrompt": "A poignant, realistic portrait of the older Chevalier d'Éon in London, now living permanently as a woman. She is dressed in the modest but elegant attire of a late 18th-century woman, wearing the prestigious Cross of Saint-Louis on her bodice. She is seated in a simple room, looking out a window with a contemplative and resilient expression. The light from the window should be soft and natural.",
    "ContentText": "Later in life, the French government officially recognized the Chevalier as a woman, and for the next 33 years, she lived as Charlotte d'Éon. [18]"
  },
  {
    "imagePrompt": "A somber and atmospheric, realistic scene in a modest early 19th-century London room. A doctor, with a look of astonishment and contemplation, is examining a post-mortem certificate. The focus is on the doctor's face and the document in his hands. In the background, respectfully out of focus, lies the deceased Chevalier. The lighting is dim, creating a mood of mystery and revelation.",
    "ContentText": "However, upon her death, doctors made a startling discovery. The Chevalier, who had lived as both a man and a woman, was anatomically male, leaving behind a legacy that fascinates and mystifies to this day. [20]"
  }
]
\`\`\``,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

export const chatSession = model.startChat({
  generationConfig,
  history,
});
  

