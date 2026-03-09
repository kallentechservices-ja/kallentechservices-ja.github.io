async function generateReportPDF() {
    const element = document.getElementById('report-to-print');
    const custName = document.getElementById('cust-name').value || "Client";
    
    // 1. Force the report to be visible and solid
    element.style.opacity = "1";
    element.style.visibility = "visible";
    element.style.display = "block";
    element.style.transform = "none";

    // 2. THE CRITICAL FIX: Manually move text from the "screen" to the "HTML"
    const inputs = element.querySelectorAll('input, textarea, select');
    inputs.forEach(i => {
        i.setAttribute('value', i.value); 
        if(i.tagName === 'TEXTAREA') {
            i.innerHTML = i.value;
        }
    });

    const opt = {
        margin: [10, 5],
        filename: `KATS_Report_${custName}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#0d1117', // Your specific dark background
            letterRendering: true,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 3. Run the generator
    try {
        await html2pdf().set(opt).from(element).save();
        console.log("PDF successfully generated.");
    } catch (err) {
        console.error("PDF Crash:", err);
    }
}
