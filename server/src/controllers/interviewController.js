const groq = require("../config/groq");
const Interview = require("../models/Interview");
exports.generateQuestions = async (req, res) => {

  try {

    const { role } = req.body;
    const {questionCount}=req.body;
    const userId=req.user.id;
    const pastInterviews = await Interview.find({
      user: userId,
      role,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const previousQuestions = [
      ...new Set(
        pastInterviews.flatMap((interview) => interview.questions)
      ),
    ];

    const avoidSection =
      previousQuestions.length > 0
        ? `
Avoid repeating any of these previously asked questions, and avoid close variations of them:
${JSON.stringify(previousQuestions)}
`
        : "";

    const prompt = `
Generate ${questionCount} interview questions for a ${role} role.

${avoidSection}

Cover a varied mix of subtopics and difficulty levels rather than clustering around the same few concepts.

Return ONLY valid JSON array.

Example:
[
  "Question 1",
  "Question 2"
]
`;

    const completion = await groq.chat.completions.create({

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      model: "llama-3.3-70b-versatile",

      temperature: 0.5,

    });

    const aiResponse =
      completion.choices[0]?.message?.content || "";

    const questions = JSON.parse(aiResponse);

    return res.status(200).json({
      success: true,
      questions,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};
exports.evaluateAnswers = async (req, res) => {
  
  try {
    console.log("Request Body:", req.body);

    const {
      role,
      questions,
      answers,
      name,
    } = req.body;

    const userId = req.user.id;

    const prompt = `
You are an expert technical interviewer.

Evaluate these interview answers for a ${role} role.

Questions:
${JSON.stringify(questions)}

Answers:
${JSON.stringify(answers)}

Return ONLY valid JSON.

Format:
{
  "score": number,
  "feedback": []
}
  
`;

    const completion =
      await groq.chat.completions.create({

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
    
    const parsedResponse =
      JSON.parse(cleanedResponse);
    await Interview.create({
      user:userId,
      role,
      questions,
      answers,
      score:parsedResponse.score,
      feedback:parsedResponse.feedback,
    });
    
    return res.status(200).json({
      success: true,
      result: parsedResponse,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }


};

exports.getInterviewHistory=async(req,res)=>{
  try {
    const userId=req.user.id;
    const interviews=await Interview.find({
      user:userId,
    }).sort({
      createdAt:-1,
    });
    return res.status(200).json({
      success:true,
      interviews,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"server error",
    });
  }
};

exports.getInterviewStats = async (req, res) => {

  try {

    const userId = req.user.id;

    const interviews = await Interview.find({
      user: userId,
    });

    const totalInterviews =
      interviews.length;

    const averageScore =
      totalInterviews > 0
        ? Math.round(
            interviews.reduce(
              (sum, interview) =>
                sum + interview.score,
              0
            ) / totalInterviews
          )
        : 0;

    const highestScore =
      totalInterviews > 0
        ? Math.max(
            ...interviews.map(
              (interview) =>
                interview.score
            )
          )
        : 0;
    const scoreHistory=interviews
          .sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt))
          .map((interviews)=>({
            date:new Date(interviews.createdAt).toLocaleDateString(),
            score:interviews.score,
            role:interviews.role,
          }));
    return res.status(200).json({
      success: true,
      stats: {
        totalInterviews,
        averageScore,
        highestScore,
      },
      scoreHistory,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};