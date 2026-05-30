const pdfParse = require("pdf-parse");
const fs = require("fs");

const groq = require("../config/groq");

exports.analyzeResume = async (req, res) => {
  try {
    console.log("Request received");

    if (!req.file) {
      console.log("No file uploaded");

      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    console.log("File path:", req.file.path);

    const pdfBuffer = fs.readFileSync(req.file.path);

    console.log("PDF read successful");

    const pdfData = await pdfParse(pdfBuffer);

    console.log("PDF parsed successful");

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

    console.log("Calling Groq API...");

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

    console.log("Groq response received");

    const aiResponse =
      completion.choices[0]?.message?.content || "";

    console.log("Raw AI Response:", aiResponse);

    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(cleanedResponse);

      console.log("JSON parsed successfully");

    } catch (error) {

      console.log("JSON Parse Error:", error);

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

    console.log("Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};