import React from 'react';
import { SEO } from '../components/SEO';

const TermsPage: React.FC = () => {
    return (
        <div className="pt-32 pb-24 px-6">
            <SEO
                title="Terms of Service | Axiom Infrastructure"
                description="Terms and conditions for utilizing Axiom Infrastructure web and digital services."
            />
            <div className="max-w-[800px] mx-auto text-secondary leading-relaxed">
                <h1 className="text-[40px] font-semibold text-primary mb-8 tracking-tight">Terms of Service</h1>
                <p className="mb-6">Last Updated: {new Date().toLocaleDateString('en-CA')}</p>

                <h2 className="text-[20px] font-semibold text-primary mb-4 mt-12">1. Agreement to Terms</h2>
                <p className="mb-6">By accessing our website and utilizing our services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

                <h2 className="text-[20px] font-semibold text-primary mb-4 mt-8">2. Intellectual Property</h2>
                <p className="mb-6">The Service and its original content (excluding initial client-provided assets), features, and functionality are and will remain the exclusive property of Axiom Infrastructure and its licensors.</p>

                <h2 className="text-[20px] font-semibold text-primary mb-4 mt-8">3. Project Timelines & Bottlenecks</h2>
                <p className="mb-6">Development timelines are contingent strictly upon client deliverables. Should a project stall for over 10 consecutive business days due to client delays in copy, assets, or feedback, Axiom Infrastructure reserves the right to deploy with functional placeholders and invoice the remaining milestone balances.</p>

                <h2 className="text-[20px] font-semibold text-primary mb-4 mt-8">4. Payment Terms & Service Pausing</h2>
                <p className="mb-6">All invoices are due Net-15. Accounts with unpaid balances exceeding 10 days past the due date are subject to service suspension, including the pausing of live hosted environments, until the balance and any associated reactivation fees are cleared in full.</p>

                <h2 className="text-[20px] font-semibold text-primary mb-4 mt-8">5. Governing Law</h2>
                <p className="mb-6">These Terms shall be governed and construed in accordance with the laws of Ontario, Canada, without regard to its conflict of law provisions.</p>

                <h2 className="text-[20px] font-semibold text-primary mb-4 mt-8">6. Changes</h2>
                <p className="mb-6">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Material changes will be communicated via active agency channels.</p>
            </div>
        </div>
    );
};

export default TermsPage;
