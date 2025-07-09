// utils/cron.js
const cron = require('node-cron');
const jsPDF = require('jspdf');
require('jspdf-autotable');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const emailjs = require('@emailjs/nodejs');
const WeeklyLog = require('../models/weeklyLog');

// Schedule: Every Sunday at 7 PM
cron.schedule('0 19 * * 0', async () => {
  try {
    const logs = await WeeklyLog.find();
    if (!logs.length) return;

    // Generate PDF
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor('#00eaff');
    doc.text('Weekly Objectives Summary', 14, 20);

    let y = 30;
    logs.forEach((log) => {
      doc.setFontSize(14);
      doc.setTextColor('#00eaff');
      doc.text(`Week: ${log.weekRange}`, 14, y);

      const rows = log.objectives.map(obj => [`• ${obj.trim()}`]);
      doc.autoTable({
        startY: y + 5,
        head: [['Objectives']],
        body: rows,
        styles: {
          textColor: [0, 234, 255],
          fillColor: '#181c23',
          fontSize: 11,
        },
        headStyles: {
          fillColor: '#00eaff',
          textColor: '#ffffff',
        },
        margin: { left: 14, right: 14 },
      });

      y = doc.lastAutoTable.finalY + 10;
    });

    const filePath = path.join(__dirname, '../tmp/weekly_objectives.pdf');
    doc.save(filePath);

    // Email using EmailJS Node SDK
    await emailjs.send(
      'service_dhqpoyu',
      'template_r7kiceh',
      {
        to_email: 'anudeepkumar9347@gmail.com',
        weekRange: logs[logs.length - 1].weekRange,
      },
      {
        publicKey: 'ygpvqWkGBFwtRLXq5',
        attachment: {
          content: fs.readFileSync(filePath).toString('base64'),
          name: 'weekly_objectives.pdf',
        }
      }
    );

    console.log('📨 Weekly objectives emailed successfully.');

    // Clean up local file
    fs.unlinkSync(filePath);

    // Delete all logs
    await WeeklyLog.deleteMany({});
    console.log('🧹 Weekly logs cleared from database.');

  } catch (err) {
    console.error('🚨 Weekly email automation failed:', err);
  }
});
