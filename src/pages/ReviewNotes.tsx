import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ReviewNotes = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<null | {
    feedback_text: string;
    score: number;
    strengths: string[];
    suggestions: string[];
    areas_for_improvement: string[];
    overall_assessment: string;
  }>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get auth token from localStorage or wherever you store it
      const token = localStorage.getItem('authToken'); // Adjust based on your auth implementation
      
      const response = await fetch('/api/lesson-notes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({
          title,
          subject,
          grade_level: classGroup,
          content,
          term: "current" // Add default term or make it configurable
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setAiResult({
        feedback_text: data.feedback_text,
        score: data.score,
        strengths: data.strengths || [],
        suggestions: data.suggestions || [],
        areas_for_improvement: data.areas_for_improvement || [],
        overall_assessment: data.overall_assessment
      });
      
      toast({
        title: "Analysis complete",
        description: `Your lesson received a score of ${data.score}/100`,
      });
      
    } catch (error) {
      console.error('Error submitting lesson for review:', error);
      toast({
        title: "Error",
        description: "Failed to analyze lesson. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/save-lesson-note/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          subject,
          grade_level: classGroup,
          content,
          ai_feedback: aiResult,
          term: "current"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      toast({
        title: "Lesson Saved",
        description: "Your lesson note and AI feedback have been saved successfully.",
      });
      
      navigate("/dashboard");
      
    } catch (error) {
      console.error('Error saving lesson note:', error);
      toast({
        title: "Error",
        description: "Failed to save lesson note. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream to-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">AI Lesson Note Review</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="fc-card">
            <CardHeader>
              <CardTitle>Create Lesson Note</CardTitle>
              <CardDescription>Enter your lesson note details for AI review</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Introduction to Addition"
                    className="fc-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger className="fc-input">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English Language</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="social_studies">Social Studies</SelectItem>
                      <SelectItem value="arts">Arts & Crafts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select value={classGroup} onValueChange={setClassGroup} required>
                    <SelectTrigger className="fc-input">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary_1">Basic 1</SelectItem>
                      <SelectItem value="primary_2">Basic 2</SelectItem>
                      <SelectItem value="primary_3">Basic 3</SelectItem>
                      <SelectItem value="primary_4">Basic 4</SelectItem>
                      <SelectItem value="primary_5">Basic 5</SelectItem>
                      <SelectItem value="primary_6">Basic 6</SelectItem>
                      <SelectItem value="jhs_1">JHS 1</SelectItem>
                      <SelectItem value="jhs_2">JHS 2</SelectItem>
                      <SelectItem value="jhs_3">JHS 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Lesson Note Content</Label>
                  <Textarea 
                    id="content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your complete lesson note here..."
                    className="fc-input min-h-32 resize-none"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-skyBlue hover:bg-skyBlue/90 text-white mt-4" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Analyzing..." : "Analyze with AI"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* AI Feedback */}
          <Card className="fc-card">
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
              <CardDescription>Review suggestions and improvements</CardDescription>
            </CardHeader>
            <CardContent>
              {!aiResult ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 text-skyBlue opacity-50">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path 
                        className={`${isSubmitting ? "animate-spin" : ""}`} 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">
                    {isSubmitting 
                      ? "Analyzing your lesson with AI..." 
                      : "Submit your lesson note to get AI feedback"}
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium text-skyBlue mb-2 flex items-center">
                      Score: {aiResult.score}/100
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        aiResult.score >= 80 ? 'bg-green-100 text-green-800' :
                        aiResult.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {aiResult.score >= 80 ? 'Excellent' : aiResult.score >= 60 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </h3>
                    <p className="text-gray-700">{aiResult.feedback_text}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md">
                    <h3 className="font-medium text-green-600 mb-2">Strengths</h3>
                    <ul className="text-gray-700 space-y-1">
                      {aiResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium text-blue-600 mb-2">Suggestions</h3>
                    <ul className="text-gray-700 space-y-1">
                      {aiResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <h3 className="font-medium text-yellow-600 mb-2">Areas for Improvement</h3>
                    <ul className="text-gray-700 space-y-1">
                      {aiResult.areas_for_improvement.map((area, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-500 mr-2">•</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium text-gray-600 mb-2">Overall Assessment</h3>
                    <p className="text-gray-700">{aiResult.overall_assessment}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSave} 
                disabled={!aiResult}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Save Note and Feedback
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReviewNotes;