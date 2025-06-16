
import React from "react";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: May 6, 2025</p>
      </div>
      
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <p>
          At i5s, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our platform.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">Information We Collect</h2>
        <p>
          We collect information that you voluntarily provide to us when registering for the platform, creating or editing your profile, posting content, or otherwise contacting us.
        </p>
        <p>
          This information may include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Personal information such as your name, email address, and phone number</li>
          <li>Profile information such as your biography, education, work experience, and skills</li>
          <li>Content you post including comments, articles, and discussions</li>
          <li>Messages you send to other users</li>
          <li>Information about your startup if you create a startup profile</li>
        </ul>
        
        <h2 className="text-xl font-bold mt-6 mb-4">How We Use Your Information</h2>
        <p>
          We may use the information we collect from you for various purposes, including:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Providing and personalizing our services</li>
          <li>Communicating with you about updates, security alerts, and support</li>
          <li>Improving our platform and user experience</li>
          <li>Processing transactions</li>
          <li>Sending promotional emails about new features or events</li>
          <li>Protecting our platform from unauthorized access or abuse</li>
        </ul>
        
        <Separator className="my-6" />
        
        <h2 className="text-xl font-bold mt-6 mb-4">Information Sharing</h2>
        <p>
          We may share your information in the following circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>With other users as part of the normal operation of the platform (e.g., your profile information)</li>
          <li>With service providers who perform services on our behalf</li>
          <li>To comply with legal obligations</li>
          <li>To protect and defend our rights and property</li>
          <li>With your consent or at your direction</li>
        </ul>
        
        <h2 className="text-xl font-bold mt-6 mb-4">Data Security</h2>
        <p>
          We use administrative, technical, and physical security measures to protect your personal information. While we take reasonable steps to secure your information, no data transmission over the Internet or electronic storage is completely secure, so we cannot guarantee absolute security.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">Your Choices</h2>
        <p>
          You can access and update certain information about you from within your account settings. You may also opt out of receiving promotional communications from us by following the unsubscribe instructions included in each communication.
        </p>
        
        <Separator className="my-6" />
        
        <h2 className="text-xl font-bold mt-6 mb-4">Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">Third-Party Websites</h2>
        <p>
          Our platform may contain links to third-party websites. We are not responsible for the privacy practices or the content of these third-party sites.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">Children's Privacy</h2>
        <p>
          Our platform is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mt-4">
          i5s, Inc.<br />
          1234 Innovation Way<br />
          San Francisco, CA 94103<br />
          Email: privacy@i5s.com
        </p>
      </div>
    </div>
  );
}
