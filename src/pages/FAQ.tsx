
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Search, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create an account?",
        answer: "To create an account, click the 'Sign Up' button on the homepage and fill in your details. You'll receive a verification email to confirm your account."
      },
      {
        question: "Is i5s free to use?",
        answer: "Yes, i5s offers a free tier with basic features. We also have premium plans with additional features for power users and businesses."
      },
      {
        question: "How do I complete my profile?",
        answer: "After signing up, go to your profile settings and fill in your professional information, skills, and bio. A complete profile helps you connect better with the community."
      }
    ]
  },
  {
    category: "Features",
    questions: [
      {
        question: "How can I publish articles?",
        answer: "Navigate to the Articles section and click 'Write an Article'. You can add a title, content, cover image, and tags to make your article discoverable."
      },
      {
        question: "How does the startup showcase work?",
        answer: "The startup showcase allows entrepreneurs to display their startups, get votes from the community, and connect with potential investors and collaborators."
      },
      {
        question: "What is the networking feature?",
        answer: "Our networking feature helps you discover and connect with professionals in your industry. You can follow users, message them, and build meaningful professional relationships."
      }
    ]
  },
  {
    category: "Account & Privacy",
    questions: [
      {
        question: "How do I change my password?",
        answer: "Go to Settings > Account, and you'll find an option to change your password. Make sure to use a strong, unique password."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, you can delete your account from the Settings > Privacy & Security section. Please note that this action is irreversible."
      },
      {
        question: "How is my data protected?",
        answer: "We take data protection seriously. All data is encrypted, and we follow industry best practices for security. Read our Privacy Policy for more details."
      }
    ]
  },
  {
    category: "Jobs & Opportunities",
    questions: [
      {
        question: "How do I apply for jobs?",
        answer: "Browse the Jobs section, find positions that match your skills, and click 'Apply'. You can track your applications in your dashboard."
      },
      {
        question: "Can I post job listings?",
        answer: "Yes, employers can post job listings in the Jobs section. We offer both free and premium listing options."
      },
      {
        question: "How do I find funding opportunities?",
        answer: "Check out our Fundraising section where we list various funding events, investor meetups, and grant opportunities."
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className={cn(
      "py-8",
      isMobile ? "px-4" : "container max-w-4xl mx-auto px-4"
    )}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-slate-green/10 rounded-lg">
            <HelpCircle className="h-8 w-8 text-slate-green" />
          </div>
        </div>
        <h1 className={cn(
          "font-bold text-slate-green mb-4",
          isMobile ? "text-2xl" : "text-3xl md:text-4xl"
        )}>
          Frequently Asked Questions
        </h1>
        <p className={cn(
          "text-muted-foreground",
          isMobile ? "text-sm" : "text-lg"
        )}>
          Find answers to common questions about i5s
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search FAQ..."
          className="pl-10 border-gold-light/40 focus:border-slate-green"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* FAQ Content */}
      <div className="space-y-6">
        {filteredFAQ.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="border-gold-light/30">
            <CardHeader className="bg-gradient-to-r from-slate-green/5 to-gold-light/5">
              <CardTitle className="text-slate-green">{category.category}</CardTitle>
              <CardDescription>
                {category.questions.length} question{category.questions.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {category.questions.map((item, questionIndex) => {
                  const itemId = `${categoryIndex}-${questionIndex}`;
                  return (
                    <Collapsible
                      key={questionIndex}
                      open={openItems[itemId]}
                      onOpenChange={() => toggleItem(itemId)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                        <span className="font-medium text-slate-900">
                          {item.question}
                        </span>
                        {openItems[itemId] ? (
                          <ChevronUp className="h-4 w-4 text-slate-green" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-green" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pt-4 pb-2">
                        <p className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredFAQ.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-muted-foreground">
            Try different search terms or browse all categories above.
          </p>
        </div>
      )}

      {/* Contact Support */}
      <Card className="mt-12 border-gold-light/30">
        <CardHeader className="text-center">
          <CardTitle className="text-slate-green">Still need help?</CardTitle>
          <CardDescription>
            Can't find what you're looking for? Get in touch with our support team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "gap-4",
            isMobile ? "flex flex-col" : "flex justify-center"
          )}>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Support
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Live Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
