
import React from "react";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: May 6, 2025</p>
      </div>
      
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <p>
          Please read these Terms of Service ("Terms") carefully before using the i5s platform. By accessing or using our platform, you agree to be bound by these Terms.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the i5s platform, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any of these Terms, you are prohibited from using or accessing the platform.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">2. User Accounts</h2>
        <p>
          To use certain features of our platform, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain and promptly update your account information</li>
          <li>Keep your password secure and confidential</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
        
        <h2 className="text-xl font-bold mt-6 mb-4">3. User Content</h2>
        <p>
          You retain all ownership rights to the content you post on i5s. However, by posting content, you grant us a non-exclusive, royalty-free, transferable, sublicensable, worldwide license to use, display, reproduce, and distribute your content in connection with operating and promoting the platform.
        </p>
        <p>
          You are solely responsible for the content you post and agree that you will not post content that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Is illegal, fraudulent, deceptive, or misleading</li>
          <li>Infringes on the intellectual property rights of others</li>
          <li>Contains hate speech, harassment, or threatens violence</li>
          <li>Is spam, commercial solicitation, or unrelated to the purpose of the platform</li>
          <li>Contains malicious code or attempts to interfere with the platform's operation</li>
        </ul>
        
        <Separator className="my-6" />
        
        <h2 className="text-xl font-bold mt-6 mb-4">4. Intellectual Property</h2>
        <p>
          The i5s name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of i5s or its affiliates. You may not use these without our prior written permission.
        </p>
        <p>
          All content on the platform, including text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of i5s or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">5. Platform Rules and Conduct</h2>
        <p>
          You agree to use the platform only for lawful purposes and in accordance with these Terms. You agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Impersonate any person or entity or falsely state your affiliation</li>
          <li>Access the platform through automated or non-human means</li>
          <li>Use the platform in any manner that could disable, overburden, or impair the site</li>
          <li>Attempt to gain unauthorized access to any part of the platform</li>
          <li>Use the platform for any commercial solicitation purposes without our consent</li>
        </ul>
        
        <h2 className="text-xl font-bold mt-6 mb-4">6. Third-Party Links and Services</h2>
        <p>
          Our platform may contain links to third-party websites or services. We are not responsible for the content or practices of these third-party sites and do not endorse or assume responsibility for them.
        </p>
        
        <Separator className="my-6" />
        
        <h2 className="text-xl font-bold mt-6 mb-4">7. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your account and access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">8. Disclaimer of Warranties</h2>
        <p>
          The platform is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the operation of the platform or the information, content, or materials included on the platform.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">9. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, i5s shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the platform.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">10. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. The most current version will be posted on our website. By continuing to access or use our platform after those revisions become effective, you agree to be bound by the revised Terms.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">12. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="mt-4">
          i5s, Inc.<br />
          1234 Innovation Way<br />
          San Francisco, CA 94103<br />
          Email: legal@i5s.com
        </p>
      </div>
    </div>
  );
}
