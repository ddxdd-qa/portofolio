const fs = require('fs');
const path = require('path');
const { chromium } = require('../e2e/node_modules/playwright');

const photoPath = path.resolve(__dirname, '../assets/dedy-blinda.png');
const photoBase64 = fs.readFileSync(photoPath).toString('base64');
const photoDataUrl = `data:image/png;base64,${photoBase64}`;

const cvHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dedy Blinda Rosandy - Curriculum Vitae</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1a2524;
      background: #ffffff;
      line-height: 1.45;
      font-size: 9.5pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    a {
      color: #0c777d;
      text-decoration: none;
    }
    .header {
      border-bottom: 2px solid #1a2524;
      padding-bottom: 12px;
      margin-bottom: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-profile {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .header-photo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #0c777d;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
      flex-shrink: 0;
    }
    .header-left h1 {
      font-size: 19pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #121a19;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .header-left h2 {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0c777d;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .header-right {
      text-align: right;
      font-size: 8.5pt;
      color: #495957;
      line-height: 1.4;
    }
    .header-right span {
      display: block;
    }
    .header-right a {
      font-weight: 600;
    }

    .section {
      margin-bottom: 13px;
    }
    .section-title {
      font-size: 9.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #121a19;
      border-bottom: 1px solid #d0dad7;
      padding-bottom: 3px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-title::before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #0c777d;
      border-radius: 50%;
    }

    .summary-text {
      font-size: 9pt;
      color: #374745;
      line-height: 1.5;
      text-align: justify;
    }

    /* Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 5px 12px;
      font-size: 8.5pt;
    }
    .skill-category {
      font-weight: 700;
      color: #121a19;
    }
    .skill-list {
      color: #374745;
    }

    /* Experience Items */
    .exp-item {
      margin-bottom: 11px;
      page-break-inside: avoid;
    }
    .exp-item:last-child {
      margin-bottom: 0;
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .exp-role {
      font-size: 10pt;
      font-weight: 700;
      color: #121a19;
    }
    .exp-company {
      font-weight: 600;
      color: #0c777d;
    }
    .exp-period {
      font-size: 8.5pt;
      font-weight: 700;
      color: #5c6e6b;
      white-space: nowrap;
    }
    .exp-location {
      font-size: 8pt;
      color: #7b8e8b;
      margin-bottom: 4px;
    }
    .exp-desc {
      font-size: 8.8pt;
      color: #374745;
      line-height: 1.45;
      margin-bottom: 5px;
    }
    .exp-bullets {
      list-style-type: disc;
      padding-left: 16px;
      font-size: 8.8pt;
      color: #374745;
      line-height: 1.4;
      margin-bottom: 4px;
    }
    .exp-bullets li {
      margin-bottom: 2px;
    }
    .exp-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 4px;
    }
    .skill-tag {
      font-size: 7.5pt;
      font-weight: 600;
      background: #eef6f5;
      color: #0c777d;
      padding: 1.5px 6px;
      border-radius: 4px;
      border: 1px solid #d4e5e3;
    }

    /* Education & Projects */
    .grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .edu-item, .proj-item {
      font-size: 8.8pt;
      page-break-inside: avoid;
    }
    .edu-degree {
      font-weight: 700;
      color: #121a19;
    }
    .edu-school {
      font-weight: 600;
      color: #0c777d;
    }
    .edu-year {
      font-size: 8pt;
      color: #7b8e8b;
      margin-bottom: 2px;
    }
    .proj-item {
      margin-bottom: 6px;
      page-break-inside: avoid;
    }
    .proj-item:last-child {
      margin-bottom: 0;
    }
    .proj-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .proj-title {
      font-weight: 700;
      color: #121a19;
      font-size: 8.8pt;
    }
    .proj-meta {
      font-size: 7.8pt;
      color: #0c777d;
      font-weight: 600;
    }
    .proj-desc {
      font-size: 8.3pt;
      color: #495957;
      line-height: 1.35;
      margin-top: 1px;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header class="header">
    <div class="header-profile">
      <img src="${photoDataUrl}" alt="Dedy Blinda Rosandy" class="header-photo">
      <div class="header-left">
        <h1>Dedy Blinda Rosandy</h1>
        <h2>Senior Quality Assurance Tester · QA Engineer</h2>
      </div>
    </div>
    <div class="header-right">
      <span>✉️ <a href="mailto:dedy.blinda94@gmail.com">dedy.blinda94@gmail.com</a></span>
      <span>🔗 <a href="https://www.linkedin.com/in/dedy-blinda/">linkedin.com/in/dedy-blinda</a></span>
      <span>🐙 <a href="https://github.com/ddxdd-qa">github.com/ddxdd-qa</a></span>
      <span>🌐 <a href="https://ddxdd-qa.github.io/portofolio/">ddxdd-qa.github.io/portofolio</a></span>
    </div>
  </header>

  <!-- PROFESSIONAL SUMMARY -->
  <section class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary-text">
      Detail-driven Senior Quality Assurance Tester & Software Engineer with <strong>12+ years</strong> of technology experience, including over <strong>5 years specializing in Software Quality Assurance and Test Automation</strong>. Proven track record across fintech ecosystems, mobile & web applications, payment gateways, booking engines, loyalty systems, and RESTful APIs. Expertise in developing comprehensive test cases, defect triaging, and automating regression suites using Playwright, Cypress, Appium, and Katalon Studio. Strong multidisciplinary background in full-stack web development and systems engineering ensures seamless root-cause analysis and productive pairing with developer squads.
    </p>
  </section>

  <!-- CORE COMPETENCIES -->
  <section class="section">
    <div class="section-title">Core Competencies & Technical Skills</div>
    <div class="skills-grid">
      <div class="skill-category">QA Methodologies:</div>
      <div class="skill-list">Manual Testing, Test Automation, Functional & Regression Testing, End-to-End (E2E), Integration Testing, System Testing, Black Box, User Acceptance Testing (UAT), Test Strategy, Test Plan Design.</div>

      <div class="skill-category">Automation & Tools:</div>
      <div class="skill-list">Playwright, Cypress, Appium (Mobile Automation), Katalon Studio, Selenium WebDriver, Postman (API Testing), Qase.io, GitLab CI/CD, GitHub, Jira, Defect Reporting & Triage.</div>

      <div class="skill-category">Languages & DB:</div>
      <div class="skill-list">JavaScript, TypeScript, PHP (CodeIgniter, Laravel), Java, JSP, SQL (MySQL, PostgreSQL), HTML5, CSS3, Shell / Linux.</div>

      <div class="skill-category">Domains & Ecosystems:</div>
      <div class="skill-list">Fintech (StarWALLET, Payment Gateways), Booking Engines, Loyalty & Rewards Systems, OTP & Liveness Verification, Web & Mobile Platforms (Android, iOS).</div>
    </div>
  </section>

  <!-- WORK EXPERIENCE -->
  <section class="section">
    <div class="section-title">Professional Experience</div>

    <!-- Role 1 -->
    <div class="exp-item">
      <div class="exp-header">
        <div>
          <span class="exp-role">Senior Quality Assurance Tester</span> — <span class="exp-company">Starworks Global Pte Ltd</span>
        </div>
        <div class="exp-period">Sep 2024 — Present</div>
      </div>
      <div class="exp-location">Badung Regency, Bali, Indonesia · Full-time (On-site)</div>
      <p class="exp-desc">
        Leading end-to-end quality assurance initiatives and automated regression suites across web and mobile platforms in the StarWORKS ecosystem.
      </p>
      <ul class="exp-bullets">
        <li>Direct testing strategies, regression frameworks, and release readiness for multi-tier applications (StarWALLET, StarPoint loyalty, Booking Engine).</li>
        <li>Implement automated test suites using Playwright, Cypress, Appium, and Katalon Studio, reducing repetitive manual testing overhead.</li>
        <li>Coordinate closely with software engineering, DevOps, and product management to streamline bug turnaround and sprint QA deliverables.</li>
      </ul>
      <div class="exp-skills">
        <span class="skill-tag">JavaScript</span>
        <span class="skill-tag">TypeScript</span>
        <span class="skill-tag">Playwright</span>
        <span class="skill-tag">Cypress</span>
        <span class="skill-tag">Appium</span>
        <span class="skill-tag">Katalon Studio</span>
        <span class="skill-tag">E2E Automation</span>
        <span class="skill-tag">Test Architecture</span>
      </div>
    </div>

    <!-- Role 2 -->
    <div class="exp-item">
      <div class="exp-header">
        <div>
          <span class="exp-role">QA Tester</span> — <span class="exp-company">Starworks Global Pte Ltd</span>
        </div>
        <div class="exp-period">Sep 2021 — Sep 2024</div>
      </div>
      <div class="exp-location">Kerobokan Kelod, Badung, Bali, Indonesia · Full-time</div>
      <p class="exp-desc">
        Reviewed and analyzed software specifications across ecosystem products; executed detailed manual and automated test plans.
      </p>
      <ul class="exp-bullets">
        <li>Review and analyze system specifications across web and mobile platforms.</li>
        <li>Execute test cases (manual or automated) and analyze results.</li>
        <li>Evaluate product code according to specifications.</li>
        <li>Create logs to document testing phases and defects.</li>
        <li>Report bugs and errors to development teams.</li>
        <li>Conduct post-release/post-implementation testing.</li>
        <li>Reviews test procedures and develops test scripts.</li>
        <li>Work with cross-functional teams to ensure quality throughout the software development lifecycle.</li>
      </ul>
      <div class="exp-skills">
        <span class="skill-tag">Manual Testing</span>
        <span class="skill-tag">Test Automation</span>
        <span class="skill-tag">Postman</span>
        <span class="skill-tag">REST API</span>
        <span class="skill-tag">Qase.io</span>
        <span class="skill-tag">GitLab</span>
        <span class="skill-tag">SQL</span>
      </div>
    </div>

    <!-- Role 3 -->
    <div class="exp-item">
      <div class="exp-header">
        <div>
          <span class="exp-role">Full Stack Engineer</span> — <span class="exp-company">PT SEMANGAT DIGITAL INDONESIA</span>
        </div>
        <div class="exp-period">Jan 2020 — Sep 2021</div>
      </div>
      <div class="exp-location">Bali, Indonesia · Contract</div>
      <p class="exp-desc">
        Developed dynamic web applications, architected scalable database schemas, and constructed robust backend RESTful APIs with PHP (CodeIgniter) and TypeScript.
      </p>
      <div class="exp-skills">
        <span class="skill-tag">CodeIgniter</span>
        <span class="skill-tag">TypeScript</span>
        <span class="skill-tag">PHP</span>
        <span class="skill-tag">MySQL</span>
        <span class="skill-tag">REST APIs</span>
      </div>
    </div>

    <!-- Role 4 -->
    <div class="exp-item">
      <div class="exp-header">
        <div>
          <span class="exp-role">Information Technology Supervisor</span> — <span class="exp-company">PT Dimata Sora Jayate</span>
        </div>
        <div class="exp-period">Oct 2018 — Jan 2020</div>
      </div>
      <div class="exp-location">Denpasar, Bali, Indonesia · Full-time</div>
      <p class="exp-desc">
        Supervised IT operations, server health, system infrastructure, and supported enterprise software solutions across client deployments.
      </p>
      <div class="exp-skills">
        <span class="skill-tag">IT Management</span>
        <span class="skill-tag">Systems Architecture</span>
        <span class="skill-tag">Infrastructure</span>
        <span class="skill-tag">Team Leadership</span>
      </div>
    </div>

    <!-- Role 5 -->
    <div class="exp-item">
      <div class="exp-header">
        <div>
          <span class="exp-role">Java Software Engineer</span> — <span class="exp-company">PT Dimata Sora Jayate</span>
        </div>
        <div class="exp-period">Feb 2015 — Oct 2018</div>
      </div>
      <div class="exp-location">Denpasar, Bali, Indonesia · Full-time</div>
      <p class="exp-desc">
        Designed and maintained enterprise web applications and business logic modules utilizing Java and JavaServer Pages (JSP) with relational database backends.
      </p>
      <div class="exp-skills">
        <span class="skill-tag">Java</span>
        <span class="skill-tag">JavaServer Pages (JSP)</span>
        <span class="skill-tag">SQL</span>
        <span class="skill-tag">Enterprise Software</span>
      </div>
    </div>

    <!-- Role 6 -->
    <div class="exp-item">
      <div class="exp-header">
        <div>
          <span class="exp-role">IT Support Technician</span> — <span class="exp-company">PT Dimata Sora Jayate</span>
        </div>
        <div class="exp-period">Nov 2013 — Jan 2015</div>
      </div>
      <div class="exp-location">Denpasar, Bali, Indonesia · Full-time</div>
      <p class="exp-desc">
        Network analysis, client training, hardware/software troubleshooting, Linux server administration, and infrastructure maintenance.
      </p>
      <div class="exp-skills">
        <span class="skill-tag">Network Analysis</span>
        <span class="skill-tag">Linux Administration</span>
        <span class="skill-tag">Troubleshooting</span>
        <span class="skill-tag">Technical Training</span>
      </div>
    </div>
  </section>

  <!-- FEATURED QA PROJECTS -->
  <section class="section">
    <div class="section-title">Featured QA Projects</div>
    <div class="projects-list">
      <div class="proj-item">
        <div class="proj-header">
          <span class="proj-title">StarWALLET — E2E Testing with Cypress</span>
          <span class="proj-meta">Cypress · JavaScript · Fintech QA</span>
        </div>
        <p class="proj-desc">
          Automated end-to-end regression testing for digital wallet ecosystem; validated authentication, balance transfers, transaction security, and third-party payment gateway callbacks.
        </p>
      </div>

      <div class="proj-item">
        <div class="proj-header">
          <span class="proj-title">BIV Booking Website — E2E Testing with Playwright</span>
          <span class="proj-meta">Playwright · TypeScript · Web Automation</span>
        </div>
        <p class="proj-desc">
          Built test automation suite validating real-time room availability, calendar date-pickers, pricing engine calculations, multi-step checkout flows, and cross-browser responsiveness.
        </p>
      </div>

      <div class="proj-item">
        <div class="proj-header">
          <span class="proj-title">StarPOINT POS — Mobile Testing with Appium</span>
          <span class="proj-meta">Appium · Android &amp; iOS · POS Ecosystem</span>
        </div>
        <p class="proj-desc">
          Engineered automated mobile test suites for point-of-sale terminal apps; verified order creation, customer loyalty point redemptions, offline transaction caching, and receipt printer integrations.
        </p>
      </div>
    </div>
  </section>

  <!-- EDUCATION -->
  <section class="section">
    <div class="section-title">Education &amp; Academic Background</div>
    <div class="grid-2col">
      <div class="edu-item">
        <div class="edu-degree">Bachelor of Computer Systems (S.Kom.)</div>
        <div class="edu-school">ITB STIKOM Bali</div>
        <div class="edu-year">Computer Systems, Hardware, Architecture &amp; Software Engineering</div>
      </div>
      <div class="edu-item">
        <div class="edu-degree">Computer Network Engineering (TKJ)</div>
        <div class="edu-school">SMK Negeri 1 Denpasar</div>
        <div class="edu-year">Computer Networking, Protocols &amp; System Infrastructure</div>
      </div>
    </div>
  </section>

</body>
</html>
`;

(async () => {
  const outputPath = path.resolve(__dirname, '../cv/Dedy_Blinda_CV.pdf');
  console.log('Generating CV to:', outputPath);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(cvHtml, { waitUntil: 'networkidle' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '14mm',
      right: '14mm'
    }
  });

  await browser.close();
  console.log('CV PDF generated successfully!');
})();
