const cron = require('node-cron');
const WeeklyLog = require('../models/weeklyLog');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const emailjs = require('@emailjs/node');

// Existing job function (no changes here)
async function generateAndEmailLogs() {
  try {
    const logs = await WeeklyLog.find();
    if (logs.length === 0) return;

    const doc = new PDFDocument();
    const tempPath = path.join(__dirname, 'weekly_logs.pdf');
    const stream = fs.createWriteStream(tempPath);
    doc.pipe(stream);

    doc.fontSize(18).fillColor('#00eaff').text('Weekly Objectives Summary', { align: 'center' });
    doc.moveDown();

    logs.forEach(log => {
      doc.fontSize(14).fillColor('#00eaff').text(`Week: ${log.weekRange}`);
      log.objectives.forEach(obj => {
        doc.fontSize(12).fillColor('#ffffff').text(`• ${obj}`);
      });
      doc.moveDown();
    });

    doc.end();

    stream.on('finish', async () => {
      const fileData = fs.readFileSync(tempPath).toString('base64');

      const emailParams = {
        to_email: 'anudeepkumar9347@gmail.com',
        message: 'Here is your weekly summary PDF.',
        attachment: fileData,
        attachment_filename: 'weekly_logs.pdf',
      };

      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        emailParams,
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY,
        }
      );

      await WeeklyLog.deleteMany(); // Delete all logs after sending
      fs.unlinkSync(tempPath); // Clean up the temp file
      console.log('✅ Weekly logs emailed and cleared.');
    });
  } catch (err) {
    console.error('❌ Cron job error:', err);
  }
}

// --- ✅ TEMPORARY: Run once manually ---
generateAndEmailLogs();

// Uncomment below only if keeping the scheduled cron:
// cron.schedule('0 18 * * 0', generateAndEmailLogs); // Every Sunday at 6PM
