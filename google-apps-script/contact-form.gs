/**
 * Contact form → Google Sheet
 *
 * Setup:
 * 1. Create a new Google Sheet (File → Download → .xlsx anytime you want Excel).
 * 2. Extensions → Apps Script → paste this file → Save.
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL into script.js (CONTACT_FORM_SCRIPT_URL).
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    ensureHeaders(sheet);

    var data = parseRequestData(e);

    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.message
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput("Contact form endpoint is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function parseRequestData(e) {
  var data = { name: "", email: "", message: "" };

  if (e.parameter) {
    data.name = String(e.parameter.name || "");
    data.email = String(e.parameter.email || "");
    data.message = String(e.parameter.message || "");
  }

  if (!data.name && !data.email && !data.message && e.postData && e.postData.contents) {
    try {
      var parsed = JSON.parse(e.postData.contents);
      data.name = String(parsed.name || "");
      data.email = String(parsed.email || "");
      data.message = String(parsed.message || "");
    } catch (err) {
      // Fall back to empty fields if body is not JSON.
    }
  }

  return data;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Email", "Message"]);
    sheet.setFrozenRows(1);
  }
}
