# OMP Privacy Policy

**Effective Date: [June 3, 2025]**

Welcome to OMP (hereinafter referred to as "this Application" or "we")! This Application is a web application designed to help you manage and use media files in your OneDrive through official Microsoft APIs.

We highly value your privacy. This Privacy Policy (hereinafter referred to as "this Policy") is intended to explain how we handle (or, more accurately, **do not handle**) your information when you use our services. Please read this Policy carefully to ensure you understand and agree to it before using our services.

**1. We Do Not Collect Your Personal Information**

We solemnly declare: OMP **will not collect, store, transmit, analyze, or sell any of your personally identifiable information or the content and metadata of your files in OneDrive on the developer's servers.**

The design philosophy of this Application is to maximize user privacy protection:

* **Client-Side Operation:** This Application primarily runs directly in your browser.
* **Direct Interaction:** The Application interacts with your OneDrive account via official Microsoft APIs. All data requests and transmissions occur directly between your local device and your OneDrive, under your authorization.
* **No Developer Access:** The developer and this Application's servers (if any, they are only used to host the static web files of the application itself and do not process user data) cannot access, view, or store your personal OneDrive data or any personally identifiable information.

**2. Data Usage and Authorization**

* **User Authorization:** For this Application to access and operate on files in your OneDrive (e.g., listing files, reading media files for playback), you need to explicitly authorize this Application to access relevant data in your OneDrive account through Microsoft's OAuth 2.0 authorization process. The permissions we request include `User.Read` (to read basic user profile information), `Files.Read` (to read user's OneDrive files), and `Files.ReadWrite.AppFolder` (to read and write data in the application's dedicated folder, used for synchronizing history and playlists).
* **Scope of Permission:** This Application will only access your OneDrive data within the scope of your authorization and solely for implementing the core functionalities of the Application (such as Browse, managing, and playing your specified media files, synchronizing your playback history and playlists). We will not request permissions beyond what is necessary for the Application's functions.
* **Credential Security:** Your OneDrive login credentials (username and password) are processed and verified directly by Microsoft's authentication services. This Application will not obtain, record, or store these credentials. The MSAL (Microsoft Authentication Library) handles authentication tokens on the client-side (your browser).

**3. Data Storage**

This Application itself **does not have independent servers to store any of your personal data or file content.** Data you generate or use through this Application is stored in the following locations:

* **In Your OneDrive:**
    * According to the design of this Application, specific application-related data will be stored in the `Apps/OMP` folder in your personal OneDrive.
    * This data is under your control, and the developer cannot access it.
* **In Your Browser's Local Storage:**
    * **localStorage:**
        * Used to cache MSAL's authentication state.
        * Used to store the Application's UI settings (e.g., theme, view preferences).
        * Used to store the current play queue status.
    * **IndexedDB:**
        * Used to cache media file metadata (such as song titles, artists, album cover information) to improve loading speed and reduce network requests.
    * The data stored locally in your browser is for your personal use only, to enhance application experience and performance, and will not be transmitted to the developer or our servers.

**4. Microsoft OneDrive's Privacy Policy**

Data you store in OneDrive and authorizations made through Microsoft's authentication services are subject to Microsoft Corporation's privacy policy. We strongly recommend that you review and understand Microsoft's official privacy statement to learn how they collect, use, and protect your data. You can visit [https://privacy.microsoft.com/](https://privacy.microsoft.com/) to view it (please note that this link may change; refer to Microsoft's official latest link).

**5. Cookies and Browser Local Storage Technologies**

* **Cookies:** This Application currently does not primarily set or rely on Cookies to track users or store permanent personal information directly. Microsoft's authentication services (MSAL) may use Cookies in their processes, which adhere to Microsoft's privacy practices.
* **LocalStorage and IndexedDB:** As described in Section 3 "Data Storage," this Application uses browser LocalStorage and IndexedDB technologies to store authentication cache, UI preferences, play queue, and media metadata.
    * The information stored by these technologies is limited to data necessary for the application's operation and to enhance user experience, and it is retained only in your local browser and not sent to the developer.
    * You can clear Cookies, LocalStorage, and IndexedDB data at any time through your browser settings. However, please note that clearing this data may reset some application settings to default or require you to log in again.

**6. Data Security**

* We communicate securely with the Microsoft OneDrive API via the industry-standard OAuth 2.0 protocol to ensure the security of your authorization process and data transmission (between your device and OneDrive).
* The security of your personal data also depends on your proper safeguarding of your Microsoft account credentials and the security mechanisms of the Microsoft OneDrive service itself. We recommend using a strong password and enabling two-factor authentication for your Microsoft account.

**7. Third-Party Services**

Other than the Microsoft OneDrive API and Microsoft authentication services, this Application does not rely on other third-party services that actively collect your personal information and transmit it back to the developer. This Application uses various open-source libraries to build its features (as shown in the `package.json` file), and these libraries follow their respective open-source licensing agreements.

**8. Children's Privacy**

This Application is not targeted at children under the age of 13 (or other applicable age as defined in your jurisdiction). We do not knowingly collect any personally identifiable information from children.

**9. Changes to This Privacy Policy**

We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. If we make any material changes, we will notify you by posting the updated Privacy Policy on our Application's website and indicating the "Effective Date" at the top of the policy. We encourage you to review this Privacy Policy periodically for any updates. Your continued use of this Application after the changes take effect signifies your acceptance of the revised Privacy Policy.

**10. Contact Us**

If you have any questions, comments, or suggestions about this Privacy Policy or our handling of your information, please contact us through the following means:

* **GitHub:** [https://github.com/nini22P/omp](https://github.com/nini22P/omp)

Thank you for using OMP!