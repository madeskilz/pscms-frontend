-- Add sample posts for Resources, FAQs, PTA, and Parents pages

-- Resources
INSERT INTO posts (type, status, title, slug, content, author_id, created_at, updated_at) VALUES
('page', 'published', 'Student Handbook 2024-2025', 'student-handbook-2024', 
'<h2>Student Handbook 2024-2025</h2><p>This handbook contains all the information students need to know about school policies, behavioral expectations, dress code, and academic requirements.</p><h3>Key Sections:</h3><ul><li>School Rules and Regulations</li><li>Dress Code Policy</li><li>Academic Integrity</li><li>Attendance Policy</li><li>Disciplinary Procedures</li></ul>',
1, datetime('now'), datetime('now')),

('page', 'published', 'Parent Handbook and Guide', 'parent-handbook-guide', 
'<h2>Parent Handbook</h2><p>Welcome to our school community! This handbook provides parents with important information about school operations, communication channels, and ways to get involved.</p><h3>Contents:</h3><ul><li>School Contact Information</li><li>Communication Guidelines</li><li>Parent Involvement Opportunities</li><li>School Policies and Procedures</li><li>Payment Information</li></ul>',
1, datetime('now'), datetime('now')),

('page', 'published', 'Enrollment Application Form', 'enrollment-application-form', 
'<h2>Enrollment Application Form</h2><p>Use this form to apply for admission to our school. Please fill out all sections completely and submit with required documents.</p><p><strong>Required Documents:</strong></p><ul><li>Birth Certificate</li><li>Previous School Records</li><li>2 Passport Photographs</li><li>Medical Records</li><li>Proof of Address</li></ul>',
1, datetime('now'), datetime('now')),

('page', 'published', 'Academic Calendar 2024-2025', 'academic-calendar-2024', 
'<h2>Academic Calendar 2024-2025</h2><p>Plan ahead with our comprehensive academic calendar showing all important dates for the school year.</p><h3>Key Dates:</h3><ul><li>First Term: September 11 - December 20</li><li>Second Term: January 8 - April 4</li><li>Third Term: April 22 - July 18</li><li>Mid-term breaks and public holidays included</li></ul>',
1, datetime('now'), datetime('now'));

-- FAQs
INSERT INTO posts (type, status, title, slug, content, author_id, created_at, updated_at) VALUES
('page', 'published', 'What documents are needed for admission?', 'faq-admission-documents', 
'<h2>Required Admission Documents</h2><p>To complete your child''s enrollment, please provide the following documents:</p><ul><li>Completed Application Form</li><li>Original Birth Certificate</li><li>Previous School Report Cards (Last 2 years)</li><li>Transfer Certificate from Previous School</li><li>4 Recent Passport Photographs</li><li>Medical Fitness Certificate</li><li>Immunization Records</li><li>Proof of Residence</li></ul><p>All documents should be presented in original along with photocopies.</p>',
1, datetime('now'), datetime('now')),

('page', 'published', 'What is the fee structure and payment schedule?', 'faq-fee-structure-payment', 
'<h2>Fee Structure and Payment</h2><p><strong>Tuition Fees (Annual):</strong></p><ul><li>Nursery/Kindergarten: ₦450,000</li><li>Primary 1-6: ₦550,000</li><li>Secondary JSS 1-3: ₦650,000</li><li>Secondary SSS 1-3: ₦750,000</li></ul><p><strong>Payment Schedule:</strong></p><ul><li>First Term: 40% (due at enrollment)</li><li>Second Term: 30% (due January 8)</li><li>Third Term: 30% (due April 22)</li></ul><p><strong>Payment Methods:</strong> Bank transfer, online payment portal, or in-person at accounts office.</p>',
1, datetime('now'), datetime('now')),

('page', 'published', 'Do you offer scholarships or financial aid?', 'faq-scholarships-financial-aid', 
'<h2>Scholarships and Financial Aid</h2><p>Yes! We offer several scholarship and financial aid programs:</p><h3>Merit Scholarships:</h3><ul><li>Academic Excellence Award (up to 50% tuition)</li><li>Sports Achievement Scholarship (up to 30% tuition)</li><li>Arts and Music Scholarship (up to 30% tuition)</li></ul><h3>Need-Based Aid:</h3><ul><li>Financial hardship assistance available</li><li>Payment plan options</li><li>Sibling discounts (10% for 2nd child, 15% for 3rd)</li></ul><p>Applications are reviewed each academic year. Contact our admissions office for more information.</p>',
1, datetime('now'), datetime('now')),

('page', 'published', 'What extracurricular activities are available?', 'faq-extracurricular-activities', 
'<h2>Extracurricular Activities</h2><p>We offer a wide range of activities to develop students'' talents and interests:</p><h3>Sports:</h3><ul><li>Football, Basketball, Volleyball</li><li>Athletics, Swimming, Table Tennis</li><li>Taekwondo, Chess</li></ul><h3>Arts & Culture:</h3><ul><li>Music (Piano, Guitar, Drums, Choir)</li><li>Drama and Theatre</li><li>Visual Arts and Painting</li><li>Dance (Traditional and Contemporary)</li></ul><h3>Academic Clubs:</h3><ul><li>Science Club, Debate Club</li><li>Mathematics Olympiad Team</li><li>Robotics and Coding Club</li><li>Literary and Arts Society</li></ul>',
1, datetime('now'), datetime('now'));

-- PTA Posts
INSERT INTO posts (type, status, title, slug, content, author_id, created_at, updated_at) VALUES
('post', 'published', 'PTA General Meeting - November 2024', 'pta-meeting-november-2024', 
'<h2>PTA General Meeting - November 2024</h2><p><strong>Date:</strong> Saturday, November 23, 2024</p><p><strong>Time:</strong> 10:00 AM - 12:00 PM</p><p><strong>Venue:</strong> School Auditorium</p><h3>Agenda:</h3><ul><li>Approval of October minutes</li><li>Principal''s report on academic progress</li><li>End of year fundraising event planning</li><li>Holiday celebration arrangements</li><li>New parent orientation program</li><li>Q&A session</li></ul><p>All parents are encouraged to attend. Light refreshments will be served.</p>',
1, datetime('now', '-3 days'), datetime('now', '-3 days')),

('post', 'published', 'PTA Fundraiser Success - Thank You!', 'pta-fundraiser-success-2024', 
'<h2>Fundraiser Success!</h2><p>We are thrilled to announce that our 2024 annual fundraiser raised ₦3.2 million, surpassing our goal of ₦2.5 million!</p><h3>Achievements:</h3><ul><li>New computer lab equipment purchased</li><li>Library expansion project funded</li><li>Sports equipment upgraded</li><li>Scholarship fund established</li></ul><p>Thank you to all parents, staff, and sponsors who made this possible. Special recognition to our fundraising committee for their outstanding work!</p>',
1, datetime('now', '-7 days'), datetime('now', '-7 days')),

('post', 'published', 'Volunteer Opportunities for Parents', 'parent-volunteer-opportunities', 
'<h2>Parent Volunteer Opportunities</h2><p>The PTA is looking for parent volunteers to help with various school programs and events.</p><h3>Current Opportunities:</h3><ul><li><strong>Reading Buddies:</strong> Help students with reading practice (30 mins weekly)</li><li><strong>Career Day Speakers:</strong> Share your profession with students</li><li><strong>Event Coordination:</strong> Help organize school events and activities</li><li><strong>Library Assistants:</strong> Support library operations and programs</li><li><strong>Sports Day Marshals:</strong> Assist during sports competitions</li></ul><p>Contact the PTA coordinator at pta@school.test to sign up or learn more!</p>',
1, datetime('now', '-5 days'), datetime('now', '-5 days'));

-- Parent Portal Updates
INSERT INTO posts (type, status, title, slug, content, author_id, created_at, updated_at) VALUES
('post', 'published', 'Parent Portal Now Live - Access Your Dashboard', 'parent-portal-launch', 
'<h2>Parent Portal Launch</h2><p>We''re excited to announce the launch of our online Parent Portal!</p><h3>Features:</h3><ul><li>View real-time grades and academic progress</li><li>Check attendance records</li><li>Message teachers directly</li><li>Access homework assignments</li><li>Download report cards</li><li>Make fee payments online</li><li>Update contact information</li></ul><p><strong>How to Access:</strong></p><ol><li>Visit portal.school.test</li><li>Use your registered email</li><li>Initial password sent via SMS</li><li>Change password on first login</li></ol><p>Need help? Contact IT support at support@school.test</p>',
1, datetime('now', '-10 days'), datetime('now', '-10 days')),

('post', 'published', 'Tips for Supporting Your Child at Home', 'parent-support-tips', 
'<h2>Supporting Your Child''s Learning at Home</h2><p>Here are evidence-based strategies to help your child succeed academically:</p><h3>Create a Learning Environment:</h3><ul><li>Designate a quiet study space</li><li>Ensure good lighting and minimal distractions</li><li>Keep necessary supplies accessible</li></ul><h3>Establish Routines:</h3><ul><li>Set consistent homework times</li><li>Create bedtime routines for adequate sleep</li><li>Balance screen time with other activities</li></ul><h3>Stay Engaged:</h3><ul><li>Review homework regularly</li><li>Ask about their school day</li><li>Attend parent-teacher conferences</li><li>Encourage reading daily</li></ul><h3>Promote Independence:</h3><ul><li>Let them solve problems first</li><li>Guide rather than give answers</li><li>Celebrate effort, not just results</li></ul>',
1, datetime('now', '-12 days'), datetime('now', '-12 days'));

