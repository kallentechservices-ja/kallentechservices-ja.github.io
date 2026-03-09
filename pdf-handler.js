async function generateReportPDF() {
    const formData = {
        customer: document.getElementById('cust-name').value || "N/A",
        ticket: document.getElementById('call-no').value || "N/A",
        model: document.getElementById('model-no').value || "N/A",
        serial: document.getElementById('serial-no').value || "N/A",
        description: document.getElementById('activity-desc').value || "No details provided.",
        date: document.getElementById('service-date').value || new Date().toLocaleDateString(),
        engineer: document.getElementById('eng-name').value
    };

    try {
        // This fetches the actual file you just uploaded to GitHub
        const response = await fetch('template.docx');
        const content = await response.arrayBuffer();
        const zip = new PizZip(content);
        const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // This "injects" your form data into the Word Doc
        doc.render(formData);

        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Downloads the final filled-out file
        saveAs(out, `KATS_Report_${formData.customer}.docx`);
    } catch (error) {
        console.error("Template Error:", error);
        alert("Make sure template.docx is uploaded to your GitHub repo.");
    }
}
