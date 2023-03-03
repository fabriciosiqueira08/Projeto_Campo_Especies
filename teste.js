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

    // Função para criar uma pasta de família
    const criarPastaFamilia = (nomeFamilia, callback) => {
      const pastaFamilia = path.join(pasta, nomeFamilia);
      fs.mkdir(pastaFamilia, (err) => {
        if (err) throw err;
        console.log(`Pasta da família ${nomeFamilia} criada.`);
        callback(pastaFamilia);
      });
    };

    // Função para criar uma pasta de espécie
    const criarPastaEspecie = (nomeEspecie, pastaFamilia, callback) => {
      const pastaEspecie = path.join(pastaFamilia, nomeEspecie);
      fs.mkdir(pastaEspecie, (err) => {
        if (err) throw err;
        console.log(`Pasta da espécie ${nomeEspecie} criada.`);
        callback(pastaEspecie);
      });
    };

    // Função para renomear o próximo arquivo da lista
    const renomearProximoArquivo = (pasta, arquivos, i, pastaFamilia, pastaEspecie) => {
      if (i < arquivos.length) {
        const arquivo = arquivos[i];
        const arquivoAntigo = path.join(pasta, arquivo);
        console.log(`Renomeando arquivo ${arquivo}...`);

        rl.question(`Digite o nome da família: `, (nomeFamilia) => {
          criarPastaFamilia(nomeFamilia, (pastaFamilia) => {
            rl.question(`Digite o nome da espécie: `, (nomeEspecie) => {
              criarPastaEspecie(nomeEspecie, pastaFamilia, (pastaEspecie) => {
                rl.question(`Digite o novo nome para ${arquivo}: `, (novoNome) => {
                  let nomeArquivo = novoNome.endsWith('.jpg') ? novoNome : `${novoNome}.jpg`;
                  let numero = 1;
                  while (fs.existsSync(path.join(pastaEspecie, nomeArquivo))) {
                    nomeArquivo = `${numero}_${novoNome}.jpg`;
                    numero++;
                  }
                  const arquivoNovo = path.join(pastaEspecie, nomeArquivo);
                  fs.rename(arquivoAntigo, arquivoNovo, (err) => {
                    if (err) throw err;
                    console.log(`Arquivo ${arquivoAntigo} renomeado para ${arquivoNovo}`);
                    renomearProximoArquivo(pasta, arquivos, i + 1, pastaFamilia, pastaEspecie);
                  });
                });
              });
            });
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