async function generateReportPDF() {
    // 1. Capture the exact values from your form IDs
    const customerValue = document.getElementById('cust-name').value;
    const ticketValue = document.getElementById('call-no').value;
    const modelValue = document.getElementById('model-no').value;
    const serialValue = document.getElementById('serial-no').value;
    const descValue = document.getElementById('activity-desc').value;
    const dateValue = document.getElementById('service-date').value;
    const engineerValue = document.getElementById('eng-name').value;

    // 2. Map them to the {tags} in your Word document
    const formData = {
        customer: customerValue || "N/A",
        ticket: ticketValue || "N/A",
        model: modelValue || "N/A",
        serial: serialValue || "N/A",
        description: descValue || "No diagnostic details provided.",
        date: dateValue || new Date().toLocaleDateString(),
        engineer: engineerValue || "Kirk Allen"
    };

    try {
        const response = await fetch('./template.docx');
        const content = await response.arrayBuffer();
        const zip = new PizZip(content);
        
        // This line is critical for handling line breaks in your description
        const doc = new window.docxtemplater(zip, { 
            paragraphLoop: true, 
            linebreaks: true 
        });

        // 3. Inject the data
        doc.render(formData);

        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // 4. Save with a clean filename
        saveAs(out, `KATS_Report_${formData.customer.replace(/\s+/g, '_')}.docx`);
        
    } catch (error) {
        console.error("Template Error:", error);
        alert("Report Error: Please ensure all fields are filled.");
    }
}
