import LegalLayout from "@/components/layout/LegalLayout";

export default function DataDeletion() {
    const h2Class = "font-semibold text-lg";

    return (
        <LegalLayout title="Data Deletion Instructions">
            <p><strong>Last updated:</strong> April 13, 2026</p>

            <h2 className={h2Class}>1. Request Deletion</h2>
            <p>
                Log in, the button will turn into your profile avatar (in the top-right corner),
                click on it to open the dropdown menu, and select "Delete Account".
            </p>

            <h2 className={h2Class}>2. What Happens</h2>
            <p>Your account is immediately deactivated and hidden from the platform (for now, just from the "News Feed").</p>

            <h2 className={h2Class}>3. Deletion Period</h2>
            <p>Your account will be permanently deleted within 5-25 business days if not reactivated.</p>

            <h2 className={h2Class}>4. Contact</h2>
            <p><strong>Email:</strong> support@nowsworld.com</p>
        </LegalLayout>
    );
}
