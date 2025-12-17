import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SocraticQuestion } from "@/utils/types";

interface SocraticQuestionProps {
  question: SocraticQuestion;
  showDetails?: boolean;
  onClick?: () => void;
}

export function SocraticQuestion({ question, showDetails = true, onClick }: SocraticQuestionProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Pregunta {question.id}
          </CardTitle>
          {showDetails && (
            <div className="flex gap-2">
              <Badge variant="outline">{question.eje}</Badge>
              <Badge variant="secondary">{question.nivel}</Badge>
              <Badge variant="destructive">{question.tension}</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {question.texto}
        </p>
      </CardContent>
    </Card>
  );
}