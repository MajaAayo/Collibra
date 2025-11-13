import React from 'react';

const Terms = () => {
  return (
    <div className="terms-container">
      <header className="terms-header">
        <h1>Terms of Service</h1>
      </header>
      <main>
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Collibra, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Description of Service</h2>
          <p>
            Collibra provides a digital library platform offering a variety of books.
            Users can browse, search, and access books freely without any account or payment requirements.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. User Conduct</h2>
          <p>
            You agree to use Collibra only for lawful purposes and in a manner that
            does not infringe the rights of others or restrict their use and enjoyment
            of the service. Prohibited conduct includes, but is not limited to:
          </p>
          <ul>
            <li>Posting or transmitting any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, obscene, or otherwise objectionable.</li>
            <li>Impersonating any person or entity, or falsely stating or misrepresenting your affiliation with a person or entity.</li>
            <li>Interfering with or disrupting the service or servers or networks connected to the service.</li>
            <li>Attempting to gain unauthorized access to our systems.</li>
            <li>Distributing viruses or other malicious code.</li>
            <li>Violating any intellectual property rights, including copyrights and trademarks.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. Intellectual Property</h2>
          <p>
            All content included on Collibra, such as text, graphics, logos, images,
            and software, is the property of Collibra or its licensors and is protected
            by copyright and other intellectual property laws. You may not reproduce,
            distribute, modify, or create derivative works of any content without our
            express written consent.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Disclaimer of Warranties</h2>
          <p>
            Collibra is provided on an "as is" and "as available" basis. We make no
            warranties, express or implied, including but not limited to, the implied
            warranties of merchantability, fitness for a particular purpose, and
            non-infringement. We do not warrant that the service will be uninterrupted
            or error-free, that defects will be corrected, or that the service or the
            servers that make it available are free of viruses or other harmful components.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall Collibra be liable for any direct, indirect, incidental,
            special, or consequential damages arising out of or in any way connected
            with the use of the service or the inability to use the service, even if
            advised of the possibility of such damages.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Collibra and its affiliates,
            officers, agents, and employees from any claim or demand, including
            reasonable attorneys' fees, made by any third party due to or arising
            out of your use of the service, your violation of these Terms of Service,
            or your violation of any rights of another.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time.
            We will notify you of any material changes by posting the updated terms
            on our website. Your continued use of the service after the posting of
            the revised terms constitutes your acceptance of the changes.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of Nepal.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Terms;