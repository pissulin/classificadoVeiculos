/**
 *site alvo: https://sp.olx.com.br/sao-paulo-e-regiao/autos-e-pecas/carros-vans-e-utilitarios?q=celta
 nome od item: celta
 valor: RS 12.000
 data do anuncio: 12/02 às 19:18
 codigo: 716901438
 link: https://sp.olx.com.br/sao-paulo-e-regiao/celulares/iphone-se-792377949
 **/

const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const siteAlvo = 'https://sp.olx.com.br/sao-paulo-e-regiao?q=iphone'

const dados = []

const dadosBrutos = async () => {
    try {
        const res = await axios.get(siteAlvo)
        return res.data
    } catch (error) {
        console.log('Deu pau ao  extrair os daods brutos! ' + error)
    }
}

const listaLinks = async () => {
    const html = await dadosBrutos();
    const $ =  await cheerio.load(html)
    
    $('a[data-lurker-detail=list_id]').each(function(i, lnk){
        dados[i] = $(lnk).attr('href');
        
    })
  //console.log(dados)
  return dados
}

//const linkFilho = 'https://sp.olx.com.br/sao-paulo-e-regiao/celulares/iphone-se-792377949'
const coletaDados = async (pg) => {
    try {
        const res = await axios.get(pg)
        const html = res.data
        const $ = await cheerio.load(html)

        let nomeProduto = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-5.bMEQVr > h1').text()
        let valor = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-5.ezwEJi > div > div.en9h1n-0.iEJCAI > div.sc-hmzhuo.sc-1wimjbb-2.dghGmZ.sc-jTzLTM.iwtnNi > div > h2').text()
        let dataPublicacao = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-5.kjgnrw > div.h3us20-3.csYflq > span').text()
        let codigo = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-5.kjgnrw > div.h3us20-2.bdQAUC > div > span.sc-16iz3i7-0.cNMIuQ.sc-ifAKCX.fizSrB').text() 

        let descricao = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-5.cgTGW > div > div.sc-1sj3nln-0.eSLnCp > div > p > span').text().trim()

        const resultado = `
            <h1>Produto: ${nomeProduto}</h1>
            <h3>Valor: ${valor}
            <h3>${dataPublicacao}
            <h3>${codigo}
            <h3>${descricao}
            <h3>Link: <a href="${pg}">Produto</a></h3>
            <br>
            `
        gravaHtml(resultado)

    } catch (error) {
        console.log('Deu pau na extração de dados: ' + error)
    }
}


const gravaHtml = async (result) => {
    fs.writeFileSync('./index.html', result, {flag: 'a+'}, function(err){
        if(err){
            console.log('Deu pau na geração do html: ' + err)
        }
    })
};

const apresentaDados = async () => {
    const todosLinks = await listaLinks()
    todosLinks.map(function(linksFilhos){
        coletaDados(linksFilhos)
    })
};

const main = async () => {
    await apresentaDados()
}

main()