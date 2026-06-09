import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      brandName: 'DeepShield',
      kycOnboarding: 'KYC Onboarding',
      riskMonitor: 'Risk Monitor',
      navbar: {
        notifications: 'Notifications',
        markAsRead: 'Mark all as read',
        duplicateImages: 'Duplicate property images detected — Gurugram Ad Ad Ad',
        minAgo: '2 min ago',
        verificationPending: 'Owner verification pending review — Rahul Verma',
        min14Ago: '14 min ago',
        systemUpdate: 'System: Rental model updated to v1.2',
        hr1Ago: '1 hr ago'
      },
      sidebar: {
        ownerVerification: 'Owner Verification',
        fraudControlCenter: 'Fraud Control Center',
        reportsAnalytics: 'Reports & Analytics',
        rulesEngine: 'Rules Engine',
        settings: 'Settings',
        userName: 'Rahul Kumar',
        userRole: 'Risk Operations',
        userInitials: 'RK'
      },
      reports: {
        title: 'Reports & Analytics',
        subtitle: 'Performance metrics and fraud detection insights for the last 30 days.',
        exportCsv: 'Export CSV',
        kpi: {
          totalVerifications: 'Total Verifications',
          fraudPrevented: 'Fraud Prevented Value',
          avgReviewTime: 'Average Review Time',
          falsePositiveRate: 'False Positive Rate'
        },
        charts: {
          fraudTypes: 'Fraud Types Detected',
          recentActivity: 'Recent Activity',
          viewAll: 'View All'
        },
        activity: {
          approvedOnboarding: 'Approved Onboarding',
          flaggedListing: 'Flagged Listing (Rule #4)',
          rejectedIdentity: 'Rejected Identity Document',
          approvedPayout: 'Approved Payout Transfer',
          blockedIp: 'Blocked IP Range'
        }
      },
      rules: {
        title: 'DeepShield Engine',
        subtitle: 'Automated risk scoring is currently',
        active: 'Active',
        paused: 'Paused',
        pauseEngine: 'Pause Engine',
        activateEngine: 'Activate Engine',
        addRule: 'Add Rule',
        activeWeights: 'Active Rule Weights (v1.2)',
        rulesActive: '{{count}} Rules Active',
        condition: 'Condition',
        effect: 'Effect'
      },
      settings: {
        title: 'Settings',
        subtitle: 'Manage your platform preferences and API integrations.',
        tabs: {
          general: 'General Profile',
          notifications: 'Notifications',
          apiKeys: 'API Keys'
        },
        general: {
          title: 'Company Details',
          desc: "Update your organization's basic information.",
          companyName: 'Company Name',
          supportEmail: 'Support Email',
          timezone: 'Timezone',
          timezones: {
            ist: 'Asia/Kolkata (IST)',
            utc: 'UTC',
            est: 'America/New_York (EST)'
          },
          saveChanges: 'Save Changes'
        },
        notifications: {
          title: 'Alert Preferences',
          desc: 'Choose when and how you want to be notified.',
          highRisk: 'High-Risk Transactions',
          highRiskDesc: 'Get an email when a transaction\'s risk score exceeds 80.',
          kycFailures: 'KYC Verification Failures',
          kycFailuresDesc: 'Alert me when a user fails document verification.',
          rulesUpdates: 'Rules Engine Updates',
          rulesUpdatesDesc: 'Notify me when a team member modifies active rules.',
          weeklyDigest: 'Weekly Digest',
          weeklyDigestDesc: 'Receive a weekly summary report of fraud analytics.'
        },
        apiKeys: {
          title: 'API Integrations',
          desc: 'Manage API keys used to connect your backend to DeepShield.',
          generateKey: 'Generate New Key',
          revoke: 'Revoke',
          created: 'Created: {{date}}',
          lastUsed: 'Last Used: {{time}}'
        }
      },
      kyc: {
        title: 'Onboard New Owner',
        subtitle: 'Complete the KYC and due diligence process to verify the property owner.',
        tabs: {
          personal: 'Personal Info',
          documents: 'Documents',
          verification: 'Verification'
        },
        personal: {
          title: 'Personal Information',
          desc: 'Enter the owner\'s basic details',
          fullName: 'Full Name',
          email: 'Email Address',
          phone: 'Phone Number',
          continue: 'Continue to Documents'
        },
        documents: {
          title: 'Identity Documents',
          desc: 'Upload government-issued ID and property deed',
          govId: 'Government ID',
          clickUpload: 'Click to upload or drag and drop',
          supportedFormats: 'SVG, PNG, JPG or PDF (max. 10MB)',
          propertyDeed: 'Property Deed',
          back: 'Back',
          continue: 'Continue to Verification'
        },
        verification: {
          title: 'Verification Status',
          desc: 'Review the automated checks',
          identityCheck: 'Identity Check',
          verified: 'Verified via Govt Database',
          propertyCheck: 'Property Check',
          matches: 'Deed matches registry',
          riskScreening: 'Risk Screening',
          passed: 'Passed AML & Sanctions',
          back: 'Back',
          submit: 'Submit Application'
        }
      },
      risk: {
        title: 'Fraud Control Center',
        subtitle: 'Real-time monitoring of property listings and payout streams.',
        kpi: {
          transactions: 'Transactions (24h)',
          flagged: 'Flagged Listings',
          riskScore: 'Avg Risk Score'
        },
        table: {
          title: 'Recent Transactions',
          filters: 'Filters',
          search: 'Search...',
          headers: {
            transaction: 'Transaction',
            amount: 'Amount',
            date: 'Date',
            riskScore: 'Risk Score',
            status: 'Status',
            action: 'Action'
          },
          status: {
            approved: 'Approved',
            flagged: 'Flagged',
            pending: 'Pending',
            rejected: 'Rejected'
          },
          review: 'Review'
        },
        drawer: {
          details: 'Transaction Details',
          review: 'Risk Review Required',
          rule: 'Rule: {{rule}}',
          approve: 'Approve Transaction',
          reject: 'Reject & Block User'
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
