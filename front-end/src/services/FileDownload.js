import { jsPDF } from "jspdf";
import UtilsFunctions from "../Utils/UtilsFunctions"

class CreatePdf {

    createPDFFatura(validationJson, domain) {

        var doc = new jsPDF();

        this.buildHeader(doc,validationJson, domain)
        this.buildErrors(validationJson.errors, 125, doc)
        doc.save()

    }

    buildHeader(doc, validationJson, domain) {
        var img = new Image();

        img.src = "https://media-exp1.licdn.com/dms/image/C4D0BAQGQzM4D8Y7Kbg/company-logo_200_200/0/1560166394889?e=2159024400&v=beta&t=w3DdhuuOJcQ-UsdA3s-IjZPvgVGdC9wBAF6jOuMsy2U"


        doc.addImage(img, "JPEG", 175, 5, 25, 25)

        doc.setFontSize(15)
        doc.text("Erros de validação", 10, 115)

        doc.setFontSize(18)
        doc.text("Validador de arquivos", 10, 15)

        doc.setFontSize(15)
        doc.text("Data de geração do arquivo " + UtilsFunctions.formatTimeStampToDate(Date.now()), 10, 25)

        doc.line(10, 35, 200, 35)

        doc.setFontSize(15)
        doc.text("Informações gerais do arquivo", 10, 45)

        doc.setFontSize(10)
        doc.text("Nome do arquivo: "+ domain.originalName, 10, 55)
        doc.text("Tamanho: "+ UtilsFunctions.bytesToMB(domain.size), 80, 62)
        doc.text("Status: "+ domain.status, 10, 62)
        doc.text("Id do arquivo: "+ domain.id, 150, 62)

        doc.setFontSize(15)
        doc.text("Informações sobre a validação", 10, 80)
        doc.setFontSize(10)

        doc.text("Validado em "+validationJson.date, 10, 90)
        doc.text("Id da validação: "+validationJson.id, 150, 90)
        doc.text("Tipo de validação: "+validationJson.validateType, 10, 97)
        
        doc.setFontSize(10)
        doc.getCurrentPageInfo()
    }

    compare(str1, str2) {
        return str1.localeCompare(str2) === 0;
    }

    overflowPage(doc){
        doc.addPage();
        doc.setPage(doc.getCurrentPageInfo().pageNumber+1);
        return 15;
    }

    escreveDescricaoErro(doc, text, x, y) {
        if(text.length > 100){
            let indiceBarra = text.lastIndexOf("|", 100);
            let size = this.escreveDescricaoErro(doc, text.substring(0, indiceBarra), 10, y);
            return this.escreveDescricaoErro(doc, text.substring(indiceBarra+2, text.length), 10, size);
        }
        doc.text(text, x, y);
        return y + 6 <= 285 ? y + 6 : this.overflowPage(doc);
    }

    buildErrors(array, y, doc) {
        const arrayAux = [...array];
        
        while (true) {
            let tipoDeErro = arrayAux[0].errorType;
            doc.setFontSize(12);
            doc.text("Erros do tipo " + tipoDeErro + ":", 10, y);
            y = y + 6 <= 285 ? y + 6 : this.overflowPage(doc);

            let arrayRemovidos = [];

            doc.setFontSize(10);
            for(let i = 0; i < arrayAux.length; i++) {
                if(this.compare(tipoDeErro, arrayAux[i].errorType)){
                    doc.text("ID do erro: " + arrayAux[i].id, 10, y);
                    y = y + 6 <= 285 ? y + 6 : this.overflowPage(doc);
                    let text = "Descrição: "  + arrayAux[i].errorDescription;
                    y = this.escreveDescricaoErro(doc, text, 10, y);
                    arrayRemovidos.push(arrayAux[i]); 
                }
            }
            y = y + 6 <= 285 ? y + 6 : this.overflowPage(doc);
            for(let j = 0; j < arrayRemovidos.length; j++) {
                let index = arrayAux.indexOf(arrayRemovidos[j]);
                arrayAux.splice(index, 1);
            }

            if(arrayAux.length === 0)
                break;
        }

        return y;
    }



    layout(validationJson) {
        var doc = new jsPDF();

        var img = new Image()


        img.src = "https://media-exp1.licdn.com/dms/image/C4D0BAQGQzM4D8Y7Kbg/company-logo_200_200/0/1560166394889?e=2159024400&v=beta&t=w3DdhuuOJcQ-UsdA3s-IjZPvgVGdC9wBAF6jOuMsy2U"


        doc.addImage(img, "JPEG", 175, 5, 25, 25)

        doc.setFontSize(18)
        doc.text("Validador de arquivos", 10, 15)

        doc.setFontSize(15)
        doc.text("Data de geração do arquivo 22/10/2020", 10, 25)

        doc.line(10, 35, 200, 35)


        doc.setFontSize(18)
        doc.text("Informações gerais do arquivo:", 10, 50)
        doc.setFontSize(12)

        doc.text("Nome do arquivo: algum_nome.fat", 10, 65)
        doc.text("Tipo do arquivo: Fatura", 150, 65)

        doc.text("Data da validação: 20/20/2020", 10, 75)
        doc.text("Tamanho: 5.6 Gb", 150, 75)

        doc.text("Status: Validado", 10, 85)
        doc.text("Id: 1", 150, 85)

        doc.setFontSize(18)
        doc.text("Informações sobre a validação:", 10, 110)
        doc.setFontSize(12)

        doc.text("Validado em 20/20/2020", 10, 125)
        doc.text("Id: 1", 150, 125)
        doc.text("Tipo de validação: Validação de fatura", 10, 135)

        doc.setFontSize(18)
        doc.text("Erros:", 10, 160)
        doc.setFontSize(12)

        doc.text("Id : 1", 10, 175)
        doc.text("Tipo do erro: Erro no Header do arquivo", 10, 185)
        doc.text("Descrição do erro: Erro na data", 10, 195)
        doc.text("Identificador campo: CPF", 10, 205)
        doc.text("Valor do idenrificador: 056.954.844-11", 10, 215)

        doc.text("Id : 1", 10, 235)
        doc.text("Tipo do erro: Erro no Header do arquivo", 10, 245)
        doc.text("Descrição do erro: Erro na data", 10, 255)
        doc.text("Identificador campo: CPF", 10, 265)
        doc.text("Valor do idenrificador: 056.954.844-11", 10, 275)

        doc.addPage()
        doc.setPage(2)

        doc.text("Id : 1", 10, 15)
        doc.text("Tipo do erro: Erro no Header do arquivo", 10, 25)
        doc.text("Descrição do erro: Erro na data", 10, 35)
        doc.text("Identificador campo: CPF", 10, 45)
        doc.text("Valor do idenrificador: 056.954.844-11", 10, 55)

        // Y vai até 300
        // Fazer lógica para isso (Y começando do 15)

        doc.text("Id : 1", 10, 75)
        doc.text("Tipo do erro: Erro no Header do arquivo", 10, 85)
        doc.text("Descrição do erro: Erro na data", 10, 95)
        doc.text("Identificador campo: CPF", 10, 105)
        doc.text("Valor do idenrificador: 056.954.844-11", 10, 115)

        doc.save()
    }
}
export default CreatePdf

