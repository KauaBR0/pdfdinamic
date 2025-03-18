require('dotenv').config();
const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const cloudinary = require('cloudinary').v2;

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
        
        // Salvar temporariamente o arquivo
        const tempPath = `./temp/${cpf}_${Date.now()}.pdf`;
        await fs.writeFile(tempPath, pdfBytes);

        // Fazer upload para o Cloudinary
        const result = await cloudinary.uploader.upload(tempPath, {
            resource_type: 'raw',
            public_id: `serasa_${cpf}_${Date.now()}`,
            format: 'pdf'
        });

        // Remover arquivo temporário
        await fs.unlink(tempPath);

        // Retornar a URL do PDF
        res.json({ 
            success: true,
            url: result.secure_url
        });

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).json({ error: 'Erro ao gerar PDF' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

