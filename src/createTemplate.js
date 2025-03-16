const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs').promises;

async function createTemplate() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const form = pdfDoc.getForm();
    
    // Fontes
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Cores
    const rosaSerasa = rgb(1, 0.2, 0.4);      
    
    // Cabeçalho
    page.drawRectangle({
        x: 0,
        y: 770,
        width: 595.28,
        height: 72,
        color: rosaSerasa,
    });
    
    page.setFont(helveticaBold);
    page.drawText('FEIRÃO LIMPA NOME - SERASA', {
        x: 50,
        y: 805,
        size: 22,
        color: rgb(1, 1, 1),
    });

    // Acordo Número
    page.setFont(helveticaBold);
    page.drawText('ACORDO Nº 83N2L618362E', {
        x: 50,
        y: 740,
        size: 14,
        color: rosaSerasa,
    });

    // Linha decorativa rosa
    page.drawRectangle({
        x: 50,
        y: 730,
        width: 495,
        height: 2,
        color: rosaSerasa,
    });

    // Informações do Acordo
    page.setFont(helveticaBold);
    page.drawText('DADOS DO ACORDO', {
        x: 50,
        y: 700,
        size: 14,
        color: rosaSerasa,
    });

    // Campo Nome
    page.setFont(helvetica);
    page.drawText('Beneficiário:', {
        x: 50,
        y: 670,
        size: 12,
    });
    
    const nomeField = form.createTextField('nome');
    nomeField.setText('');
    nomeField.addToPage(page, {
        x: 50,
        y: 640,
        width: 495,
        height: 25,
    });

    // Campo CPF
    page.drawText('CPF:', {
        x: 50,
        y: 610,
        size: 12,
    });
    
    const cpfField = form.createTextField('cpf');
    cpfField.setText('');
    cpfField.addToPage(page, {
        x: 50,
        y: 580,
        width: 200,
        height: 25,
    });

    page.setFont(helveticaBold);
    page.drawText('CONDIÇÕES DO ACORDO', {
        x: 50,
        y: 540,
        size: 14,
        color: rosaSerasa,
    });

    page.drawRectangle({
        x: 50,
        y: 530,
        width: 495,
        height: 2,
        color: rosaSerasa,
    });

    page.setFont(helvetica);
    page.drawText('Desconto:', {
        x: 50,
        y: 500,
        size: 12,
    });
    page.setFont(helveticaBold);
    page.drawText('97%', {
        x: 110,  // Ajustado de 120 para 110
        y: 500,
        size: 12,
        color: rosaSerasa,
    });

    page.setFont(helvetica);
    page.drawText('Valor a pagar:', {
        x: 50,
        y: 470,
        size: 12,
    });
    page.setFont(helveticaBold);
    page.drawText('R$ 68,92', {
        x: 135,  // Ajustado de 120 para 135
        y: 470,
        size: 12,
        color: rosaSerasa,
    });

    page.setFont(helvetica);
    page.drawText('Score após pagamento:', {
        x: 50,
        y: 440,
        size: 12,
    });
    page.setFont(helveticaBold);
    page.drawText('+895 pontos', {
        x: 180,  // Ajustado de 170 para 180
        y: 440,
        size: 12,
        color: rosaSerasa,
    });

    page.setFont(helveticaBold);
    page.drawText('FORMA DE PAGAMENTO', {
        x: 50,
        y: 400,
        size: 14,
        color: rosaSerasa,
    });

    page.drawRectangle({
        x: 50,
        y: 390,
        width: 495,
        height: 2,
        color: rosaSerasa,
    });

    page.setFont(helvetica);
    page.drawText('Selecione a opção:', {
        x: 50,
        y: 360,
        size: 12,
    });

    const radioGroup = form.createRadioGroup('formaPagamento');
    
    radioGroup.addOptionToPage('avista', page, {
        x: 50,
        y: 335,
        width: 15,
        height: 15,
    });
    page.drawText('À Vista', {
        x: 70,
        y: 338,
        size: 12,
    });

    radioGroup.addOptionToPage('parcelado', page, {
        x: 150,
        y: 335,
        width: 15,
        height: 15,
    });
    page.drawText('Parcelado', {
        x: 170,
        y: 338,
        size: 12,
    });

    radioGroup.select('avista');
    
   

    page.drawRectangle({
        x: 0,
        y: 0,
        width: 595.28,
        height: 40,
        color: rosaSerasa,
    });

    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;

    page.drawText(`Feirão Limpa Nome Serasa | Data: ${dataFormatada}`, {
        x: 155,
        y: 15,
        size: 10,
        color: rgb(1, 1, 1),
    });

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile('./templates/serasa-template.pdf', pdfBytes);
    console.log('Template criado com sucesso!');
}

createTemplate().catch(console.error);