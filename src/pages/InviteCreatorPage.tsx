import { BhindiFooter } from "@/components/BhindiFooter";
import { SEO } from "@/components/SEO";
import InviteCreator from "@/components/InviteCreator";

const InviteCreatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI Wedding Invite Creator - Free Digital Invitation Maker"
        description="Create beautiful AI-generated wedding invitations in seconds. Choose from traditional, royal, modern styles. Free to use, easy to share on WhatsApp. No signup required."
        keywords="wedding invitation maker, digital wedding invite, AI invitation creator, free wedding card, shaadi card maker, indian wedding invitation"
      />
      <div className="pt-16">
        <InviteCreator />
      </div>
      <BhindiFooter />
    </div>
  );
};

export default InviteCreatorPage;
