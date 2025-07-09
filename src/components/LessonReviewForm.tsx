
import { useState } from "react";
import { useLessonReviewAI } from "@/hooks/useLessonReviewAI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function LessonReviewForm() {
  const { reviewLessonNote, feedback, loading, error } = useLessonReviewAI();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reviewLessonNote({ lessonTitle: title, subject, classGroup, noteContent });
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-skyBlue mb-2">AI Lesson Review</h2>
      <p className="text-sm text-gray-600 mb-4">
        Fill out your lesson note and get instant AI feedback.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Lesson Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Introduction to Fractions"
            required
          />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select value={subject} onValueChange={setSubject} required>
            <SelectTrigger>
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
        <div>
          <Label htmlFor="classGroup">Class</Label>
          <Select value={classGroup} onValueChange={setClassGroup} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary_1">Primary 1</SelectItem>
              <SelectItem value="primary_2">Primary 2</SelectItem>
              <SelectItem value="primary_3">Primary 3</SelectItem>
              <SelectItem value="primary_4">Primary 4</SelectItem>
              <SelectItem value="primary_5">Primary 5</SelectItem>
              <SelectItem value="primary_6">Primary 6</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="noteContent">Lesson Note Content</Label>
          <Textarea
            id="noteContent"
            value={noteContent}
            onChange={e => setNoteContent(e.target.value)}
            placeholder="Paste your lesson note here…"
            className="min-h-32 resize-none"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-skyBlue hover:bg-skyBlue/90 text-white"
          disabled={loading}
        >
          {loading ? "Analyzing…" : "Analyze with AI"}
        </Button>
      </form>

      {/* Feedback Section */}
      {submitted && (
        <div className="mt-6">
          {loading && (
            <div className="text-center text-skyBlue">Analyzing your lesson note…</div>
          )}
          {error && (
            <div className="text-red-500 text-center my-2">{error}</div>
          )}
          {feedback && feedback.length > 0 && (
            <div className="space-y-4">
              {feedback.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-skyBlue">Feedback by {item.reviewer}</h3>
                    <span className="text-sm text-gray-500">Score: {item.score}/10</span>
                  </div>
                  
                  {item.feedback_text && (
                    <div className="bg-gray-50 p-3 rounded">
                      <strong className="text-skyBlue">Feedback: </strong>
                      {item.feedback_text}
                    </div>
                  )}
                  
                  {item.strengths && (
                    <div className="bg-green-50 p-3 rounded">
                      <strong className="text-green-700">Strengths: </strong>
                      {item.strengths}
                    </div>
                  )}
                  
                  {item.areas_for_improvement && (
                    <div className="bg-yellow-50 p-3 rounded">
                      <strong className="text-yellow-700">Areas for Improvement: </strong>
                      {item.areas_for_improvement}
                    </div>
                  )}
                  
                  {item.suggestions && (
                    <div className="bg-blue-50 p-3 rounded">
                      <strong className="text-blue-700">Suggestions: </strong>
                      {item.suggestions}
                    </div>
                  )}
                  
                  {item.overall_assessment && (
                    <div className="bg-purple-50 p-3 rounded">
                      <strong className="text-purple-700">Overall Assessment: </strong>
                      {item.overall_assessment}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400">
                    Created: {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
