/** Bind this script to the destination spreadsheet. Demo scores, not exam-grade identity. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || e.postData.contents.length > 12000) throw new Error('Invalid payload');
    var p = JSON.parse(e.postData.contents);
    validateSubmission(p);
    lock.waitLock(20000);
    var spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!spreadsheetId) throw new Error('Missing SPREADSHEET_ID in Script Properties');
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName('Results');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Results');
      sheet.appendRow(['Submission ID','User ID','Full name','Username','Quiz ID','Chapter','Correct','Total','Score','Duration seconds','Submitted at']);
      sheet.setFrozenRows(1);
    }
    var last = sheet.getLastRow();
    if (last > 1) {
      var found = sheet.getRange(2,1,last-1,1).createTextFinder(p.submissionId).matchEntireCell(true).useRegularExpression(false).findNext();
      if (found) return json({ok:true,submissionId:p.submissionId,duplicate:true});
    }
    var values = [p.submissionId,p.userId,p.fullName,p.username,p.quizId,p.chapter].map(safeCell)
      .concat([p.correctCount,p.totalQuestions,p.score,p.durationSeconds,safeCell(p.submittedAt)]);
    sheet.appendRow(values);
    SpreadsheetApp.flush();
    return json({ok:true,submissionId:p.submissionId});
  } catch (error) {
    return json({ok:false,error:String(error.message || error)});
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
function doGet() { return json({ok:true,service:'AminoLab scores',version:1}); }
function json(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function safeCell(value) {
  var text = String(value);
  // Prevent formulas even when preceded by whitespace or control characters.
  return /^[\s\u0000-\u001f]*[=+\-@]/.test(text) ? "'" + text : text;
}
function validateSubmission(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('Invalid object');
  ['submissionId','userId'].forEach(function(k) {
    if (typeof p[k] !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(p[k])) throw new Error('Invalid ID');
  });
  ['fullName','username','quizId','chapter','submittedAt'].forEach(function(k) {
    if (typeof p[k] !== 'string' || !p[k].trim() || p[k].length > 160) throw new Error('Invalid text: '+k);
  });
  if (!/^[a-z0-9_]{3,24}$/.test(p.username) || p.fullName.length > 80) throw new Error('Invalid user text');
  if (['all','amino','peptide'].indexOf(p.chapter) < 0) throw new Error('Invalid chapter');
  if (!Number.isInteger(p.totalQuestions) || p.totalQuestions < 1 || p.totalQuestions > 64) throw new Error('Invalid total');
  if (!Number.isInteger(p.correctCount) || p.correctCount < 0 || p.correctCount > p.totalQuestions) throw new Error('Invalid correct count');
  if (typeof p.score !== 'number' || !Number.isFinite(p.score) || p.score < 0 || p.score > 10) throw new Error('Invalid score');
  if (Math.abs(p.score - Math.round(p.correctCount / p.totalQuestions * 100) / 10) > 0.001) throw new Error('Inconsistent score');
  if (!Number.isInteger(p.durationSeconds) || p.durationSeconds < 0 || p.durationSeconds > 31536000) throw new Error('Invalid duration');
  if (!/^\d{4}-\d{2}-\d{2}T/.test(p.submittedAt) || isNaN(Date.parse(p.submittedAt))) throw new Error('Invalid date');
}
