// client/src/components/ReferralBanner.tsx
import { useAuth } from '../context/AuthContext';

const ReferralBanner = () => {
  const { user } = useAuth();

  if (!user) return null;

  const referralLink = `${window.location.origin}/register?ref=${user.affiliateCode}`;

  return (
    <div className="bg-gray-100 border p-4 rounded mb-6 text-sm">
      <strong>Invite friends & earn rewards!</strong><br />
      Share your link: <code className="text-blue-600">{referralLink}</code>
    </div>
  );
};

export default ReferralBanner;
