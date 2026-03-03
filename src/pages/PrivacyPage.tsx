import React from 'react';
import { SEO } from '../components/SEO';

const PrivacyPage: React.FC = () => {
    return (
        <div className="pt-32 pb-24 px-6">
            <SEO
                title="Privacy Policy | Axiom Infrastructure"
                description="Privacy guidelines regarding the collection and use of information."
            />
            <div className="max-w-[800px] mx-auto text-axiom-text-mute leading-relaxed">
                <h1 className="text-[40px] font-semibold text-axiom-text-main mb-8 tracking-tight">Privacy Policy</h1>
                <p className="mb-6">Last Updated: {new Date().toLocaleDateString('en-CA')}</p>

                <h2 className="text-[20px] font-semibold text-axiom-text-main mb-4 mt-12">1. Information Collection</h2>
                <p className="mb-6">We collect several different types of information for various purposes to provide and improve our Service to you. This includes personal data provided exclusively via direct contact or scheduled consultation requests.</p>

                <h2 className="text-[20px] font-semibold text-axiom-text-main mb-4 mt-8">2. Use of Data</h2>
                <p className="mb-4">Axiom Infrastructure uses the collected data for various purposes:</p>
                <ul className="list-disc pl-6 mb-6">
                    <li>To provide and maintain the Service</li>
                    <li>To notify you about changes to our Service</li>
                    <li>To provide customer care and support</li>
                    <li>To provide analysis or valuable information so that we can improve the Service</li>
                    <li>To monitor the usage of the Service</li>
                </ul>

                <h2 className="text-[20px] font-semibold text-axiom-text-main mb-4 mt-8">3. Transfer Of Data</h2>
                <p className="mb-6">Your information, including Personal Data, may be transferred to â€” and maintained on â€” computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.</p>

                <h2 className="text-[20px] font-semibold text-axiom-text-main mb-4 mt-8">4. Security Of Data</h2>
                <p className="mb-6">The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>

                <h2 className="text-[20px] font-semibold text-axiom-text-main mb-4 mt-8">5. Analytics</h2>
                <p className="mb-6">We may use third-party Service Providers to monitor and analyze the use of our Service, such as Google Analytics, subject strictly to their respective privacy frameworks.</p>
            </div>
        </div>
    );
};

export default PrivacyPage;

