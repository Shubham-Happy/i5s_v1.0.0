
import { Award } from "lucide-react";

export function FundraisingBanner() {
  return (
    <div className="bg-statusnow-purple/5 rounded-lg p-4 mb-6 border border-statusnow-purple/20">
      <div className="flex items-center gap-3">
        <Award className="h-10 w-10 text-statusnow-purple" />
        <div>
          <h2 className="text-lg font-medium">Monthly Funding Challenge</h2>
          <p className="text-sm text-muted-foreground">The top 3 most-voted startups each month will be reviewed by our panel of investors for potential funding.</p>
        </div>
      </div>
    </div>
  );
}
