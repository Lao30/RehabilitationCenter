import {
  BtnSecondary,
  Field,
  SelectField,
  SuperAdminPageHeader,
  SuperAdminPanel,
  ToggleRow,
} from "@/components/dashboard/super-admin/PageChrome";

export const metadata = {
  title: "System settings",
};

export default function Page() {
  return (
    <div className="space-y-8">
      <SuperAdminPageHeader
        eyebrow="Platform"
        title="System settings"
        description="Application-wide defaults for branding, security, and notifications. Values shown are illustrative until settings persistence is implemented."
        actions={
          <BtnSecondary disabled title="Coming soon">
            Save changes
          </BtnSecondary>
        }
      />

      <div className="grid max-w-3xl gap-6">
        <SuperAdminPanel
          title="General"
          description="How RCMS presents itself to staff and patients."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="org-name"
              label="Organization name"
              defaultValue="Rehabilitation Center Management System"
              disabled
            />
            <Field
              id="support-email"
              label="Support email"
              type="email"
              defaultValue="support@rehab.local"
              disabled
            />
            <SelectField id="locale" label="Locale" defaultValue="en-US" disabled>
              <option value="en-US">English (United States)</option>
              <option value="en-GB">English (United Kingdom)</option>
            </SelectField>
            <SelectField
              id="timezone"
              label="Default timezone"
              defaultValue="America/New_York"
              disabled
            >
              <option value="America/New_York">Eastern Time (US)</option>
              <option value="America/Chicago">Central Time (US)</option>
              <option value="America/Denver">Mountain Time (US)</option>
              <option value="America/Los_Angeles">Pacific Time (US)</option>
            </SelectField>
          </div>
        </SuperAdminPanel>

        <SuperAdminPanel
          title="Security"
          description="Session and authentication policies for all roles."
        >
          <div className="space-y-6 divide-y divide-sky-100/90 dark:divide-sky-800/50">
            <ToggleRow
              label="Require MFA for Super Admin"
              description="TOTP or WebAuthn for super admin sign-in."
              defaultChecked
              disabled
            />
            <div className="pt-6">
              <ToggleRow
                label="Require MFA for Admin"
                description="Recommended for branch administrators."
                defaultChecked={false}
                disabled
              />
            </div>
            <div className="grid gap-5 pt-6 sm:grid-cols-2">
              <SelectField
                id="session"
                label="Session lifetime"
                defaultValue="12"
                disabled
              >
                <option value="8">8 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
              </SelectField>
              <Field
                id="lockout"
                label="Failed login lockout"
                defaultValue="5 attempts / 15 min"
                disabled
              />
            </div>
          </div>
        </SuperAdminPanel>

        <SuperAdminPanel
          title="Notifications"
          description="Outbound messaging and in-app alerts."
        >
          <div className="space-y-6 divide-y divide-sky-100/90 dark:divide-sky-800/50">
            <ToggleRow
              label="Email notifications"
              description="Session reminders, queue alerts, and weekly digests."
              defaultChecked
              disabled
            />
            <div className="pt-6">
              <Field
                id="from"
                label="From address"
                type="email"
                defaultValue="noreply@rehab.local"
                disabled
              />
            </div>
          </div>
        </SuperAdminPanel>
      </div>
    </div>
  );
}
