async function generateReportPDF() {
    // These IDs MUST match the 'id' attributes in your <input> tags exactly
    const formData = {
        customer: document.getElementById('cust-name').value,
        ticket: document.getElementById('call-no').value,
        model: document.getElementById('model-no').value,
        serial: document.getElementById('serial-no').value,
        description: document.getElementById('activity-desc').value,
        date: document.getElementById('service-date').value,
        engineer: document.getElementById('eng-name').value
    };

    try {
        const response = await fetch('./template.docx'); // Pointing to the current folder
        const content = await response.arrayBuffer();
        const zip = new PizZip(content);
        const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // This injects the data into your template
        doc.render(formData);

        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Save file with customer name
        saveAs(out, `KATS_Report_${formData.customer.replace(/\s+/g, '_')}.docx`);
    } catch (error) {
        console.error("Template Error:", error);
        alert("Error generating report. Check console for details.");
    }
}
