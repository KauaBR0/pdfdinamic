const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs').promises;

async function createTemplate() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const form = pdfDoc.getForm();
    
    // Fonts
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Colors
    const navyBlue = rgb(0.94, 0.15, 0.36); // #F0265C
    const green = rgb(0.2, 0.8, 0.2);
    const orangeButton = rgb(0.9, 0.4, 0.1);
    const greenButton = rgb(0.4, 0.8, 0.2);

    // Carregar e incorporar a imagem do logo
    const logoImageBytes = await fs.readFile('./assets/serasa.png');
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    
    // Desenhar a imagem no lugar do placeholder - movido mais para a esquerda
    page.drawImage(logoImage, {
        x: 50, // Reduzido de 130
        y: 755,
        width: 80, // Aumentado de 60
        height: 40, // Aumentado de 30
    });
    
    page.setFont(helveticaBold);
    
    page.drawText('Documento de Divida', {
        x: 370, // Aumentado de 370
        y: 770,
        size: 12, // Aumentado de 10
        color: navyBlue,
        align: 'right',
    });
    
    page.drawText('do Contribuinte', {
        x: 370, // Aumentado de 370
        y: 755, // Ajustado
        size: 12, // Aumentado de 10
        color: navyBlue,
        align: 'right',
    });
    
    // Form fields section - aumentados e movidos
    page.setFont(helvetica);
    page.drawText('CPF', {
        x: 50, // Reduzido de 130
        y: 738,
        size: 12, // Aumentado de 10
    });
    
    const cpfField = form.createTextField('cpf');
    cpfField.setText('');
    cpfField.addToPage(page, {
        x: 50, // Reduzido de 130
        y: 710,
        width: 180, // Aumentado de 130
        height: 25, // Aumentado de 20
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
    });
    
    page.drawText('Nome', {
        x: 250, // Ajustado de 270
        y: 738,
        size: 12, // Aumentado de 10
    });
    
    const nomeField = form.createTextField('nome');
    nomeField.setText('');
    nomeField.addToPage(page, {
        x: 250, // Ajustado de 270
        y: 710,
        width: 295, // Aumentado de 200
        height: 25, // Aumentado de 20
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
    });
    
    // Payment info section - espaçado verticalmente
    page.drawText('Periodo de Apuracao', {
        x: 50, // Reduzido de 130
        y: 675, // Ajustado de 685
        size: 12, // Aumentado de 10
    });
    
    page.drawRectangle({
        x: 50, // Reduzido de 130
        y: 645, // Ajustado de 660
        width: 180, // Aumentado de 130
        height: 25, // Aumentado de 20
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
    });
    
    page.drawText('0.00074110671936758', {
        x: 55, // Ajustado de 135
        y: 653, // Ajustado de 668
        size: 10, // Aumentado de 9
    });
    
    page.drawText('Data de Vencimento', {
        x: 250, // Ajustado de 270
        y: 675, // Ajustado de 685
        size: 12, // Aumentado de 10
    });
    
    page.drawRectangle({
        x: 250, // Ajustado de 270
        y: 645, // Ajustado de 660
        width: 120, // Aumentado de 85
        height: 25, // Aumentado de 20
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
    });
    
    // Calcula a data atual
    const dataAtual = new Date();
    
    // Calcula a data de vencimento (1 mês a partir de hoje)
    const dataVencimento = new Date(dataAtual);
    dataVencimento.setMonth(dataVencimento.getMonth() + 1);
    
    // Formata as datas no padrão brasileiro (dd/mm/yyyy)
    const formatarData = (data) => {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const dataGeracaoFormatada = formatarData(dataAtual);
    const dataVencimentoFormatada = formatarData(dataVencimento);

    page.drawText(dataVencimentoFormatada, {
        x: 260, // Ajustado de 275
        y: 653, // Ajustado de 668
        size: 10, // Aumentado de 9
    });
    
    page.drawText('Numero do Documento', {
        x: 390, // Aumentado de 365
        y: 675, // Ajustado de 685
        size: 12, // Aumentado de 10
    });
    
    page.drawRectangle({
        x: 390, // Aumentado de 365
        y: 645, // Ajustado de 660
        width: 155, // Aumentado de 105
        height: 25, // Aumentado de 20
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
    });
    
    page.drawText('7501711.20.07358-5', {
        x: 400, // Aumentado de 370
        y: 653, // Ajustado de 668
        size: 10, // Aumentado de 9
    });
    
    // Document information - movidos mais para baixo e alargados
    page.drawRectangle({
        x: 50, // Reduzido de 130
        y: 565, // Ajustado de 590
        width: 340, // Aumentado de 230
        height: 25, // Aumentado de 20
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
    });
    
    page.drawText('Tarifa Transacional Federal, gerada na data', {
        x: 60, // Ajustado de 135
        y: 573, // Ajustado de 598
        size: 10, // Aumentado de 9
    });
    
    page.drawRectangle({
        x: 50, // Reduzido de 130
        y: 535, // Ajustado de 570
        width: 340, // Aumentado de 230
        height: 25, // Aumentado de 20
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
    });
    
    page.drawText('documento: 7501711.20.07358-5', {
        x: 60, // Ajustado de 135
        y: 543, // Ajustado de 578
        size: 10, // Aumentado de 9
    });
    
    page.drawRectangle({
        x: 400, // Aumentado de 360
        y: 565, // Ajustado de 590
        width: 70, // Aumentado de 60
        height: 25, // Aumentado de 20
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
    });
    
    page.drawText(dataGeracaoFormatada, {
        x: 405, // Aumentado de 365
        y: 573, // Ajustado de 598
        size: 10, // Aumentado de 9
    });
    
    page.drawRectangle({
        x: 475, // Aumentado de 420
        y: 565, // Ajustado de 590
        width: 70, // Aumentado de 50
        height: 25, // Aumentado de 20
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
    });
    
    page.drawText('-------------', {
        x: 485, // Ajustado de 425
        y: 573, // Ajustado de 598
        size: 10, // Aumentado de 9
    });
    
    // Payment value section - orange button
    page.drawRectangle({
        x: 400, // Aumentado de 360
        y: 535, // Ajustado de 570
        width: 145, // Aumentado de 110
        height: 25, // Aumentado de 20
        color: orangeButton,
        borderWidth: 0,
    });
    
    page.drawText('R$68,27', {
        x: 470, // Centralizado no botão laranja ajustado
        y: 543, // Ajustado de 578
        size: 14, // Aumentado de 12
        color: rgb(1, 1, 1),
    });
    
    page.drawText('Valor após o desconto', {
        x: 420, // Centralizado, ajustado de 380
        y: 519, // Ajustado de 558
        size: 12, // Aumentado de 9
        align: 'center',
    });
    
    // Total value - green button
    page.drawRectangle({
        x: 400, // Aumentado de 360
        y: 485, // Ajustado de 535
        width: 145, // Aumentado de 110
        height: 25, // Aumentado de 20
        color: greenButton,
        borderWidth: 0,
    });
    
    page.drawText('5.960,50', {
        x: 470, // Centralizado no botão verde ajustado
        y: 493, // Ajustado de 543
        size: 14, // Aumentado de 12
        color: rgb(1, 1, 1),
    });
    
    page.drawText('Valor total da divida', {
        x: 420, // Centralizado, ajustado de 380
        y: 469, // Ajustado de 528
        size: 12, // Aumentado de 9
        align: 'center',
    });
    
    // Table header - aumentado e movido
    page.drawRectangle({
        x: 50, // Reduzido de 130
        y: 435, // Ajustado de 505
        width: 495, // Aumentado de 340
        height: 25, // Aumentado de 20
        color: navyBlue,
        borderWidth: 0,
    });
    
    page.setFont(helvetica);
    page.drawText('Composicao do Documento de Divida', {
        x: 70, // Ajustado de 145
        y: 443, // Ajustado de 513
        size: 12, // Aumentado de 10
        color: rgb(1, 1, 1),
    });
    
    // Table headers - ajustados e espaçados
    const headerY = 410; // Ajustado de 490
    page.drawText('Codigo', {
        x: 55, // Ajustado de 135
        y: headerY,
        size: 10, // Aumentado de 8
    });
    
    page.drawText('Denominacao', {
        x: 130, // Ajustado de 170
        y: headerY,
        size: 10, // Aumentado de 8
    });
    
    page.drawText('Principal', {
        x: 370, // Aumentado de 320
        y: headerY,
        size: 10, // Aumentado de 8
    });
    
    page.drawText('Multa', {
        x: 420, // Aumentado de 370
        y: headerY,
        size: 10, // Aumentado de 8
    });
    
    page.drawText('Juros', {
        x: 470, // Aumentado de 405
        y: headerY,
        size: 10, // Aumentado de 8
    });
    
    page.drawText('Total', {
        x: 520, // Aumentado de 440
        y: headerY,
        size: 10, // Aumentado de 8
    });
    
    // Table rows - ajustados e com mais espaço vertical
    const rows = [
        {code: 'BC-194', desc: 'Fatura Cartão de Crédito - Banco Nacional', principal: '854,32', multa: '98,76', juros: '123,45', total: '1.076,53'},
        {code: 'LJ-576', desc: 'Crediário Loja Magazine Brasil', principal: '427,90', multa: '42,79', juros: '85,58', total: '556,27'},
        {code: 'TL-328', desc: 'Conta de Telefonia Celular - Telecom SA', principal: '2.215,45', multa: '221,55', juros: '332,31', total: '2.769,31'}
    ];
    
    let yPos = 385; // Ajustado de 475
    for (const row of rows) {
        page.drawText(row.code, {
            x: 55, // Ajustado de 135
            y: yPos,
            size: 9, // Aumentado de 7
        });
        
        page.drawText(row.desc, {
            x: 130, // Ajustado de 170
            y: yPos,
            size: 9, // Aumentado de 7
        });
        
        page.drawText(row.principal, {
            x: 370, // Aumentado de 320
            y: yPos,
            size: 9, // Aumentado de 7
            align: 'right',
        });
        
        page.drawText(row.multa, {
            x: 420, // Aumentado de 370
            y: yPos,
            size: 9, // Aumentado de 7
            align: 'right',
        });
        
        page.drawText(row.juros, {
            x: 470, // Aumentado de 405
            y: yPos,
            size: 9, // Aumentado de 7
            align: 'right',
        });
        
        page.drawText(row.total, {
            x: 520, // Aumentado de 440
            y: yPos,
            size: 9, // Aumentado de 7
            align: 'right',
        });
        
        yPos -= 25; // Aumentado de 15 para mais espaço entre linhas
    }
    
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile('./templates/serasa-template.pdf', pdfBytes);
    console.log('Template criado com sucesso!');
}

createTemplate().catch(console.error);