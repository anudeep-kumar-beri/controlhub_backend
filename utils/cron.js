// utils/cron.js
const cron = require('node-cron');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const WeeklyLog = require('../models/weeklyLog');
const emailjs = require('@emailjs/nodejs');

function generatePDF(logs, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).fillColor('#00eaff').text('Weekly Objectives Summary', { align: 'center' });
    doc.moveDown();

    logs.forEach((log) => {
      doc.fontSize(14).fillColor('#00eaff').text(`Week: ${log.weekRange}`);
      doc.moveDown(0.5);
      log.objectives.forEach((obj, i) => {
        doc.fontSize(12).fillColor('#ffffff').text(`• ${obj}`);
      });
      doc.moveDown();
    });

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

async function sendEmailWithPDF(filePath) {
  try {
    const emailParams = {
      to_email: process.env.RECIPIENT_EMAIL,
      subject: '📅 Your Weekly Objectives Summary',
      message: 'Attached is the automatically exported PDF of your weekly objectives from ControlHub.',
      attachment: fs.readFileSync(filePath).toString('base64'),
      filename: 'weekly_objectives.pdf',
    };

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      emailParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log('✅ Weekly log email sent successfully.');
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
}

cron.schedule('0 17 * * 0', async () => {
  try {
    const logs = await WeeklyLog.find();
    if (logs.length === 0) return;

    const filePath = './weekly_summary.pdf';
    await generatePDF(logs, filePath);
    await sendEmailWithPDF(filePath);

    await WeeklyLog.deleteMany({});
    console.log('🗑️ Weekly logs cleared after email.');
  } catch (error) {
    console.error('❌ Weekly log cron job failed:', error);
  }
});
