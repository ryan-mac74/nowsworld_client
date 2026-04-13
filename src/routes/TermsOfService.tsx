import LegalLayout from "@/components/layout/LegalLayout";

export default function TermsOfService() {
    const h2Class = "font-semibold text-lg";

    return (
        <LegalLayout title="Terms of Service">
            <p><strong>Last updated:</strong> April 13, 2026</p>

            <h2 className={h2Class}>1. Use of Service</h2>
            <p>You agree to use the platform legally and responsibly.</p>

            <h2 className={h2Class}>2. Accounts</h2>
            <p>You are responsible for your account and its security.</p>

            <h2 className={h2Class}>3. Content</h2>
            <p>
                You retain ownership but grant us a license to use
                your content within the platform.
            </p>

            <h2 className={h2Class}>4. Termination</h2>
            <p>We may suspend accounts that violate these terms.</p>

            <h2 className={h2Class}>5. Disclaimer</h2>
            <p>The service is provided "as is" without warranties.</p>
        </LegalLayout>
    );
}
