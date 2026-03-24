export function generateOrderCode() {
    const prefixo = "VLO";
  
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeros = "0123456789";
  
    let parteLetras = "";
    let parteNumeros = "";
  
    // Gera 3 letras aleatórias
    for (let i = 0; i < 3; i++) {
      parteLetras += letras.charAt(Math.floor(Math.random() * letras.length));
    }
  
    // Gera 3 números aleatórios
    for (let i = 0; i < 3; i++) {
      parteNumeros += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
  
    return `${prefixo}-${parteLetras}${parteNumeros}`;
  }