

import { SEO } from "@/components/SEO";
import InviteCreator from "@/components/InviteCreator";

const InviteCreatorPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="AI Wedding Invite Creator - Free Digital Invitation Maker"
        description="Create beautiful AI-generated wedding invitations in seconds. Choose from traditional, royal, modern styles. Free to use, easy to share on WhatsApp. No signup required."
        keywords="wedding invitation maker, digital wedding invite, AI invitation creator, free wedding card, shaadi card maker, indian wedding invitation"
      />
      
      <main className="flex-1 pt-16 md:pt-20">
        <InviteCreator />
      </main>
      
    </div>
  );
};

export default InviteCreatorPage;
