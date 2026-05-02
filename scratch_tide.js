fetch('https://www.hidrografico.pt/json/mare.port.list').then(r => r.text()).then(console.log).catch(console.error);
