const cron = require('node-cron');
const WeeklyLog = require('./models/weeklyLog');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const YOUR_EMAIL = 'anudeepkumar9347@gmail.com'; // use your Gmail

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: YOUR_EMAIL,
    pass: process.env.EMAIL_PASSWORD, // Set in .env on Render
  },
});

function sendWeeklySummaryEmail() {
  WeeklyLog.find().then((logs) => {
    if (!logs.length) {
      console.log('No weekly logs found, skipping email.');
      return;
    }

    // Ensure tmp folder exists
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const filename = `weekly_summary_${Date.now()}.pdf`;
    const filePath = path.join(tmpDir, filename);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text('Weekly Objectives Summary', { align: 'center' });
    doc.moveDown();

    logs.forEach((log) => {
      doc.fontSize(14).text(`Week: ${log.weekRange}`);
      log.objectives.forEach((obj) => {
        doc.fontSize(12).text(`  • ${obj}`);
      });
      doc.moveDown();
    });

    doc.end();

    doc.on('finish', () => {
      transporter.sendMail({
        from: `"ControlHub" <${YOUR_EMAIL}>`,
        to: YOUR_EMAIL,
        subject: 'Your Weekly Objectives Summary',
        text: 'Attached is your PDF summary for the week.',
        attachments: [{ filename, path: filePath }],
      }, (err, info) => {
        if (err) {
          console.error('❌ Email send error:', err);
        } else {
          console.log('✅ Weekly PDF sent:', info.response);
          fs.unlinkSync(filePath); // Clean up temp file
        }
      });
    });
  }).catch((err) => {
    console.error('❌ Failed to fetch logs:', err);
  });
}

// 🕒 Schedule to run every Sunday at 2 PM (server time)
cron.schedule('0 14 * * 0', sendWeeklySummaryEmail);

module.exports = sendWeeklySummaryEmail;
