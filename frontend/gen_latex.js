import { readFileSync } from 'node:fs';

const plants = JSON.parse(readFileSync('names.json', 'utf8'));

let latex = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{multicol}
\\usepackage{enumitem}

% Minimal margins to fit everything
\\geometry{a4paper, margin=0.2in, landscape}
\\pagestyle{empty}

\\begin{document}
\\centering
\\textbf{\\Large Complete Seed Bank Inventory (388 Varieties)}
\\vspace{0.2cm}

\\begin{multicols*}{5} % 5 Columns
\\tiny % Tiny font to fit single page
\\begin{itemize}[leftmargin=*, nosep]
`;

plants.forEach(p => {
    const sci = p.scientific.replace(/&/g, '\\&');
    const com = p.common.replace(/&/g, '\\&');
    latex += `  \\item \\textbf{${sci}} \\\\ ${com}\n`;
});

latex += `\\end{itemize}
\\end{multicols*}
\\end{document}`;

console.log(latex);
