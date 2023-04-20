const previousText = document.querySelector('#previous')
const currentText = document.querySelector('#current')
const buttons = document.querySelectorAll('#buttons button')

class Calculator {
    constructor(previousText, currentText) { // construtor do objeto calculadora que vai instancionar os valores que vão aparecer na calculadora ao serem digitados
        this.previousText = previousText // o que foi digitado antes da operação
        this.currentText = currentText // o que está sendo digitado
        this.currentOperation = "" // padrão de início vazio, pois não há nada escrito
    }

    addDigit(digit){ // adicionar um dígito na tela da calculadora
        if (digit === '.' && this.currentText.innerText.includes('.')) { // verificar se o texto que foi digitado já possui um ponto
            return // se o dígito que está sendo digitado for um ponto e já tiver um ponto no texto que foi escrito, dá um return e para a função
        }
        this.currentOperation = digit
        this.updateScreen()
    }

    processOperation(operation) { // processar todas as operações
        // checando se o 'current' está vazio -> troca de operação
        if(this.currentText.innerText === '' && operation != 'C'){
            if (this.previousText.innerText !== '') { // aqui checa se já foi guardado o previous, pois só é possível trocar de operação se já tiver o primeiro número e a operação selecionados
                this.changeOperation(operation)
            }
            return // esse return está aqui pois, se não tiver sido digitado o valor previous, não faz sentido trocar de operação
        }

        // pegando os valores 'atual' e 'anterior' (valor que fica em baixo e em cima, respectivamente)
        let operationValue
        const previous = +this.previousText.innerText.split(' ')[0]
        const current = +this.currentText.innerText

        switch(operation) {
            case '+':
                operationValue = previous + current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case '-':
                operationValue = previous - current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case '*':
                operationValue = previous * current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case '/':
                operationValue = previous / current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case 'DEL':
                this.processDelOperator()
                break
            case 'CE':
                this.processCeOperator()
                break
            case 'C':
                this.processCOperator()
                break
            case '=':
                this.processEqualOperator()
                break
            default: 
                return
        }
    }

    updateScreen( // mudar o valor da tela atualizando ela
        operationValue = null,
        operation = null,
        current = null,
        previous = null  // setando os valores iniciais como nulos, já que a calculadora começa sem nenhum valor
    ) { 
        if (operationValue === null) {
            this.currentText.innerText += this.currentOperation
        } else {
            // checagem se o valor do previous é 0. Se for, só adiciona
            if (previous === 0) {
                operationValue = current
            }
            // adicionando o valor current no previous
            this.previousText.innerText = `${operationValue} ${operation}`
            this.currentText.innerText = '' // zerando o valor do current
        }
    }

    changeOperation(operation) { // trocar a operação
        const mathOperations = ['*', '/', '+', '-'] // criando vetor com todas as operações permitidas

        if (!mathOperations.includes(operation)) { // se a operação que o usuário quer fazer não está no vetor, para a função
            return
        }
        // padrão está assim: 123 +
        this.previousText.innerText = this.previousText.innerText.slice(0, -1) + operation // retira o último caractere e acrescenta a operation
    }

    processDelOperator() { // deletar o último dígito
        this.currentText.innerText = this.currentText.innerText.slice(0, -1)
    }

    processCeOperator() { // apagar todo o currentText (valor que está sendo digitado)
        this.currentText.innerText = ''
    }

    processCOperator() { // apagar tudo (valor de cima e de baixo)
        this.currentText.innerText = ''
        this.previousText.innerText = ''
    }

    processEqualOperator() { // dar o resultado da operação
        const operation = previousText.innerText.split(' ')[1] // o split separa 132 + --> [132, +]
        this.processOperation(operation)
    }
}

const calc = new Calculator(previousText, currentText)

buttons.forEach((btn) => { // forEach porque precisa criar vários eventos, um para cada botão -> for each button
    btn.addEventListener('click', (e) => { // criação de cada evento referente ao botão específico no forEach
        const value = e.target.innerText // pegar o valor do botão
        
        if (+value >= 0 || value === '.'){ // +value é uma forma mais fácil de transformar um valor que pode ser numérico em número
            calc.addDigit(value)
        } else {
            calc.processOperation(value)
        }
    })
})