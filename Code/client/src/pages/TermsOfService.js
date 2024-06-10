import React from 'react';
import NavBar from '../components/NavBar.js'
import Footer from '../components/Footer.js'
import '../styles.css';

function TermsOfService() {
    return (
        <div className="terms-of-service">
            <NavBar />
            <h1>Terms of Service</h1>

            <h2 className="tos-header">1. Introduction</h2>
            <p>Welcome to VolleyVibe! By using our website ("Service"), you agree to be bound by the following terms and conditions ("Terms of Service"). If you do not agree to these terms, please do not use our Service.</p>

            <h2 className="tos-header">2. Use of the Service</h2>
            <h3 className="tos-header">Eligibility</h3>
            <p>You must be at least 13 years old to use our Service. By using the Service, you represent and warrant that you meet this age requirement.</p>

            <h3 className="tos-header">Account Registration</h3>
            <p>To access certain features of the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>

            <h3 className="tos-header">User Responsibilities</h3>
            <p>You are responsible for safeguarding your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>

            <h2 className="tos-header">3. Content</h2>
            <h3 className="tos-header">User Content</h3>
            <p>You retain ownership of the content you submit to the Service ("User Content"). By submitting User Content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute your User Content in connection with the operation of the Service.</p>

            <h3 className="tos-header">Prohibited Content</h3>
            <p>You agree not to submit any content that:</p>
            <ul>
                <li className="tos-item">Is illegal, harmful, or offensive.</li>
                <li className="tos-item">Infringes on the intellectual property rights of others.</li>
                <li className="tos-item">Contains viruses or other harmful computer code.</li>
            </ul>

            <h2 className="tos-header">4. Match and Player Management</h2>
            <h3 className="tos-header">Match Management</h3>
            <p>Users can add and manage volleyball matches. You agree to provide accurate information when creating and updating match records.</p>

            <h3 className="tos-header">Player Management</h3>
            <p>Users can manage player information and select players for teams. You agree to maintain accurate and up-to-date player information.</p>

            <h2 className="tos-header">5. Filtering and Sorting</h2>
            <p>Our Service includes filtering and sorting functionalities to help you manage matches effectively. You agree to use these features in accordance with their intended purpose.</p>

            <h2 className="tos-header">6. Modifications to the Service</h2>
            <p>We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that we shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.</p>

            <h2 className="tos-header">7. Termination</h2>
            <p>We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms of Service.</p>

            <h2 className="tos-header">8. Limitation of Liability</h2>
            <p>In no event shall VolleyVibe, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
            <ul>
                <li className="tos-item">Your use or inability to use the Service.</li>
                <li className="tos-item">Any unauthorized access to or use of our servers and/or any personal information stored therein.</li>
                <li className="tos-item">Any interruption or cessation of transmission to or from the Service.</li>
            </ul>

            <h2 className="tos-header">9. Governing Law</h2>
            <p>These Terms of Service shall be governed and construed in accordance with the laws of The United States of America, without regard to its conflict of law provisions.</p>

            <h2 className="tos-header">10. Changes to the Terms of Service</h2>
            <p>We reserve the right to modify these Terms of Service at any time. If we make changes to these terms, we will provide notice of such changes by posting the updated terms on our website. Your continued use of the Service after the effective date of the revised Terms of Service constitutes your acceptance of the terms.</p>

            <h2 className="tos-header">11. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:jacob.hitchcock1@gmail.com">jacob.hitchcock1@gmail.com</a>.</p>

            <p><strong>Last Updated: June 10, 2024</strong></p>
            <Footer />
        </div>
    );
}

export default TermsOfService;
