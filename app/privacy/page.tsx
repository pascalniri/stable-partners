import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="container max-w-4xl mx-auto px-4 md:px-8">
          <div className="mb-16 border-b border-slate-100 pb-10">
            <h1 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">
              Stable Partners Group
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-12">
            <section>
              <p className="text-lg">
                STABLE PARTNERS GROUP (the &ldquo;Company&rdquo;) is committed
                to protecting your privacy. This Privacy Policy explains how we
                collect, use, and safeguard information submitted through our
                website.
              </p>

              <div className="mt-8 bg-slate-50 p-6 rounded-[5px] border border-slate-100">
                <p className="font-semibold text-slate-800 mb-2">
                  For purposes of this Policy:
                </p>
                <ul className="list-none space-y-2 m-0 p-0">
                  <li>
                    <span className="font-semibold text-slate-800">Site: </span>{" "}
                    refers to stablepartnersgroup.com
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">
                      Service:{" "}
                    </span>{" "}
                    refers to our property management consultation and related
                    services.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">You: </span>{" "}
                    refers to any user submitting information through the Site.
                  </li>
                </ul>
              </div>

              <p className="mt-6">
                By using our Site, you consent to the practices described in
                this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                I. Information We Collect
              </h2>
              <p className="mb-4">
                We collect limited Personal Information strictly for the purpose
                of evaluating potential business relationships.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    Information you provide directly:
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 marker:text-slate-300">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>
                      Property-related information (e.g., number of units,
                      performance data, general asset details)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                    We do not collect:
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 marker:text-slate-300">
                    <li>Identification documents</li>
                    <li>Financial or banking information</li>
                    <li>Tenant data</li>
                    <li>Sensitive personal data through the Site</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Automatically Collected Information:
                </h3>
                <p className="mb-4">
                  We may also collect basic Non-Personal Information
                  automatically, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-slate-300">
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Date/time of access</li>
                </ul>
                <p className="mt-4 text-sm text-slate-500 italic">
                  This information may be collected using cookies or similar
                  technologies.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                II. Purpose of Data Collection
              </h2>
              <p className="mb-4">
                The information collected is used solely to:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-slate-300 mb-6">
                <li>
                  Evaluate whether your property is a fit for our services
                </li>
                <li>Schedule and conduct consultation calls</li>
                <li>Communicate with you regarding your inquiry</li>
                <li>
                  Provide initial advisory insights on property performance
                </li>
              </ul>
              <div className="inline-block bg-slate-50 px-4 py-2 border border-slate-100 text-sm font-medium text-slate-700">
                We do not use your information for unrelated marketing or
                resale.
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                III. Data Sharing
              </h2>
              <p className="text-lg font-medium text-slate-800 mb-4">
                We do not sell, rent, or trade your Personal Information.
              </p>
              <p className="mb-4">
                Your information may be shared only where necessary with:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-slate-300 mb-4">
                <li>Internal team members</li>
                <li>Communication service providers (e.g., email platforms)</li>
              </ul>
              <p>
                All third parties are required to handle your data
                confidentially and only for the intended purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                IV. Financial Data Disclaimer
              </h2>
              <p className="mb-4">
                The Company does not collect or process financial or payment
                information through the Site.
              </p>
              <p>
                Any financial arrangements related to property management
                services are handled separately under specific contractual
                agreements and are not governed by this website Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                V. Data Storage and Security
              </h2>
              <p className="mb-4">
                Your information is stored on secure cloud-based systems.
              </p>
              <p className="mb-4">
                We implement appropriate technical safeguards, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-slate-300 mb-4">
                <li>Encryption</li>
                <li>Access controls</li>
              </ul>
              <p className="italic text-sm text-slate-500">
                While reasonable measures are in place, no system can guarantee
                absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                VI. Data Retention
              </h2>
              <p className="mb-4">
                We retain your information indefinitely for business record
                purposes unless you request deletion.
              </p>
              <p>
                You may request deletion of your data at any time by contacting
                us at:{" "}
                <a
                  href="mailto:stablepartnergrp@gmail.com"
                  className="text-[#1800AC] hover:underline font-medium"
                >
                  stablepartnergrp@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                VII. Your Rights
              </h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-slate-300 mb-6">
                <li>Request access to your data</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your data</li>
              </ul>
              <p>
                Requests can be made via:{" "}
                <a
                  href="mailto:stablepartnergrp@gmail.com"
                  className="text-[#1800AC] hover:underline font-medium"
                >
                  stablepartnergrp@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                VIII. Cookies and Tracking
              </h2>
              <p className="mb-4">
                The Site may use basic cookies to improve user experience and
                track general usage patterns.
              </p>
              <p>You may disable cookies through your browser settings.</p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                IX. Third-Party Links
              </h2>
              <p>
                The Site may contain links to third-party websites. We are not
                responsible for their privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                X. Jurisdiction
              </h2>
              <p>This Privacy Policy is governed by the laws of Rwanda.</p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                XI. Changes to This Policy
              </h2>
              <p>
                We reserve the right to update this Privacy Policy at any time.
                Updates will be posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
                XII. Contact
              </h2>
              <p className="mb-4">
                For any questions regarding this Privacy Policy, contact:
              </p>
              <div className="bg-slate-50 p-6 rounded-[5px] border border-slate-100">
                <p className="mb-2">
                  <span className="font-semibold text-slate-800">Name:</span>{" "}
                  STABLE PARTNERS GROUP
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-slate-800">Email:</span>{" "}
                  <a
                    href="mailto:stablepartnergrp@gmail.com"
                    className="text-[#1800AC] hover:underline"
                  >
                    stablepartnergrp@gmail.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Address:</span>{" "}
                  Kigali, Rwanda
                </p>
              </div>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 text-sm text-slate-500">
            Last Updated: 06, May, 2026
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
