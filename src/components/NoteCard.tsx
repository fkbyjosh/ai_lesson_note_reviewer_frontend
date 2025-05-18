
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Book, Users } from "lucide-react";

interface NoteCardProps {
  title: string;
  subject: string;
  class: string;
  date: string;
  status: "pending" | "reviewed";
  onClick?: () => void;
}

const NoteCard = ({ title, subject, class: className, date, status, onClick }: NoteCardProps) => {
  return (
    <Card className="fc-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge 
            className={status === "reviewed" 
              ? "bg-green-100 text-green-800 hover:bg-green-200" 
              : "bg-amber-100 text-amber-800 hover:bg-amber-200"}
          >
            {status === "reviewed" ? "Reviewed" : "Pending Review"}
          </Badge>
        </div>
        <CardDescription className="text-gray-500">
          {subject} | {className}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-col space-y-2.5">
          <div className="flex items-center text-sm text-gray-500">
            <Book className="h-4 w-4 mr-2 text-skyBlue" />
            <span>Lesson note</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2 text-skyBlue" />
            <span>{className}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CalendarCheck className="h-4 w-4 mr-2 text-skyBlue" />
            <span>{date}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={onClick} 
          className="w-full bg-skyBlue hover:bg-skyBlue/90 text-white"
        >
          {status === "reviewed" ? "View Feedback" : "Submit for Review"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
