import { useState } from "react";
import { analyseMessage } from "./utils/scamDetector";

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleAnalyse() {
    if (!message.trim()) {
      alert("Please enter a message to analyse.");
      return;
    }

    const analysis = analyseMessage(message);
    setResult(analysis);
    setExplanation("");
    setIsGenerating(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          riskLevel: analysis.riskLevel,
          score: analysis.score,
          reasons: analysis.reasons,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate explanation.");
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error(error);
      setExplanation(
        "Unable to generate explanation at the moment. Please make sure the backend server is running."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function testHighRiskMessage() {
    setMessage(
      "Your bank account has been blocked. Click https://bit.ly/bank-verify immediately and enter your OTP to reactivate your account."
    );
    setResult(null);
    setExplanation("");
  }

  function testMediumRiskMessage() {
    setMessage(
      "Security alert. Please verify your account now to avoid service interruption."
    );
    setResult(null);
    setExplanation("");
  }

  function testLowRiskMessage() {
    setMessage(
      "Your monthly bank statement is now available in your official banking app."
    );
    setResult(null);
    setExplanation("");
  }

  function clearMessage() {
    setMessage("");
    setResult(null);
    setExplanation("");
  }

  function getRiskStyle(riskLevel) {
    if (riskLevel === "High") {
      return "bg-red-100 text-red-700 border-red-300";
    }

    if (riskLevel === "Medium") {
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }

    return "bg-green-100 text-green-700 border-green-300";
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-700 mb-2">
              BankGuard
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
              Scam Message Detector for Banking Users
            </h1>

            <p className="text-slate-600 max-w-full leading-relaxed">
              BankGuard is a local GenAI-enhanced prototype that helps digital banking users
  identify suspicious SMS, WhatsApp, or email messages before they click harmful
  links or share sensitive information. It uses rule-based detection to flag
  common scam indicators such as urgent language, suspicious links, account
  threats, and requests for OTP, TAC, or banking passwords.
            </p>
          </div>

          {/* Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side: Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Suspicious Message
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Example: Your bank account has been blocked. Click this link immediately and enter your OTP..."
                className="w-full h-56 rounded-2xl border border-slate-300 p-4 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              <button
                onClick={handleAnalyse}
                disabled={isGenerating}
                className={`mt-4 w-full text-white font-semibold py-3 rounded-2xl transition ${
                  isGenerating
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {isGenerating ? "Analysing..." : "Analyse Message"}
              </button>

              {/* Small Example Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <button
                  onClick={testHighRiskMessage}
                  className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold py-2 rounded-xl hover:bg-red-100 transition"
                >
                  High Risk
                </button>

                <button
                  onClick={testMediumRiskMessage}
                  className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-semibold py-2 rounded-xl hover:bg-yellow-100 transition"
                >
                  Medium Risk
                </button>

                <button
                  onClick={testLowRiskMessage}
                  className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold py-2 rounded-xl hover:bg-green-100 transition"
                >
                  Low Risk
                </button>

                <button
                  onClick={clearMessage}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold py-2 rounded-xl hover:bg-slate-100 transition"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Right Side: Result */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Analysis Result
              </label>

              {!result ? (
                <div className="h-[345px] rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-500 text-center p-6">
                  Your result will appear here after analysis.
                </div>
              ) : (
                <div className="min-h-[345px] rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div
                    className={`inline-block px-4 py-2 rounded-full border font-bold mb-4 ${getRiskStyle(
                      result.riskLevel
                    )}`}
                  >
                    Risk Level: {result.riskLevel}
                  </div>

                  <p className="text-sm text-slate-600 mb-4">
                    Scam Indicator Score:{" "}
                    <span className="font-semibold">{result.score}</span>
                  </p>

                  <h2 className="font-bold text-slate-800 mb-2">
                    Detected Warning Signs
                  </h2>

                  <ul className="list-disc pl-5 text-slate-700 space-y-2 mb-5">
                    {result.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>

                  <h2 className="font-bold text-slate-800 mb-2">
                    Recommended Safety Action
                  </h2>

                  <p className="text-slate-700 leading-relaxed">
                    {result.advice}
                  </p>

                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
  <h2 className="font-bold text-slate-800">
    Local GenAI Explanation
  </h2>

  <span className="text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full">
    Local GenAI
  </span>
</div>

                    {isGenerating ? (
                      <p className="text-slate-500">
                        Generating explanation...
                      </p>
                    ) : (
                      <p className="text-slate-700 leading-relaxed">
                        {explanation || "No generated explanation yet."}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Important Note */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h2 className="font-bold text-slate-900 mb-2">Important Note</h2>
            <p className="text-slate-700 leading-relaxed">
               This tool is a prototype and should be used as an early warning guide only.
  Always verify suspicious messages through official bank websites, mobile apps,
  or customer service channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;