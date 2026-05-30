const pdfParse = require("pdf-parse");
const fs = require("fs");

const groq = require("../config/groq");

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(pdfBuffer);

    // Delete uploaded file after parsing
    fs.unlinkSync(req.file.path);

    const resumeText = pdfData.text;

    const prompt = `
You are an expert ATS resume analyzer.

Analyze the following resume and return ONLY valid JSON.

Resume:
${resumeText}

Required JSON format:
{
  "atsScore": "score out of 100",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    const aiResponse =
      completion.choices[0]?.message?.content || "";

    // Clean markdown if AI returns ```json
    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Invalid AI JSON response",
        raw: aiResponse,
      });
    }

    return res.status(200).json({
      success: true,
      analysis: parsedResponse,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};