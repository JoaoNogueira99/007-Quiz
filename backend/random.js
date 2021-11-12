function geraNumerosAleatorios(n, x) {  
    let numbers = new Set()
    while(numbers.size < n) {
        numbers.add(geraAleatorio(x))
    }
    return Array.from(numbers)
}

function geraAleatorio(number) {
    const aleatorio = Math.floor(Math.random() * number)
    return aleatorio 
}

console.log(geraNumerosAleatorios(10, 20))