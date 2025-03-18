require('dotenv').config();
const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Criar diretórios necessários
const rootDir = path.join(__dirname, '..');
const pdfsDir = path.join(rootDir, 'pdfs');
const templatesDir = path.join(rootDir, 'templates');

// Criar diretórios se não existirem
Promise.all([
    fs.mkdir(pdfsDir, { recursive: true }),
    fs.mkdir(templatesDir, { recursive: true })
]).catch(console.error);

// Servir arquivos PDF estáticos
app.use('/pdfs', express.static(pdfsDir));

app.post('/generate-pdf', async (req, res) => {
    try {
        const { nome, cpf } = req.body;

        if (!nome || !cpf) {
            return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });
        }

        // Verificar se o template existe
        const templatePath = path.join(templatesDir, 'serasa-template.pdf');
        
        try {
            await fs.access(templatePath);
        } catch (error) {
            console.error(`Template não encontrado: ${templatePath}`, error);
            return res.status(500).json({ 
                error: 'Template PDF não encontrado.'
            });
        }
        
        const templateBytes = await fs.readFile(templatePath);
        const pdfDoc = await PDFDocument.load(templateBytes);
        const form = pdfDoc.getForm();

        form.getTextField('nome').setText(nome);
        form.getTextField('cpf').setText(cpf);
        form.flatten();

        const pdfBytes = await pdfDoc.save();
        
        // Criar nome de arquivo único
        const fileName = `serasa_${cpf.replace(/[^\d]/g, '')}_${Date.now()}.pdf`;
        const filePath = path.join(pdfsDir, fileName);
        
        // Salvar PDF no servidor
        await fs.writeFile(filePath, pdfBytes);

        // Retornar URL completa para o PDF
        const baseUrl = `http://${req.get('host')}`;
        const pdfUrl = `${baseUrl}/pdfs/${fileName}`;

        res.json({ 
            success: true,
            url: pdfUrl
        });

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).json({ error: 'Erro ao gerar PDF: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

