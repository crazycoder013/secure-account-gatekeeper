import AuthForm from "@/components/AuthForm";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;