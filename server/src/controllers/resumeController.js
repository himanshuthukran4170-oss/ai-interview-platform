const pdfParse = require("pdf-parse");
const fs = require("fs");

const groq = require("../config/groq");

exports.analyzeResume = async (req, res) => {
  try {
    console.log("========== RESUME ANALYSIS START ==========");

    if (!req.file) {
      console.log("No file uploaded");

      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    console.log("File path:", req.file.path);
    console.log("Full file object:", req.file);

    const fileExists = fs.existsSync(req.file.path);

    console.log("File exists:", fileExists);

    if (!fileExists) {
      return res.status(500).json({
        success: false,
        message: "Uploaded file not found",
        path: req.file.path,
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);

    console.log("PDF read successful");

    const pdfData = await pdfParse(pdfBuffer);

    console.log("PDF parsed successful");

    fs.unlinkSync(req.file.path);

    console.log("Uploaded file deleted");

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

    console.log("Raw AI Response:");
    console.log(aiResponse);

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

    console.log("========== RESUME ANALYSIS SUCCESS ==========");

    return res.status(200).json({
      success: true,
      analysis: parsedResponse,
    });

  } catch (error) {

    console.log("========== RESUME ANALYSIS ERROR ==========");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });

  }
};

exports.matchResume = async (req, res) => {
  try {
    console.log("========== RESUME MATCH START ==========");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 5) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Please paste a job description (at least a couple of sentences).",
      });
    }

    const fileExists = fs.existsSync(req.file.path);

    if (!fileExists) {
      return res.status(500).json({
        success: false,
        message: "Uploaded file not found",
        path: req.file.path,
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(pdfBuffer);

    fs.unlinkSync(req.file.path);

    const resumeText = pdfData.text;

    const prompt = `
You are an expert technical recruiter and ATS system.

Compare the following resume against the given job description and return ONLY valid JSON.

Resume:
${resumeText}

Job Description:
${jobDescription}

Required JSON format:
{
  "matchScore": "score out of 100",
  "matchingSkills": [],
  "missingSkills": [],
  "recommendations": []
}
`;

    console.log("Calling Groq API for match...");

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

    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (error) {
      console.log("JSON Parse Error:", error);

      return res.status(500).json({
        success: false,
        message: "Invalid AI JSON response",
        raw: aiResponse,
      });
    }

    console.log("========== RESUME MATCH SUCCESS ==========");

    return res.status(200).json({
      success: true,
      match: parsedResponse,
    });

  } catch (error) {
    console.log("========== RESUME MATCH ERROR ==========");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};