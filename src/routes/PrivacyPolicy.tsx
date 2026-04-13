import LegalLayout from "@/components/layout/LegalLayout";

export default function PrivacyPolicy() {
    const h2Class = "font-semibold text-lg";

    return (
        <LegalLayout title="Privacy Policy">
            <p><strong>Last updated:</strong> April 13, 2026</p>

            <h2 className={h2Class}>1. Information We Collect</h2>
            <p>
                We collect information you provide (name, email, avatar), usage data,
                and authentication data from third-party providers.
            </p>

            <h2 className={h2Class}>2. How We Use Information</h2>
            <p>We use your data to provide, improve, and secure the service.</p>

            <h2 className={h2Class}>3. Sharing</h2>
            <p>
                We do not sell your data. We may share it with service providers
                or for legal reasons.
            </p>

            <h2 className={h2Class}>4. Data Retention</h2>
            <p>Your data is kept while your account is active or as needed.</p>

            <h2 className={h2Class}>5. Contact</h2>
            <p><strong>Email:</strong> support@nowsworld.com</p>
        </LegalLayout>
    );
}
