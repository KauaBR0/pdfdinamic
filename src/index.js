const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

const PORT = 3000;

app.post('/generate-pdf', async (req, res) => {
    try {
        const { nome, cpf } = req.body;

        if (!nome || !cpf) {
            return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });
        }

        const templateBytes = await fs.readFile('./templates/serasa-template.pdf');
        const pdfDoc = await PDFDocument.load(templateBytes);
        const form = pdfDoc.getForm();

        form.getTextField('nome').setText(nome);
        form.getTextField('cpf').setText(cpf);

        form.flatten();

        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=serasa-preenchido.pdf');

        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).json({ error: 'Erro ao gerar PDF' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});