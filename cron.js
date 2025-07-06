const cron = require('node-cron');
const WeeklyLog = require('./models/weeklyLog');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const YOUR_EMAIL = 'anudeepkumar9347@gmail.com'; // replace
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: YOUR_EMAIL,
    pass: process.env.EMAIL_PASSWORD, // stored in .env
  },
});

function sendWeeklySummaryEmail() {
  WeeklyLog.find().then((logs) => {
    const doc = new PDFDocument();
    const filename = `weekly_summary_${Date.now()}.pdf`;
    const filePath = `./tmp/${filename}`;

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text('Weekly Objectives Summary', { align: 'center' });
    doc.moveDown();

    logs.forEach((log) => {
      doc.fontSize(14).text(`Week: ${log.weekRange}`);
      log.objectives.forEach((obj, idx) => {
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
        attachments: [
          {
            filename,
            path: filePath,
          },
        ],
      }, (err, info) => {
        if (err) {
          console.error('Email error:', err);
        } else {
          console.log('Weekly PDF sent:', info.response);
          fs.unlinkSync(filePath); // delete after sending
        }
      });
    });
  });
}

// Every Sunday at 2 PM server time
cron.schedule('0 14 * * 0', sendWeeklySummaryEmail);

module.exports = sendWeeklySummaryEmail;
