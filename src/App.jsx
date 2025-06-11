import React, { useState } from "react";
import {
  Send,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function App() {
  const [emailBody, setEmailBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setEmailBody(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailBody.trim()) {
      setError("Email body is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch("http://100.71.20.40:5000/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_body: emailBody,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponse(data);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      console.log("ERROR: ", err);
      setError("Network error: Unable to connect to the API");
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setEmailBody("");
    setResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Case Classification System
            </h1>
            <p className="text-gray-600">
              Process email content and get complete case classification with
              all fields
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-6 mb-8">
            <div>
              <label
                htmlFor="email_body"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <FileText className="w-4 h-4 mr-2" />
                Email Body
              </label>
              <textarea
                id="email_body"
                name="email_body"
                value={emailBody}
                onChange={handleInputChange}
                placeholder="Enter the email content here..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !emailBody.trim()}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Processing..." : "Classify Email"}
              </button>

              <button
                type="button"
                onClick={clearForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Response Table */}
          {response && response.status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <h2 className="text-xl font-semibold text-green-800">
                  Classification Results
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Field
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(response.results).map(
                      ([key, value], index) => (
                        <tr
                          key={key}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {key}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {value || "-"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
