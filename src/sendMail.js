const nodeMailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')
const fs = require('fs')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodeMailer.createTransport(
    sendgridTransport({
      auth: {
          api_key: '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'
      }  
    })
);

const excluirRelatorio = () => {
    try {
        fs.unlinkSync('./index.html')
        console.log('Arquivo excluido com sucesso!')
    } catch (error) {
        console.log('Deu erro na exclusão do relatorio do html')
    }
}

const envioMail = () => {
    transporter.sendMail({
        to: 'a.pissulin@gmail.com',
        from: 'pissulin.ads@gmail.com',
        subject: 'Iphones usados no olx São Paulo',
        html: ({
            path: './index.html'
        })
    })
};


/*const envioMail = () =>{
    sgMail.setApiKey(process.env.api_key);
    const msg = {
        to: 'a.pissulin@gmail.com',
            from: 'pissulin.ads@gmail.com',
            subject: 'Iphones usados no olx São Paulo',
            html: ( {path: './index.html'} )
    };
    sgMail.send(msg)
}*/
const main = async () => {
    await envioMail()
    await excluirRelatorio()
}

main()