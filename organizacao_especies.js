const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Digite o caminho da pasta: ', (pasta) => {
  fs.readdir(pasta, (err, arquivos) => {
    if (err) throw err;

    let i = 0;
    const renomearProximoArquivo = (pasta, arquivos, i) => {
      if (i < arquivos.length) {
        const arquivo = arquivos[i];
        const arquivoAntigo = path.join(pasta, arquivo);
        console.log(`Renomeando arquivo ${arquivo}...`);

        rl.question(`Digite o novo nome para ${arquivo}: `, (novoNome) => {
          let nomeArquivo = novoNome.endsWith('.jpg') ? novoNome : `${novoNome}.jpg`;
          let numero = 1;
          while (fs.existsSync(path.join(pasta, nomeArquivo))) {
            nomeArquivo = `${numero}_${novoNome}.jpg`;
            numero++;
          }
          const arquivoNovo = path.join(pasta, nomeArquivo);
          fs.rename(arquivoAntigo, arquivoNovo, (err) => {
            if (err) throw err;
            console.log(`Arquivo ${arquivoAntigo} renomeado para ${arquivoNovo}`);
            renomearProximoArquivo(pasta, arquivos, i + 1);
          });
        });
      } else {
        console.log('Todos os arquivos foram renomeados.');
        rl.close();
      }
    };

    renomearProximoArquivo(pasta, arquivos, i);
  });
});
