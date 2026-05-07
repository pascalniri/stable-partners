import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Link from "next/link";

export default function TermsOfUse() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="container max-w-4xl mx-auto px-4 md:px-8">
          <div className="mb-16 border-b border-slate-100 pb-10">
            <h1 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight mb-4">
              Terms of Use
            </h1>
            <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">
              Stable Partners Group
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-12">
            <section>
              <p className="text-lg mb-6">
                Welcome to Stable Partners Group Terms of Use agreement.
              </p>

              <div className="bg-slate-50 p-6 rounded-[5px] border border-slate-100 mb-6">
                <p className="font-semibold text-slate-800 mb-2">
                  For purposes of this agreement:
                </p>
                <ul className="list-none space-y-2 m-0 p-0">
                  <li>
                    <span className="font-semibold text-slate-800">Site: </span>{" "}
                    refers to the Company&rsquo;s website, which can be accessed
                    at stablepartnersgroup.com
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">
                      Service:{" "}
                    </span>{" "}
                    refers to the Company&rsquo;s property management
                    consultation and related services.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">
                      We, us, and our:{" "}
                    </span>{" "}
                    refer to the Company.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">You: </span>{" "}
                    refers to you, as a user of our Site or our Service.
                  </li>
                </ul>
              </div>

              <p className="mb-4">
                The following Terms of Use apply when you view or use the
                Service via our website located at stablepartnersgroup.com.
              </p>
              <p className="font-medium text-slate-800">
                Please review the following terms carefully. By accessing or
                using the Service, you signify your agreement to these Terms of
                Use. If you do not agree to be bound by these Terms of Use in
                their entirety, you may not access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Privacy Policy
              </h2>
              <p>
                The Company respects the privacy of its users. Please refer to
                the Company&rsquo;s Privacy Policy (found{" "}
                <Link
                  href="/privacy"
                  className="text-[#1800AC] hover:underline font-medium"
                >
                  here
                </Link>
                ) which explains how we collect, use, and disclose information.
                By using the Service, you agree to both these Terms and the
                Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                About the Service
              </h2>
              <p className="mb-4">
                The Service allows users to submit their contact details and
                property-related information for the purpose of:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-slate-300 mb-6">
                <li>Requesting a consultation</li>
                <li>Evaluating potential property management engagement</li>
                <li>
                  Receiving preliminary advisory insights regarding property
                  performance
                </li>
              </ul>
              <div className="inline-block bg-slate-50 px-4 py-3 border border-slate-100 text-sm font-medium text-slate-700">
                The Site does not provide property management services directly.
                Any formal services are provided only after a separate written
                agreement is executed between the Company and the client.
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Use Restrictions
              </h2>
              <p className="mb-4">
                Your permission to use the Site is conditioned upon the
                following restrictions. You agree that you will not:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-slate-300">
                <li>
                  Use the Site for any unlawful purpose or for the promotion of
                  illegal activities
                </li>
                <li>Submit false, misleading, or inaccurate information</li>
                <li>
                  Attempt to interfere with the proper functioning of the Site
                </li>
                <li>
                  Attempt to gain unauthorized access to the Site or its systems
                </li>
                <li>
                  Use automated systems (bots, scraping tools, etc.) to access
                  or extract data
                </li>
                <li>Circumvent or disable security features of the Site</li>
                <li>Introduce malicious software or harmful content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Submitted Information
              </h2>
              <p className="mb-4">
                By submitting information through the Site, you:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-slate-300 mb-6">
                <li>
                  Confirm that the information provided is accurate and truthful
                </li>
                <li>
                  Acknowledge that such information is used solely for
                  evaluation and communication purposes
                </li>
                <li>
                  Grant the Company the right to contact you regarding your
                  inquiry
                </li>
              </ul>
              <p>
                The Site does not support public posting, user accounts, or
                user-generated content beyond direct submissions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                No Financial Transactions
              </h2>
              <p className="mb-4">
                The Site does not process or facilitate any payments.
              </p>
              <p>
                All financial arrangements related to property management
                services are handled separately under formal contractual
                agreements and are not governed by these Terms of Use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                No Professional Guarantees
              </h2>
              <p className="mb-4">
                Any insights, recommendations, or preliminary advice provided
                through the Site or initial consultation are for informational
                purposes only.
              </p>
              <p className="mb-4">The Company does not guarantee:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-slate-300 mb-6">
                <li>Specific financial performance</li>
                <li>Rental income outcomes</li>
                <li>Investment returns</li>
              </ul>
              <p>
                All results depend on multiple external factors beyond the
                Company&rsquo;s control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Links to Third-Party Sites
              </h2>
              <p>
                The Site may contain links to third-party websites. These are
                provided for convenience only. The Company is not responsible
                for the content, accuracy, or practices of such third-party
                sites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Intellectual Property
              </h2>
              <p className="mb-4">
                All content on the Site, including text, branding, design, and
                materials, is the property of the Company and is protected by
                applicable intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, or use any content without
                prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Electronic Communications
              </h2>
              <p className="mb-4">
                By submitting your contact information, you consent to receive
                communications from the Company via email or phone for purposes
                related to your inquiry.
              </p>
              <p>
                You may request to stop communications at any time by
                contacting:{" "}
                <a
                  href="mailto:stablepartnersgrp@gmail.com"
                  className="text-[#1800AC] hover:underline font-medium"
                >
                  stablepartnersgrp@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Warranty Disclaimer
              </h2>
              <p className="font-medium text-slate-800 uppercase tracking-wide leading-relaxed text-sm">
                THE SITE AND SERVICE ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT
                WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING
                BUT NOT LIMITED TO ACCURACY, RELIABILITY, OR FITNESS FOR A
                PARTICULAR PURPOSE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Limitation of Liability
              </h2>
              <p className="font-medium text-slate-800 uppercase tracking-wide mb-4 text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR SPECIAL
                DAMAGES ARISING FROM:
              </p>
              <ul className="list-none space-y-3 font-medium text-slate-800 uppercase tracking-wide pl-4 text-sm">
                <li>(A) USE OF OR INABILITY TO USE THE SITE</li>
                <li>(B) RELIANCE ON INFORMATION PROVIDED THROUGH THE SITE</li>
                <li>(C) ANY TECHNICAL ERRORS OR INTERRUPTIONS</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Modification of Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. Updates
                will be posted on the Site. Continued use of the Site
                constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                General Terms
              </h2>
              <p className="mb-4">
                If any provision of these Terms is found to be invalid or
                unenforceable, the remaining provisions shall remain in full
                force and effect.
              </p>
              <p>
                Any failure to enforce a provision shall not constitute a
                waiver.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Governing Law
              </h2>
              <p>
                These Terms of Use shall be governed by and interpreted in
                accordance with the laws of Rwanda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6 uppercase">
                Contact
              </h2>
              <p className="mb-4">
                For any questions regarding these Terms, contact:
              </p>
              <div className="bg-slate-50 p-6 rounded-[5px] border border-slate-100">
                <p className="mb-2">
                  <span className="font-semibold text-slate-800">Name:</span>{" "}
                  STABLE PARTNERS GROUP
                </p>
                <p className="mb-2">
                  <span className="font-semibold text-slate-800">Email:</span>{" "}
                  <a
                    href="mailto:stablepartnersgrp@gmail.com"
                    className="text-[#1800AC] hover:underline"
                  >
                    stablepartnersgrp@gmail.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Address:</span>{" "}
                  Kigali, Rwanda
                </p>
              </div>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-800 uppercase tracking-widest leading-relaxed">
              YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF USE, UNDERSTAND
              THEM, AND AGREE TO BE BOUND BY THEM. THESE TERMS, TOGETHER WITH
              THE PRIVACY POLICY, CONSTITUTE THE ENTIRE AGREEMENT BETWEEN YOU
              AND THE COMPANY REGARDING USE OF THE SITE.
            </p>
          </div>

          <div className="mt-8 text-sm text-slate-500">
            Effective as of May, 06, 2026
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
